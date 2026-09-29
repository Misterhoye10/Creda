from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.schemas.user import UserResponse


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    name: Optional[str] = Field(None, description="Full name of the user")
    account_type: Optional[str] = Field("talent", description="'talent' or 'recruiter'")
    professional_title: Optional[str] = Field(None, description="e.g. Full Stack Developer, Data Scientist")
    location: Optional[str] = Field(None, description="e.g. Lagos, Nigeria")
    country: Optional[str] = Field(None, description="e.g. Nigeria")
    city: Optional[str] = Field(None, description="e.g. Lagos")
    primary_field: Optional[str] = Field("software", description="e.g. software, design, security, data, devops")
    years_experience: Optional[int] = Field(0, description="Years of professional experience")
    availability: Optional[str] = Field("available_now", description="'available_now', 'open_to_offers', 'not_looking'")
    work_preferences: Optional[str] = Field(None, description="e.g. Remote, Hybrid")

    # Recruiter fields
    company_name: Optional[str] = Field(None, description="Company name for hiring teams")
    company_website: Optional[str] = Field(None, description="Company website URL")
    hiring_role: Optional[str] = Field(None, description="e.g. Head of Talent Acquisition")
    team_size: Optional[str] = Field(None, description="e.g. 11-50")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None


class MessageResponse(BaseModel):
    message: str
