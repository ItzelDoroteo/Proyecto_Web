import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const validationSchema = Yup.object().shape({
  digit1: Yup.string()
    .matches(/^\d+$/, "Solo se permiten números")
    .length(1, "Debe tener exactamente un dígito")
    .required("Este campo es obligatorio"),
  digit2: Yup.string()
    .matches(/^\d+$/, "Solo se permiten números")
    .length(1, "Debe tener exactamente un dígito")
    .required("Este campo es obligatorio"),
  digit3: Yup.string()
    .matches(/^\d+$/, "Solo se permiten números")
    .length(1, "Debe tener exactamente un dígito")
    .required("Este campo es obligatorio"),
  digit4: Yup.string()
    .matches(/^\d+$/, "Solo se permiten números")
    .length(1, "Debe tener exactamente un dígito")
    .required("Este campo es obligatorio"),
});

const AdminKeyVerifly = () => {
  const [isResending, setIsResending] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);

  const { correo } = useParams();
  const { role } = useParams();
  const navigate = useNavigate();

  const initialValues = {
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const clave = values.digit1 + values.digit2 + values.digit3 + values.digit4;

    try {
      const response = await axios.post(
        "http://localhost:5000/admin/keyCompare",
        {
          correo: correo,
          clave: clave,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate(`/employ/changePassword/${role}/${correo}`);
        }, 3000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        const responseData = error.response.data;
        if (responseData.message) {
          toast.error(responseData.message);
        } else {
          toast.error(
            "Error al verificar la clave. Por favor, inténtalo de nuevo."
          );
        }
      } else {
        toast.error(
          "Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const reenviarClave = async () => {
    try {
      if (isCooldown) {
        toast.warning(
          "Por favor, espere 5 minutos antes de volver a intentarlo."
        );
        return;
      }

      setIsResending(true);

      await axios.post(
        "http://localhost:5000/admin/forgotPassword",
        {
          correo,
          role
        }
      );

      toast.success(`Se ha enviado a su correo el código de verificación!`);

      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5 * 60 * 1000);
    } catch (error) {
      if (error.response) {
        const responseData = error.response.data;
        if (responseData.error) {
          toast.error(responseData.error);
        } else {
          toast.error(
            "Error al reenviar la clave. Por favor, inténtalo de nuevo."
          );
        }
      } else {
        toast.error(
          "Error de conexión. Por favor, verifica tu conexión a Internet e inténtalo de nuevo."
        );
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="login-page">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card card-admin card-outline card-primary">
            <div className="card-header text-center">
              <Link to="/admin" className="h1">
                Chucherias <b>&</b> Regalos
              </Link>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-5 item-center">
                  <img
                    src="/images/CodeAccess.jpg"
                    alt=""
                    className="img-fluid rounded-start mt-4"
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
                      <p className="login-box-msg">
                        Se le hizo llegar un codigo de verificacion a su correo
                        electronico asociado a su cuenta, por favor introduzca
                        su clave.
                      </p>
                      <div className="form-group mb-4">
                        <label htmlFor="correo" className="fw-bold">
                          Su correo electronico
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
                        <label htmlFor="clave" className="fw-bold">
                          Ingrese su clave de verificacion
                        </label>
                        <div className="row">
                          <div className="col-md-3">
                            <Field
                              name="digit1"
                              type="text"
                              maxLength={1}
                              className="form-control text-center"
                            />
                            <ErrorMessage
                              name="digit1"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                          <div className="col-md-3">
                            <Field
                              name="digit2"
                              type="text"
                              maxLength={1}
                              className="form-control text-center"
                            />
                            <ErrorMessage
                              name="digit2"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                          <div className="col-md-3">
                            <Field
                              name="digit3"
                              type="text"
                              maxLength={1}
                              className="form-control text-center"
                            />
                            <ErrorMessage
                              name="digit3"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                          <div className="col-md-3">
                            <Field
                              name="digit4"
                              type="text"
                              maxLength={1}
                              className="form-control text-center"
                            />
                            <ErrorMessage
                              name="digit4"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-login">
                        <p>¿No recibio su codigo?</p>
                        <Link
                          className="fw-bold"
                          onClick={reenviarClave}
                          disabled={isResending}
                        >
                          {isResending ? "Reenviando..." : "Reenviar ahora"}
                        </Link>
                      </div>
                      <div className="cont-btn-2 mt-4 mb-4">
                        <button type="submit" className="btn btn-primary">
                          Enviar
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
    </div>
  );
};

export default AdminKeyVerifly;
