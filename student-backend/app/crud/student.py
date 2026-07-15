from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.schemas.user import StudentCreate, StudentUpdate
from app.models.activity_log import ActivityLog
from app.core.security import hash_password
# new 
from sqlalchemy.orm import selectinload

#Active log helper

async def create_log(
    db: AsyncSession,
    action_type: str,
    description: str,
    student_id: int = None,
    changes: dict = None,
    performed_by_id: int = None,      # ← kaun ne kiya
    performed_by_name: str = None,    # ← naam
    performed_by_role: str = None     # ← role
):
    log = ActivityLog(
        action_type=action_type,
        description=description,
        student_id=student_id,
        changes=changes,
        performed_by_id=performed_by_id,
        performed_by_name=performed_by_name,
        performed_by_role=performed_by_role,
        status="success"
    )
    db.add(log)
    await db.commit()


async def create_student(db: AsyncSession, data: StudentCreate, current_user=None) -> User:
    student = User(
        name=data.name,
        email=data.email,
       
        phone=data.phone,
        photo_url=data.photo_url,
        password=hash_password(data.password),  
        role=data.role 
    )
    db.add(student)
    await db.commit()
    await db.refresh(student)

    await create_log(
        db,
        action_type="CREATE",
        description=f"Student '{student.name}' created",
        student_id=student.id,
        performed_by_id=current_user.id if current_user else None,
        performed_by_name=getattr(current_user, "name", ""),
        performed_by_role=current_user.role if current_user else None

    )
    return student


   
            
    
# get all student
async def get_all_students(db: AsyncSession) -> list[User]:
    result = await db.execute(select(User).where(User.is_active == True,User.role == "student")
    .options(
        selectinload(User.enrollments),  # enrollment
        selectinload(User.documents)
    )
                              
)
    # ↓ Yahan scalar() ki jagah scalars() aayega
    return result.unique().scalars().all()

#get student by id

async def get_student_by_id(db: AsyncSession, student_id:int)-> User | None:
      result = await db.execute(select(User).where(User.id ==student_id,User.role == "student"))
      return result.scalar_one_or_none()

#update student




async def update_student(db: AsyncSession, student_id: int, data: StudentUpdate, current_user=None) -> User | None:
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
        who = f"{current_user.name}({current_user.role})" if current_user else "unknown"
        description = f"{who} updated student '{student.name}'{fields_text}"
        await create_log(
            db,
            action_type="UPDATE",
            description=description,
            student_id=student_id,
            changes=changes,
            performed_by_id=current_user.id if current_user else None,
            performed_by_name=current_user.name if current_user else None,
            performed_by_role=current_user.role if current_user else None
        )

    return student  



# Delete student (soft delete)

async def delete_student(db: AsyncSession, student_id: int, current_user=None) -> bool:
    student = await get_student_by_id(db, student_id)
    if not student:
        return False

    student.is_active = False
    await db.commit()

    who = f"{current_user.name} ({current_user.role})" if current_user else "Unknown"
    await create_log(
        db,
        action_type="DELETE",
        description=f"{who} deleted Student '{student.name}'",
        student_id=student_id,
        performed_by_id=current_user.id if current_user else None,
        performed_by_name=current_user.name if current_user else None,
        performed_by_role=current_user.role if current_user else None
    )
    return True




