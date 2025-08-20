import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaUpload , FaSignOutAlt} from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar({ onOpenAuthModal }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleProfile = () => {
    if (user) {
      navigate("/profile");
    } else {
      onOpenAuthModal(); 
    }
  };

  const handleUpload = () => {
    if (user) {
      navigate("/upload");
    } else {
        alert("Please log in first.");  
    }
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <img src="/logo.png" alt="VideoMate logo" width="28" height="28" />
        <span>VideoMate</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {user && <span style={{ color: "#64748b" }}>Hi, {user.username}</span>}

        {/* Upload button (icon) */}
        <button
          onClick={handleUpload}
          title="Upload"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <FaUpload size={22} color="#64748b" />
        </button>

        {/* Profile button (icon) */}
        {user ? (
          user.profileImage ? (
            <img
              src={user.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={() => navigate("/profile")}
            />
            ) : (
                <button
                    onClick={handleProfile}
                    title="Profile"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                  <FaUserCircle size={26} color="#64748b" />
                </button>
            )
          ) : (
          <button
            onClick={handleProfile}
            title="Profile"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
          <FaUserCircle size={26} color="#64748b" />
        </button>
        )}
        {/* Logout (only if logged in) */}
        {user && (
          <button
            onClick={logout}
            title="Logout"
            style={{ background: "none", border: "none", cursor: "pointer" }}
            // style={{ marginLeft: "8px" }}
          >
            <FaSignOutAlt size={26} color="#64748b" />
          </button>
        )}
      </div>
    </nav>
  );
}

// import { useNavigate } from "react-router-dom";
// import { FaUserCircle, FaUpload } from "react-icons/fa";
// import { useState } from "react";
// import { useAuth } from "../context/AuthContext.jsx";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const handleProfile = () => {
//     if (user) {
//       navigate("/profile");
//     } else {
//       alert("Please sign up or log in to continue.");
//       navigate("/login");
//     }
//   };

//   return (
//     <nav className="navbar">
//       <div className="logo" onClick={() => navigate("/")}>
//         <img src="/logo.png" alt="VideoMate logo" width="28" height="28" />
//         <span>VideoMate</span>
//       </div>
//       <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//         {user ? (
//           <>
//             <span style={{ color: "#64748b" }}>Hi, {user.username}</span>
//             <button onClick={() => navigate("/upload")} className="btn">Upload</button>
//             <button onClick={() => navigate("/profile")} className="btn">Profile</button>
//             <button className="btn" onClick={logout}>Logout</button>
//           </>
//         ) : (
//           <button className="btn" onClick={handleProfile}>Login / Signup</button>
//         )}
//       </div>
//     </nav>
//   );
// }
