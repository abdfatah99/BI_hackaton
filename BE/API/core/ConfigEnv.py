"""
The project use PostgreSQL database.
Here are the configurations for the database connection.
"""
from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_USERNAME: str
    DATABASE_PASSWORD: str
    DATABASE_IP: str
    DATABASE_PORT: str
    DATABASE_NAME: str

    # access the URI inside the .env file
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
