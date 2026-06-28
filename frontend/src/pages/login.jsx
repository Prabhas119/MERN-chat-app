import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/authcontext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>💬 Welcome Back</h2>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          {/* 👁️ Password field with show/hide */}
          <div style={styles.passwordWrap}>
            <input
              style={styles.passwordInput}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              style={styles.eyeBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.link}>
          New here? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh",minHeight:"100dvh" ,background:"#0f172a",padding:"20px" ,},
  card: { background:"#1e293b", padding:"1.5rem", borderRadius:"12px", width:"100%",maxWidth:"380px", boxShadow:"0 8px 32px rgba(0,0,0,0.4)" },
  title: { color:"#e2e8f0", textAlign:"center", marginBottom:"1.5rem" },
  input: { display:"block", width:"100%", padding:"10px 14px", marginBottom:"1rem", borderRadius:"8px", border:"1px solid #334155", background:"#0f172a", color:"#e2e8f0", fontSize:"14px", boxSizing:"border-box" },

  // 👇 New styles for password toggle
  passwordWrap: { position:"relative", marginBottom:"1rem" },
  passwordInput: { display:"block", width:"100%", padding:"10px 44px 10px 14px", borderRadius:"8px", border:"1px solid #334155", background:"#0f172a", color:"#e2e8f0", fontSize:"14px", boxSizing:"border-box" },
  eyeBtn: { position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:"18px", padding:"0" },

  btn: { width:"100%", padding:"11px", background:"#6366f1", color:"#fff", border:"none", borderRadius:"8px", fontWeight:"600", cursor:"pointer", fontSize:"15px" },
  error: { color:"#f87171", marginBottom:"1rem", fontSize:"14px" },
  link: { color:"#94a3b8", textAlign:"center", marginTop:"1rem", fontSize:"14px" },
};