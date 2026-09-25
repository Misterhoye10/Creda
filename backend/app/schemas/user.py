from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict, Field


class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    professional_title: Optional[str] = None
    location: Optional[str] = None
    years_experience: Optional[int] = 0
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    public_url: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")


class UserUpdate(BaseModel):
    name: Optional[str] = None
    professional_title: Optional[str] = None
    location: Optional[str] = None
    years_experience: Optional[int] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    public_url: Optional[str] = None


class UserResponse(UserBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
