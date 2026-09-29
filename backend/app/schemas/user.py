from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict, Field


class UserBase(BaseModel):
    email: EmailStr
    account_type: Optional[str] = "talent"
    name: Optional[str] = None
    professional_title: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    primary_field: Optional[str] = "software"
    years_experience: Optional[int] = 0
    availability: Optional[str] = "available_now"
    available_from: Optional[str] = None
    work_preferences: Optional[str] = None
    visibility: Optional[str] = "discoverable"
    evidence_visibility: Optional[str] = "public"
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    public_url: Optional[str] = None
    is_public: Optional[bool] = True
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    website_url: Optional[str] = None

    # Hiring fields
    company_name: Optional[str] = None
    company_website: Optional[str] = None
    company_logo: Optional[str] = None
    hiring_role: Optional[str] = None
    team_size: Optional[str] = None
    verification_status: Optional[str] = "verified"


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")


class UserUpdate(BaseModel):
    name: Optional[str] = None
    professional_title: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    primary_field: Optional[str] = None
    years_experience: Optional[int] = None
    availability: Optional[str] = None
    available_from: Optional[str] = None
    work_preferences: Optional[str] = None
    visibility: Optional[str] = None
    evidence_visibility: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    public_url: Optional[str] = None
    is_public: Optional[bool] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    website_url: Optional[str] = None

    # Hiring fields
    company_name: Optional[str] = None
    company_website: Optional[str] = None
    company_logo: Optional[str] = None
    hiring_role: Optional[str] = None
    team_size: Optional[str] = None


class UserResponse(UserBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
