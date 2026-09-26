import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { FileText, Printer, Stethoscope, Calendar, Pill } from 'lucide-react';
import api from '../../services/api';
import { Prescription } from '../../types';

export const PatientPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get('/prescriptions/my');
      setPrescriptions(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout title="Digital Prescriptions" subtitle="View and print medical prescriptions issued by your consulting doctors">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {prescriptions.map((pres) => (
          <div key={pres.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0d9488', backgroundColor: '#ccfbf1', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    RX PRESCRIPTION #{pres.id}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '6px' }}>{pres.diagnosis}</h3>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{pres.issuedDate}</div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Prescribed by:</div>
                <div style={{ fontSize: '14px', color: '#0284c7', fontWeight: 600 }}>Dr. {pres.doctor.user.fullName}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{pres.doctor.specialization} ({pres.doctor.qualification})</div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Pill size={14} color="#0d9488" /> Prescribed Medicines:
                </div>
                <p style={{ fontSize: '13px', color: '#334155', whiteSpace: 'pre-line', lineHeight: 1.4 }}>
                  {pres.medicines}
                </p>
              </div>

              {pres.instructions && (
                <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic', marginBottom: '16px' }}>
                  <strong>Doctor Instructions:</strong> "{pres.instructions}"
                </div>
              )}
            </div>

            <button onClick={() => setSelectedPrescription(pres)} className="btn btn-outline" style={{ width: '100%' }}>
              <FileText size={16} /> View Full Prescription
            </button>
          </div>
        ))}
      </div>

      {prescriptions.length === 0 && (
        <div className="card empty-state">
          <FileText className="empty-state-icon" size={48} />
          <h3>No prescriptions issued yet</h3>
          <p>Prescriptions issued by doctors after completed consultations will appear here.</p>
        </div>
      )}

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText color="#0284c7" /> Official Medical Prescription
              </h3>
              <button onClick={() => setSelectedPrescription(null)} style={{ border: 'none', cursor: 'pointer' }}>×</button>
            </div>

            <div className="modal-body" id="printable-prescription">
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0284c7', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>MediCare Digital Clinic</h2>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>Authorized Health Management Platform</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0284c7' }}>Dr. {selectedPrescription.doctor.user.fullName}</div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>{selectedPrescription.doctor.qualification}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedPrescription.doctor.specialization}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
                <div><strong>Patient Name:</strong> {selectedPrescription.patient.user.fullName}</div>
                <div><strong>Date:</strong> {selectedPrescription.issuedDate}</div>
                <div><strong>Gender / DOB:</strong> {selectedPrescription.patient.gender || 'N/A'} ({selectedPrescription.patient.dateOfBirth || 'N/A'})</div>
                <div><strong>Blood Group:</strong> {selectedPrescription.patient.bloodGroup || 'N/A'}</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Clinical Diagnosis:</h4>
                <div style={{ fontSize: '15px', color: '#0369a1', fontWeight: 600 }}>{selectedPrescription.diagnosis}</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Pill size={16} color="#0d9488" /> Rx Prescribed Medication:
                </h4>
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '16px', borderRadius: '8px', fontSize: '14px', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                  {selectedPrescription.medicines}
                </div>
              </div>

              {selectedPrescription.instructions && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Advice / Special Instructions:</h4>
                  <p style={{ fontSize: '13px', color: '#475569', backgroundColor: '#fffbeb', padding: '10px 14px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                    {selectedPrescription.instructions}
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={handlePrint} className="btn btn-outline">
                <Printer size={16} /> Print Prescription
              </button>
              <button onClick={() => setSelectedPrescription(null)} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
