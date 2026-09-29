import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class InterviewRequest(Base):
    __tablename__ = "interview_requests"

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
    talent_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    company_name = Column(String(255), nullable=False)
    role_title = Column(String(255), nullable=False)
    work_type = Column(String(100), default="Full-Time Remote", nullable=True)
    compensation = Column(String(255), nullable=True)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="pending", nullable=False)  # 'pending', 'accepted', 'declined'
    talent_response_note = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    recruiter = relationship("User", foreign_keys=[recruiter_id], backref="sent_interview_requests")
    talent = relationship("User", foreign_keys=[talent_id], backref="received_interview_requests")

    def __repr__(self):
        return f"<InterviewRequest {self.company_name} -> {self.role_title} ({self.status})>"
