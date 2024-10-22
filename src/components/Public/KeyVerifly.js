import React, { useState } from "react";
import PageTitle from "./PageTitle";
import { Formik, Form, Field, useField } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Card } from "primereact/card";
import { InputOtp } from 'primereact/inputotp'; // Importar InputOtp de PrimeReact

// Componente de InputOtp con integración con Formik
const FormikInputOtp = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name);
  
  const handleChange = (e) => {
    helpers.setValue(e.value); // Actualizar el valor en Formik
  };

  return (
    <>
      <InputOtp
        value={field.value}
        onChange={handleChange}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="text-danger">{meta.error}</div>
      ) : null}
    </>
  );
};

const KeyVerifly = () => {
  const [isResending, setIsResending] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const { correo } = useParams();
  const navigate = useNavigate();

  const initialValues = {
    otp: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values.otp);
    try {
      const response = await axios.post(
        "http://localhost:5000/users/keyCompare",
        {
          correo: correo,
          clave: values.otp,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate(`/change-password/${correo}`);
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
        "http://localhost:5000/users/forgotPassword",
        {
          correo,
        }
      );

      toast.success(`Se ha enviado a su correo el código de verificación!`);
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

  const handleClick = async () => {
    try {
      await axios.post(
        "http://localhost:5000/users/sedKeyWhatsApp",
        {
          correo: correo,
        }
      );
      toast.success("Token enviado por WhatsApp exitosamente");
      setTimeout(() => {
        navigate(`/key-verification-whatsapp/${correo}`);
      }, 2000);
    } catch (error) {
      toast.error("Error al enviar el token por WhatsApp");
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
                      src="/images/CodeAccess.jpg"
                      alt=""
                      className="img-fluid rounded-start mt-4 img-forgot"
                    />
                  </div>
                  <div className="col-md-7">
                    <Formik
                      initialValues={initialValues}
                      onSubmit={handleSubmit}
                      validateOnChange={true}
                    >
                      <Form>
                        <p className="login-box-msg mb-1">
                          Se le hizo llegar un código de verificación a su correo electrónico asociado a su cuenta, por favor introduzca su clave.
                        </p>

                        <div className="form-group mb-4">
                          <label htmlFor="correo" className="fw-bold">
                            Su correo electrónico
                          </label>
                          <div className="input-group mb-3">
                            <Field
                              type="text"
                              className="form-control"
                              id="correo"
                              name="correo"
                              value={correo}
                              disabled
                            />
                            <div className="input-group-append">
                              <div className="input-group-text">
                                <span className="fas fa-envelope"></span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="form-group mb-4">
                          <label htmlFor="otp" className="fw-bold">
                            Ingrese su clave de verificación
                          </label>
                          <div className="d-flex justify-content-center">
                            <FormikInputOtp
                              name="otp"
                              id="otp"
                              length={4}
                              placeholder="____"
                              autoFocus
                              integerOnly
                            />
                          </div>
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

                        <div className="text-login">
                          <Link className="text-primary fw-bold">
                            <p onClick={handleClick}>
                              Probar por pregunta secreta
                            </p>
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

export default KeyVerifly;
