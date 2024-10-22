import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdFilterAlt, MdAdd, MdEdit, MdDeleteForever, MdInfo } from "react-icons/md";

const Inventario = ({ title }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  const [filterNombre, setFilterNombre] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse, statusesResponse] = await Promise.all([
        axios.get('http://localhost:5000/products/'),
        axios.get('http://localhost:5000/products/categories/getAll'),
        axios.get('http://localhost:5000/products/status/getAll')
      ]);

      setProducts(productsResponse.data);
      setCategories(categoriesResponse.data);
      setStatuses(statusesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/products/search-advance', {
        nombre: filterNombre,
        categoriaId: filterCategoria,
        statusId: filterStatus
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleClear = () => {
    setFilterNombre("");
    setFilterCategoria("");
    setFilterStatus("");
    fetchData();
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>
                {title} |<small> Inventario</small>
              </h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">{title}</a>
                </li>
                <li className="breadcrumb-item active">Inventario</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Productos Registrados</h3>
          </div>
          <div className="card-body">
            <div className="col-sm-12">
              <form onSubmit={handleSearch}>
                <div className="form-group row">
                  <label htmlFor="filterNombre" className="col-sm-2 col-form-label">
                    Nombre:
                  </label>
                  <div className="col-sm-2">
                    <input
                      type="text"
                      className="form-control"
                      id="filterNombre"
                      name="filterNombre"
                      value={filterNombre}
                      onChange={(e) => setFilterNombre(e.target.value)}
                    />
                  </div>
                  <label htmlFor="filterCategoria" className="col-sm-2 col-form-label">
                    Categoria:
                  </label>
                  <div className="col-sm-2">
                    <select
                      className="form-select"
                      id="filterCategoria"
                      name="filterCategoria"
                      value={filterCategoria}
                      onChange={(e) => setFilterCategoria(e.target.value)}
                    >
                      <option value="" disabled selected></option>
                      {categories.map(category => (
                        <option key={category.categoriaId} value={category.categoriaId}>
                          {category.categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label htmlFor="filterStatus" className="col-sm-1 col-form-label">
                    Estatus:
                  </label>
                  <div className="col-sm-2">
                    <select
                      className="form-select"
                      id="filterStatus"
                      name="filterStatus"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="" disabled selected></option>
                      {statuses.map(status => (
                        <option key={status.statusId} value={status.statusId}>
                          {status.status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-sm-1">
                    <button type="submit" className="btn btn-success">
                      <MdFilterAlt size={25} />
                    </button>
                  </div>
                  <div className="col-sm-2">
                    <button type="button" className="btn btn-secondary" onClick={handleClear}>
                      Limpiar <MdDeleteForever size={25}/>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <hr className="border border-primary border-3 opacity-75"/>

            <p>
              <Link to="/admin/inventory/add-product" className="btn btn-primary btn-add">
                <MdAdd size={25} /> Agregar
              </Link>
            </p>

            <div className="table-responsive">
              <table id="productsTable" className="table table-striped table-bordered table-hover table-sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th className="item-center">Precio</th>
                    <th className="item-center">Existencia</th>
                    <th className="item-center">Categoria</th>
                    <th className="item-center">Activo</th>
                    <th className="item-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product, index) => (
                      <tr key={product.productoId}>
                        <td>{product.nombre}</td>
                        <td className="item-center">{product.precioFinal}</td>
                        <td className="item-center">{product.existencia}</td>
                        <td className="item-center">
  {categories.find(category => category.categoriaId === product.categoriaId)?.categoria || "otro"}
</td>
                        <td className="item-center">
                          {product.statusId === 1 ? (
                            <i className="fas fa-check-circle text-success"></i>
                          ) : (
                            <i className="fas fa-times-circle text-danger"></i>
                          )}
                        </td>
                        <td className="item-center">
                          
                        <Link
                            to={`edit-product/${product.productoId}`}
                            className="btn btn-warning mr-2"
                            data-toggle="tooltip"
                            title={`Modificar producto: ${product.nombre}`}
                          >
                            <MdEdit size={20} />
                          </Link>
                          <Link
                            to={`show-details/${product.productoId}`}
                            className="btn btn-info mr-2"
                            data-toggle="tooltip"
                            title={`Ver detalle del producto: ${product.nombre}`}
                          >
                            <MdInfo size={20} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="item-center">
                        No se encontraron productos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer">
            <nav>
              <ul className="pagination justify-content-center" style={{ marginBottom: 80 }}>
                {pageNumbers.map((number) => (
                  <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <a onClick={handleClick} className="page-link" id={number}>
                      {number}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inventario;
