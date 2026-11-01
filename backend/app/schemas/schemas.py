import re
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

URL_RE = re.compile(r"^https?://\S+$")
def _url(v: str) -> str:
    if v and not URL_RE.match(v):
        raise ValueError("Must be a valid http(s) URL")
    return v

class Base(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="ignore")

Category = Literal["Residential", "Commercial", "Civil Works", "Detailing", "Other"]
EnquiryStatus = Literal["New", "Contacted", "In Progress", "Completed"]

class LoginIn(Base):
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)

class ProfileIn(Base):
    name: str = Field(min_length=2, max_length=80)
    current_password: Optional[str] = Field(default=None, max_length=200)
    new_password: Optional[str] = Field(default=None, min_length=12, max_length=200)

class ServiceIn(Base):
    title: str = Field(min_length=2, max_length=120)
    category: Literal["civil", "planning", "detailing"]
    description: str = Field(min_length=2, max_length=600)
    image_url: str = Field(default="", max_length=600)
    order: int = Field(default=0, ge=0, le=9999)
    active: bool = True
    _u = field_validator("image_url")(_url)

class ProjectIn(Base):
    title: str = Field(min_length=2, max_length=120)
    category: Category
    location: str = Field(default="", max_length=120)
    description: str = Field(min_length=2, max_length=2000)
    images: list[str] = Field(default_factory=list, max_length=20)
    featured: bool = False
    @field_validator("images")
    @classmethod
    def _imgs(cls, v): return [_url(i) for i in v]

class GalleryIn(Base):
    title: str = Field(default="", max_length=120)
    category: Category = "Other"
    image_url: str = Field(min_length=8, max_length=600)
    _u = field_validator("image_url")(_url)

class TestimonialIn(Base):
    name: str = Field(min_length=2, max_length=80)
    role: str = Field(default="", max_length=120)
    text: str = Field(min_length=5, max_length=1000)
    published: bool = False

class EnquiryIn(Base):
    name: str = Field(min_length=2, max_length=80)
    phone: str = Field(pattern=r"^[0-9+\-\s()]{7,20}$")
    email: Optional[EmailStr] = None
    service: str = Field(default="", max_length=120)
    message: str = Field(min_length=2, max_length=2000)
    @field_validator("email", mode="before")
    @classmethod
    def _blank(cls, v): return v or None

class EnquiryStatusIn(Base):
    status: EnquiryStatus

class Socials(Base):
    facebook: str = Field(default="", max_length=300)
    instagram: str = Field(default="", max_length=300)
    linkedin: str = Field(default="", max_length=300)
    youtube: str = Field(default="", max_length=300)
    _u = field_validator("facebook", "instagram", "linkedin", "youtube")(_url)

class SettingsIn(Base):
    business_name: str = Field(min_length=2, max_length=120)
    tagline: str = Field(default="", max_length=200)
    phone: str = Field(default="", pattern=r"^[0-9+\-\s()]{0,20}$")
    whatsapp: str = Field(default="", pattern=r"^(\d{8,15})?$")
    email: str = Field(default="", max_length=160)
    address: str = Field(default="", max_length=400)
    socials: Socials = Socials()
    @field_validator("email")
    @classmethod
    def _email(cls, v):
        if v and not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", v): raise ValueError("Invalid email")
        return v
