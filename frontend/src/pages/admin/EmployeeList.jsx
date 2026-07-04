import React, { useState, useEffect } from "react";
import { profileMock } from "../../services/mock/profileMock";
import { Search, User, Edit, Check, X, Phone, MapPin, Mail, Briefcase, Calendar } from "lucide-react";
import styles from "../../styles/Pages.module.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit fields
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const loadEmployees = async () => {
    try {
      const data = await profileMock.getAllProfiles();
      setEmployees(data);
      if (data.length > 0 && !selectedEmp) {
        setSelectedEmp(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmp) {
      setName(selectedEmp.name || "");
      setDesignation(selectedEmp.designation || "");
      setDepartment(selectedEmp.department || "");
      setPhone(selectedEmp.phone || "");
      setAddress(selectedEmp.address || "");
    }
  }, [selectedEmp]);

  const handleSelectEmployee = (emp) => {
    setSelectedEmp(emp);
    setEditing(false);
  };

  const handleSave = async () => {
    if (!name || !designation || !department) {
      alert("Name, designation, and department are required.");
      return;
    }

    setSaving(true);
    try {
      const updated = await profileMock.updateProfile(selectedEmp.id, {
        name,
        designation,
        department,
        phone,
        address
      });
      setSelectedEmp(updated);
      setEditing(false);
      // Reload list to update labels
      await loadEmployees();
    } catch (e) {
      alert("Error saving: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div style={{ color: "var(--text-muted)" }}>Loading employee directory...</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Employee Directory</h2>
          <p className={styles.subtitle}>Manage employee records and profiles</p>
        </div>
      </div>

      <div className={styles.grid2Col}>
        {/* Left Side: Directory List with Search */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className={styles.card} style={{ padding: "16px" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search by name or ID..."
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
          </div>

          <div className={styles.card} style={{ flex: 1, padding: "16px", overflowY: "auto", maxHeight: "550px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => handleSelectEmployee(emp)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    borderRadius: "var(--border-radius-md)",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                    backgroundColor: selectedEmp?.id === emp.id ? "var(--primary-light-bg)" : "transparent",
                    border: selectedEmp?.id === emp.id ? "1px solid var(--primary)" : "1px solid transparent"
                  }}
                >
                  <img
                    src={emp.profilePic}
                    alt={emp.name}
                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: selectedEmp?.id === emp.id ? "var(--primary)" : "var(--text-main)"
                    }}>
                      {emp.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {emp.designation} • {emp.id}
                    </div>
                  </div>
                </div>
              ))}
              {filteredEmployees.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--text-light)", padding: "20px", fontSize: "0.85rem" }}>
                  No employees found matching search.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Employee Detail / Edit Panel */}
        {selectedEmp ? (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <User size={18} /> Employee Details
              </h3>
              <div>
                {editing ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={handleSave} className={styles.btnPrimary} style={{ padding: "6px 12px", fontSize: "0.8rem" }} disabled={saving}>
                      <Check size={14} /> Save
                    </button>
                    <button onClick={() => setEditing(false)} className={styles.btnSecondary} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                      <X size={14} /> Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditing(true)} className={styles.btnSecondary} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                    <Edit size={14} /> Edit Record
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
              <img
                src={selectedEmp.profilePic}
                alt={selectedEmp.name}
                style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border-color)" }}
              />
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {editing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    style={{ fontSize: "1.1rem", padding: "6px 10px", marginBottom: "4px" }}
                  />
                ) : (
                  <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)" }}>{selectedEmp.name}</h4>
                )}
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>ID: {selectedEmp.id}</span>
              </div>
            </div>

            <div className={styles.form}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}><Briefcase size={14} style={{ marginRight: "4px" }} /> Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    disabled={!editing || saving}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    disabled={!editing || saving}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}><Mail size={14} style={{ marginRight: "4px" }} /> Email Address</label>
                <input
                  type="email"
                  value={selectedEmp.email}
                  disabled
                  className={styles.input}
                  style={{ backgroundColor: "var(--bg-app)", color: "var(--text-muted)" }}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}><Phone size={14} style={{ marginRight: "4px" }} /> Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!editing || saving}
                  placeholder="Not specified"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}><MapPin size={14} style={{ marginRight: "4px" }} /> Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!editing || saving}
                  placeholder="Not specified"
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}><Calendar size={14} style={{ marginRight: "4px" }} /> Joining Date</label>
                <input
                  type="text"
                  value={selectedEmp.joiningDate}
                  disabled
                  className={styles.input}
                  style={{ backgroundColor: "var(--bg-app)", color: "var(--text-muted)" }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.card} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
            <span style={{ color: "var(--text-light)" }}>Select an employee to view details</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
