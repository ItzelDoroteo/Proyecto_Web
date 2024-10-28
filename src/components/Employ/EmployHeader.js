import React from "react";
import { useEmployAuth } from "../../context/EmployAuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdLogout } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";
import "admin-lte/dist/css/adminlte.min.css";
import "../../styles/AdminStyles.css";
// Importa los archivos JS necesarios
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "admin-lte/dist/js/adminlte.min.js";

const EmployHeader = () => {
  const { employ, employLogout } = useEmployAuth();
  const cerrarSesion = async () => {
      employLogout()
      // Realizar otras acciones (por ejemplo, mostrar un mensaje de éxito)
      toast.success("Cierre de sesión exitoso. ¡Hasta pronto!");
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-dark navbar-primary">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#">
            <i className="fas fa-bars"></i>
          </a>
        </li>
      </ul>

      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown user-menu">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            data-toggle="dropdown"
          >
            <img
              src="/images/adminLogo.png"
              className="user-image img-circle elevation-2"
              alt="User Image"
            />
            <span className="d-none d-md-inline">
              {employ ? employ.nombre : "Nombre del Usuario"}
            </span>
          </a>
        </li>
        <li>
          <Link className="btn btn-danger btn-flat" onClick={cerrarSesion}>
            Salir  <MdLogout size={25}/>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default EmployHeader;
