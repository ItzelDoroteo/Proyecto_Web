import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/Public/PageTitle";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useAlert } from "../../context/AlertContext";
import { Button } from "primereact/button";

const Profile = () => {
  const { token } = useAuth();
  const showAlert = useAlert();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [customer, setCustomer] = useState(null);
  const fileUploadRef = useRef(null);
  const navigate = useNavigate();
  const [selectedSexo, setSelectedSexo] = useState("");
  const [edad, setEdad] = useState(null);

  const handleBack = () => {
    navigate(-1);
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
            `https://backend-c-r-production.up.railway.app/users/${decoded.customerId}`
          );
          setCustomer(response.data);
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
    if (
      mesActual < mesNacimiento ||
      (mesActual === mesNacimiento && hoy.getDate() < fechaNacimiento.getDate())
    ) {
      edad--;
    }
    return edad;
  };

  const customBase64Uploader = async (file) => {
    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const response = await axios.put(
        `https://backend-c-r-production.up.railway.app/users/banner/${customer.customerId}`,
        formData
      );
      if (response.status === 200) {
        setUploadedImage(response.data.imagen);
        showAlert("success", "Imagen actualizada exitosamente");
      } else {
        showAlert("error", "Error al actualizar la imagen");
      }
    } catch (error) {
      console.error("Error:", error);
      showAlert("error", "Error al cargar la imagen");
    }
  };

  const enableCamera = () => {
    setCameraEnabled(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => {
        console.error("Error al acceder a la cámara:", err);
      });
  };

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const image = canvasRef.current.toDataURL("image/png");
      customBase64Uploader(dataURLtoFile(image, "captured.png"));
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      setCapturedImage(image);
      setCameraEnabled(false);
    }
  };

  const cancelCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setCameraEnabled(false);
  };

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleImageUpdate = () => {
    setShowConfirmDialog(true);
  };

  const handleDialogSelection = (action) => {
    if (action === "upload") {
      fileUploadRef.current.click();
    } else if (action === "camera") {
      enableCamera();
    }
    setShowConfirmDialog(false);
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
              {!cameraEnabled && (uploadedImage || capturedImage) ? (
                <img
                  src={uploadedImage || capturedImage}
                  className="img-fluid mt-2"
                  alt="Imagen de usuario"
                />
              ) : (
                !cameraEnabled && (
                  <img
                    src={customer.imagen || "/images/default-avatar.png"}
                    className="img-fluid mt-2"
                    alt="Imagen de usuario"
                  />
                )
              )}
              <input
                type="file"
                ref={fileUploadRef}
                onChange={(e) => customBase64Uploader(e.target.files[0])}
                style={{ display: "none" }}
              />
              {!cameraEnabled && (
                <Button
                  label="Actualizar imagen"
                  severity="success"
                  icon="pi pi-cloud-upload"
                  onClick={handleImageUpdate}
                  className="mt-2 mb-4"
                  style={{ color: "white", borderRadius: 10 }}
                />
              )}

              {cameraEnabled && (
                <div className="row mt-3 d-flex item-center">
                  <video
                    ref={videoRef}
                    className="camera-view"
                    autoPlay
                  ></video>
                  <canvas
                    ref={canvasRef}
                    style={{ display: "none" }}
                    width="360"
                    height="360"
                  ></canvas>
                  <div className="d-flex justify-content-between">
                    <Button
                      label="Cancelar"
                      severity="secondary"
                      icon="pi pi-times"
                      onClick={cancelCamera}
                      className="mt-2"
                      style={{ color: "white", borderRadius: 10 }}
                    />
                    <Button
                      label="Capturar imagen"
                      severity="success"
                      icon="pi pi-image"
                      onClick={captureImage}
                      className="mt-2"
                      style={{ color: "white", borderRadius: 10 }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="col-md-7 mt-2">
              <h3 className="fw-bold">Datos de la cuenta</h3>
              <div className="form-group mb-4 mt-2 col-sm-12">
                <label htmlFor="Name" className="fw-bold">
                  Nombre completo
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="Name"
                  placeholder="Nombre y apellidos"
                  value={`${customer.nombre} ${customer.aPaterno} ${customer.aMaterno}`}
                  readOnly
                />
              </div>
              <div className="form-group mb-4 col-sm-12">
                <label htmlFor="Email" className="fw-bold">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="Email"
                  placeholder="Email"
                  value={`${customer.correo}`}
                  readOnly
                />
              </div>
              <div className="form-group mb-4 row">
                <div className="form-group col-sm-6">
                  <label htmlFor="Telefono" className="fw-bold">
                    Telefono
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="Telefono"
                    placeholder="Telefono"
                    value={`${customer.telefono}`}
                    readOnly
                  />
                </div>
                <div className="form-group mb-4 row">
                  <div className="form-group col-sm-7">
                    <label htmlFor="Sexo" className="fw-bold">
                      Sexo
                    </label>
                    <select
                      className="form-control"
                      id="Sexo"
                      value={selectedSexo}
                      disabled
                    >
                      <option value="" disabled selected hidden>
                        Selecciona tu sexo
                      </option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                    </select>
                  </div>
                  <div className="form-group col-sm-5">
                    <label htmlFor="Edad" className="fw-bold">
                      Edad
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="Edad"
                      placeholder="Edad"
                      value={edad !== null ? edad : ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="cont-btn mt-4">
                <Button
                  label="Regresar"
                  severity="secondary"
                  icon="pi pi-arrow-left"
                  onClick={handleBack}
                  className="mt-2 mb-4"
                  style={{ color: "white", borderRadius: 10 }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No hay token disponible</p>
      )}

      <ConfirmDialog
        visible={showConfirmDialog}
        onHide={() => setShowConfirmDialog(false)}
        message="Seleccione el método para actualizar la imagen"
        header="Actualizar imagen"
        icon="pi pi-exclamation-triangle"
        acceptLabel="Cargar desde dispositivo"
        rejectLabel="Usar cámara"
        accept={() => handleDialogSelection("upload")}
        reject={() => handleDialogSelection("camera")}
      />
    </div>
  );
};

export default Profile;
