import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Users, FileText, Phone, Mail, UserCheck } from 'lucide-react';
import api from '../../services/api';
import { PatientProfile, Appointment } from '../../types';

export const DoctorPatients: React.FC = () => {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients');
      setPatients(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Patient Directory" subtitle="View clinical medical records and health history for your consulted patients">
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Gender & DOB</th>
              <th>Blood Group</th>
              <th>Contact Info</th>
              <th>Medical History</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((pat) => (
              <tr key={pat.id}>
                <td>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{pat.user.fullName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Patient ID: #{pat.id}</div>
                </td>
                <td>{pat.gender || 'N/A'} ({pat.dateOfBirth || 'N/A'})</td>
                <td><strong style={{ color: '#ef4444' }}>{pat.bloodGroup || 'N/A'}</strong></td>
                <td>
                  <div style={{ fontSize: '12px' }}><Phone size={12} /> {pat.user.phone || 'N/A'}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}><Mail size={12} /> {pat.user.email}</div>
                </td>
                <td style={{ maxWidth: '240px', fontSize: '12px' }}>{pat.medicalHistory || 'No history recorded'}</td>
                <td>
                  <button onClick={() => setSelectedPatient(pat)} className="btn btn-outline btn-sm">
                    <FileText size={14} /> View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Patient Health Summary</h3>
              <button onClick={() => setSelectedPatient(null)} style={{ border: 'none', cursor: 'pointer' }}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '20px' }}>
                <div className="user-avatar" style={{ width: '56px', height: '56px', fontSize: '22px' }}>
                  {selectedPatient.user.fullName.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{selectedPatient.user.fullName}</h3>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{selectedPatient.user.email} | {selectedPatient.user.phone}</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', marginBottom: '20px' }}>
                <div><strong>Gender:</strong> {selectedPatient.gender || 'N/A'}</div>
                <div><strong>Blood Group:</strong> {selectedPatient.bloodGroup || 'N/A'}</div>
                <div><strong>Date of Birth:</strong> {selectedPatient.dateOfBirth || 'N/A'}</div>
                <div><strong>Emergency Contact:</strong> {selectedPatient.emergencyContact || 'N/A'}</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Address:</h4>
                <p style={{ fontSize: '13px', color: '#475569' }}>{selectedPatient.address || 'Not specified'}</p>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Medical History & Allergies:</h4>
                <p style={{ fontSize: '13px', color: '#0f172a', backgroundColor: '#fffbeb', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                  {selectedPatient.medicalHistory || 'No prior medical conditions reported.'}
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedPatient(null)} className="btn btn-primary">Close</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
