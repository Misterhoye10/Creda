import logging
from sqlalchemy import inspect, text, or_
from app.db.base import Base
from app.db.session import engine
from app.models import User, Evidence, Skill, SkillEvidence, JobMatch, InterviewRequest, HiringRequest # noqa: F401

logger = logging.getLogger("creda.init_db")


def migrate_columns():
    """Ensure any newly added model columns and tables exist in existing database."""
    try:
        # Create any new tables (e.g. interview_requests, hiring_requests)
        Base.metadata.create_all(bind=engine)

        inspector = inspect(engine)
        if "users" in inspector.get_table_names():
            user_columns = {col["name"] for col in inspector.get_columns("users")}
            with engine.connect() as conn:
                # Basic profile extensions
                if "is_public" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN is_public BOOLEAN DEFAULT 1"))
                if "github_url" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN github_url VARCHAR(255)"))
                if "linkedin_url" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN linkedin_url VARCHAR(255)"))
                if "website_url" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN website_url VARCHAR(255)"))

                # Role separation
                if "account_type" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN account_type VARCHAR(50) DEFAULT 'talent'"))
                    logger.info("Migrated users table: added account_type")

                # Granular location & preferences
                if "country" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN country VARCHAR(100)"))
                if "city" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN city VARCHAR(100)"))
                if "primary_field" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN primary_field VARCHAR(100) DEFAULT 'software'"))
                if "availability" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN availability VARCHAR(50) DEFAULT 'available_now'"))
                if "available_from" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN available_from VARCHAR(100)"))
                if "work_preferences" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN work_preferences TEXT"))
                if "visibility" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN visibility VARCHAR(50) DEFAULT 'discoverable'"))
                if "evidence_visibility" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN evidence_visibility VARCHAR(50) DEFAULT 'public'"))

                # Recruiter / Company fields
                if "company_name" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN company_name VARCHAR(255)"))
                if "company_website" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN company_website VARCHAR(255)"))
                if "company_logo" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN company_logo VARCHAR(255)"))
                if "hiring_role" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN hiring_role VARCHAR(100)"))
                if "team_size" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN team_size VARCHAR(50)"))
                if "verification_status" not in user_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN verification_status VARCHAR(50) DEFAULT 'verified'"))

                # Backfill existing records with null flags to guarantee discoverability
                conn.execute(text("UPDATE users SET is_public = 1 WHERE is_public IS NULL"))
                conn.execute(text("UPDATE users SET visibility = 'discoverable' WHERE visibility IS NULL"))
                conn.execute(text("UPDATE users SET account_type = 'talent' WHERE account_type IS NULL"))
                conn.execute(text("UPDATE users SET evidence_visibility = 'public' WHERE evidence_visibility IS NULL"))
                conn.commit()

        # Check skills table columns
        if "skills" in inspector.get_table_names():
            skill_columns = {col["name"] for col in inspector.get_columns("skills")}
            with engine.connect() as conn:
                if "evidence_status" not in skill_columns:
                    conn.execute(text("ALTER TABLE skills ADD COLUMN evidence_status VARCHAR(50) DEFAULT 'self_declared'"))
                    logger.info("Migrated skills table: added evidence_status")
                if "assessment_score" not in skill_columns:
                    conn.execute(text("ALTER TABLE skills ADD COLUMN assessment_score INTEGER"))
                    logger.info("Migrated skills table: added assessment_score")
                conn.commit()

    except Exception as e:
        logger.warning(f"Note during column migration: {e}")


def seed_default_user():
    """Seed authentic, realistic African tech talent and recruiter profiles into the database."""
    from app.db.session import SessionLocal
    from app.core.security import hash_password
    from app.models.user import User
    from app.models.skill import Skill
    from app.models.evidence import Evidence
    from app.models.interview_request import InterviewRequest
    from app.models.hiring_request import HiringRequest

    db = SessionLocal()
    try:
        # ── 1. Tech Talent: David Adeyemi (Full Stack Lead) ──────────
        david = db.query(User).filter(User.email == "david.adeyemi@creda.app").first()
        if not david:
            david = User(
                email="david.adeyemi@creda.app",
                password_hash=hash_password("Password123!"),
                account_type="talent",
                name="David Adeyemi",
                professional_title="Full Stack Developer",
                country="Nigeria",
                city="Lagos",
                location="Lagos, Nigeria",
                primary_field="software",
                years_experience=4,
                availability="available_now",
                available_from="Immediately Available",
                work_preferences="Remote, Hybrid",
                visibility="discoverable",
                evidence_visibility="public",
                bio="Full-stack developer specializing in React, TypeScript, Python and PostgreSQL with audited AST complexity and verified live project deployments.",
                public_url="david-adeyemi",
                is_public=True,
                github_url="https://github.com/davidadeyemi",
                linkedin_url="https://linkedin.com/in/davidadeyemi",
                website_url="https://davidadeyemi.dev",
            )
            db.add(david)
            db.flush()

            # Evidences
            db.add(Evidence(
                user_id=david.id,
                type="GitHub",
                title="GitHub: 5 Audited Repositories",
                description="Active GitHub account with 5 verified repositories in Python, TypeScript, and React.",
                url="https://github.com/davidadeyemi",
                source="github_api",
            ))
            db.add(Evidence(
                user_id=david.id,
                type="portfolio",
                title="Live Portfolio: davidadeyemi.dev",
                description="Production portfolio site showcasing E-commerce Platform, School Management System, and Mental Health Companion.",
                url="https://davidadeyemi.dev",
                source="portfolio_url",
            ))
            db.add(Evidence(
                user_id=david.id,
                type="project",
                title="E-commerce Fullstack Platform",
                description="Production marketplace built with React, Next.js, and PostgreSQL backend.",
                url="https://shop-demo.davidadeyemi.dev",
                source="manual",
            ))

            # Skills with Grounded Evidence Status
            david_skills = [
                ("React", "Frontend", "Advanced", 95, "strong", 87, 4),
                ("TypeScript", "Frontend", "Advanced", 92, "strong", 88, 3),
                ("Python", "Backend", "Advanced", 91, "strong", 91, 4),
                ("PostgreSQL", "Database", "Advanced", 89, "strong", 84, 3),
                ("REST APIs", "Backend", "Advanced", 94, "strong", 90, 4),
                ("Git", "Tools", "Advanced", 96, "strong", 92, 5),
                ("Docker", "DevOps", "Intermediate", 74, "moderate", None, 1),
                ("Next.js", "Frontend", "Intermediate", 78, "moderate", None, 1),
            ]
            for name, cat, lvl, conf, ev_stat, score, ev_count in david_skills:
                db.add(Skill(
                    user_id=david.id,
                    name=name,
                    category=cat,
                    level=lvl,
                    confidence=conf,
                    evidence_status=ev_stat,
                    assessment_score=score,
                    evidence_count=ev_count,
                ))

        # ── 2. Tech Talent: Sarah Okafor (Product & UI/UX Designer) ──
        sarah_d = db.query(User).filter(User.email == "sarah.okafor@creda.app").first()
        if not sarah_d:
            sarah_d = User(
                email="sarah.okafor@creda.app",
                password_hash=hash_password("Password123!"),
                account_type="talent",
                name="Sarah Okafor",
                professional_title="Product & UI/UX Designer",
                country="Nigeria",
                city="Abuja",
                location="Abuja, Nigeria",
                primary_field="design",
                years_experience=5,
                availability="open_to_offers",
                available_from="2 Weeks Notice",
                work_preferences="Remote, Hybrid",
                visibility="discoverable",
                bio="Senior Product Designer focused on design systems, token architecture, and user research for high-growth African fintech applications.",
                public_url="sarah-okafor",
                is_public=True,
                website_url="https://sarahokafor.design",
            )
            db.add(sarah_d)
            db.flush()

            db.add(Evidence(
                user_id=sarah_d.id,
                type="portfolio",
                title="Design Portfolio: sarahokafor.design",
                description="Live UX case studies and design system documentation.",
                url="https://sarahokafor.design",
                source="portfolio_url",
            ))
            db.add(Evidence(
                user_id=sarah_d.id,
                type="figma",
                title="Figma: Fintech Design System Tokens",
                description="140+ component tokens audited for accessibility and engineering handoff.",
                url="https://figma.com/@sarahokafor",
                source="figma_url",
            ))

            sarah_skills = [
                ("Figma Design Systems", "Design", "Advanced", 96, "strong", 94, 3),
                ("UX Research", "Design", "Advanced", 92, "strong", 88, 3),
                ("Design Tokens", "Design", "Advanced", 94, "strong", 92, 2),
                ("Design Systems", "Design", "Advanced", 95, "strong", 95, 3),
                ("Prototyping", "Design", "Intermediate", 85, "moderate", None, 2),
                ("User Testing", "Design", "Intermediate", 75, "moderate", None, 1),
            ]
            for name, cat, lvl, conf, ev_stat, score, ev_count in sarah_skills:
                db.add(Skill(
                    user_id=sarah_d.id,
                    name=name,
                    category=cat,
                    level=lvl,
                    confidence=conf,
                    evidence_status=ev_stat,
                    assessment_score=score,
                    evidence_count=ev_count,
                ))

        # ── 3. Tech Talent: Michael Mensah (Cybersecurity Specialist) ─
        michael = db.query(User).filter(User.email == "michael.mensah@creda.app").first()
        if not michael:
            michael = User(
                email="michael.mensah@creda.app",
                password_hash=hash_password("Password123!"),
                account_type="talent",
                name="Michael Mensah",
                professional_title="Cybersecurity Analyst & SOC Lead",
                country="Ghana",
                city="Accra",
                location="Accra, Ghana",
                primary_field="security",
                years_experience=4,
                availability="available_now",
                available_from="Immediately Available",
                work_preferences="Remote Worldwide",
                visibility="discoverable",
                bio="SOC analyst and penetration tester specializing in OWASP security hardening, CVE vulnerability research, and TryHackMe CTF labs.",
                public_url="michael-mensah",
                is_public=True,
                website_url="https://mensah-sec.io",
            )
            db.add(michael)
            db.flush()

            db.add(Evidence(
                user_id=michael.id,
                type="security_report",
                title="TryHackMe: Top 1% Global Rank & Lab Proof",
                description="Verified CTF offensive and defensive security lab completions.",
                url="https://tryhackme.com/p/mmensah",
                source="external_link",
            ))
            db.add(Evidence(
                user_id=michael.id,
                type="certification",
                title="CompTIA Security+ & CEH Certified",
                description="Cryptographically verified security credentials.",
                url="https://mensah-sec.io/certs",
                source="certification",
            ))

            michael_skills = [
                ("Network Security", "Security", "Advanced", 95, "strong", 92, 3),
                ("Penetration Testing", "Security", "Advanced", 93, "strong", 89, 3),
                ("SOC Analysis", "Security", "Advanced", 91, "strong", 90, 2),
                ("OWASP Top 10", "Security", "Advanced", 94, "strong", 93, 3),
                ("SIEM / Splunk", "Security", "Intermediate", 80, "moderate", None, 1),
                ("Vulnerability Assessment", "Security", "Intermediate", 84, "moderate", None, 1),
            ]
            for name, cat, lvl, conf, ev_stat, score, ev_count in michael_skills:
                db.add(Skill(
                    user_id=michael.id,
                    name=name,
                    category=cat,
                    level=lvl,
                    confidence=conf,
                    evidence_status=ev_stat,
                    assessment_score=score,
                    evidence_count=ev_count,
                ))

        # ── 4. Tech Talent: Adekunle Bello (DevOps & Cloud Lead) ─────
        adekunle = db.query(User).filter(User.email == "adekunle.bello@creda.app").first()
        if not adekunle:
            adekunle = User(
                email="adekunle.bello@creda.app",
                password_hash=hash_password("Password123!"),
                account_type="talent",
                name="Adekunle Bello",
                professional_title="Staff Cloud Architect & DevOps Lead",
                country="Kenya",
                city="Nairobi",
                location="Nairobi, Kenya",
                primary_field="devops",
                years_experience=6,
                availability="open_to_offers",
                available_from="2 Weeks Notice",
                work_preferences="Remote Worldwide",
                visibility="discoverable",
                bio="Staff DevOps engineer with 6 years building zero-downtime Kubernetes clusters, Terraform IaC, and CI/CD automation across AWS and GCP.",
                public_url="adekunle-bello",
                is_public=True,
                github_url="https://github.com/adekunle-cloud",
            )
            db.add(adekunle)
            db.flush()

            db.add(Evidence(
                user_id=adekunle.id,
                type="GitHub",
                title="GitHub: 18 Production CI/CD Pipelines & Terraform Manifests",
                description="Audited infrastructure-as-code footprint with 99.98% pipeline uptime.",
                url="https://github.com/adekunle-cloud",
                source="github_api",
            ))

            ade_skills = [
                ("Kubernetes", "DevOps", "Expert", 96, "strong", 94, 3),
                ("Terraform", "DevOps", "Advanced", 95, "strong", 93, 3),
                ("AWS", "Cloud", "Advanced", 94, "strong", 91, 3),
                ("CI/CD Automation", "DevOps", "Advanced", 96, "strong", 95, 4),
                ("Docker", "DevOps", "Expert", 95, "strong", 92, 4),
            ]
            for name, cat, lvl, conf, ev_stat, score, ev_count in ade_skills:
                db.add(Skill(
                    user_id=adekunle.id,
                    name=name,
                    category=cat,
                    level=lvl,
                    confidence=conf,
                    evidence_status=ev_stat,
                    assessment_score=score,
                    evidence_count=ev_count,
                ))

        # ── 5. Tech Talent: Fatima Al-Hassan (Senior Data & AI) ──────
        fatima = db.query(User).filter(User.email == "fatima.alhassan@creda.app").first()
        if not fatima:
            fatima = User(
                email="fatima.alhassan@creda.app",
                password_hash=hash_password("Password123!"),
                account_type="talent",
                name="Fatima Al-Hassan",
                professional_title="Senior Data & ML Pipeline Engineer",
                country="Egypt",
                city="Cairo",
                location="Cairo, Egypt",
                primary_field="data",
                years_experience=5,
                availability="open_to_offers",
                available_from="1 Month Notice",
                work_preferences="Remote Worldwide",
                visibility="discoverable",
                bio="Data engineer with production experience architecting 40M+ event daily ETL pipelines with dbt, Snowflake, Airflow, and PyTorch.",
                public_url="fatima-al-hassan",
                is_public=True,
                github_url="https://github.com/fatima-data",
            )
            db.add(fatima)
            db.flush()

            db.add(Evidence(
                user_id=fatima.id,
                type="dataset_project",
                title="Kaggle & SQL: High-Throughput Fintech Data Pipelines",
                description="Verified data transformations and query benchmarks.",
                url="https://github.com/fatima-data/etl-pipelines",
                source="external_link",
            ))

            fatima_skills = [
                ("Python", "Data", "Advanced", 96, "strong", 94, 3),
                ("dbt", "Data", "Advanced", 93, "strong", 91, 2),
                ("Snowflake", "Data", "Advanced", 92, "strong", 90, 2),
                ("SQL & Query Optimization", "Data", "Expert", 96, "strong", 95, 3),
                ("PyTorch", "AI", "Intermediate", 84, "moderate", None, 1),
                ("Airflow", "Data", "Intermediate", 82, "moderate", None, 1),
            ]
            for name, cat, lvl, conf, ev_stat, score, ev_count in fatima_skills:
                db.add(Skill(
                    user_id=fatima.id,
                    name=name,
                    category=cat,
                    level=lvl,
                    confidence=conf,
                    evidence_status=ev_stat,
                    assessment_score=score,
                    evidence_count=ev_count,
                ))

        # ── 6. Tech Talent: Kofi Mensah (3D & Creative Web) ──────────
        kofi = db.query(User).filter(User.email == "kofi.mensah@creda.app").first()
        if not kofi:
            kofi = User(
                email="kofi.mensah@creda.app",
                password_hash=hash_password("Password123!"),
                account_type="talent",
                name="Kofi Mensah",
                professional_title="Lead 3D Web & Creative Systems Engineer",
                country="Ghana",
                city="Accra",
                location="Accra, Ghana",
                primary_field="creative3d",
                years_experience=4,
                availability="available_now",
                available_from="Immediately Available",
                work_preferences="Remote Worldwide",
                visibility="discoverable",
                bio="WebGL and 3D web engineer specializing in React Three Fiber, custom GLSL compute shaders, and responsive 60fps canvas optimization.",
                public_url="kofi-mensah",
                is_public=True,
                website_url="https://kofimensah.art",
            )
            db.add(kofi)
            db.flush()

            db.add(Evidence(
                user_id=kofi.id,
                type="portfolio",
                title="3D Canvas Portfolio: kofimensah.art",
                description="Live WebGL interactive experiences and GLSL shaders.",
                url="https://kofimensah.art",
                source="portfolio_url",
            ))

            kofi_skills = [
                ("React Three Fiber", "3D Web", "Advanced", 97, "strong", 95, 3),
                ("Three.js", "3D Web", "Advanced", 95, "strong", 93, 3),
                ("GLSL Shaders", "3D Web", "Advanced", 94, "strong", 91, 2),
                ("WebGL Optimization", "3D Web", "Advanced", 93, "strong", 90, 2),
                ("TypeScript", "Frontend", "Intermediate", 84, "moderate", None, 1),
            ]
            for name, cat, lvl, conf, ev_stat, score, ev_count in kofi_skills:
                db.add(Skill(
                    user_id=kofi.id,
                    name=name,
                    category=cat,
                    level=lvl,
                    confidence=conf,
                    evidence_status=ev_stat,
                    assessment_score=score,
                    evidence_count=ev_count,
                ))

        # ── 7. Verified Talent: Hoye Adeleke (Founder / Baseline User)
        hoye = db.query(User).filter(User.email == "hoye@creda.app").first()
        if not hoye:
            hoye = User(
                email="hoye@creda.app",
                password_hash=hash_password("Password123!"),
                account_type="talent",
                name="Hoye Adeleke",
                professional_title="Senior Backend & Distributed Systems Lead",
                country="Nigeria",
                city="Lagos",
                location="Lagos, Nigeria",
                primary_field="software",
                years_experience=6,
                availability="available_now",
                available_from="Immediately Available",
                work_preferences="Remote Worldwide",
                visibility="discoverable",
                bio="Distributed systems and backend infrastructure engineer specializing in high-throughput Python/FastAPI architectures, GPG commit attestation, and cryptographic verification pipelines.",
                public_url="hoye",
                is_public=True,
                github_url="https://github.com/creda-protocol",
                linkedin_url="https://linkedin.com",
                website_url="https://creda-khaki.vercel.app",
            )
            db.add(hoye)
            db.flush()

            db.add(Evidence(
                user_id=hoye.id,
                type="GitHub",
                title="GitHub: Repository Commits & AST Architecture",
                description="Verified Git repositories, commit history, and AST codebase architecture.",
                url="https://github.com/creda-protocol",
                source="github_api",
            ))

            hoye_skills = [
                ("Python", "Backend", "Advanced", 96, "strong", 95, 3),
                ("FastAPI", "Frameworks", "Advanced", 94, "strong", 93, 3),
                ("PostgreSQL", "Databases", "Intermediate", 91, "strong", 88, 2),
                ("Distributed Systems", "Architecture", "Advanced", 93, "strong", 92, 2),
                ("Cryptographic Proofs", "Security", "Advanced", 95, "strong", 94, 3),
            ]
            for name, cat, lvl, conf, ev_stat, score, ev_count in hoye_skills:
                db.add(Skill(
                    user_id=hoye.id,
                    name=name,
                    category=cat,
                    level=lvl,
                    confidence=conf,
                    evidence_status=ev_stat,
                    assessment_score=score,
                    evidence_count=ev_count,
                ))

        # ── 7b. Verified Talent: Folarin Thimoteus ────────────────────
        folarin = db.query(User).filter(
            or_(
                User.email == "folarin.thimoteus@creda.app",
                User.public_url == "folarin-thimoteus",
                User.name == "Folarin Thimoteus"
            )
        ).first()
        if not folarin:
            folarin = User(
                email="folarin.thimoteus@creda.app",
                password_hash=hash_password("Password123!"),
                account_type="talent",
                name="Folarin Thimoteus",
                professional_title="Senior Full-Stack & Distributed Systems Engineer",
                country="Nigeria",
                city="Lagos",
                location="Lagos, Nigeria",
                primary_field="software",
                years_experience=5,
                availability="available_now",
                available_from="Immediately Available",
                work_preferences="Remote Worldwide, Hybrid",
                visibility="discoverable",
                evidence_visibility="public",
                bio="Full-stack engineer specializing in Python/FastAPI architectures, React components, and AST-verified cryptographic verification pipelines.",
                public_url="folarin-thimoteus",
                is_public=True,
                github_url="https://github.com/creda-protocol",
                linkedin_url="https://linkedin.com",
                website_url="https://creda-khaki.vercel.app",
            )
            db.add(folarin)
            db.flush()

            db.add(Evidence(
                user_id=folarin.id,
                type="GitHub",
                title="GitHub: Repository Commits & AST Architecture",
                description="Verified Git repositories, commit history, and AST codebase architecture.",
                url="https://github.com/creda-protocol",
                source="github_api",
            ))
            db.add(Evidence(
                user_id=folarin.id,
                type="portfolio",
                title="Technical Portfolio & Production Applications",
                description="Audited distributed payment ledger and microservices portfolio.",
                url="https://creda-khaki.vercel.app",
                source="portfolio_url",
            ))

            folarin_skills = [
                ("Python Systems & APIs", "Backend", "Advanced", 92, "strong", 88, 3),
                ("React & Component Architecture", "Frontend", "Advanced", 89, "strong", 87, 3),
                ("TypeScript & Type Systems", "Languages", "Intermediate", 84, "moderate", None, 2),
                ("SQL & Database Optimization", "Databases", "Intermediate", 82, "moderate", None, 2),
            ]
            for name, cat, lvl, conf, ev_stat, score, ev_count in folarin_skills:
                db.add(Skill(
                    user_id=folarin.id,
                    name=name,
                    category=cat,
                    level=lvl,
                    confidence=conf,
                    evidence_status=ev_stat,
                    assessment_score=score,
                    evidence_count=ev_count,
                ))

        # ── 8. Hiring Team: Sarah Johnson @ TechNova ─────────────────
        recruiter = db.query(User).filter(User.email == "sarah@technova.com").first()
        if not recruiter:
            recruiter = User(
                email="sarah@technova.com",
                password_hash=hash_password("Password123!"),
                account_type="recruiter",
                name="Sarah Johnson",
                professional_title="Head of Technical Talent Acquisition",
                country="Nigeria",
                city="Lagos",
                location="Lagos, Nigeria",
                company_name="TechNova",
                company_website="https://technova.io",
                hiring_role="Head of Talent Acquisition",
                team_size="51-200",
                verification_status="verified",
                visibility="discoverable",
                bio="TechNova is a leading Pan-African fintech engineering high-throughput settlement infrastructure.",
            )
            db.add(recruiter)
            db.flush()

            # Seed sample Hiring Request
            hr1 = HiringRequest(
                recruiter_id=recruiter.id,
                company_name="TechNova",
                role_title="Senior Full Stack Engineer",
                location="Remote Worldwide",
                employment_type="Full-Time",
                required_skills="React, TypeScript, Python, PostgreSQL, REST APIs",
                nice_to_have_skills="Docker, Next.js",
                experience_years=3,
                status="active",
            )
            db.add(hr1)
            db.flush()

            # Seed a sample Interview Offer sent to David Adeyemi (Pending talent response)
            if david:
                offer = InterviewRequest(
                    recruiter_id=recruiter.id,
                    talent_id=david.id,
                    company_name="TechNova",
                    role_title="Senior Full Stack Engineer",
                    work_type="Full-Time Remote",
                    compensation="$75,000 - $95,000 / year",
                    message="Hi David, we audited your AST code verification and live portfolio projects on Creda. Your React, TypeScript, and PostgreSQL depth is an exact match for our core engineering team. We'd love to schedule a direct introductory discussion.",
                    status="pending",
                )
                db.add(offer)

        db.commit()
        logger.info("Successfully seeded authentic African tech talent and recruiter profiles.")

    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


def init_db():
    """Initializes tables and seeds starting authentic data."""
    migrate_columns()
    seed_default_user()
