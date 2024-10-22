import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { EmployAuthProvider, useEmployAuth } from '../context/EmployAuthContext';
import EmployLayout from '../layout/EmployLayout';
import LoadingSpinner from '../components/Admin/LoadingSpinner';

const EmployLogin = lazy(() => import('../components/Employ/EmployLogin'));
const HomeAdmin = lazy(() => import('../views/Admin/Home'));
const PrecioEnvios = lazy(() => import('../views/Admin/PrecioEnvios'));
const NotificationAdmin = lazy(() => import('../views/Admin/NotificationAdmin'));
const Inventario = lazy(() => import('../views/Admin/Inventario'));
const AddProduct = lazy(() => import('../views/Admin/AddProduct'));
const EditProduct = lazy(() => import('../views/Admin/EditProduct'));
const SuspendedUsers = lazy(() => import('../views/Admin/SuspendedUsers'));
const EditPriceProducts = lazy(() => import('../views/Admin/EditPriceProducts'));
const EditStockProducts = lazy(() => import('../views/Admin/EditStockProducts'));
const Promociones = lazy(() => import('../views/Admin/Promociones'));
const ProductDetail = lazy(() => import('../views/Admin/ProductDetail'));
const GestionVenta = lazy(() => import('../views/Admin/GestionVenta'));



const EmployForgotPassword = lazy(() => import('../components/Employ/EmployForgotPassword'));
const EmployKeyVerifly = lazy(() => import('../components/Employ/EmployKeyVerifly'));
const EmployChangePassword = lazy(() => import('../components/Employ/EmployChangePassword'));

const title = "Chucherías & Regalos";

// Componente para proteger las rutas administrativas
const PrivateRoute = ({ children }) => {
  const { token } = useEmployAuth();
  return token ? children : <Navigate to="/employ" />;
};

const EmployRoutes = () => (
  <EmployAuthProvider>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<EmployLogin />} />
        <Route path="/forgot-password/:role" element={<EmployForgotPassword />} />
        <Route path="/keyVerifly/:role/:correo" element={<EmployKeyVerifly />} />
        <Route path="changePassword/:role/:correo" element={<EmployChangePassword />} />
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <EmployLayout><HomeAdmin title={title} /></EmployLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/promociones" 
          element={
            <PrivateRoute>
              <EmployLayout><Promociones title={title} /></EmployLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/gestionSale" 
          element={
            <PrivateRoute>
              <EmployLayout><GestionVenta title={title} /></EmployLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/precio-envios" 
          element={
            <PrivateRoute>
              <EmployLayout><PrecioEnvios title={title} /></EmployLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/edit-stock" 
          element={
            <PrivateRoute>
              <EmployLayout><EditStockProducts title={title} /></EmployLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/edit-price" 
          element={
            <PrivateRoute>
              <EmployLayout><EditPriceProducts title={title} /></EmployLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/notificationsAdmin" 
          element={
            <PrivateRoute>
              <EmployLayout><NotificationAdmin title={title} /></EmployLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/inventory" 
          element={
            <PrivateRoute>
              <EmployLayout><Inventario title={title} /></EmployLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/suspended-users" 
          element={
            <PrivateRoute>
              <EmployLayout><SuspendedUsers title={title} /></EmployLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/inventory/add-product" 
          element={
            <PrivateRoute>
              <EmployLayout><AddProduct title={title} /></EmployLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/inventory/edit-product/:productId" 
          element={
            <PrivateRoute>
              <EmployLayout><EditProduct title={title} /></EmployLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/inventory/show-details/:productId" 
          element={
            <PrivateRoute>
              <EmployLayout><ProductDetail title={title} /></EmployLayout>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Suspense>
  </EmployAuthProvider>
);

export default EmployRoutes;
