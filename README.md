# 🌟 Creda — AI-Powered Skills Verification & Professional Identity Platform

> **StacStart Hackathon — Access & Inclusion Track**  
> Democratizing hiring by transforming raw evidence (CVs, GitHub code, real-world projects) into verifiable **Skill Passports** with AI-driven confidence scoring and job compatibility diagnostics.

---

## 💡 The Problem & Opportunity

African tech talent frequently faces systemic barriers in global hiring:
- Traditional credential bias (unrecognized local universities or self-taught paths).
- Unverifiable claims on resumes causing high recruiter drop-off rates.
- Lack of clear, objective skill gap diagnostics when applying for international roles.

**Creda bridges this gap** by creating an evidence-based **Skill Passport**:
1. Candidates upload their CV, connect their GitHub profile, and link live portfolio projects.
2. Creda's AI extracts demonstrable technical capabilities and assigns an objective **confidence score (30%–98%)** backed by multi-source corroboration.
3. Candidates can paste any target job description to get an instant **AI Gap Analysis** and actionable project recommendations.
4. Candidates share a publicly verifiable **Skill Passport URL** (e.g. `creda.app/p/kwame-mensah`) with recruiters globally.

---

## 📁 Repository Structure

```
Creda/
├── backend/                  # FastAPI Python backend service
│   ├── app/                  # Application code (Clean modular architecture)
│   │   ├── api/v1/           # Endpoints: auth, evidence, skills, jobs, profile, passport
│   │   ├── core/             # Security, JWT, config, exceptions, middleware
│   │   ├── db/               # SQLAlchemy ORM session & auto-migration engine
│   │   ├── models/           # Database models (User, Evidence, Skill, JobMatch)
│   │   ├── schemas/          # Pydantic request/response validation schemas
│   │   └── services/         # AI extraction, CV parsing, GitHub API, job matcher
│   ├── bruno/                # Complete pre-configured API test collection
│   ├── tests/                # 32 automated unit & E2E integration tests
│   ├── Dockerfile            # Production Docker container
│   ├── Procfile              # Render/Railway deployment configuration
│   └── requirements.txt      # Python dependencies
├── docs/                     # Frontend integration guides & API references
│   ├── API_EVIDENCE_GUIDE.md # Evidence submission & CV upload docs
│   ├── API_SKILLS_GUIDE.md   # AI skills extraction & confidence docs
│   ├── API_JOBS_GUIDE.md     # AI job matching & gap analysis docs
│   ├── API_PASSPORT_GUIDE.md # Public Skill Passport & profiles docs
│   └── DEPLOYMENT_GUIDE.md   # Cloud deployment instructions
└── README.md
```

---

## 🛠️ Tech Stack

- **Backend Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous, High-Performance)
- **Database**: Dual Architecture — Local [SQLite](https://www.sqlite.org/) for rapid offline development + [Supabase PostgreSQL](https://supabase.com/) for production cloud
- **ORM & Migrations**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/) with dynamic schema auto-migration
- **AI & LLM**: [OpenAI GPT](https://openai.com/) (Structured JSON mode for skill extraction and job matching)
- **Integrations**: [PyGithub](https://github.com/PyGithub/PyGithub) (GitHub REST API), [pdfplumber](https://github.com/jsvine/pdfplumber) & [PyPDF2](https://pypi.org/project/PyPDF2/)
- **Authentication**: JWT (JSON Web Tokens) with native `bcrypt` password hashing
- **Testing**: [Pytest](https://docs.pytest.org/) (32 tests passing, 100% success rate)
- **API Client**: [Bruno](https://www.usebruno.com/) collection included

---

## 🚀 Running the Project

### Backend
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
- Swagger API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

### Running Automated Tests
```bash
cd backend
pytest -v
```

---

## 🌿 Git Branches & Collaboration

- **`main`**: Production release branch.
- **`backend/develop`**: Active backend development and integration branch.
- **`frontend/develop`**: Active frontend development branch.

---

## 👥 Hackathon Team & Track

- **Track**: StacStart Hackathon — **Access & Inclusion**
- **Status**: Backend 100% complete across all 7 planned phases.
