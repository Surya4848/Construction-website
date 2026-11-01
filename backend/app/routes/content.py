from app.routes.crud import build_router
from app.schemas.schemas import ServiceIn, ProjectIn, GalleryIn, TestimonialIn

routers = [
    *build_router("services", ServiceIn, {"active": True}, [("order", 1), ("title", 1)]),
    *build_router("projects", ProjectIn, {}, [("featured", -1), ("created_at", -1)]),
    *build_router("gallery", GalleryIn, {}, [("created_at", -1)]),
    *build_router("testimonials", TestimonialIn, {"published": True}, [("created_at", -1)]),
]
