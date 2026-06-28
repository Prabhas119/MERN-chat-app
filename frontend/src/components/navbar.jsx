import { useState } from "react";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Navbar({ selectedUser, onBackClick }) {
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
      logout();
      navigate("/register");
    } catch (err) {
      alert("Failed to delete account.");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div style={styles.nav}>
        {/* Back button on mobile when chat is open */}
        {selectedUser && (
          <button style={styles.backBtn} onClick={onBackClick}>
            ◀
          </button>
        )}

        {/* Logo */}
        <span style={styles.logo}>Chat Application</span>

        {/* User info — hide on mobile when chat open */}
        {!selectedUser && (
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {user?.username[0].toUpperCase()}
            </div>
            <div style={styles.userText}>
              <p style={styles.username}>{user?.username}</p>
              <p style={styles.email}>{user?.email}</p>
            </div>
          </div>
        )}

        {/* Selected user name on mobile */}
        {selectedUser && (
          <span style={styles.chatWithName}>{selectedUser.username}</span>
        )}

        {/* Buttons */}
        <div style={styles.btnGroup}>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
          <button
            style={styles.deleteBtn}
            onClick={() => setShowConfirm(true)}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <p style={styles.modalIcon}>⚠️</p>
            <p style={styles.modalTitle}>Delete Account?</p>
            <p style={styles.modalText}>
              This will permanently delete your account and all messages.
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
    padding: "10px 14px",
    background: "#1e293b",
    borderBottom: "1px solid #334155",
    flexWrap: "wrap",
    gap: "6px",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#e2e8f0",
    fontSize: "18px",
    cursor: "pointer",
    padding: "4px 8px",
  },
  logo: {
    color: "#6366f1",
    fontWeight: "700",
    fontSize: "16px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  userText: {
    display: "flex",
    flexDirection: "column",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#6366f1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
  },
  username: {
    color: "#e2e8f0",
    fontWeight: "600",
    fontSize: "13px",
    margin: 0,
  },
  email: {
    color: "#94a3b8",
    fontSize: "10px",
    margin: 0,
  },
  chatWithName: {
    color: "#e2e8f0",
    fontWeight: "600",
    fontSize: "15px",
    flex: 1,
    textAlign: "center",
  },
  btnGroup: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },
  logoutBtn: {
    padding: "5px 10px",
    background: "#334155",
    color: "#e2e8f0",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },
  deleteBtn: {
    padding: "5px 8px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  overlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    background: "#1e293b",
    borderRadius: "12px",
    padding: "1.5rem",
    width: "100%",
    maxWidth: "320px",
    textAlign: "center",
  },
  modalIcon: { fontSize: "36px", margin: "0 0 8px" },
  modalTitle: { color: "#e2e8f0", fontWeight: "700", fontSize: "17px", margin: "0 0 8px" },
  modalText: { color: "#94a3b8", fontSize: "13px", lineHeight: "1.5", margin: "0 0 1.2rem" },
  modalBtns: { display: "flex", gap: "10px", justifyContent: "center" },
  cancelBtn: { padding: "8px 20px", background: "#334155", color: "#e2e8f0", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
  confirmBtn: { padding: "8px 20px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
};