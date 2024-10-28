import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from '../context/AdminAuthContext';
import AdminLayout from '../layout/AdminLayout';
import LoadingSpinner from '../components/Admin/LoadingSpinner';

const AdminLogin = lazy(() => import('../components/Admin/AdminLogin'));
const HomeAdmin = lazy(() => import('../views/Admin/Home'));
const PrecioEnvios = lazy(() => import('../views/Admin/PrecioEnvios'));
const NotificationAdmin = lazy(() => import('../views/Admin/NotificationAdmin'));
const Inventario = lazy(() => import('../views/Admin/Inventario'));
const AddProduct = lazy(() => import('../views/Admin/AddProduct'));
const EditProduct = lazy(() => import('../views/Admin/EditProduct'));
const Empleados = lazy(() => import('../views/Admin/Empleados'));
const AddEmpleados = lazy(() => import('../views/Admin/AddEmpleados'));
const EditEmpleados = lazy(() => import('../views/Admin/EditEmpleados'));
const SuspendedUsers = lazy(() => import('../views/Admin/SuspendedUsers'));
const SalesStatistics = lazy(() => import('../views/Admin/SalesStatistics'));
const EditPriceProducts = lazy(() => import('../views/Admin/EditPriceProducts'));
const EditStockProducts = lazy(() => import('../views/Admin/EditStockProducts'));
const Nosotros = lazy(() => import('../views/Admin/Nosotros'));
const Promociones = lazy(() => import('../views/Admin/Promociones'));
const ProductDetail = lazy(() => import('../views/Admin/ProductDetail'));
const GestionVenta = lazy(() => import('../views/Admin/GestionVenta'));
const Cupones = lazy(() => import('../views/Admin/Cupones'));

const AdminForgotPassword = lazy(() => import('../components/Admin/AdminForgotPassword'));
const AdminKeyVerifly = lazy(() => import('../components/Admin/AdminKeyVerifly'));
const AdminChangePassword = lazy(() => import('../components/Admin/AdminChangePassword'));

const title = "Chucherías & Regalos";

// Componente para proteger las rutas administrativas
const PrivateRoute = ({ children }) => {
  const { token } = useAdminAuth();
  return token ? children : <Navigate to="/admin" />;
};

const AdminRoutes = () => (
  <AdminAuthProvider>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/forgot-password/:role" element={<AdminForgotPassword />} />
        <Route path="/keyVerifly/:role/:correo" element={<AdminKeyVerifly />} />
        <Route path="changePassword/:role/:correo" element={<AdminChangePassword />} />
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <AdminLayout><HomeAdmin title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/promociones" 
          element={
            <PrivateRoute>
              <AdminLayout><Promociones title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cupones" 
          element={
            <PrivateRoute>
              <AdminLayout><Cupones title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/gestionSale" 
          element={
            <PrivateRoute>
              <AdminLayout><GestionVenta title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/precio-envios" 
          element={
            <PrivateRoute>
              <AdminLayout><PrecioEnvios title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/webhook" 
          element={
            <PrivateRoute>
              <AdminLayout><Nosotros title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/edit-stock" 
          element={
            <PrivateRoute>
              <AdminLayout><EditStockProducts title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/edit-price" 
          element={
            <PrivateRoute>
              <AdminLayout><EditPriceProducts title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/sales-statictics" 
          element={
            <PrivateRoute>
              <AdminLayout><SalesStatistics title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/notificationsAdmin" 
          element={
            <PrivateRoute>
              <AdminLayout><NotificationAdmin title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/inventory" 
          element={
            <PrivateRoute>
              <AdminLayout><Inventario title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/suspended-users" 
          element={
            <PrivateRoute>
              <AdminLayout><SuspendedUsers title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/inventory/add-product" 
          element={
            <PrivateRoute>
              <AdminLayout><AddProduct title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/inventory/edit-product/:productId" 
          element={
            <PrivateRoute>
              <AdminLayout><EditProduct title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/inventory/show-details/:productId" 
          element={
            <PrivateRoute>
              <AdminLayout><ProductDetail title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/employs/add-employee" 
          element={
            <PrivateRoute>
              <AdminLayout><AddEmpleados title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/employs/edit-employee/:empleadoId" 
          element={
            <PrivateRoute>
              <AdminLayout><EditEmpleados title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/employs" 
          element={
            <PrivateRoute>
              <AdminLayout><Empleados title={title} /></AdminLayout>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Suspense>
  </AdminAuthProvider>
);

export default AdminRoutes;
