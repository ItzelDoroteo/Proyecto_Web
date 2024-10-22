import React, { useState } from "react";
import PageTitle from "./PageTitle";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { Card } from "primereact/card";

//validaciones correspondientes al formulario de registro
const validationEmail = Yup.object().shape({
  correo: Yup.string()
    .email("Correo electrónico inválido")
    .required("Email es obligatorio")
    .matches(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
      "Ingresa una dirección de correo electrónico válida"
    ),
});

const LoginPage = () => {
  const [capchaValue, setCaptchaValue] = useState(null);

  const handleChange = (value) => {
    setCaptchaValue(value);
  };
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Regresa a la ruta anterior
  };

  //valores por defecto de los campos de registro
  const initialValues = {
    correo: "",
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      if (!capchaValue) {
        toast.error("Por favor, completa el CAPTCHA.");
        setErrors({ captcha: "Complete el Captcha" });
        return;
      }

      // Enviar datos al backend para la autenticación
      await axios.post(
        "http://localhost:5000/users/forgotPassword",
        values
      );

      // Mostrar un toast con el nombre del usuario
      toast.success(`Se a enviado a su correo el codigo de verificacion!`);

      setTimeout(() => {
        navigate(`/key-verification/${values.correo}`);
      }, 2000);
    } catch (error) {
      if (error.response) {
        // Si la respuesta de la API contiene errores
        const responseData = error.response.data;
        if (
          responseData.error ===
          "El correo ingresado no está asociado a una cuenta"
        ) {
          // Manejar el caso específico cuando el correo no está asociado a una cuenta
          toast.error(responseData.error);
        } else {
          // Mostrar errores relacionados con el formulario
          setErrors(responseData.errors);
        }
      } else {
        // Si hay un error de red u otro tipo de error
        console.error(error);
        toast.error(
          "Error de conexión. Por favor, verifica tu conexión a Internet e inténtalo de nuevo más tarde."
        );
        // Redirigir a la vista de error 500
        navigate(`/error-500`);
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="section row3 mt-4">
      <PageTitle title="Chucherias & Regalos | Recuperar contraseña" />
      <div className="hoc section clear m-3">
        <div className="col-lg-12 cont-forgot">
          <div className="col-lg-8">
            <Card className="card card-outline card-primary">
              <div className="card-header text-center">
                <Link to="/" className="h1">
                  Chucherias <b>&</b> Regalos
                </Link>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-5 item-center">
                    <img
                      src="/images/forgot-password.jpg"
                      alt=""
                      className="img-fluid rounded-start mt-4 img-forgot"
                    />
                  </div>
                  <div className="col-md-7">
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationEmail}
                      onSubmit={handleSubmit}
                      validateOnChange={true}
                    >
                      <Form>
                        <p className="login-box-msg">
                          ¿Olvidaste tu contraseña? Aquí puede recuperar
                          fácilmente una nueva contraseña.
                        </p>
                        <div className="form-group mb-4">
                          <label htmlFor="correo" className="fw-bold">
                            Ingrese su correo electronico
                          </label>
                          <div className="input-group mb-3">
                            <Field
                              type="text"
                              className="form-control"
                              id="correo"
                              name="correo"
                              placeholder="Ingrese su correo electronico"
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
                            className="text-danger"
                          />
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

                        <div className="cont-btn mt-4">
                          <button
                            onClick={handleBack}
                            className="btn-secondary"
                          >
                            Cancelar
                          </button>
                          <button type="submit" className="btn-primary">
                            Enviar solicitud
                          </button>
                        </div>
                      </Form>
                    </Formik>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
