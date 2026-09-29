from fastapi import APIRouter
from app.api.v1.endpoints import auth
from app.api.v1.endpoints import evidence
from app.api.v1.endpoints import skills
from app.api.v1.endpoints import jobs
from app.api.v1.endpoints import profile
from app.api.v1.endpoints import passport
from app.api.v1.endpoints import interview_requests
from app.api.v1.endpoints import hiring_requests

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(evidence.router)
api_router.include_router(skills.router)
api_router.include_router(jobs.router)
api_router.include_router(profile.router)
api_router.include_router(passport.router)
api_router.include_router(interview_requests.router)
api_router.include_router(hiring_requests.router)
