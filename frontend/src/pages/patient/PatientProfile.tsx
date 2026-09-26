import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Save, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { PatientProfile } from '../../types';

export const PatientProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/patients/me');
      const data: PatientProfile = res.data.data;
      setProfile(data);
      if (data) {
        setFullName(data.user.fullName);
        setPhone(data.user.phone || '');
        setGender(data.gender || 'Male');
        setDateOfBirth(data.dateOfBirth || '');
        setBloodGroup(data.bloodGroup || 'O+');
        setAddress(data.address || '');
        setEmergencyContact(data.emergencyContact || '');
        setMedicalHistory(data.medicalHistory || '');
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
      await api.put('/patients/profile', {
        user: { fullName, phone },
        gender,
        dateOfBirth,
        bloodGroup,
        address,
        emergencyContact,
        medicalHistory,
      });
      setMessage('Profile updated successfully!');
      fetchProfile();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout title="My Personal Health Profile" subtitle="Manage your contact details, emergency contacts, and personal medical history">
      {message && <div className="alert alert-success">{message}</div>}

      <div style={{ maxWidth: '800px' }}>
        <form onSubmit={handleUpdate} className="card">
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Personal Details</h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address (Registered)</label>
              <input type="email" className="form-input" value={user?.email || ''} disabled style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }} />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input type="tel" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Emergency Contact Phone</label>
              <input type="tel" className="form-input" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input type="date" className="form-input" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select className="form-select" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Residential Address</label>
            <input type="text" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Medical History / Chronic Conditions / Allergies</label>
            <textarea className="form-textarea" rows={3} value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </Layout>
  );
};
