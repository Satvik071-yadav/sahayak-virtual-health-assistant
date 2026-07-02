from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, ConfigDict, Field

from app.models.records import AppointmentStatus, SenderType


# ---------- Chat ----------
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    language: str = "en"


class ChatMessageOut(BaseModel):
    id: int
    sender: SenderType
    content: str
    language: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ChatResponse(BaseModel):
    reply: str
    escalate_to_emergency: bool = False
    history: List[ChatMessageOut] = []


# ---------- Appointments ----------
class AppointmentCreate(BaseModel):
    doctor_id: int
    scheduled_at: datetime
    reason: Optional[str] = None


class AppointmentOut(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    scheduled_at: datetime
    reason: Optional[str] = None
    status: AppointmentStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AppointmentUpdateStatus(BaseModel):
    status: AppointmentStatus


# ---------- Health Articles ----------
class HealthArticleCreate(BaseModel):
    title: str
    category: str
    content: str
    summary: Optional[str] = None
    image_url: Optional[str] = None
    language: str = "en"


class HealthArticleOut(HealthArticleCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------- FAQ ----------
class FAQCreate(BaseModel):
    question: str
    answer: str
    category: str = "General"
    language: str = "en"


class FAQOut(FAQCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


# ---------- Medicine Reminders ----------
class MedicineReminderCreate(BaseModel):
    medicine_name: str
    dosage: Optional[str] = None
    time_of_day: str
    notes: Optional[str] = None


class MedicineReminderOut(MedicineReminderCreate):
    id: int
    user_id: int
    active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------- Emergency Contacts ----------
class EmergencyContactOut(BaseModel):
    id: int
    label: str
    phone_number: str
    region: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class EmergencyContactCreate(BaseModel):
    label: str
    phone_number: str
    region: str = "National"
    description: Optional[str] = None
