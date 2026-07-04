from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Leave, User, Profile
from app.schemas import LeaveCreate, LeaveUpdateStatus
from app.dependencies import get_current_user, get_admin_user

router = APIRouter(prefix="/api/leaves", tags=["leaves"])

@router.get("")
def get_all_leaves(admin_user: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    records = db.query(Leave).all()
    results = []
    for r in records:
        prof = db.query(Profile).filter(Profile.employee_id == r.employee_id).first()
        results.append({
            "id": r.id,
            "employeeId": r.employee_id,
            "employeeName": prof.name if prof else "Unknown",
            "leaveType": r.leave_type,
            "startDate": str(r.start_date),
            "endDate": str(r.end_date),
            "remarks": r.remarks,
            "status": r.status,
            "adminComment": r.admin_comment
        })
    return results

@router.get("/{employee_id}")
def get_employee_leaves(employee_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "Admin" and current_user.id != employee_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to other employee's leaves history"
        )
        
    records = db.query(Leave).filter(Leave.employee_id == employee_id).all()
    return [
        {
            "id": r.id,
            "employeeId": r.employee_id,
            "leaveType": r.leave_type,
            "startDate": str(r.start_date),
            "endDate": str(r.end_date),
            "remarks": r.remarks,
            "status": r.status,
            "adminComment": r.admin_comment
        }
        for r in records
    ]

@router.post("/apply")
def apply_leave(request: LeaveCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if request.start_date > request.end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start date cannot be after end date."
        )
        
    new_leave = Leave(
        employee_id=current_user.id,
        leave_type=request.leave_type,
        start_date=request.start_date,
        end_date=request.end_date,
        remarks=request.remarks,
        status="Pending"
    )
    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)
    
    return {
        "id": new_leave.id,
        "employeeId": new_leave.employee_id,
        "leaveType": new_leave.leave_type,
        "startDate": str(new_leave.start_date),
        "endDate": str(new_leave.end_date),
        "remarks": new_leave.remarks,
        "status": new_leave.status
    }

@router.put("/{leave_id}/status")
def update_leave_status(
    leave_id: int,
    request: LeaveUpdateStatus,
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    leave = db.query(Leave).filter(Leave.id == leave_id).first()
    if not leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found"
        )
        
    if request.status not in ["Approved", "Rejected", "Pending"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status value"
        )
        
    leave.status = request.status
    leave.admin_comment = request.admin_comment
    db.commit()
    
    return {
        "id": leave.id,
        "employeeId": leave.employee_id,
        "leaveType": leave.leave_type,
        "startDate": str(leave.start_date),
        "endDate": str(leave.end_date),
        "remarks": leave.remarks,
        "status": leave.status,
        "adminComment": leave.admin_comment
    }
