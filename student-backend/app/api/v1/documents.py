import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.Utility.storage import save_file_to_disk
from app.models.document import Document
from app.models.activity_log import ActivityLog
from app.schemas.document import DocumentResponse
from sqlalchemy import select, update
from app.core.dependencies import require_principal
from app.models.user import User
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/documents", tags=["Documents"])

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
MAX_SIZE = 5 * 1024 * 1024  # 5MB


# Log helper
# Updated Log helper
async def create_log(
    db: AsyncSession, 
    action_type: str, 
    description: str, 
    student_id: int = None, 
    document_id: int = None,
    performed_by_id: int = None,    
    performed_by_name: str = None,
    performed_by_role: str = None
):
    log = ActivityLog(
        action_type=action_type,
        description=description,
        student_id=student_id,
        document_id=document_id,
        performed_by_id=performed_by_id,      
        performed_by_name=performed_by_name,
        performed_by_role=performed_by_role,
        status="success"
    )
    db.add(log)
    await db.commit()


# Upload document
@router.post("/{student_id}/upload", response_model=DocumentResponse)
async def upload_document(
    student_id: int,
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
     current_user: User = Depends(get_current_user) 
):
    try:
        if current_user.role== "student" and current_user.id !=student_id:
            raise HTTPException(status_code=403, detail="you can only see your document ")




        if file.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Only JPG, PNG, PDF allowed!")

        file_bytes = await file.read()

        if len(file_bytes) > MAX_SIZE:
            raise HTTPException(status_code=400, detail="File too large! Max 5MB.")

        # Disk pe save
        unique_name, file_url = save_file_to_disk(
            file_bytes, file.filename, folder=f"student_{student_id}"
        )

        # DB mein save
        document = Document(
            student_id=student_id,
            doc_type=doc_type,
            file_url=file_url  # ← file_url use karo, file_path nahi!
        )
        db.add(document)
        await db.commit()
        await db.refresh(document)

        await create_log(
            db,
            action_type="UPLOAD",
            description=f"Student uploaded '{doc_type}'",
            student_id=student_id,
            document_id=document.id,
            performed_by_id=current_user.id,        
            performed_by_name=current_user.name,    
            performed_by_role=current_user.role
        )

        return document

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Student ke saare documents
@router.get("/{student_id}", response_model=list[DocumentResponse])
async def get_student_documents(student_id: int, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(
            select(Document).where(Document.student_id == student_id)
        )
        return result.scalars().all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Document delete
# Document delete
@router.delete("/{document_id}")
async def delete_document(
    document_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)  # 🔥 Yeh add karna zaroori tha!
):
    try:
        result = await db.execute(
            select(Document).where(Document.id == document_id)
        )
        document = result.scalar_one_or_none()
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        #  Security: Student sirf apna document delete kar paye
        if current_user.role == "student" and current_user.id != document.student_id:
            raise HTTPException(status_code=403, detail="You can only delete your own document")

        student_id = document.student_id
        doc_type = document.doc_type

        # Disk se delete - Safest relative path
        file_path = document.file_url.lstrip("/") 
        
        if os.path.exists(file_path):
            os.remove(file_path)
        else:
            print("Warning: File disk par nahi mili, par DB se hata rahe hain.")

        # 👇
        # Document delete karne se pehle Activity Logs se iska connection hata do taaki Foreign Key error na aaye
        await db.execute(
            update(ActivityLog)
            .where(ActivityLog.document_id == document_id)
            .values(document_id=None)
        )


        await db.delete(document)
        await db.commit()

        # Log banao
        await create_log(
            db,
            action_type="DELETE",
            description=f"Student deleted '{doc_type}'",
            student_id=student_id,
            document_id=document_id,
            performed_by_id=current_user.id,        # Ab kisne delete kiya wo log hoga
            performed_by_name=current_user.name,
            performed_by_role=current_user.role
        )

        return {"message": "Document deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Backend Delete Error: {str(e)}") # Terminal mein error dekhne ke liye
        raise HTTPException(status_code=500, detail=str(e))