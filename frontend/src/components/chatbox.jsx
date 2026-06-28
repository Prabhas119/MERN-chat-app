
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ChatBox({ messages, typingUser, onEdit, onDelete }) {
  const { user } = useAuth();
  const bottomRef = useRef(null);
  const [hoveredMsg, setHoveredMsg] = useState(null);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderTicks = (msg, isMine) => {
    if (!isMine) return null;
    if (msg.isRead) {
      return <span style={{ color: "#38bdf8", fontSize: "13px" }}>✓✓</span>;
    }
    return <span style={{ color: "#94a3b8", fontSize: "13px" }}>✓✓</span>;
  };

  const handleEditSubmit = (msg) => {
    if (editText.trim() === "") return;
    onEdit(msg._id, editText.trim());
    setEditingMsgId(null);
    setEditText("");
  };

  return (
    <div style={styles.box}>
      {messages.length === 0 && (
        <div style={styles.empty}>
          <p>No messages yet. Say hello! 👋</p>
        </div>
      )}

      {messages.map((msg) => {
        const senderId = msg.sender?._id
          ? msg.sender._id.toString()
          : msg.sender?.toString();
        const isMine = senderId === user._id.toString();

        return (
          <div
            key={msg._id}
            style={{
              display: "flex",
              justifyContent: isMine ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
            onMouseEnter={() => setHoveredMsg(msg._id)}
            onMouseLeave={() => setHoveredMsg(null)}
          >
            <div style={{ position: "relative", maxWidth: "65%" }}>

              {/* ✅ Edit/Delete buttons — only on hover, only for sender */}
              {isMine && hoveredMsg === msg._id && editingMsgId !== msg._id && (
                <div style={styles.actionBtns}>
                  <button
                    style={styles.editBtn}
                    onClick={() => {
                      setEditingMsgId(msg._id);
                      setEditText(msg.content);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => onDelete(msg._id)}
                  >
                    🗑️
                  </button>
                </div>
              )}

              {/* Message bubble */}
              <div style={{
                ...styles.bubble,
                ...(isMine ? styles.mine : styles.theirs),
              }}>
                {/* ✅ Edit mode */}
                {editingMsgId === msg._id ? (
                  <div style={styles.editBox}>
                    <input
                      style={styles.editInput}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEditSubmit(msg);
                        if (e.key === "Escape") {
                          setEditingMsgId(null);
                          setEditText("");
                        }
                      }}
                      autoFocus
                    />
                    <div style={styles.editActions}>
                      <button
                        style={styles.saveBtn}
                        onClick={() => handleEditSubmit(msg)}
                      >
                        Save
                      </button>
                      <button
                        style={styles.cancelBtn}
                        onClick={() => {
                          setEditingMsgId(null);
                          setEditText("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p style={styles.msgText}>{msg.content}</p>
                    <div style={styles.meta}>
                      {msg.isEdited && (
                        <span style={styles.editedTag}>edited</span>
                      )}
                      <span style={styles.time}>{formatTime(msg.createdAt)}</span>
                      {renderTicks(msg, isMine)}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {typingUser && (
        <div style={styles.typing}>{typingUser} is typing...</div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

const styles = {
  box: { flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column" },
  empty: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontSize: "15px" },
  bubble: { padding: "10px 14px", borderRadius: "12px" },
  mine: { background: "#6366f1", borderBottomRightRadius: "2px" },
  theirs: { background: "#1e293b", borderBottomLeftRadius: "2px" },
  msgText: { color: "#f1f5f9", margin: 0, fontSize: "14px", lineHeight: "1.5", wordBreak: "break-word" },
  meta: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px", marginTop: "4px" },
  time: { color: "rgba(255,255,255,0.5)", fontSize: "11px" },
  editedTag: { color: "rgba(255,255,255,0.4)", fontSize: "10px", fontStyle: "italic" },
  typing: { color: "#94a3b8", fontSize: "13px", fontStyle: "italic", padding: "0 4px" },

  // Action buttons
  actionBtns: {
    position: "absolute",
    top: "-32px",
    right: "0",
    display: "flex",
    gap: "4px",
    background: "#1e293b",
    borderRadius: "8px",
    padding: "4px 6px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
    zIndex: 10,
  },
  editBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "15px", padding: "2px" },
  deleteBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "15px", padding: "2px" },

  // Edit input
  editBox: { display: "flex", flexDirection: "column", gap: "6px" },
  editInput: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #6366f1",
    background: "#0f172a",
    color: "#e2e8f0",
    fontSize: "14px",
    outline: "none",
    minWidth: "180px",
  },
  editActions: { display: "flex", gap: "6px", justifyContent: "flex-end" },
  saveBtn: { padding: "4px 12px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  cancelBtn: { padding: "4px 12px", background: "#334155", color: "#e2e8f0", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
};