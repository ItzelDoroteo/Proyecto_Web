import React, { useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { Modal } from "react-bootstrap"; // Importa el Modal de React Bootstrap
import {
  MdFilterAlt,
  MdRemove,
  MdFilterAltOff,
  MdLocalMall,
  MdProductionQuantityLimits,
} from "react-icons/md";
import PageTitle from "../../components/Public/PageTitle";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useAlert } from "../../context/AlertContext";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";

const PurchaseHistory = () => {
  const { token } = useAuth();
  const showAlert = useAlert();
  const [user, setUser] = useState(0);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pruchasesPerPage = 5;
  const [dataHistory, setDataHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [venta, setVenta] = useState(null);
  const [folioVenta, setFolioVenta] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Estados para manejar el motivo de la cancelación y la visibilidad del modal
  const [cancelReason, setCancelReason] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    fechaInicial: "",
    fechaFinal: "",
  });

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded.customerId);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      const fetchPurchaseHistory = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/ventas/cliente/${user}`
          );
          const historyData = response.data;

          // Obtener los detalles de cada compra
          const purchaseDetailsPromises = historyData.map(async (purchase) => {
            const detailResponse = await axios.get(
              `http://localhost:5000/ventas/detalle/${purchase.ventaId}`
            );
            return {
              ...purchase,
              detalleVenta: detailResponse.data,
            };
          });

          // Esperar a que todas las promesas se resuelvan
          const purchaseDetails = await Promise.all(purchaseDetailsPromises);

          setPurchaseHistory(purchaseDetails);
          setDataHistory(purchaseDetails);
          setLoading(false);
          setCurrentPage(1); // Resetear a la primera página cuando hay resultados de búsqueda
        } catch (error) {
          console.error("Error fetching purchase history:", error);
          setLoading(false);
        }
      };

      fetchPurchaseHistory();
    }
  }, [user]);

  const openModal = async (purchase, ventaId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/ventas/${ventaId}`
      );
      setSelectedPurchase(purchase);
      setVenta(response.data);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching purchase details:", error);
    }
  };

  // Función para limpiar los filtros y restaurar los datos originales
  const handleClearFilter = () => {
    setPurchaseHistory(dataHistory);
    showAlert("info", "Se limpio el filtro de busqueda.");
    setFilterValues({
      fechaInicial: "",
      fechaFinal: "",
    });
  };

  // Cambiar de página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calcular el número total de páginas
  const totalPages = Math.ceil(purchaseHistory.length / pruchasesPerPage);

  // Función para abrir el modal de cancelación
  const openCancelModal = async (folio) => {
    setCancelModalOpen(true);
    setFolioVenta(folio);
  };

  // Función para cerrar el modal de cancelación
  const closeCancelModal = () => {
    setCancelModalOpen(false);
  };

  // Función para manejar el cambio en el motivo de la cancelación
  const handleCancelReasonChange = (event) => {
    setCancelReason(event.target.value);
  };

  // Función para manejar la cancelación de la compra
  const handleCancelPurchase = async () => {
    try {
      console.log(folioVenta, cancelReason);
      // Aquí consumes la API para cambiar el estado de la venta al cancelarla
      await axios.post(`http://localhost:5000/ventas/cancelar-venta`, {
        folio: folioVenta, // Folio de la venta
        reason: cancelReason, // Razón de la cancelación
      });

      // Aquí puedes manejar la respuesta de la API, como mostrar un mensaje de éxito
      showAlert("success", "La compra ha sido cancelada correctamente.");

      // Actualizar el estado de purchaseHistory para reflejar el cambio de estado de la venta cancelada
      setPurchaseHistory((prevPurchaseHistory) =>
        prevPurchaseHistory.map((purchase) => {
          if (purchase.folio === folioVenta) {
            // Actualizar el estado de la compra cancelada
            return {
              ...purchase,
              statusVentaId: 5, // 5 representa el estado de venta cancelada
            };
          } else {
            // Mantener el estado de las compras que no se han cancelado
            return purchase;
          }
        })
      );

      // Aquí puedes cerrar el modal después de cancelar la compra
      closeCancelModal();
    } catch (error) {
      // Aquí puedes manejar los errores, como mostrar un mensaje de error
      console.error("Error canceling purchase:", error);
      showAlert("error", "Ha ocurrido un error al cancelar la compra.");
    }
  };

  if (purchaseHistory.length === 0) {
    return (
      <main>
        <div className="d-flex ml-4 text-center">
          <h2 className="text-center">
            No se han realizado compras por el momento
          </h2>
        </div>

        <hr className="hr-primary" />
        <div className="text-center">
          <MdProductionQuantityLimits size={250} color="gray" />
        </div>
      </main>
    );
  }

  const CalendarField = ({ field, form, ...props }) => {
    return (
      <Calendar
        {...field}
        {...props}
        value={field.value || null}
        onChange={(e) => form.setFieldValue(field.name, e.value)}
        dateFormat="yy-mm-dd" // Formato de fecha
        placeholder="yyyy-mm-dd"
        className="w-100"
      />
    );
  };

  return (
    <main>
      <PageTitle title="Chucherias & Regalos | Historial de compra" />

      <h3 className="title-pag fw-bold text-uppercase">Historial de compras</h3>
      <hr className="hr-primary" />

      <div className="row item-filter">
        <div className="col-lg-10 mt-4">
          <Formik
            initialValues={filterValues}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const response = await axios.post(
                  "http://localhost:5000/ventas/filtroVentas",
                  {
                    fechaInicial: values.fechaInicial,
                    fechaFinal: values.fechaFinal,
                    customerId: user,
                  }
                );

                const filterHistory = response.data;

                const purchaseDetailsPromises = filterHistory.map(
                  async (purchase) => {
                    const detailResponse = await axios.get(
                      `http://localhost:5000/ventas/detalle/${purchase.ventaId}`
                    );
                    return { ...purchase, detalleVenta: detailResponse.data };
                  }
                );

                const purchaseDetails = await Promise.all(
                  purchaseDetailsPromises
                );

                setPurchaseHistory(purchaseDetails);
                showAlert(
                  "success",
                  "Se aplico el filtro de historial de compra."
                );
              } catch (error) {
                console.error(
                  "Error fetching filtered purchase history:",
                  error
                );
              }
              setSubmitting(false);
            }}
            validate={(values) => {
              const errors = {};
              const currentDate = new Date();
              const minDate = new Date("2000-01-01");

              if (values.fechaInicial < minDate) {
                errors.fechaInicial =
                  "La fecha inicial no puede ser menor a 2000";
                showAlert(
                  "error",
                  "La fecha inicial no puede ser menor a 2000"
                );
              }

              if (values.fechaFinal > currentDate.toISOString().split("T")[0]) {
                errors.fechaFinal =
                  "La fecha final no puede ser mayor a la fecha actual";
                showAlert(
                  "error",
                  "La fecha final no puede ser mayor a la fecha actual"
                );
              }

              if (values.fechaFinal < values.fechaInicial) {
                errors.fechaFinal =
                  "La fecha final no puede ser menor a la fecha inicial";
                showAlert(
                  "error",
                  "La fecha final no puede ser menor a la fecha inicial"
                );
              }

              return errors;
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="d-flex flex-column flex-sm-row align-items-center">
                  <h5 className="me-3">Filtrar por fecha:</h5>
                  <div className="d-flex flex-grow-1 mb-2 mb-sm-0">
                    <Field
                      name="fechaInicial"
                      component={CalendarField}
                      className="form-control m-2"
                    />
                    <span className=" item-cente m-2">
                      <MdRemove size={20} />
                    </span>
                    <Field
                      name="fechaFinal"
                      component={CalendarField}
                      className="form-control m-2"
                    />
                  </div>

                  <div className="cont-btn-filter item-center">
                    <button
                      type="submit"
                      className="btn btn-info m-2"
                      disabled={isSubmitting}
                    >
                      <MdFilterAlt size={25} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleClearFilter}
                    >
                      <MdFilterAltOff size={25} />
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          {purchaseHistory && purchaseHistory.length > 0 ? (
            loading ? (
              <p>Cargando historial de compras...</p>
            ) : (
              purchaseHistory
                .slice(
                  (currentPage - 1) * pruchasesPerPage,
                  currentPage * pruchasesPerPage
                )
                .map((purchase) => (
                  <Card key={purchase.ventaId} className="card mb-3 mt-4">
                    <div className="card-body">
                      <div className="row">
                        <div className="text-center item-responsive">
                          {purchase.statusVentaId === 1 && (
                            <span className="fw-bold">
                              <strong>Estado de la venta: </strong>En proceso
                            </span>
                          )}
                          {purchase.statusVentaId === 2 && (
                            <span className="fw-bold">
                              <strong>Estado de la venta: </strong>En camino
                            </span>
                          )}
                          {purchase.statusVentaId === 3 && (
                            <span className="fw-bold">
                              <strong>Estado de la venta: </strong>Entregado
                            </span>
                          )}
                          {purchase.statusVentaId === 4 && (
                            <span className="fw-bold">
                              <strong>Estado de la venta: </strong>En espera de
                              recolección en sucursal
                            </span>
                          )}
                          {purchase.statusVentaId === 5 && (
                            <span className="text-danger fw-bold">
                              <strong>Estado de la venta: </strong>Cancelada
                            </span>
                          )}
                        </div>
                        <div className="col-md-2 item-center">
                          <img
                            src={
                              purchase.detalleVenta &&
                              purchase.detalleVenta.length > 0
                                ? purchase.detalleVenta[0].imagen
                                : ""
                            }
                            className="img-fluid img-purchase"
                            alt={
                              purchase.detalleVenta &&
                              purchase.detalleVenta.length > 0
                                ? purchase.detalleVenta[0].producto
                                : ""
                            }
                          />
                        </div>
                        <div className="col-md-7 row ml-1 purchase-products">
                          <h4 className="text-info mt-2 item-no-responsive">
                            <strong>Productos: </strong>
                            {purchase.detalleVenta
                              .map((detalle) => detalle.producto)
                              .join(", ")}
                          </h4>
                          <span>
                            <strong>Folio: </strong>
                            {purchase.folio}
                          </span>
                          <span>
                            Cantidad de productos: {purchase.cantidad}
                          </span>
                          <span>Total: ${purchase.total}</span>
                          <div className="cont-options">
                            <span className="text-muted">
                              Comprado el{" "}
                              <strong>
                                {new Date(purchase.fecha).toLocaleDateString()}
                              </strong>
                            </span>
                          </div>
                          <div className="row item-responsive">
                            <div className="cont-cant d-flex align-items-center justify-content-center">
                              <button
                                className="btn btn-primary my-4"
                                onClick={() =>
                                  openModal(purchase, purchase.ventaId)
                                }
                              >
                                Ver detalle
                              </button>
                            </div>
                            {(purchase.statusVentaId === 1 ||
                              purchase.statusVentaId === 4) && (
                              <div className="cont-cant d-flex align-items-center justify-content-center">
                                <button
                                  className="btn btn-danger"
                                  onClick={() =>
                                    openCancelModal(purchase.folio)
                                  }
                                >
                                  Cancelar compra
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-3 aling-center-cont item-no-responsive">
                          <div className="row">
                            <div className="text-center">
                              {purchase.statusVentaId === 1 && (
                                <span className="fw-bold">
                                  <strong>Estado de la venta: </strong>En
                                  proceso
                                </span>
                              )}
                              {purchase.statusVentaId === 2 && (
                                <span className="fw-bold">
                                  <strong>Estado de la venta: </strong>En camino
                                </span>
                              )}
                              {purchase.statusVentaId === 3 && (
                                <span className="fw-bold">
                                  <strong>Estado de la venta: </strong>Entregado
                                </span>
                              )}
                              {purchase.statusVentaId === 4 && (
                                <span className="fw-bold">
                                  <strong>Estado de la venta: </strong>En espera
                                  de recolección en sucursal
                                </span>
                              )}
                              {purchase.statusVentaId === 5 && (
                                <span className="text-danger fw-bold">
                                  <strong>Estado de la venta: </strong>Cancelada
                                </span>
                              )}
                            </div>
                            <div className="cont-cant d-flex align-items-center justify-content-center">
                              <button
                                className="btn-primary my-4"
                                onClick={() =>
                                  openModal(purchase, purchase.ventaId)
                                }
                              >
                                Ver detalle
                              </button>
                            </div>
                            {(purchase.statusVentaId === 1 ||
                              purchase.statusVentaId === 4) && (
                              <div className="cont-cant d-flex align-items-center justify-content-center">
                                <button
                                  className="btn-danger"
                                  onClick={() =>
                                    openCancelModal(purchase.folio)
                                  }
                                >
                                  Cancelar compra
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
            )
          ) : (
            <div className="d-flex ml-4 text-center">
              <h2 className="text-center">No hay compras aun</h2>
            </div>
          )}
        </div>
      </div>

      {selectedPurchase && venta && (
        <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg">
          <Modal.Header closeButton className="bg-primary-c">
            <Modal.Title>Detalle de la compra</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-sm-8">
                {venta.domicilioId && venta.domicilioId !== null ? (
                  <p>
                    <strong>Metodo de entrega: </strong>Envio a domicilio
                  </p>
                ) : (
                  <p>
                    <strong>Metodo de entrega: </strong>Recoleccion en socursal
                  </p>
                )}

                <p>Total de productos comprados ({venta.cantidad})</p>
                <p className="text-secondary fw-bold">
                  Fecha de compra: {venta.fecha.split("T")[0]}
                </p>
              </div>
              <div className="col-sm-4 item-center item-no-responsive">
                <MdLocalMall size={80} color="#c9c9c9" />
              </div>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedPurchase.detalleVenta.map((detalle) => (
                  <tr key={detalle.detalleVentaId}>
                    <td>
                      <img
                        src={detalle.imagen}
                        alt={detalle.producto}
                        style={{ borderRadius: "100px", height: "80px" }}
                      />
                    </td>
                    <td>{detalle.producto}</td>
                    <td>${detalle.precio}</td>
                    <td className="text-center">{detalle.cantidad}</td>
                    <td>${detalle.totalDV}</td>
                  </tr>
                ))}
              </tbody>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="fw-bold text-danger">Total:</td>
                  <td className="fw-bold text-danger">$ {venta.total}</td>
                </tr>
              </tbody>
            </table>
            <span className="text-muted">Folio: {venta.folio}</span>
          </Modal.Body>
        </Modal>
      )}

      {folioVenta && folioVenta !== null && (
        <Modal show={cancelModalOpen} onHide={closeCancelModal} centered>
          <Modal.Header closeButton className="bg-primary-c">
            <Modal.Title>Cancelación de compra</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{ reason: "" }}
              onSubmit={(values) => {
                // Manejar el motivo de la cancelación aquí
                // Puedes enviar el motivo al backend si es necesario
                handleCancelPurchase();
              }}
            >
              <Form>
                <div className="form-group">
                  <span className="text-muted">Folio: {folioVenta}</span><br/>
                  <label htmlFor="reason">Motivo de la cancelación:</label>
                  <Field
                    as="textarea" // Utiliza la etiqueta textarea
                    id="reason"
                    name="reason"
                    className="form-control"
                    value={cancelReason}
                    onChange={handleCancelReasonChange}
                    style={{ height: "100px" }}
                  />
                </div>
                <button type="submit" className="btn btn-danger">
                  Confirmar cancelación
                </button>
              </Form>
            </Formik>
          </Modal.Body>
        </Modal>
      )}

      {/* Agregar paginación */}
      <ul className="pagination text-center mt-4">
        {Array.from({ length: totalPages }).map((_, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
          >
            <button onClick={() => paginate(index + 1)} className="page-link">
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default PurchaseHistory;
