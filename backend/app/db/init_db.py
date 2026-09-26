import logging
from sqlalchemy import inspect, text
from app.db.base import Base
from app.db.session import engine
from app.models import User, Evidence, Skill, SkillEvidence, JobMatch # noqa: F401

logger = logging.getLogger("creda.init_db")


def migrate_columns():
    """Ensure any newly added model columns exist in existing tables."""
    try:
        inspector = inspect(engine)
        if "users" in inspector.get_table_names():
            user_columns = {col["name"] for col in inspector.get_columns("users")}
            with engine.connect() as conn:
                if "is_public" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN is_public BOOLEAN DEFAULT 1"))
                    logger.info("Migrated users table: added is_public")
                if "github_url" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN github_url VARCHAR(255)"))
                    logger.info("Migrated users table: added github_url")
                if "linkedin_url" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN linkedin_url VARCHAR(255)"))
                    logger.info("Migrated users table: added linkedin_url")
                if "website_url" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN website_url VARCHAR(255)"))
                    logger.info("Migrated users table: added website_url")
                conn.commit()
    except Exception as e:
        logger.warning(f"Note during column migration: {e}")


def init_db():
    """Create all database tables registered on SQLAlchemy Base if they don't exist."""
    try:
        Base.metadata.create_all(bind=engine)
        migrate_columns()
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database tables: {e}")
        raise e


if __name__ == "__main__":
    init_db()

