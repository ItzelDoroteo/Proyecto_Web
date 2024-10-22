import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Card } from "react-bootstrap";
import PageTitle from "../../components/Public/PageTitle";
import { MdAdd, MdUpdate } from "react-icons/md";

const ProfileAddress = () => {
  const { token } = useAuth();
  const [decodedToken, setDecodedToken] = useState(null);
  const [domicilios, setDomicilios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setDecodedToken(decoded);
    }
  }, [token]);

  useEffect(() => {
    if (decodedToken && decodedToken.customerId) {
      fetch(
        `http://localhost:5000/address/get-domicilio/${decodedToken.customerId}`
      )
        .then((response) => response.json())
        .then((data) => {
          setDomicilios(data);
          setIsLoading(false);
        })
        .catch((error) => console.error("Error fetching domicilios:", error));
    }
  }, [decodedToken]);

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (domicilios.length === 0) {
    return (
      <main>
        <p>No has agregado ningún domicilio.</p>
        <Link to={"/new-address"}>Agregar domicilio</Link>
      </main>
    );
  }

  return (
    <div className="section row3 mt-4">
      <PageTitle title="Chucherias & Regalos | Perfil de usuario" />

      <h3 className="title-pag fw-bold text-uppercase">
        Domicilios registrados
      </h3>
      <hr className="hr-primary" />
      <div className="hoc section clear m-5">
        <div className="row">
          <div className="col-md-12">
            <div className="mt-4">
              <div className="mb-4">
                <div className="col-md-11 d-flex justify-content-end admin-address">
                  <Link to="/new-address" className="btn btn-primary">
                    Agregar <MdAdd size={25} />
                  </Link>
                </div>
              </div>
              {domicilios.map((domicilio) => (
                <div key={domicilio.DomicilioId} className="col-md-12 mb-4">
                  <Card className="custom-card">
                    <Card.Header as="h5" className="card-header bg-info-i">
                      {domicilio.Nombre}
                    </Card.Header>
                    <Card.Body>
                      <div className="row col-md-12">
                        <div className="col-md-3 text-center">
                          <img
                            src="/images/paqueteria-transformed.jpg"
                            alt="Recuperar contraseña"
                            className="img-fluid mt-4"
                          />
                        </div>
                        <div className="col-md-8 mt-4 ml-4">
                          <Card.Text>
                            <strong>Ciudad:</strong> {domicilio.Ciudad},{" "}
                            {domicilio.Estado}
                          </Card.Text>
                          <Card.Text>
                            <strong>Código Postal:</strong> {domicilio.CP}
                          </Card.Text>
                          <Card.Text>
                            <strong>Telefono de contacto:</strong>{" "}
                            {domicilio.Telefono}
                          </Card.Text>
                          <Card.Text>{domicilio.Referencias}</Card.Text>
                        </div>
                        <div className="row">
                          <div className="d-flex justify-content-end">
                            <Link
                              to={`/update-address/${domicilio.DomicilioId}`}
                            >
                              <button className="btn-warning fw-bold btn-update-address">
                                Actualizar <MdUpdate size={25} />
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAddress;
