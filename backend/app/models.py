from sqlalchemy import Column, String, Integer, Date, ForeignKey, Numeric, Text, TIMESTAMP, UniqueConstraint, func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="Employee")
    created_at = Column(TIMESTAMP, server_default=func.now())

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    attendance_records = relationship("Attendance", back_populates="user", cascade="all, delete-orphan")
    leave_records = relationship("Leave", back_populates="user", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(20))
    address = Column(Text)
    designation = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    joining_date = Column(Date, nullable=False)
    profile_pic = Column(String(255))
    salary_basic = Column(Numeric(12, 2), nullable=False, default=0.00)
    salary_hra = Column(Numeric(12, 2), nullable=False, default=0.00)
    salary_allowance = Column(Numeric(12, 2), nullable=False, default=0.00)
    salary_deductions = Column(Numeric(12, 2), nullable=False, default=0.00)

    user = relationship("User", back_populates="profile")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    check_in = Column(String(20), nullable=False)
    check_out = Column(String(20))
    status = Column(String(20), nullable=False, default="Present")

    __table_args__ = (UniqueConstraint("employee_id", "date", name="uq_emp_date"),)

    user = relationship("User", back_populates="attendance_records")

class Leave(Base):
    __tablename__ = "leaves"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    leave_type = Column(String(20), nullable=False, default="Paid")
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    remarks = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, default="Pending")
    admin_comment = Column(Text)

    user = relationship("User", back_populates="leave_records")
