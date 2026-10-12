import logging

from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import settings
from app.database import Base, engine, get_db
from app.knowledge_base import seed_knowledge_base
from app.models_db import Disease, FlaggedImage, PredictionLog
from app.schemas import PredictionResponse, Translation, FlagRequest, FlagResponse
from app import ml_model

logger = logging.getLogger("uvicorn.error")

app = FastAPI(title="Maize Leaf Disease Diagnosis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # Creates tables if they don't exist yet, then seeds the bilingual knowledge base.
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    seed_knowledge_base(db)
    # Try to warm-load the model so the first real request isn't slow.
    # Not fatal if it isn't there yet — /predict will explain clearly instead.
    try:
        ml_model.load_model()
    except Exception as exc:  # noqa: BLE001
        logger.warning("Model warm-load skipped: %s", exc)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionResponse)
async def predict(
    file: UploadFile = File(...),
    lang: str = Query("en", pattern="^(en|rw)$"),
    db: Session = Depends(get_db),
):
    if file.content_type not in ("image/jpeg", "image/png", "image/jpg"):
        raise HTTPException(status_code=400, detail="Please upload a JPEG or PNG image.")

    raw_bytes = await file.read()

    try:
        class_code, confidence = ml_model.predict(raw_bytes)
    except RuntimeError as exc:
        # Model not trained/placed yet — clear error instead of a stack trace.
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    needs_verification = confidence < settings.CONFIDENCE_THRESHOLD

    disease = db.query(Disease).filter(Disease.code == class_code).first()
    if disease is None:
        raise HTTPException(status_code=500, detail="Knowledge base entry missing for predicted class.")

    # Build both languages every time. The frontend switches the displayed
    # language instantly from this payload — it does not need to re-upload
    # the image or call this endpoint again just to change language.
    translations = {
        "en": Translation(
            disease_name=disease.name_en,
            description=disease.symptoms_en,
            recommendation=f"{disease.fungicide_en} {disease.timing_en} {disease.cultural_practices_en}",
        ),
        "rw": Translation(
            disease_name=disease.name_rw,
            description=disease.symptoms_rw,
            recommendation=f"{disease.fungicide_rw} {disease.timing_rw} {disease.cultural_practices_rw}",
        ),
    }

    db.add(
        PredictionLog(
            predicted_class=class_code,
            confidence=confidence,
            needs_verification=needs_verification,
            language=lang,
        )
    )
    db.commit()

    return PredictionResponse(
        predicted_class=class_code,
        confidence=round(confidence, 4),
        needs_verification=needs_verification,
        translations=translations,
    )


@app.post("/flag", response_model=FlagResponse)
def flag_image(payload: FlagRequest, db: Session = Depends(get_db)):
    """Admin/user-facing endpoint: mark an image for possible inclusion in future retraining."""
    record = FlaggedImage(
        filename=payload.filename,
        predicted_class=payload.predicted_class,
        confidence=payload.confidence,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return FlagResponse(id=record.id, status="flagged")