import React, { useEffect, useState } from "react";
import PageTitle from "../../components/Public/PageTitle";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { jwtDecode } from "jwt-decode";

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

const ProfileSecurity = () => {
  const { token } = useAuth();
  const [decodedToken, setDecodedToken] = useState(null);
  const [preguntaSecreta, setPreguntaSecreta] = useState("");
  const [respuestaSecreta, setRespuestaSecreta] = useState("");
  const [capchaValue, setCaptchaValue] = useState(null);
  const [captchaExpired, setCaptchaExpired] = useState(false);

  const handleChange = (value) => {
    setCaptchaValue(value);
  };
  const handleExpired = () => {
    setCaptchaExpired(true); // Actualizar el estado cuando el tiempo del captcha expire
  };

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setDecodedToken(decoded);
      fetchData(decoded.customerId);
    }
  }, [token]);

  
  const fetchData = async (customerId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users/${customerId}`
      );

      setPreguntaSecreta(response.data.preguntaSecreta);
      setRespuestaSecreta(response.data.respuestaPSecreta);
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      // Manejar el error apropiadamente, por ejemplo, mostrando una notificación al usuario
      toast.error("Error al obtener datos del usuario. Intente nuevamente.");
    }
  };

  const initialValues = {
    respuesta: respuestaSecreta ? respuestaSecreta : "",
  };

  const handleSubmit = async (values, { setSubmitting, setErrors  }) => {
    try {
      if (!capchaValue) {
        toast.error("Por favor, completa el CAPTCHA.");
        setErrors({ captcha: "Complete el Captcha" });
        return;
      }

      const response = await axios.put(`http://localhost:5000/users/updateUser/${decodedToken.customerId}`, {
        respuestaPSecreta: values.respuesta,
        preguntaSecreta,
      });

      if (response.status === 200) {
        toast.success("Perfil actualizado exitosamente");
      }
      fetchData(decodedToken.customerId);
      
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error("Error al actualizar perfil. Intente nuevamente.");
    }

    setSubmitting(false);
  };

  return (
    <div className="section row3 mt-4">
      <PageTitle title="Chucherias & Regalos | Perfil de usuario" />

      <h3 className="title-pag fw-bold text-uppercase">
        Seguridad de la cuenta
      </h3>
      <hr className="hr-primary" />
      <div className="hoc section clear m-5">
        <div className="row">
          <div className="col-md-4 item-center img-profile-usr">
            <img
              src="/images/ChangePassword.jpg"
              alt="Recuperar contraseña"
              className="img-fluid mt-4 img-profile-usr"
              style={{borderRadius:10}}
            />
          </div>
          <div className="col-md-8">
            <h3 className="fw-bold">Cambiar pregunta secreta</h3>
            <div className="section">
              <div className="row">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationRespuesta}
                  onSubmit={handleSubmit}
                  validateOnChange={true}
                  enableReinitialize
                >
                  {({ isSubmitting }) => (
                  <Form>
                    <p class="text-justify mr-4">
                      Puede recuperar el acceso a su cuenta mediante Pregunta
                      Secreta. Puede actualizar su pregunta y respuesta para
                      volver a tener el acceso a su cuenta.
                    </p>
                    <div className="form-group mb-1 text-center">
                      <p className="fw-bold"></p>
                    </div>
                    <div className="row">
                      <div className="form-group col-sm-6">
                        <label htmlFor="preguntaSecreta" className="fw-bold">
                          Pregunta Secreta
                        </label>
                        <Field
                          as="select"
                          className="form-select"
                          id="preguntaSecreta"
                          name="preguntaSecreta"
                          value={preguntaSecreta}
                          onChange={(e) => setPreguntaSecreta(e.target.value)}
                        >
                          <option value="" disabled hidden>
                            Selecciona tu pregunta secreta
                          </option>
                          <option value="¿Color favorito?">
                            ¿Color favorito?
                          </option>
                          <option value="¿Nombre de tu primera mascota?">
                            ¿Nombre de tu primera mascota?
                          </option>
                          <option value="¿Equipo de futbol favorito?">
                            ¿Equipo de futbol favorito?
                          </option>
                          <option value="¿Deporte favorito?">
                            ¿Deporte favorito?
                          </option>
                          <option value="¿Fruta favorita?">
                            ¿Fruta favorita?
                          </option>
                        </Field>
                        <ErrorMessage
                          name="preguntaSecreta"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group col-sm-6">
                        <label htmlFor="respuesta" className="fw-bold">
                          Su respuesta:
                        </label>
                        <div className="input-group mb-3">
                          <Field
                            type="text"
                            className="form-control"
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
                      <Link to="/forgot-password" className="text-primary fw-bold mb-4 item-responsive" >Cambiar contraseña</Link>

                    </div>

                    <div className="cont-btn btn-profile-responsive">
                      <Link to="/forgot-password" className="btn-primary item-no-responsive" >Cambiar contraseña</Link>
                      <button type="submit" className="btn-warning" disabled={
                        !capchaValue ||
                        captchaExpired ||
                        isSubmitting 
                      }>
                        {isSubmitting ? "Actualizando..." : "Actualizar"}
                        
                      </button>
                    </div>
                  </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSecurity;
