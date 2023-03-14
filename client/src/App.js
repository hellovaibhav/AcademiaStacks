import "./App.css";
import Navbar from "./components/Navbar.jsx";
import { Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About";
import Error from "./pages/Error";
import Material from "./pages/Material";
import Feedback from "./pages/Feedback";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import NavbarLogin from "./components/NavbarLogin";
import Register from "./pages/Register";
function App() {
  const [isLoginPage, setIsLoginPage] = useState(false);
  const locationName = useLocation();
  console.log(locationName.pathname.split("/")[1]);

  useEffect(() => {
    locationName.pathname.split("/")[1] === "login" ||
    locationName.pathname.split("/")[1] === "register"
      ? setIsLoginPage(true)
      : setIsLoginPage(false);
  }, [locationName]);

  return (
    <div className="App overflow-hidden">
      {!isLoginPage ? <Navbar /> : <NavbarLogin />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/material" element={<Material />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
    </div>
  );
}

export default App;
