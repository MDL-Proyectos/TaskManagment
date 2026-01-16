import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

interface ProtectedRouteProps {
  allowedRoles?: ("lider" | "admin" | "normalUser")[];  
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  // Verificar si el usuario está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  //console.log('ProtectedRoute user.admin:', user?.role?.is_admin);
  // Verificar si el rol del usuario está permitido
  if (user?.role?.is_admin && !allowedRoles?.includes("normalUser")) {
   console.log('User role:', user?.role);

    return <Navigate to="/" replace />;
  }

  // Si todas las verificaciones pasan, renderizar los componentes hijos
  return <Outlet />;
};

export default ProtectedRoute;