import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h1>Home Page</h1>

      <button onClick={() => navigate("/login")}>
        Go to Login
      </button>
    </div>
  );
}