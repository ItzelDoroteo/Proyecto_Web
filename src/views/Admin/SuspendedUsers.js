import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdFilterAlt, MdDeleteForever } from "react-icons/md";

const Empleados = ({ title }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 15;

  const [filterCorreo, setFilterCorreo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchUsuarios();
    fetchStatuses();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products/status/getAll');
      setStatuses(response.data);
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  const handleToggle = async (userId, habilitado) => {
    try {
      const nuevoEstado = habilitado ? 1 : 2;
      await axios.put(`http://localhost:5000/admin/status/${userId}`, {
        statusId: nuevoEstado,
      });

      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id === userId ? { ...usuario, statusId: nuevoEstado } : usuario
        )
      );
      fetchUsuarios();
      toast.success("Status del usuario actualizado correctamente")

    } catch (error) {
      toast.error("Error al actualizar el status del usuario")
      console.error("Error al actualizar usuario:", error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/users/searchAdvance', {
        correo: filterCorreo,
        statusId: filterStatus
      });
      console.log(response.data)
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleClearFilters = () => {
    setFilterCorreo('');
    setFilterStatus('');
    fetchUsuarios();
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = usuarios.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(usuarios.length / employeesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>
                {title} |<small> Suspencion de usuarios</small>
              </h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">{title}</a>
                </li>
                <li className="breadcrumb-item active">Suspencion de usuarios</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Usuarios Registrados</h3>
          </div>
          <div className="card-body">
            <div className="col-sm-12">
              <form onSubmit={handleSearch}>
                <div className="form-group row">
                  <label htmlFor="filterCorreo" className="col-sm-2 col-form-label">
                    Correo:
                  </label>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className="form-control"
                      id="filterCorreo"
                      name="filterCorreo"
                      placeholder="Ingrese el correo"
                      value={filterCorreo}
                      onChange={(e) => setFilterCorreo(e.target.value)}
                    />
                  </div>
                  <label htmlFor="filterStatus" className="col-sm-2 col-form-label">
                    Estatus:
                  </label>
                  <div className="col-sm-3">
                    <select
                      className="form-control"
                      id="filterStatus"
                      name="filterStatus"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">Seleccione un estatus</option>
                      {statuses.map(status => (
                        <option key={status.statusId} value={status.statusId}>
                          {status.status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-sm-1">
                    <button type="submit" className="btn btn-success">
                      <MdFilterAlt size={25} />
                    </button>
                  </div>
                  <div className="col-sm-2">
                    <button type="button" className="btn btn-secondary" onClick={handleClearFilters}>
                      Limpiar <MdDeleteForever size={25}/>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <hr className="border border-primary border-3 opacity-75" />

            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover table-sm">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th className="item-center">Status</th>
                    <th className="item-center">Habilitar / Deshabilitar</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.length > 0 ? (
                    currentEmployees.map((usuario, index) => (
                      <tr key={usuario.id}>
                        <td>
                          <h5>{usuario.nombre} {usuario.aPaterno} {usuario.aMaterno}</h5>
                          <span className="mb-4">{usuario.correo}</span>
                        </td>
                        <td className="item-center">
                          {statuses.find(status => status.statusId === usuario.statusId)?.status || "Desconocido"}
                        </td>
                        <td className="item-center">
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={usuario.statusId === 1}
                              onChange={(e) =>
                                handleToggle(usuario.customerId, e.target.checked)
                              }
                            />
                            <span className="slider round"></span>
                          </label>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="item-center">
                        No se encontraron empleados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer">
            <nav>
              <ul className="pagination justify-content-center" style={{ marginBottom: 80 }}>
                {pageNumbers.map((number) => (
                  <li
                    key={number}
                    className={`page-item ${
                      currentPage === number ? "active" : ""
                    }`}
                  >
                    <a
                      onClick={handleClick}
                      className="page-link"
                      id={number}
                      href="#"
                    >
                      {number}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Empleados;
