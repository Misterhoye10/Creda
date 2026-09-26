import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True
    )
    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    job_title = Column(String(255), nullable=False)
    job_description = Column(Text, nullable=False)
    match_percentage = Column(Integer, default=0)
    matching_skills = Column(Text, default="[]")  # JSON string array
    missing_skills = Column(Text, default="[]")  # JSON string array
    recommendations = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    user = relationship("User", back_populates="job_matches")

    def __repr__(self):
        return f"<JobMatch {self.job_title}: {self.match_percentage}%>"
