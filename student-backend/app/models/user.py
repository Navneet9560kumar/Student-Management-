from sqlalchemy import String, Boolean,DateTime, func
from sqlalchemy.orm import Mapped,mapped_column
from app.db.base import Base
from app.core.role import Role
from typing import Optional, TYPE_CHECKING
from sqlalchemy.orm import relationship

if TYPE_CHECKING:
      from app.models.enrollment import Enrollment
      from app.models.document import Document

class User(Base):
      __tablename__="users"

      id:Mapped[int]=mapped_column(primary_key=True, autoincrement=True)
      name:Mapped[str]= mapped_column(String(100), nullable=False)
      email:Mapped[str]=mapped_column(String(100), unique=True, nullable=False)
      phone: Mapped[Optional[str]] = mapped_column(String(15), nullable=True)# student
      photo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)  # ← Boolean nahi, Optional[str]! student
      password:Mapped[str] =mapped_column(String(255), nullable=False)
      role:Mapped[str]= mapped_column(String(20), default=Role.STUDENT)
      is_active: Mapped[bool]= mapped_column(Boolean, default=True)
      created_at:Mapped[DateTime]= mapped_column(DateTime, server_default=func.now())
      updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
      enrollments: Mapped[list["Enrollment"]] = relationship("Enrollment", back_populates="student", lazy="raise")
      documents: Mapped[list["Document"]] = relationship("Document", back_populates="student", lazy="raise")






#          enrollments: Mapped[list["Enrollment"]] = relationship("Enrollment", back_populates="student", lazy="raise")
#     documents: Mapped[list["Document"]] = relationship("Document", back_populates="student", lazy="raise")

