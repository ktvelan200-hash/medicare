import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, User as UserIcon } from 'lucide-react';
import api from '../services/api';
import { NotificationItem } from '../types';

interface NavbarProps {
  title: string;
  subtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title, subtitle }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="navbar">
      <div className="page-title-group">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="nav-user-info">
        {/* Notification Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="btn btn-outline"
            style={{ padding: '8px', borderRadius: '50%', position: 'relative' }}
          >
            <Bell size={20} color="#475569" />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '10px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '50px',
                width: '320px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                border: '1px solid #e2e8f0',
                zIndex: 200,
                padding: '16px',
              }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                Notifications
                <span style={{ fontSize: '11px', color: '#64748b' }}>{unreadCount} unread</span>
              </h4>
              <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', padding: '12px 0' }}>No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: n.read ? '#f8fafc' : '#f0f9ff',
                        cursor: 'pointer',
                        borderLeft: n.read ? '3px solid transparent' : '3px solid #0284c7',
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{n.title}</div>
                      <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="user-avatar">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <UserIcon size={20} />}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{user?.fullName}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{user?.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
