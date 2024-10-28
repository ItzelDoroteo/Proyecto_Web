// CookieBanner.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import '../styles/cookies.css';

const CookieBanner = () => {
  const [cookieAccepted, setCookieAccepted] = useState(false);

  useEffect(() => {
    // Verifica si las cookies han sido aceptadas previamente
    const isCookieAccepted = localStorage.getItem('cookieAccepted');
    if (isCookieAccepted) {
      setCookieAccepted(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    // Al hacer clic en "De acuerdo", establece la cookie aceptada y cierra el banner
    localStorage.setItem('cookieAccepted', true);
    setCookieAccepted(true);
  };

  if (cookieAccepted) {
    return null; // No muestra el banner si las cookies ya fueron aceptadas
  }

  return (
    <div className="aviso-cookies" id="aviso-cookies">
      <img className="galleta" src="/images/cookie.svg" alt="Galleta" />
      <h3 className="titulo">Cookies</h3>
      <p className="parrafo">Utilizamos cookies propias y de terceros para mejorar nuestros servicios.</p>
      <button className="boton" id="btn-aceptar-cookies" onClick={handleAcceptCookies}>
        De acuerdo
      </button>
      <Link className="enlace" to="aviso-cookies.html">
        Aviso de Cookies
      </Link>
    </div>
  );
};

export default CookieBanner;
