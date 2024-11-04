import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import EmployRoutes from "./routes/EmployRoutes";
import { AuthProvider } from "./context/AuthContext";
import { PrimeReactProvider } from "primereact/api";
import { AlertProvider } from "./context/AlertContext";
import { requestNotificationPermission } from "./firebaseMessaging";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";

import "primeicons/primeicons.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  useEffect(() => {
    // Solicita el permiso de notificación al cargar la aplicación
    requestNotificationPermission();

    // Agregar el script de integración de UserWay
    const userwayScript = document.createElement("script");
    userwayScript.src = "https://cdn.userway.org/widget.js";
    userwayScript.async = true;
    userwayScript.setAttribute("data-account", "rkULxaRfQO"); // Reemplaza con tu ID de cuenta de UserWay
    document.head.appendChild(userwayScript);

    // Agregar el script de integración de Tidio
    // const tidioScript = document.createElement("script");
    // tidioScript.src = "//code.tidio.co/ruymp7hqbh9vwln4cmdmkh0vczoxefun.js";
    // tidioScript.async = true;
    // document.head.appendChild(tidioScript);

    // Limpieza al desmontar el componente
    return () => {
      document.head.removeChild(userwayScript);
      // document.head.removeChild(tidioScript);
    };
  }, []);
  return (
    <PrimeReactProvider>
      <AlertProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/*" element={<PublicRoutes />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
              <Route path="/employ/*" element={<EmployRoutes />} />
            </Routes>
            <ToastContainer autoClose={2000} closeOnClick={true} />
          </Router>
        </AuthProvider>
      </AlertProvider>
    </PrimeReactProvider>
  );
}

export default App;
