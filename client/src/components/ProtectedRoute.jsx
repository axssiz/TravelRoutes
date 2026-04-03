// client/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { LoadingSpinner } from "./LoadingSkeletons";

export const ProtectedRoute = ({
  children,
  adminOnly = false,
  employeeOnly = false,
  roles = [],
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role?.toLowerCase() !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (employeeOnly && user?.role?.toLowerCase() !== "employee") {
    return <Navigate to="/" replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
