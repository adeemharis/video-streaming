import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { signup } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await signup(username, email, password);
      nav("/profile");
    } catch (e) {
      setErr(e?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container" style={{ marginTop: 40 }}>
      <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h2>Sign up</h2>
        <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <input className="input" style={{ borderRadius: 8 }} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="input" style={{ borderRadius: 8 }} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" style={{ borderRadius: 8 }} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {err && <div style={{ color: "crimson" }}>{err}</div>}
          <button className="btn" type="submit">Create account</button>
        </form>
        <p style={{ marginTop: 10, color: "var(--muted)" }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
