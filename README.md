# Boltech HRMS - Odoo Adamas Hackathon

Welcome to the Human Resource Management System (HRMS) project repository. This system is designed to digitize and streamline core HR operations, such as employee onboarding, profile management, attendance tracking, leave management, payroll visibility, and approval workflows.

---

## 📁 Repository Structure

The project is structured with separate directories for the frontend and backend to facilitate integration:

*   **`frontend/`**: The React + Vite (JS/JSX) Single Page Application.
*   **`backend/`**: *(To be added later)*

---

## 💻 Web Frontend Portal

The frontend represents a fully functional interactive web application with a design system built using CSS Modules. Since the backend is pending, the frontend operates on a persistent client-side database (`localStorage`), simulating full operations like check-ins, leave submissions, and admin salary configurations in the browser.

### Getting Started with Frontend Setup
To run, build, or test the frontend, please check the dedicated setup instructions:

👉 **[Frontend Setup & Configuration Guide](./frontend/README.md)**

---

## 🔑 Demo Access Credentials

You can use the following mock accounts preloaded in the database to log in and explore the application views:

| Role | Email Address | Password |
| :--- | :--- | :--- |
| **Regular Employee** | `employee@boltech.com` | `password123` |
| **HR Officer / Admin** | `admin@boltech.com` | `password123` |

---

## 🛠️ Features Implemented
*   **Secure Authentication**: Role-based access control with login and signup panels.
*   **Employee Profile Management**: Personal data screens with inline contacts editing.
*   **Attendance Tracking**: Active clock-in/out widgets, time log history, and company-wide attendance monitoring for admins.
*   **Leave Management**: Request submissions with calendar range picking and HR approval workflows.
*   **Payroll**: Read-only wage slips for employees, and salary configuration editors for HR.
