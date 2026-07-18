from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.enrollment import Enrollment
from app.schemas.enrollment import EnrollmentCreate
from sqlalchemy.orm import joinedload

async def create_enrollment(db: AsyncSession, data: EnrollmentCreate)-> Enrollment:
      enrollment = Enrollment(
            student_id = data.student_id,
            course_id = data.course_id
      )
      db.add(enrollment)
      await db.commit()
      await db.refresh(enrollment)
      return enrollment

async def get_all_enrollments(db: AsyncSession) -> list[Enrollment]:
    result = await db.execute(
         select(Enrollment)
         .options(
              joinedload(Enrollment.student), # Student ki details leyega
              joinedload(Enrollment.course) #courses ki details layega
           )
         )
    return result.unique().scalars().all()



async def get_enrollments_by_student(db: AsyncSession, student_id: int) -> list[Enrollment]:
    result = await db.execute(
        select(Enrollment)
        .where(Enrollment.student_id == student_id)
        .options(
             joinedload(Enrollment.course)
             )
    )
    return result.unique().scalars().all()