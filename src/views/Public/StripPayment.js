import React from 'react';
import axios from 'axios';

const CheckoutButton = () => {
  const handleClick = async (event) => {
    // Llama a tu backend para crear una sesión de Checkout
    const { data } = await axios.post('http://localhost:5000/ventas/create-checkout-session', {
      amount: 5000, // Monto en centavos (por ejemplo, 50.00 USD)
    });

    // Redirige al usuario a la página de Stripe Checkout
    const stripe = window.Stripe('pk_test_51Pf8IA2NI1ZNadeOLivsZnTK9wtGno4CEo8viraLEc0NBdl9CFbhubTvVVuo7gpznAfJt6mqR10IhaeVQQNutEQ500WkPoYuht'); // Usa tu clave pública de Stripe
    const { error } = await stripe.redirectToCheckout({ sessionId: data.id });

    if (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleClick} style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px" }}>
      Pagar con Stripe
    </button>
  );
};

export default CheckoutButton;
