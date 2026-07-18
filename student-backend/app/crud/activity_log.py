from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.activity_log import ActivityLog


# Saare logs latest pehle
async def get_all_logs(db: AsyncSession) -> list[ActivityLog]:
    result = await db.execute(
        select(ActivityLog).order_by(ActivityLog.created_at.desc())
    )
    
    return result.scalars().all()


# Sirf student ke saare logs
async def get_all_student_logs(db: AsyncSession) -> list[ActivityLog]:
    result = await db.execute(
        select(ActivityLog)
        .where(
            ActivityLog.student_id != None,
            ActivityLog.course_id == None,
            ActivityLog.document_id == None
        )
        .order_by(ActivityLog.created_at.desc())
    )
    return result.scalars().all()


# Sirf course ke saare logs
async def get_all_course_logs(db: AsyncSession) -> list[ActivityLog]:
    result = await db.execute(
        select(ActivityLog)
        .where(ActivityLog.student_id == None)
        .order_by(ActivityLog.created_at.desc())
    )
    return result.scalars().all()


# Specific student ke logs by student_id
async def get_logs_by_student(db: AsyncSession, student_id: int) -> list[ActivityLog]:
    result = await db.execute(
        select(ActivityLog)
        .where(ActivityLog.student_id == student_id)
        .order_by(ActivityLog.created_at.desc())
    )
    return result.scalars().all()


# Specific course ke logs by course_id
async def get_logs_by_course(db: AsyncSession, course_id: int) -> list[ActivityLog]:
    result = await db.execute(
        select(ActivityLog)
        .where(ActivityLog.course_id == course_id)
        .order_by(ActivityLog.created_at.desc())
    )
    return result.scalars().all()

    