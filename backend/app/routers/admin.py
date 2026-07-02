from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.deps import get_current_admin
from app.db.database import get_db
from app.models.records import Appointment, Message
from app.models.user import Doctor, User
from app.schemas.records import ChatMessageOut
from app.schemas.user import UserOut

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/users", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), _admin: User = Depends(get_current_admin)):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.get("/users/{user_id}/chat-history", response_model=List[ChatMessageOut])
def user_chat_history(
    user_id: int, db: Session = Depends(get_db), _admin: User = Depends(get_current_admin)
):
    return (
        db.query(Message)
        .filter(Message.user_id == user_id)
        .order_by(Message.created_at.asc())
        .all()
    )


class AnalyticsResponse(BaseModel):
    total_users: int
    total_doctors: int
    total_appointments: int
    total_chat_messages: int
    appointments_by_status: dict


@router.get("/analytics", response_model=AnalyticsResponse)
def analytics(db: Session = Depends(get_db), _admin: User = Depends(get_current_admin)):
    total_users = db.query(func.count(User.id)).scalar()
    total_doctors = db.query(func.count(Doctor.id)).scalar()
    total_appointments = db.query(func.count(Appointment.id)).scalar()
    total_chat_messages = db.query(func.count(Message.id)).scalar()

    status_counts = (
        db.query(Appointment.status, func.count(Appointment.id))
        .group_by(Appointment.status)
        .all()
    )
    appointments_by_status = {status.value: count for status, count in status_counts}

    return AnalyticsResponse(
        total_users=total_users,
        total_doctors=total_doctors,
        total_appointments=total_appointments,
        total_chat_messages=total_chat_messages,
        appointments_by_status=appointments_by_status,
    )
