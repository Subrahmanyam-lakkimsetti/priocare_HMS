import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../../features/auth/authThunks';

import Login from '../../features/auth/Login';
import PatientLayout from '../layouts/PatientLayout';
import DoctorLayout from '../layouts/DoctorLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import SmartHospitalLanding from '../../pages/EntryPage';

function AuthLoader({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sessionInitialized, manualLogout } = useSelector((s) => s.auth);

  useEffect(() => {
    const isLoginPage = location.pathname === '/';

    if (!sessionInitialized && !isLoginPage && !manualLogout) {
      dispatch(fetchCurrentUser());
    }
  }, [sessionInitialized, manualLogout, location.pathname, dispatch]);

  if (!sessionInitialized && location.pathname !== '/') {
    return <div className="p-10">Restoring session...</div>;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthLoader>
        <Routes>
          <Route path="/" element={<SmartHospitalLanding />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/patient/*"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientLayout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorLayout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthLoader>
    </BrowserRouter>
  );
}
