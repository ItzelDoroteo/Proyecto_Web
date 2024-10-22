
import React, { useRef } from "react";
import { Steps } from "primereact/steps";
import { Outlet, useLocation } from "react-router-dom";
import GuardedLayout from "../../layout/GuardedLayout";

const CheckoutStepper = () => {
  const stepperRef = useRef(null);
  const location = useLocation();

  const steps = [
    { path: "/checkup", label: "Carrito" },
    { path: "/select-address", label: "Seleccionar Dirección" },
    { path: "/select-payment", label: "Pagar" },
  ];

  const currentStepIndex = steps.findIndex(
    (step) => step.path === location.pathname
  );

  return (
    <GuardedLayout>
        <Steps
          ref={stepperRef}
          model={steps}
          activeIndex={currentStepIndex}
          style={{ marginBottom: 20, marginTop: 20 }}
        />
      <Outlet />
    </GuardedLayout>
  );
};

export default CheckoutStepper;

