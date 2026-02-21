import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '../../features/auth/Login';
import PatientLayout from '../layouts/PatientLayout';
import DoctorLayout from '../layouts/DoctorLayout';
import AdminLayout from '../layouts/AdminLayout';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/patient/*" element={<PatientLayout />} />
        <Route path="/doctor/*" element={<DoctorLayout />} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
