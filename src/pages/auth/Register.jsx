import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Auth.module.css";

const Register = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee"); // Employee vs Admin
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || !name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await register({ id, email, password, role, name });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <div className={styles.logo}>O</div>
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>Register to access the HRMS platform</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}
        {success && (
          <div 
            style={{ 
              backgroundColor: "var(--success-glow)", 
              color: "var(--success)", 
              padding: "12px 16px", 
              borderRadius: "var(--border-radius-md)", 
              fontSize: "0.875rem", 
              fontWeight: 500, 
              border: "1px solid rgba(16, 185, 129, 0.2)",
              marginBottom: "16px"
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Role</label>
            <div className={styles.roleSelector}>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === "Employee" ? styles.activeRoleBtn : ""}`}
                onClick={() => setRole("Employee")}
                disabled={submitting}
              >
                Employee
              </button>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === "Admin" ? styles.activeRoleBtn : ""}`}
                onClick={() => setRole("Admin")}
                disabled={submitting}
              >
                Admin / HR
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Employee ID</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g. EMP103"
              className={styles.input}
              disabled={submitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className={styles.input}
              disabled={submitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@boltech.com"
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
              placeholder="Min. 6 characters"
              className={styles.input}
              disabled={submitting}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
