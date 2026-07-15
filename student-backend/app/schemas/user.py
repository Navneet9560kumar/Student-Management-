from pydantic import BaseModel, EmailStr
from app.core.role import Role
from datetime import datetime
from typing import Optional

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role = Role.STUDENT

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str] = None       
    photo_url: Optional[str] = None   
    role: str
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None             

    model_config = {"from_attributes": True}

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Student Specific Schemas 
class StudentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = "123456"
    phone: Optional[str] = None
    photo_url: Optional[str] = None
    role: Role = Role.STUDENT

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    photo_url: Optional[str] = None  
    is_active: Optional[bool] = None

StudentResponse = UserResponse