import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class HiringRequest(Base):
    __tablename__ = "hiring_requests"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True
    )
    recruiter_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    role_title = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False)
    location = Column(String(255), default="Remote Worldwide", nullable=True)
    employment_type = Column(String(100), default="Full-Time", nullable=True)
    required_skills = Column(Text, nullable=False)  # JSON array string or comma-separated
    nice_to_have_skills = Column(Text, nullable=True)
    experience_years = Column(Integer, default=2, nullable=True)
    status = Column(String(50), default="active", nullable=False)  # 'active', 'closed'
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    recruiter = relationship("User", backref="hiring_requests")

    def __repr__(self):
        return f"<HiringRequest {self.role_title} @ {self.company_name} ({self.status})>"
