import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { FolderHeart, Plus, FileCode2, ExternalLink, Calendar } from 'lucide-react';
import api from '../../services/api';
import { MedicalRecord } from '../../types';

export const PatientMedicalRecords: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [recordType, setRecordType] = useState('Lab Report');
  const [fileUrl, setFileUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await api.get('/medical-records/my');
      setRecords(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/medical-records', {
        title,
        recordType,
        fileUrl,
        notes,
        recordDate,
      });
      setShowModal(false);
      setTitle('');
      setFileUrl('');
      setNotes('');
      fetchRecords();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Medical Records & Reports" subtitle="Securely store and access your diagnostic reports, X-rays, and clinical history">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} /> Upload New Health Record
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {records.map((rec) => (
          <div key={rec.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', backgroundColor: '#e0f2fe', padding: '3px 8px', borderRadius: '4px' }}>
                {rec.recordType}
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{rec.recordDate}</span>
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{rec.title}</h3>

            {rec.notes && (
              <p style={{ fontSize: '13px', color: '#475569', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                {rec.notes}
              </p>
            )}

            {rec.doctor && (
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                Linked Doctor: <strong>Dr. {rec.doctor.user.fullName}</strong>
              </div>
            )}

            {rec.fileUrl && (
              <a href={rec.fileUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                <ExternalLink size={14} /> Open Document File
              </a>
            )}
          </div>
        ))}
      </div>

      {records.length === 0 && (
        <div className="card empty-state">
          <FolderHeart className="empty-state-icon" size={48} />
          <h3>No medical records uploaded</h3>
          <p>Click "Upload New Health Record" to add your lab results, X-rays, or medical reports.</p>
        </div>
      )}

      {/* Add Record Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Upload New Medical Record</h3>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleAddRecord}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Record Title *</label>
                  <input type="text" className="form-input" placeholder="e.g. Blood Test Report, Chest X-Ray" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Record Type *</label>
                    <select className="form-select" value={recordType} onChange={(e) => setRecordType(e.target.value)}>
                      <option value="Lab Report">Lab Report</option>
                      <option value="X-Ray / Scan">X-Ray / Scan</option>
                      <option value="Vaccination Certificate">Vaccination Certificate</option>
                      <option value="Hospital Discharge Summary">Hospital Discharge Summary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Record Date *</label>
                    <input type="date" className="form-input" value={recordDate} onChange={(e) => setRecordDate(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Document File URL (Drive/S3 Link)</label>
                  <input type="url" className="form-input" placeholder="https://drive.google.com/..." value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Notes / Findings Summary</label>
                  <textarea className="form-textarea" rows={3} placeholder="Add doctor observations or test values..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Medical Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
