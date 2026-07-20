#Humne Mapped aur mapped_column use kiya jo SQLAlchemy 2.0 style hai — but Base se inherit karna zaroori hai aur woh kar rahe hain!

from sqlalchemy import String, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
from typing import Optional

class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False,  index=True)
    phone: Mapped[Optional[str]] = mapped_column(String(15), nullable=True)
    photo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)  # ← Boolean nahi, Optional[str]!
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)  # ← nullable=False
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now()) 