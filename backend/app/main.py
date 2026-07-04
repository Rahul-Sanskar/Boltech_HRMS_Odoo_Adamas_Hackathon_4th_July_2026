from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.database import engine, Base
from app.routers import auth, profile, attendance, leave, payroll

# Auto-create tables (SQLite fallback or if PG is active)
Base.metadata.create_all(bind=engine)

# Auto-seed database if empty
def seed_db():
    from app.database import SessionLocal
    from app.models import User, Profile, Attendance, Leave
    from app.security import get_password_hash
    from datetime import date

    db = SessionLocal()
    try:
        # Check if users already exist
        if db.query(User).count() == 0:
            print("Seeding database with default mock records...")
            # Create users
            emp_password = get_password_hash("password123")
            
            emp = User(id="EMP101", email="employee@boltech.com", hashed_password=emp_password, role="Employee")
            admin = User(id="HR202", email="admin@boltech.com", hashed_password=emp_password, role="Admin")
            db.add_all([emp, admin])
            db.commit()

            # Create profiles
            emp_profile = Profile(
                employee_id="EMP101",
                name="Shirish Gupta",
                phone="+91 9876543210",
                address="123, Tech Park Lane, Bangalore, India",
                designation="Frontend Software Engineer",
                department="Engineering",
                joining_date=date(2024, 1, 15),
                profile_pic="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
                salary_basic=45000.00,
                salary_hra=18000.00,
                salary_allowance=12000.00,
                salary_deductions=5000.00
            )
            admin_profile = Profile(
                employee_id="HR202",
                name="Rahul Sanskar",
                phone="+91 9988776655",
                address="456, Admin Suite Road, Kolkata, India",
                designation="Human Resource Lead",
                department="Human Resources",
                joining_date=date(2022, 6, 1),
                profile_pic="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
                salary_basic=65000.00,
                salary_hra=25000.00,
                salary_allowance=15000.00,
                salary_deductions=7000.00
            )
            db.add_all([emp_profile, admin_profile])

            # Create attendance
            att1 = Attendance(employee_id="EMP101", date=date(2026, 7, 1), check_in="09:05 AM", check_out="06:10 PM", status="Present")
            att2 = Attendance(employee_id="EMP101", date=date(2026, 7, 2), check_in="08:55 AM", check_out="06:05 PM", status="Present")
            att3 = Attendance(employee_id="EMP101", date=date(2026, 7, 3), check_in="09:15 AM", check_out="01:30 PM", status="Half-day")
            db.add_all([att1, att2, att3])

            # Create leaves
            lv1 = Leave(
                employee_id="EMP101",
                leave_type="Sick",
                start_date=date(2026, 6, 10),
                end_date=date(2026, 6, 11),
                remarks="Severe flu and fever, resting as advised by doctor.",
                status="Approved",
                admin_comment="Get well soon!"
            )
            lv2 = Leave(
                employee_id="EMP101",
                leave_type="Paid",
                start_date=date(2026, 7, 15),
                end_date=date(2026, 7, 18),
                remarks="Family vacation trip.",
                status="Pending"
            )
            db.add_all([lv1, lv2])
            db.commit()
            print("Database seeding completed.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

seed_db()


app = FastAPI(
    title="Boltech HRMS - Backend Services",
    description="Python FastAPI REST endpoints for HRMS company management portal.",
    version="1.0.0"
)

# CORS setup
origins = [
    "http://localhost:5173",  # React Vite development origin
    "http://127.0.0.1:5173",
    "http://localhost:3000",  # Alternate dev origin
    "http://127.0.0.1:3000",
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
