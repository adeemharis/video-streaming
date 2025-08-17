import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function SearchResults() {
  const { q } = useParams();
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/playvideos/search/${q}`)
      .then(res => setVideos(res.data))
      .catch(err => console.error("Error searching videos:", err));
  }, [q]);

  return (
    <div className="container" style={{ marginTop: 80 }}>
      <h2>Search results for "{q}"</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {videos.map(v => (
          <div key={v._id} className="card" onClick={() => navigate(`/video/${v._id}`)}>
            <video width="100%" height="140" src={`http://localhost:5000${v.filePath}`} />
            <h4>{v.title}</h4>
            <p style={{ color: "gray" }}>{v.tags.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
