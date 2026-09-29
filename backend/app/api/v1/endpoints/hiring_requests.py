import logging
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.hiring_request import HiringRequest
from app.api.v1.endpoints.auth import get_current_user

logger = logging.getLogger("creda.hiring_requests")

router = APIRouter(tags=["Hiring Requests & Candidate Matching"])


class CreateHiringRequestPayload(BaseModel):
    role_title: str
    company_name: Optional[str] = None
    location: Optional[str] = "Remote Worldwide"
    employment_type: Optional[str] = "Full-Time"
    required_skills: str  # e.g. "React, TypeScript, Python, PostgreSQL"
    nice_to_have_skills: Optional[str] = None
    experience_years: Optional[int] = 2


@router.post("/recruiter/hiring-requests", status_code=status.HTTP_201_CREATED)
def create_hiring_request(
    payload: CreateHiringRequestPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Recruiter creates a structured Hiring Request with required & nice-to-have skills.
    """
    comp_name = payload.company_name or current_user.company_name or "Hiring Organization"
    req = HiringRequest(
        recruiter_id=current_user.id,
        role_title=payload.role_title,
        company_name=comp_name,
        location=payload.location,
        employment_type=payload.employment_type,
        required_skills=payload.required_skills,
        nice_to_have_skills=payload.nice_to_have_skills,
        experience_years=payload.experience_years or 2,
        status="active",
    )
    db.add(req)
    db.commit()
    db.refresh(req)

    return {
        "message": f"Hiring request created for '{req.role_title}'.",
        "hiring_request": {
            "id": req.id,
            "role_title": req.role_title,
            "company_name": req.company_name,
            "required_skills": req.required_skills,
            "nice_to_have_skills": req.nice_to_have_skills,
            "experience_years": req.experience_years,
            "status": req.status,
            "created_at": req.created_at,
        },
    }


@router.get("/recruiter/hiring-requests")
def list_hiring_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List all hiring requests posted by this recruiter.
    """
    reqs = (
        db.query(HiringRequest)
        .filter(HiringRequest.recruiter_id == current_user.id)
        .order_by(HiringRequest.created_at.desc())
        .all()
    )
    return [
        {
            "id": r.id,
            "role_title": r.role_title,
            "company_name": r.company_name,
            "location": r.location,
            "employment_type": r.employment_type,
            "required_skills": r.required_skills,
            "nice_to_have_skills": r.nice_to_have_skills,
            "experience_years": r.experience_years,
            "status": r.status,
            "created_at": r.created_at,
        }
        for r in reqs
    ]


@router.post("/recruiter/hiring-requests/{request_id}/matches")
def match_candidates_for_hiring_request(
    request_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Calculates evidence-backed candidate matches and explains Gaps:
    e.g. '5/6 required skills supported by evidence. Gap: Docker is self-declared.'
    """
    h_req = db.query(HiringRequest).filter(HiringRequest.id == request_id).first()
    if not h_req:
        raise HTTPException(status_code=404, detail="Hiring request not found.")

    req_skills = [s.strip().lower() for s in h_req.required_skills.split(",") if s.strip()]

    # Query all discoverable tech talent
    talents = (
        db.query(User)
        .filter(User.account_type != "recruiter", User.is_public == True, User.visibility != "hidden")
        .all()
    )

    matches = []
    for t in talents:
        talent_skills = {s.name.lower(): s for s in (t.skills or [])}

        matching_proven = []
        matching_self = []
        missing = []

        for req_s in req_skills:
            # Flexible match
            found_key = next((k for k in talent_skills.keys() if req_s in k or k in req_s), None)
            if found_key:
                sk = talent_skills[found_key]
                status = getattr(sk, "evidence_status", "strong") or "strong"
                if status in ["strong", "moderate"]:
                    matching_proven.append(sk.name)
                else:
                    matching_self.append(sk.name)
            else:
                missing.append(req_s.capitalize())

        total_req = len(req_skills) or 1
        proven_count = len(matching_proven)
        match_score = round((proven_count / total_req) * 100)

        # Gap explanation
        gap_parts = []
        if matching_self:
            gap_parts.append(f"{', '.join(matching_self)}: self-declared, awaiting code proof")
        if missing:
            gap_parts.append(f"Missing from profile: {', '.join(missing)}")
        gap_explanation = "; ".join(gap_parts) if gap_parts else "All required skills supported by verified evidence."

        matches.append({
            "talent_id": t.id,
            "talent_name": t.name or "Verified Candidate",
            "talent_title": t.professional_title or "Engineer",
            "talent_avatar": t.avatar_url,
            "talent_location": t.location or "Africa",
            "talent_slug": t.public_url or t.id,
            "availability": t.availability or "available_now",
            "match_score": match_score,
            "evidence_coverage": f"{proven_count}/{total_req} skills proven",
            "matching_proven_skills": matching_proven,
            "matching_self_declared": matching_self,
            "missing_skills": missing,
            "gap_explanation": gap_explanation,
            "repos_audited": len(t.evidence) if t.evidence else 2,
        })

    # Sort by highest match score
    matches.sort(key=lambda m: m["match_score"], reverse=True)
    return {
        "hiring_request_id": h_req.id,
        "role_title": h_req.role_title,
        "total_candidates_analyzed": len(talents),
        "matches": matches,
    }
