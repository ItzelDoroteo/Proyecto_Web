import React, { useState } from "react";
import PageTitle from "./PageTitle";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom"; // Importar Link desde react-router-dom
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import PasswordField from "./PasswordField";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Card } from "primereact/card";

//validaciones correspondientes al formulario de registro
const validationEmail = Yup.object().shape({
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
  RContraseña: Yup.string()
    .required("Campo obligatorio")
    .oneOf([Yup.ref("contraseña"), null], "Las contraseñas deben coincidir"),
});

const ChangePassword = () => {
  const { correo } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña

  //valores por defecto de los campos de registro
  const initialValues = {
    contraseña: "",
    RContraseña: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Enviar la solicitud POST a la API
      const response = await axios.post(
        "http://localhost:5000/users/changePassword",
        {
          correo: correo,
          nuevaContraseña: values.contraseña,
        }
      );

      console.log(correo + " " + values.contraseña);

      // Mostrar un mensaje de éxito
      toast.success(response.data.message);

      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      // Mostrar un mensaje de error si ocurre algún problema
      toast.error(error.response.data.error);
    } finally {
      // Establecer setSubmitting a false para permitir que el formulario sea enviado nuevamente
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
                      src="/images/change-password.jpg"
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
                          Estás a solo un paso de tu nueva contraseña, recupera
                          tu contraseña ahora.
                        </p>
                        <div className="form-group mb-4">
                          <label htmlFor="Contraseña" className="fw-bold">
                            Ingrese su nueva contraseña
                          </label>
                          <PasswordField
                            id="contraseña"
                            name="contraseña"
                            placeholder="Contraseña"
                            validations={(password) =>
                              validationEmail.fields.contraseña.validSync(
                                password
                              )
                            }
                          />
                        </div>
                        <div className="form-group mb-4">
                          <label htmlFor="RContraseña" className="fw-bold">
                            Confirme su contraseña
                          </label>
                          <div className="input-group mb-3">
                            <div className="input-group">
                              <Field
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                id="RContraseña"
                                name="RContraseña"
                                placeholder="Confirme su contraseña"
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
                              name="RContraseña"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>

                        <div className="cont-btn-2 mt-4">
                          <button type="submit" className="btn-primary">
                            Cambiar contraseña
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
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
