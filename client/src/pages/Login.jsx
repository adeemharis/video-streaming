import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(emailOrUsername, password);
      nav(from, { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container" style={{ marginTop: 40 }}>
      <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h2>Login</h2>
        <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <input placeholder="Email or Username" value={emailOrUsername}
                 onChange={(e) => setEmailOrUsername(e.target.value)} className="input" style={{ borderRadius: 8 }} />
          <input placeholder="Password" type="password" value={password}
                 onChange={(e) => setPassword(e.target.value)} className="input" style={{ borderRadius: 8 }} />
          {err && <div style={{ color: "crimson" }}>{err}</div>}
          <button className="btn" type="submit">Login</button>
        </form>
        <p style={{ marginTop: 10, color: "var(--muted)" }}>
          No account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}
