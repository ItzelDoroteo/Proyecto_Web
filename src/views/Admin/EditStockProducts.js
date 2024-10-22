import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdFilterAlt, MdUpdate, MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";

const EditStockProducts = ({ title }) => {
  const [productos, setProductos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newExistencias, setNewExistencias] = useState({});

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

      setProductos(productsResponse.data);
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
      setProductos(response.data);
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
  const currentProducts = productos.slice(indexOfFirstProduct, indexOfLastProduct);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(productos.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const handleInputChange = (productId, value) => {
    setNewExistencias((prevState) => ({
      ...prevState,
      [productId]: value
    }));
  };

  const handleUpdate = async (productId) => {
    const nuevaExistencia = newExistencias[productId];
    try {
      await axios.put(`http://localhost:5000/products/update/${productId}`, {
        existencia: nuevaExistencia
      });
      setNewExistencias((prevState) => ({
        ...prevState,
        [productId]: ''
      }));
      toast.success('Stock registrado exitosamente!');
      fetchData();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al registrar el stock.');
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>
                {title} |<small> Actualizar existencia de productos</small>
              </h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">{title}</a>
                </li>
                <li className="breadcrumb-item active">Actualizar existencia de productos</li>
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
                  <div className="col-sm-4">
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
                    Categoría:
                  </label>
                  <div className="col-sm-3">
                    <select
                      type="text"
                      className="form-control"
                      id="filterCategoria"
                      name="filterCategoria"
                      value={filterCategoria}
                      onChange={(e) => setFilterCategoria(e.target.value)}
                    >
                      <option value="" disabled></option>
                      {categories.map(category => (
                        <option key={category.categoriaId} value={category.categoriaId}>
                          {category.categoria}
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

            <hr className="border border-primary border-3 opacity-75" />

            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover table-sm">
                <thead>
                  <tr>
                    {/* <th>#</th> */}
                    <th className="col-producto-existencia">Producto</th>
                    <th className="item-center">Existencia</th>
                    <th className="item-center">Nueva existencia</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((producto, index) => (
                      <tr key={producto.productoId}>
                        {/* <td>{indexOfFirstProduct + index + 1}</td> */}
                        <td>{producto.nombre}</td>
                        <td className="item-center">{producto.existencia}</td>
                        <td className="item-center">
                          <input
                            type="number"
                            className="form-control"
                            value={newExistencias[producto.productoId] || ''}
                            onChange={(e) => handleInputChange(producto.productoId, e.target.value)}
                          />
                        </td>
                        <td className="item-center">
                          <button
                            type="button"
                            className="btn btn-warning"
                            onClick={() => handleUpdate(producto.productoId)}
                            disabled={!newExistencias[producto.productoId]}
                          >
                            Actualizar <MdUpdate size={25} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
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
                  <li
                    key={number}
                    className={`page-item ${currentPage === number ? "active" : ""}`}
                  >
                    <a
                      onClick={handleClick}
                      className="page-link"
                      productoId={number}
                      href="#"
                    >
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

export default EditStockProducts;
