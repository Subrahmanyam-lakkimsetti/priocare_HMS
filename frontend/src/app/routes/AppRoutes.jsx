// src/routes/AppRoutes.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { fetchCurrentUser } from '../../features/auth/authThunks';

import Login from '../../features/auth/Login';
import Register from '../../features/auth/register';

import PatientLayout from '../layouts/PatientLayout';
import DoctorLayout from '../layouts/DoctorLayout';
import AdminLayout from '../layouts/AdminLayout';

import ProtectedRoute from './ProtectedRoute';
import SmartHospitalLanding from '../../pages/EntryPage';
import AnimatedAuthLayout from '../../components/AnimatedAuthLayout';

function AuthLoader({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sessionInitialized, manualLogout } = useSelector((s) => s.auth);

  const isPublicPage = ['/', '/login', '/register'].includes(
    location.pathname.split('?')[0],
  );

  useEffect(() => {
    if (!sessionInitialized && !isPublicPage && !manualLogout) {
      dispatch(fetchCurrentUser());
    }
  }, [sessionInitialized, manualLogout, isPublicPage, dispatch]);

  if (!sessionInitialized && !isPublicPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm font-medium">Restoring session...</span>
        </div>
      </div>
    );
  }

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthLoader>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<SmartHospitalLanding />} />

          {/* Auth with animation */}
          <Route
            path="/login"
            element={
              <AnimatedAuthLayout>
                <Login />
              </AnimatedAuthLayout>
            }
          />

          <Route
            path="/register"
            element={
              <AnimatedAuthLayout>
                <Register />
              </AnimatedAuthLayout>
            }
          />

          {/* Patient */}
          <Route
            path="/patient/*"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientLayout />
              </ProtectedRoute>
            }
          />

          {/* Doctor */}
          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorLayout />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
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
