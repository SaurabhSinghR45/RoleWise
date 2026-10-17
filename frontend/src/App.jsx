import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import LandingPage from "./pages/LandingPage";
import TemplatesPage from "./pages/TemplatesPage";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Landing Page & Templates Showcase */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/templates" element={<TemplatesPage />} />

      {/* Auth Routes: opens modal on Landing Page */}
      <Route path="/login" element={<LandingPage initialAuthModal="login" />} />
      <Route path="/register" element={<LandingPage initialAuthModal="register" />} />

      {/* Protected App Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect to Landing Page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
