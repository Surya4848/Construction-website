from pymongo import MongoClient
from app.core.config import settings

client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000, tz_aware=True)
db = client[settings.DB_NAME]

def init_indexes() -> None:
    db.admins.create_index("email", unique=True)
    db.services.create_index([("category", 1), ("order", 1)])
    db.projects.create_index([("featured", -1), ("created_at", -1)])
    db.gallery.create_index([("category", 1), ("created_at", -1)])
    db.enquiries.create_index([("status", 1), ("created_at", -1)])
    db.testimonials.create_index([("published", 1), ("created_at", -1)])
