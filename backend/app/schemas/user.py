"""
Pydantic schemas for User, auth tokens, and Doctor.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.user import UserRole


class UserCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = None
    password: str = Field(..., min_length=6, max_length=128)
    preferred_language: str = "en"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    role: UserRole
    preferred_language: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class DoctorOut(BaseModel):
    id: int
    full_name: str
    specialization: str
    hospital_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    years_experience: int
    rating: float
    available: bool
    consultation_fee: float
    bio: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class DoctorCreate(BaseModel):
    full_name: str
    specialization: str
    hospital_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    years_experience: int = 0
    consultation_fee: float = 0.0
    bio: Optional[str] = None
