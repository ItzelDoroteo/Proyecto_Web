// Error400.js
import React from "react";
import "../../styles/NotFound.css";
import { Link } from 'react-router-dom'; 

const Error400 = () => {
  return (
    <div className="body">
      <h1>Error 400: Solicitud incorrecta</h1>
      <p className="zoom-area">
        <b>¡Oops! </b> Parece que la solicitud realizada es incorrecta. Por favor, verifica tus datos y vuelve a intentarlo.
      </p>
      <section className="error-container">
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
        <span className="zero">
          <span className="screen-reader-text">0</span>
        </span>
        <span className="zero">
          <span className="screen-reader-text">0</span>
        </span>
      </section>    
      <div className="link-container">
        <Link to="/" className="more-link">Volver a la página principal</Link>
      </div>
    </div>
  );
};

export default Error400;
