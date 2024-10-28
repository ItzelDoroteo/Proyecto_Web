import React, { useEffect } from "react";
import {
  useNavigate,
} from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import PublicLayout from "./PublicLayout";
import { useAuth } from "../context/AuthContext";

const GuardedLayout = ({ children }) => {
    const { token } = useAuth();
    const showAlert = useAlert();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!token) {
        
        navigate("/");
        setTimeout(() => {
          showAlert("info","Para la siguiente accion debe iniciar sesión.");//Verificar el porque no se muestra la alerta
        }, 500);
      }
    }, [token]);
    return (
      <>
        <PublicLayout>{children}</PublicLayout>
      </>
    );
  };

export default GuardedLayout;