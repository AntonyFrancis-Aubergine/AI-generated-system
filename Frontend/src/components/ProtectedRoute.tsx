import React from "react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<"USER" | "INSTRUCTOR" | "ADMIN">;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading indicator while auth state is being determined
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "50%",
            borderWidth: "4px",
            borderStyle: "solid",
            borderColor: "#3b82f6 transparent #3b82f6 #3b82f6",
          }}
        />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user doesn't have one of the allowed roles, redirect to home
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    switch (user.role) {
      case "ADMIN":
        return <Navigate to="/admin/dashboard" replace />;
      case "INSTRUCTOR":
        return <Navigate to="/instructor/dashboard" replace />;
      case "USER":
        return <Navigate to="/user/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // If authenticated and authorized, render the children
  return <>{children}</>;
}
