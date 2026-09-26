import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Calendar } from 'lucide-react';
import api from '../../services/api';
import { Appointment } from '../../types';

export const AdminAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

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

  return (
    <Layout title="System-Wide Appointments" subtitle="Master log of all patient consultation bookings across doctors">
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date & Slot</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((app) => (
              <tr key={app.id}>
                <td><strong>#{app.id}</strong></td>
                <td>
                  <div style={{ fontWeight: 700 }}>{app.patient.user.fullName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{app.patient.user.email}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: '#0284c7' }}>Dr. {app.doctor.user.fullName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{app.doctor.specialization}</div>
                </td>
                <td>
                  <div>{app.appointmentDate}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{app.timeSlot}</div>
                </td>
                <td style={{ maxWidth: '200px', fontSize: '13px' }}>{app.reason || 'General Checkup'}</td>
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
    </Layout>
  );
};
