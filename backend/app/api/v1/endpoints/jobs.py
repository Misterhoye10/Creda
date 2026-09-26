import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.skill import Skill
from app.models.job import JobMatch
from app.schemas.job import (
    JobMatchRequest,
    JobMatchResponse,
    JobMatchListResponse,
    SkillMatchItem
)
from app.schemas.auth import MessageResponse
from app.services.job_matcher import match_job_against_skills

router = APIRouter(prefix="/jobs", tags=["Job Matching & Gap Analysis"])


def format_job_match_response(match: JobMatch) -> JobMatchResponse:
    """Helper to deserialize stored JSON strings into structured response objects."""
    try:
        matching = [SkillMatchItem(**item) for item in json.loads(match.matching_skills or "[]")]
    except Exception:
        matching = []

    try:
        missing = [SkillMatchItem(**item) for item in json.loads(match.missing_skills or "[]")]
    except Exception:
        missing = []

    return JobMatchResponse(
        id=match.id,
        user_id=match.user_id,
        job_title=match.job_title,
        job_description=match.job_description,
        match_percentage=match.match_percentage,
        matching_skills=matching,
        missing_skills=missing,
        recommendations=match.recommendations,
        created_at=match.created_at
    )


@router.post(
    "/match",
    response_model=JobMatchResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Match Job Description Against Skills",
    description="Compares a target job description against candidate's verified skills, calculates match %, identifies missing skills, and suggests improvement paths."
)
def match_job(
    data: JobMatchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_skills = db.query(Skill).filter(Skill.user_id == current_user.id).all()

    # Call Job Matcher Service
    analysis = match_job_against_skills(
        job_title=data.job_title,
        job_description=data.job_description,
        user_skills=user_skills
    )

    match_record = JobMatch(
        user_id=current_user.id,
        job_title=data.job_title,
        job_description=data.job_description,
        match_percentage=analysis["match_percentage"],
        matching_skills=json.dumps(analysis["matching_skills"]),
        missing_skills=json.dumps(analysis["missing_skills"]),
        recommendations=analysis["recommendations"]
    )
    db.add(match_record)
    db.commit()
    db.refresh(match_record)

    return format_job_match_response(match_record)


@router.get(
    "/matches",
    response_model=JobMatchListResponse,
    summary="List Saved Job Matches",
    description="Retrieves all past job match reports for the authenticated candidate."
)
def list_job_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    matches = db.query(JobMatch).filter(
        JobMatch.user_id == current_user.id
    ).order_by(JobMatch.created_at.desc()).all()

    return JobMatchListResponse(
        total=len(matches),
        items=[format_job_match_response(m) for m in matches]
    )


@router.get(
    "/matches/{match_id}",
    response_model=JobMatchResponse,
    summary="Get Single Job Match Report",
    description="Returns detailed breakdown and recommendations of a specific past job match report."
)
def get_job_match(
    match_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    match = db.query(JobMatch).filter(
        JobMatch.id == match_id,
        JobMatch.user_id == current_user.id
    ).first()

    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job match report not found."
        )

    return format_job_match_response(match)


@router.delete(
    "/matches/{match_id}",
    response_model=MessageResponse,
    summary="Delete Job Match Report",
    description="Deletes a saved job match report."
)
def delete_job_match(
    match_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    match = db.query(JobMatch).filter(
        JobMatch.id == match_id,
        JobMatch.user_id == current_user.id
    ).first()

    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job match report not found."
        )

    db.delete(match)
    db.commit()

    return MessageResponse(message="Job match report deleted successfully.")
