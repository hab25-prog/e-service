import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import useAuth from "../context/useAuth";

import Loader from "../pages/Loader";
import Profile from "../pages/Proifle";
import PaymentSuccess from "../pages/PaymentSuccess";
import AdminDashboard from "../pages/AdminDashboard";

// Lazy Components
const AppLayout = lazy(() => import("../component/layout/AppLayout"));

const ProtectedRoute = lazy(
  () => import("../component/routing/ProtectedRoute"),
);

const Home = lazy(() => import("../pages/Home"));
const LandingPage = lazy(() => import("../pages/LandingPage"));

const Login = lazy(() => import("../pages/Login"));

const RegisterCustomer = lazy(() => import("../pages/RegisterCustomer"));

const RegisterTechnician = lazy(() => import("../pages/RegisterTechnician"));

const Support = lazy(() => import("../pages/Support"));

const TechDashboard = lazy(() => import("../pages/TechDashboard"));

const SubscriptionPage = lazy(() => import("../pages/SubscriptionPage"));

const DebugSubscription = lazy(() => import("../pages/DebugSubscription"));

const TechnicianList = lazy(() => import("../pages/TechnicianList"));

const UserDashboard = lazy(() => import("../pages/UserDashboard"));

function AppRouter() {
  const { isAuthenticated, isLoading, role } = useAuth();

  console.log("AppRouter - Auth State:", role);

  if (isLoading) {
    return <Loader />;
  }

  const appRoles = ["customer", "technician", "admin"];

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Landing */}
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <LandingPage />
            ) : role === "technician" ? (
              <Navigate to="/tech/dashboard" replace />
            ) : role === "admin" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/services" replace />
            )
          }
        />

        {/* Public Auth Routes */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
        />

        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <RegisterCustomer />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/register-technician"
          element={
            !isAuthenticated ? (
              <RegisterTechnician />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={role}
              allowedRoles={appRoles}
            >
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Shared */}
          <Route path="profile" element={<Profile />} />

          <Route path="services" element={<Home />} />

          <Route path="technicians" element={<TechnicianList />} />

          <Route path="support" element={<Support />} />

          {/* Customer Dashboard */}
          <Route
            path="dashboard"
            element={
              role === "technician" ? (
                <Navigate to="/tech/dashboard" replace />
              ) : role === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <UserDashboard />
              )
            }
          />

          {/* Technician Dashboard */}
          <Route
            path="tech/dashboard"
            element={
              role === "customer" ? (
                <Navigate to="/dashboard" replace />
              ) : role === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <TechDashboard />
              )
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="admin/dashboard"
            element={
              role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Route>

        {/* Other */}
        <Route path="/subscription" element={<SubscriptionPage />} />

        <Route path="/subscription/success" element={<PaymentSuccess />} />

        <Route path="/debug/subscription" element={<DebugSubscription />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
