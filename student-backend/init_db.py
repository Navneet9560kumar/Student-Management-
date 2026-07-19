#!/usr/bin/env python3
"""Initialize database tables directly using SQLAlchemy models."""
import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def init_db():
    """Create all tables in the database."""
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        print("ERROR: DATABASE_URL not set!")
        return False
    
    # Ensure asyncpg driver
    if "asyncpg" not in database_url:
        database_url = database_url.replace("postgresql://", "postgresql+asyncpg://")
    
    print(f"Connecting to database...")
    
    try:
        # Create async engine
        engine = create_async_engine(database_url, echo=False)
        
        # Import all models to register them
        from app.db.base import Base
        from app.models.user import User
        from app.models.student import Student
        from app.models.course import Course
        from app.models.enrollment import Enrollment
        from app.models.document import Document
        from app.models.activity_log import ActivityLog
        
        print("Creating tables...")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        
        print("✅ Database initialized successfully!")
        await engine.dispose()
        return True
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(init_db())
    exit(0 if success else 1)
