
import { useState } from "react";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Navbar({ selectedUser }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete("/auth/delete");
      logout(); // clear localStorage
      navigate("/register");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete account. Try again.");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div style={styles.nav}>
        {/* Left — Logo */}
        <span style={styles.logo}>💬Chat Application</span>

        {/* Center — Logged in user info */}
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {user?.username[0].toUpperCase()}
          </div>
          <div>
            <p style={styles.username}>{user?.username}</p>
            <p style={styles.email}>{user?.email}</p>
          </div>
        </div>

        {/* Right — Buttons */}
        <div style={styles.btnGroup}>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
          <button
            style={styles.deleteBtn}
            onClick={() => setShowConfirm(true)}
          >
            🗑️ Delete Account
          </button>
        </div>
      </div>

      {/* ✅ Confirmation Popup */}
      {showConfirm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <p style={styles.modalIcon}>⚠️</p>
            <p style={styles.modalTitle}>Delete Account?</p>
            <p style={styles.modalText}>
              This will permanently delete your account and all your messages.
              This action cannot be undone.
            </p>
            <div style={styles.modalBtns}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                style={styles.confirmBtn}
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    background: "#1e293b",
    borderBottom: "1px solid #334155",
  },
  logo: {
    color: "#6366f1",
    fontWeight: "700",
    fontSize: "18px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#6366f1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
  },
  username: {
    color: "#e2e8f0",
    fontWeight: "600",
    fontSize: "14px",
    margin: 0,
  },
  email: {
    color: "#94a3b8",
    fontSize: "11px",
    margin: 0,
  },
  btnGroup: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  logoutBtn: {
    padding: "6px 14px",
    background: "#334155",
    color: "#e2e8f0",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  deleteBtn: {
    padding: "6px 14px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },

  // Confirmation modal
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#1e293b",
    borderRadius: "12px",
    padding: "2rem",
    width: "340px",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },
  modalIcon: {
    fontSize: "40px",
    margin: "0 0 8px",
  },
  modalTitle: {
    color: "#e2e8f0",
    fontWeight: "700",
    fontSize: "18px",
    margin: "0 0 8px",
  },
  modalText: {
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: "1.6",
    margin: "0 0 1.5rem",
  },
  modalBtns: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  cancelBtn: {
    padding: "9px 24px",
    background: "#334155",
    color: "#e2e8f0",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  confirmBtn: {
    padding: "9px 24px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
};