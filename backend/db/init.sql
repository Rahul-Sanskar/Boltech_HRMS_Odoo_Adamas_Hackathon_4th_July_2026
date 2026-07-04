-- Create Database if not exists (Note: Run on postgres master database first)
-- CREATE DATABASE boltech_hrms;

-- Connect to boltech_hrms
-- \c boltech_hrms;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'Employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    joining_date DATE NOT NULL,
    profile_pic VARCHAR(255),
    salary_basic DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    salary_hra DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    salary_allowance DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    salary_deductions DECIMAL(12, 2) NOT NULL DEFAULT 0.00
);

-- 3. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    check_in VARCHAR(20) NOT NULL,
    check_out VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'Present',
    UNIQUE (employee_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_emp_date ON attendance(employee_id, date);

-- 4. Leaves Table
CREATE TABLE IF NOT EXISTS leaves (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    leave_type VARCHAR(20) NOT NULL DEFAULT 'Paid',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    remarks TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    admin_comment TEXT
);

-- Seed Data (Password hash is for 'password123')
INSERT INTO users (id, email, hashed_password, role) VALUES
('EMP101', 'employee@boltech.com', '$2b$12$KyVqQ0jW6g4r7/1D.kC2B.01y143d2K213G5e.30v19d8541N4mC.', 'Employee'),
('HR202', 'admin@boltech.com', '$2b$12$KyVqQ0jW6g4r7/1D.kC2B.01y143d2K213G5e.30v19d8541N4mC.', 'Admin')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (employee_id, name, phone, address, designation, department, joining_date, profile_pic, salary_basic, salary_hra, salary_allowance, salary_deductions) VALUES
('EMP101', 'Shirish Gupta', '+91 9876543210', '123, Tech Park Lane, Bangalore, India', 'Frontend Software Engineer', 'Engineering', '2024-01-15', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', 45000.00, 18000.00, 12000.00, 5000.00),
('HR202', 'Rahul Sanskar', '+91 9988776655', '456, Admin Suite Road, Kolkata, India', 'Human Resource Lead', 'Human Resources', '2022-06-01', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', 65000.00, 25000.00, 15000.00, 7000.00)
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO attendance (employee_id, date, check_in, check_out, status) VALUES
('EMP101', '2026-07-01', '09:05 AM', '06:10 PM', 'Present'),
('EMP101', '2026-07-02', '08:55 AM', '06:05 PM', 'Present'),
('EMP101', '2026-07-03', '09:15 AM', '01:30 PM', 'Half-day')
ON CONFLICT (employee_id, date) DO NOTHING;

INSERT INTO leaves (employee_id, leave_type, start_date, end_date, remarks, status, admin_comment) VALUES
('EMP101', 'Sick', '2026-06-10', '2026-06-11', 'Severe flu and fever, resting as advised by doctor.', 'Approved', 'Get well soon!'),
('EMP101', 'Paid', '2026-07-15', '2026-07-18', 'Family vacation trip.', 'Pending', NULL)
ON CONFLICT DO NOTHING;
