import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Asegúrate de que jwt-decode esté importado correctamente

const EmployAuthContext = createContext();

export const EmployAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('employToken') || '');
  const [employ, setEmploy] = useState(null);

  // Efecto para inicializar el estado employ si hay un token en el localStorage
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setEmploy(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        setEmploy(null); // Si hay un error decodificando el token, reinicia el estado
      }
    }
  }, [token]);

  const setEmployAuthToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("employToken", newToken);

    try {
      // Decodifica el token para obtener la información del employistrador
      const decoded = jwtDecode(newToken);
      setEmploy(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      setEmploy(null); // Si hay un error decodificando el token, reinicia el estado
    }
  };

  const employLogout = () => {
    localStorage.removeItem('employToken');
    setToken('');
    setEmploy(null);
  };

  return (
    <EmployAuthContext.Provider value={{ token, employ, setEmployAuthToken, employLogout }}>
      {children}
    </EmployAuthContext.Provider>
  );
};

export const useEmployAuth = () => useContext(EmployAuthContext);
