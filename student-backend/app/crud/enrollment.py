from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.enrollment import Enrollment
from app.schemas.enrollment import EnrollmentCreate


async def create_enrollment(db: AsyncSession, data: EnrollmentCreate) -> Enrollment:
    enrollment = Enrollment(
        student_id=data.student_id,
        course_id=data.course_id
    )
    db.add(enrollment)
    await db.commit()
    await db.refresh(enrollment)
    return enrollment

async def get_all_enrollments(db: AsyncSession) -> list[Enrollment]:
    
    result = await db.execute(select(Enrollment))
    return result.scalars().all()

async def get_enrollments_by_student(db: AsyncSession, student_id: int) -> list[Enrollment]:
    result = await db.execute(
        select(Enrollment).where(Enrollment.student_id == student_id)
    )
    return result.scalars().all()