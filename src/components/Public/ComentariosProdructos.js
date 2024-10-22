import React, { useState } from "react";

const ComentariosProductos = () => {
    const [showDescription, setShowDescription] = useState(true);

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };
    return (
    <>
    <div className="row mt-4">
              <nav className="w-100">
                <div className="nav nav-tabs text-center" id="product-tab" role="tablist">
                  <h2 className="text-primary">Comentarios</h2>
                </div>
              </nav>
              <div>
                <button
                  className="btn btn-outline-info"
                  onClick={toggleDescription}
                >
                  {showDescription
                    ? "Ocultar comentarios"
                    : "Mostrar comentario"}
                </button>
                <div
                  className={`tab-content p-3 ${
                    showDescription ? "" : "d-none"
                  }`}
                  id="nav-tabContent"
                >
                  <div
                    className="tab-pane fade active show"
                    id="product-desc"
                    role="tabpanel"
                    aria-labelledby="product-desc-tab"
                  >
                    {showDescription && (
                      <>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Morbi vitae condimentum erat. Vestibulum ante
                          ipsum primis in faucibus orci luctus et ultrices
                          posuere cubilia Curae; Sed posuere, purus at efficitur
                          hendrerit, augue elit lacinia arcu, a eleifend sem
                          elit et nunc. Sed rutrum vestibulum est, sit amet
                          cursus dolor fermentum vel.
                        </p>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Morbi vitae condimentum erat. Vestibulum ante
                          ipsum primis in faucibus orci luctus et ultrices
                          posuere cubilia Curae; Sed posuere, purus at efficitur
                          hendrerit, augue elit lacinia arcu, a eleifend sem
                          elit et nunc. Sed rutrum vestibulum est, sit amet
                          cursus dolor fermentum vel.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
    </>
  );
};

export default ComentariosProductos;