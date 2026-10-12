import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Bell, User as UserIcon, Sun, Moon, CheckCheck, X } from 'lucide-react';
import api from '../services/api';
import { NotificationItem } from '../types';

interface NavbarProps {
  title: string;
  subtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title, subtitle }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [bellAnimate, setBellAnimate] = useState(false);
  const [prevUnread, setPrevUnread] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      const data: NotificationItem[] = res.data.data || [];
      setNotifications(data);

      const newUnread = data.filter((n) => !n.read).length;
      if (newUnread > prevUnread) {
        // Trigger bell ring animation when new notification arrives
        setBellAnimate(true);
        setTimeout(() => setBellAnimate(false), 1000);
      }
      setPrevUnread(newUnread);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  }, [user, prevUnread]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Poll every 30 seconds for new notifications
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    await Promise.all(unreadIds.map((id) => api.put(`/notifications/${id}/read`).catch(() => {})));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <header className="navbar">
      <div className="page-title-group">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="nav-user-info">
        {/* Dark Mode Toggle */}
        <button
          id="theme-toggle-btn"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark mode"
        >
          {isDark
            ? <Sun size={18} color="#f59e0b" />
            : <Moon size={18} />
          }
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            id="notification-bell-btn"
            onClick={() => setShowNotifs(!showNotifs)}
            className="theme-toggle-btn"
            title="Notifications"
            aria-label={`${unreadCount} unread notifications`}
          >
            <Bell
              size={18}
              className={bellAnimate ? 'bell-animate' : ''}
              color={isDark ? '#94a3b8' : '#475569'}
            />
            {unreadCount > 0 && (
              <span
                className="badge-pop"
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  minWidth: '18px',
                  height: '18px',
                  fontSize: '10px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                  border: '2px solid var(--navbar-bg)',
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifs && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '360px',
                backgroundColor: 'var(--notif-bg)',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                border: '1px solid var(--border-color)',
                zIndex: 200,
                overflow: 'hidden',
                animation: 'modalFadeIn 0.15s ease-out',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                }}
              >
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    🔔 Notifications
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      title="Mark all as read"
                      style={{
                        fontSize: '12px',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        border: 'none',
                        background: 'none',
                        padding: '4px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      <CheckCheck size={14} /> Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifs(false)}
                    style={{ cursor: 'pointer', color: 'var(--text-muted)', border: 'none', background: 'none' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div
                    style={{
                      padding: '32px 24px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '13px',
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔕</div>
                    <div style={{ fontWeight: 600 }}>No notifications yet</div>
                    <div style={{ marginTop: '4px', fontSize: '12px' }}>
                      You'll be notified about appointments, prescriptions, and more.
                    </div>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      style={{
                        padding: '14px 18px',
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: n.read
                          ? 'var(--bg-card)'
                          : 'var(--notif-unread-bg)',
                        cursor: 'pointer',
                        borderLeft: n.read
                          ? '3px solid transparent'
                          : `3px solid var(--notif-unread-border)`,
                        transition: 'background-color 0.15s ease',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: n.read ? 'transparent' : 'var(--primary)',
                          marginTop: '5px',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: n.read ? 500 : 700,
                            color: 'var(--text-primary)',
                            marginBottom: '2px',
                          }}
                        >
                          {n.title}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.4,
                          }}
                        >
                          {n.message}
                        </div>
                        {n.createdAt && (
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--text-muted)',
                              marginTop: '4px',
                            }}
                          >
                            {formatTime(n.createdAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div
                  style={{
                    padding: '10px 18px',
                    textAlign: 'center',
                    borderTop: '1px solid var(--border-color)',
                    background: 'var(--modal-footer-bg)',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                  }}
                >
                  Showing last {notifications.length} notifications
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Info Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="user-avatar">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <UserIcon size={20} />}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {user?.fullName}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user?.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
