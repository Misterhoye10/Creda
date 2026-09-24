# Creda Backend

Python FastAPI backend for Creda skill verification platform.

## Tech Stack
- Python 3.10+
- FastAPI
- PostgreSQL (via Supabase)
- OpenAI/LLM API

## Setup

\\\ash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
\\\

## Running Development Server

\\\ash
uvicorn main:app --reload
\\\

Server runs on http://localhost:8000

## API Endpoints

- POST /api/auth/signup - Create account
- POST /api/auth/login - Login
- POST /api/evidence/upload-cv - Upload CV
- POST /api/evidence/github - Connect GitHub
- POST /api/skills/extract - Extract skills from evidence
- POST /api/jobs/match - Match skills to job description
- GET /api/passport/:userId - Get skill passport

## Contributing

1. Create feature branch from \ackend/develop\
2. Make changes and commit
3. Push to your branch
4. Create pull request to \ackend/develop\
"@ | Out-File -Encoding utf8 "backend/README.md" ;

# Create frontend README
@"
# Creda Frontend

React/Next.js frontend for Creda skill verification platform.

## Tech Stack
- React 18+
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

## Setup

\\\ash
cd frontend
npm install
\\\

## Running Development Server

\\\ash
npm run dev
\\\

Server runs on http://localhost:3000

## Key Pages

- / - Landing page
- /auth/signup - User registration
- /auth/login - User login
- /dashboard - Main dashboard
- /passport - Skill passport view
- /job-match - Job matching tool
- /profile - User profile settings

## Contributing

1. Create feature branch from \rontend/develop\
2. Make changes and commit
3. Push to your branch
4. Create pull request to \rontend/develop\
"@ | Out-File -Encoding utf8 "frontend/README.md" ;

# Create docs README
@"
# Creda Documentation

## Contents

- PRD.pdf - Product Requirements Document
- API.md - API Documentation
- Architecture.md - System Architecture

See root README.md for project overview.
