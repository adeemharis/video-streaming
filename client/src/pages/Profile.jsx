import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";

export default function Profile() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  const fetchMyVideos = async () => {
    try {
      const res = await api.get("/playvideos/my", { withCredentials: true });
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching my videos:", err);
    }
  };

  const deleteVideo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await api.delete(`/playvideos/${id}`, { withCredentials: true });
      setVideos(videos.filter(v => v._id !== id));
    } catch (err) {
      console.error("Error deleting video:", err);
      alert("Failed to delete video");
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
      <div className="card" style={{ maxWidth: 640, margin: "0 auto", marginBottom: 32 }}>
        <h2>Your Profile</h2>
        <div style={{ marginTop: 8 }}>
          <p><b>Username:</b> {user.username}</p>
          <p><b>Email:</b> {user.email}</p>
        </div>
      </div>

      {/* Uploaded Videos */}
      <h3>My Uploaded Videos</h3>
      {videos.length === 0 && <p>You haven’t uploaded any videos yet.</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {videos.map(v => (
          <div key={v._id} className="card">
            <video width="100%" height="180" src={`http://localhost:5000${v.filePath}`} controls />
            <h4>{v.title}</h4>
            <p style={{ color: "gray" }}>{v.description}</p>
            <p style={{ fontSize: "0.9em", color: "darkgray" }}>
              Tags: {v.tags.join(", ")} <br />
              Likes: {v.likes.length} | Dislikes: {v.dislikes.length} | Comments: {v.comments.length} <br />
              Uploaded: {new Date(v.createdAt).toLocaleDateString()}
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <button onClick={() => navigate(`/video/${v._id}`)} className="btn">View</button>
              <button onClick={() => deleteVideo(v._id)} className="btn" style={{ background: "red" }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
