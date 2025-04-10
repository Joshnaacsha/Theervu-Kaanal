import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    // Debug log to help troubleshoot
    console.log('Protected Route Check:', { user, allowedRoles });

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(user.role?.toLowerCase())) {
        console.log('Access denied:', { userRole: user.role, allowedRoles });
        // User's role is not authorized
        return <Navigate to="/" replace />;
    }

    // Access granted
    return <Outlet />;
};

export default ProtectedRoute;
