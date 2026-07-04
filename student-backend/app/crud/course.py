from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.course import Course
from app.models.activity_log import ActivityLog
from app.schemas.course import CourseCreate, CourseUpdate


# Log helper — course_id add kiya!
async def create_log(db: AsyncSession, action_type: str, description: str, course_id: int = None, changes: dict = None):
    log = ActivityLog(
        action_type=action_type,
        description=description,
        course_id=course_id,  # ← yeh missing tha!
        status="success",
        changes=changes
    )
    db.add(log)
    await db.commit()


async def create_course(db: AsyncSession, data: CourseCreate) -> Course:
    course = Course(
        name=data.name,
        description=data.description,
        duration_months=data.duration_months
    )
    db.add(course)
    await db.commit()
    await db.refresh(course)

    # ← course_id pass karo!
    await create_log(db, "CREATE", f"Course '{course.name}' created", course_id=course.id)
    return course


async def get_all_courses(db: AsyncSession) -> list[Course]:
    result = await db.execute(select(Course).where(Course.is_active == True))
    return result.scalars().all()


async def get_course_by_id(db: AsyncSession, course_id: int) -> Course | None:
    result = await db.execute(select(Course).where(Course.id == course_id))
    return result.scalar_one_or_none()


async def update_course(db: AsyncSession, course_id: int, data: CourseUpdate) -> Course | None:
    course = await get_course_by_id(db, course_id)
    if not course:
        return None

    update_data = data.model_dump(exclude_unset=True)

    changes = {}
    changed_fields = []
    for key, new_value in update_data.items():
        old_value = getattr(course, key)
        if str(old_value) != str(new_value):
            changes[key] = {"old": old_value, "new": new_value}
            changed_fields.append(key)
        setattr(course, key, new_value)

    await db.commit()
    await db.refresh(course)

    if changes:
        fields_text = " and ".join(changed_fields)
        description = f"Course '{course.name}' updated {fields_text}"
        # ← course_id pass karo!
        await create_log(db, "UPDATE", description, course_id=course_id, changes=changes)

    return course


async def delete_course(db: AsyncSession, course_id: int) -> bool:
    course = await get_course_by_id(db, course_id)
    if not course:
        return False

    course_name = course.name
    course.is_active = False
    await db.commit()

    # ← course_id pass karo!
    await create_log(db, "DELETE", f"Course '{course_name}' deleted", course_id=course_id)
    return True