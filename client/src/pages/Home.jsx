import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/axios";

const TAGS = ["Music", "Gaming", "Sports", "Movies", "Education", "Comedy", "Tech", "News"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const navigate = useNavigate();

  // Fetch all videos
  const fetchAllVideos = async () => {
    try {
      const res = await api.get("/playvideos");
      setVideos(res.data);
      setActiveTag(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch videos by tag
  const fetchVideosByTag = async (tag) => {
    try {
      const res = await api.get(`/playvideos/tag/${tag}`);
      setVideos(res.data);
      setActiveTag(tag);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllVideos();
  }, []);

  const doSearch = (e) => {
    e?.preventDefault();
    if (query.trim()) navigate(`/search/${encodeURIComponent(query.trim())}`);
  };

  return (
    <div
      style={{
        background: "var(--bg)",
        minHeight: "calc(100vh - 57px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 40,
      }}
    >
      <div className="container" style={{ textAlign: "center", width: "100%" }}>
        {/* Logo + Title */}
        <div style={{ marginBottom: 30 }}>
          <img
            src="/logo.png"
            alt="VideoMate Logo"
            style={{ width: 80, height: 80, objectFit: "contain", marginBottom: 12 }}
          />
          <h1 style={{ fontSize: "2rem", margin: 0, color: "var(--text)" }}>VideoMate</h1>
        </div>

        {/* Centered search */}
        <div className="center" style={{ marginBottom: 18 }}>
          <form
            onSubmit={doSearch}
            style={{ display: "flex", width: "100%", maxWidth: 560, margin: "0 auto" }}
          >
            <input
              className="input"
              placeholder="Search videos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="btn" type="submit" style={{ borderRadius: "0 8px 8px 0" }}>
              Search
            </button>
          </form>
        </div>

        {/* Tags under search */}
        <div className="center" style={{ flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
          {TAGS.map((t) => (
            <div
              key={t}
              className="tag"
              style={{
                cursor: "pointer",
                background: activeTag === t.toLowerCase() ? "var(--primary)" : "var(--card)",
                color: activeTag === t.toLowerCase() ? "#fff" : "var(--text)",
                padding: "6px 12px",
                borderRadius: 20,
              }}
              onClick={() =>
                activeTag === t.toLowerCase()
                  ? fetchAllVideos()
                  : fetchVideosByTag(t.toLowerCase())
              }
            >
              {t}
            </div>
          ))}
        </div>

        {/* Videos List */}
        <h2>{activeTag ? `Videos tagged with "${activeTag}"` : "Latest Videos"}</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 16,
            marginTop: 20,
          }}
        >
          {videos.map((video) => (
            <div
              key={video._id}
              className="card"
              onClick={() => navigate(`/video/${video._id}`)}
              style={{ cursor: "pointer" }}
            >
              <video
                style={{ width: "100%", height: 140, objectFit: "cover", background: "#000" }}
              >
                <source
                  src={`${video.filePath}#t=0.1`}
                  type="video/mp4"
                />
              </video>
              <h3>{video.title}</h3>
              <p style={{ color: "var(--muted)" }}>
                {video.description?.slice(0, 50)}...
              </p>
            </div>
          ))}
          {videos.length === 0 && <p>No videos found for this tag.</p>}
        </div>
      </div>
    </div>
  );
}
