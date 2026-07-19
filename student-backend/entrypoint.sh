#!/bin/bash
set -e

echo "Running Alembic migrations..."
alembic upgrade head || echo "Migration warning - proceeding anyway"

echo "Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}

# #!/bin/bash

# # Agar koi command fail hoti hai, toh script turant exit ho jayegi
# set -e

# echo "Running Alembic migrations..."
# alembic upgrade head

# echo "Starting FastAPI server..."
# # Yeh Render ke dynamic $PORT ko use karega. Agar $PORT set nahi hai, toh 8000 use karega.
# uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"