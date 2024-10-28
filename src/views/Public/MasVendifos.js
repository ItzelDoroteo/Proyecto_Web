import React, { useEffect, useState } from "react";
import PageTitle from "../../components/Public/PageTitle";
import { Link } from "react-router-dom";
import BootstrapCarousel from "../../components/Public/BootstrapCarousel";
import { MdFilterAlt } from "react-icons/md";
import { Card } from "primereact/card";
import { Paginator } from "primereact/paginator"; // Importa estilos básicos de PrimeReact
import { Tag } from "primereact/tag";
import { Rating } from "primereact/rating";

function MasVendidos() {
  const [categories, setCategories] = useState([]);
  const [first, setFirst] = useState(0); // Para PrimeReact Paginator
  const [products, setProducts] = useState([]);
  const productsPerPage = 20;
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [orderBy, setOrderBy] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/products/productos/mas-vendidos")
      .then((response) => response.json())
      .then((data) => setProducts(data))
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
  const onPageChange = (event) => {
    setFirst(event.first);
  };



  return (
    <>
      <BootstrapCarousel />
      <main>
        <PageTitle title="Chucherías & Regalos | Inicio" />

        <h3 className="title-pag fw-bold text-uppercase">Productos más vendidos</h3>
        {products && products.length > 0 && (
           <div className="advanced-search">

            <div className="row mt-4 ml-4">
              <div className="col-12 col-md-5 mb-3 mb-md-0">
                <div className="row">
                  <div className="col-6 col-sm-3 d-flex justify-content-end align-items-center">
                    <label
                      htmlFor="min-price"
                      className="col-form-label col-form-label-sm"
                    >
                      Precio mínimo:
                    </label>
                  </div>
                  <div className="col-6 col-sm-3">
                    <input
                      type="number"
                      className="form-control"
                      id="min-price"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div className="col-6 col-sm-3 d-flex justify-content-end align-items-center">
                    <label
                      htmlFor="max-price"
                      className="col-form-label col-form-label-sm"
                    >
                      Precio máximo:
                    </label>
                  </div>
                  <div className="col-6 col-sm-3">
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

              <div className="col-12 col-md-5">
                <div className="row">
                  <div className="col-2 col-sm-1 d-flex justify-content-end align-items-center">
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
                  <div className="col-10 col-sm-5 d-flex align-items-center">
                    <label className="form-check-label" htmlFor="orderByDesc">
                      Mayor a menor
                    </label>
                  </div>
                  <div className="col-2 col-sm-1 d-flex justify-content-end align-items-center">
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
                  <div className="col-10 col-sm-5 d-flex align-items-center">
                    <label className="form-check-label" htmlFor="orderByAsc">
                      Menor a mayor
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-2 mb-3 mb-md-0">
                <span className="btn btn-info disabled w-100">
                  <MdFilterAlt size={20} /> Filtrar
                </span>
              </div>
            </div>
          </div>
        )}
        <hr className="hr-primary my-4" />

        <div className="section">
          <div className="row catalogo">
            {filteredAndSortedProducts().length > 0 ? (
              filteredAndSortedProducts()
                .slice(first, first + productsPerPage)
                .map((product) => (
                  <div
                    className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 catalog"
                    key={product.productoId}
                  >
                    <Link
                      to={`/product/${product.productoId}`}
                      className="text-decoration-none"
                    >
                      <Card className="card shadow-sm">
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
                            style={{fontSize:15}}
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
                  </div>
                ))
            ) : (
              <p>No se encontraron productos.</p>
            )}
          </div>
        </div>

        {/* Paginación con PrimeReact */}
        <Paginator
          first={first}
          rows={productsPerPage}
          totalRecords={filteredAndSortedProducts().length}
          onPageChange={onPageChange}
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        />
      </main>
    </>
  );
}

export default MasVendidos;
