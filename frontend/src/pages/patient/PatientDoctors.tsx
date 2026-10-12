import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import {
  Search, Stethoscope, Calendar as CalendarIcon, MapPin, Award, Star,
  Clock, CheckCircle2, MessageSquare, ChevronRight, X, User
} from 'lucide-react';
import api from '../../services/api';
import { Doctor, Review, DoctorRatingSummary } from '../../types';

export const PatientDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialization, setSpecialization] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Dynamic booking dates: next 14 available days
  const [availableDays, setAvailableDays] = useState<{ dateStr: string; dayName: string; dayNum: number; monthName: string }[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [reason, setReason] = useState('');
  const [bookingStatus, setBookingStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reviews modal
  const [reviewDoctor, setReviewDoctor] = useState<Doctor | null>(null);
  const [doctorReviews, setDoctorReviews] = useState<Review[]>([]);
  const [ratingSummary, setRatingSummary] = useState<DoctorRatingSummary | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Generate the next 14 calendar dates dynamically starting from today
  useEffect(() => {
    const days: { dateStr: string; dayName: string; dayNum: number; monthName: string }[] = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });

      days.push({
        dateStr,
        dayName,
        dayNum: d.getDate(),
        monthName,
      });
    }

    setAvailableDays(days);
    if (days.length > 0) {
      setSelectedDateStr(days[0].dateStr);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [specialization]);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors', {
        params: { specialization: specialization === 'all' ? undefined : specialization, query: query || undefined }
      });
      const data: Doctor[] = res.data.data || [];
      setDoctors(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDoctors();
  };

  const openBookingModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setBookingStatus(null);
    setReason('');
  };

  const openReviewsModal = async (doctor: Doctor) => {
    setReviewDoctor(doctor);
    setLoadingReviews(true);
    try {
      const [revRes, sumRes] = await Promise.all([
        api.get(`/reviews/doctor/${doctor.id}`),
        api.get(`/reviews/doctor/${doctor.id}/summary`)
      ]);
      setDoctorReviews(revRes.data.data || []);
      setRatingSummary(sumRes.data.data || null);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDateStr) return;
    setIsSubmitting(true);
    setBookingStatus(null);

    try {
      await api.post('/appointments', {
        doctorId: selectedDoctor.id,
        appointmentDate: selectedDateStr,
        timeSlot: selectedTime,
        reason,
      });
      setBookingStatus({ type: 'success', message: 'Appointment booked successfully! Pending doctor confirmation.' });
      setTimeout(() => {
        setSelectedDoctor(null);
      }, 2000);
    } catch (err: any) {
      setBookingStatus({ type: 'error', message: err.response?.data?.message || 'Failed to book slot. It might be already taken.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Find a Doctor" subtitle="Browse our verified, certified medical specialists and check patient reviews">
      {/* Search & Filter Bar */}
      <div className="card" style={{ marginBottom: '28px', padding: '16px 24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px', height: '46px', borderRadius: '10px' }}
              placeholder="Search doctors by name or specialization..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ minWidth: '200px' }}>
            <select
              className="form-select"
              style={{ height: '46px', borderRadius: '10px' }}
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            >
              <option value="all">All Specializations</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Physician">General Physician</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '46px', padding: '0 24px', borderRadius: '10px' }}>
            Search
          </button>
        </form>
      </div>

      {/* Doctor Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '24px' }}>
        {doctors.map((doc) => {
          const hasRating = doc.averageRating && doc.averageRating > 0;
          return (
            <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', borderRadius: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div className="user-avatar" style={{ width: '56px', height: '56px', fontSize: '22px', flexShrink: 0 }}>
                  {doc.user.fullName.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      {doc.user.fullName}
                    </h3>
                  </div>
                  <div style={{ fontSize: '13px', color: '#0284c7', fontWeight: 600, marginTop: '2px' }}>
                    {doc.specialization}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {doc.qualification}
                  </div>
                </div>
              </div>

              {/* Rating & Review Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', padding: '8px 12px', backgroundColor: 'var(--bg-main)', borderRadius: '10px' }}>
                {hasRating ? (
                  <button
                    type="button"
                    onClick={() => openReviewsModal(doc)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: 0,
                      color: '#d97706',
                      fontWeight: 700,
                      fontSize: '13px',
                    }}
                    title="Click to view patient reviews"
                  >
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span>{doc.averageRating?.toFixed(1)}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                      ({doc.totalReviews} review{doc.totalReviews !== 1 ? 's' : ''})
                    </span>
                  </button>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={13} color="#94a3b8" /> New Specialist
                  </span>
                )}

                <div style={{ fontSize: '14px', fontWeight: 800, color: '#059669' }}>
                  ₹{doc.consultationFee || 500}
                </div>
              </div>

              {/* Doctor Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={15} color="#0284c7" />
                  <span>{doc.experienceYears || 5} years experience</span>
                </div>
                {doc.bio && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <MapPin size={15} color="#0284c7" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ lineHeight: '1.4' }}>{doc.bio}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 600 }}>
                  <CheckCircle2 size={15} color="#16a34a" />
                  <span>Verified & Approved Doctor</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                {hasRating && (
                  <button
                    type="button"
                    onClick={() => openReviewsModal(doc)}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <MessageSquare size={13} /> Reviews
                  </button>
                )}
                <button
                  onClick={() => openBookingModal(doc)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: hasRating ? 1.5 : 1, height: '40px', fontWeight: 700 }}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {doctors.length === 0 && (
        <div className="card empty-state">
          <Stethoscope className="empty-state-icon" size={48} />
          <h3>No doctors found</h3>
          <p>Try clearing your search query or selecting another medical specialization.</p>
        </div>
      )}

      {/* Book Appointment Modal */}
      {selectedDoctor && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px', borderRadius: '20px' }}>
            <div className="modal-header" style={{ padding: '20px 28px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Book Appointment</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                  Consultation with {selectedDoctor.user.fullName}
                </p>
              </div>
              <button
                onClick={() => setSelectedDoctor(null)}
                style={{ border: 'none', fontSize: '24px', cursor: 'pointer', background: 'none', color: 'var(--text-secondary)' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleBookAppointment}>
              <div className="modal-body" style={{ padding: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                
                {/* Left Side: Doctor Info & Reason */}
                <div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                    <div className="user-avatar" style={{ width: '64px', height: '64px', fontSize: '26px' }}>
                      {selectedDoctor.user.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{selectedDoctor.user.fullName}</h3>
                      <div style={{ fontSize: '14px', color: '#0284c7', fontWeight: 600 }}>{selectedDoctor.specialization}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {selectedDoctor.experienceYears || 5} years exp · Fee: ₹{selectedDoctor.consultationFee || 500}
                      </div>
                    </div>
                  </div>

                  {bookingStatus && (
                    <div className={`alert alert-${bookingStatus.type}`} style={{ marginBottom: '16px' }}>
                      {bookingStatus.message}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '14px', fontWeight: 700 }}>
                      Consultation Reason / Symptoms
                    </label>
                    <textarea
                      className="form-textarea"
                      rows={4}
                      placeholder="Describe what symptoms you are experiencing..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', height: '48px', fontSize: '16px', fontWeight: 700, borderRadius: '12px', marginTop: '16px' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Booking Slot...' : `Confirm Booking (₹${selectedDoctor.consultationFee || 500})`}
                  </button>
                </div>

                {/* Right Side: Dynamic Calendar & Time Slots */}
                <div>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Select Consultation Date</h4>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0284c7' }}>Upcoming 14 Days</span>
                    </div>

                    {/* Dynamic Days Carousel / Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
                      {availableDays.map((d) => {
                        const isSelected = selectedDateStr === d.dateStr;
                        return (
                          <button
                            type="button"
                            key={d.dateStr}
                            onClick={() => setSelectedDateStr(d.dateStr)}
                            style={{
                              padding: '8px 2px',
                              borderRadius: '10px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: isSelected ? 800 : 500,
                              backgroundColor: isSelected ? '#0284c7' : 'var(--bg-main)',
                              color: isSelected ? 'white' : 'var(--text-primary)',
                              border: isSelected ? 'none' : '1px solid var(--border-color)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <span style={{ fontSize: '10px', textTransform: 'uppercase', opacity: isSelected ? 0.9 : 0.6 }}>{d.dayName}</span>
                            <span style={{ fontSize: '15px', fontWeight: 800 }}>{d.dayNum}</span>
                            <span style={{ fontSize: '9px', opacity: isSelected ? 0.9 : 0.6 }}>{d.monthName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
                      Select Time Slot ({selectedDateStr})
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '8px' }}>
                      {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'].map((slot) => {
                        const isTimeSelected = selectedTime === slot;
                        return (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            style={{
                              padding: '10px 4px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: isTimeSelected ? 700 : 500,
                              backgroundColor: isTimeSelected ? '#0284c7' : 'var(--bg-card)',
                              color: isTimeSelected ? 'white' : 'var(--text-secondary)',
                              border: isTimeSelected ? 'none' : '1px solid var(--border-color)',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Patient Reviews Modal */}
      {reviewDoctor && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px', borderRadius: '20px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '19px', fontWeight: 800 }}>Patient Reviews & Ratings</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                  {reviewDoctor.user.fullName.startsWith('Dr.') ? reviewDoctor.user.fullName : `Dr. ${reviewDoctor.user.fullName}`} · {reviewDoctor.specialization}
                </p>
              </div>
              <button
                onClick={() => setReviewDoctor(null)}
                style={{ border: 'none', fontSize: '22px', cursor: 'pointer', background: 'none', color: 'var(--text-secondary)' }}
              >
                ×
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {loadingReviews ? (
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                  Loading patient reviews...
                </div>
              ) : (
                <>
                  {/* Rating Summary Card */}
                  {ratingSummary && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                      padding: '20px',
                      backgroundColor: 'var(--bg-main)',
                      borderRadius: '14px',
                      marginBottom: '24px'
                    }}>
                      <div style={{ textAlign: 'center', minWidth: '100px' }}>
                        <div style={{ fontSize: '38px', fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>
                          {ratingSummary.averageRating.toFixed(1)}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', margin: '6px 0 2px' }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={15}
                              fill={s <= Math.round(ratingSummary.averageRating) ? '#f59e0b' : 'none'}
                              color="#f59e0b"
                            />
                          ))}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {ratingSummary.totalReviews} review{ratingSummary.totalReviews !== 1 ? 's' : ''}
                        </div>
                      </div>

                      {/* Star breakdown bars */}
                      <div style={{ flex: 1 }}>
                        {[5, 4, 3, 2, 1].map((s) => {
                          const count = ratingSummary.starCounts?.[s] || 0;
                          const pct = ratingSummary.totalReviews > 0 ? (count / ratingSummary.totalReviews) * 100 : 0;
                          return (
                            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', marginBottom: '4px' }}>
                              <span style={{ width: '20px', color: 'var(--text-secondary)' }}>{s}★</span>
                              <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#f59e0b', borderRadius: '3px' }} />
                              </div>
                              <span style={{ width: '24px', color: 'var(--text-muted)', textAlign: 'right' }}>{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* List of Reviews */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {doctorReviews.map((rev) => (
                      <div key={rev.id} style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-card)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: '#e0f2fe',
                              color: '#0284c7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '13px'
                            }}>
                              {rev.patientName ? rev.patientName.charAt(0) : 'P'}
                            </div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {rev.patientName || 'Verified Patient'}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ''}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={14}
                                fill={s <= rev.rating ? '#f59e0b' : 'none'}
                                color="#f59e0b"
                              />
                            ))}
                          </div>
                        </div>

                        {rev.comment && (
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                            "{rev.comment}"
                          </p>
                        )}
                      </div>
                    ))}

                    {doctorReviews.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                        No reviews yet for this doctor. Be the first to share your consultation experience!
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setReviewDoctor(null)} className="btn btn-primary" style={{ minWidth: '100px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
