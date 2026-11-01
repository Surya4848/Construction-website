from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from app.core.ratelimit import limiter
from app.core.security import current_admin
from app.database.mongo import db
from app.models.base import now, oid, serialize
from app.schemas.schemas import EnquiryIn, EnquiryStatusIn, EnquiryStatus

public = APIRouter(prefix="/api/enquiries", tags=["enquiries"])
admin = APIRouter(prefix="/api/admin/enquiries", tags=["admin-enquiries"], dependencies=[Depends(current_admin)])

@public.post("", status_code=201, dependencies=[Depends(limiter(5, 600))])
def submit(body: EnquiryIn):
    db.enquiries.insert_one({**body.model_dump(), "status": "New", "created_at": now(), "updated_at": now()})
    return {"message": "Enquiry received"}

@admin.get("")
def list_enquiries(status: Optional[EnquiryStatus] = None):
    return [serialize(d) for d in db.enquiries.find({"status": status} if status else {}).sort("created_at", -1).limit(500)]

@admin.put("/{item_id}")
def set_status(item_id: str, body: EnquiryStatusIn):
    doc = db.enquiries.find_one_and_update({"_id": oid(item_id)}, {"$set": {"status": body.status, "updated_at": now()}}, return_document=True)
    if not doc:
        raise HTTPException(404, "Not found")
    return serialize(doc)

@admin.delete("/{item_id}", status_code=204)
def delete_enquiry(item_id: str):
    if not db.enquiries.delete_one({"_id": oid(item_id)}).deleted_count:
        raise HTTPException(404, "Not found")
