import cloudinary, cloudinary.uploader
from fastapi import HTTPException
from app.core.config import settings as s

def upload_image(data: bytes, folder: str) -> dict:
    if not (s.CLOUDINARY_CLOUD_NAME and s.CLOUDINARY_API_KEY and s.CLOUDINARY_API_SECRET):
        raise HTTPException(503, "Image storage is not configured. Set the CLOUDINARY_* variables in backend/.env")
    cloudinary.config(cloud_name=s.CLOUDINARY_CLOUD_NAME, api_key=s.CLOUDINARY_API_KEY, api_secret=s.CLOUDINARY_API_SECRET, secure=True)
    try:
        r = cloudinary.uploader.upload(data, folder=f"jv-construction/{folder}", resource_type="image")
    except Exception:
        raise HTTPException(502, "Image upload failed. Please try again.")
    return {"url": r["secure_url"], "public_id": r["public_id"], "width": r.get("width"), "height": r.get("height")}
