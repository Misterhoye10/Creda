from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.exceptions import CredaException
from app.core.middleware import SecurityHeadersMiddleware
from app.db.init_db import init_db
from app.api.v1.api import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("creda.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context for startup and shutdown events."""
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}...")
    init_db()
    logger.info("Application startup complete.")
    yield
    logger.info("Application shutdown.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
# Creda API — AI-Powered Skills Verification & Professional Identity Platform

**StacStart Hackathon: Access & Inclusion Track**

Creda empowers talent to prove what they can actually do rather than relying solely on unverified CVs, degrees, or job titles.

## Modules:
* **Authentication**: Secure signup, login, JWT token auth with bcrypt password hashing.
* **Evidence Management**: CV PDF parsing, GitHub repository analysis, and project evidence submission.
* **AI Skill Extraction**: OpenAI-powered multi-evidence corroboration and confidence scoring (30% to 98%).
* **Job Matching & Gap Analysis**: AI evaluation comparing verified skills against job requirements with tailored recommendations.
* **Candidate Profile & Public Skill Passport**: Verifiable, shareable talent link with recruiter-ready proof citations.
    """,
    version=settings.VERSION,
    lifespan=lifespan,
    openapi_tags=[
        {
            "name": "Authentication",
            "description": "User registration, authentication, JWT tokens, and identity management."
        },
        {
            "name": "Evidence Management",
            "description": "Evidence submission and parsing: CV uploads (PDF), GitHub analysis, and manual project proof."
        },
        {
            "name": "Skills Verification",
            "description": "AI extraction of verified skills from corroborated evidence with confidence scoring."
        },
        {
            "name": "Job Matching & Gap Analysis",
            "description": "AI matching engine evaluating candidate skills against job requirements and diagnosing gaps."
        },
        {
            "name": "User Profile",
            "description": "Candidate profile customization, social handles, public slug management, and skills summary."
        },
        {
            "name": "Skill Passport",
            "description": "Public unauthenticated recruiter view of verified talent passports with evidence citations."
        },
        {
            "name": "System",
            "description": "Health checks, root metadata, and platform status."
        }
    ]
)

# Security Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)

# Global Exception Handler for Creda domain exceptions
@app.exception_handler(CredaException)
async def creda_exception_handler(request: Request, exc: CredaException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.message,
            "details": exc.details
        }
    )

# CORS Configuration for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS + [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):(3000|5173|8000|8080)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Central API Router (/api)
app.include_router(api_router, prefix=settings.API_V1_STR)



@app.get("/", tags=["System"])
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}!",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "health_url": "/health"
    }


@app.get("/health", tags=["System"])
async def health():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
