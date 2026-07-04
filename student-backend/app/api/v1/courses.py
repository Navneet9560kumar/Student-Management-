# courses.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.course import CourseCreate, CourseResponse, CourseUpdate
from app.crud import course as crud

router = APIRouter(prefix="/courses", tags=["Courses"])

from sqlalchemy.exc import IntegrityError

@router.post("/", response_model=CourseResponse)
async def create_course(data: CourseCreate, db: AsyncSession = Depends(get_db)):
    try:
        return await crud.create_course(db, data)
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Course already exists!")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=list[CourseResponse])
async def get_all_courses(db: AsyncSession = Depends(get_db)):
    try:
        return await crud.get_all_courses(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(course_id: int, db: AsyncSession = Depends(get_db)):
    try:
        course = await crud.get_course_by_id(db, course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return course
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(course_id: int, data: CourseUpdate, db: AsyncSession = Depends(get_db)):
    try:
        course = await crud.update_course(db, course_id, data)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return course
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{course_id}")
async def delete_course(course_id: int, db: AsyncSession = Depends(get_db)):
    try:
        success = await crud.delete_course(db, course_id)
        if not success:
            raise HTTPException(status_code=404, detail="Course not found")
        return {"message": "Course deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))