import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdAddCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es obligatorio'),
  apPaterno: Yup.string().required('El apellido paterno es obligatorio'),
  apMaterno: Yup.string().required('El apellido materno es obligatorio'),
  correo: Yup.string().email('Correo inválido').required('El correo es obligatorio'),
  contraseña: Yup.string().required('La contraseña es obligatoria'),
});

const AddEmployee = ({ title }) => {
  const navigate = useNavigate();
  const initialValues = {
    nombre: '',
    apPaterno: '',
    apMaterno: '',
    Telefono: '',
    CP: '',
    Calle: '',
    Colonia: '',
    Estado: '',
    Ciudad: '',
    NumInterior: '',
    NumExterior: '',
    Referencias: '',
    correo: '',
    contraseña: '',
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    // console.log(values)
    try {
      console.log(values);
      const response = await axios.post('http://localhost:5000/admin/add-employee', values);
      console.log(response.data);
      toast.success('¡Empleado registrado exitosamente!');
      setTimeout(() => {
        navigate("/admin/employs"); // Redirige al panel de administración
      }, 2800);
    } catch (error) {
      if (error.response) {
        const responseData = error.response.data;
        if (responseData.error) {
          toast.error(responseData.error);
        } else {
          toast.error('Error al registrar el empleado. Por favor, inténtalo de nuevo.');
        }
      } else {
        console.error(error);
        toast.error('Error de conexión. Por favor, verifica tu conexión a Internet e inténtalo de nuevo más tarde.');
      }
      setErrors({ submit: 'Error al registrar el empleado' });
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
                  Agregar nuevo empleado
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
            <h3 className="card-title">Agregar Nuevo Empleado</h3>
          </div>
          <div className="card-body">
            <div className="text-center mb-4">
              <img
                src="/images/user.png"
                alt="Producto"
                className="img-fluid rounded-circle"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </div>
            <hr class="border border-primary border-3 opacity-75"/>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="form-group">
                    <div className='row mt-3'>
                        <div className='col-md-4'>
                            <label htmlFor="nombre">Nombre</label>
                            <Field type="text" id="nombre" name="nombre" className="form-control" />
                            <ErrorMessage name="nombre" component="div" className="text-danger" />
                        </div>
                        <div className='col-md-4'>
                            <label htmlFor="apPaterno">Apellido Paterno</label>
                            <Field type="text" id="apPaterno" name="apPaterno" className="form-control" />
                            <ErrorMessage name="apPaterno" component="div" className="text-danger" />
                        </div>
                        <div className='col-md-4'>
                            <label htmlFor="apMaterno">Apellido Materno</label>
                            <Field type="text" id="apMaterno" name="apMaterno" className="form-control" />
                            <ErrorMessage name="apMaterno" component="div" className="text-danger" />
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-4'>
                            <label htmlFor="Telefono">Teléfono</label>
                            <Field type="text" id="Telefono" name="Telefono" className="form-control" />
                            <ErrorMessage name="Telefono" component="div" className="text-danger" />
                        </div>
                    </div>
                  </div>
                  <span className="blockquote-footer mt-4">Datos del domicilio</span>
                  <div className="form-group">
                    <div className='row mt-3'>
                        <div className='col-md-4'>
                            <label htmlFor="CP">Código Postal</label>
                            <Field type="text" id="CP" name="CP" className="form-control" />
                            <ErrorMessage name="CP" component="div" className="text-danger" />
                        </div>
                        <div className='col-md-4'>
                            <label htmlFor="Estado">Estado</label>
                            <Field type="text" id="Estado" name="Estado" className="form-control" />
                            <ErrorMessage name="Estado" component="div" className="text-danger" />
                        </div>
                        <div className='col-md-4'>
                            <label htmlFor="Ciudad">Ciudad</label>
                            <Field type="text" id="Ciudad" name="Ciudad" className="form-control" />
                            <ErrorMessage name="Ciudad" component="div" className="text-danger" />
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-4'>
                            <label htmlFor="Colonia">Colonia</label>
                            <Field type="text" id="Colonia" name="Colonia" className="form-control" />
                            <ErrorMessage name="Colonia" component="div" className="text-danger" />
                        </div>
                        <div className='col-md-4'>
                            <label htmlFor="Calle">Calle</label>
                            <Field type="text" id="Calle" name="Calle" className="form-control" />
                            <ErrorMessage name="Calle" component="div" className="text-danger" />
                        </div>
                        <div className='col-md-2'>
                            <label htmlFor="NumInterior">Num. Interior</label>
                            <Field type="text" id="NumInterior" name="NumInterior" className="form-control" />
                            <ErrorMessage name="NumInterior" component="div" className="text-danger" />
                        </div>
                        <div className='col-md-2'>
                            <label htmlFor="NumExterior">Num. Exterior</label>
                            <Field type="text" id="NumExterior" name="NumExterior" className="form-control" />
                            <ErrorMessage name="NumExterior" component="div" className="text-danger" />
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-12'>
                            <label htmlFor="Referencias">Referencias</label>
                            <Field as="textarea" id="Referencias" name="Referencias" className="form-control" />
                            <ErrorMessage name="Referencias" component="div" className="text-danger" />
                        </div>
                    </div>
                  </div>
                  <span className="blockquote-footer mt-4">Datos acceso</span>
                  <div className="form-group">
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label htmlFor="correo">Correo</label>
                            <Field type="email" id="correo" name="correo" className="form-control" />
                            <ErrorMessage name="correo" component="div" className="text-danger" />
                        </div>
                        <div className='col-md-6'>
                            <label htmlFor="contraseña">Contraseña</label>
                            <Field type="password" id="contraseña" name="contraseña" className="form-control" />
                            <ErrorMessage name="contraseña" component="div" className="text-danger" />
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            <label htmlFor="contraseña-confirmed">Confirmar contraseña</label>
                            <Field type="password" id="contraseña-confirmed" name="contraseña-confirmed" className="form-control" />
                            <ErrorMessage name="contraseña-confirmed" component="div" className="text-danger" />
                        </div>
                    </div>
                    
                  </div>
                  <div class="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary ml-3" disabled={isSubmitting} style={{marginBottom: 80}}>
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

export default AddEmployee;
