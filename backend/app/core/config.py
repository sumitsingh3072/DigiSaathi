from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Holds all the application settings. The values are loaded from
    environment variables.
    """
    PROJECT_NAME: str = "DigiSaathi"
    API_V1_STR: str = "/api/v1"
    GEMINI_API_KEY: str  # Replace with your actual API key or set in .env
    model_config = SettingsConfigDict(env_file="C:\\ML_Projects\\DigiSaathi\\backend\\.env", extra="ignore")

settings = Settings()