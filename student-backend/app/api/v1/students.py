from fastapi import APIRouter, Depends, HTTPException, Form,File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_pagination import Page, paginate  #new onw
from sqlalchemy.exc import IntegrityError
from typing import Optional
from pydantic import EmailStr

from app.db.session import get_db

from app.schemas.user import StudentCreate, StudentResponse,StudentUpdate
from app.crud import student as crud
from pydantic import TypeAdapter  #new one
from app.core.dependencies import require_principal,require_teacher,require_student
from app.models.user import User
from app.models.document import Document
from app.Utility.storage import save_file_to_disk
from app.models.activity_log import ActivityLog

from app.core.role import Role
router = APIRouter(prefix="/students", tags=["Students"])

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]


#only for student
@router.post("/", response_model=StudentResponse)
async def create_student(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(default="123456"),
    phone: Optional[str] = Form(default=None),
    doc_type: Optional[str] = Form(default=None),      # ← optional
    file: Optional[UploadFile] = File(default=None),   # ← optional
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_principal)
):
    try:
        # Student banao
        from app.schemas.user import StudentCreate as SC
        data = SC(name=name, email=email, password=password, phone=phone)
        student = await crud.create_student(db, data, current_user=current_user)

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

        return student

    except IntegrityError:
        raise HTTPException(status_code=400, detail="Email already exists!")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
#principle +teacher
@router.get("/", response_model=list[StudentResponse])
async def get_all_students(
    db:AsyncSession= Depends(get_db),
    current_user:User=Depends(require_teacher)
):
    try: return await crud.get_all_students(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Principal + Teacher + Student (apna) — single student
@router.get("/{student_id}", response_model= StudentResponse)
async def get_student(
    student_id:int,
    db:AsyncSession= Depends(get_db),
    current_user:User= Depends(require_student)
):
    try:
        student =await crud.get_student_by_id(db, student_id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return student
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

    

# Sirf Principal — update
@router.put("/{studnet_id}", response_model=StudentResponse)
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
        return student
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