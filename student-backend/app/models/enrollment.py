from sqlalchemy import ForeignKey, String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
from sqlalchemy.orm import relationship
from app.models.user import User

class Enrollment(Base):
    __tablename__ = "enrollments"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(20), default="active")
    enrolled_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    student: Mapped["User"] = relationship("User", back_populates="enrollments")