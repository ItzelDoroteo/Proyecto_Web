import React from "react";
import EmployHeader from "../components/Employ/EmployHeader";
import EmployFooter from "../components/Employ/EmployFooter";
import EmploySidebarSidebar from "../components/Employ/EmploySidebar";

const EmployLayout = ({ children }) => {
  const mainContentStyle = {
    padding: '20px', // Espacio interno para el contenido
    overflowY: 'auto', // Permitir scroll vertical si es necesario
    height: 'calc(100vh - 50px)', // Ajustar la altura para el espacio entre header y footer
  };

  return (
    <>
      <EmployHeader />
      <EmploySidebarSidebar style={{ position: 'fixed', top: 0, bottom: 0 }} />
      <div style={mainContentStyle}>
        {children}
      </div>
      <EmployFooter />
    </>
  );
};

export default EmployLayout;
