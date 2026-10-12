import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, CheckCircle2, Users, Check, X, Star, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Appointment, Doctor, Review } from '../../types';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const [appRes, meRes] = await Promise.all([
        api.get('/appointments/my'),
        api.get('/doctors/me').catch(() => ({ data: { data: null } }))
      ]);

      const apps = appRes.data.data || [];
      setAppointments(apps);

      const me = meRes.data.data;
      setDoctorProfile(me);

      if (me && me.id) {
        const revRes = await api.get(`/reviews/doctor/${me.id}`).catch(() => ({ data: { data: [] } }));
        setReviews(revRes.data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingCount = appointments.filter((a) => a.status === 'PENDING').length;
  const confirmedCount = appointments.filter((a) => a.status === 'CONFIRMED').length;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const cancelledCount = appointments.filter((a) => a.status === 'CANCELLED' || a.status === 'REJECTED').length;
  const totalCount = appointments.length;

  const updateStatus = async (id: number, status: 'CONFIRMED' | 'REJECTED') => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      fetchDoctorData();
    } catch (err) {
      console.error(err);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.appointmentDate === todayStr || a.status === 'PENDING' || a.status === 'CONFIRMED');

  return (
    <Layout title={`Welcome, ${doctorProfile?.user?.fullName || user?.fullName || 'Doctor'}!`} subtitle="Here's your clinical schedule and patient satisfaction overview.">
      {/* 4 Stat Cards */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Active Appointments</div>
            <div className="stat-value">{confirmedCount + pendingCount}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Pending Confirmation</div>
            <div className="stat-value">{pendingCount}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Completed Consultations</div>
            <div className="stat-value">{completedCount}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
            <Star size={24} fill="#f59e0b" />
          </div>
          <div className="stat-info">
            <div className="stat-label">Patient Rating</div>
            <div className="stat-value" style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span>{doctorProfile?.averageRating && doctorProfile.averageRating > 0 ? doctorProfile.averageRating.toFixed(1) : '5.0'}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
                ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Appointments Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Upcoming Consultations</h3>
            <Link to="/doctor/appointments" style={{ fontSize: '13px', color: '#0284c7', fontWeight: 700 }}>View All</Link>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date & Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.slice(0, 5).map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                          {app.patient.user.fullName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{app.patient.user.fullName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{app.patient.gender || 'Patient'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{app.appointmentDate}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{app.timeSlot}</div>
                    </td>
                    <td style={{ maxWidth: '180px', fontSize: '13px' }}>
                      {app.reason || 'General consultation'}
                    </td>
                    <td>
                      <span className={`badge badge-${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      {app.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => updateStatus(app.id, 'CONFIRMED')}
                            className="btn btn-sm btn-outline"
                            style={{ color: '#059669', borderColor: '#a7f3d0', padding: '4px 8px' }}
                            title="Accept appointment"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, 'REJECTED')}
                            className="btn btn-sm btn-outline"
                            style={{ color: '#ef4444', borderColor: '#fca5a5', padding: '4px 8px' }}
                            title="Decline appointment"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <Link to="/doctor/appointments" className="btn btn-sm btn-outline" style={{ fontSize: '11px' }}>
                          Details
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {todayAppointments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '28px', color: 'var(--text-muted)' }}>
                No active appointments scheduled for today.
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Status Breakdown & Patient Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Status Breakdown */}
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Appointment Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span> Pending
                </span>
                <strong>{pendingCount}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0284c7' }}></span> Confirmed
                </span>
                <strong>{confirmedCount}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#059669' }}></span> Completed
                </span>
                <strong>{completedCount}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span> Cancelled
                </span>
                <strong>{cancelledCount}</strong>
              </div>
            </div>
          </div>

          {/* Patient Reviews Widget */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={16} color="#0284c7" /> Patient Feedback
              </h3>
              <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700 }}>
                ⭐ {doctorProfile?.averageRating ? doctorProfile.averageRating.toFixed(1) : '5.0'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
              {reviews.map((rev) => (
                <div key={rev.id} style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-main)',
                  fontSize: '12px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{rev.patientName}</span>
                    <div style={{ display: 'flex', gap: '1px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={11} fill={s <= rev.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                      ))}
                    </div>
                  </div>
                  {rev.comment && (
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.4 }}>
                      "{rev.comment}"
                    </p>
                  )}
                </div>
              ))}

              {reviews.length === 0 && (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                  No patient reviews received yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
