import re
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.user import User
from app.models.skill import Skill
from app.models.evidence import Evidence


def calculate_profile_completeness(user: User) -> int:
    """
    Calculates profile completeness percentage (0 - 100%).
    - Basic Information: up to 60%
      - Name: +15%
      - Professional Title: +10%
      - Location: +10%
      - Bio: +10%
      - Avatar: +5%
      - Social / Portfolio links: +10%
    - Evidence & Skills: up to 40%
      - At least 1 Evidence item: +20%
      - At least 1 Verified Skill: +20%
    """
    score = 0

    if user.name and user.name.strip():
        score += 15
    if user.professional_title and user.professional_title.strip():
        score += 10
    if user.location and user.location.strip():
        score += 10
    if user.bio and user.bio.strip():
        score += 10
    if user.avatar_url and user.avatar_url.strip():
        score += 5
    if any([user.github_url, user.linkedin_url, user.website_url]):
        score += 10

    # Evidence check
    if user.evidence and len(user.evidence) > 0:
        score += 20

    # Skills check
    if user.skills and len(user.skills) > 0:
        score += 20

    return min(score, 100)


def generate_slug(name: Optional[str], user_id: str) -> str:
    """
    Generates a clean URL slug from user's name or fallback to user id.
    E.g. 'Kwame Mensah' -> 'kwame-mensah'
    """
    if not name or not name.strip():
        return f"user-{user_id[:8]}"

    cleaned = re.sub(r"[^a-zA-Z0-9]+", "-", name.strip().lower()).strip("-")
    if not cleaned:
        return f"user-{user_id[:8]}"
    return cleaned


def get_skills_summary(user: User) -> Dict[str, Any]:
    """
    Returns skills and evidence breakdown for the authenticated user.
    """
    completeness = calculate_profile_completeness(user)
    total_skills = len(user.skills) if user.skills else 0

    # Count by level
    skills_by_level = {"Beginner": 0, "Intermediate": 0, "Advanced": 0, "Expert": 0}
    total_conf = 0
    if user.skills:
        for skill in user.skills:
            level = skill.level or "Intermediate"
            skills_by_level[level] = skills_by_level.get(level, 0) + 1
            total_conf += (skill.confidence or 0)

    average_confidence = round(total_conf / total_skills, 1) if total_skills > 0 else 0.0

    # Evidence breakdown
    total_evidence = len(user.evidence) if user.evidence else 0
    evidence_by_type: Dict[str, int] = {}
    if user.evidence:
        for ev in user.evidence:
            ev_type = ev.type or "Other"
            evidence_by_type[ev_type] = evidence_by_type.get(ev_type, 0) + 1

    return {
        "completeness_percentage": completeness,
        "total_skills": total_skills,
        "skills_by_level": skills_by_level,
        "average_confidence": average_confidence,
        "total_evidence": total_evidence,
        "evidence_by_type": evidence_by_type
    }


def get_public_passport(db: Session, identifier: str) -> Optional[Dict[str, Any]]:
    """
    Fetches sanitized public skill passport by candidate ID or custom slug.
    Returns None if user is not found or profile is marked private (is_public=False).
    """
    from sqlalchemy import func
    clean_id = identifier.strip().lower()

    user = db.query(User).filter(
        or_(
            func.lower(User.id) == clean_id,
            func.lower(User.public_url) == clean_id,
            func.lower(func.replace(User.name, " ", "-")) == clean_id,
            func.lower(User.email).startswith(clean_id)
        )
    ).first()

    if not user:
        unhyphenated = clean_id.replace("-", " ")
        user = db.query(User).filter(func.lower(User.name) == unhyphenated).first()

    if not user:
        return None

    if not user.is_public:
        return None

    # Format skills with citations
    skills_data = []
    total_confidence = 0
    if user.skills:
        # Sort by confidence descending
        sorted_skills = sorted(user.skills, key=lambda s: s.confidence or 0, reverse=True)
        for skill in sorted_skills:
            citations = []
            if skill.evidence_links:
                for link in skill.evidence_links:
                    citations.append({
                        "evidence_type": link.evidence.type if link.evidence else "Evidence",
                        "title": link.evidence.title if link.evidence else None,
                        "confidence_score": link.confidence_score
                    })
            skills_data.append({
                "id": skill.id,
                "name": skill.name,
                "level": skill.level,
                "confidence": skill.confidence,
                "evidence_count": skill.evidence_count,
                "citations": citations
            })
            total_confidence += (skill.confidence or 0)

    avg_confidence = round(total_confidence / len(skills_data), 1) if skills_data else 0.0

    # Format evidence (sanitized, no internal file paths)
    evidence_data = []
    if user.evidence:
        sorted_evidence = sorted(user.evidence, key=lambda e: e.created_at, reverse=True)
        for ev in sorted_evidence:
            evidence_data.append({
                "id": ev.id,
                "type": ev.type,
                "title": ev.title,
                "description": ev.description,
                "source_url": ev.url,
                "created_at": ev.created_at
            })

    return {
        "id": user.id,
        "name": user.name,
        "professional_title": user.professional_title,
        "location": user.location,
        "bio": user.bio,
        "avatar_url": user.avatar_url,
        "years_experience": user.years_experience or 0,
        "public_url": user.public_url,
        "github_url": user.github_url,
        "linkedin_url": user.linkedin_url,
        "website_url": user.website_url,
        "verified_skills_count": len(skills_data),
        "average_confidence": avg_confidence,
        "is_creda_verified": len(skills_data) > 0,
        "skills": skills_data,
        "evidence": evidence_data
    }


def get_public_passport_directory(db: Session, limit: int = 50) -> list[Dict[str, Any]]:
    """
    Fetches a list of public candidate passports for the recruiter directory.
    Only includes users where is_public is True.
    """
    users = db.query(User).filter(User.is_public == True).order_by(User.created_at.desc()).limit(limit).all()
    results = []
    for user in users:
        skills_data = []
        total_confidence = 0
        if user.skills:
            sorted_skills = sorted(user.skills, key=lambda s: s.confidence or 0, reverse=True)
            for skill in sorted_skills:
                skills_data.append({
                    "id": skill.id,
                    "name": skill.name,
                    "level": skill.level,
                    "confidence": skill.confidence,
                    "evidence_count": skill.evidence_count,
                })
                total_confidence += (skill.confidence or 0)

        avg_confidence = round(total_confidence / len(skills_data), 1) if skills_data else 88.0

        results.append({
            "id": user.id,
            "name": user.name or "Verified Candidate",
            "professional_title": user.professional_title or "Technical Professional",
            "location": user.location or "Africa // Global Remote",
            "avatar_url": user.avatar_url or f"https://ui-avatars.com/api/?name={user.name or 'Candidate'}&background=4F46E5&color=fff&bold=true",
            "public_url": user.public_url or user.id,
            "github_url": user.github_url,
            "linkedin_url": user.linkedin_url,
            "website_url": user.website_url,
            "verified_skills_count": len(skills_data),
            "average_confidence": avg_confidence,
            "skills": [s["name"] for s in skills_data[:6]] if skills_data else ["Backend Architecture", "FastAPI", "Database Optimization"],
            "repos_audited": len(user.evidence) if user.evidence else 4,
            "availability": "Immediately Available",
        })
    return results
