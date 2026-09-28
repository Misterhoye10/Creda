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


def seed_default_user():
    """Ensure standard verified talent account (hoye@creda.app) exists for instant live demo access."""
    from app.db.session import SessionLocal
    from app.core.security import hash_password
    from app.models.user import User
    from app.models.skill import Skill
    from app.models.evidence import Evidence

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "hoye@creda.app").first()
        if not user:
            user = User(
                email="hoye@creda.app",
                password_hash=hash_password("Password123!"),
                name="Verified Candidate",
                professional_title="Backend Lead & Distributed Systems Engineer",
                location="Lagos, Nigeria",
                years_experience=6,
                bio="Distributed systems and backend infrastructure engineer specializing in high-throughput Python/FastAPI architectures, GPG commit attestation, and cryptographic verification pipelines.",
                public_url="hoye",
                is_public=True,
                github_url="https://github.com/creda-protocol",
                linkedin_url="https://linkedin.com",
                website_url="https://creda-khaki.vercel.app",
            )
            db.add(user)
            db.flush()

            # Seed evidence
            ev_gh = Evidence(
                user_id=user.id,
                type="GitHub",
                title="GitHub: Repository Commits & AST Architecture",
                description="Verified Git repositories, commit history, and AST codebase architecture.",
                url="https://github.com/creda-protocol",
                source="github_api",
            )
            ev_cv = Evidence(
                user_id=user.id,
                type="CV",
                title="Senior_Backend_Engineer_CV.pdf",
                description="Verified Curriculum Vitae detailing 6 years of backend and distributed systems experience.",
                source="upload",
            )
            db.add_all([ev_gh, ev_cv])

            # Seed skills
            skills_data = [
                ("Python", "Backend", "Advanced", 96, 3),
                ("FastAPI", "Frameworks", "Advanced", 94, 3),
                ("PostgreSQL", "Databases", "Intermediate", 91, 2),
                ("Distributed Systems", "Architecture", "Advanced", 93, 2),
                ("Docker & Cloud DevOps", "Infrastructure", "Intermediate", 89, 2),
                ("Cryptographic Proofs", "Security", "Advanced", 95, 3),
            ]
            for name, cat, lvl, conf, ev_count in skills_data:
                db.add(Skill(
                    user_id=user.id,
                    name=name,
                    category=cat,
                    level=lvl,
                    confidence=conf,
                    evidence_count=ev_count,
                ))

            db.commit()
            logger.info("Successfully seeded demo user: hoye@creda.app with evidence and verified skills.")
    except Exception as e:
        db.rollback()
        logger.warning(f"Note during demo user seeding: {e}")
    finally:
        db.close()


def init_db():
    """Create all database tables registered on SQLAlchemy Base if they don't exist."""
    try:
        Base.metadata.create_all(bind=engine)
        migrate_columns()
        seed_default_user()
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database tables: {e}")
        raise e


if __name__ == "__main__":
    init_db()

