from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean
from sqlalchemy.sql import func

from app.database import Base


class Disease(Base):
    """RAB-aligned knowledge base entry for each of the 4 classes."""

    __tablename__ = "diseases"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)  # e.g. "grey_leaf_spot"
    name_en = Column(String(255), nullable=False)
    name_rw = Column(String(255), nullable=False)
    causal_organism = Column(String(255))
    symptoms_en = Column(Text)
    symptoms_rw = Column(Text)
    fungicide_en = Column(Text)
    fungicide_rw = Column(Text)
    timing_en = Column(Text)
    timing_rw = Column(Text)
    cultural_practices_en = Column(Text)
    cultural_practices_rw = Column(Text)
    resistant_varieties_en = Column(Text)
    resistant_varieties_rw = Column(Text)


class FlaggedImage(Base):
    """Images flagged by users/admin for possible inclusion in future retraining."""

    __tablename__ = "flagged_images"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    predicted_class = Column(String(50))
    confidence = Column(Float)
    reviewed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PredictionLog(Base):
    """Every prediction served, for later analysis (accuracy monitoring, usage stats)."""

    __tablename__ = "prediction_logs"

    id = Column(Integer, primary_key=True, index=True)
    predicted_class = Column(String(50))
    confidence = Column(Float)
    needs_verification = Column(Boolean, default=False)
    language = Column(String(5), default="en")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
