from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CourseCreate(BaseModel):
    name: str
    description: Optional[str] = None
    duration_months: int

class CourseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration_months: Optional[int] = None
    is_active: Optional[bool] = None

# ← Sirf ek CourseResponse rakho!
class CourseResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    duration_months: int
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}