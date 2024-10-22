import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";
import { Card } from "react-bootstrap";
import PageTitle from "../../components/Public/PageTitle";
import { MdDrafts, MdUnsubscribe } from "react-icons/md";
import axios from "axios";

const Notifications = () => {
  const { token } = useAuth();
  const [decodedToken, setDecodedToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setDecodedToken(decoded);
    }
  }, [token]);

  useEffect(() => {
    if (decodedToken && decodedToken.customerId) {
      fetchNotifications(decodedToken.customerId);
    }
  }, [decodedToken]);

  const fetchNotifications = (customerId) => {
    axios
      .get(
        `http://localhost:5000/users/getAllNotifications/${customerId}`
      )
      .then((response) => {
        setNotifications(response.data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  };

  const markNotificationAsRead = (notificationId) => {
    axios
      .put(
        `http://localhost:5000/users/notificaciones/${notificationId}`
      )
      .then((response) => {
        fetchNotifications(decodedToken.customerId);
      })
      .catch((error) => console.error(error));
  };

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (notifications.length === 0) {
    return (
      <main>
        <div className="d-flex ml-4 text-center">
              <h2 className="text-center">Su buzón está actualmente vacio</h2>
            </div>

            <hr className="hr-primary" />
            <div className="text-center">
              <MdUnsubscribe size={250} color="gray" />
            </div>
      </main>
    );
  }

  return (
    <main>
      <PageTitle title="Chucherias & Regalos | Perfil de usuario" />

      <h3 className="title-pag fw-bold text-uppercase">
        Notificaciones para: {decodedToken.nombre} {decodedToken.aPaterno}
      </h3>
      <hr className="hr-primary" />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="mt-1">
              {notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className="col-md-12 mb-4"
                >
                  <Card className="custom-card">
                    <Card.Header as="h5" className="card-header bg-info-i">
                      {notification.evento}
                    </Card.Header>
                    <Card.Body>
                      <div className="row col-md-12">
                        <div className="col-md-3 text-center">
                          <img
                            src="/images/email-mensaje.jpg"
                            alt="Recuperar contraseña"
                            className="img-fluid mt-4"
                          />
                        </div>
                        <div className="col-md-8 mt-4 ml-4">
                        <div className="d-flex justify-content-between mx-2">
                          <Card.Text>
                            <strong>Fecha:</strong>{" "}
                            {new Date(notification.fecha).toLocaleDateString()}
                          </Card.Text>
                          <Card.Text>
                            <strong>Hora:</strong>{" "}
                            {new Date(notification.fecha).toLocaleTimeString()}
                          </Card.Text>
                        </div>
                          <Card.Text>{notification.descripcion}</Card.Text>
                        </div>
                        {notification.estado === "No leído" && (
                          <div className="row">
                            <div className="d-flex justify-content-end cont-not">
                              <button
                                className="btn-info fw-bold card-notification"
                                onClick={() =>
                                  markNotificationAsRead(
                                    notification.notificationId
                                  )
                                }
                              >
                                Marcar como leido{" "}
                                <MdDrafts className="ml-4" size={25} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Notifications;
