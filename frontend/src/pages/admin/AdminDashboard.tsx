import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { Users, Stethoscope, Clock, Calendar, CheckCircle2, UserPlus, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { AdminStats } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const recentActivities = [
    { user: 'Dr. Priya', action: 'New Registration', details: 'Doctor registration request', date: '28 Sep 2026' },
    { user: 'John Doe', action: 'Booked Appointment', details: 'Appointment with Dr. Kumar', date: '28 Sep 2026' },
    { user: 'Dr. Arjun', action: 'Profile Updated', details: 'Updated availability', date: '27 Sep 2026' },
  ];

  const pendingCount = stats?.pendingDoctorApprovals ?? 0;

  return (
    <Layout title="Welcome, Admin!" subtitle="System overview and statistics.">
      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Patients</div>
            <div className="stat-value">{stats?.totalPatients ?? '—'}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>
            <Stethoscope size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Doctors</div>
            <div className="stat-value">{stats?.totalDoctors ?? '—'}</div>
          </div>
        </div>

        {/* Pending Approvals — clickable card */}
        <div
          className="card stat-card"
          onClick={() => navigate('/admin/doctor-approvals')}
          style={{ cursor: 'pointer', position: 'relative', border: pendingCount > 0 ? '2px solid #f59e0b' : undefined, transition: 'all 0.2s ease' }}
          title="Click to review pending doctor approvals"
        >
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <ShieldCheck size={24} />
          </div>
          <div className="stat-info" style={{ flex: 1 }}>
            <div className="stat-label">Pending Doctor Approvals</div>
            <div className="stat-value" style={{ color: pendingCount > 0 ? '#d97706' : undefined }}>
              {stats ? pendingCount : '—'}
            </div>
          </div>
          {pendingCount > 0 && (
            <ArrowRight size={16} style={{ color: '#d97706', position: 'absolute', right: 16, bottom: 16 }} />
          )}
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Appointments</div>
            <div className="stat-value">{stats?.totalAppointments ?? '—'}</div>
          </div>
        </div>
      </div>

      {/* Pending Approvals Alert Banner */}
      {pendingCount > 0 && (
        <div
          className="alert alert-info"
          style={{ cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          onClick={() => navigate('/admin/doctor-approvals')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShieldCheck size={18} />
            <span>
              <strong>{pendingCount} doctor{pendingCount !== 1 ? 's' : ''}</strong> {pendingCount !== 1 ? 'are' : 'is'} waiting for approval.
            </span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, textDecoration: 'underline' }}>Review Now →</span>
        </div>
      )}

      {/* Recent Activities Log Table */}
      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Recent Activities
        </h3>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((act, index) => (
                <tr key={index}>
                  <td><strong>{act.user}</strong></td>
                  <td><span style={{ fontSize: '12px', fontWeight: 600, color: '#0284c7' }}>{act.action}</span></td>
                  <td style={{ fontSize: '13px', color: '#475569' }}>{act.details}</td>
                  <td style={{ fontSize: '12px', color: '#64748b' }}>{act.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};
