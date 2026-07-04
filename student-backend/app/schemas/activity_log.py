from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ActivityLogResponse(BaseModel):
    id: int
    student_id: Optional[int] = None
    course_id: Optional[int] = None  # ← add  kar deya 
    action_type: str
    description: Optional[str] = None
    changes: Optional[dict] = None  
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}