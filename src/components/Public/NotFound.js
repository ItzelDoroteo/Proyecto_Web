// NotFound.js
import { Link } from "react-router-dom"; // Importar Link desde react-router-dom
import React from "react";
import "../../styles/NotFound.css";

const NotFound = () => {
  return (
    <div className="body">
      <h1>Página no encontrada</h1>
      <p className="zoom-area">
        <b>¡Vaya! </b> Esta página es como una isla desierta. Nada por aquí.{" "}
      </p>
      <section className="error-container">
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
        <span className="zero">
          <span className="screen-reader-text">0</span>
        </span>
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
      </section>
      <div class="link-container">
        <Link
          to="/"
          class="more-link"
        >
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
