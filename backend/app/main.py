from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.mongo import client, init_indexes
from app.routes import auth, dashboard, enquiries, settings as site_settings, upload
from app.routes.content import routers as content_routers

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_indexes()
    yield
    client.close()

app = FastAPI(title="JV CONSTRUCTION API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.CORS_ORIGINS, allow_credentials=False,
                   allow_methods=["GET", "POST", "PUT", "DELETE"], allow_headers=["Authorization", "Content-Type"])
for r in [auth.router, dashboard.router, enquiries.public, enquiries.admin, site_settings.router, upload.router, *content_routers]:
    app.include_router(r)

@app.get("/api/health", tags=["health"])
def health():
    client.admin.command("ping")
    return {"status": "ok"}
