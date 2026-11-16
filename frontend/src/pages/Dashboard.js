import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Users,
  Building2,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  CalendarPlus,
  ShieldAlert,
  Sparkles,
  Activity,
  ChevronRight,
} from 'lucide-react';

const Dashboard = () => {
  const { user, hasAnyRole } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, attRes, balRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/attendance/today').catch(() => ({ data: { data: null } })),
          api.get('/leaves/my-balance').catch(() => ({ data: { data: null } })),
        ]);
        setStats(statsRes.data.data);
        setTodayAttendance(attRes.data.data);
        setBalance(balRes.data.data);
      } catch (err) {
        setError('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    {
      title: 'Total Workforce',
      value: stats?.totalEmployees ?? '0',
      sub: 'Active organizational roster',
      icon: Users,
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
      accentColor: '#4f46e5',
      badge: '+100% active',
    },
    {
      title: 'Active Departments',
      value: stats?.totalDepartments ?? '0',
      sub: 'Configured business units',
      icon: Building2,
      gradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
      accentColor: '#0284c7',
      badge: 'Full operational',
    },
    {
      title: 'Present Today',
      value: stats?.presentToday ?? '0',
      sub: 'Clocked in today',
      icon: UserCheck,
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      accentColor: '#059669',
      badge: 'Live logs',
    },
    {
      title: 'Absent / Out of Office',
      value: stats?.absentToday ?? '0',
      sub: 'Unclocked or on leave',
      icon: UserX,
      gradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
      accentColor: '#e11d48',
      badge: 'Daily tracking',
    },
    {
      title: 'Pending Leaves',
      value: stats?.pendingLeaves ?? '0',
      sub: 'Awaiting manager decision',
      icon: Clock,
      gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
      accentColor: '#d97706',
      badge: 'Action required',
    },
    {
      title: 'Approved Leaves',
      value: stats?.approvedLeaves ?? '0',
      sub: 'Authorized time-off',
      icon: CheckCircle2,
      gradient: 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)',
      accentColor: '#2563eb',
      badge: 'Synchronized',
    },
  ];

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div style={styles.heroBanner}>
        <div style={styles.heroLeft}>
          <div style={styles.roleChip}>
            <Sparkles size={13} color="var(--accent-600)" />
            <span>Enterprise Workspace &bull; {user?.roles?.[0]?.replace('ROLE_', '') || 'EMPLOYEE'}</span>
          </div>
          <h1 style={styles.heroTitle}>
            {getGreeting()}, {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}!
          </h1>
          <p style={styles.heroSubtitle}>
            Here is your live organizational pulse and workforce activity snapshot for today.
          </p>
        </div>

        <div style={styles.heroActions}>
          <Link to="/leaves/apply" className="btn btn-primary" style={{ boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)' }}>
            <CalendarPlus size={16} />
            <span>Apply for Leave</span>
          </Link>
          {hasAnyRole(['ADMIN', 'HR']) && (
            <Link to="/employees/new" className="btn btn-secondary">
              <Users size={16} />
              <span>Onboard Staff</span>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div style={styles.statsGrid}>
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="ems-card ems-card-hover" style={styles.statCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={styles.statTitle}>{card.title}</span>
                  <div style={styles.statValue}>{loading ? '...' : card.value}</div>
                </div>
                <div style={{ ...styles.iconBadge, background: card.gradient }}>
                  <Icon size={22} color="#ffffff" />
                </div>
              </div>
              <div style={styles.statFooter}>
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>{card.sub}</span>
                <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                  {card.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Live Workday Card + Quick Access Shortcuts */}
      <div style={styles.twoColumnGrid}>
        {/* Today's Punch Clock Card */}
        <div className="ems-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--primary-600)" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--slate-900)' }}>
                Today's Workday Tracker
              </h2>
            </div>
            <Link to="/attendance" style={{ fontSize: '0.825rem', color: 'var(--primary-600)', textDecoration: 'none', fontWeight: '600' }}>
              View Full Log &rarr;
            </Link>
          </div>

          <div style={styles.punchDetailsBox}>
            <div style={styles.punchStatusIndicator}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: !todayAttendance ? '#94a3b8' : !todayAttendance.checkOutTime ? '#10b981' : '#3b82f6',
                boxShadow: !todayAttendance ? 'none' : '0 0 10px rgba(16, 185, 129, 0.7)'
              }} />
              <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                {!todayAttendance
                  ? 'Not Clocked In Yet'
                  : !todayAttendance.checkOutTime
                  ? 'Currently Active (On the Clock)'
                  : 'Workday Completed'}
              </span>
            </div>

            <div style={styles.punchRowGrid}>
              <div style={styles.punchMetric}>
                <span style={styles.metricLabel}>Clock In</span>
                <strong style={styles.metricVal}>{todayAttendance?.checkInTime || '—:—'}</strong>
              </div>
              <div style={styles.punchMetric}>
                <span style={styles.metricLabel}>Clock Out</span>
                <strong style={styles.metricVal}>{todayAttendance?.checkOutTime || '—:—'}</strong>
              </div>
              <div style={styles.punchMetric}>
                <span style={styles.metricLabel}>Duration</span>
                <strong style={{ ...styles.metricVal, color: 'var(--primary-600)' }}>
                  {todayAttendance?.workingHours != null ? `${todayAttendance.workingHours} hrs` : 'In Progress'}
                </strong>
              </div>
            </div>

            {/* Shift Progress Bar (Target 8 hours) */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '6px' }}>
                <span>Daily 8-Hour Target Progress</span>
                <span>
                  {todayAttendance?.workingHours
                    ? `${Math.min(100, Math.round((todayAttendance.workingHours / 8) * 100))}%`
                    : todayAttendance ? 'In Progress' : '0%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--slate-100)', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    backgroundColor: 'var(--primary-600)',
                    width: todayAttendance?.workingHours
                      ? `${Math.min(100, (todayAttendance.workingHours / 8) * 100)}%`
                      : todayAttendance ? '30%' : '0%',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick Leave Quotas Mini Pill */}
          {balance && (
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div style={styles.miniQuota}>
                <span>Casual:</span> <strong>{balance.casualLeaveBalance}d left</strong>
              </div>
              <div style={styles.miniQuota}>
                <span>Sick:</span> <strong>{balance.sickLeaveBalance}d left</strong>
              </div>
              <div style={styles.miniQuota}>
                <span>Earned:</span> <strong>{balance.earnedLeaveBalance}d left</strong>
              </div>
            </div>
          )}
        </div>

        {/* Quick Operations Shortcuts */}
        <div className="ems-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Activity size={18} color="var(--primary-600)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--slate-900)' }}>
              Quick Navigation Shortcuts
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/attendance" className="ems-card ems-card-hover" style={styles.shortcutRow}>
              <div>
                <div style={styles.shortcutName}>Attendance & Timecard</div>
                <div style={styles.shortcutDesc}>Punch in/out, view working history and weekly logs</div>
              </div>
              <ChevronRight size={18} color="var(--slate-400)" />
            </Link>

            <Link to="/leaves/balance" className="ems-card ems-card-hover" style={styles.shortcutRow}>
              <div>
                <div style={styles.shortcutName}>Leave Balances & Quotas</div>
                <div style={styles.shortcutDesc}>Inspect Casual, Sick, and Earned leave balances</div>
              </div>
              <ChevronRight size={18} color="var(--slate-400)" />
            </Link>

            {hasAnyRole(['ADMIN', 'HR', 'MANAGER']) && (
              <Link to="/leaves/approval" className="ems-card ems-card-hover" style={styles.shortcutRow}>
                <div>
                  <div style={styles.shortcutName}>Leave Approval Queue</div>
                  <div style={styles.shortcutDesc}>Review and approve pending team requests</div>
                </div>
                <ChevronRight size={18} color="var(--slate-400)" />
              </Link>
            )}

            {hasAnyRole(['ADMIN', 'HR']) && (
              <Link to="/departments" className="ems-card ems-card-hover" style={styles.shortcutRow}>
                <div>
                  <div style={styles.shortcutName}>Department Management</div>
                  <div style={styles.shortcutDesc}>Configure departments, organizational codes & headcount</div>
                </div>
                <ChevronRight size={18} color="var(--slate-400)" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  heroBanner: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--slate-200)',
    padding: '28px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '26px',
    boxShadow: 'var(--shadow-card)',
    flexWrap: 'wrap',
    gap: '20px',
  },
  heroLeft: {
    maxWidth: '650px',
  },
  roleChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'var(--accent-50)',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    borderRadius: '9999px',
    padding: '4px 12px',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--accent-700)',
    marginBottom: '10px',
  },
  heroTitle: {
    fontSize: '1.65rem',
    fontWeight: '800',
    color: 'var(--slate-900)',
    letterSpacing: '-0.025em',
  },
  heroSubtitle: {
    fontSize: '0.9rem',
    color: 'var(--slate-500)',
    marginTop: '6px',
    lineHeight: 1.5,
  },
  heroActions: {
    display: 'flex',
    gap: '12px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '20px',
    marginBottom: '26px',
  },
  statCard: {
    padding: '22px 24px',
    marginBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  statTitle: {
    fontSize: '0.78rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--slate-500)',
  },
  statValue: {
    fontSize: '1.9rem',
    fontWeight: '800',
    color: 'var(--slate-900)',
    marginTop: '6px',
    letterSpacing: '-0.03em',
  },
  iconBadge: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
  },
  statFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid var(--slate-100)',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '24px',
  },
  punchDetailsBox: {
    padding: '18px 20px',
    backgroundColor: 'var(--slate-50)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--slate-200)',
  },
  punchStatusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  punchRowGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    paddingBottom: '14px',
    borderBottom: '1px solid var(--slate-200)',
  },
  punchMetric: {
    display: 'flex',
    flexDirection: 'column',
  },
  metricLabel: {
    fontSize: '0.72rem',
    color: 'var(--slate-500)',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  metricVal: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'var(--slate-800)',
    marginTop: '2px',
  },
  miniQuota: {
    padding: '6px 12px',
    backgroundColor: 'var(--slate-50)',
    border: '1px solid var(--slate-200)',
    borderRadius: '8px',
    fontSize: '0.8rem',
    color: 'var(--slate-600)',
  },
  shortcutRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
    marginBottom: 0,
    textDecoration: 'none',
    cursor: 'pointer',
  },
  shortcutName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--slate-800)',
  },
  shortcutDesc: {
    fontSize: '0.78rem',
    color: 'var(--slate-500)',
    marginTop: '2px',
  },
};

export default Dashboard;
