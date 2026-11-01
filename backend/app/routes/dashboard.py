from fastapi import APIRouter, Depends
from app.core.security import current_admin
from app.database.mongo import db
from app.models.base import serialize

router = APIRouter(prefix="/api/admin/dashboard", tags=["dashboard"], dependencies=[Depends(current_admin)])

@router.get("")
def overview():
    recent = lambda c, n=5: [serialize(d) for d in db[c].find({}).sort("created_at", -1).limit(n)]
    return {
        "total_projects": db.projects.count_documents({}),
        "total_services": db.services.count_documents({}),
        "total_enquiries": db.enquiries.count_documents({}),
        "pending_enquiries": db.enquiries.count_documents({"status": "New"}),
        "recent_enquiries": recent("enquiries"),
        "recent_projects": recent("projects"),
    }
