import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AlertCircle,
  KeyRound,
  User,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div style={styles.page}>
      {/* Left Feature Showcase Banner */}
      <div style={styles.leftBanner}>
        <div style={styles.brandRow}>
          <div style={styles.brandBadge}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <h2 style={styles.brandTitle}>Enterprise EMS</h2>
            <span style={styles.brandSubtitle}>Human Capital & Workforce Cloud</span>
          </div>
        </div>

        <div style={styles.heroContent}>
          <div style={styles.pillTag}>Enterprise Release 2026</div>
          <h1 style={styles.heroHeading}>
            Intelligent workforce management built for scale.
          </h1>
          <p style={styles.heroDesc}>
            Manage staff lifecycle, departmental hierarchies, real-time attendance punching, and multi-tier leave approval workflows with strict cryptographic audit logs.
          </p>

          <div style={styles.featureList}>
            <div style={styles.featureItem}>
              <CheckCircle2 size={18} color="#34d399" />
              <span>Role-Based Access Control (Admin, HR, Manager, Employee)</span>
            </div>
            <div style={styles.featureItem}>
              <CheckCircle2 size={18} color="#34d399" />
              <span>Real-Time Attendance Clock with Hour Computing</span>
            </div>
            <div style={styles.featureItem}>
              <CheckCircle2 size={18} color="#34d399" />
              <span>Automated Leave Balance Deductions & Restorations</span>
            </div>
            <div style={styles.featureItem}>
              <CheckCircle2 size={18} color="#34d399" />
              <span>Stateless JWT & BCrypt Password Encryption</span>
            </div>
          </div>
        </div>

        <div style={styles.footerQuote}>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            Powered by Java 21, Spring Boot 3, PostgreSQL 18 & React 18
          </span>
        </div>
      </div>

      {/* Right Login Card */}
      <div style={styles.rightSection}>
        <div style={styles.loginCard}>
          <div style={styles.cardHeader}>
            <div style={styles.lockIconBox}>
              <Lock size={22} color="var(--primary-600)" />
            </div>
            <h2 style={styles.cardTitle}>Sign in to your account</h2>
            <p style={styles.cardSubtitle}>Enter your enterprise credentials to access the workspace</p>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username or Corporate Email</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.inputIcon} />
                <input
                  id="username"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
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
                <KeyRound size={18} style={styles.inputIcon} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginTop: '10px' }}
              disabled={loading}
            >
              <span>{loading ? 'Authenticating credentials...' : 'Sign In to Portal'}</span>
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div style={styles.demoBox}>
            <div style={styles.demoLabel}>
              <Sparkles size={14} color="var(--primary-600)" />
              <span>One-Click Demo Roles (For Testing & Interviews)</span>
            </div>
            <div style={styles.demoButtonsGrid}>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                style={styles.demoBtn}
                onClick={() => handleDemoFill('admin', 'Admin@12345')}
              >
                <span style={{ fontSize: '1rem' }}>👑</span>
                <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.8rem' }}>Admin</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Full System Control</div>
                </div>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-secondary"
                style={styles.demoBtn}
                onClick={() => handleDemoFill('hr_lead', 'Hr@12345')}
              >
                <span style={{ fontSize: '1rem' }}>💼</span>
                <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.8rem' }}>HR Lead</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Staff & Depts</div>
                </div>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-secondary"
                style={styles.demoBtn}
                onClick={() => handleDemoFill('manager', 'Manager@12345')}
              >
                <span style={{ fontSize: '1rem' }}>📊</span>
                <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.8rem' }}>Manager</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Team Leaves</div>
                </div>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-secondary"
                style={styles.demoBtn}
                onClick={() => handleDemoFill('john_doe', 'Employee@12345')}
              >
                <span style={{ fontSize: '1rem' }}>👤</span>
                <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.8rem' }}>Employee</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Punch & Apply</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    backgroundColor: '#ffffff',
  },
  leftBanner: {
    flex: '1.1',
    background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    color: '#ffffff',
    padding: '48px 60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  brandBadge: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, var(--accent-500) 0%, var(--primary-600) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
  },
  brandTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },
  brandSubtitle: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: '600',
  },
  heroContent: {
    maxWidth: '540px',
    margin: '40px 0',
  },
  pillTag: {
    display: 'inline-block',
    padding: '5px 12px',
    borderRadius: '9999px',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    border: '1px solid rgba(99, 102, 241, 0.4)',
    color: '#a5b4fc',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '20px',
  },
  heroHeading: {
    fontSize: '2.5rem',
    fontWeight: '800',
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    color: '#ffffff',
    marginBottom: '20px',
  },
  heroDesc: {
    fontSize: '1rem',
    color: '#cbd5e1',
    lineHeight: 1.6,
    marginBottom: '32px',
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.9rem',
    color: '#e2e8f0',
    fontWeight: '500',
  },
  footerQuote: {
    paddingTop: '24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  rightSection: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    backgroundColor: '#f8fafc',
  },
  loginCard: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-xl)',
    boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
    border: '1px solid var(--slate-200)',
    padding: '40px 36px',
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  lockIconBox: {
    width: '50px',
    height: '50px',
    borderRadius: '14px',
    backgroundColor: 'var(--primary-50)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  cardTitle: {
    fontSize: '1.45rem',
    fontWeight: '700',
    color: 'var(--slate-900)',
    letterSpacing: '-0.02em',
  },
  cardSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--slate-500)',
    marginTop: '6px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--slate-400)',
    pointerEvents: 'none',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    color: 'var(--slate-400)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoBox: {
    marginTop: '28px',
    paddingTop: '20px',
    borderTop: '1px solid var(--slate-100)',
  },
  demoLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--slate-600)',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  demoButtonsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  demoBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '10px',
    padding: '8px 12px',
    border: '1px solid var(--slate-200)',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};

export default Login;
