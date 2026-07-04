from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EnrollmentCreate(BaseModel):
      student_id:int
      course_id: int

class EnrollmentResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    status: str
    enrolled_at: datetime

    model_config = {"from_attributes": True}  # ← module_config nahi, model_config!
