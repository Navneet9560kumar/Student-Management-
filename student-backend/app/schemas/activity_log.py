from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ActivityLogResponse(BaseModel):
    id: int
    student_id: Optional[int] = None
    course_id: Optional[int] = None 
    action_type: str
    description: Optional[str] = None
    changes: Optional[dict] = None  
    status: str
    performed_by_id: Optional[int] = None      
    performed_by_name: Optional[str] = None    
    performed_by_role: Optional[str] = None 
    created_at: datetime

    model_config = {"from_attributes": True}




#     docker exec -it student-backend-app-1 bash
# alembic revision --autogenerate -m "add performed_by to activity_logs"
# alembic upgrade head