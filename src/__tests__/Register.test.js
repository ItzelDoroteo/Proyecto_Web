import { render, screen } from '@testing-library/react';
import Register from '../views/Public/Register';
import { MemoryRouter } from "react-router-dom";  

test("submits the form with valid data", async () => {
  const { getByLabelText, getByText } = render(
      <MemoryRouter>
          <Register />
      </MemoryRouter>
  );

  // Selecciona el primer campo de contraseña
  const passwordField = screen.getByLabelText(/contraseña/i, { selector: 'input#contraseña' });
  expect(passwordField).toBeInTheDocument();

  // Selecciona el segundo campo de repetición de contraseña
  const repeatPasswordField = screen.getByLabelText(/contraseña/i, { selector: 'input#RContraseña' });
  expect(repeatPasswordField).toBeInTheDocument();
});
