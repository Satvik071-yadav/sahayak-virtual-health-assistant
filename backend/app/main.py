"""
Virtual Health Assistant for Rural Areas — FastAPI backend entrypoint.
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.db.database import Base, engine
from app.routers import admin, auth, care, chat, content, doctors

# Create all tables (for SQLite/dev; use Alembic migrations in production)
Base.metadata.create_all(bind=engine)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "AI-powered chatbot and telemedicine support platform for people in "
        "rural areas. Provides health education, symptom guidance, "
        "first-aid tips, and doctor appointment booking. This chatbot does "
        "not diagnose diseases."
    ),
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(doctors.router)
app.include_router(content.router)
app.include_router(care.router)
app.include_router(admin.router)


@app.get("/", tags=["Health Check"])
def root():
    return {"status": "ok", "service": settings.APP_NAME}


@app.get("/api/health", tags=["Health Check"])
def health_check():
    return {"status": "healthy"}
