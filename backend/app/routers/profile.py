from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Profile, User
from app.dependencies import get_current_user
from app.schemas import ProfileUpdateAdmin, ProfileUpdateEmployee

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.get("/{employee_id}")
def get_profile(employee_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Guard: Employee can only see their own profile, Admins can see all profiles
    if current_user.role != "Admin" and current_user.id != employee_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this profile"
        )
        
    profile = db.query(Profile).filter(Profile.employee_id == employee_id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
        
    return {
        "id": profile.employee_id,
        "name": profile.name,
        "email": current_user.email if current_user.id == employee_id else "hidden",
        "phone": profile.phone,
        "address": profile.address,
        "designation": profile.designation,
        "department": profile.department,
        "joiningDate": str(profile.joining_date),
        "profilePic": profile.profile_pic,
        "salaryStructure": {
            "basic": float(profile.salary_basic),
            "hra": float(profile.salary_hra),
            "allowance": float(profile.salary_allowance),
            "deductions": float(profile.salary_deductions)
        }
    }

@router.put("/{employee_id}")
def update_profile(
    employee_id: str,
    update_data: dict,  # Receive generic dict first to dynamically process Employee vs Admin updating
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Guard: Employee can only update their own profile, Admins can update all profiles
    if current_user.role != "Admin" and current_user.id != employee_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to update this profile"
        )

    profile = db.query(Profile).filter(Profile.employee_id == employee_id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    if current_user.role == "Admin":
        # Admin can update everything
        for key, value in update_data.items():
            if hasattr(profile, key) and value is not None:
                setattr(profile, key, value)
    else:
        # Regular Employee can only update phone and address
        allowed_keys = ["phone", "address"]
        for key in allowed_keys:
            if key in update_data and update_data[key] is not None:
                setattr(profile, key, update_data[key])
                
    db.commit()
    db.refresh(profile)
    
    return {
        "id": profile.employee_id,
        "name": profile.name,
        "phone": profile.phone,
        "address": profile.address,
        "designation": profile.designation,
        "department": profile.department,
        "joiningDate": str(profile.joining_date),
        "profilePic": profile.profile_pic,
        "salaryStructure": {
            "basic": float(profile.salary_basic),
            "hra": float(profile.salary_hra),
            "allowance": float(profile.salary_allowance),
            "deductions": float(profile.salary_deductions)
        }
    }

@router.get("")
def list_profiles(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Only Admin can list all profiles
    if current_user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation restricted to Admins only"
        )
        
    profiles = db.query(Profile).all()
    return [
        {
            "id": p.employee_id,
            "name": p.name,
            "phone": p.phone,
            "address": p.address,
            "designation": p.designation,
            "department": p.department,
            "joiningDate": str(p.joining_date),
            "profilePic": p.profile_pic
        }
        for p in profiles
    ]
