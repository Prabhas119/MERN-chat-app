import { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/socketcontext";
import api from "../utils/api";

export default function Sidebar({
  users,
  setUsers,
  selectedUser,
  setSelectedUser,
  unreadCounts,
  setUnreadCounts,
}) {
  const { onlineUsers } = useSocket();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

  // Search users as you type
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await api.get(`/auth/search?query=${searchQuery}`);
        setSearchResults(data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setSearching(false);
      }
    }, 400); // wait 400ms after typing stops
  }, [searchQuery]);

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setUnreadCounts((prev) => ({ ...prev, [u._id]: 0 }));

    // Add to recent chats if not already there
    setUsers((prev) => {
      const exists = prev.find((p) => p._id === u._id);
      if (!exists) return [u, ...prev];
      return prev;
    });

    // Clear search
    setSearchQuery("");
    setSearchResults([]);
  };

  const displayUsers = searchQuery.trim() !== "" ? searchResults : users;

  return (
    <div style={styles.sidebar}>

      {/* 🔍 Search Bar */}
      <div style={styles.searchWrap}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="🔍 Search users with user names..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button style={styles.clearBtn} onClick={() => setSearchQuery("")}>✕</button>
        )}
      </div>

      {/* Label */}
      <h3 style={styles.heading}>
        {searchQuery ? "Search Results" : "Recent Chats"}
      </h3>

      {/* Loading */}
      {searching && <p style={styles.empty}>Searching...</p>}

      {/* No results */}
      {!searching && searchQuery && searchResults.length === 0 && (
        <p style={styles.empty}>No users found</p>
      )}

      {/* No recent chats */}
      {!searchQuery && users.length === 0 && (
        <p style={styles.empty}>Search for a user to start chatting</p>
      )}

      {/* User List */}
      {displayUsers.map((u) => (
        <div
          key={u._id}
          style={{
            ...styles.userItem,
            background: selectedUser?._id === u._id ? "#334155" : "transparent",
          }}
          onClick={() => handleSelectUser(u)}
        >
          <div style={styles.avatarWrap}>
            <div style={styles.avatar}>{u.username[0].toUpperCase()}</div>
            {unreadCounts[u._id] > 0 && (
              <span style={styles.badge}>{unreadCounts[u._id]}</span>
            )}
          </div>
          <div>
            <p style={styles.username}>{u.username}</p>
            <p style={{
              ...styles.status,
              color: onlineUsers.includes(u._id) ? "#4ade80" : "#64748b",
            }}>
              {onlineUsers.includes(u._id) ? "● Online" : "○ Offline"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  sidebar: { width:"240px", background:"#0f172a", borderRight:"1px solid #1e293b", display:"flex", flexDirection:"column", overflow:"hidden" },
  searchWrap: { position:"relative", padding:"12px 12px 6px" },
  searchInput: { width:"100%", padding:"8px 32px 8px 12px", borderRadius:"8px", border:"1px solid #334155", background:"#1e293b", color:"#e2e8f0", fontSize:"13px", outline:"none", boxSizing:"border-box" },
  clearBtn: { position:"absolute", right:"18px", top:"50%", transform:"translateY(-30%)", background:"none", border:"none", color:"#94a3b8", cursor:"pointer", fontSize:"14px" },
  heading: { color:"#94a3b8", fontSize:"11px", letterSpacing:"0.08em", textTransform:"uppercase", padding:"6px 16px", marginBottom:"4px" },
  empty: { color:"#475569", fontSize:"13px", padding:"8px 16px" },
  userItem: { display:"flex", alignItems:"center", gap:"10px", padding:"10px 16px", cursor:"pointer", borderRadius:"8px", margin:"2px 8px" },
  avatarWrap: { position:"relative", flexShrink:0 },
  avatar: { width:"36px", height:"36px", borderRadius:"50%", background:"#6366f1", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:"700", fontSize:"15px" },
  badge: { position:"absolute", top:"-4px", right:"-4px", background:"#ef4444", color:"#fff", borderRadius:"50%", fontSize:"10px", fontWeight:"700", width:"18px", height:"18px", display:"flex", alignItems:"center", justifyContent:"center" },
  username: { color:"#e2e8f0", fontSize:"14px", margin:0 },
  status: { fontSize:"11px", margin:0 },
};