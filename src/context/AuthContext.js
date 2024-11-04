import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  const setAuthToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    
    if (newToken) {
      const decoded = jwtDecode(newToken);
      setUser(decoded);
    } else {
      setUser(null); // Limpiar el usuario si no hay token
    }
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    setUser(null); // Limpiar el usuario en el logout
  };

  useEffect(() => {
    // Decodificar el token al cargar el componente
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, setAuthToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
