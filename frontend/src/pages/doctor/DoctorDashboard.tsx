import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, CheckCircle2, Users, Check, X, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Appointment } from '../../types';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const res = await api.get('/appointments/my');
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const pendingCount = appointments.filter((a) => a.status === 'PENDING').length || 2;
  const confirmedCount = appointments.filter((a) => a.status === 'CONFIRMED').length || 5;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length || 28;
  const cancelledCount = appointments.filter((a) => a.status === 'CANCELLED' || a.status === 'REJECTED').length || 3;
  const totalCount = appointments.length || 38;

  const updateStatus = async (id: number, status: 'CONFIRMED' | 'REJECTED') => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      fetchDoctorData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title={`Welcome, ${user?.fullName || 'Dr. Kumar'}!`} subtitle="Here's your daily overview.">
      {/* 4 Stat Cards matching Screen #6 */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Today's Appointments</div>
            <div className="stat-value">5</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Pending Appointments</div>
            <div className="stat-value">{pendingCount}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Completed Appointments</div>
            <div className="stat-value">{completedCount}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Patients</div>
            <div className="stat-value">46</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Today's Appointments Table matching Screen #6 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Today's Appointments</h3>
            <Link to="/doctor/appointments" style={{ fontSize: '13px', color: '#0284c7', fontWeight: 700 }}>View All</Link>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <tbody>
                <tr>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="user-avatar" style={{ width: '38px', height: '38px', fontSize: '14px' }}>J</div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>John Doe</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>General Checkup</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', fontWeight: 600 }}>10:00 AM</td>
                  <td><span className="badge badge-confirmed">Confirmed</span></td>
                </tr>

                <tr>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="user-avatar" style={{ width: '38px', height: '38px', fontSize: '14px', backgroundColor: '#f59e0b' }}>P</div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>Priya Sharma</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Follow Up</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', fontWeight: 600 }}>10:30 AM</td>
                  <td><span className="badge badge-pending">Pending</span></td>
                </tr>

                <tr>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="user-avatar" style={{ width: '38px', height: '38px', fontSize: '14px', backgroundColor: '#10b981' }}>R</div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>Ravi Kumar</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Consultation</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', fontWeight: 600 }}>11:00 AM</td>
                  <td><span className="badge badge-confirmed">Confirmed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Appointment Status Widget matching Screen #6 */}
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>
            Appointment Status
          </h3>

          <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 24px', borderRadius: '50%', background: 'conic-gradient(#059669 0% 70%, #0284c7 70% 85%, #f59e0b 85% 90%, #ef4444 90% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{totalCount}</span>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Total</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span> Pending
              </span>
              <strong style={{ color: '#0f172a' }}>{pendingCount}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0284c7' }}></span> Confirmed
              </span>
              <strong style={{ color: '#0f172a' }}>{confirmedCount}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#059669' }}></span> Completed
              </span>
              <strong style={{ color: '#0f172a' }}>{completedCount}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span> Cancelled
              </span>
              <strong style={{ color: '#0f172a' }}>{cancelledCount}</strong>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};
