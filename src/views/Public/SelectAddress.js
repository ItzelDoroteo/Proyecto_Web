import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../components/Public/PageTitle";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { MdHome, MdStore } from "react-icons/md";
import { RadioButton } from "primereact/radiobutton";
import { Card } from "react-bootstrap";
import { Button } from "primereact/button";

const SelectAddress = () => {
  const [sucursales, setSucursales] = useState([]);
  const [domicilioS, setDomicilios] = useState([]);
  const [mostrarSucursales, setMostrarSucursales] = useState(false);
  const [mostrarDomicilios, setMostrarDomicilios] = useState(false);
  const [envio, setEnvio] = useState(null); // Nuevo estado para almacenar el CP seleccionado
  const { token } = useAuth();
  const [decodedToken, setDecodedToken] = useState(null);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(false); // Nuevo estado para rastrear la selección de dirección
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(false); // Nuevo estado para rastrear la selección de sucursal
  const [selectedSucursalId, setSelectedSucursalId] = useState(null);
  const [selectedDomicilioId, setSelectedDomicilioId] = useState(null);

  const navigate = useNavigate(); // Importa useHistory para redireccionar

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setDecodedToken(decoded);
    }
  }, [token]);

  useEffect(() => {
    if (decodedToken && decodedToken.customerId) {
      const UserId = decodedToken.customerId;

      // Obtener sucursales
      fetch("http://localhost:5000/address/get-sucursal")
        .then((response) => response.json())
        .then((data) => setSucursales(data))
        .catch((error) =>
          console.error("Error fetching sucursales data:", error)
        );

      // Obtener domicilios
      fetch(`http://localhost:5000/address/get-domicilio/${UserId}`)
        .then((response) => response.json())
        .then((data) => setDomicilios(data))
        .catch((error) =>
          console.error("Error fetching domicilios data:", error)
        );
    }
  }, [decodedToken]);

  const { cart } = useContext(CartContext);
  const totalItemsEnCarrito = cart.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  // Calcular el total del IVA sumando el IVA de cada producto en el carrito
  const totalIVA = cart.reduce(
    (total, item) => total + item.IVA * item.cantidad,
    0
  );

  const handleSelectDomicilio = async (event) => {
    try {
      const selectedCPValue = event.target.dataset.cp;
      console.log(selectedCPValue);
      const response = await fetch(
        `http://localhost:5000/address/get-colonias/${selectedCPValue}`
      );
      if (!response.ok) {
        throw new Error(
          `Error al obtener las colonias: ${response.statusText}`
        );
      }
      const data = await response.json();
      const envio = data[0].envio;
      setEnvio(envio); // Actualizar el estado del CP seleccionado
      setSelectedDomicilioId(event.target.value);
      setDireccionSeleccionada(true); // Actualizar el estado cuando se seleccione una dirección
    } catch (e) {
      console.log("Error al obtener el CP del usuario");
    }
  };

  const handleChangeEnvio = (e) => {
    if (e.value === "domicilio") {
      setMostrarDomicilios(true);
      setMostrarSucursales(false); // Ocultar las sucursales cuando se selecciona domicilio
      setSucursalSeleccionada(false); // Reiniciar el estado de selección de sucursal
    } else if (e.value === "sucursal") {
      setMostrarSucursales(true);
      setMostrarDomicilios(false); // Ocultar los domicilios cuando se selecciona sucursal
      setDireccionSeleccionada(false); // Reiniciar el estado de selección de dirección
      setEnvio(null);
    }
  };

  const handleSelectSucursal = (event) => {
    setSelectedSucursalId(event.target.value);
    setSucursalSeleccionada(true); // Actualizar el estado cuando se seleccione una sucursal
  };

  const handleProceedToPayment = () => {
    if (direccionSeleccionada || sucursalSeleccionada) {
      navigate("/select-payment"); // Redirigir solo si se ha seleccionado una dirección
    } else {
      toast.warning(
        "Por favor, seleccione una dirección antes de proceder al pago."
      );
    }
  };

  const productosEnCarrito = cart.map((item) => ({
    productoId: item.productoId, // Suponiendo que tienes un campo productId en tus objetos de producto en el carrito
    producto: item.nombre, // Suponiendo que tienes un campo nombre en tus objetos de producto en el carrito
    precio: parseFloat(item.precioFinal).toFixed(2), // Precio final del producto en el carrito
    cantidad: item.cantidad, // Cantidad del producto en el carrito
    totalDV: (parseFloat(item.precioFinal) * item.cantidad).toFixed(2), // Total del detalle de venta para este producto
    IVA: item.IVA,
    imagen: item.imagen,
  }));

  const Venta = {
    cantidad: totalItemsEnCarrito, // Cantidad total de productos
    total: (
      Object.values(cart).reduce(
        (total, item) => total + item.precioFinal * item.cantidad,
        0
      ) + parseFloat(envio)
    ).toFixed(2), // Total a pagar
    totalProductos: Object.values(cart)
      .reduce((total, item) => total + item.precioFinal * item.cantidad, 0)
      .toFixed(2), // Total de productos
    totalEnvio: parseFloat(envio).toFixed(2), // Total del envío
    totalIVA: totalIVA.toFixed(2), // Total del IVA
    sucursalesId: sucursalSeleccionada ? selectedSucursalId : null,
    domicilioId: direccionSeleccionada ? selectedDomicilioId : null,
    productos: productosEnCarrito,
  };

  // Convertir el objeto Venta a una cadena JSON
  const ventaJSON = JSON.stringify(Venta);

  // Guardar la cadena JSON en el localStorage
  localStorage.setItem("Venta", ventaJSON);

  const combinedHandleChange = (e) => {
    setEnvio(e.value); // Primera función
    handleChangeEnvio(e); // Segunda función
  };

  return (
    <main>
      <PageTitle title="Chucherias & Regalos | Carrito" />
      <div className="ml-4 mr-4">
        <div className="d-flex mr-4 ml-4">
          <h3>Elige la forma de entrega</h3>
        </div>

        <hr className="hr-primary" />
      </div>

      <div className="row">
        <div className="col-lg-8 select-address">
          <Card className="card mb-3 mt-4">
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex align-items-center">
                    <RadioButton
                      inputId="domicilio"
                      name="envio"
                      value="domicilio"
                      onChange={combinedHandleChange}
                      checked={envio === "domicilio"}
                    />
                    <label htmlFor="domicilio" className="ml-2 fs-4">
                      <MdHome size={35} color="#9087b1" className="me-2" />
                      Enviar a domicilio
                    </label>
                  </div>
                </div>
              </div>

              {mostrarDomicilios && (
                <div className="row mt-2">
                  {domicilioS.length > 0 ? (
                    domicilioS.map((domicilio, index) => (
                      <div
                        className="col-12 col-md-6 col-lg-4 mb-4"
                        key={index}
                      >
                        <Card className="card h-100">
                          <div className="card-body d-flex flex-column">
                            <div className="row">
                              <div className="col-2 item-center">
                                <input
                                  type="radio"
                                  name="domicilio"
                                  value={domicilio.DomicilioId}
                                  className="form-check-input"
                                  data-cp={domicilio.CP}
                                  onChange={handleSelectDomicilio}
                                />
                              </div>
                              <div className="col-10">
                                <h5 className="card-title fw-bold">
                                  {domicilio.Nombre}
                                </h5>
                              </div>
                            </div>
                            <div className="row mt-2">
                              <div className="col-12">
                                <span>{domicilio.Calle}</span>
                                <br />
                                <span>{domicilio.Telefono}</span>
                                <br />
                                <span>{domicilio.Referencias}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))
                  ) : (
                    <div className="row mt-4 text-center">
                      <p className="text-muted mt-2">
                        Aún no tiene domicilios registrados, por favor añada
                        uno.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="  mt-3">
                <Link to="/new-address" className="text-primary fw-bold">
                  Agregar nueva dirección
                </Link>
              </div>
            </div>
          </Card>

          <Card className="card mb-3 mt-4">
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex align-items-center">
                    <RadioButton
                      inputId="sucursal"
                      name="envio"
                      value="sucursal"
                      onChange={combinedHandleChange}
                      checked={envio === "sucursal"}
                    />
                    <label htmlFor="sucursal" className="ml-2 fs-4">
                      <MdStore size={35} color="#9087b1" className="me-2" />
                      Recoger en alguna de nuestras sucursales
                    </label>
                    {/* <input
                      type="radio"
                      name="envio"
                      value="sucursal"
                      className="form-check-input"
                      onChange={handleChangeEnvio}
                    />
                    <h5
                      className="card-title fw-bold ms-2"
                      style={{ fontSize: "20px" }}
                    >
                      <MdStore size={35} color="#9087b1" className="me-2" />
                      Recoger en alguna de nuestras sucursales
                    </h5> */}
                  </div>
                </div>
              </div>
              {mostrarSucursales && (
                <div className="row mt-2">
                  {sucursales.length > 0 ? (
                    sucursales.map((sucursal, index) => (
                      <div
                        className="col-12 col-md-6 col-lg-4 mb-4"
                        key={index}
                      >
                        <Card className="card h-100">
                          <div className="card-body d-flex flex-column">
                            <div className="row">
                              <div className="col-2 item-center">
                                <input
                                  type="radio"
                                  name="sucursal"
                                  value={sucursal.SucursalId}
                                  className="form-check-input"
                                  onChange={handleSelectSucursal}
                                />
                              </div>
                              <div className="col-10">
                                <h5 className="card-title fw-bold">
                                  {sucursal.Nombre}
                                </h5>
                              </div>
                            </div>
                            <div className="row mt-2">
                              <div className="col-12">
                                <span>{sucursal.Calle}</span>
                                <br />
                                <span>{sucursal.Telefono}</span>
                                <br />
                                <span>{sucursal.Horario}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))
                  ) : (
                    <div className="row mt-4 text-center">
                      <p className="text-muted mt-2">
                        No hay sucursales disponibles.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {totalItemsEnCarrito > 0 && (
          <div className="col-lg-4">
            <Card className="card mt-4">
              <div className="card-body">
                <h5 className="text-center text-uppercase fw-bold">
                  Información de compra
                </h5>
                <hr className="hr-primary-cont" />
                <table className="table table-borderless">
                  <tbody>
                    {Object.values(cart).map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.nombre} ({item.cantidad})
                        </td>
                        <td className="text-right">
                          $ {(item.precioFinal * item.cantidad).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>IVA incluido</td>
                      <td className="text-right">${totalIVA.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Total productos ({totalItemsEnCarrito})</strong>
                      </td>
                      <td className="text-right">
                        <strong>
                          ${" "}
                          {Object.values(cart)
                            .reduce(
                              (total, item) =>
                                total + item.precioFinal * item.cantidad,
                              0
                            )
                            .toFixed(2)}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Envio</strong>
                      </td>
                      <td className="text-right">
                        {mostrarDomicilios ? (
                          envio !== 0 ? (
                            <strong>${envio}</strong>
                          ) : (
                            <strong>$ 0.00</strong>
                          )
                        ) : mostrarSucursales ? (
                          <strong>No aplica</strong        >
                        ) : (
                          <span className="text-muted">
                            Elija la forma de entrega
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Total a pagar</strong>
                      </td>
                      <td className="text-right">
                        <strong>
                          ${" "}
                          {(
                            Object.values(cart).reduce(
                              (total, item) =>
                                total + item.precioFinal * item.cantidad,
                              0
                            ) + parseFloat(envio)
                          ).toFixed(2)}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-center mt-4">
                  <Button
                    label="Proceder a pago"
                    severity="success"
                    icon="pi pi-check"
                    style={{ color: "white", borderRadius: 10 }}
                    onClick={handleProceedToPayment}
                    disabled={!direccionSeleccionada && !sucursalSeleccionada}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
};

export default SelectAddress;
