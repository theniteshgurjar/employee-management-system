import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  LogOut,
  Clock,
  CheckCircle2,
  Calendar,
  Menu,
} from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live Digital Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const res = await api.get('/attendance/today');
      setTodayAttendance(res.data.data);
    } catch (err) {
      // not checked in yet
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const handlePunchIn = async () => {
    setLoading(true);
    try {
      const res = await api.post('/attendance/check-in', { remarks: 'Web portal check-in' });
      setTodayAttendance(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePunchOut = async () => {
    if (!window.confirm('Are you ready to clock out for today?')) return;
    setLoading(true);
    try {
      const res = await api.post('/attendance/check-out', { remarks: 'Web portal check-out' });
      setTodayAttendance(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const userRole = user?.roles?.[0]?.replace('ROLE_', '') || 'EMPLOYEE';

  return (
    <header className="navbar-container" style={styles.header}>
      {/* Left: Mobile Menu Toggle & Live Date & Time Indicator */}
      <div style={styles.leftSection}>
        <button
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          title="Open Menu"
        >
          <Menu size={19} />
        </button>

        <div className="time-ticker-badge" style={styles.timeTicker}>
          <Calendar size={15} color="var(--slate-500)" />
          <span style={styles.dateText}>{dateString}</span>
          <span style={styles.divider}>•</span>
          <Clock size={15} color="var(--primary-600)" />
          <span style={styles.liveClock}>{timeString}</span>
        </div>
      </div>

      {/* Right: Quick Punch Widget & User Menu */}
      <div style={styles.rightSection}>
        {/* Attendance Punch In / Punch Out Widget */}
        <div style={styles.punchWidget}>
          {!todayAttendance ? (
            <button
              onClick={handlePunchIn}
              disabled={loading}
              className="btn btn-sm btn-primary"
              style={styles.punchBtn}
            >
              <div style={styles.greenPulseDot} />
              <span>{loading ? 'Clocking In...' : 'Clock In'}</span>
            </button>
          ) : !todayAttendance.checkOutTime ? (
            <div style={styles.activePunchBox}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-success" style={{ display: 'inline-flex' }}>
                  <span className="badge-dot live-pulse" />
                  In: {todayAttendance.checkInTime}
                </span>
                <button
                  onClick={handlePunchOut}
                  disabled={loading}
                  className="btn btn-sm btn-secondary"
                  style={{ fontWeight: '600' }}
                >
                  {loading ? 'Clocking Out...' : 'Clock Out'}
                </button>
              </div>
            </div>
          ) : (
            <span className="badge badge-primary">
              <CheckCircle2 size={13} />
              <span>{todayAttendance.workingHours} hrs</span>
            </span>
          )}
        </div>

        {/* User Profile Pill */}
        <Link to="/profile" style={styles.userPill} title="View My Profile">
          <div style={styles.avatar}>
            {(user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
          </div>
          <div className="navbar-user-text" style={styles.userText}>
            <span style={styles.userName}>
              {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}
            </span>
            <span style={styles.roleChip}>{userRole}</span>
          </div>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="btn btn-sm btn-secondary"
          style={styles.logoutBtn}
          title="Sign out of system"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};

const styles = {
  header: {
    height: 'var(--topbar-height)',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--slate-200)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 36px',
    position: 'sticky',
    top: 0,
    zIndex: 90,
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  timeTicker: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'var(--slate-50)',
    padding: '6px 14px',
    borderRadius: '9999px',
    border: '1px solid var(--slate-200)',
    fontSize: '0.825rem',
  },
  dateText: {
    fontWeight: '500',
    color: 'var(--slate-600)',
  },
  divider: {
    color: 'var(--slate-300)',
  },
  liveClock: {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '600',
    color: 'var(--slate-900)',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  punchWidget: {
    display: 'flex',
    alignItems: 'center',
  },
  punchBtn: {
    padding: '7px 16px',
    borderRadius: '9999px',
  },
  greenPulseDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: '#34d399',
    boxShadow: '0 0 8px #34d399',
  },
  activePunchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  userPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '4px 12px 4px 5px',
    borderRadius: '9999px',
    backgroundColor: 'var(--slate-100)',
    border: '1px solid var(--slate-200)',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '6px',
    background: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.8rem',
    color: '#ffffff',
  },
  userText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.15,
  },
  userName: {
    fontSize: '0.825rem',
    fontWeight: '600',
    color: 'var(--slate-800)',
  },
  roleChip: {
    fontSize: '0.675rem',
    fontWeight: '600',
    color: 'var(--accent-600)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  logoutBtn: {
    padding: '8px',
    borderRadius: '50%',
    color: 'var(--slate-500)',
    border: '1px solid var(--slate-200)',
  },
};

export default Navbar;
