import React from "react";
import { NavLink, Link } from "react-router-dom";
import { 
  MdAttachMoney,
  MdInventory,
  MdQueryStats,
  MdPercent,
  MdLocalShipping,
  MdNotifications,
  MdPerson,
  MdBlock,
  MdWebhook,
  MdSell,
  MdPointOfSale
} from "react-icons/md";
import { useAdminAuth } from "../../context/AdminAuthContext";

const Sidebar = () => {
  const { admin } = useAdminAuth(); // Obtén la información del administrador desde el contexto

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-2">
      <Link to="/admin/home" className="brand-link">
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
                to="/admin/inventory"
                className="nav-link"
                activeClassName="active"
              >
                <MdInventory /> Inventario
              </NavLink>
            </li>

            {admin?.role === "Administrador" && (
              <>
                <li className="nav-item d-flex">
                  <NavLink
                    to="/admin/webhook"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <MdWebhook /> Nosotros
                  </NavLink>
                </li>

                <li className="nav-item d-flex">
                  <NavLink
                    to="/admin/employs"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <MdPerson /> Empleados
                  </NavLink>
                </li>

                <li className="nav-item d-flex">
                  <NavLink
                    to="/admin/gestionSale"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <MdPointOfSale /> Gestion Ventas
                  </NavLink>
                </li>

                <li className="nav-item d-flex">
                  <NavLink
                    to="/admin/sales-statictics"
                    className="nav-link"
                    activeClassName="active"
                  >
                    <MdQueryStats /> Estadisticas
                  </NavLink>
                </li>
              </>
            )}

            <li className="nav-item d-flex">
              <NavLink
                to="/admin/promociones"
                className="nav-link"
                activeClassName="active"
              >
                <MdSell /> Promociones
              </NavLink>
            </li>
            <li className="nav-item d-flex">
              <NavLink
                to="/admin/cupones"
                className="nav-link"
                activeClassName="active"
              >
                <MdSell /> Cupones
              </NavLink>
            </li>


            <li className="nav-item d-flex">
              <NavLink
                to="/admin/suspended-users"
                className="nav-link"
                activeClassName="active"
              >
                <MdBlock /> Suspencion Usuarios
              </NavLink>
            </li>

            <li className="nav-item d-flex">
              <NavLink
                to="/admin/notificationsAdmin"
                className="nav-link"
                activeClassName="active"
              >
                <MdNotifications /> Notificaciones
              </NavLink>
            </li>

            <li className="nav-item d-flex">
              <NavLink
                to="/admin/precio-envios"
                className="nav-link"
                activeClassName="active"
              >
                <MdLocalShipping /> Costos de envio
              </NavLink>
            </li>

            <li className="nav-item d-flex">
              <NavLink
                to="/admin/edit-stock"
                className="nav-link"
                activeClassName="active"
              >
                <MdPercent /> Existencia
              </NavLink>
            </li>

            <li className="nav-item d-flex">
              <NavLink
                to="/admin/edit-price"
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

export default Sidebar;
