import React from "react";
import AdminHeader from "../components/Admin/AdminHeader";
import AdminFooter from "../components/Admin/AdminFooter";
import Sidebar from "../components/Admin/Sidebar";

const AdminLayout = ({ children }) => {
  const mainContentStyle = {
    padding: '20px', // Espacio interno para el contenido
    overflowY: 'auto', // Permitir scroll vertical si es necesario
    height: 'calc(100vh - 50px)', // Ajustar la altura para el espacio entre header y footer
  };

  return (
    <>
      <AdminHeader />
      <Sidebar style={{ position: 'fixed', top: 0, bottom: 0 }} />
      <div style={mainContentStyle}>
        {children}
      </div>
      <AdminFooter />
    </>
  );
};

export default AdminLayout;
