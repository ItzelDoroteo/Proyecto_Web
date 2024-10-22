import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetail = ({ title }) => {
  const { productId } = useParams();
  const [productData, setProductData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    existencia: 0,
    categoriaId: 0,
    statusId: 0,
    imagen: "",
    IVA: 0,
    precioFinal: 0,
    createdAt: "",
    updatedAt: "",
    descuento: 0,
  });

  useEffect(() => {
    fetchData();
  }, [productId]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/products/${productId}`
      );
      setProductData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>
                {title} |<small> Panel administrativo</small>
              </h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">{title}</a>
                </li>
                <li className="breadcrumb-item active">Panel administrativo</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="text-title">{productData.nombre}</h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 item-center">
                <img
                  src={productData.imagen}
                  alt={productData.nombre}
                  className="img-fluid shadow"
                  style={{
                    width: "auto",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="col-md-8">
                <p className="card-text ml-3 mr-3">{productData.descripcion}</p>

                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Precio:</strong> ${productData.precio}
                  </li>
                  <li className="list-group-item">
                    <strong>Existencia:</strong> {productData.existencia}
                  </li>
                  <li className="list-group-item">
                    <strong>IVA:</strong> ${productData.IVA}
                  </li>
                  <li className="list-group-item">
                    <strong>Precio Final:</strong> ${productData.precioFinal}
                  </li>
                  <li className="list-group-item">
                    <p
                      className="card-text mt-3 mb-4"
                    >
                      <small className="text-muted">
                        Creado:{" "}
                        {new Date(productData.createdAt).toLocaleDateString()} |
                        Actualizado:{" "}
                        {new Date(productData.updatedAt).toLocaleDateString()}
                      </small>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <p className="card-text mt-3 mb-4" style={{ marginBottom: 600 }}>
              <small className="text-muted">
                Chucherias & Regalos
              </small>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
