from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.models import User, Profile
from app.schemas import LoginRequest, Token, UserResponse, UserCreate
from app.security import verify_password, get_password_hash, create_access_token
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token = create_access_token(data={"id": user.id, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=UserResponse)
def register(request: UserCreate, db: Session = Depends(get_db)):
    # Check if Employee ID exists
    if db.query(User).filter(User.id == request.id).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee ID {request.id} already exists."
        )
        
    # Check if Email exists
    if db.query(User).filter(User.email == request.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email {request.email} already exists."
        )
        
    # Create User
    new_user = User(
        id=request.id,
        email=request.email,
        hashed_password=get_password_hash(request.password),
        role=request.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create default profile
    default_designation = "HR Specialist" if request.role == "Admin" else "Associate"
    default_department = "HR" if request.role == "Admin" else "Operations"
    
    default_profile = Profile(
        employee_id=new_user.id,
        name=request.name,
        phone="",
        address="",
        designation=default_designation,
        department=default_department,
        joining_date=date.today(),
        profile_pic="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        salary_basic=60000.00 if request.role == "Admin" else 30000.00,
        salary_hra=20000.00 if request.role == "Admin" else 10000.00,
        salary_allowance=10000.00 if request.role == "Admin" else 5000.00,
        salary_deductions=5000.00 if request.role == "Admin" else 2000.00
    )
    db.add(default_profile)
    db.commit()

    return new_user

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.employee_id == current_user.id).first()
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "name": profile.name if profile else "User",
        "profile": {
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
        } if profile else None
    }
