from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ProjectCreateRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=255, description="Project name")
    description: Optional[str] = Field(None, description="What the project does and your role")
    technologies: List[str] = Field(default_factory=list, description="Technologies/tools used, e.g. ['React', 'FastAPI']")
    github_url: Optional[str] = Field(None, description="GitHub repository URL")
    live_url: Optional[str] = Field(None, description="Live deployment or demo URL")


class GitHubConnectRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=100, description="GitHub username")
    token: Optional[str] = Field(None, description="Optional GitHub Personal Access Token for private repo auditing")


class EvidenceResponse(BaseModel):
    id: str
    user_id: str
    type: str
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    source: Optional[str] = None
    file_url: Optional[str] = None
    raw_text: Optional[str] = None
    metadata_json: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class EvidenceListResponse(BaseModel):
    total: int
    items: List[EvidenceResponse]
