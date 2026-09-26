import json
import logging
from typing import List, Dict, Any
from openai import OpenAI
from app.core.config import settings
from app.models.skill import Skill

logger = logging.getLogger("creda.job_matcher")


def get_openai_client() -> OpenAI:
    """Initialize OpenAI client."""
    return OpenAI(api_key=settings.OPENAI_API_KEY)


def match_job_against_skills(
    job_title: str,
    job_description: str,
    user_skills: List[Skill]
) -> Dict[str, Any]:
    """
    Compares candidate's verified skills against target job description.
    Uses OpenAI to analyze required vs nice-to-have skills, compute match percentage,
    identify skill gaps, and provide tailored portfolio recommendations.
    """
    skills_context = "\n".join([
        f"- {s.name} (Category: {s.category}, Level: {s.level}, Confidence: {s.confidence}%, Evidence count: {s.evidence_count})"
        for s in user_skills
    ]) if user_skills else "No verified skills recorded yet."

    system_prompt = """You are Creda's AI Technical Recruiter and Career Advisor.
Your mission is to objectively compare a tech candidate's verified skills against a job description.

Input given:
1. Job Title & Description
2. Candidate's Verified Skills (with verified confidence percentages and levels)

Tasks:
1. Extract key technical and soft skill requirements from the job description.
2. Differentiate between 'required' (must-have) and 'preferred' (nice-to-have) requirements.
3. Compare against candidate's verified skills:
   - Identify 'matching_skills': candidate has verified evidence.
   - Identify 'missing_skills': required/preferred skills candidate lacks proof for.
4. Calculate 'match_percentage' (0–100):
   - Weigh core required skills heavily (70% weight) vs preferred skills (30% weight).
   - Higher candidate confidence scores increase the match weight.
5. Provide 'recommendations':
   - 2-3 specific, actionable steps or portfolio project ideas tailored for African tech talent to close the detected gaps and qualify for this role.

Return ONLY a valid JSON object matching this schema:
{
  "match_percentage": 78,
  "matching_skills": [
    {
      "name": "Python",
      "category": "Languages",
      "user_level": "Advanced",
      "required_level": "Intermediate",
      "confidence": 92,
      "status": "match",
      "importance": "required"
    }
  ],
  "missing_skills": [
    {
      "name": "AWS",
      "category": "DevOps & Cloud",
      "user_level": null,
      "required_level": "Intermediate",
      "confidence": null,
      "status": "missing",
      "importance": "required"
    }
  ],
  "recommendations": "To become a 90%+ match: 1) Deploy a Dockerized container on AWS ECS to demonstrate cloud infrastructure knowledge. 2) Add a portfolio project demonstrating message queues."
}
"""

    client = get_openai_client()

    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": f"JOB TITLE: {job_title}\n\nJOB DESCRIPTION:\n{job_description}\n\nCANDIDATE'S VERIFIED SKILLS:\n{skills_context}"
                }
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
            max_tokens=2000
        )
        content = response.choices[0].message.content
        data = json.loads(content)
        return {
            "match_percentage": int(data.get("match_percentage", 50)),
            "matching_skills": data.get("matching_skills", []),
            "missing_skills": data.get("missing_skills", []),
            "recommendations": data.get("recommendations", "Build a targeted project to demonstrate missing skills.")
        }
    except Exception as e:
        logger.error(f"OpenAI job matching failed: {e}")
        return fallback_keyword_matching(job_title, job_description, user_skills)


def fallback_keyword_matching(
    job_title: str,
    job_description: str,
    user_skills: List[Skill]
) -> Dict[str, Any]:
    """Deterministic fallback matcher if external LLM API is unavailable."""
    matching_skills = []
    missing_skills = []

    desc_lower = job_description.lower()
    matched_count = 0

    for s in user_skills:
        if s.name.lower() in desc_lower:
            matching_skills.append({
                "name": s.name,
                "category": s.category,
                "user_level": s.level,
                "required_level": "Intermediate",
                "confidence": s.confidence,
                "status": "match",
                "importance": "required"
            })
            matched_count += 1

    common_requirements = ["Docker", "Kubernetes", "AWS", "CI/CD", "Redis", "GraphQL", "TypeScript", "System Design"]
    for req in common_requirements:
        if req.lower() in desc_lower and not any(s.name.lower() == req.lower() for s in user_skills):
            missing_skills.append({
                "name": req,
                "category": "Technical",
                "user_level": None,
                "required_level": "Intermediate",
                "confidence": None,
                "status": "missing",
                "importance": "required"
            })

    total_reqs = max(1, matched_count + len(missing_skills))
    pct = min(100, int((matched_count / total_reqs) * 100))

    recs = (
        f"Strengthen your application by adding evidence for: "
        f"{', '.join([m['name'] for m in missing_skills[:3]]) if missing_skills else 'advanced architecture'}."
    )

    return {
        "match_percentage": pct,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "recommendations": recs
    }
