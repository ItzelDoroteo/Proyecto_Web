
# Proyecto PWA - "Chucherías y Regalos"

### Descripción
Este proyecto es una **Progressive Web App (PWA)** diseñada para mejorar la gestión comercial. La PWA está optimizada para dispositivos móviles, ofreciendo funcionalidades clave como login, visualización de ofertas, carrito de compras y perfil de usuario. Incluye soporte para funcionalidades offline, notificaciones push, y accesibilidad optimizada para garantizar una experiencia fluida incluso en áreas con baja conectividad. Utiliza un despliegue **Canary** para nuevas versiones, garantizando estabilidad antes de lanzarlas a todos los usuarios.

### Características principales
- **Login**: Acceso seguro para usuarios registrados.
- **Carrito de compras**: Gestión de productos seleccionados por el usuario.
- **Perfil de usuario**: Configuración y personalización de la cuenta del usuario.
- **Soporte offline**: Visualización de catálogo y otras funcionalidades básicas sin conexión a internet.
- **Notificaciones push**: Informaciones importantes enviadas directamente al dispositivo del usuario.

### Instalación
Sigue los siguientes pasos para clonar e instalar el proyecto localmente:

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/ItzelDoroteo/Proyecto_Web.git
   ```

2. Navegar al directorio del proyecto:
   ```bash
   cd Proyecto_Web
   ```

3. Instalar las dependencias:
   ```bash
   npm install
   ```

4. Configurar el entorno de desarrollo:
   - Crear un archivo `.env` en la raíz del proyecto con las configuraciones necesarias para el backend (API URL, tokens, etc.).

5. Ejecutar el proyecto en modo desarrollo:
   ```bash
   npm run start
   ```

### Uso
Una vez que el proyecto esté corriendo, puedes acceder a las siguientes funcionalidades:

- **Login**: Ingresa con tu usuario y contraseña para acceder a tu perfil.
- **Ofertas y catálogo**: Navega por los productos en oferta y añádelos al carrito.
- **Carrito de compras**: Gestiona los productos seleccionados antes de proceder con la compra.
- **Perfil de usuario**: Revisa o edita tus datos personales.
  
### Requisitos
- **React JS**
- **Node.js** y **Express**
- **Service Workers**
- **JWT** (para autenticación)
- **Jira** (para la gestión de tareas)

### Contribución
Si deseas contribuir al proyecto, sigue estos pasos:

1. Haz un **fork** del repositorio.
2. Crea una nueva rama para tu funcionalidad o corrección:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y **commitea**:
   ```bash
   git commit -m "Agrega nueva funcionalidad"
   ```
4. Sube los cambios a tu repositorio:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Abre un **pull request** para que tus cambios sean revisados.

### Licencia
Este proyecto está bajo la Licencia MIT.

### Estrategia de Despliegue
Utilizamos una estrategia de despliegue **Canary**, que consiste en lanzar nuevas versiones a un pequeño subconjunto de usuarios para monitorizar su comportamiento antes de realizar un despliegue completo. Esto garantiza que cualquier problema o bug sea identificado antes de impactar a todos los usuarios.

### Entornos de despliegue
- **Desarrollo**: Aquí se integran y prueban las nuevas funcionalidades antes de cualquier despliegue.
- **Staging**: Simula el entorno de producción, utilizado para pruebas exhaustivas antes del lanzamiento en producción.
- **Producción (Canary)**: Solo un pequeño porcentaje de usuarios recibe la nueva versión.
- **Producción Completa**: Despliegue total de la nueva versión para todos los usuarios.

### Integración Continua (CI) y Despliegue
Este proyecto utiliza **GitHub Actions** para ejecutar pruebas automáticas y despliegue continuo. Cada vez que se crea o actualiza una **pull request**, se ejecutan las pruebas unitarias e integrales, asegurando la calidad del código antes de integrarlo en la rama principal.

Pasos para contribuir al CI/CD:
1. Clonar el repositorio.
2. Realizar los cambios y subir actualizaciones mediante **pull requests**.
3. Asegurarse de que las pruebas pasen antes de la integración.

---
