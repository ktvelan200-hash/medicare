import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Lock, Mail, User, Stethoscope, Shield, ArrowRight } from 'lucide-react';

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px' }}>
      <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#ffffff', borderRadius: '20px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
        
        {/* Logo */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Activity size={26} />
          </div>
          <span style={{ fontSize: '26px', fontWeight: 800, color: '#0284c7', letterSpacing: '-0.5px' }}>
            MediCare
          </span>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Welcome Back</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>Login to your account</p>

        {error && <div className="alert alert-danger" style={{ textAlign: 'left' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '13px', color: '#334155' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '42px', height: '48px' }}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0, fontSize: '13px', color: '#334155' }}>Password</label>
              <a href="#forgot" style={{ fontSize: '12px', color: '#0284c7', fontWeight: 600 }}>Forgot Password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '42px', height: '48px' }}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', fontSize: '15px', fontWeight: 700, borderRadius: '12px', marginTop: '12px', backgroundColor: '#0284c7' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '20px', marginBottom: '28px' }}>
          Don't have an account? <Link to="/register" style={{ color: '#0284c7', fontWeight: 700 }}>Register</Link>
        </p>

        {/* 1-Click Role Switcher Buttons matching Image #2 */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: '12px', letterSpacing: '0.5px' }}>
            SELECT DEMO ROLE TO AUTO-FILL:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => fillDemo('john.doe@gmail.com', 'patient123')}
              style={{
                padding: '12px 8px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                backgroundColor: email === 'john.doe@gmail.com' ? '#e0f2fe' : '#f8fafc',
                color: email === 'john.doe@gmail.com' ? '#0284c7' : '#475569',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <User size={20} color="#0284c7" />
              <span style={{ fontSize: '12px', fontWeight: 700 }}>Patient</span>
            </button>

            <button
              onClick={() => fillDemo('dr.smith@medicare.com', 'doctor123')}
              style={{
                padding: '12px 8px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                backgroundColor: email === 'dr.smith@medicare.com' ? '#ccfbf1' : '#f8fafc',
                color: email === 'dr.smith@medicare.com' ? '#0d9488' : '#475569',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Stethoscope size={20} color="#0d9488" />
              <span style={{ fontSize: '12px', fontWeight: 700 }}>Doctor</span>
            </button>

            <button
              onClick={() => fillDemo('admin@medicare.com', 'admin123')}
              style={{
                padding: '12px 8px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                backgroundColor: email === 'admin@medicare.com' ? '#fee2e2' : '#f8fafc',
                color: email === 'admin@medicare.com' ? '#ef4444' : '#475569',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Shield size={20} color="#ef4444" />
              <span style={{ fontSize: '12px', fontWeight: 700 }}>Admin</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
