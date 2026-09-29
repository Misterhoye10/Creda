from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class SkillBase(BaseModel):
    name: str = Field(..., description="Name of the skill, e.g. React, Python, Docker")
    category: str = Field(default="Technical", description="Skill category, e.g. Frontend, Backend, Cloud")
    level: str = Field(default="Intermediate", description="Beginner, Intermediate, Advanced, Expert")
    confidence: int = Field(default=50, ge=0, le=100, description="Confidence score from 0 to 100")
    evidence_status: Optional[str] = Field(default="self_declared", description="'self_declared', 'moderate', 'strong'")
    assessment_score: Optional[int] = Field(default=None, description="Score from practical challenge")


class SkillUpdate(BaseModel):
    level: Optional[str] = Field(None, description="Updated skill proficiency level")
    confidence: Optional[int] = Field(None, ge=0, le=100, description="Updated confidence percentage")
    evidence_status: Optional[str] = Field(None, description="'self_declared', 'moderate', 'strong'")
    assessment_score: Optional[int] = Field(None, description="Score from practical challenge, e.g. 87%")


class EvidenceCitation(BaseModel):
    evidence_id: str
    evidence_type: str
    evidence_title: str
    confidence_score: int
    reason: Optional[str] = None


class SkillResponse(SkillBase):
    id: str
    user_id: str
    evidence_count: int = 1
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class SkillDetailResponse(SkillResponse):
    citations: List[EvidenceCitation] = Field(default_factory=list)


class SkillListResponse(BaseModel):
    total: int
    items: List[SkillResponse]


class SkillExtractResponse(BaseModel):
    message: str
    skills_extracted_count: int
    skills: List[SkillResponse]
