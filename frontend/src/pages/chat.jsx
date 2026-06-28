import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import ChatInput from "../components/ChatInput";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../utils/notifications";

export default function Chat() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    api.get("/auth/users")
      .then(({ data }) => setUsers(data))
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  const markMessagesRead = async (senderId) => {
    try {
      await api.put(`/messages/read/${senderId}`);
      socket?.emit("messages_read", {
        senderId: senderId,
        readerId: user._id,
      });
    } catch (err) {
      console.error("Mark read failed:", err);
    }
  };

  useEffect(() => {
    if (!selectedUser) return;
    api.get(`/messages/${selectedUser._id}`)
      .then(({ data }) => setMessages(data))
      .catch((err) => console.error("Failed to fetch messages:", err));
    markMessagesRead(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (msg) => {
      const senderId = msg.sender._id || msg.sender;
      if (selectedUser && senderId === selectedUser._id) {
        setMessages((prev) => [...prev, msg]);
        markMessagesRead(senderId);
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
        showNotification(
          `New message from ${msg.sender.username}`,
          msg.content,
          "/chat-icon.png"
        );
      }
    });

    socket.on("user_typing", (name) => setTypingUser(name));
    socket.on("user_stop_typing", () => setTypingUser(""));

    socket.on("messages_seen", ({ readerId }) => {
      if (selectedUser && readerId === selectedUser._id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender._id === user._id || msg.sender === user._id
              ? { ...msg, isRead: true }
              : msg
          )
        );
      }
    });

    // ✅ Receive edited message from socket
    socket.on("message_edited", (updatedMsg) => {
      setMessages((prev) =>
        prev.map((msg) => msg._id === updatedMsg._id ? updatedMsg : msg)
      );
    });

    // ✅ Receive deleted message from socket
    socket.on("message_deleted", (messageId) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("user_stop_typing");
      socket.off("messages_seen");
      socket.off("message_edited");
      socket.off("message_deleted");
    };
  }, [socket, selectedUser]);

  const handleSend = async (text) => {
    try {
      const { data } = await api.post("/messages/send", {
        receiverId: selectedUser._id,
        content: text,
      });
      setMessages((prev) => [...prev, data]);
      socket?.emit("send_message", {
        receiverId: selectedUser._id,
        message: data,
      });
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  // ✅ Edit message
  const handleEdit = async (messageId, newContent) => {
    try {
      const { data } = await api.put(`/messages/edit/${messageId}`, {
        content: newContent,
      });
      setMessages((prev) =>
        prev.map((msg) => msg._id === messageId ? data : msg)
      );
      socket?.emit("edit_message", {
        receiverId: selectedUser._id,
        message: data,
      });
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  // ✅ Delete message
  const handleDelete = async (messageId) => {
    try {
      await api.delete(`/messages/delete/${messageId}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      socket?.emit("delete_message", {
        receiverId: selectedUser._id,
        messageId,
      });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleTyping = () => {
    socket?.emit("typing", {
      receiverId: selectedUser?._id,
      senderName: user.username,
    });
  };

  const handleStopTyping = () => {
    socket?.emit("stop_typing", {
      receiverId: selectedUser?._id,
    });
  };

  return (
    <div style={styles.page}>
      <Navbar selectedUser={selectedUser} />
      <div style={styles.body}>
        <Sidebar
          users={users}
          setUsers={setUsers}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          unreadCounts={unreadCounts}
          setUnreadCounts={setUnreadCounts}
        />
        <div style={styles.chatArea}>
          {selectedUser ? (
            <>
              <div style={styles.chatHeader}>
                <div style={styles.chatAvatar}>
                  {selectedUser.username[0].toUpperCase()}
                </div>
                <div>
                  <p style={styles.chatName}>{selectedUser.username}</p>
                  <p style={styles.chatEmail}>{selectedUser.email}</p>
                </div>
              </div>

              <ChatBox
                messages={messages}
                typingUser={typingUser}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              <ChatInput
                onSend={handleSend}
                onTyping={handleTyping}
                onStopTyping={handleStopTyping}
              />
            </>
          ) : (
            <div style={styles.noChat}>
              <p style={styles.noChatIcon}>💬</p>
              <p style={styles.noChatText}>Select a user to start chatting</p>
              <p style={styles.noChatSub}>Search for users using the sidebar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", height: "100vh", background: "#0f172a", color: "#e2e8f0" },
  body: { display: "flex", flex: 1, overflow: "hidden" },
  chatArea: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" },
  chatHeader: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", background: "#1e293b", borderBottom: "1px solid #334155" },
  chatAvatar: { width: "38px", height: "38px", borderRadius: "50%", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "16px", flexShrink: 0 },
  chatName: { color: "#e2e8f0", fontWeight: "600", fontSize: "15px", margin: 0 },
  chatEmail: { color: "#94a3b8", fontSize: "11px", margin: 0 },
  noChat: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" },
  noChatIcon: { fontSize: "48px", margin: 0 },
  noChatText: { color: "#e2e8f0", fontSize: "16px", fontWeight: "600", margin: 0 },
  noChatSub: { color: "#475569", fontSize: "13px", margin: 0 },
};