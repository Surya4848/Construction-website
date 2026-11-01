from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException

def now() -> datetime:
    return datetime.now(timezone.utc)

def oid(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise HTTPException(404, "Not found")

def serialize(doc):
    if not doc:
        return doc
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    doc.pop("password_hash", None)
    return doc
