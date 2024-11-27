// src/__tests__/Home.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../views/Public/Home';

describe('Home Component', () => {
  test('renders without crashing and displays a message when no products are found', () => {
    render(<Home searchResults={[]} searchTerm="" />); // Pasa un array vacío como resultado de búsqueda

    // Verifica que se muestre el título
    expect(screen.getByText(/Recomendados/i)).toBeInTheDocument();

    // Verifica que se muestre el mensaje de no productos
    expect(screen.getByText(/no se encontraron productos/i)).toBeInTheDocument();
  });
});
