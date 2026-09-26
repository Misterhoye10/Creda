import logging
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger("creda.db")

def get_engine():
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

    try:
        if db_url.startswith("sqlite"):
            eng = create_engine(
                db_url,
                connect_args={"check_same_thread": False}
            )
        else:
            eng = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_recycle=300
            )
        # Test connection
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info(f"Database connected successfully to {eng.name}")
        return eng
    except Exception as e:
        logger.warning(
            f"Primary database connection failed ({e}). "
            f"Falling back to local SQLite (creda_dev.db) for reliable local development."
        )
        fallback_url = "sqlite:///./creda_dev.db"
        return create_engine(
            fallback_url,
            connect_args={"check_same_thread": False}
        )

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that provides a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
