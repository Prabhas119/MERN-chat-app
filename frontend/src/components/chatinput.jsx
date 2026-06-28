import { useState } from "react";

export default function ChatInput({ onSend, onTyping, onStopTyping }) {
  const [text, setText] = useState("");
  let typingTimer = null;

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping();
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => onStopTyping(), 1500);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
    onStopTyping();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.bar}>
      <input
        style={styles.input}
        type="text"
        placeholder="Type a Message..."
        value={text}
        onChange={handleChange}
        onKeyDown={handleKey}
      />
      <button style={styles.btn} onClick={handleSend}>
        ➤
      </button>
    </div>
  );
}

const styles = {
  bar: {
    display: "flex",
    gap: "8px",
    padding: "10px 12px",
    background: "#1e293b",
    borderTop: "1px solid #334155",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "24px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#e2e8f0",
    fontSize: "15px",
    outline: "none",
  },
  btn: {
    width: "44px",
    height: "44px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
};