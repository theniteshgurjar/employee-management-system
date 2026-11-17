import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Clock,
  Calendar,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dynamic Swagger documentation URL adapting to deployed backend or local development
  const swaggerUrl =
    process.env.REACT_APP_SWAGGER_URL ||
    (process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL.replace(/\/api\/?$/, '') + '/swagger-ui.html'
      : 'http://localhost:8080/swagger-ui.html');

  const handleQuickLogin = (username, password) => {
    // Navigate to login page with state or let them autofill directly
    navigate('/login', { state: { prefillUser: username, prefillPass: password } });
  };

  return (
    <div style={styles.page}>
      {/* Top Navigation */}
      <header style={styles.nav}>
        <div style={styles.navContainer}>
          <Link to="/" style={styles.logo}>
            <div style={styles.logoMark}>EMS</div>
            <span style={styles.logoText}>Employee Management</span>
          </Link>

          <nav className="landing-nav-links" style={styles.navLinks}>
            <a href="#features" style={styles.link}>Features</a>
            <a href="#demo" style={styles.link}>Demo Logins</a>
            <a
              href={swaggerUrl}
              target="_blank"
              rel="noreferrer"
              style={styles.link}
            >
              API Docs <ExternalLink size={12} style={{ marginLeft: 3 }} />
            </a>
          </nav>

          <div>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '7px 14px', fontSize: '0.85rem' }}>
                Open Dashboard &rarr;
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ padding: '7px 14px', fontSize: '0.85rem' }}>
                Sign In &rarr;
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.badge}>Internal HR & Operations Tool</div>
          <h1 style={styles.headline}>The employee system<br />built for speed.</h1>
          <p style={styles.subhead}>
            Manage staff directory, track daily attendance, and approve team leave requests without the bloat.
          </p>

          <div style={styles.ctaGroup}>
            <Link to={user ? "/dashboard" : "/login"} className="btn btn-primary" style={styles.ctaBtn}>
              {user ? 'Go to Dashboard' : 'Sign In to Workspace'}
              <ArrowRight size={16} />
            </Link>
            <a
              href={swaggerUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={styles.secondaryBtn}
            >
              Swagger API Spec
            </a>
          </div>

          {/* Clean App Snapshot Preview Frame */}
          <div style={styles.previewWindow}>
            <div style={styles.windowHeader}>
              <div style={styles.windowDots}>
                <span style={{ ...styles.dot, backgroundColor: '#ef4444' }} />
                <span style={{ ...styles.dot, backgroundColor: '#f59e0b' }} />
                <span style={{ ...styles.dot, backgroundColor: '#10b981' }} />
              </div>
              <span style={styles.windowTitle}>ems-workspace.local/dashboard</span>
              <div style={{ width: 48 }} />
            </div>

            <div style={styles.windowBody}>
              <div style={styles.previewRow}>
                <div style={styles.mockCard}>
                  <span style={styles.mockCardLabel}>Total Staff</span>
                  <strong style={styles.mockCardValue}>4</strong>
                  <span style={styles.mockCardSub}>Active records</span>
                </div>
                <div style={styles.mockCard}>
                  <span style={styles.mockCardLabel}>Present Today</span>
                  <strong style={{ ...styles.mockCardValue, color: '#10b981' }}>3</strong>
                  <span style={styles.mockCardSub}>Clocked in</span>
                </div>
                <div style={styles.mockCard}>
                  <span style={styles.mockCardLabel}>Pending Approvals</span>
                  <strong style={{ ...styles.mockCardValue, color: '#f59e0b' }}>1</strong>
                  <span style={styles.mockCardSub}>Needs review</span>
                </div>
              </div>

              {/* Mock Table */}
              <div style={styles.mockTable}>
                <div style={styles.mockTableHeader}>
                  <span>Employee</span>
                  <span>Department</span>
                  <span>Today's Timecard</span>
                  <span style={{ textAlign: 'right' }}>Status</span>
                </div>
                <div style={styles.mockTableRow}>
                  <div style={styles.mockEmp}>
                    <div style={{ ...styles.mockAvatar, backgroundColor: '#3b82f6' }}>SA</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>System Administrator</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>EMP001 &bull; admin@ems.com</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.85rem' }}>Management</span>
                  <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 500 }}>09:00 AM &bull; On Shift</span>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-success">Active</span>
                  </div>
                </div>
                <div style={styles.mockTableRow}>
                  <div style={styles.mockEmp}>
                    <div style={{ ...styles.mockAvatar, backgroundColor: '#8b5cf6' }}>JD</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>John Doe</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>EMP004 &bull; john@ems.com</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.85rem' }}>Engineering</span>
                  <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 500 }}>09:15 AM &bull; On Shift</span>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-success">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Essential Pillars */}
      <section id="features" style={styles.section}>
        <div style={styles.sectionHeading}>
          <span style={styles.eyebrow}>CORE MODULES</span>
          <h2 style={styles.title}>Everything you need. Nothing you don't.</h2>
        </div>

        <div style={styles.grid3}>
          <div style={styles.card}>
            <div style={{ ...styles.iconWrap, backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Users size={20} />
            </div>
            <h3 style={styles.cardTitle}>Staff Directory</h3>
            <p style={styles.cardText}>
              Keep employee profiles, job titles, departments, and reporting hierarchies in one clean table with instant search and filtering.
            </p>
          </div>

          <div style={styles.card}>
            <div style={{ ...styles.iconWrap, backgroundColor: '#ecfdf5', color: '#059669' }}>
              <Clock size={20} />
            </div>
            <h3 style={styles.cardTitle}>Time & Attendance</h3>
            <p style={styles.cardText}>
              One-click check-in and check-out. Automated working hours calculation and duplicate punch prevention at the database level.
            </p>
          </div>

          <div style={styles.card}>
            <div style={{ ...styles.iconWrap, backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
              <Calendar size={20} />
            </div>
            <h3 style={styles.cardTitle}>Leave Approvals</h3>
            <p style={styles.cardText}>
              Casual, sick, and earned leave requests with automatic balance deduction, overlap checks, and manager decision trails.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Logins Section */}
      <section id="demo" style={{ ...styles.section, backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={styles.sectionHeading}>
          <span style={styles.eyebrow}>INSTANT ACCESS</span>
          <h2 style={styles.title}>Test with pre-configured roles</h2>
          <p style={styles.subtitle}>Click any role to jump straight into the login screen with credentials filled.</p>
        </div>

        <div style={styles.demoGrid}>
          <div style={styles.demoCard} onClick={() => handleQuickLogin('admin', 'admin123')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-danger">ADMIN</span>
              <span style={styles.clickHint}>Log in as Admin &rarr;</span>
            </div>
            <h4 style={{ margin: '12px 0 4px', fontSize: '1rem', color: '#0f172a' }}>System Administrator</h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>Full control over users, departments, and employee records.</p>
            <div style={styles.credRow}>
              <code>admin</code> &bull; <code>admin123</code>
            </div>
          </div>

          <div style={styles.demoCard} onClick={() => handleQuickLogin('hr_lead', 'hr123')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-success">HR</span>
              <span style={styles.clickHint}>Log in as HR &rarr;</span>
            </div>
            <h4 style={{ margin: '12px 0 4px', fontSize: '1rem', color: '#0f172a' }}>HR Lead</h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>Employee onboarding, department assignment, and company-wide attendance.</p>
            <div style={styles.credRow}>
              <code>hr_lead</code> &bull; <code>hr123</code>
            </div>
          </div>

          <div style={styles.demoCard} onClick={() => handleQuickLogin('manager', 'manager123')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-primary">MANAGER</span>
              <span style={styles.clickHint}>Log in as Manager &rarr;</span>
            </div>
            <h4 style={{ margin: '12px 0 4px', fontSize: '1rem', color: '#0f172a' }}>Department Manager</h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>Review and approve team leave requests and track daily attendance.</p>
            <div style={styles.credRow}>
              <code>manager</code> &bull; <code>manager123</code>
            </div>
          </div>

          <div style={styles.demoCard} onClick={() => handleQuickLogin('john_doe', 'employee123')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-neutral">EMPLOYEE</span>
              <span style={styles.clickHint}>Log in as Employee &rarr;</span>
            </div>
            <h4 style={{ margin: '12px 0 4px', fontSize: '1rem', color: '#0f172a' }}>Staff Employee</h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>Punch attendance clock, check remaining leave balances, and submit requests.</p>
            <div style={styles.credRow}>
              <code>john_doe</code> &bull; <code>employee123</code>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
            Employee Management System
          </span>
          <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
            &copy; {new Date().getFullYear()} EMS. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  nav: {
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  navContainer: {
    maxWidth: '1120px',
    margin: '0 auto',
    padding: '14px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: '#0f172a',
  },
  logoMark: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '0.8rem',
    letterSpacing: '0.05em',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  logoText: {
    fontWeight: 700,
    fontSize: '0.95rem',
    letterSpacing: '-0.02em',
  },
  navLinks: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: '#475569',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
  },
  hero: {
    padding: '72px 20px 48px',
    backgroundColor: '#ffffff',
  },
  heroInner: {
    maxWidth: '920px',
    margin: '0 auto',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#475569',
    backgroundColor: '#f1f5f9',
    padding: '4px 12px',
    borderRadius: '999px',
    marginBottom: '20px',
  },
  headline: {
    fontSize: 'clamp(2rem, 5.5vw, 3rem)',
    fontWeight: 800,
    letterSpacing: '-0.04em',
    lineHeight: 1.15,
    color: '#0f172a',
    marginBottom: '16px',
  },
  subhead: {
    fontSize: '1.1rem',
    color: '#64748b',
    maxWidth: '560px',
    margin: '0 auto 28px',
    lineHeight: 1.5,
  },
  ctaGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '52px',
    flexWrap: 'wrap',
  },
  ctaBtn: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: '11px 22px',
    fontSize: '0.92rem',
    fontWeight: 600,
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  secondaryBtn: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    border: '1px solid #cbd5e1',
    padding: '11px 20px',
    fontSize: '0.92rem',
    fontWeight: 600,
    borderRadius: '8px',
  },
  previewWindow: {
    maxWidth: '820px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    boxShadow: '0 20px 40px -15px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
    overflow: 'hidden',
    textAlign: 'left',
  },
  windowHeader: {
    backgroundColor: '#f8fafc',
    padding: '10px 16px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  windowDots: {
    display: 'flex',
    gap: '6px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  windowTitle: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  windowBody: {
    padding: '20px 24px',
  },
  previewRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
  },
  mockCard: {
    backgroundColor: '#f8fafc',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  mockCardLabel: {
    fontSize: '0.72rem',
    color: '#64748b',
    fontWeight: 600,
    textTransform: 'uppercase',
    display: 'block',
  },
  mockCardValue: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#0f172a',
    marginTop: '2px',
    display: 'block',
  },
  mockCardSub: {
    fontSize: '0.72rem',
    color: '#94a3b8',
  },
  mockTable: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflowX: 'auto',
  },
  mockTableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.2fr 1.5fr 1fr',
    minWidth: '460px',
    padding: '10px 14px',
    backgroundColor: '#f8fafc',
    fontSize: '0.72rem',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e2e8f0',
  },
  mockTableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.2fr 1.5fr 1fr',
    minWidth: '460px',
    padding: '12px 14px',
    alignItems: 'center',
    borderBottom: '1px solid #f1f5f9',
  },
  mockEmp: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  mockAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    padding: '64px 20px',
    maxWidth: '1120px',
    margin: '0 auto',
  },
  sectionHeading: {
    textAlign: 'center',
    maxWidth: '540px',
    margin: '0 auto 40px',
  },
  eyebrow: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    display: 'block',
    marginBottom: '6px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: '#0f172a',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '0.92rem',
    color: '#64748b',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '24px',
  },
  iconWrap: {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '8px',
  },
  cardText: {
    fontSize: '0.88rem',
    color: '#64748b',
    lineHeight: 1.5,
    margin: 0,
  },
  demoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  demoCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    padding: '18px 20px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  clickHint: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#2563eb',
  },
  credRow: {
    marginTop: '12px',
    paddingTop: '8px',
    borderTop: '1px solid #f1f5f9',
    fontSize: '0.78rem',
    color: '#475569',
  },
  footer: {
    borderTop: '1px solid #e2e8f0',
    padding: '20px',
  },
  footerContainer: {
    maxWidth: '1120px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    color: '#64748b',
  },
  greenPulse: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
  },
};

export default LandingPage;
