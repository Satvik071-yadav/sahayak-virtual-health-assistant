"""
Remaining domain models: Appointments, Messages, Health Articles, FAQs,
Notifications, Medicine Reminders, Emergency Contacts.
"""
import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class AppointmentStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    reason = Column(String(500), nullable=True)
    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.pending)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("User", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")


class SenderType(str, enum.Enum):
    user = "user"
    bot = "bot"


class Message(Base):
    """Chatbot conversation history, used for chatbot memory."""
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sender = Column(Enum(SenderType), nullable=False)
    content = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="messages")


class HealthArticle(Base):
    __tablename__ = "health_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)  # e.g. Women Health, Child Health
    content = Column(Text, nullable=False)
    summary = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)


class FAQ(Base):
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String(300), nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String(100), default="General")
    language = Column(String(10), default="en")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    body = Column(String(500), nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class MedicineReminder(Base):
    __tablename__ = "medicine_reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    medicine_name = Column(String(150), nullable=False)
    dosage = Column(String(100), nullable=True)
    time_of_day = Column(String(50), nullable=False)  # e.g. "08:00, 20:00"
    notes = Column(String(300), nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reminders")


class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(100), nullable=False)  # e.g. "Ambulance", "Police"
    phone_number = Column(String(20), nullable=False)
    region = Column(String(100), default="National")
    description = Column(String(300), nullable=True)
