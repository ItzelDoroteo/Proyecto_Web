import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdEdit, MdSave, MdCancel } from "react-icons/md";

const Nosotros = ({ title }) => {
  const [nosotrosData, setNosotrosData] = useState({
    descripcion: "",
    quienesSomos: "",
    mision: "",
    vision: "",
    facebook: "",
    correo: "",
    telefono: "",
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/getNosotros/1"
      );
      setNosotrosData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:5000/admin/updateNosotros/1",
        nosotrosData
      );
      fetchData();
      setEditing(false);
      toast.success("Información actualizada exitosamente.");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Error al actualizar la información.");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    fetchData(); // Re-fetch data to reset form
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNosotrosData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title">Información Nosotros</h3>
          </div>
          <div className="card-body">
            <form>

            <div className="form-group text-right">
  {editing ? (
    <>
      <button
        type="button"
        className="mb-4 btn btn-success mr-4"
        onClick={handleSave}
      >
        Guardar <MdSave scale={25}/>
      </button>
      <button
        type="button"
        className="mb-4 btn btn-secondary"
        onClick={handleCancel}
      >
        Cancelar <MdCancel scale={25}/>
      </button>
    </>
  ) : (
    <button
      type="button"
      className="mb-4 btn btn-warning"
      onClick={() => setEditing(true)}
    >
      Editar <MdEdit scale={25}/>
    </button>
  )}
</div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  className="form-control"
                  id="descripcion"
                  name="descripcion"
                  rows="10"
                  value={nosotrosData.descripcion}
                  onChange={handleChange}
                  readOnly={!editing}
                />
              </div>
              <div className="form-group">
                <label htmlFor="quienesSomos">Quiénes Somos</label>
                <textarea
                  className="form-control"
                  id="quienesSomos"
                  name="quienesSomos"
                  rows="3"
                  value={nosotrosData.quienesSomos}
                  onChange={handleChange}
                  readOnly={!editing}
                />
              </div>
              <div className="form-group">
                <label htmlFor="mision">Misión</label>
                <textarea
                  className="form-control"
                  id="mision"
                  name="mision"
                  rows="3"
                  value={nosotrosData.mision}
                  onChange={handleChange}
                  readOnly={!editing}
                />
              </div>
              <div className="form-group">
                <label htmlFor="vision">Visión</label>
                <textarea
                  className="form-control"
                  id="vision"
                  name="vision"
                  rows="3"
                  value={nosotrosData.vision}
                  onChange={handleChange}
                  readOnly={!editing}
                />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="facebook">Facebook</label>
                    <input
                      type="text"
                      className="form-control"
                      id="facebook"
                      name="facebook"
                      value={nosotrosData.facebook}
                      onChange={handleChange}
                      readOnly={!editing}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="correo">Correo</label>
                    <input
                      type="email"
                      className="form-control"
                      id="correo"
                      name="correo"
                      value={nosotrosData.correo}
                      onChange={handleChange}
                      readOnly={!editing}
                    />
                  </div>
                </div>
              </div>
              <div className="row"  style={{ marginBottom: 50 }}>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="text"
                      className="form-control"
                      id="telefono"
                      name="telefono"
                      value={nosotrosData.telefono}
                      onChange={handleChange}
                      readOnly={!editing}
                    />
                  </div>
                </div>
              </div>

              
            </form>
          </div>
        </div>
      </section>
      {/* /.content */}
    </div>
  );
};

export default Nosotros;
