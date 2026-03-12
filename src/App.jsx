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
import HomePage from "../src/pages/home/Home";
import MyAppBar from "./components/layout/my_appBar/MyAppBar";
import MyNavbar from "./components/layout/my_navbar/MyNavbar";
import About from "./pages/about/About";
import Articles from "./pages/articles/Articles";
import Account from "./pages/account/Account";
import Contact from "./pages/contact/Contact";
import NotFound from "./pages/not_found/NotFound";
import Jobs from "./pages/jobs/Jobs";
import Faqs from "./pages/faqs/Faqs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JobsList1 from "./pages/jobs_list/JobsList1";

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
        <ToastContainer position="top-center" autoClose={3000} />
        <MyNavbar />

        <MyAppBar logo={logoIcon} />

        <Routes>
          <Route path="/login" element={token ? <HomePage /> : <Login />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/list" element={<JobsList1 />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/articles" element={token ? <Articles /> : <Login />} />
          <Route path="/account" element={token ? <Account /> : <Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
