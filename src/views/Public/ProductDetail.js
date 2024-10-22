import PageTitle from "../../components/Public/PageTitle";
import React, { useState, useEffect, useContext } from "react";
import ReviewsSection from "../../components/Public/ProductReview";
import { MdAdd, MdRemove } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CarruselProductos from "../../components/Public/CarruselProductos";
import { CartContext } from "../../context/CartContext";
import CartModal from "../../components/Public/CartModal";
import { Chip } from "primereact/chip";
import { Card } from "primereact/card";
import { Rating } from 'primereact/rating';
import { Tag } from "primereact/tag";
import { useAlert } from "../../context/AlertContext";
import { Message } from "primereact/message";
import { Button } from "primereact/button";

import LoadingSpinner from "../../components/Admin/LoadingSpinner";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const showAlert = useAlert()
  const [categories, setCategories] = useState([]);
  const { token } = useAuth();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false); // Estado para controlar la apertura/cierre del modal del carrito

  useEffect(() => {
    // Hacer la solicitud a la API para obtener los detalles del producto
    fetch(`http://localhost:5000/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) =>
        console.error("Error fetching product details:", error)
      );
  }, [id]);

  useEffect(() => {
    // Obtener categorías
    fetch("http://localhost:5000/products/categories/getAll")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  if (!product) {
    // Puedes mostrar un mensaje de carga mientras se obtienen los datos
    return <LoadingSpinner />;
  }

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (token) {
      addToCart(product, quantity);
      setIsCartModalOpen(true); // Abrir el modal del carrito después de agregar al carrito
    } else {
      showAlert("info", "Para la siguiente acción debe iniciar sesión.");
    }
  };

  const handleCloseCartModal = () => {
    setIsCartModalOpen(false); // Cerrar el modal del carrito
  };

  const getCategoryName = (categoriaId) => {
    const category = categories.find((cat) => cat.categoriaId === categoriaId);
    return category ? category.categoria : "Sin categoría";
  };

  return (
    <main>
      <PageTitle title="Chucherías & Regalos | Detalle del producto" />
      <h3 className="title-pag fw-bold text-uppercase">Detalle del producto</h3>
      <hr className="hr-primary my-3" /> {/* Ajustado el margen vertical */}
      <div className="section">
        <div className="row">
          <div className="col-lg-5 col-md-12 mb-4 product-detail-img">
            <img
              src={product.imagen}
              className="img-fluid rounded"
              alt="Producto"
            />
          </div>
          <div className="col-lg-7 col-md-12 mb-4">
            <Card className="card">
              <div className="card-body product-detail">
                <Tag
                  className="mr-2 mb-2"
                  icon="pi pi-tag"
                  severity="secondary"
                  value={getCategoryName(product.categoriaId)}
                  style={{ fontSize: 15 }}></Tag>
                <h2 className="title-product fw-bold">{product.nombre}</h2>
                <h2 className="text-price mt-2 fw-bold">
                  $ {product.precioFinal}
                </h2>

                <Chip label="IVA Incluido" icon="pi pi-tag" className="mb-2"/>

                <Rating value={product.ranking} readOnly stars={5} cancel={false} />

                <p className="card-text mt-4">{product.descripcion}</p>
                <div className="d-flex flex-column align-items-center mt-4">
                  <h5 className="text-center">
                    Disponible:
                    <strong className="text-primary ms-2">
                      {product.existencia} piezas
                    </strong>
                  </h5>
                  {product.existencia > 0 ? (
                    <>
                      <div className="d-flex flex-column align-items-center mt-4">
                        <h5>Cantidad</h5>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-outline-secondary me-2"
                            onClick={handleDecrement}
                          >
                            <MdRemove size={25} />
                          </button>
                          <span className="value">{quantity}</span>
                          <button
                            className="btn btn-outline-secondary ms-2"
                            onClick={handleIncrement}
                          >
                            <MdAdd size={25} />
                          </button>
                        </div>
                      </div>
                      <div className="text-center mt-4">
                        <Button 
                          label={quantity > product.existencia
                            ? "Cantidad no disponible"
                            : "Agregar a carrito"}
                          icon="pi pi-cart-arrow-down" 
                          style={{color:"white", borderRadius:10}}
                          onClick={handleAddToCart}
                          disabled={quantity > product.existencia}
                        />
                      </div>
                      {quantity && quantity > product.existencia && (
                        <Message severity="info" text="Productos en existencia insuficientes" className="mt-4" />
                      )}
                    </>
                  ) : (
                    <span className="text-center d-block mt-4">
                      Producto actualmente agotado
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
        <ReviewsSection ProductReviews={product.ProductReviews} />
        <CarruselProductos className="mb-4" />{" "}
        {/* Ajustado el margen inferior */}
      </div>
      <CartModal isOpen={isCartModalOpen} onClose={handleCloseCartModal} />
    </main>
  );
};

export default ProductDetail;
