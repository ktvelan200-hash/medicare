import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, CheckCircle2, Users, FileText, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Appointment } from '../../types';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const res = await api.get('/appointments/my');
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter((a) => a.appointmentDate === todayStr);
  const pendingAppointments = appointments.filter((a) => a.status === 'PENDING');
  const completedAppointments = appointments.filter((a) => a.status === 'COMPLETED');
  
  // Unique patients count
  const uniquePatients = new Set(appointments.map((a) => a.patient.id)).size;

  const updateStatus = async (id: number, status: 'CONFIRMED' | 'REJECTED') => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      fetchDoctorData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title={`Welcome, Dr. ${user?.fullName || ''}`} subtitle="Doctor Consultation Overview & Patient Appointments">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Calendar />
          </div>
          <div className="stat-info">
            <div className="stat-value">{todaysAppointments.length}</div>
            <div className="stat-label">Today's Appointments</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Clock />
          </div>
          <div className="stat-info">
            <div className="stat-value">{pendingAppointments.length}</div>
            <div className="stat-label">Pending Approval Requests</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>
            <CheckCircle2 />
          </div>
          <div className="stat-info">
            <div className="stat-value">{completedAppointments.length}</div>
            <div className="stat-label">Completed Consultations</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ccfbf1', color: '#0d9488' }}>
            <Users />
          </div>
          <div className="stat-info">
            <div className="stat-value">{uniquePatients}</div>
            <div className="stat-label">Total Consulted Patients</div>
          </div>
        </div>
      </div>

      {/* Pending Approval Section */}
      {pendingAppointments.length > 0 && (
        <div className="card" style={{ marginBottom: '32px', borderColor: '#fde68a' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#92400e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock color="#d97706" /> Pending Patient Appointment Requests
          </h3>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Date & Time</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingAppointments.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{app.patient.user.fullName}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Blood: {app.patient.bloodGroup || 'N/A'}</div>
                    </td>
                    <td>
                      <div>{app.appointmentDate}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{app.timeSlot}</div>
                    </td>
                    <td>{app.reason || 'General Checkup'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => updateStatus(app.id, 'CONFIRMED')} className="btn btn-success btn-sm">
                          <Check size={14} /> Accept
                        </button>
                        <button onClick={() => updateStatus(app.id, 'REJECTED')} className="btn btn-danger btn-sm">
                          <X size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Today's Schedule */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Upcoming Schedule</h3>
          <Link to="/doctor/appointments" className="btn btn-outline btn-sm">View All Appointments</Link>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date & Slot</th>
                <th>Medical History</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0, 5).map((app) => (
                <tr key={app.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{app.patient.user.fullName}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{app.patient.user.phone || app.patient.user.email}</div>
                  </td>
                  <td>
                    <div>{app.appointmentDate}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{app.timeSlot}</div>
                  </td>
                  <td style={{ maxWidth: '240px', fontSize: '13px' }}>{app.patient.medicalHistory || 'No history recorded'}</td>
                  <td>
                    <span className={`badge badge-${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};
