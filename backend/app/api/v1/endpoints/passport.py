from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.profile import SkillPassportResponse
from app.services.passport import get_public_passport

router = APIRouter(prefix="/passport", tags=["Skill Passport"])


@router.get("/{identifier}", response_model=SkillPassportResponse)
def get_public_skill_passport(
    identifier: str,
    db: Session = Depends(get_db)
):
    """
    Public Skill Passport view.
    Recruiters, hiring managers, and clients can view verified skills,
    confidence ratings, and project evidence without logging in.

    Returns 404 if the user does not exist or has set their profile to private.
    """
    passport_data = get_public_passport(db=db, identifier=identifier)

    if not passport_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill Passport not found or profile is set to private."
        )

    return SkillPassportResponse(**passport_data)
