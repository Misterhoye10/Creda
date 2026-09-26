import re
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.profile import (
    ProfileUpdateRequest,
    UserProfileResponse,
    SkillsSummaryResponse
)
from app.services.passport import (
    calculate_profile_completeness,
    get_skills_summary,
    generate_slug
)

router = APIRouter(prefix="/user", tags=["User Profile"])


def format_user_profile_response(user: User) -> UserProfileResponse:
    """Helper to assemble profile response with completeness and counts."""
    completeness = calculate_profile_completeness(user)
    total_skills = len(user.skills) if user.skills else 0
    total_evidence = len(user.evidence) if user.evidence else 0

    return UserProfileResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        professional_title=user.professional_title,
        location=user.location,
        years_experience=user.years_experience or 0,
        bio=user.bio,
        avatar_url=user.avatar_url,
        public_url=user.public_url,
        is_public=user.is_public if user.is_public is not None else True,
        github_url=user.github_url,
        linkedin_url=user.linkedin_url,
        website_url=user.website_url,
        completeness_percentage=completeness,
        total_skills=total_skills,
        total_evidence=total_evidence,
        created_at=user.created_at,
        updated_at=user.updated_at
    )


@router.get("/profile", response_model=UserProfileResponse)
def get_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get the authenticated user's private profile details,
    including completeness score and verification metrics.
    """
    return format_user_profile_response(current_user)


@router.put("/profile", response_model=UserProfileResponse)
def update_user_profile(
    profile_data: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update profile details, bio, avatar, social links, public URL slug,
    and public visibility settings.
    """
    update_data = profile_data.model_dump(exclude_unset=True)

    # Validate and normalize public_url (slug) if changed
    if "public_url" in update_data and update_data["public_url"]:
        raw_slug = update_data["public_url"].strip().lower()
        cleaned_slug = re.sub(r"[^a-z0-9-]+", "-", raw_slug).strip("-")

        if not cleaned_slug:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid public URL slug format"
            )

        # Check if already in use by another user
        existing_user = db.query(User).filter(
            User.public_url == cleaned_slug,
            User.id != current_user.id
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Public URL slug is already taken. Please choose another."
            )

        update_data["public_url"] = cleaned_slug

    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return format_user_profile_response(current_user)


@router.get("/skills-summary", response_model=SkillsSummaryResponse)
def get_user_skills_summary(
    current_user: User = Depends(get_current_user)
):
    """
    Returns an aggregated summary of the candidate's profile completeness,
    skills distributed by proficiency level, and evidence corroboration breakdown.
    """
    summary = get_skills_summary(current_user)
    return SkillsSummaryResponse(**summary)
