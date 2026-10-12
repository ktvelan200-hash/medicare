import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Calendar, Clock, Stethoscope, AlertCircle, XCircle, Star, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { Appointment } from '../../types';

export const PatientAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Review modal states
  const [reviewApp, setReviewApp] = useState<Appointment | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

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

  const handleCancelAppointment = async (id: number) => {
    try {
      await api.delete(`/appointments/${id}`);
      setStatusMessage('Appointment cancelled successfully.');
      setCancelId(null);
      fetchAppointments();
    } catch (err: any) {
      setStatusMessage(err.response?.data?.message || 'Failed to cancel appointment.');
    }
  };

  const openReviewModal = (app: Appointment) => {
    setReviewApp(app);
    setRating(5);
    setHoverRating(0);
    setComment('');
    setReviewError(null);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewApp) return;
    setSubmittingReview(true);
    setReviewError(null);

    try {
      await api.post('/reviews', {
        appointmentId: reviewApp.id,
        rating,
        comment,
      });
      setStatusMessage(`⭐ Thank you! Your review for Dr. ${reviewApp.doctor.user.fullName} has been submitted.`);
      setReviewApp(null);
      fetchAppointments();
    } catch (err: any) {
      setReviewError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (filter === 'UPCOMING') return app.status === 'PENDING' || app.status === 'CONFIRMED';
    if (filter === 'COMPLETED') return app.status === 'COMPLETED';
    if (filter === 'CANCELLED') return app.status === 'CANCELLED' || app.status === 'REJECTED';
    return true;
  });

  const ratingLabels = ['', 'Poor Consultation', 'Fair', 'Good', 'Very Good', 'Exceptional Care! ⭐'];

  return (
    <Layout title="My Appointments" subtitle="Manage your booked doctor consultations and view appointment history">
      {statusMessage && <div className="alert alert-info">{statusMessage}</div>}

      {/* Filter Tabs */}
      <div className="card" style={{ marginBottom: '24px', padding: '12px 20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`btn ${filter === tab ? 'btn-primary' : 'btn-outline'} btn-sm`}
            >
              {tab} ({appointments.filter(a => {
                if (tab === 'UPCOMING') return a.status === 'PENDING' || a.status === 'CONFIRMED';
                if (tab === 'COMPLETED') return a.status === 'COMPLETED';
                if (tab === 'CANCELLED') return a.status === 'CANCELLED' || a.status === 'REJECTED';
                return true;
              }).length})
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Date & Time Slot</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((app) => (
              <tr key={app.id}>
                <td><strong>#{app.id}</strong></td>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {app.doctor.user.fullName.startsWith('Dr.') ? app.doctor.user.fullName : `Dr. ${app.doctor.user.fullName}`}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.doctor.user.email}</div>
                </td>
                <td>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#0284c7' }}>{app.doctor.specialization}</span>
                </td>
                <td>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{app.appointmentDate}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{app.timeSlot}</div>
                </td>
                <td style={{ maxWidth: '200px' }}>{app.reason || 'General consultation'}</td>
                <td>
                  <span className={`badge badge-${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </td>
                <td>
                  {(app.status === 'PENDING' || app.status === 'CONFIRMED') && (
                    <button
                      onClick={() => setCancelId(app.id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                    >
                      <XCircle size={14} /> Cancel
                    </button>
                  )}
                  {app.status === 'COMPLETED' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {app.hasReview ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: '#fef3c7',
                          color: '#d97706',
                          padding: '3px 8px',
                          borderRadius: '12px',
                        }}>
                          ⭐ {app.reviewRating ? `${app.reviewRating}★ Rated` : 'Rated'}
                        </span>
                      ) : (
                        <button
                          onClick={() => openReviewModal(app)}
                          className="btn btn-primary btn-sm"
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            backgroundColor: '#f59e0b',
                            borderColor: '#d97706',
                          }}
                        >
                          <Star size={13} fill="currentColor" /> Rate Doctor
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAppointments.length === 0 && (
          <div className="empty-state">
            <Calendar className="empty-state-icon" size={40} />
            <h3>No appointments found</h3>
            <p>You currently have no booked appointments matching this filter.</p>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Confirm Cancellation</h3>
              <button onClick={() => setCancelId(null)} style={{ border: 'none', cursor: 'pointer', background: 'none', color: 'var(--text-secondary)' }}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Are you sure you want to cancel appointment <strong>#{cancelId}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setCancelId(null)} className="btn btn-outline">Keep Appointment</button>
              <button onClick={() => handleCancelAppointment(cancelId)} className="btn btn-danger">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Rating & Review Modal */}
      {reviewApp && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px', borderRadius: '16px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Rate & Review Consultation</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                  {reviewApp.doctor.user.fullName.startsWith('Dr.') ? reviewApp.doctor.user.fullName : `Dr. ${reviewApp.doctor.user.fullName}`} · {reviewApp.doctor.specialization}
                </p>
              </div>
              <button
                onClick={() => setReviewApp(null)}
                style={{ border: 'none', fontSize: '22px', cursor: 'pointer', background: 'none', color: 'var(--text-secondary)' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitReview}>
              <div className="modal-body">
                {reviewError && (
                  <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
                    {reviewError}
                  </div>
                )}

                {/* Interactive Star Picker */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Select your rating
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: active ? '#f59e0b' : '#cbd5e1',
                            transform: active ? 'scale(1.15)' : 'scale(1)',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Star size={32} fill={active ? '#f59e0b' : 'none'} strokeWidth={1.5} />
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b', minHeight: '20px' }}>
                    {ratingLabels[hoverRating || rating]}
                  </div>
                </div>

                {/* Written Feedback Textarea */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Patient Feedback / Comments
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Share your experience: How was the doctor's communication, diagnosis accuracy, and overall care?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={1000}
                  />
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right', marginTop: '4px' }}>
                    {comment.length} / 1000 characters
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setReviewApp(null)}
                  className="btn btn-outline"
                  disabled={submittingReview}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingReview}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <CheckCircle2 size={16} />
                  {submittingReview ? 'Submitting...' : 'Submit Doctor Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
