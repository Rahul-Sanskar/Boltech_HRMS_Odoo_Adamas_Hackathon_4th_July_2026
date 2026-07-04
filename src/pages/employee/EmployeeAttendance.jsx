import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { attendanceMock } from "../../services/mock/attendanceMock";
import { Calendar, User, Clock, CheckCircle } from "lucide-react";
import styles from "../../styles/Pages.module.css";

const EmployeeAttendance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      attendanceMock.getAttendanceByEmployee(user.id)
        .then(data => setRecords(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return <div style={{ color: "var(--text-muted)" }}>Loading attendance records...</div>;
  }

  // Calculate quick stats
  const totalDays = records.length;
  const presentDays = records.filter(r => r.status === "Present").length;
  const halfDays = records.filter(r => r.status === "Half-day").length;
  const absentDays = records.filter(r => r.status === "Absent").length;

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Attendance History</h2>
          <p className={styles.subtitle}>View your daily check-in and check-out logs</p>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className={styles.grid} style={{ marginBottom: "24px" }}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Calendar size={24} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statVal}>{totalDays}</span>
            <span className={styles.statLabel}>Total Logs</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "var(--success-glow)", color: "var(--success)" }}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statVal}>{presentDays}</span>
            <span className={styles.statLabel}>Present Days</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "var(--warning-glow)", color: "var(--warning)" }}>
            <Clock size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statVal}>{halfDays}</span>
            <span className={styles.statLabel}>Half Days</span>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Daily Attendance Logs</h3>
        </div>
        
        {records.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.id}>
                    <td style={{ fontWeight: 500 }}>
                      {new Date(rec.date).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td>{rec.checkIn || "--"}</td>
                    <td>{rec.checkOut || "--"}</td>
                    <td>
                      <span className={
                        rec.status === "Present" 
                          ? styles.badgeSuccess 
                          : rec.status === "Half-day"
                          ? styles.badgeWarning
                          : styles.badgeDanger
                      }>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "30px", color: "var(--text-light)" }}>
            No attendance records found yet. Try checking in from the dashboard!
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAttendance;
