import React, { useEffect, useState } from "react";
import PageTitle from "../../components/Public/PageTitle";
import { Link } from "react-router-dom";
import BootstrapCarousel from "../../components/Public/BootstrapCarousel";
import { MdFilterAlt } from "react-icons/md";

function Ofertas() {
  const [products, setProducts] = useState([]);
  const [promos, setPromos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [orderBy, setOrderBy] = useState("");

  useEffect(() => {
    // Obtener la fecha actual
    const fechaActual = new Date().toISOString().split("T")[0];
    fetch(
      `http://localhost:5000/products/promos/${fechaActual}`
    )
      .then((response) => response.json())
      .then((data) => {
        setPromos(data);
        if (data.length > 0) {
          fetch(
            `http://localhost:5000/products/categoria/${data[0].categoriaId}`
          ) // Aquí asumo que solo estás usando la categoría del primer producto de promos, ajusta según tus necesidades
            .then((response) => response.json())
            .then((data) => {
              setProducts(data);
              setCurrentPage(1); // Resetear a la primera página cuando hay resultados de búsqueda
            })
            .catch((error) => console.error("Error fetching products:", error));
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);
  

  useEffect(() => {
    // Limpiar los filtros cuando no hay término de búsqueda
    if (!products && products.length <= 0) {
      setMinPrice("");
      setMaxPrice("");
      setOrderBy("");
    }
  }, [products]);

  // Filtrar y ordenar productos según criterios
  const filteredAndSortedProducts = () => {
    let filteredProducts = products;

    if (minPrice !== "") {
      filteredProducts = filteredProducts.filter(
        (product) => parseFloat(product.precio) >= parseFloat(minPrice)
      );
    }

    if (maxPrice !== "") {
      filteredProducts = filteredProducts.filter(
        (product) => parseFloat(product.precio) <= parseFloat(maxPrice)
      );
    }

    if (orderBy === "desc") {
      filteredProducts.sort(
        (a, b) => parseFloat(b.precio) - parseFloat(a.precio)
      );
    } else if (orderBy === "asc") {
      filteredProducts.sort(
        (a, b) => parseFloat(a.precio) - parseFloat(b.precio)
      );
    }

    return filteredProducts;
  };

  // Cambiar de página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calcular el número total de páginas
  const totalPages = Math.ceil(
    filteredAndSortedProducts().length / productsPerPage
  );

  return (
    <>
      <BootstrapCarousel />
      <main>
        <PageTitle title="Chucherias & Regalos | Inicio" />

        <h3 className="title-pag fw-bold text-uppercase">
          Productos en oferta
        </h3>
        <hr className="hr-primary" />

        {products && products.length > 0 && (
          <div className="advanced-search">
            <div className="row mt-4 ml-4">
              <div className="col-md-1">
                <span className="btn btn-info disabled">
                  <MdFilterAlt size={20} /> Filtros
                </span>
              </div>
              <div className="col-md-6">
                <div className="row col-md-12">
                  <div className="col-sm-3">
                    <label
                      htmlFor="min-price"
                      className="col-form-label col-form-label-sm mr-2 d-flex justify-content-end"
                    >
                      Precio mínimo:
                    </label>
                  </div>
                  <div className="col-sm-3">
                    <input
                      type="number"
                      className="form-control"
                      id="min-price"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div className="col-sm-3">
                    <label
                      htmlFor="max-price"
                      className="col-form-label col-form-label-sm mr-2 d-flex justify-content-end"
                    >
                      Precio máximo:
                    </label>
                  </div>
                  <div className="col-sm-3">
                    <input
                      type="number"
                      className="form-control"
                      id="max-price"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <div className="row col-md-12">
                  <div className="col-sm-1 d-flex justify-content-end">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="orderByDesc"
                      checked={orderBy === "desc"}
                      onChange={() =>
                        setOrderBy(orderBy === "desc" ? "" : "desc")
                      }
                    />
                  </div>
                  <div className="col-sm-5">
                    <label className="form-check-label" htmlFor="orderByDesc">
                      Ordenar de mayor a menor
                    </label>
                  </div>
                  <div className="col-sm-1 d-flex justify-content-end">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="orderByAsc"
                      checked={orderBy === "asc"}
                      onChange={() =>
                        setOrderBy(orderBy === "asc" ? "" : "asc")
                      }
                    />
                  </div>
                  <div className="col-sm-5">
                    <label className="form-check-label" htmlFor="orderByAsc">
                      Ordenar de menor a mayor
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <hr className="hr-primary" />

        <h2 className="title-pag fw-bold text-center">
              {(promos && promos.length > 0) && (
                "Aprovecha las promos este " + promos[0].evento + " en los siguientes productos:"
              )}
            </h2>

        <div className="catalog">
          {filteredAndSortedProducts().length > 0 ? (
            filteredAndSortedProducts()
              .slice(
                (currentPage - 1) * productsPerPage,
                currentPage * productsPerPage
              )
              .map((product) => (
                <Link
                  to={`/product/${product.productoId}`}
                  key={product.productoId}
                >
                  <div className="card mt-4" style={{ width: "18rem" }}>
                    <div className="cont-img">
                      <img
                        src={product.imagen}
                        className="card-img-top img-catalog"
                        alt={product.nombre}
                      />
                    </div>
                    <div className="card-body mt-3">
                      <div className="cont-description">
                        <h5>{product.nombre}</h5>
                      </div>
                      <div className="cont-price mt-4">
                        <h3 className="fw-bold">{`$ ${product.precio}`}</h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </div>

        {/* Agregar paginación */}
        <ul className="pagination text-center mt-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <li
              key={index}
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              <button onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

export default Ofertas;
