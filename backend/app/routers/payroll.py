from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Profile, User
from app.dependencies import get_current_user, get_admin_user

router = APIRouter(prefix="/api/payroll", tags=["payroll"])

@router.get("")
def get_all_payroll(admin_user: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    profiles = db.query(Profile).all()
    results = []
    for p in profiles:
        basic = float(p.salary_basic)
        hra = float(p.salary_hra)
        allowance = float(p.salary_allowance)
        deductions = float(p.salary_deductions)
        
        gross = basic + hra + allowance
        net = gross - deductions
        
        results.append({
            "employeeId": p.employee_id,
            "employeeName": p.name,
            "designation": p.designation,
            "department": p.department,
            "salaryStructure": {
                "basic": basic,
                "hra": hra,
                "allowance": allowance,
                "deductions": deductions
            },
            "calculations": {
                "gross": gross,
                "deductions": deductions,
                "net": net
            }
        })
    return results

@router.get("/{employee_id}")
def get_employee_payroll(employee_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "Admin" and current_user.id != employee_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to other employee's salary specifications"
        )
        
    p = db.query(Profile).filter(Profile.employee_id == employee_id).first()
    if not p:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile structure not found"
        )
        
    basic = float(p.salary_basic)
    hra = float(p.salary_hra)
    allowance = float(p.salary_allowance)
    deductions = float(p.salary_deductions)
    
    gross = basic + hra + allowance
    net = gross - deductions
    
    return {
        "employeeId": p.employee_id,
        "employeeName": p.name,
        "designation": p.designation,
        "department": p.department,
        "salaryStructure": {
            "basic": basic,
            "hra": hra,
            "allowance": allowance,
            "deductions": deductions
        },
        "calculations": {
            "gross": gross,
            "deductions": deductions,
            "net": net
        }
    }
