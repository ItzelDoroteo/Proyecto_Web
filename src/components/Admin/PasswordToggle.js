import React from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const PasswordToggle = ({ showPassword, onToggle }) => (
  <div className="input-group-append">
    <button
      className="btn btn-outline-secondary"
      type="button"
      onClick={onToggle}
    >
      {showPassword ? <MdVisibilityOff size={25} /> : <MdVisibility size={25} />}
    </button>
  </div>
);

export default PasswordToggle;
