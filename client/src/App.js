import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About";
import Error from "./pages/Error";
import Material from "./pages/Material";
import Feedback from "./pages/Feedback";
import Login from "./pages/Login";
import { useContext, useEffect, useState } from "react";
import NavbarLogin from "./components/NavbarLogin";
import Register from "./pages/Register";
import NavbarHead from "./components/NavbarHead";
import Assignment from "./pages/Assignment";
import { AuthContext } from "./context/AuthContext";



function App() {

  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext)

    if (!user) {
      return <Navigate to="/login" />
    }

    return children;

  };

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
      {!isLoginPage ? <NavbarHead /> : <NavbarLogin />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/material" element={<ProtectedRoute> <Material /> </ProtectedRoute>} />
        <Route path="/assignment" element={<Assignment />} />
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
