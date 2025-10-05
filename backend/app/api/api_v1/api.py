# backend/api/api_v1/api.py

from fastapi import APIRouter
from backend.app.api.api_v1.endpoints import health, chat, ocr, user


# Create the main router for the v1 API
api_router = APIRouter()

# Include the health check router
# All routes from health.py will be included under this main router.
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(ocr.router, prefix="/ocr", tags=["ocr"])
api_router.include_router(user.router, prefix="/users", tags=["users"])
