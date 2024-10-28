// ModalComponent.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importar Link desde react-router-dom
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { useAlert } from "../../context/AlertContext";
import { jwtDecode } from "jwt-decode";
import ReCAPTCHA from "react-google-recaptcha";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { Button } from "primereact/button";

//validaciones correspondientes al formulario de registro
const loginValidationSchema = Yup.object().shape({
  correo: Yup.string()
    .email("Correo electrónico inválido")
    .required("Email es obligatorio")
    .matches(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
      "Ingresa una dirección de correo electrónico válida"
    ),
  contraseña: Yup.string()
    .required("Contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/\d{1,2}/, "Debe contener al menos 1 o 2 dígitos")
    .matches(/[A-Z]{1,2}/, "Debe contener al menos 1 o 2 letras mayúsculas")
    .matches(/[a-z]{1,2}/, "Debe contener al menos 1 o 2 letras minúsculas")
    .matches(
      /[^A-Za-z0-9]{1,2}/,
      "Debe contener al menos 1 o 2 caracteres especiales"
    ),
});

const ModalComponent = ({ show, onClose }) => {
  const showAlert = useAlert();
  const [capchaValue, setCaptchaValue] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña
  const { setAuthToken } = useAuth(); // Obtén la función setAuthToken del contexto de autenticación

  const handleChange = (value) => {
    setCaptchaValue(value);
  };

  //valores por defecto de los campos de registro
  const initialValues = {
    correo: "",
    contraseña: "",
  };

  const navigate = useNavigate();
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      if (!capchaValue) {
        showAlert("error", "Por favor, completa el CAPTCHA.");
        setErrors({ captcha: "Complete el Captcha" });
        return;
      }

      // Enviar datos al backend para la autenticación
      const response = await axios.post(
        "http://localhost:5000/users/login",
        values
      );

      // Guarda el token utilizando setAuthToken del contexto de autenticación
      setAuthToken(response.data.token);

      // Decodificar el token para obtener los datos del usuario
      const user = jwtDecode(response.data.token);
      console.log(user);

      const mensaje = `Inicio de sesión exitoso. Bienvenid${
        user.sexo === "masculino" ? "o" : "a"
      }, ${user.nombre}!`;
      showAlert("success", mensaje);
      onClose();
    } catch (error) {
      if (error.response) {
        // Si la respuesta de la API contiene errores
        const responseData = error.response.data;
        if (
          responseData.error ===
          "El correo ingresado no está asociado a una cuenta"
        ) {
          showAlert(
            "error",
            "El correo ingresado no está asociado a una cuenta."
          );
          setErrors({
            correo: "El correo ingresado no esta asociado a una cuenta",
          });
        } else if (responseData.error === "Contraseña incorrecta") {
          showAlert("error", "Contraseña incorrecta.");
          setErrors({ contraseña: "La contraseña es incorrecta" });
        } else if (
          responseData.error === "Se ha excedido el límite de intentos"
        ) {
          showAlert(
            "error",
            "Se ha excedido el límite de intentos de inicio de sesión. Por favor espere 30s para intentarlo de nuevo."
          );
        }
      } else {
        // Si hay un error de red u otro tipo de error
        console.error(error);
        showAlert(
          "error",
          "Error de conexión. Por favor, verifica tu conexión a Internet e inténtalo de nuevo más tarde."
        );
        // Redirigir a la vista de error 500
        navigate("/error-500");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header className="modal-header" closeButton>
        <h1 className="modal-title fs-5">Iniciar sesión</h1>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <Formik
          initialValues={initialValues}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
        >
          <Form>
            <div className="row">
              <div className="item center item-responsive">
                <h3 className="title-pag fw-bold text-uppercase">
                  INICIAR SESIÓN
                </h3>
                <hr className="hr-primary item-responsive" />
              </div>

              <div className="col-md-5 item-center">
                <img
                  src="/images/Imagen1-3n4j4J1C4-transformed (1).jpg"
                  alt="Chucherias & Regalos"
                  className="img-fluid rounded-start mt-4 img-login"
                />
              </div>
              <div className="col-md-7">
                <h3 className="title-pag fw-bold text-uppercase item-no-responsive">
                  INICIAR SESIÓN
                </h3>
                <hr className="hr-primary item-no-responsive" />

                <div className="text-login">
                  <p>
                    Inicie sesión ahora, comencemos con sus compras. ¿No tiene
                    una cuenta?
                  </p>
                  <Link to="/registro" className="fw-bold" onClick={onClose}>
                    Registrarse ahora
                  </Link>
                </div>

                <div className="credentials">
                  <div className="form-group">
                    <label htmlFor="correo" className="fw-bold">
                      Correo electronico
                    </label>
                    <Field
                      type="text"
                      className="form-control"
                      id="correo"
                      name="correo"
                      placeholder="Correo electronico"
                    />
                    <ErrorMessage
                      name="correo"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="form-group mt-4">
                    <label htmlFor="contraseña" className="fw-bold">
                      Contraseña
                    </label>
                    <div className="input-group">
                      <Field
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="contraseña"
                        name="contraseña"
                        placeholder="Contraseña"
                      />
                      {/* Botón para mostrar/ocultar la contraseña */}
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)} // Función para cambiar el estado showPassword
                        >
                          {showPassword ? (
                            <MdVisibilityOff size={25} />
                          ) : (
                            <MdVisibility size={25} />
                          )}
                        </button>
                      </div>
                    </div>

                    <ErrorMessage
                      name="contraseña"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>
                <div className="form-group mt-4">
                  <ReCAPTCHA
                    sitekey="6LcbDGApAAAAANIKHKiUNtO-2ae77SgnoFzKXlO-"
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="captcha"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="text-login">
                  <p>¿Olvido su contraseña?</p>
                  <Link
                    to="/forgot-password"
                    className="fw-bold text-primary"
                    onClick={onClose}
                  >
                    Recuperar contraseña
                  </Link>
                </div>
              </div>
            </div>
            <Modal.Footer className="modal-footer">
              <Button
                label="Ingresar"
                severity="success"
                icon="pi pi-sign-in"
                style={{ color: "white", borderRadius: 10 }}
              />
            </Modal.Footer>
          </Form>
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalComponent;
