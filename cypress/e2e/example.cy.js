describe('Mi primer test en Cypress', () => {
    before(() => {
      // Código que se ejecuta antes de todos los tests
      cy.visit('http://localhost:3000'); // Reemplaza con la URL de tu aplicación
    });
  
    it('Debería cargar la página principal', () => {
      cy.contains('Recomendados'); // Cambia 'Bienvenido' por un texto que esperas en la página
    });

  });
  