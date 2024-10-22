import React from "react";
import { useLocation } from "react-router-dom";

import { BreadCrumb } from 'primereact/breadcrumb';
        
import { MdHome } from "react-icons/md";

const aliasMapping = {
  "product": "Detalle del Producto",
  "privacy-policy": "Política de Privacidad",
  "terms-cond": "Términos y Condiciones",
  "cookies": "Cookies",
  "quienes-somos": "Acerca De",
  "registro": "Registro",
  "new-address": "Nueva Dirección",
  "user-profile": "Perfil de Usuario",
  "checkup": "Carrito de Compras",
  "purchase-history": "Historial de Compra",
  "back": "Regresar",
  "error-500": "Error 500",
  "forgot-password": "Recuperar Contraseña",
  "change-password": "Cambiar contraseña",
  "forgot-passworg-secret-question": "Recuperar cuenta por pregunta secreta",
  "mas-vendidos": "Productos más vendidos",
  "category": "Categoria",
  "update-address": "Actualizar dirección",
  "ofertas": "Productos en oferta",
  "notifications": "Notificaciones",
  "FAQs": "Preguntas frecuentes",
  "select-address": "Selección método de entrega",
  "select-payment": "Selección forma de pago"
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Configuración de los elementos del breadcrumb
  const breadcrumbItems = pathnames.map((pathname, index) => ({
    label: aliasMapping[pathname] || pathname,
    url: `/${pathnames.slice(0, index + 1).join("/")}`
  }));

  // Elemento inicial (home)
  const home = { icon: <MdHome />, url: '/' };

  return (
    <div className="cont-breadcrumbs">
      <BreadCrumb model={breadcrumbItems} home={home} />
    </div>
  );
};

export default Breadcrumbs;
