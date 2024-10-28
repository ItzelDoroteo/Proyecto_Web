import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = ({ title }) => {
  const [data, setData] = useState({
    productos: 0,
    ventas: 0,
    notificaciones: 0,
    usuariosSuspendidos: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Realiza las solicitudes a la API
        const productosResponse = await axios.get(
          "http://localhost:5000/products"
        );
        const ventasResponse = await axios.get(
          "http://localhost:5000/ventas"
        );
        const notificacionesResponse = await axios.get(
          "http://localhost:5000/admin/notification/1"
        );
        const usuariosSuspendidosResponse = await axios.get(
          "http://localhost:5000/users"
        );

        // Filtrar usuarios suspendidos excluyendo aquellos con statusId = 1
        const filteredUsuariosSuspendidos =
          usuariosSuspendidosResponse.data.filter(
            (user) => user.statusId !== 1
          );
        // Suponiendo que ventasResponse.data es un array de ventas con un campo 'fecha' en formato YYYY-MM-DD
        const ventas = ventasResponse.data;

        // Obtener el mes y el año actuales
        const now = new Date();
        const currentMonth = now.getMonth(); // Enero es 0, Febrero es 1, etc.
        const currentYear = now.getFullYear();

        // Filtrar las ventas para que solo incluyan las del mes en curso
        const ventasDelMes = ventas.filter((venta) => {
          const fecha = new Date(venta.fecha); // Convertir la fecha en formato Date
          return (
            fecha.getMonth() === currentMonth &&
            fecha.getFullYear() === currentYear
          );
        });
        // Actualiza el estado con los datos obtenidos
        setData({
          productos: productosResponse.data.length, // Ajusta esto según la estructura de la respuesta de tu API
          ventas: ventasDelMes.length, // Ajusta esto según la estructura de la respuesta de tu API
          notificaciones: notificacionesResponse.data.length, // Ajusta esto según la estructura de la respuesta de tu API
          usuariosSuspendidos: filteredUsuariosSuspendidos.length, // Ajusta esto según la estructura de la respuesta de tu API
        });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="content-wrapper">
      {/* Content Header */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>
                {title} |<small> Panel administrativo</small>
              </h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">{title}</a>
                </li>
                <li className="breadcrumb-item active">Panel administrativo</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="content">
        {/* Imagen de bienvenida */}
        <div className="card mb-4">
          <div className="card-body">
            <h2 className="primary-text">
              ¡Bienvenido al panel administrativo!
            </h2>
            <img
              src="/images/Welcome.jpg"
              className="card-img-top"
              alt="Bienvenida"
              style={{ height: 250 }}
            />
            <p className="card-text">
              Aquí puedes gestionar todas las funciones administrativas de{" "}
              {title}. Utiliza los accesos rápidos a continuación para empezar.
            </p>
          </div>
        </div>

        {/* Tarjetas de acceso rápido */}
        <div className="row">
          <div className="col-lg-3 col-6">
            <div className="small-box bg-info">
              <div className="inner">
                <h3>{data.productos}</h3>
                <p>Productos</p>
              </div>
              <div className="icon">
                <i className="ion ion-bag"></i>
              </div>
              <Link to="/admin/inventory" className="small-box-footer">
                Más info <i className="fas fa-arrow-circle-right"></i>
              </Link>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box bg-success">
              <div className="inner">
                <h3>{data.ventas}</h3>
                <p>Ventas del mes</p>
              </div>
              <div className="icon">
                <i className="ion ion-stats-bars"></i>
              </div>
              <Link to="/admin/sales-statictics" className="small-box-footer">
                Más info <i className="fas fa-arrow-circle-right"></i>
              </Link>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box bg-warning">
              <div className="inner">
                <h3>{data.notificaciones}</h3>
                <p>Notificaciones</p>
              </div>
              <div className="icon">
                <i className="ion ion-alert"></i>
              </div>
              <Link to="/admin/notificationsAdmin" className="small-box-footer">
                Más info <i className="fas fa-arrow-circle-right"></i>
              </Link>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box bg-danger">
              <div className="inner">
                <h3>{data.usuariosSuspendidos}</h3>
                <p>Usuarios suspendidos</p>
              </div>
              <div className="icon">
                <i className="ion ion-person-add"></i>
              </div>
              <Link to="/admin/suspended-users" className="small-box-footer">
                Más info <i className="fas fa-arrow-circle-right"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Sección de anuncios o noticias */}
        <div className="card">
          <h2 className="primary-text ml-4 mt-2">Anuncios</h2>
          <div className="card-body">
            <ul style={{ marginBottom: 100 }}>
              <li>Nueva función de gestión de promociones disponible.</li>
              <li>Actualización de Cosots de envio.</li>
              <li>Actualizacion de Precios de los productos.</li>
              <li>Actualizacion de la existencia de los productos.</li>
            </ul>
          </div>
        </div>
      </section>
      {/* /.content */}
    </div>
  );
};

export default Home;
