import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/Public/PageTitle";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { FileUpload } from "primereact/fileupload";
import { useAlert } from "../../context/AlertContext";

const Profile = () => {
  const { token } = useAuth();  
  const fileUploadRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null); // Para almacenar la imagen capturada
  const videoRef = useRef(null); // Referencia al video para la cámara
  const canvasRef = useRef(null); // Referencia al canvas para tomar la foto
  const [cameraEnabled, setCameraEnabled] = useState(false); // Estado para habilitar la cámara
  const showAlert = useAlert();
  const [customer, setCustomer] = useState(null);
  const [selectedSexo, setSelectedSexo] = useState("");
  const [edad, setEdad] = useState(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Regresa a la ruta anterior
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        if (token) {
          const decoded = jwtDecode(token);

          setSelectedSexo(decoded.sexo);
          const fechaNacimiento = new Date(decoded.edad);
          const edadActual = calcularEdad(fechaNacimiento);

          const response = await axios.get(
            `http://localhost:5000/users/${decoded.customerId}`
          );

          setCustomer(response.data);
          setEdad(edadActual);
        }
      } catch (error) {
        console.error("Error al obtener el usuario", error);
      }
    };

    fetchCustomerData();
  }, [token]);

  // Función para calcular la edad a partir de la fecha de nacimiento
  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNacimiento = fechaNacimiento.getMonth();
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // Función personalizada para manejar la carga de la imagen
  const customBase64Uploader = async (event) => {
    const file = event.files[0];
    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const response = await axios.put(
        `http://localhost:5000/users/banner/${customer.customerId}`,
        formData
      );

      if (response.status === 200) {
        if (fileUploadRef.current) {
          fileUploadRef.current.clear();
        }
        showAlert("success", "Imagen subida exitosamente");
        setUploadedImage(response.data.imagen);
      } else {
        console.error("Error al subir la imagen");
        showAlert("error", "Error al subir la imagen");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // useEffect para habilitar la cámara una vez que el videoRef esté disponible
  useEffect(() => {
    if (cameraEnabled && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch((err) => {
          console.error("Error al acceder a la cámara:", err);
        });
    }
  }, [cameraEnabled]);

  // Función para habilitar la cámara
  const enableCamera = () => {
    setCameraEnabled(true); // Esto habilitará la cámara en el useEffect
  };

  // Función para capturar la imagen
  const captureImage = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const image = canvasRef.current.toDataURL("image/png");
    setCapturedImage(image);
    videoRef.current.srcObject.getTracks().forEach(track => track.stop()); // Detener la cámara
    setCameraEnabled(false);
  };

  return (
    <div className="section row3 mt-4">
      <PageTitle title="Chucherias & Regalos | Perfil de usuario" />

      <h3 className="title-pag fw-bold text-uppercase">Información Personal</h3>
      <hr className="hr-primary" />
      {customer ? (
        <div className="hoc section clear m-5">
          <div className="row">
            <div className="profile-usr col-md-5">
              <h4 className="fw-bold">
                {customer.nombre} {customer.aPaterno} {customer.aMaterno}
              </h4>

              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  className="img-fluid mt-2"
                  alt="Chucherias & Regalos"
                />
              ) : capturedImage ? (
                <img
                  src={capturedImage}
                  className="img-fluid mt-2"
                  alt="Imagen capturada"
                />
              ) : (
                <img
                  src={
                    customer.imagen !== null 
                    && customer.imagen !== ''
                      ? customer.imagen
                      : (selectedSexo === "masculino"
                      ? "/images/user-masculino.png"
                      : "/images/OIP (1).jpg")
                  }
                  className="img-fluid mt-2"
                  alt="Chucherias & Regalos"
                />
              )}

              <FileUpload
                ref={fileUploadRef}
                mode="basic"
                name="imagen"
                url={`http://localhost:5000/users/usuario/${customer.customerId}/imagen`}
                accept="image/*"
                customUpload
                uploadHandler={customBase64Uploader}
                chooseLabel="Selecciona una imagen"
                className="mt-4"
              />

              <div className="mt-4">
                <button className="btn-primary" onClick={enableCamera}>Abrir cámara</button>
              </div>

              {cameraEnabled && (
                <div className="camera-container mt-4">
                  <video ref={videoRef} style={{ width: "100%", height: "auto", border: "2px solid black" }}></video>
                  <button className="btn-primary mt-2" onClick={captureImage}>Tomar foto</button>
                  <canvas ref={canvasRef} style={{ display: "none" }} width="640" height="480"></canvas>
                </div>
              )}
            </div>

            <div className="col-md-7 mt-2">
              {/* Datos del usuario */}
            </div>
          </div>
        </div>
      ) : (
        <p>No hay token disponible</p>
      )}
    </div>
  );
};

export default Profile;
