import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { toast } from "react-toastify";

const LoginSchema = Yup.object().shape({
  correo: Yup.string().required("Correo es obligatorio"),
  contraseña: Yup.string().required("Contraseña es obligatoria"),
});

const Login = () => {
  const { setAdminAuthToken } = useAdminAuth();
  const navigate = useNavigate();
  const role = "Administrador"

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    const loginData = {
      ...values,
      role
    };
    axios
      .post("http://localhost:5000/admin/login", loginData)
      .then((response) => {
        const { token } = response.data;
        setAdminAuthToken(token);
        toast.success("Inicio de sesion exitoso")
        setTimeout(() => {
          navigate("/admin/home"); // Redirige al panel de administración
        }, 2800);
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);
        if (error.response && error.response.data.error) {
          toast.error(error.response.data.error);
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="card card-outline card-primary">
          <div className="card-header text-center">
            <h1>
              Chucherías<b> & </b>Regalos
            </h1>
          </div>
          <div className="card-body login-card-body">
            <p className="login-box-msg">Inicia sesión para comenzar</p>
            <div className="text-center mt-1 mb-1">
              <img
                className="img-fluid"
                src="/images/Imagen1-3n4j4J1C4-transformed (1).jpg"
                alt="Chucherías & Regalos"
                style={{
                  height: "150px",
                  width: "150px",
                  borderRadius: "100%",
                }}
              />
            </div>

            <Formik
              initialValues={{ correo: "", contraseña: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="mr-4 ml-4">
                  <div className="form-group">
                    <label htmlFor="imagen">Correo</label>
                    <div className="input-group mb-3">
                      <Field
                        type="text"
                        className="form-control"
                        name="correo"
                        placeholder="Correo del usuario"
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">
                          <span className="fas fa-envelope"></span>
                        </div>
                      </div>
                    </div>
                    <ErrorMessage
                      name="correo"
                      component="div"
                      className="text-danger mb-3"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="imagen">Contraseña</label>
                    <div className="input-group mb-4">
                      <Field
                        type="password"
                        className="form-control"
                        name="contraseña"
                        placeholder="Contraseña"
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">
                          <span className="fas fa-lock"></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ErrorMessage
                    name="contraseña"
                    component="div"
                    className="text-danger mb-3"
                  />

                  <div className="row mt-4">
                    <div className="col-9">
                      <Link to={`/admin/forgot-password/${role}`}>Olvidé mi contraseña</Link>
                    </div>
                    <div className="col-3 d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Cargando..." : "Iniciar sesión"}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default Login;
