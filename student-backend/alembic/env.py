import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context
import os
from dotenv import load_dotenv

# Env variables load kar rahe hain
load_dotenv()

# App ke Base aur Models import karo taaki Alembic ko tables ka pata chale
from app.db.base import Base
# Ensure all your models are imported here so metadata is complete
# import app.models.user
# import app.models.task
# import app.models.report
# import app.models.student
# import app.models.course
# import app.models.enrollment
# import app.models.document
# import app.models.activity_log

from app.models.student import Student
# Alembic Config object
config = context.config

# .env se DATABASE_URL uthao aur Alembic ko do
# .env se DATABASE_URL lo
database_url = os.getenv("DATABASE_URL")
print(f"DEBUG: Connection URL inside Docker is -> {database_url}")
# asyncpg ensure karo
if database_url and "asyncpg" not in database_url:
    database_url = database_url.replace("postgresql://", "postgresql+asyncpg://")

if database_url:
    config.set_main_option("sqlalchemy.url", database_url)

# Setup logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# target_metadata models se metadata uthayega
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection: Connection) -> None:
    """Sync function that actually runs the migrations"""
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()

async def run_async_migrations() -> None:
    """Async environment create karega aur fir sync migrations ko wrapper me run karega"""
    
    # 1. Pehle pura configuration section dictionary format mein uthao
    configuration = config.get_section(config.config_ini_section, {})
    
    # 2. Jo modified database_url humne upar banaya hai, usko is dictionary mein force karo
    if database_url:
        configuration["sqlalchemy.url"] = database_url

    # 3. Ab modified configuration pass karo
    connectable = async_engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()
def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    asyncio.run(run_async_migrations())

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()





    # Models Import Kiye  ➡️  Base.metadata ready hua  ➡️  Alembic ko tables dikhi  ➡️  DB mein Tables Ban gayi! 🎉