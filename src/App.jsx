import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./theme/colors";
import "./styles/_variables.css";
import Login from "./pages/login/Login";
import logoIcon from "./assets/icons/graduationCap.svg";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet";
import HomePage from "../src/pages/home/Home"

function App() {
  useEffect(() => {
    AOS.init({
      once: false,
    });
    AOS.refresh();
  }, []);

  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("tokenUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("tokenUpdated", handleStorageChange);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Articula</title>
        <meta name="description" content="All articles you search for" />
        <meta name="keywords" content="Articula, Articles, Authors" />
        <link rel="icon" href={logoIcon} />
      </Helmet>

      <BrowserRouter>
        <Routes>
          
          <Route path="/login" element={ <Login />} />
          <Route path="/" element={<HomePage />} />
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
