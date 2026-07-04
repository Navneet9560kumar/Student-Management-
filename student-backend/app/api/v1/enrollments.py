  # enrollment routes

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.enrollment import EnrollmentCreate, EnrollmentResponse
from app.crud import enrollment as curd

router = APIRouter(prefix= "/enrollments", tags=["Enrollments"])

@router.post("/", response_model=EnrollmentResponse)
async def create_enrollment(data:EnrollmentCreate, db: AsyncSession= Depends(get_db)):
      return await curd.create_enrollment(db, data)

@router.get("/", response_model=list[EnrollmentResponse])
async def get_all_enrollments(db:AsyncSession= Depends(get_db)):
      return await curd.get_all_enrollments(db)

@router.get("/student/{student_id}", response_model=list[EnrollmentResponse])
async def get_student_enrollments(student_id: int, db: AsyncSession = Depends(get_db)):
    return await curd.get_enrollments_by_student(db, student_id)
