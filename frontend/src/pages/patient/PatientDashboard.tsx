import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Stethoscope, FileText, Clock, UserCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Appointment, Doctor, Prescription } from '../../types';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appRes, docRes, presRes] = await Promise.all([
        api.get('/appointments/my'),
        api.get('/doctors'),
        api.get('/prescriptions/my'),
      ]);
      setAppointments(appRes.data.data || []);
      setDoctors(docRes.data.data || []);
      setPrescriptions(presRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter((a) => a.status === 'PENDING' || a.status === 'CONFIRMED');
  const nextAppointment = upcomingAppointments[0];

  return (
    <Layout title={`Welcome back, ${user?.fullName || 'Patient'}!`} subtitle="Here is your personal healthcare overview">
      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Calendar />
          </div>
          <div className="stat-info">
            <div className="stat-value">{upcomingAppointments.length}</div>
            <div className="stat-label">Upcoming Appointments</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <Clock />
          </div>
          <div className="stat-info">
            <div className="stat-value">{appointments.length}</div>
            <div className="stat-label">Total Appointments</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ccfbf1', color: '#0d9488' }}>
            <Stethoscope />
          </div>
          <div className="stat-info">
            <div className="stat-value">{doctors.length}</div>
            <div className="stat-label">Available Doctors</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <FileText />
          </div>
          <div className="stat-info">
            <div className="stat-value">{prescriptions.length}</div>
            <div className="stat-label">Issued Prescriptions</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Next Appointment Feature Banner */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '1px' }}>
              NEXT UPCOMING CONSULTATION
            </span>
            <Link to="/patient/appointments" className="btn btn-sm btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
              View All
            </Link>
          </div>

          {nextAppointment ? (
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
                Dr. {nextAppointment.doctor.user.fullName}
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
                {nextAppointment.doctor.specialization} • {nextAppointment.doctor.qualification}
              </div>

              <div style={{ display: 'flex', gap: '16px', backgroundColor: 'rgba(255,255,255,0.08)', padding: '12px 16px', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>DATE</div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{nextAppointment.appointmentDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>TIME SLOT</div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{nextAppointment.timeSlot}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>STATUS</div>
                  <span className={`badge badge-${nextAppointment.status.toLowerCase()}`}>
                    {nextAppointment.status}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px 0', textAlign: 'center', color: '#94a3b8' }}>
              <p>No upcoming appointments scheduled.</p>
              <Link to="/patient/doctors" className="btn btn-primary" style={{ marginTop: '16px' }}>
                Book Appointment Now <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Quick Healthcare Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/patient/doctors" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '14px' }}>
              <Stethoscope size={20} color="#0284c7" /> Search & Book Specialist Doctor
            </Link>
            <Link to="/patient/prescriptions" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '14px' }}>
              <FileText size={20} color="#0d9488" /> View Digital Prescriptions
            </Link>
            <Link to="/patient/medical-records" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '14px' }}>
              <Clock size={20} color="#d97706" /> Upload & View Medical Records
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};
