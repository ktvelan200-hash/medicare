import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { UserCog, Shield, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import { User } from '../../types';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleUserStatus = async (id: number, currentEnabled: boolean) => {
    try {
      await api.put(`/admin/users/${id}/status`, { enabled: !currentEnabled });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="User Management & Access Control" subtitle="Enable or disable user account access across Patients, Doctors, and Administrators">
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td><strong>#{u.id}</strong></td>
                <td><div style={{ fontWeight: 700 }}>{u.fullName}</div></td>
                <td>{u.email}</td>
                <td>
                  <span style={{ fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: u.role === 'ROLE_ADMIN' ? '#fee2e2' : u.role === 'ROLE_DOCTOR' ? '#ccfbf1' : '#e0f2fe', color: u.role === 'ROLE_ADMIN' ? '#991b1b' : u.role === 'ROLE_DOCTOR' ? '#0f766e' : '#0369a1' }}>
                    {u.role.replace('ROLE_', '')}
                  </span>
                </td>
                <td>{u.phone || 'N/A'}</td>
                <td>
                  <span className={`badge ${u.enabled ? 'badge-approved' : 'badge-rejected'}`}>
                    {u.enabled ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => toggleUserStatus(u.id, u.enabled)}
                    className={`btn ${u.enabled ? 'btn-outline' : 'btn-success'} btn-sm`}
                    style={{ color: u.enabled ? '#ef4444' : 'white' }}
                  >
                    {u.enabled ? 'Disable Account' : 'Enable Account'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
