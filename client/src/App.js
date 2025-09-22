import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Upload from "./pages/Upload";
import AdminDashboard from "./pages/AdminDashboard";
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
import Notes from "./pages/Notes";
import PYQ from "./pages/PYQ";
import User from "./pages/User";
import Handouts from "./pages/Handouts";
import OtpVerification from "./pages/OtpVerification";
import AllMaterials from "./pages/AllMaterials";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
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
        <Route path="/upload" element={<Upload />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/material" element={<Material />} />
        <Route
          path="/material/assignment"
          element={
            <ProtectedRoute>
              <Assignment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/material/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/material/pyq"
          element={
            <ProtectedRoute>
              <PYQ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/material/allMaterials"
          element={
            <ProtectedRoute>
              <AllMaterials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/material/handouts"
          element={
            <ProtectedRoute>
              <Handouts />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/user/"}
          element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/verification"}
          element={
              <OtpVerification />
          }
        />

        <Route path="/feedback" element={<Feedback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
      
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
