import os
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "StudyMate AI Backend"
    API_V1_STR: str = "/api"
    PORT: int = 8000
    HOST: str = "127.0.0.1"
    
    # Security
    SECRET_KEY: str = "studymate_super_secret_jwt_key_2026_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    
    # Database
    # Defaults to SQLite; override via DATABASE_URL for PostgreSQL
    DATABASE_URL: str = "sqlite:///./studymate.db"
    
    # Google Gemini AI Key
    GEMINI_API_KEY: str = ""
    
    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False
    )

settings = Settings()
