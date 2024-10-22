import React, { useState, useEffect, useRef } from "react";
import { MdSearch, MdClose, MdMenu } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import ModalComponent from "./Modal";
import SidebarMenu from "./SidebarMenu";
import "../../styles/styles.css";
import "../../styles/stylesResponsive.css";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";
import ButtonCart from "./ButtonCart";
import ButtonCartResponsive from "./ButtonCartResponsive";
// import axios from "axios";
import Breadcrumbs from "./Breadcrumbs";
import axios from "axios";
import debounce from "lodash.debounce"; // Necesitas instalar uslodash.debounce
import { Avatar } from "primereact/avatar";
import { Chip } from "primereact/chip";
import { useAlert } from "../../context/AlertContext";

const getInitials = (name) => {
  if (!name) return "";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return initials;
};

function PublicHeader({ onSearch }) {
  const [customer, setCustomer] = useState(null);
  const showAlert = useAlert();
  const [initials, setInitials] = useState("");
  const [selectedSexo, setSelectedSexo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { token, logout } = useAuth();
  const [verificacionRealizada, setVerificacionRealizada] = useState(false);

  const navigate = useNavigate();
  const overlayRef = useRef(null);

  const [state, setState] = useState({
    menuVisible: false,
    mostrarModal: false,
    scrolled: false,
  });

  const toggleMenu = () => {
    setState((prevState) => ({
      ...prevState,
      menuVisible: !prevState.menuVisible,
    }));
  };

  const activarModal = () => {
    setState((prevState) => ({
      ...prevState,
      mostrarModal: true,
    }));
  };

  const cerrarModal = () => {
    setState((prevState) => ({
      ...prevState,
      mostrarModal: false,
    }));
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    debounceSearch(searchTerm);
  };

  const limpiarBusqueda = () => {
    setSearchTerm("");
    onSearch(null);
  };

  const handleClickOutside = (event) => {
    if (overlayRef.current && !overlayRef.current.contains(event.target)) {
      setState((prevState) => ({
        ...prevState,
        menuVisible: false,
      }));
    }
  };

  const debounceSearch = useRef(
    debounce((searchTerm) => {
      onSearch(searchTerm);
      navigate("/");
    }, 300)
  ).current;

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        if (token) {
          const decoded = jwtDecode(token);
          setSelectedSexo(decoded.sexo);
          let name = `${decoded.nombre} ${decoded.aPaterno}`;
          setInitials(getInitials(name));

          // Llamada a la API para obtener los datos del usuario
          const response = await axios.get(
            `http://localhost:5000/users/${decoded.customerId}`
          );

          // Actualiza el estado con los datos del usuario
          setCustomer(response.data);
        } else {
          setCustomer(null);
        }
      } catch (error) {
        console.error("Error al obtener el usuario", error);
      }
    };

    let lastScrollTop = 0;

    const handleScroll = () => {
      const currentScrollTop = window.scrollY;
      setState((prevState) => ({
        ...prevState,
        scrolled: currentScrollTop > lastScrollTop,
      }));
      lastScrollTop = currentScrollTop;
    };

    window.addEventListener("scroll", handleScroll);

    if (state.menuVisible) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }
    fetchCustomerData();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClickOutside);
    };
  }, [token, state.menuVisible]);

  useEffect(() => {
    if (customer && customer.sesion && !verificacionRealizada) {
      const fetchSessionData = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/users/getSession/${customer.sesion}`
          );
          const data = await response.json();
          setVerificacionRealizada(true);
          if (!data.sessionId) {
            // logout();
            // toast.error("La sesión ha expirado", {
            //   autoClose: 2000,
            //   closeOnClick: true,
            // });
          }
        } catch (error) {
          console.error("Error fetching session data:", error);
        }
      };

      fetchSessionData();
    }
  }, [customer]);

  const cerrarSesion = async () => {
    try {
      // await axios.post("http://localhost:5000/users/logout", {
      //   sessionId: usuario.sesion,
      // });

      logout();

      showAlert("success", "Cierre de sesión exitoso. ¡Hasta pronto!");
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      showAlert("error", "Error al cerrar sesión.");
    }
  };

  const avatarStyle = {
    backgroundColor:
      customer?.sexo === "masculino"
        ? "#2196F3"
        : customer?.sexo === "femenino"
        ? "#9c27b0"
        : "##e5e7eb",
    color: customer ? "white" : "#353535",
  };

  return (
    <>
      <header
        className={`header-public d-flex ${
          state.scrolled ? "hidden" : "sticky"
        } ${state.menuVisible ? "show-menu" : ""}`}
      >
        <div className="col-lg-12">
          <div className="row">
            <div className="columna-1">
              <Link to="/">
                <img
                  className="logo-app"
                  src="/images/Chucherias.png"
                  alt="Chucherias & Regalos"
                />
              </Link>
            </div>
            <div className="columna-2">
              <div className="search-bar">
                <input
                  type="text"
                  id="busquedaTermino"
                  placeholder="¿Qué productos buscas el día de hoy?"
                  onChange={handleSearch}
                  value={searchTerm}
                />
                {searchTerm && searchTerm.length > 0 ? (
                  <button onClick={limpiarBusqueda}>
                    <MdClose size={25} />
                  </button>
                ) : (
                  <button>
                    <MdSearch size={25} />
                  </button>
                )}
              </div>
              <nav className="opciones-cinta mt-2">
                <ul>
                  <li className="cinta-opciones">
                    <DropdownMenu />
                  </li>
                  <li className="cinta-opciones">
                    <Link to="/ofertas">Ofertas</Link>
                  </li>
                  <li className="cinta-opciones">
                    <Link to="/mas-vendidos">Más vendidos</Link>
                  </li>
                  {!customer ? (
                    <li className="cinta-opciones">
                      <a onClick={activarModal}>Iniciar sesión</a>
                      {state.mostrarModal && (
                        <ModalComponent
                          show={state.mostrarModal}
                          onClose={cerrarModal}
                        />
                      )}
                    </li>
                  ) : (
                    <>
                      <li className="cinta-opciones">
                        <Link to="/purchase-history">Historial de compra</Link>
                      </li>
                      <li className="cinta-opciones">
                        <Link onClick={cerrarSesion}>Cerrar sesión</Link>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </div>
            <div className="columna" style={{ width: "25%" }}>
              <div className="profile mb-2">
                <Avatar
                  image={customer?.imagen}
                  label={!customer?.imagen ? initials : undefined}
                  icon="pi pi-user"
                  size="large"
                  style={customer?.imagen ? undefined : avatarStyle}
                  shape="circle"
                />
                {customer ? (
                  <>
                    <div className="perfil">
                      {/* <div className="row">
                    <span className="text-idUser">ID: {customer.sesion}</span>
                  </div> */}
                      <div className="row">
                        <Link className="text-user" to="/user-profile" pointer>
                          <Chip
                            label={`${customer.nombre} ${customer.aPaterno}`}
                            className="fw-bold"
                          />
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link className="text-user" onClick={activarModal} pointer>
                    <Chip label={"Iniciar sesión"} className="fw-bold" />
                  </Link>
                )}
              </div>
              <ButtonCart />
            </div>
            <div className="d-flex item-responsive justify-content-between">
              <ButtonCartResponsive />
              <button
                className="toggle-button"
                onClick={toggleMenu}
                aria-label="Toggle Menu"
              >
                {state.menuVisible ? (
                  <MdClose size={25} />
                ) : (
                  <MdMenu size={25} />
                )}
              </button>
            </div>
          </div>
          <div className="row">
            <Breadcrumbs />
          </div>
        </div>
      </header>

      {/* Overlay */}
      {state.menuVisible && (
        <div className="overlay" onClick={toggleMenu}></div>
      )}

      {/* Sidebar Component */}
      <SidebarMenu
        activarModal={activarModal}
        mostrarModal={state.mostrarModal}
        cerrarModal={cerrarModal}
        cerrarSesion={cerrarSesion}
        menuVisible={state.menuVisible}
        toggleMenu={toggleMenu}
        setMenuVisible={(visible) =>
          setState((prevState) => ({ ...prevState, menuVisible: visible }))
        }
      />
    </>
  );
}

export default PublicHeader;
