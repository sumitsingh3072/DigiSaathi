from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Holds all the application settings. The values are loaded from
    environment variables.
    """
    PROJECT_NAME: str = "DigiSaathi"
    API_V1_STR: str = "/api/v1"
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
settings = Settings()
