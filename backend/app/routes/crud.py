from fastapi import APIRouter, Depends, HTTPException
from app.core.security import current_admin
from app.database.mongo import db
from app.models.base import now, oid, serialize

def build_router(name: str, schema, public_filter: dict, sort: list):
    pub = APIRouter(prefix=f"/api/{name}", tags=[name])
    adm = APIRouter(prefix=f"/api/admin/{name}", tags=[f"admin-{name}"], dependencies=[Depends(current_admin)])
    col = db[name]

    @pub.get("")
    def list_public():
        return [serialize(d) for d in col.find(public_filter).sort(sort)]

    @adm.get("")
    def list_all():
        return [serialize(d) for d in col.find({}).sort(sort)]

    @adm.post("", status_code=201)
    def create(body: schema):
        doc = {**body.model_dump(), "created_at": now(), "updated_at": now()}
        return serialize(col.find_one({"_id": col.insert_one(doc).inserted_id}))

    @adm.put("/{item_id}")
    def update(item_id: str, body: schema):
        doc = col.find_one_and_update({"_id": oid(item_id)}, {"$set": {**body.model_dump(), "updated_at": now()}}, return_document=True)
        if not doc:
            raise HTTPException(404, "Not found")
        return serialize(doc)

    @adm.delete("/{item_id}", status_code=204)
    def delete(item_id: str):
        if not col.delete_one({"_id": oid(item_id)}).deleted_count:
            raise HTTPException(404, "Not found")

    return [pub, adm]
