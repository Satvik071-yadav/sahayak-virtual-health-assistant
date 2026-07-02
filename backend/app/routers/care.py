from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_admin, get_current_user
from app.db.database import get_db
from app.models.records import EmergencyContact, MedicineReminder
from app.models.user import User
from app.schemas.records import (
    EmergencyContactCreate,
    EmergencyContactOut,
    MedicineReminderCreate,
    MedicineReminderOut,
)

router = APIRouter(prefix="/api", tags=["Emergency & Reminders"])


# ---------- Emergency Contacts ----------
@router.get("/emergency-contacts", response_model=List[EmergencyContactOut])
def list_emergency_contacts(region: str = "National", db: Session = Depends(get_db)):
    contacts = (
        db.query(EmergencyContact)
        .filter((EmergencyContact.region == region) | (EmergencyContact.region == "National"))
        .all()
    )
    return contacts


@router.post("/emergency-contacts", response_model=EmergencyContactOut, status_code=201)
def create_emergency_contact(
    payload: EmergencyContactCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    contact = EmergencyContact(**payload.model_dump())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


# ---------- Medicine Reminders ----------
@router.get("/reminders", response_model=List[MedicineReminderOut])
def list_reminders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(MedicineReminder)
        .filter(MedicineReminder.user_id == current_user.id, MedicineReminder.active == True)  # noqa: E712
        .all()
    )


@router.post("/reminders", response_model=MedicineReminderOut, status_code=201)
def create_reminder(
    payload: MedicineReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminder = MedicineReminder(user_id=current_user.id, **payload.model_dump())
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return reminder


@router.delete("/reminders/{reminder_id}", status_code=204)
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminder = (
        db.query(MedicineReminder)
        .filter(MedicineReminder.id == reminder_id, MedicineReminder.user_id == current_user.id)
        .first()
    )
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    reminder.active = False
    db.commit()
    return None
