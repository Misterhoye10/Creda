# 🌐 Creda Backend API — AI-Powered Skills Verification Platform

> **StacStart Hackathon — Access & Inclusion Track**  
> Creda helps African tech talent prove what they can actually do rather than relying solely on unverified CVs, degrees, or job titles.

---

## 🏛️ System Architecture

```
                       ┌───────────────────────────────┐
                       │  Frontend (Next.js / React)   │
                       └──────────────┬────────────────┘
                                      │ HTTP / JSON
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CREDA BACKEND API                               │
│                         (FastAPI + Python 3.11/3.13)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Security Headers Middleware]   [JWT Auth Guard]   [Global Error Handler] │
├─────────────────────────────────────────────────────────────────────────────┤
│  MODULES:                                                                   │
│  ├── 🔐 /api/auth       (Signup, Login, JWT tokens, bcrypt hashing)         │
│  ├── 📂 /api/evidence   (PDF CV parsing, GitHub API repos, Project proof)    │
│  ├── 🧠 /api/skills     (OpenAI multi-evidence corroboration & confidence)   │
│  ├── 💼 /api/jobs       (AI job description matching & gap analysis)        │
│  ├── 👤 /api/user       (Profile settings, custom slug, completeness score) │
│  └── 🌍 /api/passport   (Public unauthenticated Skill Passport for recruiters│
├─────────────────────────────────────────────────────────────────────────────┤
│  SERVICES & ADAPTERS:                                                       │
│  ├── PDFParser (pdfplumber + pypdf)     ├── GitHubService (PyGithub API)    │
│  ├── SkillExtractor (OpenAI GPT JSON)   ├── JobMatcher (OpenAI Gap Engine)  │
│  └── PassportService (Scoring & Badges) └── StorageService (Supabase/Local) │
├─────────────────────────────────────────────────────────────────────────────┤
│  DATABASE LAYER (SQLAlchemy ORM + Dual Resilience):                         │
│  ├── SQLite (creda_dev.db) ── Zero-config local development & offline tests │
│  └── PostgreSQL (Supabase/Render) ── Production cloud deployment            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Python 3.10+ (Tested on Python 3.11 and 3.13)
- Virtual environment (`venv`)

### 2. Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(The API runs out-of-the-box with local SQLite `creda_dev.db`. Add your `OPENAI_API_KEY` for live AI features).*

### 4. Run Development Server
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
- Interactive Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Interactive ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

---

## 📡 Complete API Endpoint Catalog

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | No | Register new candidate with email & password |
| `POST` | `/api/auth/login` | No | Authenticate candidate and receive JWT token |
| `GET` | `/api/auth/me` | Bearer | Get currently authenticated user details |
| `POST` | `/api/auth/logout` | Bearer | Terminate session / logout |

### 2. Evidence Management (`/api/evidence`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/evidence/upload-cv` | Bearer | Upload and extract raw text from PDF resume |
| `POST` | `/api/evidence/github` | Bearer | Connect GitHub handle, fetch public repos & languages |
| `POST` | `/api/evidence/project` | Bearer | Submit portfolio project with technologies & URLs |
| `GET` | `/api/evidence` | Bearer | List all candidate evidence items (supports `?type=` filter) |
| `GET` | `/api/evidence/{id}` | Bearer | Get details of a single evidence item |
| `DELETE` | `/api/evidence/{id}` | Bearer | Delete an evidence item |

### 3. AI Skills Verification (`/api/skills`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/skills/extract` | Bearer | Run AI analysis on candidate evidence, extract skills with confidence ratings |
| `GET` | `/api/skills` | Bearer | List all verified skills sorted by confidence descending |
| `GET` | `/api/skills/{id}` | Bearer | Get skill details and corroborating evidence citations |
| `PUT` | `/api/skills/{id}` | Bearer | Manually adjust skill proficiency level or confidence |
| `DELETE` | `/api/skills/{id}` | Bearer | Remove a verified skill |

### 4. AI Job Matching & Gap Analysis (`/api/jobs`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/jobs/match` | Bearer | Match target job description against candidate's verified skills |
| `GET` | `/api/jobs/matches` | Bearer | List past job match reports |
| `GET` | `/api/jobs/matches/{id}`| Bearer | View specific job match report with skill gaps and recommendations |
| `DELETE` | `/api/jobs/matches/{id}`| Bearer | Delete a saved job match report |

### 5. Candidate Profile (`/api/user`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/profile` | Bearer | Get candidate profile, completeness %, and statistics |
| `PUT` | `/api/user/profile` | Bearer | Update bio, social links, custom slug (`public_url`), and visibility |
| `GET` | `/api/user/skills-summary` | Bearer | Aggregated metrics: completeness %, skills by level, evidence counts |

### 6. Public Skill Passport (`/api/passport`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/passport/{identifier}` | **None** | Public recruiter view by UUID or custom slug (e.g. `/api/passport/kwame-mensah`) |

---

## ⚡ Bruno API Testing Collection

A complete Bruno collection is included under [`backend/bruno/`](file:///c:/Users/user/OneDrive/Desktop/Creda-repo/backend/bruno/):
- **`Auth/`**: Signup, Login, Get Me, Logout
- **`Evidence/`**: Upload CV, Connect GitHub, Add Project, List Evidence, Delete Evidence
- **`Skills/`**: Extract Skills, Get All Skills, Get Skill Detail, Update Skill, Delete Skill
- **`Jobs/`**: Match Job, Get All Matches, Get Match Detail, Delete Match
- **`Profile/`**: Get Profile, Update Profile, Get Skills Summary
- **`Passport/`**: Get Public Passport by Slug, Get Public Passport by ID

---

## 🧪 Automated Testing

Run the full automated test suite (32 unit, API, and end-to-end integration tests):
```bash
pytest -v
```

---

## 📖 Frontend Integration Guides

Detailed API guides with JSON schemas and Next.js / React components:
- [Evidence API Guide](file:///c:/Users/user/OneDrive/Desktop/Creda-repo/docs/API_EVIDENCE_GUIDE.md)
- [Skills API Guide](file:///c:/Users/user/OneDrive/Desktop/Creda-repo/docs/API_SKILLS_GUIDE.md)
- [Job Matching API Guide](file:///c:/Users/user/OneDrive/Desktop/Creda-repo/docs/API_JOBS_GUIDE.md)
- [Skill Passport API Guide](file:///c:/Users/user/OneDrive/Desktop/Creda-repo/docs/API_PASSPORT_GUIDE.md)
- [Cloud Deployment Guide](file:///c:/Users/user/OneDrive/Desktop/Creda-repo/docs/DEPLOYMENT_GUIDE.md)
