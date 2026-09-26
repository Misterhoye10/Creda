import logging
from app.db.base import Base
from app.db.session import engine
from app.models import User, Evidence, Skill, SkillEvidence, JobMatch # noqa: F401

logger = logging.getLogger("creda.init_db")


def init_db():
    """Create all database tables registered on SQLAlchemy Base if they don't exist."""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database tables: {e}")
        raise e


if __name__ == "__main__":
    init_db()
