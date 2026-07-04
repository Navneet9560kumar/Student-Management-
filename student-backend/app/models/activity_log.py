from sqlalchemy import ForeignKey, String, Text, DateTime, func, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from typing import Optional

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.student import Student

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    student_id: Mapped[Optional[int]] = mapped_column(ForeignKey("students.id"), nullable=True)
    course_id: Mapped[Optional[int]] = mapped_column(ForeignKey("courses.id"), nullable=True)  # ← add ke hai ye line id ke leye 
    action_type: Mapped[str] = mapped_column(String(50), nullable=False)  # CREATE, UPDATE, DELETE
    description: Mapped[str] = mapped_column(String(200), nullable=True)  # clean message
    changes: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="success")  # success, failed
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

    student: Mapped["Student"] = relationship("Student", backref="logs")
    document_id: Mapped[Optional[int]] = mapped_column(ForeignKey("documents.id"), nullable=True)