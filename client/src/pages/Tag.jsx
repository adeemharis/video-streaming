import { useParams } from "react-router-dom";

export default function Tag() {
  const { name } = useParams();
  return (
    <div className="container" style={{ marginTop: 40 }}>
      <h2>Browsing tag: {name}</h2>
      <p style={{ color: "var(--muted)" }}>(Hook this to your videos API)</p>
    </div>
  );
}
