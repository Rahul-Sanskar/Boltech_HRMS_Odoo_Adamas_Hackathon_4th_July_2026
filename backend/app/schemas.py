from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# --- User Schemas ---
class UserBase(BaseModel):
    id: str
    email: EmailStr
    role: str

class UserCreate(BaseModel):
    id: str
    name: str
    email: EmailStr
    password: str
    role: str = "Employee"

class UserResponse(UserBase):
    created_at: datetime

    class Config:
        from_attributes = True

# --- Salary Schema ---
class SalaryStructure(BaseModel):
    basic: float
    hra: float
    allowance: float
    deductions: float

# --- Profile Schemas ---
class ProfileBase(BaseModel):
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    designation: str
    department: str
    joining_date: date
    profile_pic: Optional[str] = None

class ProfileUpdateEmployee(BaseModel):
    phone: Optional[str] = None
    address: Optional[str] = None

class ProfileUpdateAdmin(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    salary_basic: Optional[float] = None
    salary_hra: Optional[float] = None
    salary_allowance: Optional[float] = None
    salary_deductions: Optional[float] = None

class ProfileResponse(ProfileBase):
    id: int
    employee_id: str
    salaryStructure: SalaryStructure

    class Config:
        from_attributes = True

# --- Attendance Schemas ---
class AttendanceBase(BaseModel):
    employee_id: str
    date: date
    check_in: str
    check_out: Optional[str] = None
    status: str

class AttendanceResponse(AttendanceBase):
    id: int
    employeeName: Optional[str] = None

    class Config:
        from_attributes = True

# --- Leave Schemas ---
class LeaveBase(BaseModel):
    employee_id: str
    leave_type: str
    start_date: date
    end_date: date
    remarks: str
    status: str = "Pending"
    admin_comment: Optional[str] = None

class LeaveCreate(BaseModel):
    leave_type: str
    start_date: date
    end_date: date
    remarks: str

class LeaveUpdateStatus(BaseModel):
    status: str
    admin_comment: Optional[str] = None

class LeaveResponse(LeaveBase):
    id: int
    employeeName: Optional[str] = None

    class Config:
        from_attributes = True

# --- Payroll Schemas ---
class PayrollCalculations(BaseModel):
    gross: float
    deductions: float
    net: float

class PayrollResponse(BaseModel):
    employeeId: str
    employeeName: str
    designation: str
    department: str
    salaryStructure: SalaryStructure
    calculations: PayrollCalculations

    class Config:
        from_attributes = True
