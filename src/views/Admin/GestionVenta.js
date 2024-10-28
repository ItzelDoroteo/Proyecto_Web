import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { MdLocalMall, MdVisibility } from "react-icons/md";
import { toast } from "react-toastify";

const ViewOrders = ({ title }) => {
  const [ventas, setVentas] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Estado para usuarios
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [detalleVenta, setDetalleVenta] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const ordersPerPage = 15;

  useEffect(() => {
    fetchVentas();
    fetchStatuses();
    fetchUsuarios(); // Fetch usuarios
  }, []);

  const fetchVentas = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/ventas/"
      );
      const sortedVentas = response.data.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );
      setVentas(sortedVentas);
    } catch (error) {
      console.error("Error fetching ventas:", error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/ventas/status/getAllStatusVenta"
      );
      setStatuses(response.data);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/users/"
      );
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    }
  };

  const fetchDetalleVenta = async (ventaId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/ventas/detalle/${ventaId}`
      );
      setDetalleVenta(response.data);
    } catch (error) {
      console.error("Error fetching detalle venta:", error);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const handleViewDetails = (venta) => {
    setSelectedVenta(venta);
    fetchDetalleVenta(venta.ventaId);
    setModalOpen(true);
  };

  const handleChangeStatus = async () => {
    try {
      await axios.put(
        `http://localhost:5000/ventas/updateStatusVenta/${selectedVenta.ventaId}`,
        {
          statusVentaId: newStatus,
        }
      );
      toast.success("Estado de venta actualizado exitosamente!");
      fetchVentas();
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating sale status:", error);
      toast.error("Error al actualizar el estado de venta.");
    }
  };

  const getUserName = (userId) => {
    const user = usuarios.find((usuario) => usuario.customerId === userId);
    return user ? user.correo : "Desconocido";
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = ventas.slice(indexOfFirstOrder, indexOfLastOrder);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(ventas.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>
                {title} |<small> Pedidos</small>
              </h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">{title}</a>
                </li>
                <li className="breadcrumb-item active">Pedidos</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Pedidos</h3>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover table-sm">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length > 0 ? (
                    currentOrders.map((venta) => (
                      <tr key={venta.ventaId}>
                        <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                        <td>{getUserName(venta.customerId)}</td>
                        <td>{venta.cantidad}</td>
                        <td>${venta.total}</td>
                        <td>
                          {statuses.find(
                            (status) =>
                              status.statusVentaId === venta.statusVentaId
                          )?.statusVenta || "Desconocido"}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-info icon-align"
                            onClick={() => handleViewDetails(venta)}
                          >
                            Detalle <MdVisibility size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No se encontraron pedidos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer">
            <nav>
              <ul
                className="pagination justify-content-center"
                style={{ marginBottom: 80 }}
              >
                {pageNumbers.map((number) => (
                  <li
                    key={number}
                    className={`page-item ${
                      currentPage === number ? "active" : ""
                    }`}
                  >
                    <a
                      onClick={handlePageClick}
                      className="page-link"
                      id={number}
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

      {selectedVenta && (
        <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg">
          <Modal.Header closeButton className="bg-primary">
            <Modal.Title>Detalle de la compra</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-sm-8">
                {selectedVenta.domicilioId &&
                selectedVenta.domicilioId !== null ? (
                  <p className="fs-5">
                    <strong>Metodo de entrega: </strong>Envio a domicilio
                  </p>
                ) : (
                  <p className="fs-5">
                    <strong>Metodo de entrega: </strong>Recoleccion en sucursal
                  </p>
                )}

                <p className="fs-5">Total de productos comprados ({selectedVenta.cantidad})</p>
                <p className="text-secondary fw-bold fs-6">
                  Fecha de compra: {selectedVenta.fecha.split("T")[0]}
                </p>
              </div>

              <div className="col-sm-4 text-center">
                <MdLocalMall size={80} color="#c9c9c9" />
              </div>
            </div>
            <div className="col-sm-12 mt-1 mb-4">
              <div className="row">
                <div className="col-sm-6">
                  
                  <select
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="" selected disabled>
                    Seleccionar nuevo estado
                  </option>
                  {statuses.map((status) => (
                    <option
                      key={status.statusVentaId}
                      value={status.statusVentaId}
                    >
                      {status.statusVenta}
                    </option>
                  ))}
                </select>
                </div>
                <div className="col-sm-6">
                  <Button
                    variant="success"
                    onClick={handleChangeStatus}
                    disabled={!newStatus}
                  >
                    Cambiar estado de venta
                  </Button>
                </div>
              </div>
            </div>
            <table className="table table-striped table-bordered table-hover table-sm">
              <thead>
                <tr>
                    <th></th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalleVenta.map((detalle) => (
                  <tr key={detalle.productoId}>
                    <img
                        src={detalle.imagen}
                        alt={detalle.producto}
                        style={{ borderRadius: "100px", height: "80px" }}
                      />
                    <td>{detalle.producto}</td>
                    <td>{detalle.cantidad}</td>
                    <td>${detalle.precio}</td>
                    <td>${detalle.totalDV}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="row justify-content-between">
              <div className="col-sm-4">
                <p className="text-secondary fs-6">
                  <strong>Folio de compra: </strong>
                  {selectedVenta.folio}
                </p>
              </div>
              <div className="col-sm-4">
                <p className="text-secondary fs-6">
                  <strong>Total de la compra: </strong>${selectedVenta.total}
                </p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ViewOrders;
