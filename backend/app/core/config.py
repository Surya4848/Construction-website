import os
from pathlib import Path
from dotenv import load_dotenv

# Always load backend/.env from its exact location
BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE, override=True)


def _secret() -> str:
    s = os.getenv("JWT_SECRET", "")
    if len(s) < 32:
        raise RuntimeError(
            "JWT_SECRET missing or too short. Check backend/.env"
        )
    return s


class Settings:
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    DB_NAME = os.getenv("MONGODB_DB", "jv_construction")
    JWT_SECRET = _secret()
    JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "480"))
    CORS_ORIGINS = [
        o.strip()
        for o in os.getenv(
            "CORS_ORIGINS", "http://localhost:5173"
        ).split(",")
        if o.strip()
    ]
    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "")
    MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_MB", "5")) * 1024 * 1024


settings = Settings()