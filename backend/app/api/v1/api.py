from fastapi import APIRouter
from app.api.v1.endpoints import auth
from app.api.v1.endpoints import evidence
from app.api.v1.endpoints import skills
from app.api.v1.endpoints import jobs

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(evidence.router)
api_router.include_router(skills.router)
api_router.include_router(jobs.router)
