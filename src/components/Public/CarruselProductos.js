import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "primereact/carousel";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Rating } from "primereact/rating";

const CarruselProductos = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  // const [elementsPerPage, setElementsPerPage] = useState(3);

  useEffect(() => {
    fetch("http://localhost:5000/products/randomProducts")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));

    // // Ajustar la cantidad de elementos por página dependiendo del tamaño de la pantalla
    // const updateElementsPerPage = () => {
    //   if (window.innerWidth <= 768) {
    //     setElementsPerPage(1); // Un solo producto por página en pantallas pequeñas
    //   } else {
    //     setElementsPerPage(3); // Tres productos en pantallas más grandes
    //   }
    // };

    // updateElementsPerPage(); // Llamada inicial
    // window.addEventListener("resize", updateElementsPerPage); // Escuchar cambios de tamaño de pantalla

    // return () => {
    //   window.removeEventListener("resize", updateElementsPerPage); // Limpiar el listener
    // };
  }, []);
  useEffect(() => {
    // Obtener categorías
    fetch("http://localhost:5000/products/categories/getAll")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const getCategoryName = (categoriaId) => {
    const category = categories.find((cat) => cat.categoriaId === categoriaId);
    return category ? category.categoria : "Sin categoría";
  };

  const productTemplate = (product) => {
    return (
        <Link
          to={`/product/${product.productoId}`}
          className="d-flex text-decoration-none justify-content-center catalogo"
        >
          <Card className="card shadow-sm" style={{ width: 340 }}>
            <div className="cont-img item-center">
              <img
                src={product.imagen}
                className="card-img-top img-catalog"
                alt={product.nombre}
              />
            </div>
            <div className="card-body">
              <Tag
                className="mr-2 mb-2"
                icon="pi pi-tag"
                severity="secondary"
                value={getCategoryName(product.categoriaId)}
                style={{ fontSize: 15 }}
              ></Tag>
              <div className="row">
                <h5 className="card-title">{product.nombre}</h5>
                <Rating
                  value={product.ranking}
                  className="mt-2"
                  readOnly
                  cancel={false}
                />
                <p className="card-text fw-bold mt-3">{`$ ${product.precioFinal}`}</p>
              </div>
            </div>
          </Card>
        </Link>
    );
  };

  return (
    <>
      <hr className="hr-primary" />
      <h4 className="title-pag fw-bold mt-3">También podría gustarte</h4>

      <Carousel
        value={products}
        numVisible={3}
        numScroll={1}
        circular
        autoplayInterval={3000}
        itemTemplate={productTemplate}
        className="custom-carousel"
      />
    </>
  );
};

export default CarruselProductos;
