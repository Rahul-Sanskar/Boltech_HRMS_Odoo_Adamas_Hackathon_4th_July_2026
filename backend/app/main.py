from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.database import engine, Base
from app.routers import auth, profile, attendance, leave, payroll

# Auto-create tables (SQLite fallback or if PG is active)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Boltech HRMS - Backend Services",
    description="Python FastAPI REST endpoints for HRMS company management portal.",
    version="1.0.0"
)

# CORS setup
origins = [
    "http://localhost:5173",  # React Vite development origin
    "http://127.0.0.1:5173",
    "*"  # Allow additional origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(attendance.router)
app.include_router(leave.router)
app.include_router(payroll.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to Boltech HRMS API Services. Read the /docs endpoint for auto-generated OpenAPI schemas.",
        "status": "Online"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
