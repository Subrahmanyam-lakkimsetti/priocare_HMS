import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useSelector((s) => s.auth);
  const location = useLocation();

  if (loading) return <div className="p-10">Checking session...</div>;

  // 🔥 logout redirect
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // 🔥 role protection
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
