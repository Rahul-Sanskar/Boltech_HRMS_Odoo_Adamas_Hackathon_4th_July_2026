from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, datetime
from app.database import get_db
from app.models import Attendance, User, Profile
from app.dependencies import get_current_user, get_admin_user

router = APIRouter(prefix="/api/attendance", tags=["attendance"])

@router.get("")
def get_all_attendance(admin_user: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    records = db.query(Attendance).all()
    # Join with profiles to get employee name
    results = []
    for r in records:
        prof = db.query(Profile).filter(Profile.employee_id == r.employee_id).first()
        results.append({
            "id": r.id,
            "employeeId": r.employee_id,
            "employeeName": prof.name if prof else "Unknown",
            "date": str(r.date),
            "checkIn": r.check_in,
            "checkOut": r.check_out,
            "status": r.status
        })
    return results

@router.get("/{employee_id}")
def get_employee_attendance(employee_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "Admin" and current_user.id != employee_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to other employee's attendance logs"
        )
        
    records = db.query(Attendance).filter(Attendance.employee_id == employee_id).all()
    return [
        {
            "id": r.id,
            "employeeId": r.employee_id,
            "date": str(r.date),
            "checkIn": r.check_in,
            "checkOut": r.check_out,
            "status": r.status
        }
        for r in records
    ]

@router.get("/today-status/{employee_id}")
def get_today_status(employee_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "Admin" and current_user.id != employee_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
        
    today = date.today()
    record = db.query(Attendance).filter(Attendance.employee_id == employee_id, Attendance.date == today).first()
    if not record:
        return None
        
    return {
        "id": record.id,
        "employeeId": record.employee_id,
        "date": str(record.date),
        "checkIn": record.check_in,
        "checkOut": record.check_out,
        "status": record.status
    }

@router.post("/check-in")
def check_in(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    today = date.today()
    # Check if already checked in today
    existing = db.query(Attendance).filter(Attendance.employee_id == current_user.id, Attendance.date == today).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already checked in for today."
        )
        
    time_str = datetime.now().strftime("%I:%M %p")
    new_record = Attendance(
        employee_id=current_user.id,
        date=today,
        check_in=time_str,
        status="Present"
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    
    return {
        "id": new_record.id,
        "employeeId": new_record.employee_id,
        "date": str(new_record.date),
        "checkIn": new_record.check_in,
        "status": new_record.status
    }

@router.put("/check-out")
def check_out(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    today = date.today()
    record = db.query(Attendance).filter(Attendance.employee_id == current_user.id, Attendance.date == today).first()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No check-in record found for today."
        )
        
    if record.check_out:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already checked out for today."
        )
        
    time_str = datetime.now().strftime("%I:%M %p")
    record.check_out = time_str
    db.commit()
    
    return {
        "id": record.id,
        "employeeId": record.employee_id,
        "date": str(record.date),
        "checkIn": record.check_in,
        "checkOut": record.check_out,
        "status": record.status
    }
