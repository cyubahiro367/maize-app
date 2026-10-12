from pydantic import BaseModel


class Translation(BaseModel):
    disease_name: str
    description: str
    recommendation: str


class PredictionResponse(BaseModel):
    predicted_class: str
    confidence: float
    needs_verification: bool
    # Both languages come back in one response so the frontend can switch
    # the display language instantly without re-uploading the image.
    translations: dict[str, Translation]


class FlagRequest(BaseModel):
    filename: str
    predicted_class: str
    confidence: float


class FlagResponse(BaseModel):
    id: int
    status: str