import React, { useState, useEffect } from "react";
import { payrollMock } from "../../services/mock/payrollMock";
import { DollarSign, Edit, Check, X, Building, Users } from "lucide-react";
import styles from "../../styles/Pages.module.css";

const AdminPayroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPay, setSelectedPay] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit fields
  const [basic, setBasic] = useState(0);
  const [hra, setHra] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [deductions, setDeductions] = useState(0);

  const loadPayrolls = async () => {
    try {
      const data = await payrollMock.getAllPayrolls();
      setPayrolls(data);
      if (data.length > 0 && !selectedPay) {
        setSelectedPay(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayrolls();
  }, []);

  useEffect(() => {
    if (selectedPay) {
      setBasic(selectedPay.salaryStructure.basic);
      setHra(selectedPay.salaryStructure.hra);
      setAllowance(selectedPay.salaryStructure.allowance);
      setDeductions(selectedPay.salaryStructure.deductions);
    }
  }, [selectedPay]);

  const handleSelect = (pay) => {
    setSelectedPay(pay);
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await payrollMock.updateSalaryStructure(selectedPay.employeeId, {
        basic,
        hra,
        allowance,
        deductions
      });
      setEditing(false);
      // Reload lists
      const data = await payrollMock.getAllPayrolls();
      setPayrolls(data);
      // Find matching item in updated lists
      const updated = data.find(p => p.employeeId === selectedPay.employeeId);
      setSelectedPay(updated);
    } catch (e) {
      alert("Failed to save: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: "var(--text-muted)" }}>Loading payroll control center...</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Payroll & Compensation</h2>
          <p className={styles.subtitle}>Configure salary structures and allowance parameters</p>
        </div>
      </div>

      <div className={styles.grid2Col}>
        {/* Left: Employee List with Gross/Net Salaries */}
        <div className={styles.card} style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ backgroundColor: "var(--bg-hover)", padding: "16px", fontWeight: 600, borderBottom: "1px solid var(--border-color)", display: "flex", gap: "8px", alignItems: "center" }}>
            <Users size={16} /> staff Salary Grid
          </div>

          <div style={{ maxHeight: "550px", overflowY: "auto" }}>
            {payrolls.map(pay => (
              <div
                key={pay.employeeId}
                onClick={() => handleSelect(pay)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  borderBottom: "1px solid var(--border-color)",
                  cursor: "pointer",
                  backgroundColor: selectedPay?.employeeId === pay.employeeId ? "var(--primary-light-bg)" : "transparent"
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: selectedPay?.employeeId === pay.employeeId ? "var(--primary)" : "var(--text-main)" }}>
                    {pay.employeeName}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {pay.designation} ({pay.department})
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)" }}>
                    ₹{pay.calculations.net.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-light)" }}>Net In-Hand</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Salary Config Editor */}
        {selectedPay ? (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <DollarSign size={18} /> Salary Editor
              </h3>
              <div>
                {editing ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={handleSave} className={styles.btnPrimary} style={{ padding: "6px 12px", fontSize: "0.8rem" }} disabled={saving}>
                      Save
                    </button>
                    <button onClick={() => setEditing(false)} className={styles.btnSecondary} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditing(true)} className={styles.btnSecondary} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                    <Edit size={14} /> Adjust Salary
                  </button>
                )}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Editing compensation for:</span>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)", marginTop: "2px" }}>
                {selectedPay.employeeName} ({selectedPay.employeeId})
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>
                {selectedPay.designation} • {selectedPay.department}
              </div>
            </div>

            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Basic Salary (₹)</label>
                <input
                  type="number"
                  value={basic}
                  onChange={(e) => setBasic(e.target.value)}
                  disabled={!editing || saving}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>House Rent Allowance (HRA) (₹)</label>
                <input
                  type="number"
                  value={hra}
                  onChange={(e) => setHra(e.target.value)}
                  disabled={!editing || saving}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Other Allowances (₹)</label>
                <input
                  type="number"
                  value={allowance}
                  onChange={(e) => setAllowance(e.target.value)}
                  disabled={!editing || saving}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Total Deductions (PF/Tax) (₹)</label>
                <input
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(e.target.value)}
                  disabled={!editing || saving}
                  className={styles.input}
                  style={{ color: "var(--danger)" }}
                />
              </div>

              <div 
                style={{
                  marginTop: "16px",
                  padding: "16px",
                  backgroundColor: "var(--bg-app)",
                  borderRadius: "var(--border-radius-md)",
                  border: "1px dashed var(--border-color)",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>CALCULATED NET</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--primary)" }}>
                    ₹{(Number(basic) + Number(hra) + Number(allowance) - Number(deductions)).toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>GROSS TOTAL</span>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)" }}>
                    ₹{(Number(basic) + Number(hra) + Number(allowance)).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.card} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
            <span style={{ color: "var(--text-light)" }}>Select a salary record to adjust parameters</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayroll;
