import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { Save, Stethoscope, Award, DollarSign } from 'lucide-react';
import api from '../../services/api';
import { Doctor } from '../../types';

export const DoctorProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('General Physician');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [consultationFee, setConsultationFee] = useState(500);
  const [bio, setBio] = useState('');

  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const res = await api.get('/doctors/me');
      const doc: Doctor = res.data.data;
      setDoctor(doc);
      if (doc) {
        setFullName(doc.user.fullName);
        setPhone(doc.user.phone || '');
        setSpecialization(doc.specialization);
        setQualification(doc.qualification);
        setExperienceYears(doc.experienceYears || 5);
        setConsultationFee(doc.consultationFee || 500);
        setBio(doc.bio || '');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await api.put('/doctors/profile', {
        user: { fullName, phone },
        specialization,
        qualification,
        experienceYears: Number(experienceYears),
        consultationFee: Number(consultationFee),
        bio,
      });
      setMessage('Doctor profile & fee updated successfully!');
      fetchDoctorProfile();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout title="Doctor Profile & Practice Settings" subtitle="Update your clinical specialization, qualifications, consultation fee, and bio">
      {message && <div className="alert alert-success">{message}</div>}

      <div style={{ maxWidth: '800px' }}>
        <form onSubmit={handleUpdate} className="card">
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Professional Doctor Info</h3>
            {doctor && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '13px',
                fontWeight: 700,
                backgroundColor: '#fef3c7',
                color: '#d97706',
                padding: '4px 12px',
                borderRadius: '16px',
              }}>
                ⭐ Patient Rating: {doctor.averageRating && doctor.averageRating > 0 ? doctor.averageRating.toFixed(1) : '5.0'} ({doctor.totalReviews || 0} reviews)
              </span>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input type="tel" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Specialization *</label>
              <select className="form-select" value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="General Physician">General Physician</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Qualifications / Degrees *</label>
              <input type="text" className="form-input" value={qualification} onChange={(e) => setQualification(e.target.value)} required />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Experience Years</label>
              <input type="number" className="form-input" value={experienceYears} onChange={(e) => setExperienceYears(Number(e.target.value))} min={1} />
            </div>
            <div className="form-group">
              <label className="form-label">Consultation Fee ($/₹)</label>
              <input type="number" className="form-input" value={consultationFee} onChange={(e) => setConsultationFee(Number(e.target.value))} min={0} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Doctor Bio & Expertise Summary</label>
            <textarea className="form-textarea" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </Layout>
  );
};
