from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    DATABASE_URL: str
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "BookLLM AI Service"
    
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    MAX_TOKENS: int = 500
    TEMPERATURE: float = 0.7
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()