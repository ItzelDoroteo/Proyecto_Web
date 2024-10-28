import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdAddCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre del producto es obligatorio'),
  categoriaId: Yup.string().required('La categoría es obligatoria'),
  descripcion: Yup.string().required('La descripción es obligatoria'),
  precio: Yup.number().positive('El precio debe ser un número positivo').required('El precio es obligatorio'),
  existencia: Yup.number().integer('El stock debe ser un número entero').positive('El stock debe ser un número positivo').required('El stock es obligatorio'),
});

const AddProduct = ({ title }) => {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const initialValues = {
    nombre: '',
    categoriaId: '',
    descripcion: '',
    imagen: null,
    precio: '',
    existencia: '',
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      console.log("Values:", values);
      const formData = new FormData();
      formData.append("nombre", values.nombre);
      formData.append("categoriaId", values.categoriaId);
      formData.append("descripcion", values.descripcion);
      formData.append("precio", values.precio);
      formData.append("existencia", values.existencia);
      formData.append("imagen", values.imagen);

      console.log("FormData:", formData);

      const response = await axios.post('http://localhost:5000/products/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      toast.success('¡Producto registrado exitosamente!');
      setTimeout(() => {
        navigate("/admin/inventory"); // Redirige al panel de administración
      }, 2800);
    } catch (error) {
      if (error.response) {
        const responseData = error.response.data;
        if (responseData.error) {
          toast.error(responseData.error);
        } else {
          toast.error('Error al registrar el producto. Por favor, inténtalo de nuevo.');
        }
      } else {
        console.error(error);
        toast.error('Error de conexión. Por favor, verifica tu conexión a Internet e inténtalo de nuevo más tarde.');
      }
      setErrors({ submit: 'Error al registrar el producto' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-wrapper">
      {/* Content Header */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>
                {title} |<small> Agregar</small>
              </h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">{title}</a>
                </li>
                <li className="breadcrumb-item active">
                  Agregar nuevo producto
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Agregar Nuevo Producto</h3>
          </div>
          <div className="card-body">
            <div className="text-center mb-4">
              <img
                src={previewImage || "/images/Icono-producto.png"}
                alt="Producto"
                className="img-fluid rounded-circle"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </div>
            <hr className="border border-primary border-3 opacity-75" />

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form>
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre del producto</label>
                    <Field type="text" id="nombre" name="nombre" className="form-control" />
                    <ErrorMessage name="nombre" component="div" className="text-danger" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <Field as="textarea" id="descripcion" name="descripcion" className="form-control" />
                    <ErrorMessage name="descripcion" component="div" className="text-danger" />
                  </div>
                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="precio">Precio</label>
                        <Field type="number" id="precio" name="precio" className="form-control" />
                        <ErrorMessage name="precio" component="div" className="text-danger" />
                      </div>
                      <div className="col-md-3">
                        <label htmlFor="existencia">Existencia</label>
                        <Field type="number" id="existencia" name="existencia" className="form-control" />
                        <ErrorMessage name="existencia" component="div" className="text-danger" />
                      </div>
                      <div className="col-md-5">
                        <label htmlFor="categoriaId">Categoría</label>
                        <Field as="select" id="categoriaId" name="categoriaId" className="form-select">
                          <option value="" disabled hidden>
                            Seleccione la categoría
                          </option>
                          <option value="1">Peluches</option>
                          <option value="2">Muñecos</option>
                          <option value="3">Juegos de mesa</option>
                          <option value="4">Juguetes electrónicos</option>
                          <option value="5">Balones / Pelotas</option>
                        </Field>
                        <ErrorMessage name="categoriaId" component="div" className="text-danger" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="imagen">Imagen del producto</label>
                    <input
                      id="imagen"
                      name="imagen"
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue("imagen", file);

                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPreviewImage(reader.result);
                        };
                        if (file) {
                          reader.readAsDataURL(file);
                        } else {
                          setPreviewImage(null);
                        }
                      }}
                    />
                    <ErrorMessage name="imagen" component="div" className="text-danger" />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary ml-3" disabled={isSubmitting} style={{ marginBottom: 80 }}>
                      {isSubmitting ? 'Registrando...' : 'Registrar'} <MdAddCircle size={25} />
                    </button>
                    <ErrorMessage name="submit" component="div" className="text-danger" />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </section>
      {/* /.content */}
    </div>
  );
};

export default AddProduct;
