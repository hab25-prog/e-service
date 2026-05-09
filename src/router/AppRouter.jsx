import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../context/useAuth";
import Loader from "../pages/Loader";

// Lazy Load Components
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

const SubscriptionPage = lazy(() => import("../pages/SubscriptionPage")); // Lazy loaded
const TechnicianList = lazy(() => import("../pages/TechnicianList"));
const UserDashboard = lazy(() => import("../pages/UserDashboard"));

function AppRouter() {
  const { isAuthenticated, isLoading, role } = useAuth();
  const appRoles = ["customer", "technician"];

  // 1. Critical: Wait for the AuthProvider to finish its DB check
  if (isLoading) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          element={
            !isAuthenticated ? (
              <LandingPage />
            ) : (
              <Navigate
                to={role === "technician" ? "/tech/dashboard" : "/services"}
                replace
              />
            )
          }
          index
        />

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
        <Route path="/subscription" element={<SubscriptionPage />} />
        {/* Protected Wrapper */}
        <Route
          path="/"
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
          {/* Shared Routes */}
          <Route path="services" element={<Home />} />
          <Route path="technicians" element={<TechnicianList />} />
          <Route path="support" element={<Support />} />

          {/* Dashboard Redirect Logic */}
          <Route
            path="dashboard"
            element={
              role === "technician" ? (
                <Navigate to="/tech/dashboard" replace />
              ) : (
                <UserDashboard />
              )
            }
          />

          <Route
            path="tech/dashboard"
            element={
              // Use the same string your AuthProvider uses (likely "user" or "customer")
              role === "customer" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <TechDashboard />
              )
            }
          />
        </Route>

        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
export default AppRouter;
