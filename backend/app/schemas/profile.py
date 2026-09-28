from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    professional_title: Optional[str] = None
    location: Optional[str] = None
    years_experience: Optional[int] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    public_url: Optional[str] = None
    is_public: Optional[bool] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    website_url: Optional[str] = None

    @field_validator("github_url", "linkedin_url", "website_url", mode="before")
    @classmethod
    def validate_safe_url(cls, v: Optional[str]) -> Optional[str]:
        if not v or not isinstance(v, str) or not v.strip():
            return None
        cleaned = v.strip()
        if not (cleaned.startswith("http://") or cleaned.startswith("https://")):
            raise ValueError("URL must begin with http:// or https://")
        return cleaned


class UserProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    name: Optional[str] = None
    professional_title: Optional[str] = None
    location: Optional[str] = None
    years_experience: Optional[int] = 0
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    public_url: Optional[str] = None
    is_public: bool = True
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    website_url: Optional[str] = None
    completeness_percentage: int = 0
    total_skills: int = 0
    total_evidence: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class PublicSkillCitation(BaseModel):
    evidence_type: str
    title: Optional[str] = None
    confidence_score: Optional[int] = None


class PublicSkillItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    level: str
    confidence: int
    evidence_count: int
    citations: List[PublicSkillCitation] = []


class PublicEvidenceItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    type: str
    title: Optional[str] = None
    description: Optional[str] = None
    source_url: Optional[str] = None
    created_at: Optional[datetime] = None


class SkillPassportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: Optional[str] = None
    professional_title: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    years_experience: Optional[int] = 0
    public_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    website_url: Optional[str] = None
    verified_skills_count: int = 0
    average_confidence: float = 0.0
    is_creda_verified: bool = True
    skills: List[PublicSkillItem] = []
    evidence: List[PublicEvidenceItem] = []


class SkillsSummaryResponse(BaseModel):
    completeness_percentage: int = Field(..., ge=0, le=100)
    total_skills: int
    skills_by_level: Dict[str, int]
    average_confidence: float
    total_evidence: int
    evidence_by_type: Dict[str, int]
