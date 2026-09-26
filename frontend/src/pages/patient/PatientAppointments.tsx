import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Calendar, Clock, Stethoscope, AlertCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import { Appointment } from '../../types';

export const PatientAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/my');
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelAppointment = async (id: number) => {
    try {
      await api.delete(`/appointments/${id}`);
      setStatusMessage('Appointment cancelled successfully.');
      setCancelId(null);
      fetchAppointments();
    } catch (err: any) {
      setStatusMessage(err.response?.data?.message || 'Failed to cancel appointment.');
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (filter === 'UPCOMING') return app.status === 'PENDING' || app.status === 'CONFIRMED';
    if (filter === 'COMPLETED') return app.status === 'COMPLETED';
    if (filter === 'CANCELLED') return app.status === 'CANCELLED' || app.status === 'REJECTED';
    return true;
  });

  return (
    <Layout title="My Appointments" subtitle="Manage your booked doctor consultations and view appointment history">
      {statusMessage && <div className="alert alert-info">{statusMessage}</div>}

      {/* Filter Tabs */}
      <div className="card" style={{ marginBottom: '24px', padding: '12px 20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`btn ${filter === tab ? 'btn-primary' : 'btn-outline'} btn-sm`}
            >
              {tab} ({appointments.filter(a => {
                if (tab === 'UPCOMING') return a.status === 'PENDING' || a.status === 'CONFIRMED';
                if (tab === 'COMPLETED') return a.status === 'COMPLETED';
                if (tab === 'CANCELLED') return a.status === 'CANCELLED' || a.status === 'REJECTED';
                return true;
              }).length})
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Date & Time Slot</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((app) => (
              <tr key={app.id}>
                <td><strong>#{app.id}</strong></td>
                <td>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>Dr. {app.doctor.user.fullName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{app.doctor.user.email}</div>
                </td>
                <td>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#0284c7' }}>{app.doctor.specialization}</span>
                </td>
                <td>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{app.appointmentDate}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{app.timeSlot}</div>
                </td>
                <td style={{ maxWidth: '200px' }}>{app.reason || 'General consultation'}</td>
                <td>
                  <span className={`badge badge-${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </td>
                <td>
                  {(app.status === 'PENDING' || app.status === 'CONFIRMED') && (
                    <button
                      onClick={() => setCancelId(app.id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                    >
                      <XCircle size={14} /> Cancel
                    </button>
                  )}
                  {app.status === 'COMPLETED' && (
                    <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>Consulted</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAppointments.length === 0 && (
          <div className="empty-state">
            <Calendar className="empty-state-icon" size={40} />
            <h3>No appointments found</h3>
            <p>You currently have no booked appointments matching this filter.</p>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Confirm Cancellation</h3>
              <button onClick={() => setCancelId(null)} style={{ border: 'none', cursor: 'pointer' }}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '14px', color: '#475569' }}>
                Are you sure you want to cancel appointment <strong>#{cancelId}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setCancelId(null)} className="btn btn-outline">Keep Appointment</button>
              <button onClick={() => handleCancelAppointment(cancelId)} className="btn btn-danger">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
