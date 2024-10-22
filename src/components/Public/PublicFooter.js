import React, { useState, useEffect } from "react";
import {
  MdEmail,
  MdCall,
  MdGavel,
  MdPolicy,
  MdCookie,
  MdGroup,
  MdQuestionAnswer,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";

function PublicFooter() {
  const [data, setData] = useState({
    quienesSomos: "",
    facebook: "",
    correo: "",
    telefono: "",
  });

  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/getNosotros/1"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Usuario aceptó la instalación");
        } else {
          console.log("Usuario rechazó la instalación");
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <>
      <footer className="footer-public d-flex">
        <div className="column">
          <h3>¿Quiénes somos?</h3>
          <p style={{ textAlign: "justify" }}>{data.quienesSomos}</p>
          {deferredPrompt && (
            <Button
              id="installButton"
              icon="pi pi-microsoft"
              label="Instalar Aplicación"
              severity="info"
              style={{ color: "white" }}
              onClick={handleInstallClick}
              className="item-no-responsive"
            />
          )}
        </div>
        <div className="column">
          <h3>Contacto</h3>
          <ul>
            <li>
              <div className="icon-container">
                <MdGroup size={25} />
              </div>
              <Link to="/quienes-somos">Acerca de nosotros</Link>
            </li>
            <li>
              <div className="icon-container">
                <FontAwesomeIcon icon={faFacebook} />
              </div>
              <a href="https://www.facebook.com/profile.php?id=100064085971615">
                {data.facebook}
              </a>
            </li>
            <li>
              <div className="icon-container">
                <MdEmail size={25} />
              </div>
              {data.correo}
            </li>
            <li>
              <div className="icon-container">
                <MdCall size={25} />
              </div>
              {data.telefono}
            </li>
          </ul>
        </div>
        <div className="column">
          <h3>Acerca de</h3>
          <ul>
            <li>
              <Link to="/terms-cond" className="d-flex">
                <div className="icon-container">
                  <MdGavel size={25} />
                </div>
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="d-flex">
                <div className="icon-container">
                  <MdPolicy size={25} />
                </div>
                Políticas de privacidad
              </Link>
            </li>
            <li>
              <Link to="/FAQs" className="d-flex">
                <div className="icon-container">
                  <MdQuestionAnswer size={25} />
                </div>
                Preguntas frecuentes
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="d-flex">
                <div className="icon-container">
                  <MdCookie size={25} />
                </div>
                Cookies
              </Link>
            </li>
          </ul>
        </div>
      </footer>
      <div className="footer-end text-center">
        <div className="float-right d-none d-sm-block">
          <b>Versión</b> 1.0
        </div>
        <strong>
          &copy; 2023 <Link to="/">Chucherias & Regalos</Link>. | Sitio
          elaborado con fines educativos.
        </strong>
      </div>
    </>
  );
}

export default PublicFooter;
