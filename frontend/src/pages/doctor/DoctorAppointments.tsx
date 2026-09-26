import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Check, X, FilePlus, MessageSquare } from 'lucide-react';
import api from '../../services/api';
import { Appointment } from '../../types';

export const DoctorAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
  const [notesModalApp, setNotesModalApp] = useState<Appointment | null>(null);
  const [consultationNotes, setConsultationNotes] = useState('');

  // Prescription modal state
  const [prescModalApp, setPrescModalApp] = useState<Appointment | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState('');
  const [instructions, setInstructions] = useState('');

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

  const handleUpdateStatus = async (id: number, status: string, notes?: string) => {
    try {
      await api.put(`/appointments/${id}/status`, { status, consultationNotes: notes });
      setNotesModalApp(null);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prescModalApp) return;

    try {
      await api.post('/prescriptions', {
        appointmentId: prescModalApp.id,
        diagnosis,
        medicines,
        instructions,
      });
      setPrescModalApp(null);
      setDiagnosis('');
      setMedicines('');
      setInstructions('');
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Doctor Consultations & Appointments" subtitle="Manage patient bookings, update consultation notes, and issue prescriptions">
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Date & Slot</th>
              <th>Reason</th>
              <th>Notes</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((app) => (
              <tr key={app.id}>
                <td><strong>#{app.id}</strong></td>
                <td>
                  <div style={{ fontWeight: 700 }}>{app.patient.user.fullName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Blood: {app.patient.bloodGroup || 'N/A'} | DOB: {app.patient.dateOfBirth || 'N/A'}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{app.appointmentDate}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{app.timeSlot}</div>
                </td>
                <td style={{ maxWidth: '180px', fontSize: '13px' }}>{app.reason || 'Checkup'}</td>
                <td style={{ maxWidth: '200px', fontSize: '12px', color: '#475569' }}>
                  {app.consultationNotes || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No notes added</span>}
                </td>
                <td>
                  <span className={`badge badge-${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {app.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleUpdateStatus(app.id, 'CONFIRMED')} className="btn btn-success btn-sm">
                          <Check size={14} /> Accept
                        </button>
                        <button onClick={() => handleUpdateStatus(app.id, 'REJECTED')} className="btn btn-danger btn-sm">
                          <X size={14} /> Reject
                        </button>
                      </>
                    )}

                    {(app.status === 'CONFIRMED' || app.status === 'COMPLETED') && (
                      <>
                        <button
                          onClick={() => {
                            setNotesModalApp(app);
                            setConsultationNotes(app.consultationNotes || '');
                          }}
                          className="btn btn-outline btn-sm"
                        >
                          <MessageSquare size={14} /> Add Notes
                        </button>
                        <button
                          onClick={() => {
                            setPrescModalApp(app);
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          <FilePlus size={14} /> Issue Rx
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Notes Modal */}
      {notesModalApp && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Consultation Notes for {notesModalApp.patient.user.fullName}</h3>
              <button onClick={() => setNotesModalApp(null)} style={{ border: 'none', cursor: 'pointer' }}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Doctor Examination & Clinical Findings</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  placeholder="Enter patient diagnosis notes, clinical observations..."
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setNotesModalApp(null)} className="btn btn-outline">Cancel</button>
              <button onClick={() => handleUpdateStatus(notesModalApp.id, notesModalApp.status, consultationNotes)} className="btn btn-primary">
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Prescription Modal */}
      {prescModalApp && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Create Digital Rx Prescription</h3>
              <button onClick={() => setPrescModalApp(null)} style={{ border: 'none', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleCreatePrescription}>
              <div className="modal-body">
                <div style={{ backgroundColor: '#f0f9ff', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
                  Patient: <strong>{prescModalApp.patient.user.fullName}</strong> | Date: <strong>{prescModalApp.appointmentDate}</strong>
                </div>

                <div className="form-group">
                  <label className="form-label">Diagnosis *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Acute Bronchitis, Essential Hypertension"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Prescribed Medicines & Dosage *</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="1. Amoxicillin 500mg - 1 capsule thrice daily after meals for 7 days&#10;2. Paracetamol 650mg - 1 tablet as needed for fever"
                    value={medicines}
                    onChange={(e) => setMedicines(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Dietary Advice / Follow-up Instructions</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Drink plenty of warm fluids, rest for 3 days..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setPrescModalApp(null)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Issue & Send Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
