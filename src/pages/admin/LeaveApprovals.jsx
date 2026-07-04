import React, { useState, useEffect } from "react";
import { leaveMock } from "../../services/mock/leaveMock";
import { CheckSquare, Calendar, HelpCircle, Check, X, MessageSquare } from "lucide-react";
import styles from "../../styles/Pages.module.css";

const LeaveApprovals = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending"); // Pending vs All
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [comment, setComment] = useState("");
  const [processing, setProcessing] = useState(false);

  const loadLeaves = async () => {
    try {
      const data = await leaveMock.getAllLeaves();
      setLeaves(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleAction = async (status) => {
    if (!selectedLeave) return;

    setProcessing(true);
    try {
      await leaveMock.updateLeaveStatus(selectedLeave.id, status, comment);
      setComment("");
      setSelectedLeave(null);
      await loadLeaves();
    } catch (e) {
      alert("Action failed: " + e.message);
    } finally {
      setProcessing(false);
    }
  };

  const filteredLeaves = leaves.filter(l => 
    activeTab === "Pending" ? l.status === "Pending" : true
  );

  if (loading) {
    return <div style={{ color: "var(--text-muted)" }}>Loading leave requests...</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Leave Approvals</h2>
          <p className={styles.subtitle}>Review, approve, or reject employee leave requests</p>
        </div>
      </div>

      {/* Tabs for Pending vs All */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("Pending")}
          className={activeTab === "Pending" ? styles.btnPrimary : styles.btnSecondary}
          style={{ padding: "8px 16px" }}
        >
          Pending Requests ({leaves.filter(l => l.status === "Pending").length})
        </button>
        <button
          onClick={() => setActiveTab("All")}
          className={activeTab === "All" ? styles.btnPrimary : styles.btnSecondary}
          style={{ padding: "8px 16px" }}
        >
          All History
        </button>
      </div>

      <div className={styles.grid2Col}>
        {/* Left: Leave Request List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredLeaves.length > 0 ? (
            filteredLeaves.map(leave => (
              <div
                key={leave.id}
                onClick={() => setSelectedLeave(leave)}
                style={{
                  padding: "16px",
                  borderRadius: "var(--border-radius-md)",
                  border: "1px solid var(--border-color)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                  backgroundColor: selectedLeave?.id === leave.id ? "var(--primary-light-bg)" : "var(--bg-card)",
                  borderColor: selectedLeave?.id === leave.id ? "var(--primary)" : "var(--border-color)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.95rem" }}>
                    {leave.employeeName}
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

                <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 500, marginBottom: "6px" }}>
                  {leave.leaveType} Leave
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                  <Calendar size={14} />
                  <span>{leave.startDate} to {leave.endDate}</span>
                </div>

                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  "{leave.remarks}"
                </p>
              </div>
            ))
          ) : (
            <div className={styles.card} style={{ textAlign: "center", padding: "40px", color: "var(--text-light)" }}>
              No leave requests found.
            </div>
          )}
        </div>

        {/* Right: Detailed Action Panel */}
        {selectedLeave ? (
          <div className={styles.card} style={{ position: "sticky", top: "100px" }}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}><CheckSquare size={18} /> Request Details</h3>
              <button 
                onClick={() => setSelectedLeave(null)}
                style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
              >
                Close
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.9rem" }}>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Employee Name:</span>
                <div style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "1.05rem" }}>
                  {selectedLeave.employeeName} ({selectedLeave.employeeId})
                </div>
              </div>

              <div>
                <span style={{ color: "var(--text-muted)" }}>Leave Type & Duration:</span>
                <div style={{ fontWeight: 500, color: "var(--primary)", marginTop: "2px" }}>
                  {selectedLeave.leaveType} Leave
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-light)", marginTop: "4px" }}>
                  <Calendar size={14} />
                  <span>{selectedLeave.startDate} to {selectedLeave.endDate}</span>
                </div>
              </div>

              <div>
                <span style={{ color: "var(--text-muted)" }}>Reason:</span>
                <div 
                  style={{ 
                    padding: "12px", 
                    backgroundColor: "var(--bg-app)", 
                    borderRadius: "var(--border-radius-md)", 
                    marginTop: "6px",
                    color: "var(--text-main)",
                    lineHeight: "1.4"
                  }}
                >
                  "{selectedLeave.remarks}"
                </div>
              </div>

              {selectedLeave.status === "Pending" ? (
                <div className={styles.form} style={{ marginTop: "8px" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <MessageSquare size={14} style={{ marginRight: "4px" }} /> HR Comment (Optional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add comments or instructions for the employee..."
                      className={styles.textarea}
                      disabled={processing}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                    <button
                      onClick={() => handleAction("Approved")}
                      className={styles.btnPrimary}
                      style={{ flex: 1 }}
                      disabled={processing}
                    >
                      <Check size={16} /> Approve
                    </button>
                    <button
                      onClick={() => handleAction("Rejected")}
                      className={styles.btnDanger}
                      style={{ flex: 1 }}
                      disabled={processing}
                    >
                      <X size={16} /> Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  style={{
                    padding: "16px",
                    backgroundColor: "var(--bg-app)",
                    borderRadius: "var(--border-radius-md)",
                    marginTop: "8px",
                    textAlign: "center",
                    border: "1px dashed var(--border-color)"
                  }}
                >
                  <div style={{ fontWeight: 600, color: "var(--text-main)", marginBottom: "4px" }}>
                    Status: {selectedLeave.status}
                  </div>
                  {selectedLeave.adminComment && (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      HR Comment: "{selectedLeave.adminComment}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.card} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
            <span style={{ color: "var(--text-light)" }}>Select a request to view details and action</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveApprovals;
