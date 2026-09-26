import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Stethoscope, Check, X } from 'lucide-react';
import api from '../../services/api';
import { Doctor } from '../../types';

export const AdminDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const fetchAllDoctors = async () => {
    try {
      const res = await api.get('/doctors');
      setDoctors(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.put(`/admin/doctors/${id}/status`, { status });
      fetchAllDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Doctor Directory & Verification" subtitle="Review and verify all registered doctor credentials">
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Qualification</th>
              <th>Experience</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id}>
                <td><strong>#{doc.id}</strong></td>
                <td>
                  <div style={{ fontWeight: 700 }}>{doc.user.fullName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{doc.user.email}</div>
                </td>
                <td><span style={{ fontSize: '12px', fontWeight: 600, color: '#0284c7' }}>{doc.specialization}</span></td>
                <td>{doc.qualification}</td>
                <td>{doc.experienceYears || 5} Yrs</td>
                <td>${doc.consultationFee || 500}</td>
                <td>
                  <span className={`badge badge-${doc.status.toLowerCase()}`}>
                    {doc.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {doc.status !== 'APPROVED' && (
                      <button onClick={() => updateStatus(doc.id, 'APPROVED')} className="btn btn-success btn-sm">
                        <Check size={14} /> Approve
                      </button>
                    )}
                    {doc.status !== 'REJECTED' && (
                      <button onClick={() => updateStatus(doc.id, 'REJECTED')} className="btn btn-danger btn-sm">
                        <X size={14} /> Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
