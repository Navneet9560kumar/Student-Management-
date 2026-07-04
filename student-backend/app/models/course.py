from sqlalchemy import String, Text, Integer,DateTime,func
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class Course(Base):
      __tablename__ = "courses"

      id: Mapped[int]= mapped_column(primary_key=True, autoincrement=True)
      name:Mapped[str]= mapped_column(String(100), nullable=False, unique=True)
      description: Mapped[str]= mapped_column(Text, nullable=True)
      duration_months: Mapped[int] = mapped_column(Integer, nullable=False)
      is_active: Mapped[bool] = mapped_column(default=True)
      created_at: Mapped[DateTime]= mapped_column(DateTime, server_default=func.now())