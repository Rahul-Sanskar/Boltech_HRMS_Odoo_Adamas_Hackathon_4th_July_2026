import React, { useState, useEffect } from "react";
import { attendanceMock } from "../../services/mock/attendanceMock";
import { Calendar, Search } from "lucide-react";
import styles from "../../styles/Pages.module.css";

const AdminAttendance = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceMock.getAllAttendance()
      .then(data => setRecords(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ color: "var(--text-muted)" }}>Loading staff attendance logs...</div>;
  }

  const filteredRecords = records.filter(rec => {
    const matchesSearch = 
      rec.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(search.toLowerCase());
      
    const matchesDate = dateFilter ? rec.date === dateFilter : true;
    
    return matchesSearch && matchesDate;
  });

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Staff Attendance Logs</h2>
          <p className={styles.subtitle}>Monitor staff clock-in/out records and status</p>
        </div>
      </div>

      {/* Filters Card */}
      <div className={styles.card} style={{ marginBottom: "24px", padding: "16px" }}>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: 2, position: "relative", minWidth: "200px" }}>
            <input
              type="text"
              placeholder="Search by employee name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.input}
              style={{ paddingLeft: "40px" }}
            />
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-light)"
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: "150px" }}>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>
      </div>

      {/* Logs Table Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}><Calendar size={18} /> Attendance Logs</h3>
        </div>

        {filteredRecords.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(rec => (
                  <tr key={rec.id}>
                    <td style={{ fontWeight: 500 }}>{rec.employeeId}</td>
                    <td>{rec.employeeName}</td>
                    <td>{new Date(rec.date).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}</td>
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
          <div style={{ textAlign: "center", padding: "30px", color: "var(--text-light)", fontSize: "0.85rem" }}>
            No matching attendance records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttendance;
