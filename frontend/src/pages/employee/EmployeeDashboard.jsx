import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { attendanceMock } from "../../services/mock/attendanceMock";
import { leaveMock } from "../../services/mock/leaveMock";
import { Clock, User, FileText, CheckCircle, ArrowRight } from "lucide-react";
import styles from "../../styles/Pages.module.css";

const EmployeeDashboard = () => {
  const { user, profile } = useAuth();
  const [time, setTime] = useState(new Date());
  const [todayAtt, setTodayAtt] = useState(null);
  const [leaveCount, setLeaveCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const todayStatus = await attendanceMock.getTodayStatus(user.id);
          setTodayAtt(todayStatus);
          
          const leaves = await leaveMock.getLeavesByEmployee(user.id);
          // count pending + approved leaves this year
          const approvedOrPending = leaves.filter(l => l.status !== "Rejected").length;
          setLeaveCount(approvedOrPending);
        } catch (error) {
          console.error("Dashboard data load error", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleCheckIn = async () => {
    try {
      const rec = await attendanceMock.checkIn(user.id);
      setTodayAtt(rec);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCheckOut = async () => {
    try {
      const rec = await attendanceMock.checkOut(user.id);
      setTodayAtt(rec);
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return <div style={{ color: "var(--text-muted)" }}>Loading dashboard...</div>;
  }

  const formatTime = (t) => {
    return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (t) => {
    return t.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Hello, {user.name}</h2>
          <p className={styles.subtitle}>Here is your summary for today</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Quick Profile Summary Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}><User size={18} /> My Profile</div>
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <img 
              src={profile?.profilePic} 
              alt={user.name} 
              style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover" }}
            />
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)" }}>{profile?.name}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{profile?.designation}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>ID: {profile?.id}</p>
            </div>
          </div>
        </div>

        {/* Check In / Out Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}><Clock size={18} /> Time Clock</div>
            {todayAtt && (
              <span className={styles.badgeSuccess}>Checked-In</span>
            )}
          </div>
          <div className={styles.attendanceWidget}>
            <div className={styles.timeDisplay}>{formatTime(time)}</div>
            <div className={styles.dateDisplay}>{formatDate(time)}</div>
            
            <div style={{ display: "flex", gap: "12px", width: "100%", marginTop: "8px" }}>
              {!todayAtt ? (
                <button onClick={handleCheckIn} className={styles.btnPrimary} style={{ flex: 1 }}>
                  Check In
                </button>
              ) : !todayAtt.checkOut ? (
                <button onClick={handleCheckOut} className={styles.btnDanger} style={{ flex: 1 }}>
                  Check Out
                </button>
              ) : (
                <div style={{ width: "100%", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 500 }}>
                  Logged: {todayAtt.checkIn} - {todayAtt.checkOut}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leaves & Salary Summary Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}><FileText size={18} /> Leaves Overview</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--primary)" }}>{leaveCount}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>APPLIED LEAVES</div>
            </div>
            <div style={{ borderLeft: "1px dashed var(--border-color)" }}></div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--success)" }}>
                {15 - leaveCount > 0 ? 15 - leaveCount : 0}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>AVAILABLE LEAVES</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.grid2Col}>
        {/* Recent Activity */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Recent Activity</h3>
          </div>
          <div className={styles.feedList}>
            <div className={styles.feedItem}>
              <div className={styles.feedDot} style={{ backgroundColor: "var(--primary)" }}></div>
              <div className={styles.feedContent}>
                <span className={styles.feedTitle}>Logged into the HR portal</span>
                <span className={styles.feedTime}>Just now</span>
              </div>
            </div>
            {todayAtt && (
              <div className={styles.feedItem}>
                <div className={styles.feedDot} style={{ backgroundColor: "var(--success)" }}></div>
                <div className={styles.feedContent}>
                  <span className={styles.feedTitle}>Checked In today at {todayAtt.checkIn}</span>
                  <span className={styles.feedTime}>{todayAtt.date}</span>
                </div>
              </div>
            )}
            <div className={styles.feedItem}>
              <div className={styles.feedDot} style={{ backgroundColor: "var(--warning)" }}></div>
              <div className={styles.feedContent}>
                <span className={styles.feedTitle}>Applied for a Sick Leave request</span>
                <span className={styles.feedTime}>2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Quick Links</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <a href="/employee/attendance" className={styles.btnSecondary} style={{ justifyContent: "space-between" }}>
              <span>View Full Attendance</span> <ArrowRight size={16} />
            </a>
            <a href="/employee/leave" className={styles.btnSecondary} style={{ justifyContent: "space-between" }}>
              <span>Apply for Leave</span> <ArrowRight size={16} />
            </a>
            <a href="/employee/payroll" className={styles.btnSecondary} style={{ justifyContent: "space-between" }}>
              <span>Download Salary slip</span> <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
