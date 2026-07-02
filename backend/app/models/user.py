"""
User and Doctor database models.
"""
import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Float
from sqlalchemy.orm import relationship

from app.db.database import Base


class UserRole(str, enum.Enum):
    patient = "patient"
    doctor = "doctor"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.patient, nullable=False)
    preferred_language = Column(String(10), default="en")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    messages = relationship("Message", back_populates="user", cascade="all, delete-orphan")
    appointments = relationship(
        "Appointment", back_populates="patient", cascade="all, delete-orphan"
    )
    reminders = relationship(
        "MedicineReminder", back_populates="user", cascade="all, delete-orphan"
    )


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    specialization = Column(String(120), nullable=False)
    hospital_name = Column(String(150), nullable=True)
    phone = Column(String(20), nullable=True)
    email = Column(String(150), nullable=True)
    years_experience = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    available = Column(Boolean, default=True)
    consultation_fee = Column(Float, default=0.0)
    bio = Column(String(1000), nullable=True)

    appointments = relationship("Appointment", back_populates="doctor")
