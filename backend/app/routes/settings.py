from fastapi import APIRouter, Depends
from app.core.security import current_admin
from app.database.mongo import db
from app.models.base import now
from app.schemas.schemas import SettingsIn

router = APIRouter(tags=["settings"])

@router.get("/api/settings")
def get_settings():
    doc = db.website_settings.find_one({"_id": "main"}) or {}
    doc.pop("_id", None)
    return doc

@router.put("/api/admin/settings", dependencies=[Depends(current_admin)])
def update_settings(body: SettingsIn):
    db.website_settings.update_one({"_id": "main"}, {"$set": {**body.model_dump(), "updated_at": now()}}, upsert=True)
    return get_settings()
