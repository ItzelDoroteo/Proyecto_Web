import React, { useState, useEffect } from "react";
import PageTitle from "./PageTitle";
import { Formik, Form, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom"; 
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Card } from "primereact/card";
import { InputOtp } from 'primereact/inputotp'; // Importar InputOtp de PrimeReact

const validationSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^\d+$/, "Solo se permiten números")
    .length(4, "Debe tener exactamente cuatro dígitos")
    .required("Este campo es obligatorio"),
});

const KeyVeriflyWhatsApp = () => {
  const [isResending, setIsResending] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [telefono, setTelefono] = useState("");
  const { correo } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/users/findPhone/${correo}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.telefono) {
          setTelefono(data.telefono); // Guarda el valor del teléfono en el estado
        } else {
          console.log("No se encontró el número de teléfono para el correo dado");
        }
      })
      .catch((error) => console.error("Error fetching phone number:", error));
  }, [correo]);

  // Valores por defecto de los campos de OTP
  const initialValues = {
    otp: "",
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (values, { setSubmitting }) => {
    const clave = values.otp;

    try {
      const response = await axios.post(
        "http://localhost:5000/users/keyCompare",
        {
          correo: correo,
          clave: clave,
        }
      );

      console.log("Respuesta de la API:", response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate(`/forgot-passworg-secret-question/${correo}`);
        }, 3000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error al consumir la API:", error);
      if (error.response) {
        const responseData = error.response.data;
        if (responseData.message) {
          toast.error(responseData.message);
        } else {
          toast.error("Error al verificar la clave. Por favor, inténtalo de nuevo.");
        }
      } else {
        toast.error("Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const reenviarClave = async () => {
    try {
      if (isCooldown) {
        toast.warning("Por favor, espere 5 minutos antes de volver a intentarlo.");
        return;
      }

      setIsResending(true);

      await axios.post(
        "http://localhost:5000/users/sedKeyWhatsApp",
        {
          correo,
        }
      );

      toast.success(`Se ha enviado a su WhatsApp el código de verificación!`);

      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5 * 60 * 1000);
    } catch (error) {
      console.error(error);
      if (error.response) {
        const responseData = error.response.data;
        if (responseData.error) {
          toast.error(responseData.error);
        } else {
          toast.error("Error al reenviar la clave. Por favor, inténtalo de nuevo.");
        }
      } else {
        toast.error("Error de conexión. Por favor, verifica tu conexión a Internet e inténtalo de nuevo.");
      }
    } finally {
      setIsResending(false);
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
                      src="/images/sendPhone.jpg"
                      alt=""
                      className="img-fluid rounded-start mt-4 img-forgot"
                    />
                  </div>
                  <div className="col-md-7">
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                      validateOnChange={true}
                    >
                      <Form>
                        <p className="login-box-msg mb-1">
                          Se le hizo llegar un código de verificación por medio de WhatsApp a su número de teléfono asociado a su cuenta, por favor introduzca su clave.
                        </p>

                        <div className="form-group mb-4 text-center">
                          <p className="fw-bold">
                            Su número de teléfono: {telefono}
                          </p>
                        </div>

                        <div className="form-group mb-4">
                          <label htmlFor="otp" className="fw-bold">
                            Ingrese su clave de verificación
                          </label>
                          <div className="d-flex justify-content-center">
                            <InputOtp
                              name="otp"
                              id="otp"
                              length={4}
                              placeholder="____"
                              autoFocus
                              integerOnly
                            />
                          </div>
                          <ErrorMessage
                            name="otp"
                            component="div"
                            className="text-danger"
                          />
                        </div>

                        <div className="text-login">
                          <p>¿No recibió su código?</p>
                          <Link
                            className="fw-bold"
                            onClick={reenviarClave}
                            disabled={isResending}
                          >
                            {isResending ? "Reenviando..." : "Reenviar ahora"}
                          </Link>
                        </div>

                        <div className="cont-btn-2 mt-4 mb-4">
                          <button type="submit" className="btn-primary">
                            Enviar
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

export default KeyVeriflyWhatsApp;
