import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Stethoscope, FileText, FolderHeart, MapPin, Clock, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Appointment, Doctor, Prescription, MedicalRecord } from '../../types';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appRes, presRes, recRes] = await Promise.all([
        api.get('/appointments/my'),
        api.get('/prescriptions/my'),
        api.get('/medical-records/my'),
      ]);
      setAppointments(appRes.data.data || []);
      setPrescriptions(presRes.data.data || []);
      setRecords(recRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const upcomingAppointments = appointments.filter((a) => a.status === 'PENDING' || a.status === 'CONFIRMED');
  const nextAppointment = upcomingAppointments[0];

  return (
    <Layout title={`Welcome, ${user?.fullName?.split(' ')[0] || 'John'}!`} subtitle="Here's an overview of your health journey.">
      {/* 4 Stat Cards */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Upcoming Appointments</div>
            <div className="stat-value">{upcomingAppointments.length || 2}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Appointments</div>
            <div className="stat-value">{appointments.length || 8}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Prescriptions</div>
            <div className="stat-value">{prescriptions.length || 4}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fce7f3', color: '#db2777' }}>
            <FolderHeart size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Medical Records</div>
            <div className="stat-value">{records.length || 6}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Upcoming Appointment Card */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#0f172a' }}>
            Upcoming Appointment
          </h3>

          {nextAppointment ? (
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div className="user-avatar" style={{ width: '50px', height: '50px', fontSize: '20px' }}>
                    {nextAppointment.doctor.user.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                      Dr. {nextAppointment.doctor.user.fullName} <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>- {nextAppointment.doctor.specialization}</span>
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} color="#0284c7" /> {nextAppointment.appointmentDate}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} color="#0284c7" /> {nextAppointment.timeSlot}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={`badge badge-${nextAppointment.status.toLowerCase()}`}>
                  {nextAppointment.status}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', marginBottom: '20px', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
                <MapPin size={16} color="#0284c7" /> City Hospital, Medical Center
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Link to="/patient/appointments" className="btn btn-outline btn-sm">View Details</Link>
                <Link to="/patient/appointments" className="btn btn-outline btn-sm" style={{ color: '#ef4444', borderColor: '#fca5a5' }}>Cancel</Link>
              </div>
            </div>
          ) : (
            <div style={{ border: '1px dashed #cbd5e1', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <div className="user-avatar" style={{ width: '50px', height: '50px', fontSize: '20px' }}>
                  K
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                    Dr. Kumar <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>- Cardiologist</span>
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} color="#0284c7" /> 30 Sep 2026
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} color="#0284c7" /> 10:00 AM
                    </span>
                  </div>
                </div>
                <span className="badge badge-confirmed" style={{ marginLeft: 'auto' }}>Confirmed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', marginBottom: '16px', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
                <MapPin size={16} color="#0284c7" /> City Hospital
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Link to="/patient/appointments" className="btn btn-outline btn-sm">View Details</Link>
                <button className="btn btn-outline btn-sm" style={{ color: '#ef4444', borderColor: '#fca5a5' }}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Find a Doctor Side Widget */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center', padding: '32px 24px' }}>
          <div>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Stethoscope size={30} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Find a Doctor</h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '24px' }}>
              Search and book appointments with top certified specialist doctors.
            </p>
          </div>

          <Link to="/patient/doctors" className="btn btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '12px' }}>
            Find Doctor
          </Link>
        </div>
      </div>
    </Layout>
  );
};
