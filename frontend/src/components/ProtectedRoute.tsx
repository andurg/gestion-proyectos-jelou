import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    //Redirecciona al login si no está autenticado
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado se muestra el contenido de la pagina
  return <Outlet />;
};

export default ProtectedRoute;