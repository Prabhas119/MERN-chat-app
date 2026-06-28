import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword , setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/register", form);
      login(data);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>💬 Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="please ensure valid user name, your username is equal to your identity"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
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
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh", background:"#0f172a" },
  card: { background:"#1e293b", padding:"2rem", borderRadius:"12px", width:"360px", boxShadow:"0 8px 32px rgba(0,0,0,0.4)" },
  title: { color:"#e2e8f0", textAlign:"center", marginBottom:"1.5rem" },
  input: { display:"block", width:"100%", padding:"10px 14px", marginBottom:"1rem", borderRadius:"8px", border:"1px solid #334155", background:"#0f172a", color:"#e2e8f0", fontSize:"14px", boxSizing:"border-box" },
  btn: { width:"100%", padding:"11px", background:"#6366f1", color:"#fff", border:"none", borderRadius:"8px", fontWeight:"600", cursor:"pointer", fontSize:"15px" },
  error: { color:"#f87171", marginBottom:"1rem", fontSize:"14px" },
  link: { color:"#94a3b8", textAlign:"center", marginTop:"1rem", fontSize:"14px" },
  passwordWrap: { position:"relative", marginBottom:"1rem" },
  passwordInput: { display:"block", width:"100%", padding:"10px 44px 10px 14px", borderRadius:"8px", border:"1px solid #334155", background:"#0f172a", color:"#e2e8f0", fontSize:"14px", boxSizing:"border-box" },
  eyeBtn: { position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:"18px", padding:"0" },
};

