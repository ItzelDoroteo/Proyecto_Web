import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import {
  MdAdd,
  MdRemove,
  MdDelete,
  MdClose,
  MdShoppingCartCheckout,
} from "react-icons/md";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";

const CartModal = ({ isOpen, onClose }) => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Calcular el total del carrito al cargar
    const cartTotal = cart.reduce(
      (acc, item) => acc + item.precioFinal * item.cantidad,
      0
    );
    setTotal(cartTotal.toFixed(2));
  }, [cart]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".carrito")) {
        onClose(); // Cerrar el modal si se hace clic fuera de él
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const increaseQuantity = (productId) => {
    addToCart(
      cart.find((item) => item.productoId === productId),
      1
    );
  };

  const decreaseQuantity = (productId) => {
    const currentItem = cart.find((item) => item.productoId === productId);
    if (currentItem.cantidad > 1) {
      addToCart(currentItem, -1);
    } else {
      removeFromCart(productId);
    }
  };

  const handleDelete = (productId) => {
    removeFromCart(productId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-cart"
      overlayClassName="overlay-cart"
      shouldCloseOnOverlayClick={true}
    >
      <div className="carrito">
        <div className="header-carrito">
          <h5 className="text-uppercase fw-bold">Tu carrito</h5>
          <button className="close-button" onClick={onClose}>
            <MdClose size={25} />
          </button>
        </div>

        <div className="carrito-items">
          <div className="items-container"></div>
          {cart && cart.length > 0 ? (
            cart.map((item, index) => (
              <div key={index}>
                <div className="carrito-item">
                  <img src={item.imagen} width="80px" alt="" />
                  <div className="carrito-item-detalles">
                    <span className="carrito-item-titulo">{item.nombre}</span>
                    <div className="selector-cantidad align-icons">
                      <span
                        className="selector-item"
                        onClick={() => decreaseQuantity(item.productoId)}
                      >
                        <MdRemove className="restar-cantidad" size={25} />
                      </span>
                      <input
                        type="text"
                        value={item.cantidad}
                        className="carrito-item-cantidad"
                        disabled
                      />
                      <span
                        className="selector-item"
                        onClick={() => increaseQuantity(item.productoId)}
                      >
                        <MdAdd className="sumar-cantidad" size={25} />
                      </span>
                    </div>
                    <span className="carrito-item-precio">
                      ${(item.precioFinal * item.cantidad).toFixed(2)}
                    </span>
                  </div>
                  <button
                    className="btn-eliminar aling-icon"
                    onClick={() => handleDelete(item.productoId)}
                  >
                    <MdDelete size={25} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="row  text-center">
              <p className="text-muted mt-4">Tu carrito está vacío.</p>
            </div>
          )}
        </div>
        <div className="carrito-total">
          <div className="fila">
            <strong className="text-uppercase">Total</strong>
            <span className="carrito-precio-total">${total}</span>
          </div>
          <Link to="/checkup" className="btn-pagar">
            Ver carrito <MdShoppingCartCheckout size={25} className="ml-4" />
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default CartModal;
