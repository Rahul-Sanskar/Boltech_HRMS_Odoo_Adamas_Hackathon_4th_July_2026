import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  User,
  Calendar,
  FileText,
  DollarSign,
  Users,
  CheckSquare,
  Building
} from "lucide-react";
import styles from "./Sidebar.module.css";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === "Admin";

  const employeeLinks = [
    { path: "/employee/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/employee/profile", label: "My Profile", icon: <User size={18} /> },
    { path: "/employee/attendance", label: "My Attendance", icon: <Calendar size={18} /> },
    { path: "/employee/leave", label: "Leaves & Time-Off", icon: <FileText size={18} /> },
    { path: "/employee/payroll", label: "My Payroll", icon: <DollarSign size={18} /> }
  ];

  const adminLinks = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/admin/employees", label: "Employees", icon: <Users size={18} /> },
    { path: "/admin/attendance", label: "Attendance", icon: <Calendar size={18} /> },
    { path: "/admin/leave-approvals", label: "Leave Approvals", icon: <CheckSquare size={18} /> },
    { path: "/admin/payroll", label: "Payroll Control", icon: <DollarSign size={18} /> }
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 99
          }}
          onClick={onClose}
        />
      )}

      <aside className={`${styles.sidebar} ${isOpen ? styles.openSidebar : ""}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>O</div>
          <span className={styles.logoText}>Boltech HRMS</span>
          <span className={styles.roleBadge}>{user.role}</span>
        </div>

        <nav className={styles.navSection}>
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.activeLink : ""}`
              }
              onClick={onClose}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <span className={styles.footerName}>Boltech Ltd.</span>
          <span>© 2026 HR Portal</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
