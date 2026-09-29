from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.evidence import Evidence
from app.models.skill import Skill, SkillEvidence
from app.schemas.skill import (
    SkillUpdate,
    SkillResponse,
    SkillDetailResponse,
    SkillListResponse,
    SkillExtractResponse,
    EvidenceCitation
)
from app.schemas.auth import MessageResponse
from app.services.skill_extractor import extract_skills_from_evidence

router = APIRouter(prefix="/skills", tags=["Skill Extraction & Management"])


@router.post(
    "/extract",
    response_model=SkillExtractResponse,
    summary="Trigger AI Skill Extraction",
    description="Audits all candidate evidence (CV, GitHub, Projects) using OpenAI to discover, categorize, and score skills."
)
def extract_user_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    evidence_items = db.query(Evidence).filter(
        Evidence.user_id == current_user.id
    ).all()

    if not evidence_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No evidence found for this user. Please upload a CV, connect your GitHub, or add a project first."
        )

    # Call AI Extraction Engine
    extracted_data = extract_skills_from_evidence(evidence_items)

    saved_skills: List[Skill] = []

    for item in extracted_data:
        skill_name = item["name"].strip()
        existing_skill = db.query(Skill).filter(
            Skill.user_id == current_user.id,
            func.lower(Skill.name) == skill_name.lower()
        ).first()

        ev_count = item.get("evidence_count", len(item["evidence_ids"]))
        ev_status = "strong" if ev_count >= 2 and item["confidence"] >= 80 else ("moderate" if ev_count >= 1 else "self_declared")

        if existing_skill:
            # Update existing skill
            existing_skill.level = item["level"]
            existing_skill.category = item["category"]
            existing_skill.confidence = max(existing_skill.confidence, item["confidence"])
            existing_skill.evidence_count = max(existing_skill.evidence_count or 1, ev_count)
            if not existing_skill.evidence_status or existing_skill.evidence_status == "self_declared":
                existing_skill.evidence_status = ev_status
            skill_obj = existing_skill
        else:
            # Create new skill
            skill_obj = Skill(
                user_id=current_user.id,
                name=skill_name,
                category=item["category"],
                level=item["level"],
                confidence=item["confidence"],
                evidence_count=ev_count,
                evidence_status=ev_status
            )
            db.add(skill_obj)
            db.flush()

        # Link evidence items via SkillEvidence
        for ev_id in item["evidence_ids"]:
            existing_link = db.query(SkillEvidence).filter(
                SkillEvidence.skill_id == skill_obj.id,
                SkillEvidence.evidence_id == ev_id
            ).first()

            if not existing_link:
                link = SkillEvidence(
                    skill_id=skill_obj.id,
                    evidence_id=ev_id,
                    confidence_score=item["confidence"],
                    reason=item.get("justification")
                )
                db.add(link)

        saved_skills.append(skill_obj)

    db.commit()
    for s in saved_skills:
        db.refresh(s)

    # Sort descending by confidence
    saved_skills.sort(key=lambda s: s.confidence, reverse=True)

    return SkillExtractResponse(
        message=f"Successfully extracted and verified {len(saved_skills)} skills.",
        skills_extracted_count=len(saved_skills),
        skills=[SkillResponse.model_validate(s) for s in saved_skills]
    )


@router.get(
    "",
    response_model=SkillListResponse,
    summary="List Verified Skills",
    description="Returns all verified skills for the authenticated candidate, sorted by confidence descending."
)
def get_user_skills(
    category: Optional[str] = Query(None, description="Filter by skill category (e.g. 'Frontend', 'Backend', 'Database')"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Skill).filter(Skill.user_id == current_user.id)
    if category:
        query = query.filter(func.lower(Skill.category) == category.lower())

    skills = query.order_by(Skill.confidence.desc()).all()

    return SkillListResponse(
        total=len(skills),
        items=[SkillResponse.model_validate(s) for s in skills]
    )


@router.get(
    "/{skill_id}",
    response_model=SkillDetailResponse,
    summary="Get Skill Details & Citations",
    description="Returns a skill with the exact evidence pieces (CV, GitHub repos, Projects) that verified it."
)
def get_skill_detail(
    skill_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    skill = db.query(Skill).filter(
        Skill.id == skill_id,
        Skill.user_id == current_user.id
    ).first()

    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found."
        )

    # Gather evidence citations
    citations = []
    for link in skill.evidence_links:
        ev = db.query(Evidence).filter(Evidence.id == link.evidence_id).first()
        if ev:
            citations.append(EvidenceCitation(
                evidence_id=ev.id,
                evidence_type=ev.type,
                evidence_title=ev.title,
                confidence_score=link.confidence_score or skill.confidence,
                reason=link.reason
            ))

    response_data = SkillResponse.model_validate(skill).model_dump()
    response_data["citations"] = citations

    return SkillDetailResponse(**response_data)


@router.put(
    "/{skill_id}",
    response_model=SkillResponse,
    summary="Update Skill Level",
    description="Manually adjust a skill's proficiency level or confidence."
)
def update_skill(
    skill_id: str,
    data: SkillUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    skill = db.query(Skill).filter(
        Skill.id == skill_id,
        Skill.user_id == current_user.id
    ).first()

    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found."
        )

    if data.level is not None:
        skill.level = data.level
    if data.confidence is not None:
        skill.confidence = data.confidence

    db.commit()
    db.refresh(skill)

    return SkillResponse.model_validate(skill)


@router.delete(
    "/{skill_id}",
    response_model=MessageResponse,
    summary="Delete Skill",
    description="Removes a skill from the candidate's profile."
)
def delete_skill(
    skill_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    skill = db.query(Skill).filter(
        Skill.id == skill_id,
        Skill.user_id == current_user.id
    ).first()

    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found."
        )

    db.delete(skill)
    db.commit()

    return MessageResponse(message="Skill deleted successfully.")
