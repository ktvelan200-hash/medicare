import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  UserCheck,
  FileText,
  FolderHeart,
  Clock,
  Users,
  UserCog,
  Stethoscope,
  Activity,
  LogOut,
  Building2,
  ShieldCheck
} from 'lucide-react';
import api from '../services/api';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    if (user?.role === 'ROLE_ADMIN') {
      fetchPendingCount();
      // Refresh every 30 seconds
      const interval = setInterval(fetchPendingCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchPendingCount = async () => {
    try {
      const res = await api.get('/admin/doctors/pending/count');
      setPendingCount(res.data.data?.count ?? 0);
    } catch (err) {
      // silently fail - badge just won't show
    }
  };

  if (!user) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Activity className="w-8 h-8 text-cyan-400" size={28} color="#38bdf8" />
        <div>
          <h1 className="sidebar-logo">MediCare</h1>
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            {user.role.replace('ROLE_', '')} PORTAL
          </span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {user.role === 'ROLE_PATIENT' && (
          <>
            <NavLink to="/patient/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/patient/doctors" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Stethoscope size={18} /> Find Doctors
            </NavLink>
            <NavLink to="/patient/appointments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Calendar size={18} /> Appointments
            </NavLink>
            <NavLink to="/patient/prescriptions" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileText size={18} /> Prescriptions
            </NavLink>
            <NavLink to="/patient/medical-records" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FolderHeart size={18} /> Medical Records
            </NavLink>
            <NavLink to="/patient/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <UserCheck size={18} /> My Profile
            </NavLink>
          </>
        )}

        {user.role === 'ROLE_DOCTOR' && (
          <>
            <NavLink to="/doctor/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/doctor/appointments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Calendar size={18} /> Appointments
            </NavLink>
            <NavLink to="/doctor/availability" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Clock size={18} /> Set Availability
            </NavLink>
            <NavLink to="/doctor/patients" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} /> My Patients
            </NavLink>
            <NavLink to="/doctor/prescriptions" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileText size={18} /> Prescriptions
            </NavLink>
            <NavLink to="/doctor/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <UserCheck size={18} /> Profile & Fees
            </NavLink>
          </>
        )}

        {user.role === 'ROLE_ADMIN' && (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard Overview
            </NavLink>
            <NavLink to="/admin/patients" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} /> Manage Patients
            </NavLink>
            <NavLink to="/admin/doctors" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Stethoscope size={18} /> Doctor Directory
            </NavLink>
            <NavLink to="/admin/doctor-approvals" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
              <ShieldCheck size={18} />
              <span style={{ flex: 1 }}>Doctor Approvals</span>
              {pendingCount > 0 && (
                <span style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  padding: '2px 7px',
                  minWidth: '20px',
                  textAlign: 'center',
                  lineHeight: '1.4',
                  animation: 'badge-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}>
                  {pendingCount}
                </span>
              )}
            </NavLink>
            <NavLink to="/admin/appointments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Calendar size={18} /> All Appointments
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <UserCog size={18} /> User Access Control
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="sidebar-link" style={{ width: '100%', color: '#ef4444', border: 'none', background: 'none' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
};
