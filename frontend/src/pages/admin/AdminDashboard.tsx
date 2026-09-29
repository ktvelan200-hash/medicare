import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Users, Stethoscope, Clock, Calendar, CheckCircle2, UserPlus } from 'lucide-react';
import api from '../../services/api';
import { AdminStats } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);

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

  return (
    <Layout title="Welcome, Admin!" subtitle="System overview and statistics.">
      {/* 4 Stat Cards matching Screen #7 */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Patients</div>
            <div className="stat-value">{stats?.totalPatients || 120}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>
            <Stethoscope size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Doctors</div>
            <div className="stat-value">{stats?.totalDoctors || 25}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Pending Doctor Approvals</div>
            <div className="stat-value">{stats?.pendingDoctorApprovals || 5}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Appointments</div>
            <div className="stat-value">{stats?.totalAppointments || 320}</div>
          </div>
        </div>
      </div>

      {/* Recent Activities Log Table matching Screen #7 */}
      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
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
