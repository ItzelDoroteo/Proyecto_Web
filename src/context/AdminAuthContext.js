import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Asegúrate de que jwt-decode esté importado correctamente

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [admin, setAdmin] = useState(null);

  // Efecto para inicializar el estado admin si hay un token en el localStorage
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAdmin(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        setAdmin(null); // Si hay un error decodificando el token, reinicia el estado
      }
    }
  }, [token]);

  const setAdminAuthToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("adminToken", newToken);

    try {
      // Decodifica el token para obtener la información del administrador
      const decoded = jwtDecode(newToken);
      setAdmin(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      setAdmin(null); // Si hay un error decodificando el token, reinicia el estado
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ token, admin, setAdminAuthToken, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
