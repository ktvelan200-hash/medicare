import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await login({ email, password });
      if (res.role === 'ROLE_PATIENT') navigate('/patient/dashboard');
      else if (res.role === 'ROLE_DOCTOR') navigate('/doctor/dashboard');
      else if (res.role === 'ROLE_ADMIN') navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc' }}>
      {/* Left Banner */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0284c7 100%)',
          color: 'white',
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity size={36} color="#38bdf8" />
          <h1 style={{ fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg, #38bdf8, #2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            MediCare
          </h1>
        </div>

        <div>
          <h2 style={{ fontSize: '38px', fontWeight: 800, lineHeight: 1.2, marginBottom: '20px' }}>
            Next-Generation Healthcare Management Platform
          </h2>
          <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '480px', marginBottom: '32px' }}>
            Streamline patient appointments, doctor availability schedules, digital prescriptions, and electronic medical records in one integrated full-stack solution.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {['JWT Authenticated & Role-based Access Control', 'Prevent Duplicate Doctor Time Slot Bookings', 'Digital Prescriptions & Comprehensive Health Records'].map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#cbd5e1' }}>
                <CheckCircle2 size={18} color="#38bdf8" /> {feat}
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '13px', color: '#64748b' }}>
          © 2026 MediCare Healthcare Platform. Final Year Academic Capstone Project.
        </div>
      </div>

      {/* Right Login Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ maxWidth: '440px', width: '100%' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>Sign In to MediCare</h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>Enter your registered email and password to access your dashboard</p>
          </div>

          {/* Quick Demo Fill Buttons for Easy Presentation Testing */}
          <div style={{ backgroundColor: '#f1f5f9', padding: '14px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '8px' }}>
              ⚡ Quick Demo 1-Click Login:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => fillDemo('admin@medicare.com', 'admin123')} className="btn btn-outline btn-sm" style={{ fontSize: '11px' }}>
                Admin
              </button>
              <button onClick={() => fillDemo('dr.smith@medicare.com', 'doctor123')} className="btn btn-outline btn-sm" style={{ fontSize: '11px' }}>
                Dr. Smith (Doctor)
              </button>
              <button onClick={() => fillDemo('john.doe@gmail.com', 'patient123')} className="btn btn-outline btn-sm" style={{ fontSize: '11px' }}>
                John (Patient)
              </button>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '24px' }}>
            Don't have an account? <Link to="/register" style={{ color: '#0284c7', fontWeight: 700 }}>Register Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
