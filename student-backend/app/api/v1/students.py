from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_pagination import Page, paginate  #new onw
from sqlalchemy.exc import IntegrityError

from app.db.session import get_db
from app.schemas.student import StudentCreate, StudentResponse, StudentUpdate
from app.crud import student as crud
from pydantic import TypeAdapter  #new one
router = APIRouter(prefix="/students", tags=["Students"])

@router.post("/", response_model=StudentResponse)
async def create_student(data: StudentCreate, db: AsyncSession = Depends(get_db)):
    try:
        return await crud.create_student(db, data)
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Email already exists!")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ data:StudentCreate hata diya — GET mein body nahi hoti!
# ✅ crud.get_all_students call kiya — create nahi!
@router.get("/", response_model=list[StudentResponse])
async def get_all_students(db: AsyncSession = Depends(get_db)):
    try:
        return await crud.get_all_students(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


    
# @router.get("/")
# async def get_all_students(db: AsyncSession = Depends(get_db)) -> Page[StudentResponse]:

#     try:
#         stu = await crud.get_all_students(db)
       
#         # return paginate(StudentResponse.model_validate(stu))
#         return paginate(TypeAdapter(list[StudentResponse]).validate_python(
#             stu
#         ))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# ✅ return get_student_by_id — get_all_students nahi!
@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(student_id: int, db: AsyncSession = Depends(get_db)):
    try:
        student = await crud.get_student_by_id(db, student_id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return student
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(student_id: int, data: StudentUpdate, db: AsyncSession = Depends(get_db)):
    try:
        student = await crud.update_student(db, student_id, data)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return student
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{student_id}")
async def delete_student(student_id: int, db: AsyncSession = Depends(get_db)):
    try:
        success = await crud.delete_student(db, student_id)
        if not success:
            raise HTTPException(status_code=404, detail="Student not found")
        return {"message": "Student deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))