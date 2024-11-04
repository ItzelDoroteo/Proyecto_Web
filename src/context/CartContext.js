import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { jwtDecode } from "jwt-decode";

export const CartContext = createContext();

const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { token } = useAuth();
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setDecodedToken(decoded);
      fetchCartFromAPI(decoded.customerId);
    }
  }, [token]);

  const fetchCartFromAPI = async (customerId) => {
    try {
      const response = await axios.get(`http://localhost:5000/cart/${customerId}`);
      const cartData = response.data.map((item) => ({
        productoId: item.productoId,
        nombre: item.producto,
        precioFinal: item.precio,
        IVA: item.IVA,
        cantidad: item.cantidad,
        imagen: item.imagen,
      }));
      setCart(cartData.length > 0 ? cartData : []);
      localStorage.setItem("cart", JSON.stringify(cartData));
    } catch (error) {
      console.error("Error fetching cart from API:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product, quantity) => {
    try {
      const existingProduct = cart.find(item => item.productoId === product.productoId);
      
      if (existingProduct) {
        const newQuantity = existingProduct.cantidad + quantity;
        if (newQuantity <= product.existencia) {
          const updatedCart = cart.map(item =>
            item.productoId === product.productoId ? { ...item, cantidad: newQuantity } : item
          );
          setCart(updatedCart);
          await updateCartItem(product.productoId, decodedToken.customerId, newQuantity);
        } else {
          console.log("No se puede agregar más cantidad. La existencia máxima es alcanzada.");
        }
      } else {
        if (quantity <= product.existencia) {
          const newProduct = { ...product, cantidad: quantity };
          const newCart = [...cart, newProduct];
          setCart(newCart);
          await addCartItem(newProduct);
        } else {
          console.log("No se puede agregar más cantidad. La existencia máxima es alcanzada.");
        }
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const addCartItem = async (newProduct) => {
    try {
      const newCartItem = {
        productoId: newProduct.productoId,
        producto: newProduct.nombre,
        precio: newProduct.precioFinal,
        IVA: newProduct.IVA,
        cantidad: newProduct.cantidad,
        imagen: newProduct.imagen,
        customerId: decodedToken.customerId,
      };
      await axios.post("http://localhost:5000/cart/", newCartItem);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const updateCartItem = async (productId, customerId, quantity) => {
    try {
      await axios.put(`http://localhost:5000/cart/${customerId}/${productId}`, {
        cantidad: quantity,
      });
    } catch (error) {
      console.error("Error updating item in cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const updatedCart = cart.filter((item) => item.productoId !== productId);
      setCart(updatedCart);
      await deleteCartItem(productId);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const deleteCartItem = async (productId) => {
    try {
      const cartDelete = {
        productoId: productId,
        customerId: decodedToken.customerId,
      };
      await axios.delete("http://localhost:5000/cart/", { data: cartDelete });
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`http://localhost:5000/cart/clear/${decodedToken.customerId}`);
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
