import json
import logging
from typing import List, Dict, Any
from openai import OpenAI
from app.core.config import settings
from app.models.evidence import Evidence

logger = logging.getLogger("creda.skill_extractor")


def get_openai_client() -> OpenAI:
    """Initialize OpenAI client."""
    return OpenAI(api_key=settings.OPENAI_API_KEY)


def build_evidence_corpus(evidence_items: List[Evidence]) -> str:
    """Format user evidence items into a structured prompt corpus for the LLM."""
    corpus_parts = []
    for idx, ev in enumerate(evidence_items, 1):
        clean_text = ev.raw_text.strip() if ev.raw_text else (ev.description or "No content")
        # Cap very long documents to avoid context overflow
        if len(clean_text) > 4000:
            clean_text = clean_text[:4000] + "\n...[truncated]"

        corpus_parts.append(
            f"--- EVIDENCE ITEM {idx} ---\n"
            f"Evidence ID: {ev.id}\n"
            f"Type: {ev.type}\n"
            f"Title: {ev.title}\n"
            f"Source: {ev.source or 'user'}\n"
            f"Details & Raw Content:\n{clean_text}\n"
        )
    return "\n\n".join(corpus_parts)


def calculate_skill_evidence_details(skill_name: str, evidence_items: List[Evidence]) -> tuple[int, str]:
    """
    Computes genuine granular evidence source count and specific proof highlights for a skill:
    - Counts distinct GitHub repositories utilizing this technology/language.
    - Counts citations in CV/Resume work experience blocks.
    - Counts verified project submissions/portfolio links mentioning the technology.
    Returns (granular_evidence_count, detailed_justification)
    """
    skill_lower = skill_name.lower().strip()
    matching_repos: List[str] = []
    has_cv_mention = False
    matching_projects: List[str] = []

    for ev in evidence_items:
        ev_type = (ev.type or "").lower()

        # 1. GitHub Evidence Inspection
        if "github" in ev_type:
            if ev.metadata_json:
                try:
                    meta = json.loads(ev.metadata_json)
                    top_repos = meta.get("top_repositories", [])
                    for repo in top_repos:
                        repo_name = repo.get("name", "repo")
                        repo_lang = (repo.get("language") or "").lower()
                        repo_languages = [l.lower() for l in repo.get("languages", [])]
                        repo_topics = [t.lower() for t in repo.get("topics", [])]
                        repo_desc = (repo.get("description") or "").lower()

                        is_match = (
                            skill_lower == repo_lang
                            or skill_lower in repo_languages
                            or skill_lower in repo_topics
                            or skill_lower in repo_name.lower()
                            or (len(skill_lower) >= 3 and f" {skill_lower} " in f" {repo_desc} ")
                        )
                        if is_match and repo_name not in matching_repos:
                            matching_repos.append(repo_name)

                    # Also check overall language breakdown
                    if not matching_repos and "languages" in meta:
                        for l in meta.get("languages", []):
                            if l.get("language", "").lower() == skill_lower and l.get("percentage", 0) > 0:
                                matching_repos.append(f"{l.get('language')} codebase ({l.get('percentage')}%)")
                except Exception:
                    pass

            if not matching_repos and ev.raw_text and skill_lower in ev.raw_text.lower():
                matching_repos.append("GitHub repository commits")

        # 2. CV / Resume Evidence Inspection
        elif "cv" in ev_type or "resume" in ev_type:
            if ev.raw_text and skill_lower in ev.raw_text.lower():
                has_cv_mention = True

        # 3. Project & Portfolio Inspection
        elif any(t in ev_type for t in ["project", "portfolio", "figma", "kaggle", "tryhackme", "external"]):
            combined_proj = f"{ev.title or ''} {ev.description or ''} {ev.raw_text or ''}".lower()
            if skill_lower in combined_proj:
                matching_projects.append(ev.title or "Project")

    # Granular source calculation:
    repo_count = len(matching_repos)
    cv_count = 1 if has_cv_mention else 0
    project_count = len(matching_projects)

    total_sources = repo_count + cv_count + project_count
    total_sources = max(1, total_sources)

    # Detailed, explainable justification
    parts = []
    if repo_count > 0:
        repo_names_str = ", ".join(matching_repos[:3]) + ("..." if len(matching_repos) > 3 else "")
        parts.append(f"{repo_count} GitHub repo{'s' if repo_count > 1 else ''} ({repo_names_str})")
    if cv_count > 0:
        parts.append("CV professional history")
    if project_count > 0:
        parts.append(f"{project_count} project submission{'s' if project_count > 1 else ''}")

    if parts:
        justification = f"Demonstrated across {total_sources} source{'s' if total_sources > 1 else ''}: {', '.join(parts)}."
    else:
        justification = f"Extracted from candidate verified records with {total_sources} corroborating source."

    return total_sources, justification


def extract_skills_from_evidence(evidence_items: List[Evidence]) -> List[Dict[str, Any]]:
    """
    Calls OpenAI to audit and extract demonstrable technical and professional skills.
    Applies multi-evidence confidence scoring algorithm.
    """
    if not evidence_items:
        return []

    evidence_corpus = build_evidence_corpus(evidence_items)

    system_prompt = """You are Creda's AI Technical Skills Auditor.
Creda verifies skills for software engineers and tech talent. Your job is to extract an authoritative list of demonstrable skills from the candidate's evidence (CVs, GitHub analyses, projects).

Rules:
1. Extract distinct, recognizable skills (e.g. 'Python', 'FastAPI', 'React', 'Docker', 'PostgreSQL', 'RESTful APIs', 'Git', 'Machine Learning').
2. Normalize names to standard industry capitalization (e.g. 'FastAPI', not 'fast-api'; 'PostgreSQL', not 'postgres').
3. Categorize each skill into ONE of: ['Frontend', 'Backend', 'Database', 'DevOps & Cloud', 'AI & Data', 'Languages', 'Tools & Architecture', 'Soft Skills'].
4. Evaluate level: ['Beginner', 'Intermediate', 'Advanced', 'Expert'].
5. Track 'evidence_ids': list of Evidence IDs from the prompt where this skill is demonstrated.
6. Provide a 'justification' (1 brief sentence detailing the proof).
7. Estimate 'base_confidence' between 40 and 75 based on depth of proof in the evidence.

Return ONLY a valid JSON object matching this schema:
{
  "skills": [
    {
      "name": "Skill Name",
      "category": "Backend",
      "level": "Advanced",
      "evidence_ids": ["evidence-uuid-1", "evidence-uuid-2"],
      "justification": "Found in 4 active GitHub repositories and listed as primary experience on CV.",
      "base_confidence": 70
    }
  ]
}
"""

    client = get_openai_client()

    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Analyze the following evidence items and extract verified skills:\n\n{evidence_corpus}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
            max_tokens=2000
        )
        content = response.choices[0].message.content
        data = json.loads(content)
        raw_skills = data.get("skills", [])
    except Exception as e:
        logger.error(f"OpenAI extraction failed: {e}")
        # If OpenAI fails or key is invalid, generate fallback skills from known evidence keywords
        return generate_keyword_skills_fallback(evidence_items)

    # Calculate multi-evidence corroboration score
    processed_skills = []
    # Map evidence IDs to their types
    evidence_type_map = {ev.id: ev.type for ev in evidence_items}

    for skill in raw_skills:
        name = skill.get("name", "").strip()
        if not name:
            continue

        category = skill.get("category", "Technical")
        level = skill.get("level", "Intermediate")
        base_confidence = skill.get("base_confidence", 50)
        cited_ids = skill.get("evidence_ids", [])

        # Filter valid IDs
        valid_evidence_ids = [eid for eid in cited_ids if eid in evidence_type_map]
        if not valid_evidence_ids and evidence_items:
            # Default to first evidence item if model failed to cite ID
            valid_evidence_ids = [evidence_items[0].id]

        # Multi-evidence calculation:
        # Check distinct evidence types that corroborated this skill (e.g. CV + GitHub)
        distinct_types = set(evidence_type_map[eid] for eid in valid_evidence_ids)

        if len(distinct_types) >= 3:
            final_confidence = min(98, base_confidence + 28)
        elif len(distinct_types) == 2:
            final_confidence = min(95, base_confidence + 18)
        elif len(valid_evidence_ids) >= 2:
            final_confidence = min(90, base_confidence + 10)
        else:
            final_confidence = max(50, min(95, base_confidence))

        granular_count, granular_justification = calculate_skill_evidence_details(name, evidence_items)
        justification = skill.get("justification") or granular_justification
        if "1 evidence sources" in justification or "1 evidence source" in justification:
            justification = granular_justification

        processed_skills.append({
            "name": name,
            "category": category,
            "level": level,
            "confidence": final_confidence,
            "evidence_count": granular_count,
            "evidence_ids": valid_evidence_ids,
            "justification": justification
        })

    return processed_skills


def generate_keyword_skills_fallback(evidence_items: List[Evidence]) -> List[Dict[str, Any]]:
    """Heuristic fallback extraction calibrated by candidate Proof-of-Work telemetry."""
    found_skills = []
    common_skills = {
        "Python": ("Languages", "Intermediate"),
        "FastAPI": ("Backend", "Intermediate"),
        "React": ("Frontend", "Intermediate"),
        "PostgreSQL": ("Database", "Intermediate"),
        "Docker": ("DevOps & Cloud", "Beginner"),
        "Git": ("Tools & Architecture", "Advanced"),
        "JavaScript": ("Languages", "Intermediate"),
        "TypeScript": ("Languages", "Intermediate"),
        "Node.js": ("Backend", "Intermediate"),
        "Go": ("Languages", "Intermediate"),
        "SQL": ("Database", "Intermediate"),
        "Kubernetes": ("DevOps & Cloud", "Intermediate"),
    }

    # Extract GitHub Proof-of-Work telemetry if present
    base_pow_score = 65
    github_languages: Dict[str, float] = {}

    for ev in evidence_items:
        if ev.metadata_json:
            try:
                meta = json.loads(ev.metadata_json)
                if "telemetry_score" in meta and isinstance(meta["telemetry_score"], int):
                    base_pow_score = meta["telemetry_score"]
                if "languages" in meta and isinstance(meta["languages"], list):
                    for l in meta["languages"]:
                        lang_name = l.get("language", "").lower()
                        pct = l.get("percentage", 0.0)
                        github_languages[lang_name] = float(pct)
            except Exception:
                pass

    combined_text = " ".join([ev.raw_text or "" for ev in evidence_items]).lower()

    for skill_name, (cat, default_level) in common_skills.items():
        if skill_name.lower() in combined_text:
            matching_ids = [ev.id for ev in evidence_items if skill_name.lower() in (ev.raw_text or "").lower()]
            
            # Dynamic confidence calibrated to candidate's real Proof-of-Work footprint
            lang_pct = github_languages.get(skill_name.lower(), 0.0)
            if lang_pct >= 40.0:
                skill_conf = min(98, base_pow_score + 4)
                level = "Advanced" if base_pow_score >= 80 else "Intermediate"
            elif lang_pct >= 15.0:
                skill_conf = min(95, base_pow_score + 1)
                level = "Intermediate"
            elif lang_pct > 0.0:
                skill_conf = min(92, base_pow_score)
                level = default_level
            else:
                # Incidental skill cited in code/project description
                skill_conf = max(50, min(88, base_pow_score - 5))
                level = default_level

            # Multi-evidence corroboration bonus (e.g. CV + GitHub)
            distinct_types = set(ev.type for ev in evidence_items if ev.id in matching_ids)
            if len(distinct_types) >= 2:
                skill_conf = min(98, skill_conf + 10)

            granular_count, granular_justification = calculate_skill_evidence_details(skill_name, evidence_items)
            found_skills.append({
                "name": skill_name,
                "category": cat,
                "level": level,
                "confidence": skill_conf,
                "evidence_count": granular_count,
                "evidence_ids": matching_ids if matching_ids else [evidence_items[0].id],
                "justification": granular_justification
            })

    return found_skills
