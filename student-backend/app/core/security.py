from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

# Isko explicitly configure kiya taaki passlib koi environment variables mix na kare
pwd_context = CryptContext(
    schemes=["bcrypt"], 
    deprecated="auto",
    bcrypt__truncate_error=False  # Agar koi system issue ho toh yeh crash nahi hone dega
)

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 din

def hash_password(password: str) -> str:
    # Ensure password string format mein hi jaye aur trailing spaces na hon
    return pwd_context.hash(str(password).strip())

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return pwd_context.verify(str(plain).strip(), hashed)
    except Exception:
        return False

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])