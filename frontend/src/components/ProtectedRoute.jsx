import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token"); // adjust if using cookies/context
  const user = JSON.parse(localStorage.getItem("user")); // parse user object from storage

  // Not logged in? Kick to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but role not allowed? Kick to home (or error page)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/admin/profile" replace />;
  }

  // Otherwise, show the protected page
  return children;
};

export default ProtectedRoute;
