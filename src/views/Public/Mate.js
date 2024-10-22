import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";

function GrowthRateCalculator() {
  const [time, setTime] = useState("");
  const [rate, setRate] = useState("");
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ventas, setVentas] = useState("");
  const [diffDays, setDiffDays] = useState([]);
  const [salesData, setSalesData] = useState([]);

  const calculateRate = () => {
    const amt = parseFloat(product);
    setVentas(amt);

    // Calcular la diferencia en días entre las fechas
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDiffDays(diffDays);

    if (!isNaN(amt) && amt > 0 && diffDays > 0) {
      const calculatedRate = Math.log(amt) / diffDays;
      setRate(calculatedRate.toFixed(4));
      setTime(diffDays);

      // Generar datos de ventas para la gráfica
      generateSalesData(calculatedRate);
    } else {
      setRate(
        "Ingrese una cantidad válida y seleccione un rango de fechas válido."
      );
    }
  };

  const generateSalesData = (calculatedRate) => {
    const salesData = [];
    for (let i = 300; i <= 700; i += 100) {
      const time = (Math.log(i) / calculatedRate).toFixed(2);
      salesData.push({ time, sales: i });
    }
    setSalesData(salesData);
  };

  useEffect(() => {
    if (salesData.length > 0) {
      const ctx = document.getElementById("salesChart");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: salesData.map((data) => data.time),
          datasets: [
            {
              label: "Ventas",
              data: salesData.map((data) => data.sales),
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Tiempo en días",
              },
            },
            y: {
              title: {
                display: true,
                text: "Ventas",
              },
            },
          },
        },
      });
    }
  }, [salesData]);

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-center text-primary">Calculadora de Tasa de Crecimiento</h2>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Categoría:</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Selecciona una categoría</option>
                <option value="Peluches">Peluches</option>
                <option value="Juegos de mesa">Juegos de mesa</option>
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Producto:</label>
              <select
                className="form-select"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              >
                <option value="">Selecciona un producto</option>
                {category === "Peluches" ? (
                  <>
                    <option value="225">Peluche Capibara</option>
                    <option value="170">Peluche Stich</option>
                  </>
                ) : category === "Juegos de mesa" ? (
                  <>
                    <option value="110">Ajedrez</option>
                    <option value="75">Domino</option>
                  </>
                ) : null}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <h5>Filtrar por fecha:</h5>
          <div className="row">
            <div className="col-md-3">
              <input
                type="date"
                name="fechaInicial"
                className="form-control mb-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <input
                type="date"
                name="fechaFinal"
                className="form-control mb-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button onClick={calculateRate} className="btn btn-primary">
          Calcular Tasa de Crecimiento
        </button>

        <div className="row">
          <div className="col-md-6 mt-4">
            <h3>Valores de Ci:</h3>
            <p>Ventas producto: 0</p>
            <p>Tiempo: 0 días</p>
          </div>

          <div className="col-md-6 mt-4">
            <h3>Valores de K:</h3>
            <p>Proporcion de crecimiento: {rate}</p>
            <p>Ventas producto: {ventas}</p>
            <p>Tiempo: {diffDays} días</p>
          </div>
        </div>

        {rate && (
          <div className="mt-3">
            <h3>Gráfica de Ventas</h3>
            <canvas id="salesChart" width="400" height="200"></canvas>
          </div>
        )}

        {rate && (
          <div className="mt-3">
            <h3>Tabla de Ventas</h3>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Tiempo en días</th>
                    <th scope="col">Ventas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{(Math.log(300) / rate).toFixed(2)}</td>
                    <td>300</td>
                  </tr>
                  <tr>
                    <td>{(Math.log(400) / rate).toFixed(2)}</td>
                    <td>400</td>
                  </tr>
                  <tr>
                    <td>{(Math.log(500) / rate).toFixed(2)}</td>
                    <td>500</td>
                  </tr>
                  <tr>
                    <td>{(Math.log(600) / rate).toFixed(2)}</td>
                    <td>600</td>
                  </tr>
                  <tr>
                    <td>{(Math.log(700) / rate).toFixed(2)}</td>
                    <td>700</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GrowthRateCalculator;
