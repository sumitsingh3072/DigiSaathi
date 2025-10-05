from fastapi import FastAPI
from backend.app.core.config import settings
from backend.app.api.api_v1.api import api_router


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="An AI-Powered Financial Companion for India, designed to enhance digital financial literacy and security.",
    version="0.1.0",
)
@app.get("/")
async def read_root():
    """
    This is the root endpoint. It's a simple way to check if the
    application is running.
    """
    return {"message": f"Welcome to the {settings.PROJECT_NAME} API!"}

# Include the main API router
# All routes defined in api_router will be prefixed with /api/v1
app.include_router(api_router, prefix=settings.API_V1_STR)

