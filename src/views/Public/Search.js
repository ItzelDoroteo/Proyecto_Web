import PageTitle from "../../components/Public/PageTitle";
import React, { useState } from "react";
import {
  MdChevronRight,
  MdSearch,
  MdFilterAlt,
  MdRemove,
} from "react-icons/md";

const PurchaseHistory = () => {
  return (
    <main>
      <PageTitle title="Chucherias & Regalos | Historial de compra" />

      <h3 className="title-pag fw-bold text-uppercase">Historial de compras</h3>
      <hr className="hr-primary" />

      <div className="cont-filter mt-4">
        <div className="search-bar-history">
          <input type="text" placeholder="Buscar" />
          <button>
            <MdSearch size={25} />
          </button>
        </div>
        <div className="filters">
          <h5>Filtrar por precio:</h5>
          <input type="number" />
          <h5>
            <MdRemove size={25} />
          </h5>
          <input type="number" />
          <button className="btn-filter">
            <MdFilterAlt size={25} />
          </button>
        </div>
      </div>

      <div className="detail-product">
        <div className="colum-detail-history">
          <div className="card mb-3 mt-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-2">
                  <img
                    src="./images/R (1).jpg"
                    className="img-fluid rounded-start"
                    alt="..."
                  />
                </div>
                <div className="col-md-5 row ml-1">
                  <h4
                    className="card-title mb-4 mt-4"
                    style={{ fontSize: "20px" }}
                  >
                    Caja registradora de juguete para niñas
                  </h4>
                  <br />
                  <h2 className="text-success fw-bold">$ 130.00</h2>
                  <div className="cont-options">
                    <spam>
                      Disponibles <strong>16 piezas</strong>
                    </spam>
                  </div>
                </div>
                <div className="col-md-5 aling-center-cont">
                  <div className="cont-cant d-flex align-items-center justify-content-center">
                    <button className="btn-primary">Comprar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card mb-3 mt-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-2">
                  <img
                    src="./images/collar.jpg"
                    className="img-fluid rounded-start"
                    alt="..."
                  />
                </div>
                <div className="col-md-5 row ml-1">
                  <h4 className="card-title mt-4" style={{ fontSize: "20px" }}>
                    Collar para dama con piedra preciosa
                  </h4>
                  <h2 className="text-success fw-bold">$ 150.00</h2>
                  <div className="cont-options">
                    <spam>
                      Disponibles <strong>10 piezas</strong>
                    </spam>
                  </div>
                </div>
                <div className="col-md-5 aling-center-cont">
                  <div className="cont-cant d-flex align-items-center justify-content-center">
                    <button className="btn-primary">Comprar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PurchaseHistory;
