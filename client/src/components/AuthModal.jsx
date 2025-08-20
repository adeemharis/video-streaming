import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function AuthModal({ isOpen, onClose, onLogin, onSignup }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", username: "" });

  // Close on ESC and lock background scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };

  const modalStyle = {
    position: "relative",
    background: "#fff",
    width: "min(420px, 92vw)",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 12px 30px rgba(0,0,0,.25)",
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "10px 12px",
    marginBottom: 10,
    fontSize: 14,
  };

  const buttonStyle = {
    width: "100%",
    border: "none",
    borderRadius: 8,
    padding: "10px 12px",
    fontWeight: 600,
    cursor: "pointer",
    background: "#2563eb",
    color: "#fff",
  };

  const closeStyle = {
    position: "absolute",
    top: 10,
    right: 12,
    background: "transparent",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
    color: "#6b7280",
  };

  // Click on backdrop closes; click inside modal does not
  const stop = (e) => e.stopPropagation();

  return createPortal(
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={stop} role="dialog" aria-modal="true">
        <button aria-label="Close" onClick={onClose} style={closeStyle}>✖</button>

        <h2 style={{ fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 14 }}>
          {mode === "login" ? "Login" : "Signup"}
        </h2>

        {mode === "signup" && (
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={inputStyle}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ ...inputStyle, marginBottom: 14 }}
        />

        <button
          onClick={() => (mode === "login" ? onLogin?.(form) : onSignup?.(form))}
          style={buttonStyle}
        >
          {mode === "login" ? "Login" : "Signup"}
        </button>

        <p style={{ fontSize: 13, textAlign: "center", marginTop: 12 }}>
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span
                style={{ color: "#2563eb", cursor: "pointer" }}
                onClick={() => setMode("signup")}
              >
                Signup
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                style={{ color: "#2563eb", cursor: "pointer" }}
                onClick={() => setMode("login")}
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>,
    document.body
  );
}
