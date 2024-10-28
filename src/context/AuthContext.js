// AuthContext.js

import React, { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  const setAuthToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);

    //Decodifica el token para obtener la informacion del usuario
    const decoded = jwtDecode(newToken);
    setUser(decoded)
  };

  const logout = () => {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
  };

  return (
    <AuthContext.Provider value={{ token, user, setAuthToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
