from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings


# Async engine
async_engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,  # SQL queries terminal mein dikhenge (debug ke liye)
)

# Async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

# Dependency - FastAPI routes mein use hoga
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()