import { BrowserRouter, Routes, Route } from "react-router";
import Login from "../src/Login"

function Home() {
  return <h1>Home Page</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
