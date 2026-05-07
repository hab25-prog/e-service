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
const TechOnboarding = lazy(() => import("../pages/TechOnboarding"));
const SubscriptionPage = lazy(() => import("../pages/SubscriptionPage")); // Lazy loaded
const TechnicianList = lazy(() => import("../pages/TechnicianList"));
const UserDashboard = lazy(() => import("../pages/UserDashboard"));

function AppRouter() {
  const { isAuthenticated, isLoading, role } = useAuth();
  const appRoles = ["user", "technician"];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RegisterCustomer />} />
        <Route path="/register-technician" element={<RegisterTechnician />} />

        {/* Post-Registration Technician Flow (Full Screen) */}
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/tech/onboarding" element={<TechOnboarding />} />

        {/* Protected App Routes (Inside Layout) */}
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
          <Route path="services" element={<Home />} />
          <Route path="technicians" element={<TechnicianList />} />
          <Route path="support" element={<Support />} />
          <Route path="home" element={<Navigate to="/services" replace />} />

          {/* Customer Only */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["user"]}
              >
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Technician Only */}
          <Route
            path="tech/dashboard"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["technician"]}
              >
                <TechDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
