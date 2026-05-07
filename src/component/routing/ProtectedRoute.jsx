import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated, userRole, allowedRoles, children }) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
