import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LayoutWrapper from "../components/layout/LayoutWrapper";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Employee Pages
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import EmployeeProfile from "../pages/employee/EmployeeProfile";
import EmployeeAttendance from "../pages/employee/EmployeeAttendance";
import EmployeeLeave from "../pages/employee/EmployeeLeave";
import EmployeePayroll from "../pages/employee/EmployeePayroll";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import EmployeeList from "../pages/admin/EmployeeList";
import AdminAttendance from "../pages/admin/AdminAttendance";
import LeaveApprovals from "../pages/admin/LeaveApprovals";
import AdminPayroll from "../pages/admin/AdminPayroll";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Employee Routes (Protected) */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <LayoutWrapper />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="attendance" element={<EmployeeAttendance />} />
          <Route path="leave" element={<EmployeeLeave />} />
          <Route path="payroll" element={<EmployeePayroll />} />
          {/* Redirect index `/employee` to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Admin Routes (Protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <LayoutWrapper />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="leave-approvals" element={<LeaveApprovals />} />
          <Route path="payroll" element={<AdminPayroll />} />
          {/* Redirect index `/admin` to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Catch-all root redirection */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
