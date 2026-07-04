from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.activity_log import ActivityLogResponse
from app.crud import activity_log as crud

router = APIRouter(prefix="/logs", tags=["Activity Logs"])

# Saare logs
@router.get("/", response_model=list[ActivityLogResponse])
async def get_all_logs(db: AsyncSession = Depends(get_db)):
    try:
        return await crud.get_all_logs(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Specific student ke logs ← pehle rakho!
@router.get("/students/{student_id}", response_model=list[ActivityLogResponse])
async def get_logs_by_student(student_id: int, db: AsyncSession = Depends(get_db)):
    try:
        return await crud.get_logs_by_student(db, student_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Sirf student logs ← baad mein!
@router.get("/students", response_model=list[ActivityLogResponse])
async def get_student_logs(db: AsyncSession = Depends(get_db)):
    try:
        return await crud.get_all_student_logs(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Specific course ke logs
@router.get("/courses/{course_id}", response_model=list[ActivityLogResponse])
async def get_logs_by_course(course_id: int, db: AsyncSession = Depends(get_db)):
    try:
        return await crud.get_logs_by_course(db, course_id)  # ← get_logs_by_course!
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Sirf course logs
@router.get("/courses", response_model=list[ActivityLogResponse])
async def get_course_logs(db: AsyncSession = Depends(get_db)):
    try:
        return await crud.get_all_course_logs(db)  # ← get_all_course_logs!
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))