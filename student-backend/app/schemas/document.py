from pydantic import BaseModel
from datetime import datetime
from image_upload import AbsoluteUrl
class DocumentResponse(BaseModel):
    id: int
    student_id: int
    doc_type: str
    file_url: AbsoluteUrl
    uploaded_at: datetime

    model_config = {"from_attributes": True}