import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { payrollMock } from "../../services/mock/payrollMock";
import { DollarSign, FileText, CheckCircle, ArrowDownToLine } from "lucide-react";
import styles from "../../styles/Pages.module.css";

const EmployeePayroll = () => {
  const { user } = useAuth();
  const [payrollData, setPayrollData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      payrollMock.getPayroll(user.id)
        .then(data => setPayrollData(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleDownloadSlip = () => {
    alert("Payslip PDF download simulated successfully!");
  };

  if (loading) {
    return <div style={{ color: "var(--text-muted)" }}>Loading payroll details...</div>;
  }

  if (!payrollData) {
    return <div style={{ color: "var(--text-muted)" }}>No payroll structure configured.</div>;
  }

  const { salaryStructure, calculations } = payrollData;

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>My Payroll</h2>
          <p className={styles.subtitle}>View salary structure and monthly pay-slip breakdown</p>
        </div>
        <button onClick={handleDownloadSlip} className={styles.btnPrimary}>
          <ArrowDownToLine size={16} /> Download Payslip
        </button>
      </div>

      <div className={styles.grid}>
        {/* Gross Income Card */}
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "var(--primary-light-bg)", color: "var(--primary)" }}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statVal}>₹{calculations.gross.toLocaleString()}</span>
            <span className={styles.statLabel}>Gross Monthly Pay</span>
          </div>
        </div>

        {/* Deductions Card */}
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "var(--danger-glow)", color: "var(--danger)" }}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statVal}>₹{calculations.deductions.toLocaleString()}</span>
            <span className={styles.statLabel}>Total Deductions</span>
          </div>
        </div>

        {/* Net Salary Card */}
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "var(--success-glow)", color: "var(--success)" }}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statVal}>₹{calculations.net.toLocaleString()}</span>
            <span className={styles.statLabel}>Net Take-Home Pay</span>
          </div>
        </div>
      </div>

      {/* Salary Breakdown Slip details */}
      <div className={styles.card} style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div 
          style={{
            textAlign: "center",
            paddingBottom: "20px",
            borderBottom: "2px solid var(--border-color)",
            marginBottom: "24px"
          }}
        >
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)" }}>BOLTECH LIMITED</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>HR & Payroll Services Division</p>
          <p style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--primary)", marginTop: "4px" }}>
            Salary Slip for July 2026
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px", fontSize: "0.875rem" }}>
          <div>
            <div style={{ marginBottom: "6px" }}><span style={{ color: "var(--text-muted)" }}>Employee ID:</span> <strong style={{ color: "var(--text-main)" }}>{payrollData.employeeId}</strong></div>
            <div style={{ marginBottom: "6px" }}><span style={{ color: "var(--text-muted)" }}>Name:</span> <strong style={{ color: "var(--text-main)" }}>{payrollData.employeeName}</strong></div>
            <div><span style={{ color: "var(--text-muted)" }}>Department:</span> <strong style={{ color: "var(--text-main)" }}>{payrollData.department}</strong></div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ marginBottom: "6px" }}><span style={{ color: "var(--text-muted)" }}>Designation:</span> <strong style={{ color: "var(--text-main)" }}>{payrollData.designation}</strong></div>
            <div style={{ marginBottom: "6px" }}><span style={{ color: "var(--text-muted)" }}>Status:</span> <strong className={styles.badgeSuccess}>Paid</strong></div>
            <div><span style={{ color: "var(--text-muted)" }}>Payment Method:</span> <strong style={{ color: "var(--text-main)" }}>Direct Bank Transfer</strong></div>
          </div>
        </div>

        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--border-radius-md)",
            overflow: "hidden"
          }}
        >
          {/* Earnings */}
          <div style={{ borderRight: "1px solid var(--border-color)" }}>
            <div style={{ backgroundColor: "var(--bg-hover)", padding: "10px 16px", fontWeight: 600, borderBottom: "1px solid var(--border-color)" }}>
              Earnings
            </div>
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", justify: "space-between" }}>
                <span>Basic Salary</span>
                <span style={{ fontWeight: 500 }}>₹{salaryStructure.basic.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justify: "space-between" }}>
                <span>House Rent Allowance</span>
                <span style={{ fontWeight: 500 }}>₹{salaryStructure.hra.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justify: "space-between" }}>
                <span>Special Allowances</span>
                <span style={{ fontWeight: 500 }}>₹{salaryStructure.allowance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <div style={{ backgroundColor: "var(--bg-hover)", padding: "10px 16px", fontWeight: 600, borderBottom: "1px solid var(--border-color)" }}>
              Deductions
            </div>
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", justify: "space-between" }}>
                <span>Income Tax (TDS)</span>
                <span style={{ fontWeight: 500 }}>₹{(salaryStructure.deductions * 0.6).toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justify: "space-between" }}>
                <span>Provident Fund (PF)</span>
                <span style={{ fontWeight: 500 }}>₹{(salaryStructure.deductions * 0.4).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Totals Summary */}
        <div 
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "var(--bg-hover)",
            borderRadius: "var(--border-radius-md)",
            border: "1px solid var(--border-color)"
          }}
        >
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>NET TAKE-HOME</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)" }}>
              ₹{calculations.net.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>GROSS EARNINGS</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)" }}>
              ₹{calculations.gross.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePayroll;
