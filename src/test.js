import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    // Renderiza el componente antes de cada prueba
    render(<App />);
  });

  test('renders learn react link', () => {
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders another element', () => {
    // Cambia esto por un texto que sepas que debería estar en tu componente
    const anotherElement = screen.getByText(/another text/i);
    expect(anotherElement).toBeInTheDocument();
  });

  // Puedes agregar más pruebas según sea necesario
});