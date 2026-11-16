import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AlertCircle,
  KeyRound,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState(location.state?.prefillUser || '');
  const [password, setPassword] = useState(location.state?.prefillPass || '');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

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
    <div style={styles.page}>
      {/* Back to Home Link */}
      <div style={styles.topBar}>
        <Link to="/" style={styles.backLink}>
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div style={styles.cardContainer}>
        {/* Brand Header */}
        <div style={styles.brandRow}>
          <div style={styles.logoMark}>EMS</div>
          <span style={styles.brandTitle}>Employee Management System</span>
        </div>

        <div style={styles.header}>
          <h1 style={styles.title}>Sign in to your account</h1>
          <p style={styles.subtitle}>Enter your username and password to access the portal</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '18px' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <div style={styles.inputWrap}>
              <User size={16} color="#94a3b8" style={styles.inputIcon} />
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
            <div style={styles.inputWrap}>
              <KeyRound size={16} color="#94a3b8" style={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '38px', paddingRight: '40px' }}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={styles.submitBtn}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Demo Accounts Quick-Fill */}
        <div style={styles.demoSection}>
          <div style={styles.demoTitle}>Demo Accounts (1-Click Fill)</div>
          <div style={styles.demoGrid}>
            <button
              type="button"
              onClick={() => handleDemoFill('admin', 'admin123')}
              style={styles.demoChip}
            >
              <span className="badge badge-danger" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>ADMIN</span>
              <span style={{ fontWeight: 600 }}>admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('hr_lead', 'hr123')}
              style={styles.demoChip}
            >
              <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>HR</span>
              <span style={{ fontWeight: 600 }}>hr_lead</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('manager', 'manager123')}
              style={styles.demoChip}
            >
              <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>MGR</span>
              <span style={{ fontWeight: 600 }}>manager</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('john_doe', 'employee123')}
              style={styles.demoChip}
            >
              <span className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>EMP</span>
              <span style={{ fontWeight: 600 }}>john_doe</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Inter', sans-serif",
  },
  topBar: {
    position: 'absolute',
    top: '24px',
    left: '28px',
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#64748b',
    textDecoration: 'none',
  },
  cardContainer: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    padding: '32px 30px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  logoMark: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '0.75rem',
    letterSpacing: '0.05em',
    padding: '3px 7px',
    borderRadius: '5px',
  },
  brandTitle: {
    fontSize: '0.88rem',
    fontWeight: 700,
    color: '#0f172a',
  },
  header: {
    marginBottom: '22px',
  },
  title: {
    fontSize: '1.35rem',
    fontWeight: 800,
    color: '#0f172a',
    letterSpacing: '-0.02em',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#64748b',
  },
  inputWrap: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94a3b8',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  submitBtn: {
    width: '100%',
    padding: '11px',
    fontSize: '0.9rem',
    fontWeight: 600,
    marginTop: '6px',
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
  },
  demoSection: {
    marginTop: '24px',
    paddingTop: '18px',
    borderTop: '1px solid #f1f5f9',
  },
  demoTitle: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '10px',
    textAlign: 'center',
  },
  demoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  demoChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 10px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    fontSize: '0.8rem',
    color: '#334155',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};

export default Login;
