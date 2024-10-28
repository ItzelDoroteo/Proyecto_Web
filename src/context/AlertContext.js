// AlertContext.js
import React, { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children, mockShowAlert }) => {
  const toast = useRef(null);

  const showAlert = (severity, message, life = 3000) => {
    if (mockShowAlert) {
      // Si mockShowAlert está definido, lo usamos para las pruebas
      mockShowAlert(severity, message, life);
    } else if (toast.current) {
      toast.current.show({
        severity,
        summary: severity.charAt(0).toUpperCase() + severity.slice(1),
        detail: message,
        life,
      });
    }
  };

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      <Toast ref={toast} />
    </AlertContext.Provider>
  );
};
