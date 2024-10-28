import React, { useState, useEffect } from "react";
import PageTitle from "./PageTitle";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom"; // Importar Link desde react-router-dom
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";

//validaciones correspondientes al formulario de registro
const validationRespuesta = Yup.object().shape({
  respuesta: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ\s]+$/,
      "La respuesta solo puede contener letras, acentos y espacios"
    )
    .min(3, "La respuesta debe tener al menos 3 caracteres")
    .max(50, "La respuesta no puede tener más de 50 caracteres")
    .required("Este campo es obligatorio"),
});

const SecretQuestion = () => {
  const { correo } = useParams();
  const navigate = useNavigate();
  const [preguntaSecreta, setPreguntaSecreta] = useState("");

  //valores por defecto de los campos de registro
  const initialValues = {
    respuesta: "",
  };

  useEffect(() => {
    // Función para obtener la pregunta secreta del backend
    const fetchData = async () => {
      try {
        // Enviar una solicitud POST al backend con el correo en el cuerpo de la solicitud
        const response = await axios.post(
          "http://localhost:5000/users/secretQuestion",
          { correo: correo }
        );
        setPreguntaSecreta(response.data.preguntaSecreta); // Actualizar el estado con la pregunta secreta recibida del backend
      } catch (error) {
        console.error("Error al obtener la pregunta secreta:", error);
        // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      }
    };

    fetchData(); // Llamar a la función fetchData al cargar el componente
  }, [correo]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post(
        "http://localhost:5000/users/secretAnswer",
        {
          correo,
          respuesta: values.respuesta,
        }
      );
      toast.success("La respuesta es correcta");
      setTimeout(() => {
        navigate(`/change-password/${correo}`);
      }, 3000);
    } catch (error) {
      console.error("Error al verificar respuesta secreta:", error);
      toast.error("La respuesta proporcionada es incorrecta.");
    } finally {
      setSubmitting(false);
    }
  };

  const loginPageStyle = {
    minHeight: "450px",
    background: "none", // Agrega esta línea para quitar el fondo
  };
  return (
    <div className="wrapper row3 m-5">
      <PageTitle title="Chucherias & Regalos | Recuperar contraseña" />
      <div className="login-page" style={loginPageStyle}>
        <div className="login-box">
          <div className="card card-outline card-primary">
            <div className="card-header text-center">
              <Link to="/" className="h1">
                Chucherias <b>&</b> Regalos
              </Link>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-5">
                  <img
                    src="/images/forgot-password.jpg"
                    alt=""
                    className="img-fluid rounded-start mt-4"
                  />
                </div>
                <div className="col-md-7">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationRespuesta}
                    onSubmit={handleSubmit}
                    validateOnChange={true}
                  >
                    <Form>
                      <p className="login-box-msg">
                        Puede recuperar el acceso a su cuenta mediante Pregunta
                        Secreta. Solo tiene que responder correctamente a la
                        siguiente pregunta:
                      </p>
                      <div className="form-group mb-1 text-center">
                        <p className="fw-bold">
                          {typeof preguntaSecreta === "string"
                            ? preguntaSecreta
                            : "Cargando pregunta secreta..."}
                        </p>
                      </div>

                      <div className="form-group mb-4">
                        <label htmlFor="respuesta" className="fw-bold">
                          Ingrese su respuesta:
                        </label>
                        <div className="input-group mb-3">
                          <Field
                            type="text"
                            className="form-control"
                            id="respuesta"
                            name="respuesta"
                            placeholder="Ingrese su respuesta a la pregunta"
                          />
                        </div>
                        <ErrorMessage
                          name="respuesta"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="cont-btn mt-4">
                        <Link to="/" className="btn-secondary">
                          Cancelar
                        </Link>
                        <button type="submit" className="btn-primary">
                          Enviar solicitud
                        </button>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SecretQuestion;
