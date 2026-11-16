import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, AlertCircle, KeyRound, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    const res = await login(username.trim(), password.trim());
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message);
    }
  };

  const handleDemoFill = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <ShieldCheck size={28} color="#ffffff" />
          </div>
          <h1 style={styles.title}>Enterprise EMS</h1>
          <p style={styles.subtitle}>Sign in with your organizational credentials</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <div style={styles.inputWrapper}>
              <User size={16} style={styles.inputIcon} />
              <input
                id="username"
                type="text"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="e.g. admin or john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={styles.inputWrapper}>
              <KeyRound size={16} style={styles.inputIcon} />
              <input
                id="password"
                type="password"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Credentials Pill Bar for Testing & Interviews */}
        <div style={styles.demoSection}>
          <p style={styles.demoTitle}>Quick Demo Logins (Click to autofill):</p>
          <div style={styles.demoGrid}>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => handleDemoFill('admin', 'Admin@12345')}
            >
              👑 Admin
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => handleDemoFill('hr_lead', 'Hr@12345')}
            >
              💼 HR
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => handleDemoFill('manager', 'Manager@12345')}
            >
              📊 Manager
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => handleDemoFill('john_doe', 'Employee@12345')}
            >
              👤 Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-lg)',
    padding: '36px 32px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoBadge: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    backgroundColor: 'var(--primary-600)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--gray-900)',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--gray-500)',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--gray-400)',
  },
  demoSection: {
    marginTop: '28px',
    paddingTop: '20px',
    borderTop: '1px solid var(--gray-200)',
  },
  demoTitle: {
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--gray-500)',
    marginBottom: '10px',
    textAlign: 'center',
  },
  demoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
};

export default Login;
