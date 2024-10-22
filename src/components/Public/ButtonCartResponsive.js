import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { MdShoppingCart } from "react-icons/md";

function ButtonCartResponsive() {
    const { cart } = useContext(CartContext);
    const totalItemsEnCarrito = cart.reduce(
      (total, item) => total + item.cantidad,
      0
    );
  
  return (
    <>
      <Link
  className="carrito-button"
  to="/checkup"
>
  <MdShoppingCart size={40} />
  {totalItemsEnCarrito > 0 && (
    <span
      className="text-center"
      style={{
        position: 'absolute',
        top: '5px', // Ajusta este valor para pantallas grandes
        right: '5px', // Ajusta este valor para pantallas grandes
        backgroundColor: 'red',
        color: 'white',
        borderRadius: '50%',
        padding: '5px',
        fontSize: '14px',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {totalItemsEnCarrito}
    </span>
  )}
</Link>


    </>
  );
}

export default ButtonCartResponsive;
