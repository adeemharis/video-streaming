import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/axios";

export default function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comment, setComment] = useState("");

//   useEffect(() => {
//     api.get(`/playvideos/${id}`).then((res) => setVideo(res.data));
//   }, [id]);

useEffect(() => {
    api.get(`/playvideos/${id}`)
      .then(res => setVideo(res.data))
      .catch(err => console.error("Error fetching video:", err));
  }, [id]);

  if (!video) return <div>Loading...</div>;

  const handleLike = async () => {
    const res = await api.post(`/playvideos/${id}/like`);
    setVideo((v) => ({ ...v, likes: Array(res.data.likes).fill(""), dislikes: Array(res.data.dislikes).fill("") }));
  };

  const handleDislike = async () => {
    const res = await api.post(`/playvideos/${id}/dislike`);
    setVideo((v) => ({ ...v, likes: Array(res.data.likes).fill(""), dislikes: Array(res.data.dislikes).fill("") }));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const res = await api.post(`/playvideos/${id}/comment`, { text: comment });
    setVideo((v) => ({ ...v, comments: res.data }));
    setComment("");
  };

  if (!video) return <p>Loading...</p>;

  return (
    <div className="container" style={{ marginTop: 80 }}>
      <video controls style={{ width: "100%", maxHeight: "70vh", background: "#000" }}>
        <source src={`http://localhost:5000${video.filePath}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <h2>{video.title}</h2>
      <p>{video.description}</p>
      <div style={{ marginBottom: 10 }}>
        {video.tags?.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={handleLike}>👍 Like ({video.likes?.length || 0})</button>
        <button onClick={handleDislike}>👎 Dislike ({video.dislikes?.length || 0})</button>
      </div>

      <h3>Comments</h3>
      <form onSubmit={handleComment} style={{ display: "flex", gap: 8 }}>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          style={{ flex: 1 }}
        />
        <button type="submit">Post</button>
      </form>

      <ul>
        {video.comments?.map((c, i) => (
          <li key={i}>{c.text}</li>
        ))}
      </ul>
    </div>
  );
}
