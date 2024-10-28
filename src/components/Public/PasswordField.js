import React, { useState } from "react";
import { useField } from "formik";
import zxcvbn from "zxcvbn";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const PasswordField = ({ id, name, placeholder }) => {
  const [field, meta] = useField(name);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    field.onChange(e);
  };

  // Calcula la fortaleza de la contraseña
  const passwordStrength = zxcvbn(password);

  // Utiliza el resultado del cálculo de fortaleza para determinar la clase de color de la barra de progreso
  const score = passwordStrength.score;
  const progressColorClass =
    score === 0
      ? "bg-danger"
      : score === 1
      ? "bg-warning"
      : score === 2
      ? "bg-info"
      : score === 3
      ? "bg-success"
      : "bg-success";

  // Define mensajes de sugerencia para cada nivel de puntuación
  const suggestionMessages = [
    "Muy débil",
    "Débil",
    "Aceptable",
    "Fuerte",
    "Muy fuerte"
  ];

  return (
    <div>
      <div className="input-group">
        <input
          {...field}
          type={showPassword ? "text" : "password"} // Aquí cambiamos el tipo de acuerdo al estado showPassword
          className="form-control"
          id={id}
          name={name}
          placeholder={placeholder}
          value={password}
          onChange={handlePasswordChange}
        />
        {/* Botón para mostrar/ocultar la contraseña */}
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => setShowPassword(!showPassword)} // Función para cambiar el estado showPassword
          >
            {showPassword ? <MdVisibilityOff size={25} /> : <MdVisibility size={25} />}
          </button>
        </div>
      </div>

      {/* Renderiza la barra de progreso y los mensajes de sugerencia */}
      <div className="password-strength-meter">
        <div className="progress">
          <div
            className={`progress-bar ${progressColorClass}`}
            role="progressbar"
            style={{ width: `${(score + 1) * 25}%` }}
            aria-valuenow={score}
            aria-valuemin="0"
            aria-valuemax="4"
          ></div>
        </div>
        <p>Fortaleza de la contraseña: {suggestionMessages[score]}</p>
      </div>

      {/* Renderiza los errores de validación si los hay */}
      {meta.touched && meta.error ? (
        <div className="text-danger">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default PasswordField;
