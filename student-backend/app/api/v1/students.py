from fastapi import APIRouter, Depends, HTTPException, Form,File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy.exc import IntegrityError
from typing import Optional
from pydantic import EmailStr
import time

from app.db.session import get_db

from app.schemas.user import StudentCreate, StudentResponse,StudentUpdate
from app.crud import student as crud
from pydantic import TypeAdapter  #new one
from app.core.dependencies import require_principal,require_teacher,require_student,get_current_user
from app.models.user import User
from app.models.document import Document
from app.Utility.storage import save_file_to_disk
from app.models.activity_log import ActivityLog

from app.core.role import Role
router = APIRouter(prefix="/students", tags=["Students"])

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]


# GET All Students (Principal + Teacher)
@router.get("/", response_model=list[StudentResponse])
async def get_all_students(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_teacher)
):
   
    try: 
        return await crud.get_all_students(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @router.get("/", response_model=list[StudentResponse])  # new wala hia ye 
# async def get_all_students(
#     db: AsyncSession = Depends(get_db),
#     current_user: User = Depends(require_teacher)
# ):
#     print("\n--- 🚀 API HIT HUI ---")
#     start_time = time.time()

#     try: 
#         # 1. Database se data lao
#         db_start = time.time()
#         students = await crud.get_all_students(db)
#         print(f"⏱️ DB Query Time: {time.time() - db_start:.4f} seconds")
        
#         # 2. Total time check
#         print(f"⏱️ Total Time Inside API: {time.time() - start_time:.4f} seconds")
#         print("--- ✅ SENDING RESPONSE ---\n")
        
#         return students
        
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# student ke id ko  get karna 
@router.get("/{student_id}", response_model=StudentResponse)
async def get_student_by_id_(
    student_id:int,
    db:AsyncSession =Depends(get_db),
    current_user: User = Depends(require_teacher)
):
    try:
        student = await crud.get_student_by_id(db, student_id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return student
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#only for student

@router.post("/", response_model=StudentResponse)
async def create_student(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(default="123456"),
    phone: Optional[str] = Form(default=None),
    doc_type: Optional[str] = Form(default=None),      
    file: Optional[UploadFile] = File(default=None),   
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_principal)
):
    print("mai banane jaa raha  jaa raha hu ")
    try:
        # Student banao
        print("ban gaya kay ")
        from app.schemas.user import StudentCreate as SC
        data = SC(name=name, email=email, password=password, phone=phone)
        student = await crud.create_student(db, data, current_user=current_user)
        print("ban gaya")
        
        # Document upload — optional!
        if file and doc_type:
            if file.content_type not in ALLOWED_TYPES:
                raise HTTPException(status_code=400, detail="Only JPG, PNG, PDF allowed!")

            file_bytes = await file.read()

            unique_name, file_url = save_file_to_disk(
                file_bytes, file.filename, folder=f"student_{student.id}"
            )

            document = Document(
                student_id=student.id,
                doc_type=doc_type,
                file_url=file_url
            )
            db.add(document)
            await db.commit()

            # Document log
            log = ActivityLog(
                action_type="UPLOAD",
                description=f"Document '{doc_type}' uploaded during student creation",
                student_id=student.id,
                document_id=document.id,
                performed_by_id=current_user.id,
                performed_by_name=current_user.name,
                performed_by_role=current_user.role,
                status="success"
            )
            db.add(log)
            await db.commit()

       
        student_with_data = await crud.get_student_by_id(db, student.id)
        return student_with_data

    except IntegrityError:
        raise HTTPException(status_code=400, detail="Email already exists!")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    

# Sirf Principal — update
@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id:int,
    data: StudentUpdate,
    db:AsyncSession =Depends(get_db),
    current_user:User= Depends(require_principal)

):
    try:
        student = await crud.update_student(db, student_id, data,current_user=current_user)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
          
        student_with_data  = await crud.get_student_by_id(db, student_id)
      

        

        return student_with_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

#delete
@router.delete("/{student_id}")
async def delete_student(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_principal)
):
    try:
        success = await crud.delete_student(db, student_id, current_user=current_user)
        if not success:
            raise HTTPException(status_code=404, detail="Student not found")
        return {"message": "Student deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Get own profile (for any authenticated user, including students)
@router.get("/me", response_model=StudentResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    """Get current user's profile if they're a student"""
    if current_user.role != Role.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can access this endpoint")
    return current_user