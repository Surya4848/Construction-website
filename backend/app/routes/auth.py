from fastapi import APIRouter, Depends, HTTPException
from app.core.ratelimit import limiter
from app.core.security import create_token, current_admin, hash_password, verify_password, DUMMY_HASH
from app.database.mongo import db
from app.models.base import now, serialize
from app.schemas.schemas import LoginIn, ProfileIn

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", dependencies=[Depends(limiter(10, 600))])
def login(body: LoginIn):
    admin = db.admins.find_one({"email": body.email.lower()})
    ok = verify_password(body.password, admin["password_hash"] if admin else DUMMY_HASH)
    if not admin or not ok or not admin.get("active", True):
        raise HTTPException(401, "Incorrect email or password")
    db.admins.update_one({"_id": admin["_id"]}, {"$set": {"last_login": now()}})
    return {"access_token": create_token(admin["email"]), "token_type": "bearer"}

@router.get("/me")
def me(admin=Depends(current_admin)):
    return serialize(admin)

@router.put("/profile")
def profile(body: ProfileIn, admin=Depends(current_admin)):
    upd = {"name": body.name, "updated_at": now()}
    if body.new_password:
        if not body.current_password or not verify_password(body.current_password, admin["password_hash"]):
            raise HTTPException(400, "Current password is incorrect")
        upd["password_hash"] = hash_password(body.new_password)
    db.admins.update_one({"_id": admin["_id"]}, {"$set": upd})
    return serialize(db.admins.find_one({"_id": admin["_id"]}))
