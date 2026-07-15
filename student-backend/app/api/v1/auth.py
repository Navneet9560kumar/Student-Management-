from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.user import User
from app.models.activity_log import ActivityLog
from app.schemas.user import UserRegister, UserLogin, UserResponse, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse)
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(User).where(User.email == data.email))
        existing = result.scalar_one_or_none()
        if existing:
            raise HTTPException(status_code=400, detail="Email already exists!")

        user = User(
            name=data.name,
            email=data.email,
            password=hash_password(data.password),
            role=data.role
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

        # Log banao
        log = ActivityLog(
            action_type="CREATE",
            description=f"'{user.name}' registered as {user.role}",
            student_id=user.id if user.role == "student" else None,
            performed_by_id=user.id,
            performed_by_name=user.name,
            performed_by_role=user.role,
            status="success"
        )
        db.add(log)
        await db.commit()

        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(User).where(User.email == data.email))
        user = result.scalar_one_or_none()

        if not user or not verify_password(data.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid email or password!")

        token = create_access_token({"sub": str(user.id), "role": user.role})

        # Login log banao
        log = ActivityLog(
            action_type="LOGIN",
            description=f"'{user.name}' logged in as {user.role}",
            student_id=user.id if user.role == "student" else None,
            performed_by_id=user.id,
            performed_by_name=user.name,
            performed_by_role=user.role,
            status="success"
        )
        db.add(log)
        await db.commit()

        return TokenResponse(
            access_token=token,
            user=UserResponse.model_validate(user)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user