import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from '../components/Admin/LoadingSpinner';

import PublicLayout from '../layout/PublicLayout';
import NotFound from '../components/Public/NotFound';
import Error500 from '../components/Public/Error500';
import Error400 from '../components/Public/Error400';
import ForgotPassword from '../components/Public/ForgotPassword';
import ChangePassword from '../components/Public/ChangePassword';
import KeyVerifly from '../components/Public/KeyVerifly';
import KeyVeriflyWhatsApp from '../components/Public/KeyVeriflyWhatsApp';

import GuardedLayout from '../layout/GuardedLayout';
import CheckoutStepper from '../components/Public/Stepper';

const NewAddress = lazy(() => import('../views/Public/NewAddress'));
const UserProfile = lazy(() => import('../views/Public/UserProfile'));
const Carrito = lazy(() => import('../views/Public/Carrito'));
const PurchaseHistory = lazy(() => import('../views/Public/PurchaseHistory'));
const SelectAddress = lazy(() => import('../views/Public/SelectAddress'));
const SelectPayment = lazy(() => import('../views/Public/SelectPayment'));
const StripPayment = lazy(() => import('../views/Public/StripPayment'));
const Notifications = lazy(() => import('../views/Public/Notifications'));

const Home = lazy(() => import('../views/Public/Home'));
const CategoriaProductos = lazy(() => import('../views/Public/CategoriaProductos'));
const MasVendidos = lazy(() => import('../views/Public/MasVendifos'));
const Ofertas = lazy(() => import('../views/Public/Ofertas'));
const ProductDetail = lazy(() => import('../views/Public/ProductDetail'));
const PrivacyPolicy = lazy(() => import('../views/Public/PrivacyPolicy'));
const Terms = lazy(() => import('../views/Public/Terms'));
const Cookies = lazy(() => import('../views/Public/Cookies'));
const FAQs = lazy(() => import('../views/Public/FAQs'));
const AcercaDe = lazy(() => import('../views/Public/AcercaDe'));
const Register = lazy(() => import('../views/Public/Register'));
const Search = lazy(() => import('../views/Public/Search'));
const GrowthCalculator = lazy(() => import('../views/Public/Mate'));

const PublicRoutes = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/category/:id" element={<PublicLayout><CategoriaProductos /></PublicLayout>} />
      <Route path="/mas-vendidos" element={<PublicLayout><MasVendidos /></PublicLayout>} />
      <Route path="/ofertas" element={<PublicLayout><Ofertas /></PublicLayout>} />
      <Route path="/product/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
      <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
      <Route path="/terms-cond" element={<PublicLayout><Terms /></PublicLayout>} />
      <Route path="/cookies" element={<PublicLayout><Cookies /></PublicLayout>} />
      <Route path="/FAQs" element={<PublicLayout><FAQs /></PublicLayout>} />
      <Route path="/quienes-somos" element={<PublicLayout><AcercaDe /></PublicLayout>} />
      <Route path="/registro" element={<PublicLayout><Register /></PublicLayout>} />
      <Route path="/search" element={<PublicLayout><Search /></PublicLayout>} />
      <Route path="/mate" element={<PublicLayout><GrowthCalculator /></PublicLayout>} />
      <Route path="/error-500" element={<PublicLayout><Error500 /></PublicLayout>} />
      <Route path="/error-400" element={<PublicLayout><Error400 /></PublicLayout>} />
      <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
      <Route path="/change-password/:correo" element={<PublicLayout><ChangePassword /></PublicLayout>} />
      <Route path="/key-verification/:correo" element={<PublicLayout><KeyVerifly /></PublicLayout>} />
      <Route path="/key-verification-whatsapp/:correo" element={<PublicLayout><KeyVeriflyWhatsApp /></PublicLayout>} />
      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />


        {/* RUTAS PROTEGIDAS */}
      <Route path="/new-address" element={<GuardedLayout><NewAddress /></GuardedLayout>} />
      <Route path="/update-address/:id" element={<GuardedLayout><NewAddress /></GuardedLayout>} />
      <Route path="/user-profile" element={<GuardedLayout><UserProfile /></GuardedLayout>} />
      {/* <Route path="/checkup" element={<GuardedLayout><Carrito /></GuardedLayout>} /> */}
      <Route path="/purchase-history" element={<GuardedLayout><PurchaseHistory /></GuardedLayout>} />
      {/* <Route path="/select-address" element={<GuardedLayout><SelectAddress /></GuardedLayout>} />
      <Route path="/select-payment" element={<GuardedLayout><SelectPayment /></GuardedLayout>} /> */}
      {/* <Route path="/strip-payment" element={<GuardedLayout><StripPayment /></GuardedLayout>} /> */}
      <Route path="/notifications" element={<GuardedLayout><Notifications /></GuardedLayout>} />

      {/* Rutas de checkout con stepper */}
      <Route element={<CheckoutStepper />}>
        <Route path="/checkup" element={<Carrito />} />
        <Route path="/select-address" element={<SelectAddress />} />
        <Route path="/select-payment" element={<SelectPayment />} />
        <Route path="/strip-payment" element={<StripPayment />} />
      </Route>
    </Routes>
  </Suspense>
);

export default PublicRoutes;
