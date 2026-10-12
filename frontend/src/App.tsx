import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Patient Pages
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { PatientDoctors } from './pages/patient/PatientDoctors';
import { PatientAppointments } from './pages/patient/PatientAppointments';
import { PatientPrescriptions } from './pages/patient/PatientPrescriptions';
import { PatientMedicalRecords } from './pages/patient/PatientMedicalRecords';
import { PatientProfilePage } from './pages/patient/PatientProfile';

// Doctor Pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorAppointments } from './pages/doctor/DoctorAppointments';
import { DoctorAvailabilityPage } from './pages/doctor/DoctorAvailability';
import { DoctorPatients } from './pages/doctor/DoctorPatients';
import { DoctorPrescriptions } from './pages/doctor/DoctorPrescriptions';
import { DoctorProfilePage } from './pages/doctor/DoctorProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDoctors } from './pages/admin/AdminDoctors';
import { AdminPatients } from './pages/admin/AdminPatients';
import { AdminAppointments } from './pages/admin/AdminAppointments';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminDoctorApprovals } from './pages/admin/AdminDoctorApprovals';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Patient Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_PATIENT']} />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/doctors" element={<PatientDoctors />} />
            <Route path="/patient/appointments" element={<PatientAppointments />} />
            <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
            <Route path="/patient/medical-records" element={<PatientMedicalRecords />} />
            <Route path="/patient/profile" element={<PatientProfilePage />} />
          </Route>

          {/* Doctor Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_DOCTOR']} />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/availability" element={<DoctorAvailabilityPage />} />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
            <Route path="/doctor/profile" element={<DoctorProfilePage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/doctors" element={<AdminDoctors />} />
            <Route path="/admin/doctor-approvals" element={<AdminDoctorApprovals />} />
            <Route path="/admin/patients" element={<AdminPatients />} />
            <Route path="/admin/appointments" element={<AdminAppointments />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>

          {/* Fallback & Root Redirection */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
