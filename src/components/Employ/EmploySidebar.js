import React from "react";
import { NavLink, Link } from "react-router-dom";
import { 
  MdAttachMoney,
  MdInventory,
  MdPercent,
  MdLocalShipping,
  MdNotifications,
  MdBlock,
  MdSell,
  MdPointOfSale
} from "react-icons/md";

const EmploySidebar = () => {

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-2">
      <Link to="/employ/home" className="brand-link">
        <img
          src="/images/Imagen1-3n4j4J1C4-transformed (1).jpg"
          alt="Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: 0.8 }}
        />
        <span className="brand-text font-weight-light">
          Chucherias & Regalos
        </span>
      </Link>

      <section className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item d-flex">
              <NavLink
                to="/employ/inventory"
                className="nav-link"
                activeClassName="active"
              >
                <MdInventory /> Inventario
              </NavLink>
            </li>

            <li className="nav-item d-flex">
              <NavLink
                to="/employ/promociones"
                className="nav-link"
                activeClassName="active"
              >
                <MdSell /> Promociones
              </NavLink>
            </li>

            <li className="nav-item d-flex">
                  <NavLink
                    to="/employ/gestionSale"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <MdPointOfSale /> Gestion Ventas
                  </NavLink>
                </li>


            <li className="nav-item d-flex">
              <NavLink
                to="/employ/suspended-users"
                className="nav-link"
                activeClassName="active"
              >
                <MdBlock /> Suspencion Usuarios
              </NavLink>
            </li>

            <li className="nav-item d-flex">
              <NavLink
                to="/employ/notificationsAdmin"
                className="nav-link"
                activeClassName="active"
              >
                <MdNotifications /> Notificaciones
              </NavLink>
            </li>

            <li className="nav-item d-flex">
              <NavLink
                to="/employ/precio-envios"
                className="nav-link"
                activeClassName="active"
              >
                <MdLocalShipping /> Costos de envio
              </NavLink>
            </li>

            <li className="nav-item d-flex">
              <NavLink
                to="/employ/edit-stock"
                className="nav-link"
                activeClassName="active"
              >
                <MdPercent /> Existencia
              </NavLink>
            </li>

            <li className="nav-item d-flex">
              <NavLink
                to="/employ/edit-price"
                className="nav-link"
                activeClassName="active"
              >
                <MdAttachMoney /> Precios
              </NavLink>
            </li>
          </ul>
        </nav>
      </section>
    </aside>
  );
};

export default EmploySidebar;
