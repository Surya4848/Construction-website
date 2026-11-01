from datetime import timedelta
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from pwdlib import PasswordHash
from app.core.config import settings
from app.database.mongo import db
from app.models.base import now

ph = PasswordHash.recommended()
DUMMY_HASH = ph.hash("not-a-real-password")
bearer = HTTPBearer(auto_error=False)

def hash_password(p: str) -> str: return ph.hash(p)
def verify_password(p: str, h: str) -> bool: return ph.verify(p, h)

def create_token(email: str) -> str:
    return jwt.encode({"sub": email, "exp": now() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)}, settings.JWT_SECRET, algorithm="HS256")

def current_admin(cred=Depends(bearer)):
    err = HTTPException(401, "Not authenticated", headers={"WWW-Authenticate": "Bearer"})
    if not cred:
        raise err
    try:
        email = jwt.decode(cred.credentials, settings.JWT_SECRET, algorithms=["HS256"])["sub"]
    except (jwt.PyJWTError, KeyError):
        raise err
    admin = db.admins.find_one({"email": email})
    if not admin or not admin.get("active", True):
        raise err
    return admin
