import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {  toast } from "react-toastify";
import { useParams } from "react-router-dom";
import PasswordField from "../Public/PasswordField";
import PasswordToggle from "./PasswordToggle"; // Componente para mostrar/ocultar contraseña

const validationSchema = Yup.object().shape({
  contraseña: Yup.string()
    .required("Contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/\d{1,2}/, "Debe contener al menos 1 o 2 dígitos")
    .matches(/[A-Z]{1,2}/, "Debe contener al menos 1 o 2 letras mayúsculas")
    .matches(/[a-z]{1,2}/, "Debe contener al menos 1 o 2 letras minúsculas")
    .matches(/[^A-Za-z0-9]{1,2}/, "Debe contener al menos 1 o 2 caracteres especiales"),
  RContraseña: Yup.string()
    .required("Campo obligatorio")
    .oneOf([Yup.ref("contraseña"), null], "Las contraseñas deben coincidir"),
});

const AdminChangePassword = () => {
  const { correo } = useParams();
  const { role } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    contraseña: "",
    RContraseña: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/changePassword",
        {
          correo: correo,
          nuevaContraseña: values.contraseña,
          role: role
        }
      );

      toast.success(response.data.message);

      setTimeout(() => {
        navigate("/admin");
      }, 5000);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error desconocido");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
          <div className="card card-admin card-outline card-primary">
            <div className="card-header text-center">
              <Link to="/" className="h1">
                Chucherias <b>&</b> Regalos
              </Link>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-5 item-center">
                  <img
                    src="/images/ChangePassword.jpg"
                    alt="Cambio de contraseña"
                    className="img-fluid rounded-start mt-4"
                    style={{height:400}}
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
                        Estás a solo un paso de tu nueva contraseña, recupera tu
                        contraseña ahora.
                      </p>
                      <div className="form-group mb-4">
                        <label htmlFor="contraseña" className="fw-bold">
                          Ingrese su nueva contraseña
                        </label>
                        <PasswordField
                          id="contraseña"
                          name="contraseña"
                          placeholder="Contraseña"
                          type={showPassword ? "text" : "password"}
                        />
                      </div>
                      <div className="form-group mb-4">
                        <label htmlFor="RContraseña" className="fw-bold">
                          Confirme su contraseña
                        </label>
                        <div className="input-group mb-3">
                          <Field
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            id="RContraseña"
                            name="RContraseña"
                            placeholder="Confirme su contraseña"
                          />
                          <PasswordToggle 
                            showPassword={showPassword}
                            onToggle={() => setShowPassword(!showPassword)}
                          />
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
          </div>
        
      
    </div>
  );
};

export default AdminChangePassword;
