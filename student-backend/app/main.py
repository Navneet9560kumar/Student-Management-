from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.v1 import auth
from app.exceptionssss import unicorn_exception_handler, UnicornException

import os
from app.api.v1 import students, courses, enrollments, logs, documents

app = FastAPI(title="Student Management System")








# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://student-management-6urjhzxaz.vercel.app",
        "https://student-management-k29g9w0ey.vercel.app",
        "https://student-management-indol-zeta.vercel.app",
    ],
    allow_origin_regex=r"https://student-management-[a-z0-9-]+\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.add_exception_handler(UnicornException, unicorn_exception_handler)


@app.get("/unicorns/{name}")
async def read_unicorn(name:str):
    if name =="yolo":
        raise UnicornException(name=name)
    return {"unicorn_name": name}



# Routes
app.include_router(students.router, prefix="/api/v1")
app.include_router(courses.router, prefix="/api/v1")
app.include_router(enrollments.router, prefix="/api/v1")
app.include_router(logs.router, prefix="/api/v1")
app.include_router(documents.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")




# Static files — sabse last mein!
os.makedirs("media", exist_ok=True)
app.mount("/media", StaticFiles(directory="media"), name="media")

@app.get("/")
async def root():
    return {"message": "Student Management System API - v1.0"}


@app.get("/items/{item_id}")
async def read_item(item_id: str):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item nahi mila bhai ")
    else:
        raise HTTPException(status_code=300, detail="he is alive" )
       

    
   





