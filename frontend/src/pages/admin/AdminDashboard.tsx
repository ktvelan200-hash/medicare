import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Users, Stethoscope, Clock, Calendar, CheckCircle2, XCircle, AlertCircle, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AdminStats, Doctor } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingDoctors, setPendingDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, docRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/doctors/pending'),
      ]);
      setStats(statsRes.data.data);
      setPendingDoctors(docRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproval = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.put(`/admin/doctors/${id}/status`, { status });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Admin System Overview" subtitle="Real-time platform metrics, user growth, and doctor verification requests">
      {/* Metrics Grid */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Users />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats?.totalPatients || 0}</div>
            <div className="stat-label">Total Registered Patients</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ccfbf1', color: '#0d9488' }}>
            <Stethoscope />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats?.totalDoctors || 0}</div>
            <div className="stat-label">Total Doctors</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Clock />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats?.pendingDoctorApprovals || 0}</div>
            <div className="stat-label">Pending Doctor Approvals</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <Calendar />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats?.totalAppointments || 0}</div>
            <div className="stat-label">Total System Appointments</div>
          </div>
        </div>
      </div>

      {/* Appointment Breakdown Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 color="#10b981" size={28} />
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800 }}>{stats?.completedAppointments || 0}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Completed Consultations</div>
          </div>
        </div>
        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock color="#f59e0b" size={28} />
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800 }}>{stats?.pendingAppointments || 0}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Pending Appointments</div>
          </div>
        </div>
        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <XCircle color="#ef4444" size={28} />
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800 }}>{stats?.cancelledAppointments || 0}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Cancelled / Rejected</div>
          </div>
        </div>
      </div>

      {/* Pending Doctor Approvals Panel */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle color="#d97706" /> Doctor Registration Approvals ({pendingDoctors.length})
          </h3>
          <Link to="/admin/doctors" className="btn btn-outline btn-sm">Manage All Doctors</Link>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Specialization</th>
                <th>Qualifications</th>
                <th>Experience</th>
                <th>Fee</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingDoctors.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{doc.user.fullName}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{doc.user.email}</div>
                  </td>
                  <td><span style={{ fontSize: '12px', fontWeight: 600, color: '#0284c7' }}>{doc.specialization}</span></td>
                  <td>{doc.qualification}</td>
                  <td>{doc.experienceYears || 5} Yrs</td>
                  <td>${doc.consultationFee || 500}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleApproval(doc.id, 'APPROVED')} className="btn btn-success btn-sm">
                        <Check size={14} /> Approve Doctor
                      </button>
                      <button onClick={() => handleApproval(doc.id, 'REJECTED')} className="btn btn-danger btn-sm">
                        <X size={14} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pendingDoctors.length === 0 && (
            <div className="empty-state" style={{ padding: '32px' }}>
              <CheckCircle2 size={36} color="#10b981" />
              <p style={{ marginTop: '8px' }}>All doctor registrations are verified and approved!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
