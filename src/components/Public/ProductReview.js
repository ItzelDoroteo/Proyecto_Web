import React, { useEffect, useState } from "react";
import { Fieldset } from "primereact/fieldset";
import { Card } from "primereact/card";
import { Rating } from "primereact/rating";
import { Avatar } from "primereact/avatar";
import { Paginator } from "primereact/paginator";
import { Message } from "primereact/message";

const getInitials = (name) => {
  if (!name) return "";
  const nameParts = name.split(" ");
  const initials = nameParts.map((part) => part[0]).join("");
  return initials.substring(0, 2).toUpperCase();
};

const ProductReview = ({ createdAt, reviewText, rating, Usuario }) => {
  const userName = `${Usuario.nombre} ${Usuario.aPaterno} ${Usuario.aMaterno}`;
  const initials = getInitials(userName);
  const formattedDate = new Date(createdAt).toLocaleDateString();
  return (
    <Card className="p-mb-3">
      <div className="p-grid p-align-center">
        <div className="p-col-fixed">
          {Usuario.imagen ? (
            <div className="d-flex align-items-center">
              <Avatar image={Usuario.imagen} shape="circle" size="large" />
              <span className="text-muted ml-2">{formattedDate}</span>
            </div>
          ) : (
            <Avatar
              label={initials}
              size="large"
              style={{
                backgroundColor:
                  Usuario.sexo === "masculino" ? "#2196F3" : "#9c27b0",
                color: "#ffffff",
              }}
              shape="circle"
            />
          )}
        </div>

        <div className="p-col">
          <h4>{userName}</h4>
          <Rating value={rating} readOnly stars={5} cancel={false} />
          <p>{reviewText}</p>
        </div>
      </div>
    </Card>
  );
};

const ReviewsSection = ({ ProductReviews }) => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(3); // Número de reseñas por página

  useEffect(() => {
    if (ProductReviews) {
      setReviews(ProductReviews);
    }
  }, [ProductReviews]);

  const handlePageChange = (event) => {
    setCurrentPage(event.page + 1); // La página en Paginator es base cero
  };

  // Calcular los índices de las reseñas a mostrar
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  return (
    <div className="d-flex flex-column align-items-center">
      <Fieldset
        legend="Reseñas del producto"
        toggleable
        style={{ width: "92%" }}
      >
        {currentReviews.length > 0 ? (
          <>
            {currentReviews.map((review, index) => (
              <ProductReview key={index} {...review} />
            ))}
            <Paginator
              first={indexOfFirstReview}
              rows={reviewsPerPage}
              totalRecords={reviews.length}
              onPageChange={handlePageChange}
              rowsPerPageOptions={[3]} // Opciones de número de reseñas por página
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            />
          </>
        ) : (
          <div className="item-center">
            <Message
              severity="info"
              text="Este producto aún no cuenta con reseñas"
            />
          </div>
        )}
      </Fieldset>
    </div>
  );
};

export default ReviewsSection;
