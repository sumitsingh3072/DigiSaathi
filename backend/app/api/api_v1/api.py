from fastapi import APIRouter
from backend.app.api.api_v1.endpoints import document, health, chat, login, ocr, user
api_router = APIRouter()

api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(ocr.router, prefix="/ocr", tags=["ocr"])
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(document.router, prefix="/documents", tags=["documents"])
