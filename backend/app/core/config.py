"""
Application configuration loaded from environment variables (.env file).
Uses pydantic-settings so all values are validated and typed.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "Virtual Health Assistant"
    ENVIRONMENT: str = "development"

    SECRET_KEY: str = "insecure_dev_secret_change_me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    DATABASE_URL: str = "sqlite:///./vha.db"

    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"

    CORS_ORIGINS = (
    "http://localhost:5173,"
    "http://localhost:3000,"
    "https://sahayak-frontend-9bdw.onrender.com"
)

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


settings = Settings()
