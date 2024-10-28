import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../components/Public/PageTitle";
import ModalComponent from "../../components/Public/Modal";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import PasswordField from "../../components/Public/PasswordField";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

//validaciones correspondientes al formulario de registro
const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ\s]+$/,
      "El nombre solo puede contener letras, acentos y espacios"
    )
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(20, "El nombre no puede tener más de 20 caracteres")
    .required("El nombre es obligatorio")
    .test(
      "no-repetir-caracteres",
      "El nombre no puede contener caracteres repetidos consecutivos más de 2 veces",
      (value) => {
        // Verificar que no haya más de 2 caracteres repetidos consecutivos
        const regex = /([a-zA-ZáéíóúñÑÁÉÍÓÚüÜ])\1{2,}/g;
        return !regex.test(value);
      }
    ),
  aPaterno: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ\s]+$/,
      "El nombre solo puede contener letras, acentos y espacios"
    )
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(15, "El nombre no puede tener más de 15 caracteres")
    .required("El nombre es obligatorio")
    .test(
      "no-repetir-caracteres",
      "El nombre no puede contener caracteres repetidos consecutivos más de 2 veces",
      (value) => {
        // Verificar que no haya más de 2 caracteres repetidos consecutivos
        const regex = /([a-zA-ZáéíóúñÑÁÉÍÓÚüÜ])\1{2,}/g;
        return !regex.test(value);
      }
    ),
  aMaterno: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ\s]+$/,
      "El nombre solo puede contener letras, acentos y espacios"
    )
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(15, "El nombre no puede tener más de 15 caracteres")
    .required("El nombre es obligatorio")
    .test(
      "no-repetir-caracteres",
      "El nombre no puede contener caracteres repetidos consecutivos más de 2 veces",
      (value) => {
        // Verificar que no haya más de 2 caracteres repetidos consecutivos
        const regex = /([a-zA-ZáéíóúñÑÁÉÍÓÚüÜ])\1{2,}/g;
        return !regex.test(value);
      }
    ),
  correo: Yup.string()
    .email("Correo electrónico inválido")
    .required("Email es obligatorio")
    .matches(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
      "Ingresa una dirección de correo electrónico válida"
    ),
  telefono: Yup.number()
    .typeError("Formato invalido")
    .required("Telefono requerido")
    .min(10, "El Telefono debe tener al menos 10 digitos"),
  sexo: Yup.string().required("Seleccione su sexo"),
  preguntaSecreta: Yup.string().required("Seleccione su pregunta"),
  respuestaPSecreta: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúñÑÁÉÍÓÚüÜ\s]+$/,
      "El nombre solo puede contener letras, acentos y espacios"
    )
    .min(3, "La respuesta debe tener al menos 3 caracteres")
    .max(50, "La respuesta no puede tener más de 50 caracteres")
    .required("La respuesta es obligatorio"),
  fecha_nacimiento: Yup.date()
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      "Debes ser mayor de 18 años"
    )
    .required("Fecha de nacimiento es obligatoria"),
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
  aceptaTerminos: Yup.boolean().oneOf(
    [true],
    "Debes aceptar los términos y condiciones para registrarte"
  ),
});

const Register = () => {
  const [capchaValue, setCaptchaValue] = useState(null);
  const [captchaExpired, setCaptchaExpired] = useState(false); // Estado para el tiempo de expiración del captcha
  const [aceptaTerminos, setAceptaTerminos] = useState(false); // Estado del checkbox de terminos y condiciones
  const [contraseña, setPassword] = useState(""); // Estado del componente password
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleBack = () => {
    navigate(-1); // Regresa a la ruta anterior
  };


  const handleChange = (value) => {
    setCaptchaValue(value);
  };

  const handleExpired = () => {
    setCaptchaExpired(true); // Actualizar el estado cuando el tiempo del captcha expire
  };

  //acciones para desplegar el mopdal de iniciar sesion
  const [mostrarModal, setMostrarModal] = useState(false);

  const activarModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);
  //fin de modal iniciar sesion

  //valores por defecto de los campos de registro
  const initialValues = {
    nombre: "",
    aMaterno: "",
    aPaterno: "",
    correo: "",
    telefono: "",
    sexo: "",
    fecha_nacimiento: "",
    contraseña: "",
    RContraseña: "",
  };

  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      if (!capchaValue) {
        toast.error("Por favor, completa el CAPTCHA.");
        setErrors({ captcha: "Complete el Captcha" });
        return;
      }
      console.log(values)
  
      const response = await axios.post(
        "http://localhost:5000/users",
        values
      );
      console.log(response.data);
      toast.success(
        "¡Registro exitoso!, En breve sera redirigido a la pagina principal"
      );
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      if (error.response) {
        // Si la respuesta de la API contiene errores
        const responseData = error.response.data;
        if (responseData.error) {
          // Si la respuesta contiene un mensaje de error específico
          if (responseData.error.includes("correo")) {
            setErrors({ correo: responseData.error });
          } else if (responseData.error.includes("teléfono")) {
            setErrors({ telefono: responseData.error });
          }
          toast.error(responseData.error);
        } else {
          // Si no hay un mensaje de error específico, manejarlo como un error genérico
          toast.error("Error al registrar. Por favor, inténtalo de nuevo.");
        }
      } else {
        // Si hay un error de red u otro tipo de error
        console.error(error);
        toast.error("Error de conexión. Por favor, verifica tu conexión a Internet e inténtalo de nuevo más tarde.");
        // Redirigir a la vista de error 500
        navigate("/error-500");
      }
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <main>
      <PageTitle title="Chucherias & Regalos | Registrarse" />

      <h3 className="title-pag fw-bold text-uppercase">Crear cuenta</h3>
      <hr className="hr-primary" />
      <div className="container">
        <div className="row">
          <div className="col-md-5">
            <img
              src="/images/Imagen1-3n4j4J1C4-transformed (1).jpg"
              className="img-fluid rounded-start mt-4"
              alt="Chucherias & Regalos"
            />
          </div>
          <div className="col-md-7 mt-2">
            <h3 className="fw-bold">Ingrese sus datos</h3>

            <div className="text-login">
              <p>¿Ya tiene una cuenta?</p>
              <a className="fw-bold" onClick={activarModal}>
                Iniciar sesion
              </a>
              {mostrarModal && (
                <ModalComponent show={mostrarModal} onClose={cerrarModal} />
              )}
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              validateOnChange={true}
            >
              {({ isSubmitting }) => (
                <Form>
                  <h2 className="mb-4">Registro de Usuario</h2>

                  <span className="blockquote-footer">
                    Información personal
                  </span>

                  <div className="form-group mb-4 row">
                    <div className="form-group col-sm-6">
                      <label htmlFor="nombre" className="fw-bold">
                        Nombre (s)
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        placeholder="Nombre y apellidos"
                      />
                      <ErrorMessage
                        name="nombre"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="form-group col-sm-6">
                      <label htmlFor="aPaterno" className="fw-bold">
                        Apellido Paterno
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        id="aPaterno"
                        name="aPaterno"
                        placeholder="Apellido paterno"
                      />
                      <ErrorMessage
                        name="aPaterno"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>

                  <div className="form-group mb-4 row">
                    <div className="form-group col-sm-6">
                      <label htmlFor="aMaterno" className="fw-bold">
                        Apellido Materno
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        id="aMaterno"
                        name="aMaterno"
                        placeholder="Apellido materno"
                        maxLength="10"
                      />
                      <ErrorMessage
                        name="aMaterno"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>

                  <div className="form-group mb-4 row">
                    <div className="form-group col-sm-7">
                      <label htmlFor="sexo" className="fw-bold">
                        Sexo
                      </label>
                      <Field
                        as="select"
                        className="form-select"
                        id="sexo"
                        name="sexo"
                      >
                        <option value="" disabled hidden>
                          Selecciona tu sexo
                        </option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                      </Field>
                      <ErrorMessage
                        name="sexo"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="form-group col-sm-5">
                      <label htmlFor="fecha_nacimiento" className="fw-bold">
                        Fecha de nacimiento
                      </label>
                      <Field
                        type="date"
                        className="form-control"
                        id="fecha_nacimiento"
                        name="fecha_nacimiento"
                        placeholder="fecha_nacimiento"
                      />
                      <ErrorMessage
                        name="fecha_nacimiento"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>

                  <span className="blockquote-footer">Datos de acceso</span>

                  <div className="form-group mb-4 row">
                    <div className="form-group col-sm-7">
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

                    <div className="form-group col-sm-5">
                      <label htmlFor="telefono" className="fw-bold">
                        Teléfono
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        id="telefono"
                        name="telefono"
                        placeholder="Teléfono"
                        maxLength="10"
                      />
                      <ErrorMessage
                        name="telefono"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>

                  <div className="form-group mb-4 row">
                    <div className="form-group col-sm-6">
                      <label htmlFor="preguntaSecreta" className="fw-bold">
                        Pregunta Secreta
                      </label>
                      <Field
                        as="select"
                        className="form-select"
                        id="preguntaSecreta"
                        name="preguntaSecreta"
                      >
                        <option value="" disabled hidden selected>
                          Selecciona tu pregunta secreta
                        </option>
                        <option value="¿Color favorito?">¿Color favorito?</option>
                        <option value="¿Nombre de tu primera mascota?">¿Nombre de tu primera mascota?</option>
                        <option value="¿Equipo de futbol favorito?">¿Equipo de futbol favorito?</option>
                        <option value="¿Deporte favorito?">¿Deporte favorito?</option>
                        <option value="¿Fruta favorita?">¿Fruta favorita?</option>
                      </Field>
                      <ErrorMessage
                        name="preguntaSecreta"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="form-group col-sm-6">
                      <label htmlFor="respuestaPSecreta" className="fw-bold">
                        Respuesta Secreta
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        id="respuestaPSecreta"
                        name="respuestaPSecreta"
                        placeholder="respuestaSecreta"
                      />
                      <ErrorMessage
                        name="respuestaPSecreta"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="form-group col-sm-6">
                      <label htmlFor="contraseña" className="fw-bold">
                        Contraseña
                      </label>
                      <PasswordField
                        id="contraseña"
                        name="contraseña"
                        placeholder="Contraseña"
                        validations={(password) =>
                          validationSchema.fields.contraseña.validSync(password)
                        }
                      />
                    </div>

                    <div className="form-group col-sm-6">
                      <label htmlFor="RContraseña" className="fw-bold">
                        Confirmar contraseña
                      </label>
                      <div className="input-group">
                        <Field
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          id="RContraseña"
                          name="RContraseña"
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
                        name="RContraseña"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>

                  <div className="form-group col-sm-12 mb-4">
                    <div className="form-check">
                      <Field
                        type="checkbox"
                        className="form-check-input"
                        id="aceptaTerminos"
                        name="aceptaTerminos"
                        checked={aceptaTerminos}
                        onChange={(e) => setAceptaTerminos(e.target.checked)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="aceptaTerminos"
                      >
                        Acepto los{" "}
                        <strong>
                          <Link
                            to="/terms-cond"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Términos y condiciones
                          </Link>{" "}
                        </strong>
                      </label>
                    </div>
                    <ErrorMessage
                      name="aceptaTerminos"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="form-group mb-4 ">
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

                  <div className="cont-btn">
                    <button className="btn-secondary" onClick={handleBack}>Cancelar</button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={
                        !capchaValue ||
                        captchaExpired ||
                        isSubmitting ||
                        !aceptaTerminos
                      }
                    >
                      {isSubmitting ? "Registrando..." : "Registrar"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
