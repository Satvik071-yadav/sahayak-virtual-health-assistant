from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.database import get_db
from app.models.records import Message, SenderType
from app.models.user import User
from app.schemas.records import ChatRequest, ChatResponse, ChatMessageOut
from app.services.chatbot import generate_reply

router = APIRouter(prefix="/api/chat", tags=["Chatbot"])


@router.post("/", response_model=ChatResponse)
def chat(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Load recent history for conversation memory
    past_messages = (
        db.query(Message)
        .filter(Message.user_id == current_user.id)
        .order_by(Message.created_at.desc())
        .limit(20)
        .all()
    )
    past_messages.reverse()
    history = [(m.sender.value, m.content) for m in past_messages]

    # Save the user's message
    user_msg = Message(
        user_id=current_user.id,
        sender=SenderType.user,
        content=payload.message,
        language=payload.language,
    )
    db.add(user_msg)
    db.commit()

    reply_text, escalate = generate_reply(payload.message, payload.language, history)

    bot_msg = Message(
        user_id=current_user.id,
        sender=SenderType.bot,
        content=reply_text,
        language=payload.language,
    )
    db.add(bot_msg)
    db.commit()

    full_history = (
        db.query(Message)
        .filter(Message.user_id == current_user.id)
        .order_by(Message.created_at.asc())
        .all()
    )

    return ChatResponse(
        reply=reply_text,
        escalate_to_emergency=escalate,
        history=[ChatMessageOut.model_validate(m) for m in full_history],
    )


@router.get("/history", response_model=list[ChatMessageOut])
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    messages = (
        db.query(Message)
        .filter(Message.user_id == current_user.id)
        .order_by(Message.created_at.asc())
        .all()
    )
    return messages
