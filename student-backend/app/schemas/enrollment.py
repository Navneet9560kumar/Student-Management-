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
    status: Optional[str] = None          
    enrolled_at: Optional[datetime] = None  

    model_config = {"from_attributes": True}
