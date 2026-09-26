import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Users, Phone, Mail } from 'lucide-react';
import api from '../../services/api';
import { PatientProfile } from '../../types';

export const AdminPatients: React.FC = () => {
  const [patients, setPatients] = useState<PatientProfile[]>([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/admin/users');
      // Fetch patients
      const patRes = await api.get('/patients');
      setPatients(patRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Registered Patients" subtitle="View complete system patient profiles and medical records history">
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Gender & DOB</th>
              <th>Blood Group</th>
              <th>Contact Details</th>
              <th>Address</th>
              <th>Medical History</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((pat) => (
              <tr key={pat.id}>
                <td><strong>#{pat.id}</strong></td>
                <td>
                  <div style={{ fontWeight: 700 }}>{pat.user.fullName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Registered: {pat.user.createdAt ? pat.user.createdAt.split('T')[0] : 'N/A'}</div>
                </td>
                <td>{pat.gender || 'N/A'} ({pat.dateOfBirth || 'N/A'})</td>
                <td><strong style={{ color: '#ef4444' }}>{pat.bloodGroup || 'N/A'}</strong></td>
                <td>
                  <div style={{ fontSize: '12px' }}>{pat.user.phone || 'N/A'}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{pat.user.email}</div>
                </td>
                <td style={{ maxWidth: '180px', fontSize: '12px' }}>{pat.address || 'N/A'}</td>
                <td style={{ maxWidth: '220px', fontSize: '12px' }}>{pat.medicalHistory || 'None'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
