from pydantic import BaseModel
from datetime import datetime

class DocumentResponse(BaseModel):
    id: int
    student_id: int
    doc_type: str
    file_url: str  # ← simple str!
    uploaded_at: datetime

    model_config = {"from_attributes": True}