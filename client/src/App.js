/**
 * AcademiaStacks Frontend Application
 *
 * This is the main React application component that handles routing and layout.
 * It provides a complete educational platform for sharing and accessing academic materials.
 *
 * Key Features:
 * - Protected routes for authenticated users
 * - Dynamic navigation based on authentication state
 * - Material management (upload, view, organize)
 * - User authentication and profile management
 * - Admin dashboard for content moderation
 * - Responsive design with modern UI components
 *
 * @author AcademiaStacks Team
 * @version 1.0.0
 */

// React core imports
import React from 'react';
import {Routes, Route, useLocation, Navigate} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';

// Context imports
import {AuthContext} from './context/AuthContext';

// Component imports
import Footer from './components/Footer.jsx';
import NavbarLogin from './components/NavbarLogin';
import NavbarHead from './components/NavbarHead';

// Page imports - organized by functionality
import Home from './pages/Home.jsx'; // Landing page
import Login from './pages/Login'; // User authentication
import Register from './pages/Register'; // User registration
import OtpVerification from './pages/OtpVerification'; // Email verification
import User from './pages/User'; // User profile and dashboard
import Material from './pages/Material'; // Material browsing
import AllMaterials from './pages/AllMaterials'; // All materials view
import Assignment from './pages/Assignment'; // Assignment materials
import Notes from './pages/Notes'; // Notes materials
import PYQ from './pages/PYQ'; // Previous year questions
import Handouts from './pages/Handouts'; // Handout materials
import Upload from './pages/Upload'; // Material upload
import AdminDashboard from './pages/AdminDashboard'; // Admin panel
import Feedback from './pages/Feedback'; // User feedback
import Error from './pages/Error'; // Error page

// Styles
import './App.css';

/**
 * Main App Component
 *
 * This component serves as the root of the application and handles:
 * - Route protection for authenticated users
 * - Dynamic navigation based on current page
 * - Layout management (navbar switching)
 */
function App () {
  // Protected Route Component
  // This component wraps routes that require authentication
  // If user is not authenticated, redirects to login page
  const ProtectedRoute = ({children}) => {
    const {isAuthenticated} = useContext(AuthContext);

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  // State to determine if current page is login/register
  // This affects which navbar is displayed
  const [isLoginPage, setIsLoginPage] = useState(false);
  const locationName = useLocation();

  // Update navbar based on current route
  // Login and register pages use a different navbar layout
  useEffect(() => {
    const pathSegment = locationName.pathname.split('/')[1];
    setIsLoginPage(pathSegment === 'login' || pathSegment === 'register');
  }, [locationName]);

  return (
    <div className="App overflow-hidden">
      {/* Dynamic Navbar - switches between login and main navbar */}
      {!isLoginPage ? <NavbarHead /> : <NavbarLogin />}

      {/* Main Application Routes */}
      <Routes>
        {/* Public Routes - accessible without authentication */}
        <Route path="/" element={<Home />} /> {/* Landing page */}
        <Route path="/login" element={<Login />} /> {/* User login */}
        <Route path="/register" element={<Register />} /> {/* User registration */}
        <Route path="/verification" element={<OtpVerification />} /> {/* Email verification */}
        <Route path="/feedback" element={<Feedback />} /> {/* User feedback */}
        <Route path="/material" element={<Material />} /> {/* Material browsing (public) */}

        {/* Protected Routes - require authentication */}
        <Route path="/upload" element={<Upload />} /> {/* Material upload */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Material Category Routes - all require authentication */}
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

        {/* User Profile Route - requires authentication */}
        <Route
          path="/user/"
          element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route for 404 errors */}
        <Route path="*" element={<Error />} />
      </Routes>

      {/* Footer component - appears on all pages */}
      <Footer />
    </div>
  );
}

export default App;
