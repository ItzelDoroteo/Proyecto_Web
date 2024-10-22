import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Profile from "./Profile";
import ProfileAddress from "./ProfileAddress";
import ProfileSecurity from "./ProfileSecurity";
import { MdAccountCircle, MdAdminPanelSettings, MdHome } from "react-icons/md";

const UserProfile = () => {
  const [selectedItem, setSelectedItem] = useState("Información Personal");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSidebarOpen(false); // Cierra el menú al seleccionar un elemento
  };

  const getItemStyle = (item) => {
    return selectedItem === item
      ? { color: "#332e40", backgroundColor: "rgb(219 211 248)" }
      : { color: "black", backgroundColor: "transparent" };
  };

  const renderComponent = () => {
    switch (selectedItem) {
      case "Información Personal":
        return <Profile />;
      case "Direcciones de envio":
        return <ProfileAddress />;
      case "Seguridad":
        return <ProfileSecurity />;
      default:
        return null;
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div className="row">
        <div className="col-12 d-md-none">
          <div className="toggle-user" onClick={toggleSidebar}>
            <span className="menu-profile-user">
              <FaBars className="mr-4" /> Perfil de usuario
            </span>
          </div>
          {sidebarOpen && (
            <div className="dropdown-menu-user">
              <ul className="list-unstyled mt-4">
                <li
                  className="dropdown-item"
                  onClick={() => handleItemClick("Información Personal")}
                  style={getItemStyle("Información Personal")}
                >
                    <MdAccountCircle size={35} className="mr-3" />
                     Información Personal
                </li>
                <li
                  className="dropdown-item"
                  onClick={() => handleItemClick("Direcciones de envio")}
                  style={getItemStyle("Direcciones de envio")}
                >
                    <MdHome size={35} className="mr-3" />
                    Direcciones de envio
                </li>
                <li
                  className="dropdown-item"
                  onClick={() => handleItemClick("Seguridad")}
                  style={getItemStyle("Seguridad")}
                >
                    <MdAdminPanelSettings size={35} className="mr-3" />
                    Seguridad
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="col-md-3 d-none d-md-block user-sidebar">
          <div className="sidebar item-no-responsive">
            <h3 className="mt-4 mb-3 ml-4 fw-bold">PERFIL DE USUARIO</h3>
            <ul className="list-unstyled mt-4">
              <li>
                <div
                  className="row item-sidebar"
                  onClick={() => handleItemClick("Información Personal")}
                  style={getItemStyle("Información Personal")}
                >
                  <div className="col-md-9">
                    <a className="text-dark ml-4">Información Personal</a>
                  </div>
                  <div className="col-md-3 text-center">
                    <MdAccountCircle size={50} />
                  </div>
                </div>
              </li>
              <li>
                <div
                  className="row item-sidebar"
                  onClick={() => handleItemClick("Direcciones de envio")}
                  style={getItemStyle("Direcciones de envio")}
                >
                  <div className="col-md-9">
                    <a className="text-dark ml-4">Direcciones de envio</a>
                  </div>
                  <div className="col-md-3 text-center">
                    <MdHome size={50} />
                  </div>
                </div>
              </li>
              <li>
                <div
                  className="row item-sidebar"
                  onClick={() => handleItemClick("Seguridad")}
                  style={getItemStyle("Seguridad")}
                >
                  <div className="col-md-9">
                    <a className="text-dark ml-4">Seguridad</a>
                  </div>
                  <div className="col-md-3 text-center">
                    <MdAdminPanelSettings size={50} />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-9">{renderComponent()}</div>
      </div>
    </>
  );
};

export default UserProfile;
