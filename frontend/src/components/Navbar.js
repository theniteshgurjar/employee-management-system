import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LogOut, User as UserIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchTodayAttendance = async () => {
    try {
      const res = await api.get('/attendance/today');
      setTodayAttendance(res.data.data);
    } catch (err) {
      // not checked in or error
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const handlePunchIn = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/attendance/check-in', { remarks: 'Web portal check-in' });
      setTodayAttendance(res.data.data);
      setMessage({ type: 'success', text: 'Checked in successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Check-in failed' });
    } finally {
      setLoading(false);
    }
  };

  const handlePunchOut = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/attendance/check-out', { remarks: 'Web portal check-out' });
      setTodayAttendance(res.data.data);
      setMessage({ type: 'success', text: 'Checked out successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Check-out failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        <span style={styles.dateBadge}>{currentDate}</span>
      </div>

      <div style={styles.rightSection}>
        {/* Quick Attendance Check-in / Check-out Button */}
        <div style={styles.punchSection}>
          {!todayAttendance ? (
            <button
              onClick={handlePunchIn}
              disabled={loading}
              className="btn btn-sm btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Clock size={15} />
              <span>{loading ? 'Processing...' : 'Punch In'}</span>
            </button>
          ) : !todayAttendance.checkOutTime ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} />
                In: {todayAttendance.checkInTime}
              </span>
              <button
                onClick={handlePunchOut}
                disabled={loading}
                className="btn btn-sm btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Clock size={15} />
                <span>{loading ? 'Processing...' : 'Punch Out'}</span>
              </button>
            </div>
          ) : (
            <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} />
              Done ({todayAttendance.workingHours} hrs)
            </span>
          )}
        </div>

        {/* Profile Link */}
        <Link to="/profile" style={styles.profileLink} title="View Profile">
          <UserIcon size={18} />
          <span>{user?.username}</span>
        </Link>

        {/* Logout Button */}
        <button onClick={handleLogout} className="btn btn-sm btn-secondary" style={styles.logoutBtn} title="Sign Out">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

const styles = {
  header: {
    height: 'var(--topbar-height)',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid var(--gray-200)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    boxShadow: 'var(--shadow-sm)',
    position: 'sticky',
    top: 0,
    zIndex: 90,
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  dateBadge: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: 'var(--gray-600)',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  punchSection: {
    display: 'flex',
    alignItems: 'center',
  },
  profileLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--gray-700)',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    padding: '6px 10px',
    borderRadius: '6px',
    backgroundColor: 'var(--gray-100)',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--danger-700)',
    borderColor: '#fecaca',
  },
};

export default Navbar;
