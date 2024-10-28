import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { token } = useAuth();

  if (!token) {
    // Mostrar un Toast con el mensaje de alerta
    toast.error("Para acceder al siguiente contenido, debe iniciar sesión primero.");
    return <Navigate to="/" replace />;
  }

  return <Element {...rest} />;
};

export default PrivateRoute;