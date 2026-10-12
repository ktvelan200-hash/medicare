import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../../components/Layout';
import {
  ShieldCheck, ShieldX, Eye, Check, X, AlertCircle, RefreshCw, Clock,
  User, Stethoscope, Award, Briefcase, FileText, Phone, Mail, Calendar,
  ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import { Doctor } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────
type ModalMode = 'details' | 'approve' | 'reject' | null;

interface Notification {
  type: 'success' | 'error';
  message: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

// ─── Component ────────────────────────────────────────────────────────────────
export const AdminDoctorApprovals: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [notification, setNotification] = useState<Notification | null>(null);

  const fetchPendingDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/doctors/pending');
      setDoctors(res.data.data || []);
    } catch (err) {
      setError('Unable to load pending doctor approvals.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingDoctors();
  }, [fetchPendingDoctors]);

  // Auto-dismiss notification after 4s
  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(t);
    }
  }, [notification]);

  const openModal = (doctor: Doctor, mode: ModalMode) => {
    setSelectedDoctor(doctor);
    setModalMode(mode);
    setRejectionReason('');
  };

  const closeModal = () => {
    setSelectedDoctor(null);
    setModalMode(null);
    setRejectionReason('');
  };

  const handleApprove = async (doctorId: number) => {
    setActionLoading(true);
    try {
      await api.put(`/admin/doctors/${doctorId}/approve`);
      setNotification({ type: 'success', message: 'Doctor approved successfully. They can now access doctor features.' });
      setDoctors(prev => prev.filter(d => d.id !== doctorId));
      closeModal();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to approve doctor. Please try again.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (doctorId: number) => {
    if (!rejectionReason.trim()) {
      setNotification({ type: 'error', message: 'Please provide a rejection reason.' });
      return;
    }
    setActionLoading(true);
    try {
      await api.put(`/admin/doctors/${doctorId}/reject`, { rejectionReason: rejectionReason.trim() });
      setNotification({ type: 'success', message: 'Doctor rejected. The rejection reason has been recorded.' });
      setDoctors(prev => prev.filter(d => d.id !== doctorId));
      closeModal();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to reject doctor. Please try again.' });
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Layout
      title="Pending Doctor Approvals"
      subtitle="Review and approve doctor registration requests."
    >
      {/* Notification Toast */}
      {notification && (
        <div
          className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-danger'}`}
          style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}
        >
          {notification.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {notification.message}
        </div>
      )}

      {/* Header count chip */}
      {!loading && !error && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              backgroundColor: doctors.length > 0 ? '#fef3c7' : '#f0fdf4',
              color: doctors.length > 0 ? '#b45309' : '#047857',
              padding: '4px 14px',
              borderRadius: 9999,
              fontSize: 13,
              fontWeight: 700,
            }}>
              {doctors.length} pending {doctors.length === 1 ? 'request' : 'requests'}
            </span>
          </div>
          <button
            className="btn btn-outline"
            onClick={fetchPendingDoctors}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
          <div style={{ display: 'inline-block', width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 16 }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading pending approvals…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
          <AlertCircle size={48} style={{ color: '#ef4444', marginBottom: 16 }} />
          <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{error}</h3>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={fetchPendingDoctors}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && doctors.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
          <ShieldCheck size={56} style={{ color: '#10b981', marginBottom: 16 }} />
          <h3 style={{ fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', marginBottom: 8 }}>
            No Pending Doctor Approvals
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto' }}>
            There are currently no doctor registration requests waiting for verification.
          </p>
        </div>
      )}

      {/* Table — Desktop */}
      {!loading && !error && doctors.length > 0 && (
        <>
          {/* Desktop Table */}
          <div className="card approval-table-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Specialization</th>
                    <th>Qualification</th>
                    <th>Experience</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map(doc => (
                    <tr key={doc.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0284c7, #0d9488)',
                            color: 'white', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0
                          }}>
                            {getInitials(doc.user.fullName)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{doc.user.fullName}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{doc.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#0284c7', background: '#e0f2fe', padding: '3px 10px', borderRadius: 9999 }}>
                          {doc.specialization}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{doc.qualification}</td>
                      <td style={{ fontWeight: 600 }}>{doc.experienceYears ?? '—'} {doc.experienceYears ? 'Yrs' : ''}</td>
                      <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{formatDate(doc.createdAt)}</td>
                      <td>
                        <span className="badge badge-pending" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={11} /> PENDING
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => openModal(doc, 'details')}
                            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                            id={`view-doctor-${doc.id}`}
                          >
                            <Eye size={13} /> View
                          </button>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => openModal(doc, 'approve')}
                            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                            id={`approve-doctor-${doc.id}`}
                          >
                            <Check size={13} /> Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => openModal(doc, 'reject')}
                            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                            id={`reject-doctor-${doc.id}`}
                          >
                            <X size={13} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="approval-mobile-cards">
            {doctors.map(doc => (
              <div key={doc.id} className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0284c7, #0d9488)',
                    color: 'white', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0
                  }}>
                    {getInitials(doc.user.fullName)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>{doc.user.fullName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{doc.user.email}</div>
                  </div>
                  <span className="badge badge-pending" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> PENDING
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: 13, marginBottom: 16 }}>
                  <div><span style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}>SPECIALIZATION</span><br />{doc.specialization}</div>
                  <div><span style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}>EXPERIENCE</span><br />{doc.experienceYears ?? '—'} {doc.experienceYears ? 'Yrs' : ''}</div>
                  <div><span style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}>QUALIFICATION</span><br />{doc.qualification}</div>
                  <div><span style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}>REGISTERED</span><br />{formatDate(doc.createdAt)}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => openModal(doc, 'details')} style={{ flex: 1, justifyContent: 'center' }}>
                    <Eye size={13} /> View
                  </button>
                  <button className="btn btn-success btn-sm" onClick={() => openModal(doc, 'approve')} style={{ flex: 1, justifyContent: 'center' }}>
                    <Check size={13} /> Approve
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => openModal(doc, 'reject')} style={{ flex: 1, justifyContent: 'center' }}>
                    <X size={13} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── MODAL ─────────────────────────────────────────────────────── */}
      {modalMode && selectedDoctor && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            style={{ maxWidth: modalMode === 'details' ? 680 : 460 }}
            onClick={e => e.stopPropagation()}
          >
            {/* ── View Details Modal ────────────────────────────────── */}
            {modalMode === 'details' && (
              <>
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0284c7, #0d9488)',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 18
                    }}>
                      {getInitials(selectedDoctor.user.fullName)}
                    </div>
                    <div>
                      <h2 style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>{selectedDoctor.user.fullName}</h2>
                      <span className="badge badge-pending" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <Clock size={11} /> PENDING REVIEW
                      </span>
                    </div>
                  </div>
                  <button onClick={closeModal} style={{ color: 'var(--text-secondary)', padding: 4 }}>
                    <X size={20} />
                  </button>
                </div>

                <div className="modal-body" style={{ padding: 24 }}>
                  {/* Personal Information */}
                  <Section title="Personal Information" icon={<User size={16} />}>
                    <InfoRow label="Full Name" value={selectedDoctor.user.fullName} />
                    <InfoRow label="Email" value={selectedDoctor.user.email} icon={<Mail size={13} />} />
                    <InfoRow label="Phone" value={selectedDoctor.user.phone || '—'} icon={<Phone size={13} />} />
                  </Section>

                  {/* Professional Information */}
                  <Section title="Professional Information" icon={<Stethoscope size={16} />}>
                    <InfoRow label="Specialization" value={selectedDoctor.specialization} highlight />
                    <InfoRow label="Qualification" value={selectedDoctor.qualification} />
                    <InfoRow label="Experience" value={selectedDoctor.experienceYears ? `${selectedDoctor.experienceYears} Years` : '—'} />
                    <InfoRow label="Consultation Fee" value={selectedDoctor.consultationFee ? `₹${selectedDoctor.consultationFee}` : '—'} />
                    <InfoRow label="Bio / About" value={selectedDoctor.bio || '—'} multiline />
                  </Section>

                  {/* Registration Information */}
                  <Section title="Registration Information" icon={<Calendar size={16} />}>
                    <InfoRow label="Registration Date" value={formatDate(selectedDoctor.createdAt)} />
                    <InfoRow label="Current Status" value="PENDING" statusBadge="pending" />
                  </Section>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-outline" onClick={closeModal}>Close</button>
                  <button className="btn btn-danger" onClick={() => setModalMode('reject')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldX size={16} /> Reject Doctor
                  </button>
                  <button className="btn btn-success" onClick={() => setModalMode('approve')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={16} /> Approve Doctor
                  </button>
                </div>
              </>
            )}

            {/* ── Approve Confirmation Modal ────────────────────────── */}
            {modalMode === 'approve' && (
              <>
                <div className="modal-header">
                  <h2 style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>Approve Doctor?</h2>
                  <button onClick={closeModal} style={{ color: 'var(--text-secondary)', padding: 4 }}>
                    <X size={20} />
                  </button>
                </div>
                <div className="modal-body">
                  <div style={{ textAlign: 'center', padding: '8px 0 24px' }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0284c7, #0d9488)',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 24, margin: '0 auto 16px'
                    }}>
                      {getInitials(selectedDoctor.user.fullName)}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Are you sure you want to approve <strong style={{ color: 'var(--text-primary)' }}>{selectedDoctor.user.fullName}</strong>?
                    </p>
                    <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 13 }}>
                      The doctor will gain access to all doctor features and become visible in patient doctor search.
                    </p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-outline" onClick={closeModal} disabled={actionLoading}>Cancel</button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleApprove(selectedDoctor.id)}
                    disabled={actionLoading}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    id={`confirm-approve-${selectedDoctor.id}`}
                  >
                    {actionLoading ? 'Approving…' : <><ShieldCheck size={16} /> Approve</>}
                  </button>
                </div>
              </>
            )}

            {/* ── Reject Modal ──────────────────────────────────────── */}
            {modalMode === 'reject' && (
              <>
                <div className="modal-header">
                  <h2 style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>Reject Doctor</h2>
                  <button onClick={closeModal} style={{ color: 'var(--text-secondary)', padding: 4 }}>
                    <X size={20} />
                  </button>
                </div>
                <div className="modal-body">
                  <p style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>
                    You are about to reject <strong style={{ color: 'var(--text-primary)' }}>{selectedDoctor.user.fullName}</strong>. Please provide a reason:
                  </p>
                  <div className="form-group">
                    <label className="form-label">Reason for Rejection *</label>
                    <textarea
                      className="form-textarea"
                      rows={4}
                      placeholder="e.g. Required medical license document was not provided."
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      style={{ resize: 'vertical', minHeight: 100 }}
                      id={`rejection-reason-${selectedDoctor.id}`}
                    />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      This reason will be stored in the system.
                    </span>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-outline" onClick={closeModal} disabled={actionLoading}>Cancel</button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(selectedDoctor.id)}
                    disabled={actionLoading || !rejectionReason.trim()}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    id={`confirm-reject-${selectedDoctor.id}`}
                  >
                    {actionLoading ? 'Rejecting…' : <><ShieldX size={16} /> Reject Doctor</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .approval-table-card { display: block; }
        .approval-mobile-cards { display: none; }
        @media (max-width: 768px) {
          .approval-table-card { display: none !important; }
          .approval-mobile-cards { display: block; }
        }
      `}</style>
    </Layout>
  );
};

// ─── Sub-components ────────────────────────────────────────────────────────────
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
      paddingBottom: 10, borderBottom: '1px solid var(--border-color)' }}>
      <span style={{ color: '#0284c7' }}>{icon}</span>
      <h4 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </h4>
    </div>
    <div style={{ display: 'grid', gap: 8 }}>
      {children}
    </div>
  </div>
);

const InfoRow: React.FC<{
  label: string;
  value: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  multiline?: boolean;
  statusBadge?: string;
}> = ({ label, value, icon, highlight, multiline, statusBadge }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: multiline ? 'flex-start' : 'center', fontSize: 14 }}>
    <span style={{ minWidth: 150, color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, paddingTop: multiline ? 2 : 0 }}>{label}</span>
    <span style={{
      flex: 1, fontWeight: highlight ? 700 : 500,
      color: highlight ? '#0284c7' : 'var(--text-primary)',
      wordBreak: 'break-word'
    }}>
      {statusBadge ? <span className={`badge badge-${statusBadge}`}>{value}</span> : (
        <>{icon && <span style={{ marginRight: 4, verticalAlign: 'middle', display: 'inline-block' }}>{icon}</span>}{value}</>
      )}
    </span>
  </div>
);
