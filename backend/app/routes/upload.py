from typing import Literal
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from app.core.config import settings
from app.core.security import current_admin
from app.services.cloudinary_service import upload_image

router = APIRouter(prefix="/api/admin/upload", tags=["uploads"], dependencies=[Depends(current_admin)])
SIGNATURES = {"image/jpeg": b"\xff\xd8\xff", "image/png": b"\x89PNG", "image/webp": b"RIFF"}

@router.post("")
def upload(files: list[UploadFile] = File(...), folder: Literal["services", "projects", "gallery"] = "projects"):
    if not 0 < len(files) <= 10:
        raise HTTPException(400, "Upload between 1 and 10 images at a time")
    out = []
    for f in files:
        data = f.file.read(settings.MAX_UPLOAD_BYTES + 1)
        if len(data) > settings.MAX_UPLOAD_BYTES:
            raise HTTPException(413, f"Each image must be under {settings.MAX_UPLOAD_BYTES // 1024 // 1024} MB")
        sig = SIGNATURES.get(f.content_type or "")
        if not sig or not data.startswith(sig):
            raise HTTPException(415, "Only JPG, PNG or WebP images are allowed")
        out.append(upload_image(data, folder))
    return {"files": out}
