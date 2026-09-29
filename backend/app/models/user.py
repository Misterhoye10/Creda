import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True
    )
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    account_type = Column(String(50), default="talent", nullable=False)  # 'talent' | 'recruiter'
    name = Column(String(255), nullable=True)
    professional_title = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)

    # Granular Location & Preferences
    country = Column(String(100), nullable=True)  # e.g. "Nigeria", "Kenya", "Ghana"
    city = Column(String(100), nullable=True)     # e.g. "Lagos", "Nairobi", "Accra"
    primary_field = Column(String(100), default="software", nullable=True) # 'software', 'design', 'security', 'data', 'devops', 'creative3d'
    years_experience = Column(Integer, default=0, nullable=True)
    availability = Column(String(50), default="available_now", nullable=True)  # 'available_now', 'open_to_offers', 'not_looking'
    available_from = Column(String(100), nullable=True)
    work_preferences = Column(Text, nullable=True)  # e.g. "Remote, Hybrid"
    visibility = Column(String(50), default="discoverable", nullable=True)  # 'discoverable', 'hidden'
    evidence_visibility = Column(String(50), default="public", nullable=True)  # 'public', 'hiring_teams_only', 'private'

    bio = Column(Text, nullable=True)
    avatar_url = Column(String(255), nullable=True)
    public_url = Column(String(255), unique=True, index=True, nullable=True)
    is_public = Column(Boolean, default=True, nullable=False)
    github_url = Column(String(255), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    website_url = Column(String(255), nullable=True)

    # Hiring Team Specific Profile Fields
    company_name = Column(String(255), nullable=True)
    company_website = Column(String(255), nullable=True)
    company_logo = Column(String(255), nullable=True)
    hiring_role = Column(String(100), nullable=True)  # e.g. "Talent Acquisition Lead"
    team_size = Column(String(50), nullable=True)     # e.g. "11-50"
    verification_status = Column(String(50), default="verified", nullable=True)  # 'verified', 'unverified'

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    evidence = relationship(
        "Evidence",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    skills = relationship(
        "Skill",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    job_matches = relationship(
        "JobMatch",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User {self.email} ({self.account_type})>"
