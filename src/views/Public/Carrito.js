import React, { useContext, useRef, useState } from "react";
import {
  MdAdd,
  MdRemove,
  MdRemoveShoppingCart
} from "react-icons/md";
import { Link } from "react-router-dom";
import PageTitle from "../../components/Public/PageTitle";
import { CartContext } from "../../context/CartContext";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";

const Carrito = () => {
  const { cart, removeFromCart, addToCart, clearCart } =
    useContext(CartContext);
  const totalItemsEnCarrito = cart.reduce(
    (total, item) => total + item.cantidad,
    0
  );
  const totalIVA = cart.reduce(
    (total, item) => total + item.IVA * item.cantidad,
    0
  );

  // Referencia para el Toast
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);

  const handleIncrement = (product) => {
    addToCart(product, 1);
  };

  const handleDecrement = (product) => {
    const itemInCart = cart.find(
      (item) => item.productoId === product.productoId
    );
    if (itemInCart && itemInCart.cantidad > 1) {
      addToCart(product, -1);
    } else {
      removeFromCart(product.productoId);
    }
  };

  const vaciarCarrito = () => {
    if (!visible) {
      setVisible(true);
      toast.current.clear();
      toast.current.show({
        severity: "info",
        summary: "¿Desea vaciar su carrito?",
        sticky: true,
        content: (props) => (
          <div
            className="d-flex flex-column align-items-left"
            style={{ flex: "1" }}
          >
            <div className="d-flex align-items-center gap-2 mb-4">
              <Avatar image="/images/user.png" shape="circle" />
              <span className="fw-bold text-900 text-uppercase">
                {props.message.summary}
              </span>
            </div>
            <div className="text-center">
              <span className="font-bold text-900">
                Esta acción no se puede revertir.
              </span>
            </div>
            <div className="flex gap-2 item-center mt-3">
              <Button
                label="Confirmar"
                icon="pi pi-check"
                severity="danger"
                onClick={() => {
                  clearCart();
                  toast.current.clear();
                  setVisible(false);
                }}
                className="p-button-sm flex mr-4"
                style={{ borderRadius: 10, color: "white" }}
              />
              <Button
                label="Cancelar"
                icon="pi pi-times"
                severity="secondary"
                onClick={() => {
                  toast.current.clear();
                  setVisible(false);
                }}
                style={{ borderRadius: 10, color: "white" }}
                className="p-button-sm flex"
              />
            </div>
          </div>
        ),
      });
    }
  };

  return (
    <main>
      <PageTitle title="Chucherias & Regalos | Carrito" />
      <Toast
        ref={toast}
        position="bottom-center"
        onRemove={() => setVisible(false)}
      />
      <div className="ml-4 mr-4">
        {totalItemsEnCarrito > 0 ? (
          <>
            <div className="d-flex mr-4 ml-4 justify-content-between">
              <h5 className="text-uppercase fw-bold text-muted">
                Actualmente tiene: {totalItemsEnCarrito} producto(s) en su carrito
              </h5>
              <Button
                label="Vaciar carrito"
                severity="danger"
                icon="pi pi-trash"
                style={{ color: "white", borderRadius: 10 }}
                onClick={vaciarCarrito}
              />
            </div>
            <hr className="hr-primary" />
          </>
        ) : (
          <>
            <div className="d-flex ml-4 text-center">
              <h4 className="text-center">El carrito actualmente está vacío</h4>
            </div>
            <hr className="hr-primary" />
            <div className="text-center">
              <MdRemoveShoppingCart size={150} color="gray" />
            </div>
          </>
        )}
      </div>

      <div className="row">
        <div className="col-lg-8">
          {Object.values(cart).map((item, index) => (
            <Card key={index} className="card column-detail mb-3 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-5 row ml-4 item-carrito-responsive">
                    <h5
                      className="card-title fw-bold mr-2"
                      style={{ fontSize: "20px" }}
                    >
                      {item.nombre}
                    </h5>
                    <Button
                      label="Quitar del carrito"
                      severity="danger"
                      icon="pi pi-cart-minus"
                      style={{ color: "white", borderRadius: 10 }}
                      onClick={() => removeFromCart(item.productoId)}
                    />
                  </div>
                  <div className="col-md-2 item-center">
                    <img
                      src={item.imagen}
                      className="card-img-top img-catalog img-carrito-row"
                      alt={item.nombre}
                    />
                  </div>
                  <div className="col-md-5 row ml-1 item-no-responsive">
                    <h5
                      className="card-title fw-bold product-carrito"
                      style={{ fontSize: "20px" }}
                    >
                      {item.nombre}
                    </h5>
                    <div className="cont-options ml-4">
                      <Button
                        label="Quitar del carrito"
                        severity="danger"
                        icon="pi pi-cart-minus"
                        style={{ color: "white", borderRadius: 10 }}
                        onClick={() => removeFromCart(item.productoId)}
                      />
                    </div>
                  </div>
                  <div className="col-md-5 aling-center-cont">
                    <div className="d-flex flex-column align-items-center col-md-6">
                      <h5>Cantidad</h5>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary me-2"
                          onClick={() => handleDecrement(item)}
                        >
                          <MdRemove size={25} />
                        </button>
                        <span className="value">{item.cantidad}</span>
                        <button
                          className="btn btn-outline-secondary ms-2"
                          onClick={() => handleIncrement(item)}
                        >
                          <MdAdd size={25} />
                        </button>
                      </div>
                    </div>

                    <div className="d-flex text-center col-md-6">
                      <div className="d-flex text-center row">
                        <span>Precio por pieza:</span>
                        <h2>$ {item.precioFinal}</h2>
                        <span>IVA: ${item.IVA}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
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
                </table>
                <div className="text-center mt-4">
                  <Link to="/select-address">
                    <Button
                      label="Continuar con la compra"
                      severity="success"
                      icon="pi pi-check-circle"
                      style={{ color: "white", borderRadius: 10 }}
                    />
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
};

export default Carrito;
