import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";

export default function Profile() {
  const { user, setUser } = useAuth(); // 👈 ensure your AuthContext allows updating user
  const [videos, setVideos] = useState([]);
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [passwords, setPasswords] = useState({ current: "", newPass: "" });
  const navigate = useNavigate();

  // Fetch my videos
  const fetchMyVideos = async () => {
    try {
      const res = await api.get("/playvideos/my", { withCredentials: true });
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching my videos:", err);
    }
  };

  // Delete a video
  const deleteVideo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await api.delete(`/playvideos/${id}`, { withCredentials: true });
      setVideos(videos.filter((v) => v._id !== id));
    } catch (err) {
      console.error("Error deleting video:", err);
      alert("Failed to delete video");
    }
  };

  // Upload profile image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await api.post("/users/profile/image", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfileImage(res.data.profileImage);
      setUser((prev) => ({ ...prev, profileImage: res.data.profileImage })); // update context
      alert("Profile image updated!");
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Failed to upload image");
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/users/change-password",
        {
          currentPassword: passwords.current,
          newPassword: passwords.newPass,
        },
        { withCredentials: true }
      );
      alert("Password updated successfully!");
      setPasswords({ current: "", newPass: "" });
    } catch (err) {
      console.error("Password update failed", err);
      alert(err?.response?.data?.message || "Failed to update password");
    }
  };

  useEffect(() => {
    if (user) fetchMyVideos();
  }, [user]);

  if (!user) {
    return (
      <div className="container" style={{ marginTop: 40 }}>
        <div className="card" style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2>Your Profile</h2>
          <p>You must be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: 40 }}>
      {/* User Info */}
      <div
        className="card"
        style={{ maxWidth: 640, margin: "0 auto", marginBottom: 32 }}
      >
        <h2>Your Profile</h2>

        {/* Profile Image */}
        <div style={{ marginTop: 12, marginBottom: 12 }}>
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "#ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {user.username[0].toUpperCase()}
            </div>
          )}
        </div>

        <p>
          <b>Username:</b> {user.username}
        </p>
        <p>
          <b>Email:</b> {user.email}
        </p>

        {/* Upload new image */}
        <div style={{ marginTop: 12 }}>
          <label>
            <b>Change Profile Photo:</b>
            <input type="file" onChange={handleImageUpload} accept="image/*" />
          </label>
        </div>

        {/* Change password */}
        <form onSubmit={handleChangePassword} style={{ marginTop: 20 }}>
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="Current Password"
            value={passwords.current}
            onChange={(e) =>
              setPasswords((p) => ({ ...p, current: e.target.value }))
            }
            className="input"
            style={{ display: "block", marginBottom: 10, width: "100%" }}
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwords.newPass}
            onChange={(e) =>
              setPasswords((p) => ({ ...p, newPass: e.target.value }))
            }
            className="input"
            style={{ display: "block", marginBottom: 10, width: "100%" }}
          />
          <button type="submit" className="btn">
            Update Password
          </button>
        </form>
      </div>

      {/* Uploaded Videos */}
      <h3>My Uploaded Videos</h3>
      {videos.length === 0 && <p>You haven’t uploaded any videos yet.</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {videos.map((v) => (
          <div key={v._id} className="card">
            <video width="100%" height="180" src={v.filePath} controls />
            <h4>{v.title}</h4>
            <p style={{ color: "gray" }}>{v.description}</p>
            <p style={{ fontSize: "0.9em", color: "darkgray" }}>
              Tags: {v.tags.join(", ")} <br />
              Likes: {v.likes.length} | Dislikes: {v.dislikes.length} | Comments:{" "}
              {v.comments.length} <br />
              Uploaded: {new Date(v.createdAt).toLocaleDateString()}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <button
                onClick={() => navigate(`/video/${v._id}`)}
                className="btn"
              >
                View
              </button>
              <button
                onClick={() => deleteVideo(v._id)}
                className="btn"
                style={{ background: "red" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// import { useAuth } from "../context/AuthContext.jsx";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../api/axios";

// export default function Profile() {
//   const { user } = useAuth();
//   const [videos, setVideos] = useState([]);
//   const navigate = useNavigate();

//   const fetchMyVideos = async () => {
//     try {
//       const res = await api.get("/playvideos/my", { withCredentials: true });
//       setVideos(res.data);
//     } catch (err) {
//       console.error("Error fetching my videos:", err);
//     }
//   };

//   const deleteVideo = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this video?")) return;
//     try {
//       await api.delete(`/playvideos/${id}`, { withCredentials: true });
//       setVideos(videos.filter(v => v._id !== id));
//     } catch (err) {
//       console.error("Error deleting video:", err);
//       alert("Failed to delete video");
//     }
//   };

//   useEffect(() => {
//     if (user) fetchMyVideos();
//   }, [user]);

//   if (!user) {
//     return (
//       <div className="container" style={{ marginTop: 40 }}>
//         <div className="card" style={{ maxWidth: 640, margin: "0 auto" }}>
//           <h2>Your Profile</h2>
//           <p>You must be logged in to view your profile.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container" style={{ marginTop: 40 }}>
//       {/* User Info */}
//       <div className="card" style={{ maxWidth: 640, margin: "0 auto", marginBottom: 32 }}>
//         <h2>Your Profile</h2>
//         <div style={{ marginTop: 8 }}>
//           <p><b>Username:</b> {user.username}</p>
//           <p><b>Email:</b> {user.email}</p>
//         </div>
//       </div>

//       {/* Uploaded Videos */}
//       <h3>My Uploaded Videos</h3>
//       {videos.length === 0 && <p>You haven’t uploaded any videos yet.</p>}

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
//         {videos.map(v => (
//           <div key={v._id} className="card">
//             <video width="100%" height="180" src={v.filePath} controls />
//             <h4>{v.title}</h4>
//             <p style={{ color: "gray" }}>{v.description}</p>
//             <p style={{ fontSize: "0.9em", color: "darkgray" }}>
//               Tags: {v.tags.join(", ")} <br />
//               Likes: {v.likes.length} | Dislikes: {v.dislikes.length} | Comments: {v.comments.length} <br />
//               Uploaded: {new Date(v.createdAt).toLocaleDateString()}
//             </p>
//             <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
//               <button onClick={() => navigate(`/video/${v._id}`)} className="btn">View</button>
//               <button onClick={() => deleteVideo(v._id)} className="btn" style={{ background: "red" }}>
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
