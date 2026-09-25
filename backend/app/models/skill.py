import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Skill(Base):
    __tablename__ = "skills"

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
    name = Column(String(100), nullable=False, index=True)
    category = Column(String(50), default="Technical", index=True)
    level = Column(String(50), default="Intermediate")  # 'Beginner', 'Intermediate', 'Advanced', 'Expert'
    confidence = Column(Integer, default=50)  # 0 to 100 percentage
    evidence_count = Column(Integer, default=1)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    user = relationship("User", back_populates="skills")
    evidence_links = relationship(
        "SkillEvidence",
        back_populates="skill",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Skill {self.name} ({self.level}, {self.confidence}%)>"


class SkillEvidence(Base):
    __tablename__ = "skill_evidence"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True
    )
    skill_id = Column(
        String(36),
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    evidence_id = Column(
        String(36),
        ForeignKey("evidence.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    confidence_score = Column(Integer, default=50)
    reason = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    skill = relationship("Skill", back_populates="evidence_links")
    evidence = relationship("Evidence", back_populates="skill_links")

    def __repr__(self):
        return f"<SkillEvidence skill_id={self.skill_id} evidence_id={self.evidence_id}>"
