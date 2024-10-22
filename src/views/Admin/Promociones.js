import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdEdit, MdSave, MdCancel, MdAddCircle } from "react-icons/md";

const Promociones = ({ title }) => {
  const [promocionesData, setPromocionesData] = useState([]);
  const [categoriasData, setCategoriasData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedPromocionId, setSelectedPromocionId] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPromocion, setNewPromocion] = useState({
    evento: "",
    fecha_inicio: "",
    fecha_final: "",
    descuento: "",
    categoriaId: "",
  });

  useEffect(() => {
    fetchPromociones();
    fetchCategorias();
  }, []);

  const fetchPromociones = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/getPromociones"
      );
      setPromocionesData(response.data);
    } catch (error) {
      console.error("Error fetching promociones:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/products/categories/getAll"
      );
      setCategoriasData(response.data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const handleSave = async (promocionId) => {
    try {
      const promocion = promocionesData.find(
        (p) => p.promocionId === promocionId
      );
      await axios.put(
        `http://localhost:5000/admin/updatePromociones/${promocionId}`,
        promocion
      );
      fetchPromociones();
      setEditingId(null);
      toast.success("Promoción actualizada exitosamente.");
    } catch (error) {
      console.error("Error updating promocion:", error);
      alert("Error al actualizar la promoción.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    fetchPromociones(); // Re-fetch data to reset form
  };

  const handleChange = (e, promocionId) => {
    const { name, value } = e.target;
    setPromocionesData((prevData) =>
      prevData.map((promocion) =>
        promocion.promocionId === promocionId
          ? { ...promocion, [name]: value }
          : promocion
      )
    );
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewPromocion((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddSave = async () => {
    try {
      await axios.post(
        "http://localhost:5000/admin/createPromociones",
        newPromocion
      );
      fetchPromociones();
      setShowAddForm(false);
      setNewPromocion({
        evento: "",
        fecha_inicio: "",
        fecha_final: "",
        descuento: "",
        categoriaId: "",
      });
      toast.success("Promoción agregada exitosamente.");
    } catch (error) {
      console.error("Error adding promocion:", error);
      alert("Error al agregar la promoción.");
    }
  };

  const handleAddCancel = () => {
    setShowAddForm(false);
    setNewPromocion({
      evento: "",
      fecha_inicio: "",
      fecha_final: "",
      descuento: "",
      categoriaId: "",
    });
  };

  return (
    <div className="content-wrapper">
      {/* Content Header */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>
                {title} |<small> Promociones</small>
              </h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">{title}</a>
                </li>
                <li className="breadcrumb-item active">Promociones</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="content">
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title">Gestor de promociones</h3>
            <button
              type="button"
              className="btn btn-primary float-right"
              onClick={() => setShowAddForm(true)}
            >
              Agregar Promoción <MdAddCircle size={20} />
            </button>
          </div>
          <div className="card-body">
            {showAddForm && (
              <form>
                <div className="form-group">
                  <label>Evento</label>
                  <input
                    type="text"
                    className="form-control"
                    name="evento"
                    value={newPromocion.evento}
                    onChange={handleAddChange}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>Fecha Inicio</label>
                    <input
                      type="date"
                      className="form-control"
                      name="fecha_inicio"
                      value={newPromocion.fecha_inicio}
                      onChange={handleAddChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Fecha Final</label>
                    <input
                      type="date"
                      className="form-control"
                      name="fecha_final"
                      value={newPromocion.fecha_final}
                      onChange={handleAddChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>Descuento %</label>
                    <input
                      type="number"
                      className="form-control"
                      name="descuento"
                      value={newPromocion.descuento}
                      onChange={handleAddChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Categoría</label>
                    <select
                      className="form-control"
                      name="categoriaId"
                      value={newPromocion.categoriaId}
                      onChange={handleAddChange}
                    >
                      <option value="" disabled hidden>
                        Seleccione una categoría
                      </option>
                      {categoriasData.map((categoria) => (
                        <option
                          key={categoria.categoriaId}
                          value={categoria.categoriaId}
                        >
                          {categoria.categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="text-right mt-4">
                  <button
                    type="button"
                    className="btn btn-success mr-2"
                    onClick={handleAddSave}
                  >
                    Guardar <MdSave size={20} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleAddCancel}
                  >
                    Cancelar <MdCancel size={20} />
                  </button>
                </div>
                <hr className="border border-primary border-3 opacity-75"/>
              </form>
            )}

            <div className="form-group">
              <label>Seleccione una promoción</label>
              <select
                className="form-select"
                value={selectedPromocionId}
                onChange={(e) => setSelectedPromocionId(e.target.value)}
              >
                <option value="" disabled selected>
                  Seleccione una promoción
                </option>
                {promocionesData.map((promocion) => (
                  <option key={promocion.promocionId} value={promocion.promocionId}>
                    {promocion.evento}
                  </option>
                ))}
              </select>
            </div>
            <hr className="border border-primary border-3 opacity-75"/>

            {promocionesData
              .filter((promocion) => promocion.promocionId === parseInt(selectedPromocionId, 10))
              .map((promocion) => (
                <form key={promocion.promocionId}>
                  <div className="form-group text-right">
                    {editingId === promocion.promocionId ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-success mr-4"
                          onClick={() => handleSave(promocion.promocionId)}
                        >
                          Guardar <MdSave scale={25} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleCancel}
                        >
                          Cancelar <MdCancel scale={25} />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() => setEditingId(promocion.promocionId)}
                      >
                        Editar <MdEdit scale={25} />
                      </button>
                    )}
                  </div>

                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td>
                          <label>Evento</label>
                          <input
                            type="text"
                            className="form-control"
                            name="evento"
                            value={promocion.evento}
                            onChange={(e) => handleChange(e, promocion.promocionId)}
                            readOnly={editingId !== promocion.promocionId}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="row">
                            <div className="col-md-6">
                              <label>Fecha Inicio</label>
                              <input
                                type="date"
                                className="form-control"
                                name="fecha_inicio"
                                value={new Date(promocion.fecha_inicio).toISOString().split("T")[0]}
                                onChange={(e) => handleChange(e, promocion.promocionId)}
                                readOnly={editingId !== promocion.promocionId}
                              />
                            </div>
                            <div className="col-md-6">
                              <label>Fecha Final</label>
                              <input
                                type="date"
                                className="form-control"
                                name="fecha_final"
                                value={new Date(promocion.fecha_final).toISOString().split("T")[0]}
                                onChange={(e) => handleChange(e, promocion.promocionId)}
                                readOnly={editingId !== promocion.promocionId}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="row">
                            <div className="col-md-6">
                              <label>Descuento %</label>
                              <input
                                type="number"
                                className="form-control"
                                name="descuento"
                                value={promocion.descuento}
                                onChange={(e) => handleChange(e, promocion.promocionId)}
                                readOnly={editingId !== promocion.promocionId}
                              />
                            </div>
                            <div className="col-md-6 mb-4">
                              <label>Categoría</label>
                              <select
                                className="form-control"
                                name="categoriaId"
                                value={promocion.categoriaId}
                                onChange={(e) => handleChange(e, promocion.promocionId)}
                                disabled={editingId !== promocion.promocionId}
                              >
                                {categoriasData.map((categoria) => (
                                  <option key={categoria.categoriaId} value={categoria.categoriaId}>
                                    {categoria.categoria}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              ))}
          </div>
        </div>
      </section>
      {/* /.content */}
    </div>
  );
};

export default Promociones;
