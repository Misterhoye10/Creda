from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class JobMatchRequest(BaseModel):
    job_title: str = Field(..., min_length=2, max_length=255, description="e.g. Senior Backend Engineer")
    job_description: str = Field(..., min_length=10, description="Full job description text with requirements")


class SkillMatchItem(BaseModel):
    name: str
    category: Optional[str] = "Technical"
    user_level: Optional[str] = None
    required_level: Optional[str] = "Intermediate"
    confidence: Optional[int] = None
    status: str = "match"  # 'match', 'partial', 'missing'
    importance: str = "required"  # 'required', 'preferred'


class JobMatchResponse(BaseModel):
    id: str
    user_id: str
    job_title: str
    job_description: str
    match_percentage: int
    matching_skills: List[SkillMatchItem] = Field(default_factory=list)
    missing_skills: List[SkillMatchItem] = Field(default_factory=list)
    recommendations: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class JobMatchListResponse(BaseModel):
    total: int
    items: List[JobMatchResponse]
