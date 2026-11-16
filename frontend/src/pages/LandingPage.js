import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Users,
  CalendarCheck,
  CalendarPlus,
  Lock,
  ArrowRight,
  Database,
  Sparkles,
  ExternalLink,
  FileCode,
  Terminal,
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div style={styles.pageContainer}>
      {/* Top Navigation Bar */}
      <header style={styles.navbar}>
        <div style={styles.navInner}>
          <div style={styles.brand}>
            <div style={styles.brandIcon}>
              <Shield size={22} color="#ffffff" />
            </div>
            <div>
              <span style={styles.brandTitle}>EMS Enterprise</span>
              <span style={styles.brandBadge}>2026 Edition</span>
            </div>
          </div>

          <nav style={styles.navLinks}>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#architecture" style={styles.navLink}>Architecture</a>
            <a href="#roles" style={styles.navLink}>Roles & RBAC</a>
            <a href="#database" style={styles.navLink}>Database</a>
            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noreferrer"
              style={styles.navLink}
            >
              Swagger Docs <ExternalLink size={13} style={{ marginLeft: '4px' }} />
            </a>
          </nav>

          <div style={styles.navActions}>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '8px 18px' }}>
                <span>Open Dashboard</span>
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                  Sign In
                </Link>
                <Link to="/login" className="btn btn-primary" style={{ padding: '8px 18px' }}>
                  <span>Launch Console</span>
                  <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroGlow} />
        <div style={styles.heroContainer}>
          <div style={styles.releasePill}>
            <Sparkles size={14} color="var(--primary-600)" />
            <span>Full-Stack Enterprise Architecture &bull; Spring Boot 3 &bull; React 18 &bull; PostgreSQL 18</span>
          </div>

          <h1 style={styles.heroHeading}>
            Modern Workforce Intelligence & <br />
            <span style={styles.gradientText}>HR Operations, Simplified.</span>
          </h1>

          <p style={styles.heroLead}>
            A complete full-stack enterprise platform engineered from scratch. Streamline employee lifecycles,
            automate attendance punch clocks with live stopwatches, manage multi-tier leave approval matrices,
            and enforce zero-trust role-based access control.
          </p>

          <div style={styles.heroCtas}>
            <Link to={user ? "/dashboard" : "/login"} className="btn btn-primary btn-lg" style={styles.ctaPrimary}>
              <span>Enter Management Portal</span>
              <ArrowRight size={18} />
            </Link>

            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-lg"
              style={styles.ctaSecondary}
            >
              <FileCode size={18} color="var(--primary-600)" />
              <span>Explore Interactive REST API</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div style={styles.metricsBar}>
            <div style={styles.metricItem}>
              <strong style={styles.metricVal}>Java 21 / 17</strong>
              <span style={styles.metricSub}>Spring Boot 3.2.5 REST API</span>
            </div>
            <div style={styles.metricDivider} />
            <div style={styles.metricItem}>
              <strong style={styles.metricVal}>PostgreSQL 18</strong>
              <span style={styles.metricSub}>ACID Relational Database</span>
            </div>
            <div style={styles.metricDivider} />
            <div style={styles.metricItem}>
              <strong style={styles.metricVal}>React 18 & JWT</strong>
              <span style={styles.metricSub}>Role-Based Dashboard Shell</span>
            </div>
            <div style={styles.metricDivider} />
            <div style={styles.metricItem}>
              <strong style={styles.metricVal}>Docker Ready</strong>
              <span style={styles.metricSub}>Multi-Stage Production Compose</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features / Pillars Grid */}
      <section id="features" style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionEyebrow}>ENTERPRISE CAPABILITIES</span>
          <h2 style={styles.sectionTitle}>Engineered for Real-World Corporate Operations</h2>
          <p style={styles.sectionSubtitle}>
            Every module is crafted following strict enterprise patterns: Controller &rarr; Service &rarr; Repository &rarr; Database.
          </p>
        </div>

        <div style={styles.featuresGrid}>
          {/* Feature 1 */}
          <div className="ems-card ems-card-hover" style={styles.featureCard}>
            <div style={{ ...styles.featureIcon, background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' }}>
              <Users size={22} color="#ffffff" />
            </div>
            <h3 style={styles.featureTitle}>Employee Lifecycle Management</h3>
            <p style={styles.featureDesc}>
              Complete staff directory with live instant search, multi-department filters, and dual-view switcher (Table vs. Cards). Includes instant live ID card preview during onboarding.
            </p>
            <ul style={styles.featureList}>
              <li>&bull; Auto-generated employee codes (EMP001+)</li>
              <li>&bull; Department assignment & reporting manager linking</li>
              <li>&bull; Safe soft-deactivation preserving audit trails</li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="ems-card ems-card-hover" style={styles.featureCard}>
            <div style={{ ...styles.featureIcon, background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
              <CalendarCheck size={22} color="#ffffff" />
            </div>
            <h3 style={styles.featureTitle}>Attendance & Live Punch Clock</h3>
            <p style={styles.featureDesc}>
              Interactive workday timecard featuring a real-time digital stopwatch counting elapsed shift duration, automated half-day threshold checks, and HR-wide daily presence rosters.
            </p>
            <ul style={styles.featureList}>
              <li>&bull; Duplicate check-in prevention with unique DB constraint</li>
              <li>&bull; Automated working hours calculation</li>
              <li>&bull; UTC normalization avoiding timezone drifts</li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="ems-card ems-card-hover" style={styles.featureCard}>
            <div style={{ ...styles.featureIcon, background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
              <CalendarPlus size={22} color="#ffffff" />
            </div>
            <h3 style={styles.featureTitle}>Leave Quota & Approval Workflows</h3>
            <p style={styles.featureDesc}>
              Automated multi-tier approval system for Casual, Sick, Earned, and Unpaid leave categories. Balances deduct strictly upon approval and restore immediately upon cancellation.
            </p>
            <ul style={styles.featureList}>
              <li>&bull; Overlap collision prevention & date sanity checks</li>
              <li>&bull; Interactive decision audit trail timeline</li>
              <li>&bull; Mandatory reviewer feedback on rejected requests</li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div className="ems-card ems-card-hover" style={styles.featureCard}>
            <div style={{ ...styles.featureIcon, background: 'linear-gradient(135deg, #dc2626 0%, #f43f5e 100%)' }}>
              <Lock size={22} color="#ffffff" />
            </div>
            <h3 style={styles.featureTitle}>Zero-Trust RBAC & Security</h3>
            <p style={styles.featureDesc}>
              Spring Security 6 integration with stateless JSON Web Tokens (JJWT 0.12.5) and salted BCrypt password hashing. Dual-tier enforcement across both React routing and backend `@PreAuthorize`.
            </p>
            <ul style={styles.featureList}>
              <li>&bull; Four segregated roles: ADMIN, HR, MANAGER, EMPLOYEE</li>
              <li>&bull; Granular authorization matrix</li>
              <li>&bull; Protected REST API endpoints & CORS security</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Role-Based Personas Section */}
      <section id="roles" style={{ ...styles.section, backgroundColor: '#f1f5f9' }}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionEyebrow}>ROLE-BASED EXPERIENCE</span>
          <h2 style={styles.sectionTitle}>Tailored Dashboards for Every Team Member</h2>
          <p style={styles.sectionSubtitle}>
            Log in with different credentials to experience the dynamic role-specific dashboard views.
          </p>
        </div>

        <div style={styles.rolesGrid}>
          {/* Admin Role Card */}
          <div className="ems-card" style={styles.roleCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span className="badge badge-danger">ADMIN</span>
              <strong style={{ fontSize: '1.1rem' }}>System Administrator</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '14px' }}>
              Master enterprise governance: user provisioning, security role grants, department architecture, and system oversight.
            </p>
            <div style={styles.demoLoginBox}>
              <span style={styles.demoLabel}>Demo Login:</span>
              <code style={styles.demoCode}>admin</code> / <code style={styles.demoCode}>Admin@12345</code>
            </div>
          </div>

          {/* HR Role Card */}
          <div className="ems-card" style={styles.roleCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span className="badge badge-success">HR</span>
              <strong style={{ fontSize: '1.1rem' }}>Human Resources Lead</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '14px' }}>
              Staff directory management, employee onboarding with live badge previews, daily company-wide attendance rosters, and leave approvals.
            </p>
            <div style={styles.demoLoginBox}>
              <span style={styles.demoLabel}>Demo Login:</span>
              <code style={styles.demoCode}>hr_lead</code> / <code style={styles.demoCode}>Hr@12345</code>
            </div>
          </div>

          {/* Manager Role Card */}
          <div className="ems-card" style={styles.roleCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span className="badge badge-primary">MANAGER</span>
              <strong style={{ fontSize: '1.1rem' }}>Team Manager</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '14px' }}>
              Supervise assigned department members, monitor live team presence, review time-off requests, and maintain audit decision trails.
            </p>
            <div style={styles.demoLoginBox}>
              <span style={styles.demoLabel}>Demo Login:</span>
              <code style={styles.demoCode}>manager</code> / <code style={styles.demoCode}>Manager@12345</code>
            </div>
          </div>

          {/* Employee Role Card */}
          <div className="ems-card" style={styles.roleCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span className="badge badge-neutral">EMPLOYEE</span>
              <strong style={{ fontSize: '1.1rem' }}>Staff Member</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '14px' }}>
              Self-service timecard with live shift stopwatch, leave quota meters, request submissions, and digital employee identity profile.
            </p>
            <div style={styles.demoLoginBox}>
              <span style={styles.demoLabel}>Demo Login:</span>
              <code style={styles.demoCode}>john_doe</code> / <code style={styles.demoCode}>Employee@12345</code>
            </div>
          </div>
        </div>
      </section>

      {/* Database & Architecture Section */}
      <section id="database" style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionEyebrow}>DATA ARCHITECTURE</span>
          <h2 style={styles.sectionTitle}>Where to Inspect the Database & Live Tables</h2>
          <p style={styles.sectionSubtitle}>
            PostgreSQL 18 is running locally on port 5432 with ACID transactions, foreign keys, and indexes.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Terminal / CLI Inspection Box */}
          <div className="ems-card" style={{ margin: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--slate-900)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Terminal size={18} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0 }}>Method 1: Terminal / psql (Instant)</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>Inspect directly via command line</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '12px' }}>
              Run this command in any terminal to open an interactive PostgreSQL shell:
            </p>

            <pre style={styles.codeSnippet}>
              <code>D:\pgsql\bin\psql.exe -U postgres -d ems_db</code>
            </pre>

            <div style={{ fontSize: '0.82rem', color: 'var(--slate-700)', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><code>\dt</code> &mdash; List all 8 database tables</div>
              <div><code>\d employees</code> &mdash; Inspect employee schema & foreign keys</div>
              <div><code>SELECT * FROM employees;</code> &mdash; View all employee records</div>
              <div><code>SELECT * FROM attendance;</code> &mdash; View attendance punch logs</div>
              <div><code>SELECT * FROM leave_balances;</code> &mdash; View leave quota allocations</div>
            </div>
          </div>

          {/* Visual GUI Tools Box */}
          <div className="ems-card" style={{ margin: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={18} color="var(--primary-600)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0 }}>Method 2: Visual GUI Tools</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>pgAdmin 4, DBeaver, or VS Code</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '12px' }}>
              Connect with any graphical tool using these standard local credentials:
            </p>

            <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid var(--slate-200)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>Host:</strong> <code>localhost</code></div>
              <div><strong>Port:</strong> <code>5432</code></div>
              <div><strong>Database:</strong> <code>ems_db</code></div>
              <div><strong>Username:</strong> <code>postgres</code></div>
              <div><strong>Authentication:</strong> <code>Local trust (no password required)</code></div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '12px' }}>
              <strong>Recommended Tools:</strong> pgAdmin 4 (official PostgreSQL GUI), DBeaver Community (free universal DB client), or the "PostgreSQL" VS Code extension.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section style={styles.ctaBanner}>
        <div style={styles.ctaInner}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Ready to explore the Employee Management System?
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 24px' }}>
            All services are actively compiled, connected, and running live on your laptop.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary btn-lg" style={{ backgroundColor: '#ffffff', color: 'var(--primary-700)', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
              <span>Sign In to Application</span>
              <ArrowRight size={18} />
            </Link>
            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-lg"
              style={{ backgroundColor: 'transparent', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <span>Swagger API Docs</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={styles.statusDot} />
            <span style={{ fontSize: '0.82rem', color: 'var(--slate-600)', fontWeight: '500' }}>
              All Systems Operational &bull; PostgreSQL 5432 &bull; Spring Boot 8080 &bull; React 3000
            </span>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--slate-400)' }}>
            &copy; 2026 Employee Management System (EMS). Built from scratch.
          </span>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    color: 'var(--slate-800)',
    fontFamily: "'Inter', sans-serif",
  },
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--slate-200)',
  },
  navInner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
  },
  brandIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, var(--accent-600) 0%, var(--primary-600) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
  },
  brandTitle: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: 'var(--slate-900)',
    letterSpacing: '-0.02em',
    display: 'block',
  },
  brandBadge: {
    fontSize: '0.68rem',
    fontWeight: '600',
    color: 'var(--primary-600)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLink: {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: 'var(--slate-600)',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
    display: 'inline-flex',
    alignItems: 'center',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  heroSection: {
    padding: '80px 24px 60px',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid var(--slate-200)',
  },
  heroGlow: {
    position: 'absolute',
    top: '-10%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroContainer: {
    maxWidth: '920px',
    margin: '0 auto',
    textAlign: 'center',
    position: 'relative',
  },
  releasePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '999px',
    backgroundColor: 'var(--primary-50)',
    border: '1px solid rgba(59, 130, 246, 0.25)',
    color: 'var(--primary-700)',
    fontSize: '0.78rem',
    fontWeight: '700',
    letterSpacing: '0.02em',
    marginBottom: '24px',
  },
  heroHeading: {
    fontSize: '2.8rem',
    fontWeight: '800',
    color: 'var(--slate-900)',
    letterSpacing: '-0.03em',
    lineHeight: 1.15,
    marginBottom: '20px',
  },
  gradientText: {
    background: 'linear-gradient(135deg, var(--accent-600) 0%, var(--primary-600) 50%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroLead: {
    fontSize: '1.1rem',
    color: 'var(--slate-600)',
    lineHeight: 1.6,
    maxWidth: '740px',
    margin: '0 auto 32px',
  },
  heroCtas: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
    marginBottom: '48px',
  },
  ctaPrimary: {
    padding: '12px 28px',
    boxShadow: '0 6px 20px rgba(79, 70, 229, 0.35)',
  },
  ctaSecondary: {
    padding: '12px 24px',
  },
  metricsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px',
    padding: '24px 28px',
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--slate-200)',
    boxShadow: 'var(--shadow-card)',
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  metricVal: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--slate-900)',
  },
  metricSub: {
    fontSize: '0.78rem',
    color: 'var(--slate-500)',
    fontWeight: '500',
  },
  metricDivider: {
    display: 'none',
  },
  section: {
    padding: '80px 24px',
    maxWidth: '1280px',
    margin: '0 auto',
  },
  sectionHeader: {
    textAlign: 'center',
    maxWidth: '700px',
    margin: '0 auto 48px',
  },
  sectionEyebrow: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: 'var(--primary-600)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    display: 'block',
    marginBottom: '8px',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: 'var(--slate-900)',
    letterSpacing: '-0.02em',
    marginBottom: '12px',
  },
  sectionSubtitle: {
    fontSize: '0.98rem',
    color: 'var(--slate-500)',
    lineHeight: 1.5,
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  featureCard: {
    margin: 0,
    padding: '28px 24px',
    display: 'flex',
    flexDirection: 'column',
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
  },
  featureTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--slate-900)',
    marginBottom: '10px',
  },
  featureDesc: {
    fontSize: '0.88rem',
    color: 'var(--slate-600)',
    lineHeight: 1.5,
    marginBottom: '16px',
    flex: 1,
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    fontSize: '0.8rem',
    color: 'var(--slate-500)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    borderTop: '1px solid var(--slate-100)',
    paddingTop: '12px',
  },
  rolesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
  },
  roleCard: {
    margin: 0,
    padding: '24px 20px',
  },
  demoLoginBox: {
    backgroundColor: '#f8fafc',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid var(--slate-200)',
    fontSize: '0.78rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  demoLabel: {
    color: 'var(--slate-500)',
    fontWeight: '600',
  },
  demoCode: {
    backgroundColor: '#ffffff',
    padding: '2px 6px',
    borderRadius: '4px',
    border: '1px solid var(--slate-200)',
    color: 'var(--primary-700)',
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  codeSnippet: {
    backgroundColor: 'var(--slate-900)',
    color: '#38bdf8',
    padding: '12px 14px',
    borderRadius: '8px',
    fontSize: '0.82rem',
    overflowX: 'auto',
    fontFamily: 'monospace',
  },
  ctaBanner: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
    padding: '72px 24px',
    textAlign: 'center',
  },
  ctaInner: {
    maxWidth: '720px',
    margin: '0 auto',
  },
  footer: {
    borderTop: '1px solid var(--slate-200)',
    backgroundColor: '#ffffff',
    padding: '24px',
  },
  footerInner: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 8px #10b981',
  },
};

export default LandingPage;
