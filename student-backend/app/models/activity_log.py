from sqlalchemy import ForeignKey, String, Text, DateTime, func, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
from typing import Optional


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    student_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    course_id: Mapped[Optional[int]] = mapped_column(ForeignKey("courses.id"), nullable=True)
    action_type: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(200), nullable=True)
    changes: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="success")
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    document_id: Mapped[Optional[int]] = mapped_column(ForeignKey("documents.id"), nullable=True)
    performed_by_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    performed_by_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    performed_by_role: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
