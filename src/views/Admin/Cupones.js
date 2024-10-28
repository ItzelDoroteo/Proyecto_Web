import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const CustomerTable = () => {
  const [maxCustomers, setMaxCustomers] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monto, setMonto] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [cupones, setCupones] = useState([]); // Estado para los cupones generados

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener IDs de clientes desde la API de predicción
        const predictResponse = await axios.get('http://127.0.0.1:5000/predict');
        setMaxCustomers(predictResponse.data.max_customers);

        // Obtener la lista de usuarios
        const usuariosResponse = await axios.get('http://localhost:5000/users/');
        setUsuarios(usuariosResponse.data);

        // Habilitar el botón si hay usuarios en la tabla
        if (predictResponse.data.max_customers.length > 0) {
          setIsButtonEnabled(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUserEmail = (customerId) => {
    const user = usuarios.find(user => user.customerId === customerId);
    return user ? user.correo : 'Desconocido';
  };

  const handleGenerateCoupons = async () => {
    try {
      if (monto <= 0) {
        toast.error('El monto debe ser un valor positivo.');
        return;
      }

      // Generar cupones para cada customerId en maxCustomers
      const responses = await Promise.all(
        maxCustomers.map(usuarioId => 
          axios.post('http://localhost:5000/admin/cupones/', {
            monto: parseFloat(monto), // Asegurarse de que el monto sea un número
            usuarioId,
          })
        )
      );

      // Verificar si todas las respuestas fueron exitosas
      const allSuccess = responses.every(response => response.status === 200);
      const cuponesResponse = await axios.get('http://localhost:5000/admin/cupones/');
      setCupones(cuponesResponse.data);

      if (allSuccess) {
        toast.success('Cupones generados exitosamente!');
        // Obtener los cupones generados
      } else {
        toast.error('Algunos cupones no se generaron correctamente.');
      }
    } catch (error) {
      console.error('Error generating coupons:', error);
      toast.error('Error al generar cupones.');
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Clientes con Mayor Total</h3>
          </div>
          <div className="card-body">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-hover table-sm">
                    <thead>
                      <tr>
                        <th>Customer ID</th>
                        <th>Correo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {maxCustomers.map(customerId => (
                        <tr key={customerId}>
                          <td>{customerId}</td>
                          <td>{getUserEmail(customerId)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="form-group mt-3">
                  <label>Monto del cupón:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="Ingrese el monto del cupón"
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={handleGenerateCoupons}
                  disabled={!isButtonEnabled || !monto}
                  style={{ marginBottom: 100 }}
                >
                  Generar Cupones
                </Button>

                {/* Mostrar los cupones generados */}
                {cupones.length > 0 && (
                  <div className="table-responsive mt-3">
                    <table className="table table-striped table-bordered table-hover table-sm">
                      <thead>
                        <tr>
                          <th>Codigo</th>
                          <th>Customer ID</th>
                          <th>Monto</th>
                          <th>Expiracion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cupones.map(cupon => (
                          <tr key={cupon.customerId}>
                            <td>{cupon.codigo}</td>
                            <td>{getUserEmail(cupon.customerId)}</td>
                            <td>{cupon.monto}</td>
                            <td>{new Date(cupon.expiracion).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerTable;
