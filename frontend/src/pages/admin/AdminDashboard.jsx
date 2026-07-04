import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { profileMock } from "../../services/mock/profileMock";
import { attendanceMock } from "../../services/mock/attendanceMock";
import { leaveMock } from "../../services/mock/leaveMock";
import { Users, Clock, CheckSquare, DollarSign, Calendar, ArrowRight, UserCheck } from "lucide-react";
import styles from "../../styles/Pages.module.css";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    totalPayroll: 0
  });
  const [pendingLeavesList, setPendingLeavesList] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const employees = await profileMock.getAllProfiles();
        const attendance = await attendanceMock.getAllAttendance();
        const leaves = await leaveMock.getAllLeaves();

        // Calculate Stats
        const totalEmployees = employees.length;
        
        const todayStr = new Date().toISOString().split('T')[0];
        const presentToday = attendance.filter(a => a.date === todayStr && a.status === "Present").length;
        
        const pendingLeaves = leaves.filter(l => l.status === "Pending").length;
        
        const totalPayroll = employees.reduce((acc, emp) => {
          const struct = emp.salaryStructure;
          return acc + (struct.basic + struct.hra + struct.allowance - struct.deductions);
        }, 0);

        setStats({
          totalEmployees,
          presentToday,
          pendingLeaves,
          totalPayroll
        });

        setPendingLeavesList(leaves.filter(l => l.status === "Pending").slice(0, 5));
      } catch (error) {
        console.error("Failed to load admin stats", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleQuickApprove = async (id) => {
    try {
      await leaveMock.updateLeaveStatus(id, "Approved", "Approved via Dashboard");
      setPendingLeavesList(prev => prev.filter(l => l.id !== id));
      setStats(prev => ({ ...prev, pendingLeaves: prev.pendingLeaves - 1 }));
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  if (loading) {
    return <div style={{ color: "var(--text-muted)" }}>Loading admin dashboard...</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Admin Overview</h2>
          <p className={styles.subtitle}>Track organization operations, leaves, and payroll</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Total Employees */}
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Users size={24} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statVal}>{stats.totalEmployees}</span>
            <span className={styles.statLabel}>Total Staff</span>
          </div>
        </div>

        {/* Checked-in Today */}
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "var(--success-glow)", color: "var(--success)" }}>
            <UserCheck size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statVal}>{stats.presentToday}</span>
            <span className={styles.statLabel}>Present Today</span>
          </div>
        </div>

        {/* Pending Leaves */}
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "var(--warning-glow)", color: "var(--warning)" }}>
            <CheckSquare size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statVal}>{stats.pendingLeaves}</span>
            <span className={styles.statLabel}>Pending Leaves</span>
          </div>
        </div>

        {/* Total Payroll */}
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "var(--info-glow)", color: "var(--info)" }}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statVal}>₹{stats.totalPayroll.toLocaleString()}</span>
            <span className={styles.statLabel}>Monthly Payroll</span>
          </div>
        </div>
      </div>

      <div className={styles.grid2Col}>
        {/* Pending Approvals Table/List */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Pending Leaves Approvals</h3>
            <a href="/admin/leave-approvals" className={styles.btnSecondary} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
              View All
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {pendingLeavesList.length > 0 ? (
              pendingLeavesList.map(leave => (
                <div
                  key={leave.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    borderRadius: "var(--border-radius-md)",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--bg-app)"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>
                      {leave.employeeName}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {leave.leaveType} Leave • {leave.startDate} to {leave.endDate}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-light)", marginTop: "4px" }}>
                      "{leave.remarks}"
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleQuickApprove(leave.id)}
                      className={styles.btnPrimary}
                      style={{ padding: "6px 10px", fontSize: "0.75rem" }}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "30px", color: "var(--text-light)", fontSize: "0.85rem" }}>
                All clear! No pending leave requests.
              </div>
            )}
          </div>
        </div>

        {/* Quick Utilities Panel */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Quick HR Actions</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <a href="/admin/employees" className={styles.btnSecondary} style={{ justifyContent: "space-between" }}>
              <span>View Employee Directory</span> <ArrowRight size={16} />
            </a>
            <a href="/admin/attendance" className={styles.btnSecondary} style={{ justifyContent: "space-between" }}>
              <span>Check Staff Attendance</span> <ArrowRight size={16} />
            </a>
            <a href="/admin/payroll" className={styles.btnSecondary} style={{ justifyContent: "space-between" }}>
              <span>Configure Pay Structures</span> <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
