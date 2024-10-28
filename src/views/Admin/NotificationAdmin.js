import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { MdDrafts, MdUnsubscribe } from "react-icons/md";
import axios from "axios";

const NotificationAdmin = ({ title }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Función para obtener los datos de la API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/notification/1"
        );
        setData(response.data); // Guardar los datos en el estado
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData(); // Llamar a la función para obtener datos al cargar el componente
  }, []);

  const markNotificationAsRead = (notificationId) => {
    axios
      .put(
        `http://localhost:5000/users/notificaciones/${notificationId}`
      )
      .then((response) => {})
      .catch((error) => console.error(error));
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>
                {title} |<small> Notificaciones</small>
              </h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">{title}</a>
                </li>
                <li className="breadcrumb-item active">Notificaciones</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {data.map((item) => (
              <div key={item.notificationId} className="col-md-12 mb-4">
                <Card className="custom-card">
                  <Card.Header as="h5" className="card-header bg-info-i">
                    {item.evento}
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
                            {new Date(item.fecha).toLocaleDateString()}
                          </Card.Text>
                          <Card.Text>
                            <strong>Hora:</strong>{" "}
                            {new Date(item.fecha).toLocaleTimeString()}
                          </Card.Text>
                        </div>

                        <Card.Text>{item.descripcion}</Card.Text>
                      </div>
                      {item.estado === "No leído" && (
                        <div className="row">
                          <div className="d-flex justify-content-end cont-not">
                            <button
                              className="btn-info fw-bold"
                              onClick={() =>
                                markNotificationAsRead(item.notificationId)
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
      </section>
    </div>
  );
};

export default NotificationAdmin;
