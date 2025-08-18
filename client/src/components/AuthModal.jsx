import { useState } from "react";

export default function AuthModal({ open, onClose, onLogin, onSignup }) {
  const [mode, setMode] = useState("login"); // or "signup"
  const [form, setForm] = useState({ email: "", password: "", username: "" });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96 relative">
        <h2 className="text-xl font-bold mb-4">
          {mode === "login" ? "Login" : "Signup"}
        </h2>

        {mode === "signup" && (
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full border p-2 mb-2"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2 mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border p-2 mb-2"
        />

        <button
          onClick={() =>
            mode === "login" ? onLogin(form) : onSignup(form)
          }
          className="bg-blue-600 text-white w-full py-2 rounded mt-2"
        >
          {mode === "login" ? "Login" : "Signup"}
        </button>

        <p className="text-sm mt-2 text-center">
          {mode === "login" ? (
            <>Don’t have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setMode("signup")}
              >
                Signup
              </span>
            </>
          ) : (
            <>Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setMode("login")}
              >
                Login
              </span>
            </>
          )}
        </p>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600"
        >
          ✖
        </button>
      </div>
    </div>
  );
}
