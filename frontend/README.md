# Boltech HRMS - Frontend Portal

This is the web frontend for the Human Resource Management System (HRMS), built as a modern, responsive, and high-fidelity Single Page Application (SPA). It uses mock services storing state in `localStorage` to simulate full backend operations (check-in, leaves application, profile updates, and payroll edits) directly in the browser.

---

## 🚀 Tech Stack

*   **Framework**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite 8](https://vite.dev/)
*   **Language**: JavaScript (ES6+ / React JSX)
*   **Router**: [React Router 7](https://reactrouter.com/)
*   **Styling**: Pure CSS / CSS Modules
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## 🛠️ Setup Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Install Dependencies
Navigate into the `frontend` directory and install the packages:
```bash
cd frontend
npm install
```

### 2. Run the Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 3. Build for Production
Bundle the production-ready assets:
```bash
npm run build
```
This output is saved into the `dist/` directory.

---

## 🔑 Login Credentials

The application uses preloaded accounts in a local mock database. You can use these credentials to sign in:

| Role | Email Address | Password |
| :--- | :--- | :--- |
| **Employee** | `employee@boltech.com` | `password123` |
| **HR / Admin** | `admin@boltech.com` | `password123` |

*Note: For convenience, the Login page includes **Quick Fill** buttons to automatically fill these credentials.*

---

## 📁 Folder Structure

```text
frontend/
├── public/                 # Static asset resources
├── src/
│   ├── assets/             # Branding icons & global images
│   ├── components/         # Reusable UI component modules
│   │   ├── common/         # Buttons, Cards, Inputs, Modals
│   │   ├── layout/         # Header Nav, Sidebar, Layout Wrappers
│   │   ├── attendance/     # Clock-in widgets, attendance logs
│   │   ├── leave/          # Leave request grids & forms
│   │   └── payroll/        # Payslips & salary editors
│   ├── context/            # Global React Contexts (AuthContext)
│   ├── hooks/              # Reusable custom hooks
│   ├── pages/              # Primary View containers
│   │   ├── auth/           # Login / Register
│   │   ├── employee/       # Employee Dash, Profile, Attendance, Leave, Payroll
│   │   └── admin/          # HR Dash, Directory, Company Attendance, Leaves, Payroll Control
│   ├── router/             # ProtectedRoutes & Routing tables
│   ├── services/           # Business logic API wrappers
│   │   └── mock/           # Mock services powered by localStorage
│   ├── styles/             # Global CSS Variables & reset sheets
│   ├── App.jsx             # Root App module wrapping providers
│   └── main.jsx            # DOM renderer hook
├── package.json
└── vite.config.js
```

---

## 💡 How the Mock Database Works
All features (such as Employee check-in/out status, Leave requests, and HR edits to salaries/profiles) write directly to the browser's `localStorage` (via `src/services/mock/db.js`). 

*   Changes reflect immediately across sessions.
*   Data is persistent even when reloading pages.
*   You can clear browser cache/storage to reset the application back to the default accounts and mock histories.
