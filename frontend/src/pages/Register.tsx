import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, User, Stethoscope, ArrowRight } from 'lucide-react';
import { Role } from '../types';

export const Register: React.FC = () => {
  const [role, setRole] = useState<Role>('ROLE_PATIENT');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Doctor extra fields
  const [specialization, setSpecialization] = useState('General Physician');
  const [qualification, setQualification] = useState('MBBS');
  const [experienceYears, setExperienceYears] = useState(5);
  const [consultationFee, setConsultationFee] = useState(500);
  const [bio, setBio] = useState('');

  // Patient extra fields
  const [gender, setGender] = useState('Male');
  const [dateOfBirth, setDateOfBirth] = useState('1995-01-01');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const payload: any = {
      fullName,
      email,
      password,
      phone,
      role,
    };

    if (role === 'ROLE_DOCTOR') {
      payload.specialization = specialization;
      payload.qualification = qualification;
      payload.experienceYears = Number(experienceYears);
      payload.consultationFee = Number(consultationFee);
      payload.bio = bio;
    } else {
      payload.gender = gender;
      payload.dateOfBirth = dateOfBirth;
      payload.bloodGroup = bloodGroup;
      payload.address = address;
      payload.emergencyContact = emergencyContact;
      payload.medicalHistory = medicalHistory;
    }

    try {
      const res = await register(payload);
      if (res.role === 'ROLE_PATIENT') navigate('/patient/dashboard');
      else if (res.role === 'ROLE_DOCTOR') navigate('/doctor/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', backgroundColor: '#f8fafc' }}>
      <div style={{ maxWidth: '650px', width: '100%', backgroundColor: 'white', padding: '36px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Activity size={32} color="#0284c7" />
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>MediCare Registration</h1>
          </div>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Create your MediCare account as a Patient or Doctor</p>
        </div>

        {/* Role Switch Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', backgroundColor: '#f1f5f9', padding: '6px', borderRadius: '12px' }}>
          <button
            type="button"
            onClick={() => setRole('ROLE_PATIENT')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: role === 'ROLE_PATIENT' ? 'white' : 'transparent',
              color: role === 'ROLE_PATIENT' ? '#0284c7' : '#64748b',
              boxShadow: role === 'ROLE_PATIENT' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              border: 'none',
            }}
          >
            <User size={18} /> Register as Patient
          </button>
          <button
            type="button"
            onClick={() => setRole('ROLE_DOCTOR')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: role === 'ROLE_DOCTOR' ? 'white' : 'transparent',
              color: role === 'ROLE_DOCTOR' ? '#0d9488' : '#64748b',
              boxShadow: role === 'ROLE_DOCTOR' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              border: 'none',
            }}
          >
            <Stethoscope size={18} /> Register as Doctor
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" className="form-input" placeholder="e.g. Dr. Robert Smith" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input type="email" className="form-input" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input type="password" className="form-input" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input type="tel" className="form-input" placeholder="+1-555-0199" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>

          {role === 'ROLE_DOCTOR' ? (
            <>
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
                  <label className="form-label">Qualifications *</label>
                  <input type="text" className="form-input" placeholder="e.g. MD, FACC" value={qualification} onChange={(e) => setQualification(e.target.value)} required />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <input type="number" className="form-input" value={experienceYears} onChange={(e) => setExperienceYears(Number(e.target.value))} min={1} />
                </div>
                <div className="form-group">
                  <label className="form-label">Consultation Fee ($/₹)</label>
                  <input type="number" className="form-input" value={consultationFee} onChange={(e) => setConsultationFee(Number(e.target.value))} min={0} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Professional Bio</label>
                <textarea className="form-textarea" rows={2} placeholder="Brief summary of clinical expertise..." value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
            </>
          ) : (
            <>
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

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Residential Address</label>
                  <input type="text" className="form-input" placeholder="123 Health St, City" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Emergency Contact Phone</label>
                  <input type="tel" className="form-input" placeholder="+1-555-9999" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Medical History / Known Allergies</label>
                <textarea className="form-textarea" rows={2} placeholder="e.g. Asthma, Penicillin allergy..." value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '12px' }} disabled={loading}>
            {loading ? 'Registering Account...' : 'Complete Registration'} <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '20px' }}>
          Already have an account? <Link to="/login" style={{ color: '#0284c7', fontWeight: 700 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};
