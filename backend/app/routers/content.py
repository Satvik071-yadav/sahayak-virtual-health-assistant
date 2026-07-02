from typing import List

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.deps import get_current_admin
from app.db.database import get_db
from app.models.records import FAQ, HealthArticle
from app.models.user import User
from app.schemas.records import FAQCreate, FAQOut, HealthArticleCreate, HealthArticleOut

router = APIRouter(prefix="/api", tags=["Health Content"])


# ---------- Health Articles ----------
@router.get("/articles", response_model=List[HealthArticleOut])
def list_articles(
    category: str | None = None,
    language: str = "en",
    db: Session = Depends(get_db),
):
    query = db.query(HealthArticle).filter(HealthArticle.language == language)
    if category:
        query = query.filter(HealthArticle.category.ilike(f"%{category}%"))
    return query.order_by(HealthArticle.created_at.desc()).all()


@router.post("/articles", response_model=HealthArticleOut, status_code=201)
def create_article(
    payload: HealthArticleCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    article = HealthArticle(**payload.model_dump())
    db.add(article)
    db.commit()
    db.refresh(article)
    return article


# ---------- FAQs ----------
@router.get("/faqs", response_model=List[FAQOut])
def list_faqs(language: str = "en", db: Session = Depends(get_db)):
    return db.query(FAQ).filter(FAQ.language == language).all()


@router.post("/faqs", response_model=FAQOut, status_code=201)
def create_faq(
    payload: FAQCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    faq = FAQ(**payload.model_dump())
    db.add(faq)
    db.commit()
    db.refresh(faq)
    return faq


# ---------- Health Tools: BMI + Water intake calculators ----------
class BMIRequest(BaseModel):
    weight_kg: float = Field(..., gt=0, le=500)
    height_cm: float = Field(..., gt=0, le=300)


class BMIResponse(BaseModel):
    bmi: float
    category: str


@router.post("/tools/bmi", response_model=BMIResponse)
def calculate_bmi(payload: BMIRequest):
    height_m = payload.height_cm / 100
    bmi = round(payload.weight_kg / (height_m ** 2), 1)
    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Normal weight"
    elif bmi < 30:
        category = "Overweight"
    else:
        category = "Obese"
    return BMIResponse(bmi=bmi, category=category)


class WaterIntakeRequest(BaseModel):
    weight_kg: float = Field(..., gt=0, le=500)
    activity_level: str = Field("moderate", pattern="^(low|moderate|high)$")


class WaterIntakeResponse(BaseModel):
    liters_per_day: float
    glasses_per_day: int


@router.post("/tools/water-intake", response_model=WaterIntakeResponse)
def calculate_water_intake(payload: WaterIntakeRequest):
    base_ml = payload.weight_kg * 33  # ~33ml per kg body weight, common guideline
    multiplier = {"low": 1.0, "moderate": 1.1, "high": 1.25}[payload.activity_level]
    liters = round((base_ml * multiplier) / 1000, 2)
    glasses = round((liters * 1000) / 250)  # assume 250ml glass
    return WaterIntakeResponse(liters_per_day=liters, glasses_per_day=glasses)
