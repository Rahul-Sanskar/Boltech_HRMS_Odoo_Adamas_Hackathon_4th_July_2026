import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { leaveMock } from "../../services/mock/leaveMock";
import { FileText, Calendar, Send, HelpCircle, Check, X, AlertCircle } from "lucide-react";
import styles from "../../styles/Pages.module.css";

const EmployeeLeave = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [leaveType, setLeaveType] = useState("Paid");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchLeaves = async () => {
    if (user) {
      try {
        const data = await leaveMock.getLeavesByEmployee(user.id);
        setLeaves(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !remarks) {
      alert("Please fill in all fields.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be after end date.");
      return;
    }

    setSubmitting(true);
    setSuccessMsg("");
    try {
      await leaveMock.applyLeave({
        employeeId: user.id,
        leaveType,
        startDate,
        endDate,
        remarks
      });
      setStartDate("");
      setEndDate("");
      setRemarks("");
      setSuccessMsg("Leave application submitted successfully!");
      fetchLeaves();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Failed to submit request: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ color: "var(--text-muted)" }}>Loading leaves details...</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Leave Management</h2>
          <p className={styles.subtitle}>Apply for leaves and track approval status</p>
        </div>
      </div>

      <div className={styles.grid2Col}>
        {/* Leave Request Form */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}><Send size={18} /> Apply for Leave</h3>
          </div>
          
          {successMsg && (
            <div 
              style={{
                backgroundColor: "var(--success-glow)",
                color: "var(--success)",
                padding: "10px 14px",
                borderRadius: "var(--border-radius-md)",
                fontSize: "0.85rem",
                fontWeight: 500,
                marginBottom: "16px",
                border: "1px solid rgba(16, 185, 129, 0.2)"
              }}
            >
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Leave Type</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className={styles.select}
                disabled={submitting}
              >
                <option value="Paid">Paid Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Unpaid">Unpaid Leave</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={styles.input}
                  disabled={submitting}
                  required
                />
              </div>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label className={styles.label}>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={styles.input}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Reason / Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Brief description of the reason for leave"
                className={styles.textarea}
                disabled={submitting}
                required
              />
            </div>

            <button type="submit" className={styles.btnPrimary} style={{ marginTop: "8px" }} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>

        {/* Leave History List */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}><FileText size={18} /> Application History</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {leaves.length > 0 ? (
              leaves.map((leave) => (
                <div
                  key={leave.id}
                  style={{
                    padding: "16px",
                    borderRadius: "var(--border-radius-md)",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--bg-app)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)" }}>
                      {leave.leaveType} Leave
                    </span>
                    <span className={
                      leave.status === "Approved"
                        ? styles.badgeSuccess
                        : leave.status === "Pending"
                        ? styles.badgeWarning
                        : styles.badgeDanger
                    }>
                      {leave.status}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                    <Calendar size={14} />
                    <span>
                      {leave.startDate} to {leave.endDate}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.85rem", color: "var(--text-main)", marginBottom: "6px" }}>
                    <strong>Remarks:</strong> {leave.remarks}
                  </p>

                  {leave.adminComment && (
                    <div 
                      style={{ 
                        marginTop: "8px", 
                        padding: "8px 10px", 
                        backgroundColor: "var(--bg-card)", 
                        borderRadius: "var(--border-radius-sm)", 
                        fontSize: "0.75rem", 
                        borderLeft: "3px solid var(--primary)",
                        color: "var(--text-muted)"
                      }}
                    >
                      <strong>HR Comment:</strong> {leave.adminComment}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", color: "var(--text-light)", padding: "30px", fontSize: "0.85rem" }}>
                No leave requests found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeave;
