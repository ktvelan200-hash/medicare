import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Search, Stethoscope, Calendar, DollarSign, Award, Clock, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { Doctor, DoctorAvailability } from '../../types';

export const PatientDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialization, setSpecialization] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>([]);
  
  // Booking modal fields
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('09:00 - 09:30');
  const [reason, setReason] = useState('');
  const [bookingStatus, setBookingStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, [specialization]);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors', {
        params: { specialization: specialization === 'all' ? undefined : specialization, query: query || undefined }
      });
      setDoctors(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDoctors();
  };

  const openBookingModal = async (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setBookingStatus(null);
    try {
      const res = await api.get(`/doctors/${doctor.id}/availability`);
      setAvailabilities(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    setIsSubmitting(true);
    setBookingStatus(null);

    try {
      await api.post('/appointments', {
        doctorId: selectedDoctor.id,
        appointmentDate: bookingDate,
        timeSlot,
        reason,
      });
      setBookingStatus({ type: 'success', message: 'Appointment booked successfully! Your appointment request is now pending doctor approval.' });
      setTimeout(() => {
        setSelectedDoctor(null);
      }, 2000);
    } catch (err: any) {
      setBookingStatus({ type: 'error', message: err.response?.data?.message || 'Failed to book appointment.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Search Specialist Doctors" subtitle="Find verified medical specialists and book online appointments">
      {/* Search and Specialization Filter Bar */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search by Doctor Name, Qualification, or Specialization..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ minWidth: '180px' }}>
            <select className="form-select" value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
              <option value="all">All Specializations</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Physician">General Physician</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            <Search size={16} /> Search Doctors
          </button>
        </form>
      </div>

      {/* Doctors Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {doctors.map((doc) => (
          <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
                <div className="user-avatar" style={{ width: '56px', height: '56px', fontSize: '22px' }}>
                  {doc.user.fullName.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{doc.user.fullName}</h3>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0284c7', backgroundColor: '#e0f2fe', padding: '2px 8px', borderRadius: '4px' }}>
                    {doc.specialization}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={16} color="#0d9488" /> <strong>Qualification:</strong> {doc.qualification}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#d97706" /> <strong>Experience:</strong> {doc.experienceYears || 5}+ Years
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={16} color="#16a34a" /> <strong>Consultation Fee:</strong> ${doc.consultationFee || 500}
                </div>
              </div>

              {doc.bio && (
                <p style={{ fontSize: '13px', color: '#64748b', backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px', lineHeight: 1.4 }}>
                  "{doc.bio}"
                </p>
              )}
            </div>

            <button onClick={() => openBookingModal(doc)} className="btn btn-primary" style={{ width: '100%' }}>
              <Calendar size={16} /> Book Consultation
            </button>
          </div>
        ))}
      </div>

      {doctors.length === 0 && (
        <div className="card empty-state">
          <Stethoscope className="empty-state-icon" size={48} color="#94a3b8" />
          <h3>No doctors found</h3>
          <p>Try adjusting your search criteria or select another specialization filter.</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Book Appointment with {selectedDoctor.user.fullName}</h3>
              <button onClick={() => setSelectedDoctor(null)} style={{ border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleBookAppointment}>
              <div className="modal-body">
                {bookingStatus && (
                  <div className={`alert alert-${bookingStatus.type}`}>
                    {bookingStatus.message}
                  </div>
                )}

                <div style={{ backgroundColor: '#f0f9ff', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#0369a1' }}>
                  <strong>Specialization:</strong> {selectedDoctor.specialization} | <strong>Fee:</strong> ${selectedDoctor.consultationFee}
                </div>

                {availabilities.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <label className="form-label">Doctor Weekly Schedule:</label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {availabilities.map((a, i) => (
                        <span key={i} style={{ fontSize: '11px', backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          {a.dayOfWeek}: {a.startTime} - {a.endTime}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Select Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Time Slot *</label>
                  <select className="form-select" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} required>
                    <option value="09:00 - 09:30">09:00 - 09:30 AM</option>
                    <option value="10:00 - 10:30">10:00 - 10:30 AM</option>
                    <option value="11:00 - 11:30">11:00 - 11:30 AM</option>
                    <option value="14:00 - 14:30">02:00 - 02:30 PM</option>
                    <option value="15:00 - 15:30">03:00 - 03:30 PM</option>
                    <option value="16:00 - 16:30">04:00 - 04:30 PM</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Reason for Visit / Symptoms</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Briefly describe your health concern..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setSelectedDoctor(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
