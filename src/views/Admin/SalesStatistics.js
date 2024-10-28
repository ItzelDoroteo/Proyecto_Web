import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdFilterAlt, MdDeleteForever } from "react-icons/md";
import { Line, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { Button, Modal } from 'react-bootstrap';

const SalesStatistics = ({ title }) => {
  const [monthlySales, setMonthlySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [leastProducts, setLeastProducts] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    fetchMonthlySales();
    fetchProductDetails();
  }, []);

  const fetchMonthlySales = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/ventas/",
        {
          params: {
            startDate,
            endDate,
          },
        }
      );
      const salesData = response.data;

      // Agrupar ventas por mes
      const groupedSales = salesData.reduce((acc, sale) => {
        const month = new Date(sale.fecha).toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!acc[month]) acc[month] = { total: 0, count: 0 };
        acc[month].total += parseFloat(sale.total);
        acc[month].count += 1;
        return acc;
      }, {});

      const formattedSales = Object.entries(groupedSales).map(([month, data]) => ({
        month,
        total: data.total,
        count: data.count,
      }));

      setMonthlySales(formattedSales);
    } catch (error) {
      console.error("Error fetching monthly sales:", error);
    }
  };

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/ventas/getAllDetailSale"
      );
      const productDetails = response.data;

      const productSales = productDetails.reduce((acc, detail) => {
        const { producto, cantidad } = detail;
        acc[producto] = (acc[producto] || 0) + cantidad;
        return acc;
      }, {});

      const sortedProducts = Object.entries(productSales).sort(
        ([, a], [, b]) => b - a
      );
      const topProducts = sortedProducts
        .slice(0, 10)
        .map(([name, sales]) => ({ name, sales }));
      const leastProducts = sortedProducts
        .slice(-10)
        .map(([name, sales]) => ({ name, sales }));

      setTopProducts(topProducts);
      setLeastProducts(leastProducts);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleFilter = () => {
    fetchMonthlySales();
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    fetchMonthlySales();
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const monthlySalesData = {
    labels: monthlySales.map((sale) => sale.month),
    datasets: [
      {
        label: "Total Ventas Mensuales",
        data: monthlySales.map((sale) => sale.total),
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const topProductsData = {
    labels: topProducts.map((product) => product.name),
    datasets: [
      {
        label: "Top 10 Productos Más Vendidos",
        data: topProducts.map((product) => product.sales),
        backgroundColor: "rgba(153,102,255,0.2)",
        borderColor: "rgba(153,102,255,1)",
        borderWidth: 1,
      },
    ],
  };

  const leastProductsData = {
    labels: leastProducts.map(product => product.name),
    datasets: [
      {
        label: 'Top 10 Productos Menos Vendidos',
        data: leastProducts.map(product => product.sales),
        backgroundColor: leastProducts.map(() => getRandomColor()),
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
      },
    ],
  };

  const printReport = () => {
    window.print();
  };

  const handleViewDetails = async (month) => {
    try {
      const startDate = new Date(`${month} 01, ${new Date().getFullYear()}`);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);
      endDate.setDate(0); // Último día del mes
  
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
      };
  
      const start = formatDate(startDate);
      const end = formatDate(endDate);
  
      const response = await axios.get(
        "http://localhost:5000/ventas/getAll/por-fecha",
        {
          params: {
            startDate: start,
            endDate: end,
          },
        }
      );
      setDetails(response.data);
      setSelectedMonth(month);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching monthly details:", error);
    }
  };
  
  
  

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>
                {title} |<small> Estadísticas de Ventas</small>
              </h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">{title}</a>
                </li>
                <li className="breadcrumb-item active">
                  Estadísticas de Ventas
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Reporte de Ventas Mensuales</h3>
          </div>
          <div className="card-body">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Total Ventas</th>
                  <th>Cantidad de Ventas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {monthlySales.map((sale, index) => (
                  <tr key={index}>
                    <td>{sale.month}</td>
                    <td>$ {sale.total.toFixed(2)}</td>
                    <td>{sale.count}</td>
                    <td>
                      <Button
                        variant="info"
                        onClick={() => handleViewDetails(sale.month)}
                      >
                        Ver Detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Ventas Mensuales</h3>
            <div className="card-tools">
              <div className="row">
                <div className="col-md-9">
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="d-flex justify-content-between">
                    <button
                      onClick={handleFilter}
                      className="btn btn-success"
                      title="Filtrar"
                    >
                      <MdFilterAlt size={25} />
                    </button>
                    <button
                      onClick={handleClear}
                      className="btn btn-danger"
                      title="Limpiar campos"
                    >
                      <MdDeleteForever size={25} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <Line data={monthlySalesData} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top 10 Productos Más Vendidos</h3>
          </div>
          <div className="card-body">
            <Bar data={topProductsData} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top 10 Productos Menos Vendidos</h3>
          </div>
          <div className="card-body mb-4 text-center" style={{height:600}}>
            <Pie data={leastProductsData} style={{marginBottom:50}}/>
          </div>
        </div>

        {modalOpen && (
          <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg">
            <Modal.Header closeButton className="bg-primary">
              <Modal.Title>Detalle de Ventas de {selectedMonth}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <table className="table table-striped table-bordered table-hover table-sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((detalle) => (
                    <tr key={detalle.productoId}>
                      <td>{detalle.producto}</td>
                      <td>{detalle.cantidad}</td>
                      <td>${detalle.precio}</td>
                      <td>${detalle.totalDV}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="row justify-content-between">
                <div className="col-sm-4">
                  <p className="text-secondary fs-6">
                    <strong>Total de la compra: </strong>${details.reduce((acc, item) => acc + item.totalDV, 0)}
                  </p>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cerrar
              </Button>
              <Button variant="primary" onClick={printReport}>
                Imprimir Reporte
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </section>
    </div>
  );
};

export default SalesStatistics;
