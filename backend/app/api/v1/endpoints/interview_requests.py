import logging
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.interview_request import InterviewRequest
from app.api.v1.endpoints.auth import get_current_user

logger = logging.getLogger("creda.interview_requests")

router = APIRouter(tags=["Interview Requests & Hiring Connections"])


class CreateInterviewRequestPayload(BaseModel):
    talent_id: str
    company_name: str
    role_title: str
    work_type: Optional[str] = "Full-Time Remote"
    compensation: Optional[str] = None
    message: str


class RespondInterviewRequestPayload(BaseModel):
    action: str  # 'accept' | 'decline'
    response_note: Optional[str] = None


class InterviewRequestResponse(BaseModel):
    id: str
    recruiter_id: str
    talent_id: str
    talent_name: Optional[str] = None
    talent_title: Optional[str] = None
    talent_avatar: Optional[str] = None
    talent_location: Optional[str] = None
    talent_slug: Optional[str] = None
    talent_email: Optional[str] = None
    company_name: str
    role_title: str
    work_type: Optional[str]
    compensation: Optional[str]
    message: str
    status: str
    talent_response_note: Optional[str]
    created_at: datetime


@router.post("/recruiter/requests", status_code=status.HTTP_201_CREATED)
def create_interview_request(
    payload: CreateInterviewRequestPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Hiring team sends a direct interview request to a talent.
    Saves to database to close the loop.
    """
    talent = db.query(User).filter(User.id == payload.talent_id).first()
    if not talent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Talent not found."
        )

    # Check for existing pending request
    existing = (
        db.query(InterviewRequest)
        .filter(
            InterviewRequest.recruiter_id == current_user.id,
            InterviewRequest.talent_id == talent.id,
            InterviewRequest.status == "pending"
        )
        .first()
    )
    if existing:
        return {
            "message": "Interview request already pending for this candidate.",
            "request_id": existing.id,
            "status": existing.status,
        }

    request = InterviewRequest(
        recruiter_id=current_user.id,
        talent_id=talent.id,
        company_name=payload.company_name or current_user.company_name or "Hiring Team",
        role_title=payload.role_title,
        work_type=payload.work_type,
        compensation=payload.compensation,
        message=payload.message,
        status="pending",
    )
    db.add(request)
    db.commit()
    db.refresh(request)

    return {
        "message": f"Direct interview request sent to {talent.name or 'candidate'}.",
        "request_id": request.id,
        "status": request.status,
    }


@router.get("/recruiter/requests")
def get_recruiter_sent_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List all interview requests sent by this recruiter with live response status.
    """
    requests = (
        db.query(InterviewRequest)
        .filter(InterviewRequest.recruiter_id == current_user.id)
        .order_by(InterviewRequest.created_at.desc())
        .all()
    )

    out = []
    for r in requests:
        talent = db.query(User).filter(User.id == r.talent_id).first()
        out.append({
            "id": r.id,
            "recruiter_id": r.recruiter_id,
            "talent_id": r.talent_id,
            "talent_name": talent.name if talent else "Candidate",
            "talent_title": talent.professional_title if talent else "Technical Professional",
            "talent_avatar": talent.avatar_url if talent else None,
            "talent_location": talent.location if talent else "Africa",
            "talent_slug": talent.public_url if talent else talent.id if talent else "",
            # Only expose private email once accepted!
            "talent_email": talent.email if (talent and r.status == "accepted") else None,
            "company_name": r.company_name,
            "role_title": r.role_title,
            "work_type": r.work_type,
            "compensation": r.compensation,
            "message": r.message,
            "status": r.status,
            "talent_response_note": r.talent_response_note,
            "created_at": r.created_at,
        })
    return out


@router.get("/talent/requests")
def get_talent_received_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List all incoming interview offers and connection requests received by the candidate.
    """
    requests = (
        db.query(InterviewRequest)
        .filter(InterviewRequest.talent_id == current_user.id)
        .order_by(InterviewRequest.created_at.desc())
        .all()
    )

    out = []
    for r in requests:
        recruiter = db.query(User).filter(User.id == r.recruiter_id).first()
        out.append({
            "id": r.id,
            "recruiter_id": r.recruiter_id,
            "recruiter_name": recruiter.name if recruiter else "Hiring Manager",
            "recruiter_role": recruiter.hiring_role if recruiter else "Recruiter",
            "company_name": r.company_name,
            "company_website": recruiter.company_website if recruiter else None,
            "role_title": r.role_title,
            "work_type": r.work_type,
            "compensation": r.compensation,
            "message": r.message,
            "status": r.status,
            "talent_response_note": r.talent_response_note,
            "created_at": r.created_at,
        })
    return out


@router.post("/talent/requests/{request_id}/respond")
def respond_to_interview_request(
    request_id: str,
    payload: RespondInterviewRequestPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Tech Talent responds (accept / decline) to an incoming interview request.
    Closes the loop: Talent responds!
    """
    req = (
        db.query(InterviewRequest)
        .filter(InterviewRequest.id == request_id, InterviewRequest.talent_id == current_user.id)
        .first()
    )
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview request not found."
        )

    new_status = "accepted" if payload.action.lower() == "accept" else "declined"
    req.status = new_status
    if payload.response_note:
        req.talent_response_note = payload.response_note
    req.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(req)

    return {
        "message": f"Successfully {new_status} interview request from {req.company_name}.",
        "request_id": req.id,
        "status": req.status,
        "talent_response_note": req.talent_response_note,
    }
