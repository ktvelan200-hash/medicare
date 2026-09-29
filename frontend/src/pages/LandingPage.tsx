import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Calendar,
  ShieldCheck,
  FileText,
  UserCheck,
  Clock,
  PhoneCall,
  Award,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  Users
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      {/* Top Header Navigation */}
      <header
        style={{
          height: '80px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Activity size={24} />
          </div>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#0284c7', letterSpacing: '-0.5px' }}>
            MediCare
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center', fontSize: '15px', fontWeight: 600, color: '#475569' }}>
          <a href="#home" style={{ color: '#0284c7' }}>Home</a>
          <a href="#doctors" style={{ color: '#475569' }}>Doctors</a>
          <a href="#services" style={{ color: '#475569' }}>Services</a>
          <a href="#about" style={{ color: '#475569' }}>About</a>
          <a href="#contact" style={{ color: '#475569' }}>Contact</a>
        </nav>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/login" className="btn btn-outline" style={{ padding: '8px 20px' }}>
            Login
          </Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px' }}>
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" style={{ padding: '80px 48px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
        <div>
          <span style={{ display: 'inline-block', backgroundColor: '#e0f2fe', color: '#0284c7', fontWeight: 700, padding: '6px 16px', borderRadius: '9999px', fontSize: '13px', marginBottom: '20px' }}>
            🏥 24/7 ONLINE HEALTHCARE PLATFORM
          </span>

          <h1 style={{ fontSize: '56px', fontWeight: 800, lineHeight: 1.1, color: '#0f172a', marginBottom: '24px', letterSpacing: '-1px' }}>
            Your Health, <br />
            <span style={{ color: '#0284c7' }}>Our Priority</span>
          </h1>

          <p style={{ fontSize: '18px', color: '#475569', lineHeight: 1.6, marginBottom: '36px', maxWidth: '520px' }}>
            MediCare is an online healthcare management platform that connects patients, doctors, and hospitals for better healthcare services and seamless consultations.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
            <Link to="/patient/doctors" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '16px' }}>
              Find a Doctor <ArrowRight size={18} />
            </Link>
            <a href="#services" className="btn btn-outline" style={{ padding: '14px 28px', fontSize: '16px' }}>
              Learn More
            </a>
          </div>

          <div style={{ display: 'flex', gap: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0284c7' }}>500+</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Verified Doctors</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0d9488' }}>15,000+</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Happy Patients</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>99.8%</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Hero Graphic & Floating Badges */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '480px', height: '520px', borderRadius: '24px', background: 'linear-gradient(135deg, #0284c7, #0d9488)', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(2, 132, 199, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'white', padding: '32px' }}>
              <Stethoscope size={100} style={{ opacity: 0.9, marginBottom: '20px' }} />
              <h3 style={{ fontSize: '24px', fontWeight: 700 }}>Expert Medical Care</h3>
              <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '8px' }}>Book top cardiologists, neurologists, dermatologists, and pediatricians online instantly.</p>
            </div>
          </div>

          {/* Floating Badge 1 */}
          <div className="card" style={{ position: 'absolute', top: '40px', left: '-20px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={22} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800 }}>500+</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Trusted Doctors</div>
            </div>
          </div>

          {/* Floating Badge 2 */}
          <div className="card" style={{ position: 'absolute', bottom: '40px', right: '-20px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={22} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800 }}>24/7</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Online Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Feature Cards matching Image */}
      <section style={{ padding: '40px 48px 80px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          <div className="card" style={{ padding: '32px 24px', textAlign: 'left' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Calendar size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Book Appointments</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>Easily schedule consultations with our certified specialist doctors in real-time.</p>
          </div>

          <div className="card" style={{ padding: '32px 24px', textAlign: 'left' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#ccfbf1', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Award size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Verified Doctors</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>Experienced and certified medical professionals verified by platform administrators.</p>
          </div>

          <div className="card" style={{ padding: '32px 24px', textAlign: 'left' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <FileText size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Medical Records</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>Access digital health records, lab reports, and prescriptions securely anytime.</p>
          </div>

          <div className="card" style={{ padding: '32px 24px', textAlign: 'left' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Secure & Reliable</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>Your clinical data and medical history are encrypted and safe with us.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0f172a', color: 'white', padding: '40px 48px', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={24} color="#38bdf8" />
            <span style={{ fontSize: '20px', fontWeight: 800 }}>MediCare</span>
          </div>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>© 2026 MediCare Healthcare Management Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
