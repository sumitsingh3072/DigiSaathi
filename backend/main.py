from fastapi import FastAPI
from backend.app.core.config import settings
from backend.app.api.api_v1.api import api_router
from backend.db.session import engine, Base
from backend.models import user

# ------------------ db initialization ----------------------

def create_db_and_tables():
    Base.metadata.create_all(bind=engine)

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("--- Starting up: Creating database tables ---")
    create_db_and_tables()
    print("--- Startup complete ---")
    yield
    print("--- Shutting down ---")


app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
)

app.include_router(api_router, prefix=settings.API_V1_STR)

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

