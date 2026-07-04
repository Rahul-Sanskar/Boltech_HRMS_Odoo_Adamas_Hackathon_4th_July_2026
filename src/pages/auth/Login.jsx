import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Auth.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (role) => {
    if (role === "Employee") {
      setEmail("employee@boltech.com");
      setPassword("password123");
    } else {
      setEmail("admin@boltech.com");
      setPassword("password123");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <div className={styles.logo}>O</div>
          <h2 className={styles.title}>Welcome to HRMS</h2>
          <p className={styles.subtitle}>Please sign in to access your dashboard</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. employee@boltech.com"
              className={styles.input}
              disabled={submitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
              disabled={submitting}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px dashed var(--border-color)" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 600 }}>
            QUICK FILL CREDENTIALS:
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => handleQuickFill("Employee")}
              style={{
                flex: 1,
                fontSize: "0.75rem",
                padding: "6px",
                borderRadius: "var(--border-radius-sm)",
                border: "1px solid var(--border-color)",
                color: "var(--primary)",
                fontWeight: 500
              }}
            >
              Employee Login
            </button>
            <button
              onClick={() => handleQuickFill("Admin")}
              style={{
                flex: 1,
                fontSize: "0.75rem",
                padding: "6px",
                borderRadius: "var(--border-radius-sm)",
                border: "1px solid var(--border-color)",
                color: "var(--primary)",
                fontWeight: 500
              }}
            >
              Admin/HR Login
            </button>
          </div>
        </div>

        <div className={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.link}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
