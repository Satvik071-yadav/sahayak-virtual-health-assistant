from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_admin, get_current_user
from app.db.database import get_db
from app.models.records import Appointment
from app.models.user import Doctor, User
from app.schemas.records import AppointmentCreate, AppointmentOut, AppointmentUpdateStatus
from app.schemas.user import DoctorCreate, DoctorOut

router = APIRouter(prefix="/api/doctors", tags=["Doctors & Appointments"])


@router.get("/", response_model=List[DoctorOut])
def list_doctors(specialization: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Doctor).filter(Doctor.available == True)  # noqa: E712
    if specialization:
        query = query.filter(Doctor.specialization.ilike(f"%{specialization}%"))
    return query.all()


@router.post("/", response_model=DoctorOut, status_code=201)
def create_doctor(
    payload: DoctorCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    doctor = Doctor(**payload.model_dump())
    db.add(doctor)
    db.commit()
    db.refresh(doctor)
    return doctor


@router.post("/appointments", response_model=AppointmentOut, status_code=201)
def book_appointment(
    payload: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    doctor = db.query(Doctor).filter(Doctor.id == payload.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    appointment = Appointment(
        patient_id=current_user.id,
        doctor_id=payload.doctor_id,
        scheduled_at=payload.scheduled_at,
        reason=payload.reason,
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


@router.get("/appointments/me", response_model=List[AppointmentOut])
def my_appointments(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return (
        db.query(Appointment)
        .filter(Appointment.patient_id == current_user.id)
        .order_by(Appointment.scheduled_at.desc())
        .all()
    )


@router.patch("/appointments/{appointment_id}/status", response_model=AppointmentOut)
def update_appointment_status(
    appointment_id: int,
    payload: AppointmentUpdateStatus,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appointment.status = payload.status
    db.commit()
    db.refresh(appointment)
    return appointment
