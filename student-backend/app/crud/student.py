from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate
from app.models.activity_log import ActivityLog

#Active log helper

async def create_log(db: AsyncSession, action_type: str, description: str, student_id: int = None ,changes: dict = None):
    log = ActivityLog(
        action_type=action_type,
        description=description,
        student_id=student_id,  # ← studnet_id nahi, student_id!
        status="success",
        changes=changes 
    )
    db.add(log)
    await db.commit()


async def create_student(db:AsyncSession, data: StudentCreate) -> Student:
      student = Student(
            name =data.name,
            email=data.email,
            phone=data.phone
      )
      db.add(student)
      await db.commit()
      await db.refresh(student)

      await create_log(db, "CREATE", f"Student {student.name} created", student.id)
      return student


#get all student

async def get_all_students(db: AsyncSession) -> list[Student]:
    result = await db.execute(select(Student).where(Student.is_active == True))
    return result.scalars().all() 

#get student by id

async def get_student_by_id(db: AsyncSession, student_id:int)-> Student | None:
      result = await db.execute(select(Student).where(Student.id ==student_id))
      return result.scalar_one_or_none()

#update student

async def update_student(db: AsyncSession, student_id: int, data: StudentUpdate) -> Student | None:
    student = await get_student_by_id(db, student_id)
    if not student:
        return None

    update_data = data.model_dump(exclude_unset=True)
    changes = {}
    changed_fields = []

    for key, new_value in update_data.items():
        old_value = getattr(student, key)
        if str(old_value) != str(new_value):
            changes[key] = {"old": old_value, "new": new_value}
            changed_fields.append(key)
        setattr(student, key, new_value)

    await db.commit()
    await db.refresh(student)

    if changes:
        fields_text = " and ".join(changed_fields)
        description = f"{student.name} updated {fields_text}"
        await create_log(db, "UPDATE", description, student.id, changes)

    return student  # ← if ke bahar!



# Delete student (soft delete)

async def delete_student(db: AsyncSession, student_id: int) -> bool:
    student = await get_student_by_id(db, student_id)
    if not student:
        return False

    student.is_active = False
    await db.commit()

    await create_log(db, "DELETE", f"Student {student.name} deleted", student.id)
    return True




