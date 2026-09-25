from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
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
# Creda API — AI-Powered Skills Verification Platform

Creda helps talent prove what they can actually do rather than relying solely on unverified CVs, degrees, or job titles.

## Features:
* **Authentication**: Secure signup, login, JWT token auth with 24-hour expiration.
* **Evidence Management**: CV PDF parsing, GitHub repository analysis, and project proof.
* **AI Skill Extraction**: OpenAI-driven skill discovery and confidence scoring.
* **Job Matching**: AI gap analysis comparing candidates against job requirements.
* **Public Skill Passport**: Shareable, verified talent profile links.
    """,
    version=settings.VERSION,
    lifespan=lifespan,
    openapi_tags=[
        {
            "name": "Authentication",
            "description": "User registration, authentication, JWT tokens, and profile retrieval."
        }
    ]
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
