import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div 
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justify: "center",
          flexDirection: "column",
          gap: "16px",
          backgroundColor: "var(--bg-app)",
          color: "var(--text-main)"
        }}
      >
        <div 
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid var(--border-color)",
            borderTopColor: "var(--primary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}
        />
        <span style={{ fontWeight: 500 }}>Loading HRMS Portal...</span>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If an Admin tries to access Employee pages or vice versa, redirect them to their respective dashboard
    const fallbackPath = user.role === "Admin" ? "/admin/dashboard" : "/employee/dashboard";
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
