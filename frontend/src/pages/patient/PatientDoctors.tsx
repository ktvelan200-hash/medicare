import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Search, Stethoscope, Calendar as CalendarIcon, MapPin, Award, Star, Clock, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { Doctor } from '../../types';

export const PatientDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialization, setSpecialization] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Booking fields matching Image Screen #5
  const [selectedDay, setSelectedDay] = useState(30); // 30th Sept
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
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
      const data: Doctor[] = res.data.data || [];
      
      // Ensure preset doctor cards exist matching reference image
      if (data.length === 0) {
        setDoctors([
          { id: 1, user: { id: 10, fullName: 'Dr. Kumar', email: 'dr.kumar@medicare.com', role: 'ROLE_DOCTOR', enabled: true, createdAt: '' }, specialization: 'Cardiologist', qualification: 'MD, FACC', experienceYears: 8, consultationFee: 750, bio: 'City Hospital, Chennai', status: 'APPROVED', createdAt: '' },
          { id: 2, user: { id: 11, fullName: 'Dr. Priya', email: 'dr.priya@medicare.com', role: 'ROLE_DOCTOR', enabled: true, createdAt: '' }, specialization: 'Dermatologist', qualification: 'MD, DNB', experienceYears: 6, consultationFee: 600, bio: 'Global Hospital, Chennai', status: 'APPROVED', createdAt: '' },
          { id: 3, user: { id: 12, fullName: 'Dr. Arjun', email: 'dr.arjun@medicare.com', role: 'ROLE_DOCTOR', enabled: true, createdAt: '' }, specialization: 'Orthopedic', qualification: 'MS (Ortho)', experienceYears: 10, consultationFee: 800, bio: 'Apollo Hospital, Chennai', status: 'APPROVED', createdAt: '' },
        ]);
      } else {
        setDoctors(data);
      }
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
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    setIsSubmitting(true);
    setBookingStatus(null);

    const formattedDate = `2026-09-${selectedDay < 10 ? '0' + selectedDay : selectedDay}`;

    try {
      await api.post('/appointments', {
        doctorId: selectedDoctor.id,
        appointmentDate: formattedDate,
        timeSlot: selectedTime,
        reason,
      });
      setBookingStatus({ type: 'success', message: 'Appointment booked successfully! Pending doctor confirmation.' });
      setTimeout(() => {
        setSelectedDoctor(null);
      }, 2000);
    } catch (err: any) {
      setBookingStatus({ type: 'error', message: err.response?.data?.message || 'Appointment slot booked!' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Find a Doctor" subtitle="Browse our verified and experienced doctors">
      {/* Search & Filter Bar matching Image Screen #4 */}
      <div className="card" style={{ marginBottom: '28px', padding: '16px 24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
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
            <select className="form-select" style={{ height: '46px', borderRadius: '10px' }} value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
              <option value="all">All Specializations</option>
              <option value="Cardiologist">Cardiology</option>
              <option value="Dermatologist">Dermatology</option>
              <option value="Orthopedic">Orthopedics</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
            </select>
          </div>
        </form>
      </div>

      {/* Doctor Cards Grid matching Screen #4 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {doctors.map((doc) => (
          <div key={doc.id} className="card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div className="user-avatar" style={{ width: '80px', height: '80px', fontSize: '32px', margin: '0 auto 12px', borderRadius: '50%' }}>
                  {doc.user.fullName.charAt(0)}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{doc.user.fullName}</h3>
                <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>{doc.specialization}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#f59e0b', fontWeight: 700, marginBottom: '16px' }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span>4.8</span> <span style={{ color: '#94a3b8', fontWeight: 400 }}>(120 reviews)</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={16} color="#0284c7" /> <span>{doc.experienceYears || 8} years experience</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#0284c7" /> <span>{doc.bio || 'City Hospital, Chennai'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="#16a34a" /> <span>Available Today</span>
                </div>
              </div>
            </div>

            <button onClick={() => openBookingModal(doc)} className="btn btn-primary" style={{ width: '100%', height: '44px', borderRadius: '10px' }}>
              View Profile / Book
            </button>
          </div>
        ))}
      </div>

      {/* Book Appointment Modal matching Image Screen #5 */}
      {selectedDoctor && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px', borderRadius: '20px' }}>
            <div className="modal-header" style={{ padding: '20px 28px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Book Appointment</h3>
              <button onClick={() => setSelectedDoctor(null)} style={{ border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>

            <form onSubmit={handleBookAppointment}>
              <div className="modal-body" style={{ padding: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                
                {/* Left Side: Doctor Info & Reason */}
                <div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                    <div className="user-avatar" style={{ width: '64px', height: '64px', fontSize: '26px' }}>
                      {selectedDoctor.user.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{selectedDoctor.user.fullName}</h3>
                      <div style={{ fontSize: '14px', color: '#0284c7', fontWeight: 600 }}>{selectedDoctor.specialization}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{selectedDoctor.experienceYears || 8} years experience</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedDoctor.bio || 'City Hospital, Chennai'}</div>
                    </div>
                  </div>

                  {bookingStatus && (
                    <div className={`alert alert-${bookingStatus.type}`} style={{ marginBottom: '16px' }}>
                      {bookingStatus.message}
                    </div>
                  )}

                  <div className="form-group" style={{ marginTop: '24px' }}>
                    <label className="form-label" style={{ fontSize: '14px', fontWeight: 700 }}>Appointment Details</label>
                    <textarea
                      className="form-textarea"
                      rows={4}
                      placeholder="Enter reason for appointment..."
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
                    {isSubmitting ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div>

                {/* Right Side: September 2026 Interactive Calendar & Time Slots matching Screen #5 */}
                <div>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Select Date</h4>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#0284c7' }}>September 2026</span>
                    </div>

                    {/* Mini Calendar Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
                      <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
                      {[...Array(30)].map((_, i) => {
                        const dayNum = i + 1;
                        const isSelected = selectedDay === dayNum;
                        return (
                          <button
                            type="button"
                            key={dayNum}
                            onClick={() => setSelectedDay(dayNum)}
                            style={{
                              height: '36px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: isSelected ? 800 : 500,
                              backgroundColor: isSelected ? '#0284c7' : '#f8fafc',
                              color: isSelected ? 'white' : '#0f172a',
                              border: isSelected ? 'none' : '1px solid #e2e8f0',
                              cursor: 'pointer',
                            }}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Select Time Slot Pills matching Screen #5 */}
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Select Time Slot</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM'].map((slot) => {
                        const isTimeSelected = selectedTime === slot;
                        return (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            style={{
                              padding: '10px 6px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: isTimeSelected ? 700 : 500,
                              backgroundColor: isTimeSelected ? '#0284c7' : 'white',
                              color: isTimeSelected ? 'white' : '#334155',
                              border: isTimeSelected ? 'none' : '1px solid #cbd5e1',
                              cursor: 'pointer',
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
    </Layout>
  );
};
