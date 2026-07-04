from pydantic  import BaseModel, EmailStr ## yeh email validate karta hai
from datetime import datetime
from typing import Optional

class StudentCreate(BaseModel):
      name :str
      email: EmailStr
      phone : Optional[str]= None

class StudentUpdate(BaseModel):
      name : Optional[str] = None
      email : Optional[EmailStr] = None
      phone : Optional[str] = None
      is_active: Optional[bool] = None
      photo_url: Optional[str] = None 

class StudentResponse(BaseModel):
      id: int
      name:str
      email: str
      phone: Optional[str] = None
      photo_url: Optional[str] = None
      is_active: bool
      created_at : datetime

      model_config = {"from_attributes": True}


