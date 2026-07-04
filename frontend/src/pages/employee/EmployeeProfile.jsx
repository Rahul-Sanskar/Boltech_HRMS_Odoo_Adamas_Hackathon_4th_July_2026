import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { profileMock } from "../../services/mock/profileMock";
import { Phone, MapPin, Briefcase, Calendar, Shield, Mail, Edit2, FileText, Check } from "lucide-react";
import styles from "../../styles/Pages.module.css";

const EmployeeProfile = () => {
  const { user, profile, setProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [saving, setSaving] = useState(false);

  if (!profile) return <div style={{ color: "var(--text-muted)" }}>Loading profile...</div>;

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await profileMock.updateProfile(user.id, { phone, address });
      setProfile(updated);
      setEditing(false);
    } catch (e) {
      alert("Failed to update profile: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>My Profile</h2>
          <p className={styles.subtitle}>View and manage your personal and professional details</p>
        </div>
        <button
          onClick={editing ? handleSave : () => setEditing(true)}
          className={styles.btnPrimary}
          disabled={saving}
        >
          {editing ? (
            <>
              <Check size={16} /> Save Changes
            </>
          ) : (
            <>
              <Edit2 size={16} /> Edit Profile
            </>
          )}
        </button>
      </div>

      <div className={styles.grid2Col}>
        {/* Profile Card & Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Main Info Card */}
          <div className={styles.card} style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <img
              src={profile.profilePic}
              alt={profile.name}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid var(--primary-glow)"
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-main)" }}>{profile.name}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                <Briefcase size={16} />
                <span>{profile.designation} ({profile.department})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                <Calendar size={16} />
                <span>Joined {profile.joiningDate}</span>
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className={styles.card}>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "16px" }}>
              Contact Details
            </h4>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}><Mail size={14} style={{ marginRight: "4px" }} /> Email Address</label>
                <input
                  type="email"
                  value={profile.email}
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
                  placeholder="Enter phone number"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}><MapPin size={14} style={{ marginRight: "4px" }} /> Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!editing || saving}
                  placeholder="Enter residential address"
                  className={styles.textarea}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details: Documents & Salary Structure */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Salary Structure Card (Read Only) */}
          <div className={styles.card}>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "16px" }}>
              Salary Structure
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Basic Salary</span>
                <span style={{ fontWeight: 600 }}>₹{profile.salaryStructure.basic.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text-muted)" }}>House Rent Allowance (HRA)</span>
                <span style={{ fontWeight: 600 }}>₹{profile.salaryStructure.hra.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Other Allowances</span>
                <span style={{ fontWeight: 600 }}>₹{profile.salaryStructure.allowance.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", borderBottom: "1px dashed var(--border-color)", paddingBottom: "12px" }}>
                <span style={{ color: "var(--text-muted)" }}>Deductions (TDS/PF)</span>
                <span style={{ fontWeight: 600, color: "var(--danger)" }}>-₹{profile.salaryStructure.deductions.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 700, paddingTop: "4px" }}>
                <span>Net In-hand Salary</span>
                <span style={{ color: "var(--primary)" }}>
                  ₹{(profile.salaryStructure.basic + profile.salaryStructure.hra + profile.salaryStructure.allowance - profile.salaryStructure.deductions).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Documents Card */}
          <div className={styles.card}>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "16px" }}>
              Uploaded Documents
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {profile.documents && profile.documents.length > 0 ? (
                profile.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px",
                      borderRadius: "var(--border-radius-md)",
                      border: "1px solid var(--border-color)",
                      backgroundColor: "var(--bg-app)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <FileText size={20} style={{ color: "var(--primary)" }} />
                      <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-main)" }}>{doc.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>Uploaded on {doc.uploadDate}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>{doc.size}</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "0.85rem", color: "var(--text-light)", textAlign: "center", padding: "12px" }}>
                  No documents uploaded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
