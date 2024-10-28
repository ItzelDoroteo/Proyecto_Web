import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdClose, MdLogout, MdLogin, MdHistory, MdSell, MdAddShoppingCart, MdCategory, MdExpandMore, MdExpandLess } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import {jwtDecode} from "jwt-decode"; // Asegúrate de que jwtDecode esté importado correctamente
import ModalComponent from "./Modal";
import "../../styles/styles.css";
import "../../styles/stylesResponsive.css";

function SidebarMenu({ activarModal, mostrarModal, cerrarModal, cerrarSesion, menuVisible, toggleMenu }) {
  const [usuario, setUsuario] = useState(null);
  const [selectedSexo, setSelectedSexo] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUsuario(decoded);
      setSelectedSexo(decoded.sexo);
    } else {
      setUsuario(null);
    }
  }, [token]);

  const handleLogin = () => {
    toggleMenu();
    activarModal();
  };

  const toggleCategoryMenu = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  useEffect(() => {
    fetch('http://localhost:5000/products/categories/getAll')
      .then(response => response.json())
      .then(data => {
        setCategories(data);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  return (
    <>
      <nav className={`Menu ${menuVisible ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleMenu}>
          <MdClose size={30} />
        </button>
        <ul>
          {usuario ? (
            <li className="sidebar-item fw-bold">
              <Link onClick={toggleMenu} to="/user-profile">
                {usuario.imagen ? (
                  <img src={usuario.imagen} className="logo-user rounded-image" alt={usuario.nombre} />
                ) : selectedSexo === "masculino" ? (
                  <img src="/images/user-masculino.png" className="logo-user rounded-image" alt={usuario.nombre} />
                ) : (
                  <img src="/images/OIP (1).jpg" className="logo-user rounded-image" alt={usuario.nombre} />
                )}
                {usuario.nombre}
              </Link>
            </li>
          ) : (
            <li className="sidebar-item fw-bold">
              <Link>
                <img className="logo-user rounded-image" src="/images/user.png" alt="Banner de Usuario" />
                Usuario
              </Link>
            </li>
          )}
        </ul>
        <hr className="border-slider" />
        <ul>
          <li className="sidebar-item">
            <a onClick={toggleCategoryMenu}>
              <MdCategory className="icons-sidebar" /> Categoría {isCategoryOpen ? <MdExpandLess /> : <MdExpandMore />}
            </a>
            {isCategoryOpen && categories.length > 0 && (
              <ul className="lista-categorias">
                {categories.map((category) => (
                  <li key={category.categoriaId}>
                    <Link onClick={toggleMenu} to={`/category/${category.categoriaId}`}>
                      {category.categoria}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li className="sidebar-item">
            <Link onClick={toggleMenu} to="/ofertas">
              <MdSell className="icons-sidebar" /> Ofertas
            </Link>
          </li>
          <li className="sidebar-item">
            <Link onClick={toggleMenu} to="/mas-vendidos">
              <MdAddShoppingCart className="icons-sidebar" /> Más vendidos
            </Link>
          </li>
          {!usuario ? (
            <>
              <li className="sidebar-item login">
                <a onClick={handleLogin}>
                  <MdLogin className="icons-sidebar" /> Iniciar sesión
                </a>
                {mostrarModal && <ModalComponent show={mostrarModal} onClose={cerrarModal} />}
              </li>
            </>
          ) : (
            <>
              <li className="sidebar-item">
                <Link onClick={toggleMenu} to="/purchase-history">
                  <MdHistory className="icons-sidebar" /> Historial de compra
                </Link>
              </li>
              <li className="sidebar-item logout">
                <Link onClick={cerrarSesion}>
                  <MdLogout className="icons-sidebar" /> Cerrar sesión
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}

export default SidebarMenu;
