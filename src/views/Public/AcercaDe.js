import React, { useState, useEffect } from "react";
import axios from "axios";
import PageTitle from "../../components/Public/PageTitle";
import { Fieldset } from "primereact/fieldset";

function AcercaDe() {
  const [data, setData] = useState({
    descripcion: "",
    mision: "",
    vision: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/getNosotros/1"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="section mt-3 mb-4">
      <div className="section m-5">
        <h3 className="title-pag fw-bold text-uppercase">Acerca de nosotros</h3>
        <hr className="hr-primary" />

        <div className="row justify-content-center">
          <div className="col-md-11 text-center mb-4">
            <img
              src="/images/Chucherias.png"
              className="img-fluid rounded-start mt-4"
              alt="Chucherias & Regalos"
              style={{ height: "100px" }}
            />
          </div>
          <div className="col-md-11">
          <Fieldset legend="">
              <p className="m-0 text-justify">
                {data.descripcion}
              </p>
            </Fieldset>
          </div>
        </div>
        <hr className="hr-primary" />

        <div className="row ml-4 align-items-center">
          <div className="col-md-5 text-center">
            <img
              src="/images/empresa1.png"
              className="img-fluid rounded-start mt-4"
              alt="Chucherias & Regalos"
              style={{ height: "300px" }}
            />
          </div>
          <div className="col-md-6">
            <Fieldset legend="Misión">
              <p className="m-0 text-justify">
                {data.mision}
              </p>
            </Fieldset>
          </div>
        </div>

        <div className="row ml-4 align-items-center">
          <div className="col-md-6">
            <Fieldset legend="Visión">
              <p className="m-0 text-justify">
                {data.vision}
              </p>
            </Fieldset>
          </div>
          <div className="col-md-5 text-center">
            <img
              src="/images/empresa2.png"
              className="img-fluid rounded-start mt-4"
              alt="Chucherias & Regalos"
              style={{ height: "300px" }}
            />
          </div>
        </div>
      </div>
      <PageTitle title="Chucherias & Regalos | Acerca De" />
    </div>
  );
}

export default AcercaDe;
