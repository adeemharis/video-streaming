import { useState } from "react";
import { api } from "../api/axios";

const TAGS = ["Music", "Gaming", "Sports", "Movies", "Education", "Comedy", "Tech", "News"];

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
//   const [tags, setTags] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState("");

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video) return alert("Please select a video file");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", selectedTags.join(","));
    formData.append("video", video);

    try {
      const res = await api.post("/videos/upload", formData);
      setMessage(res.data.message);
      setTitle("");
      setDescription("");
      setSelectedTags([]);
      setVideo(null);
    } catch (err) {
      setMessage(err.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div className="container" style={{ marginTop: 40, maxWidth: 600 }}>
      <h2>Upload Video</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="input"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
          rows={4}
        />
        {/* <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="input"
        /> */}
        <div style={{ marginTop: 12 }}>
          <h4>Choose Tags:</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TAGS.map((tag) => (
              <div
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                  background: selectedTags.includes(tag) ? "blue" : "lightgray",
                  color: selectedTags.includes(tag) ? "white" : "black",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          required
          className="input"
        />
        <button type="submit" className="btn">Upload</button>
      </form>
    </div>
  );
}
