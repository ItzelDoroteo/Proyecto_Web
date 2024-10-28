import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { MdUpdate, MdDeleteForever } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const PrecioEnvios = ({ title }) => {
  const [colonias, setColonias] = useState([]);
  const [coloniaSeleccionada, setColoniaSeleccionada] = useState("");
  const [precioActual, setPrecioActual] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [reloadColonias, setReloadColonias] = useState(false);

  useEffect(() => {
    const fetchColonias = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/address/get-colonias/43000"
        );
        setColonias(response.data);
      } catch (error) {
        console.error("Error al obtener las colonias:", error);
      }
    };

    fetchColonias();
  }, [reloadColonias]);

  const handleColoniaChange = (event) => {
    const selectedColoniaId = event.target.value;
    setColoniaSeleccionada(selectedColoniaId);

    const selectedColonia = colonias.find(
      (colonia) => colonia.id === parseInt(selectedColoniaId)
    );
    if (selectedColonia) {
      setPrecioActual(selectedColonia.envio);
    }
  };

  const handleBusquedaChange = (event) => {
    const value = event.target.value || "";
    setBusqueda(value.toLowerCase());
  };

  const handleLimpiarBusqueda = () => {
    setBusqueda("");
  };

  const handleActualizarPrecio = async (values, { resetForm }) => {
    try {
      await axios.put(
        `http://localhost:5000/address/colonias/${coloniaSeleccionada}`,
        {
          nuevoEnvio: values.newPrecio,
        }
      );
      toast.success("¡Precio actualizado exitosamente!");

      setColonias((prevColonias) =>
        prevColonias.map((colonia) =>
          colonia.id === parseInt(coloniaSeleccionada)
            ? { ...colonia, envio: values.newPrecio }
            : colonia
        )
      );

      setPrecioActual(values.newPrecio);
      resetForm();
    } catch (error) {
      console.error("Error al actualizar el precio:", error);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const coloniasFiltradas = colonias.filter((colonia) =>
    colonia.colonia.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>
                {title} |<small> Precio por envio</small>
              </h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">{title}</a>
                </li>
                <li className="breadcrumb-item active">Precio por envio</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content mr-4 ml-4">
        <Formik
          initialValues={{ newPrecio: "" }}
          onSubmit={handleActualizarPrecio}
          validationSchema={Yup.object().shape({
            newPrecio: Yup.number()
              .min(0, "El precio debe ser mayor a 0")
              .notOneOf(
                [precioActual],
                "El nuevo precio debe ser diferente al precio actual"
              )
              .required("El nuevo precio es requerido"),
          })}
        >
          {({ handleSubmit, isValid }) => (
            <Form onSubmit={handleSubmit}>
              <div className="row">
                <div className="form-group row">
                  <div className="col-md-2">
                    <label htmlFor="search" className="fw-bold">
                      Buscar colonia:{" "}
                    </label>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      name="search"
                      className="form-control"
                      placeholder="Buscar colonia..."
                      value={busqueda}
                      onChange={handleBusquedaChange}
                    />
                  </div>
                  <div className="col-md-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleLimpiarBusqueda}
                    >
                      Limpiar <MdDeleteForever size={25}/>
                    </button>
                  </div>
                </div>
                <hr
                  className="hr my-4 hr-info"
                  style={{
                    backgroundColor: "blue",
                    color: "blue",
                    height: "1px",
                  }}
                />

                <div className="form-group row">
                  <div className="col-md-6">
                    <div className="row">
                      <label htmlFor="coloniaSelect">
                        Selecciona una Colonia:
                      </label>
                      <select
                        name="coloniaSelect"
                        className="form-select"
                        onChange={handleColoniaChange}
                      >
                        <option value="" disabled hidden selected>
                          Selecciona la colonia
                        </option>
                        {coloniasFiltradas.map((colonia) => (
                          <option key={colonia.id} value={colonia.id}>
                            {colonia.colonia}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="row">
                      <label htmlFor="precio">Precio actual: </label>
                    </div>
                    <input
                      type="number"
                      name="precio"
                      className="form-control"
                      value={precioActual}
                      readOnly
                    />
                  </div>
                  <div className="col-md-3">
                    <div className="row">
                      <label htmlFor="newPrecio">Nuevo precio: </label>
                    </div>
                    <Field
                      type="number"
                      name="newPrecio"
                      className="form-control"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-warning ml-2"
                  disabled={!isValid || !coloniaSeleccionada}
                >
                  Actualizar Precio <MdUpdate size={25} />
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <hr
          className="hr my-4 hr-info"
          style={{
            backgroundColor: "blue",
            color: "blue",
            height: "1px",
          }}
        />
        <div className="col-md-12 text-center mb-4">
          <Button variant="primary" onClick={toggleModal}>
            Ver Mapa
          </Button>

          <Modal show={showModal} onHide={toggleModal} size="xl">
            <Modal.Header closeButton>
              <Modal.Title>Mapa de Huejutla</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img
                src="/images/mapa-huejutla.png"
                alt="Mapa de Huejutla"
                style={{ width: "100%" }}
              />
            </Modal.Body>
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default PrecioEnvios;
