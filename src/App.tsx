import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./Login"
import Home from "./Home";
import Welcome from "./Welcome";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
