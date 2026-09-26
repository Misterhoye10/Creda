import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Evidence(Base):
    __tablename__ = "evidence"

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
    type = Column(String(50), nullable=False, index=True)  # 'CV', 'GitHub', 'Project', 'Certification'
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    url = Column(String(255), nullable=True)
    source = Column(String(100), nullable=True)  # 'upload', 'github_api', 'manual'
    file_url = Column(String(255), nullable=True)
    raw_text = Column(Text, nullable=True)  # Extracted text for AI parsing
    metadata_json = Column(Text, nullable=True)  # JSON-encoded extra details
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    user = relationship("User", back_populates="evidence")
    skill_links = relationship(
        "SkillEvidence",
        back_populates="evidence",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Evidence {self.type}: {self.title}>"
