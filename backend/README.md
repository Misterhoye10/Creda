# Backend - Python API

## Setup

### Requirements
- Python 3.9+
- FastAPI
- Supabase client
- python-dotenv

### Installation

\\\ash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
\\\

### Running

\\\ash
uvicorn main:app --reload
\\\

## API Endpoints

- POST /api/auth/signup - User registration
- POST /api/auth/login - User login
- POST /api/evidence/upload - Upload CV
- GET /api/evidence/{user_id} - Get user evidence
- POST /api/skills/extract - Extract skills from evidence
- GET /api/passport/{user_id} - Get Skill Passport
- POST /api/jobs/match - Match job description

## Environment Variables

Create .env file:

\\\
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
LLM_API_KEY=your_llm_api_key
\\\

## Development Notes

- All endpoints require authentication
- LLM integration for skill extraction
- GitHub API integration for repository analysis
