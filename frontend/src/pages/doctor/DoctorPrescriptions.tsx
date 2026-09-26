import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { FileText, Pill, Calendar } from 'lucide-react';
import api from '../../services/api';
import { Prescription } from '../../types';

export const DoctorPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    fetchDoctorPrescriptions();
  }, []);

  const fetchDoctorPrescriptions = async () => {
    try {
      const res = await api.get('/prescriptions/my');
      setPrescriptions(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Issued Prescriptions History" subtitle="Review all digital prescriptions issued to your patients">
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Rx ID</th>
              <th>Patient Name</th>
              <th>Diagnosis</th>
              <th>Medicines List</th>
              <th>Issued Date</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((pres) => (
              <tr key={pres.id}>
                <td><strong>#{pres.id}</strong></td>
                <td>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{pres.patient.user.fullName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Blood: {pres.patient.bloodGroup || 'N/A'}</div>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: '#0284c7' }}>{pres.diagnosis}</span>
                </td>
                <td style={{ maxWidth: '300px', fontSize: '13px', whiteSpace: 'pre-line' }}>{pres.medicines}</td>
                <td>{pres.issuedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {prescriptions.length === 0 && (
          <div className="empty-state">
            <FileText className="empty-state-icon" size={40} />
            <h3>No prescriptions issued yet</h3>
            <p>Go to Appointments page to issue prescriptions for completed consultations.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
