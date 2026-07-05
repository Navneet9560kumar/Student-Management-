# #!/bin/bash

# echo "Waiting for PostgreSQL..."

# # 'bd' ko change karke 'db' kar diya hai
# while ! nc -z db 5432; do
#   sleep 1
# done

# echo "PostgreSQL is up!"

# echo "Running Alembic migrations..."

# # Yahan se autogenerate hata diya hai, sirf upgrade command chalegi
# alembic upgrade head

# echo "Starting FastAPI server..."
# uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload


#!/bin/bash

echo "Running Alembic migrations..."
alembic upgrade head

echo "Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}