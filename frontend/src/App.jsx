// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LostButFound from "./components/lostButFound/LostButFound.jsx";
import LandingPage from "./components/home/LandingPage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import Messages from "./components/messages/Messages";
import Profile from "./components/profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PrivateRoute from "./components/auth/PrivateRoute";
import PublicProfile from "./components/profile/PublicProfile";
import DiscoverPeople from "./components/profile/DiscoverPeople.jsx";
import AdminProfiles from "./components/admin/AdminProfiles.jsx";
import FriendsManager from "./components/friends/FriendsManager"
import { ToastProvider } from "./context/ToastProvider";
import SocketToastsBootstrap from "./SocketToastsBootstrap";
import TeacherStyleForm from "./components/TeacherStyleForm"; // 👈 import
import StudentLearning from "./components/StudentLearning"; // 👈 import




function App() {
  return (
    <ToastProvider>
      <SocketToastsBootstrap />

      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* LostButFound section inside PrivateRoute */}
          <Route
            path="/lostButFound/*"
            element={
              <PrivateRoute>
                <LostButFound />
              </PrivateRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <Messages />
              </PrivateRoute>
            }
          />
<Route
  path="/styles"
  element={
    <ProtectedRoute allowedRoles={["teacher","student", "admin"]}>
      <TeacherStyleForm />
    </ProtectedRoute>
  }
/>

<Route
  path="/match-style"
  element={
    <ProtectedRoute allowedRoles={["teacher","student", "admin"]}>
      <StudentLearning />
    </ProtectedRoute>
  }
/>




          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["student", "staff", "admin"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProfiles />
              </ProtectedRoute>
            }
          />

          <Route
            path="/discover"
            element={
              <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
                <DiscoverPeople />
              </ProtectedRoute>
            }
          />

          <Route path="/friends" element={<FriendsManager />} />

          {/* Public profile (view another user's profile) */}
          <Route path="/profile/:id" element={<PublicProfile />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;








