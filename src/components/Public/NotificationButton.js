import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdMail } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";

function NotificationButton() {
  const { token } = useAuth();
  const [decodedToken, setDecodedToken] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setDecodedToken(decoded);
    }
  }, [token]);

  useEffect(() => {
    if (decodedToken && decodedToken.customerId) {
      fetch(
        `http://localhost:5000/users/getAllNotifications/${decodedToken.customerId}`
      )
        .then((response) => response.json())
        .then((data) => {
          setNotifications(data);
        })
        .catch((error) => console.error("Error fetching notifications:", error));
    }
  }, [decodedToken]);

  const unreadNotifications = notifications.filter(notification => notification.estado === "No leído");

  const buttonStyle = {
    borderRadius: "100%",
    width: "70px",
    height: "70px",
    backgroundColor: "#f8c6f9",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    bottom: "10px",
    right: "10px",
    zIndex: "1000",
  };


  return (
    <>
      <Link to="/notifications" className="btn btn-secondary" style={buttonStyle}>
        <MdMail size={50} />
        {/* Agregar el span para mostrar el conteo de notificaciones no leídas */}
        {unreadNotifications.length > 0 && (
          <span className="text-center" style={{ position: 'absolute', top: '-10px', right: '-2px', backgroundColor: 'red', color: 'white', borderRadius: '100%', padding: '5px', fontSize: '14px', width: '30px', height: '30px' }}>
            {unreadNotifications.length}
          </span>
        )}
      </Link>
    </>
  );
}

export default NotificationButton;
