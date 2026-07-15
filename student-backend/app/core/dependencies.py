# Ye file authorization dependencies ke liye bani hai. Iska kaam hai:

# Request se user identify karna.
# Database se current user lana.
# Check karna ki user kis role ka hai.
# Route ko protect karna.



from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from jose import JWTError
from app.db.session import get_db
from app.models.user import User
from app.core.security import decode_token
from app.core.role import Role

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(
            token:str = Depends(oauth2_scheme),
            db:AsyncSession =Depends(get_db)
) -> User:
      try:
            paylode =decode_token(token)
            user_id= paylode.get("sub")
            if not user_id:
                  raise HTTPException(status_code=401,detail="Invalid token!")
      except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token!")
      result = await db.execute(select(User).where(User.id==int(user_id)))
      user = result.scalar_one_or_none()
      if not user:
            raise HTTPException(status_code=401, detail="User not found")
      return user



# Principal only

async def require_principal(current_user:User = Depends(get_current_user))->User:
      if current_user.role !=Role.PRINCIPAL:
            raise HTTPException(status_code=403, detail="Principal access required")
      return current_user

#Teacher+Prinicpla
async def require_teacher(current_user:User=Depends(get_current_user))-> User:
      if current_user.role not in[Role.TEACHER, Role.PRINCIPAL]:
            raise HTTPException(status_code=403, detail="Teacher access required!")
      return current_user


#koi bhi logged in user

async def require_student(current_user:User = Depends(get_current_user))-> User: return current_user