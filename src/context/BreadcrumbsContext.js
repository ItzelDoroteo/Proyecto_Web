import React, { createContext, useContext, useCallback, useState } from "react";

const BreadcrumbsContext = createContext();

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbsContext);
  if (!context) {
    throw new Error("useBreadcrumbs debe ser usado dentro de un proveedor de BreadcrumbsContext");
  }
  return context;
};

export const BreadcrumbsProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const updateBreadcrumbs = useCallback(() => {
    // Lógica para actualizar las migas de pan según la ubicación actual
    // Puedes ajustar esto según tus necesidades
    const currentPath = window.location.pathname;
    const breadcrumb = {
      path: currentPath,
      label: "Personalizado", // Puedes personalizar el nombre según la ruta
    };

    setBreadcrumbs((prevBreadcrumbs) => [...prevBreadcrumbs, breadcrumb]);
  }, []);

  const value = {
    breadcrumbs,
    updateBreadcrumbs,
  };

  return (
    <BreadcrumbsContext.Provider value={value}>
      {children}
    </BreadcrumbsContext.Provider>
  );
};
