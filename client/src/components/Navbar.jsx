import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleProfile = () => {
    if (user) {
      navigate("/profile");
    } else {
      alert("Please sign up or log in to continue.");
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <img src="/logo.png" alt="VideoMate logo" width="28" height="28" />
        <span>VideoMate</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {user ? (
          <>
            <span style={{ color: "#64748b" }}>Hi, {user.username}</span>
            <button onClick={() => navigate("/upload")} className="btn">Upload</button>
            <button onClick={() => navigate("/profile")} className="btn">Profile</button>
            <button className="btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <button className="btn" onClick={handleProfile}>Login / Signup</button>
        )}
      </div>
    </nav>
  );
}
