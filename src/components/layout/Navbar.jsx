import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import { Bell, LogOut, Menu } from "lucide-react";
import styles from "./Navbar.module.css";

const Navbar = ({ onToggleSidebar }) => {
  const { user, profile, logout } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("profile")) return "My Profile";
    if (path.includes("attendance")) return "Attendance Management";
    if (path.includes("leave")) return "Leave & Time-Off";
    if (path.includes("payroll")) return "Payroll & Salary";
    if (path.includes("employees")) return "Employee Directory";
    return "HR Portal";
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.titleSection}>
        <button className={styles.mobileMenuBtn} onClick={onToggleSidebar} aria-label="Toggle Sidebar">
          <Menu size={24} />
        </button>
        <h1 className={styles.title}>{getPageTitle()}</h1>
      </div>

      <div className={styles.actionsSection}>
        <button className={styles.notificationBtn} aria-label="Notifications">
          <Bell size={20} />
          <span className={styles.badge}></span>
        </button>

        {user && (
          <div className={styles.userProfile}>
            <img
              src={profile?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
              alt={user.name}
              className={styles.avatar}
            />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userRole}>{user.role}</span>
            </div>
          </div>
        )}

        <button className={styles.logoutBtn} onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
