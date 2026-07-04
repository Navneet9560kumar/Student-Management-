from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.document import Document
from app.models.activity_log import ActivityLog

# log helper 

async def  create_log(db: AsyncSession, action_type: str, description: str, document_id: int = None, changes: dict = None):
    log = ActivityLog(
        action_type=action_type,
        description=description,
        document_id=document_id,
        status="success",
        changes=changes
    )
    db.add(log)
    await db.commit()

    # Document upload


async def create_document(db: AsyncSession, student_id: int, doc_type:str, file_yrl:str)-> Document:
      document = Document(
            student_id=student_id,
            doc_type=doc_type,
            file_url=file_yrl
      )
      db.add(document)
      await db.commit() 
      await db.refresh(document)
      
      # log create
async def get_document_by_student(db:AsyncSession, student_id:int)-> list[Document]:
      result = await db.execute(
      select (Document).where(Document.student_id==student_id)
      ) 
      return result.scalars().all()


# document delete

async def delete_document(db:AsyncSession, document_id:int)->bool:
     result = await db.execute(select(Document).where(Document.id== document_id))
     document = result.scalar_one_or_none()
     if not document: return False

     student_id = document.student_id
     doc_type = document.doc_type

     await db.delete(document)
     await db.commit()

     await create_log(db, "DELETE", f"Document '{doc_type}' deleted for student ID {student_id}", student_id, document_id= document_id)
     return True
    