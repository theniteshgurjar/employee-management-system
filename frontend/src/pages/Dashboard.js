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
  Calendar,
  CheckSquare,
  Award,
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
          api.get('/dashboard/stats').catch(() => ({ data: { data: null } })),
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

  const isAdminOrHr = hasAnyRole(['ADMIN', 'HR']);
  const isManager = hasAnyRole(['MANAGER']) && !isAdminOrHr;
  const isEmployeeOnly = !hasAnyRole(['ADMIN', 'HR', 'MANAGER']);

  // Build Role-Specific Stat Cards
  let statCards = [];

  if (isAdminOrHr) {
    // Enterprise & People Operations Cards (Admin & HR)
    statCards = [
      {
        title: 'Total Workforce',
        value: stats?.totalEmployees ?? '0',
        sub: 'Active organizational roster',
        icon: Users,
        gradient: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
        badge: 'Enterprise',
      },
      {
        title: 'Active Departments',
        value: stats?.totalDepartments ?? '0',
        sub: 'Operational business units',
        icon: Building2,
        gradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
        badge: 'Divisions',
      },
      {
        title: 'Present Today',
        value: stats?.presentToday ?? '0',
        sub: 'Clocked in today',
        icon: UserCheck,
        gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        badge: 'Active duty',
      },
      {
        title: 'Absent / Out of Office',
        value: stats?.absentToday ?? '0',
        sub: 'Unclocked or on leave',
        icon: UserX,
        gradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
        badge: 'Absence log',
      },
      {
        title: 'Pending Leaves',
        value: stats?.pendingLeaves ?? '0',
        sub: 'Requires review decision',
        icon: Clock,
        gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
        badge: 'Queue',
      },
      {
        title: 'Approved Leaves',
        value: stats?.approvedLeaves ?? '0',
        sub: 'Authorized time off',
        icon: CheckCircle2,
        gradient: 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)',
        badge: 'Approved',
      },
    ];
  } else if (isManager) {
    // Team Supervision Cards (Manager)
    statCards = [
      {
        title: 'Present Today',
        value: stats?.presentToday ?? '0',
        sub: 'Staff clocked in today',
        icon: UserCheck,
        gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        badge: 'On duty',
      },
      {
        title: 'Absent / Off Today',
        value: stats?.absentToday ?? '0',
        sub: 'Unclocked or on leave',
        icon: UserX,
        gradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
        badge: 'Out of office',
      },
      {
        title: 'Pending Approvals',
        value: stats?.pendingLeaves ?? '0',
        sub: 'Team requests awaiting you',
        icon: Clock,
        gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
        badge: 'Action needed',
      },
      {
        title: 'Approved Leaves',
        value: stats?.approvedLeaves ?? '0',
        sub: 'Authorized time-off',
        icon: CheckCircle2,
        gradient: 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)',
        badge: 'Approved',
      },
      {
        title: 'My Casual Balance',
        value: `${balance?.casualLeaveBalance ?? 0} days`,
        sub: 'Personal allocation remaining',
        icon: Calendar,
        gradient: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
        badge: 'Available',
      },
      {
        title: 'My Earned Balance',
        value: `${balance?.earnedLeaveBalance ?? 0} days`,
        sub: 'Accrued vacation balance',
        icon: Sparkles,
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
        badge: 'Accrued',
      },
    ];
  } else {
    // Self-Service Employee Cards (Employee)
    statCards = [
      {
        title: 'Casual Leave Balance',
        value: `${balance?.casualLeaveBalance ?? 0} days`,
        sub: 'Annual casual quota remaining',
        icon: Calendar,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        badge: 'Available',
      },
      {
        title: 'Sick Leave Balance',
        value: `${balance?.sickLeaveBalance ?? 0} days`,
        sub: 'Medical recovery allowance',
        icon: Activity,
        gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        badge: 'Medical',
      },
      {
        title: 'Earned Leave Balance',
        value: `${balance?.earnedLeaveBalance ?? 0} days`,
        sub: 'Accrued paid vacation days',
        icon: Sparkles,
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
        badge: 'Vacation',
      },
      {
        title: 'Unpaid Leave Taken',
        value: `${balance?.unpaidLeaveUsed ?? 0} days`,
        sub: 'Loss of pay duration taken',
        icon: Clock,
        gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
        badge: 'LWP',
      },
      {
        title: "Today's Status",
        value: !todayAttendance
          ? 'Not Clocked'
          : !todayAttendance.checkOutTime
          ? 'Active Shift'
          : 'Completed',
        sub: todayAttendance?.checkInTime ? `Clocked in at ${todayAttendance.checkInTime}` : 'Punch in to start shift',
        icon: UserCheck,
        gradient: !todayAttendance
          ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
          : !todayAttendance.checkOutTime
          ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
          : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        badge: 'Attendance',
      },
      {
        title: 'Hours Worked Today',
        value: todayAttendance?.workingHours != null
          ? `${todayAttendance.workingHours} hrs`
          : todayAttendance?.checkInTime
          ? 'In Progress'
          : '0.0 hrs',
        sub: 'Target: 8.0 hours standard shift',
        icon: Award,
        gradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
        badge: 'Shift hours',
      },
    ];
  }

  // Primary Role Display Label
  const roleDisplay = user?.roles?.[0]?.replace('ROLE_', '') || 'EMPLOYEE';

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div style={styles.heroBanner}>
        <div style={styles.heroLeft}>
          <div style={styles.roleChip}>
            <Sparkles size={13} color="var(--accent-600)" />
            <span>
              {isAdminOrHr ? 'Executive Workspace' : isManager ? 'Management Workspace' : 'Employee Self-Service'} &bull; {roleDisplay}
            </span>
          </div>
          <h1 style={styles.heroTitle}>
            {getGreeting()}, {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}!
          </h1>
          <p style={styles.heroSubtitle}>
            {isAdminOrHr
              ? 'Here is your enterprise workforce overview and daily organizational metrics.'
              : isManager
              ? 'Monitor your team presence and review pending leave applications.'
              : 'Track your personal leave balances, working hours, and timecard status.'}
          </p>
        </div>

        {/* Hero Role-Specific Actions */}
        <div style={styles.heroActions}>
          {isEmployeeOnly && (
            <Link to="/attendance" className="btn btn-secondary">
              <Clock size={16} />
              <span>Punch Timecard</span>
            </Link>
          )}

          <Link to="/leaves/apply" className="btn btn-primary" style={{ boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)' }}>
            <CalendarPlus size={16} />
            <span>Apply for Leave</span>
          </Link>

          {isManager && (
            <Link to="/leaves/approval" className="btn btn-secondary">
              <CheckSquare size={16} />
              <span>Review Requests</span>
            </Link>
          )}

          {isAdminOrHr && (
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

      {/* Role-Tailored KPI Stats Grid */}
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

      {/* Middle Section: Live Workday Card + Role-Specific Shortcuts */}
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
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: !todayAttendance ? '#94a3b8' : !todayAttendance.checkOutTime ? '#10b981' : '#3b82f6',
                  boxShadow: !todayAttendance ? 'none' : '0 0 10px rgba(16, 185, 129, 0.7)',
                }}
              />
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
                  {todayAttendance?.workingHours != null ? `${todayAttendance.workingHours} hrs` : (todayAttendance?.checkInTime ? 'In Progress' : '0.0 hrs')}
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
                    : todayAttendance?.checkInTime ? 'In Progress' : '0%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--slate-100)', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    backgroundColor: 'var(--primary-600)',
                    width: todayAttendance?.workingHours
                      ? `${Math.min(100, (todayAttendance.workingHours / 8) * 100)}%`
                      : todayAttendance?.checkInTime ? '35%' : '0%',
                    transition: 'width 0.4s ease',
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

        {/* Role-Specific Quick Navigation Shortcuts */}
        <div className="ems-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Activity size={18} color="var(--primary-600)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--slate-900)' }}>
              Quick Navigation Shortcuts
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Standard Employee Shortcuts */}
            <Link to="/attendance" className="ems-card ems-card-hover" style={styles.shortcutRow}>
              <div>
                <div style={styles.shortcutName}>Attendance & Timecard</div>
                <div style={styles.shortcutDesc}>Punch in/out, view working duration and daily status</div>
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

            <Link to="/leaves/history" className="ems-card ems-card-hover" style={styles.shortcutRow}>
              <div>
                <div style={styles.shortcutName}>My Leave Applications History</div>
                <div style={styles.shortcutDesc}>Track status outcomes, cancel requests, and decision trails</div>
              </div>
              <ChevronRight size={18} color="var(--slate-400)" />
            </Link>

            {/* Manager Shortcuts */}
            {hasAnyRole(['ADMIN', 'HR', 'MANAGER']) && (
              <Link to="/leaves/approval" className="ems-card ems-card-hover" style={styles.shortcutRow}>
                <div>
                  <div style={styles.shortcutName}>Leave Approval Queue</div>
                  <div style={styles.shortcutDesc}>Review and approve pending team requests</div>
                </div>
                <ChevronRight size={18} color="var(--slate-400)" />
              </Link>
            )}

            {/* HR & Admin Shortcuts */}
            {hasAnyRole(['ADMIN', 'HR']) && (
              <Link to="/departments" className="ems-card ems-card-hover" style={styles.shortcutRow}>
                <div>
                  <div style={styles.shortcutName}>Department Management</div>
                  <div style={styles.shortcutDesc}>Configure organizational divisions and headcount</div>
                </div>
                <ChevronRight size={18} color="var(--slate-400)" />
              </Link>
            )}

            {/* Admin Only Shortcut */}
            {hasAnyRole(['ADMIN']) && (
              <Link to="/users" className="ems-card ems-card-hover" style={styles.shortcutRow}>
                <div>
                  <div style={styles.shortcutName}>User & Role Provisioning</div>
                  <div style={styles.shortcutDesc}>Provision system accounts and assign security privileges</div>
                </div>
                <ChevronRight size={18} color="var(--slate-400)" />
              </Link>
            )}

            {/* Employee Self-Service Profile Shortcut */}
            {isEmployeeOnly && (
              <Link to="/profile" className="ems-card ems-card-hover" style={styles.shortcutRow}>
                <div>
                  <div style={styles.shortcutName}>My Employee Profile</div>
                  <div style={styles.shortcutDesc}>View personal records, designation & direct manager info</div>
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
    letterSpacing: '-0.02em',
    marginBottom: '6px',
  },
  heroSubtitle: {
    fontSize: '0.9rem',
    color: 'var(--slate-500)',
    lineHeight: 1.5,
  },
  heroActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '26px',
  },
  statCard: {
    marginBottom: 0,
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '140px',
  },
  statTitle: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: 'var(--slate-500)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: 'var(--slate-900)',
    marginTop: '6px',
    letterSpacing: '-0.02em',
  },
  iconBadge: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12)',
    flexShrink: 0,
  },
  statFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '14px',
    paddingTop: '10px',
    borderTop: '1px solid var(--slate-100)',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '24px',
  },
  punchDetailsBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--slate-200)',
    padding: '18px 20px',
  },
  punchStatusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'var(--slate-800)',
    marginBottom: '16px',
  },
  punchRowGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    padding: '12px 0',
    borderTop: '1px solid var(--slate-200)',
    borderBottom: '1px solid var(--slate-200)',
  },
  punchMetric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: '0.72rem',
    fontWeight: '600',
    color: 'var(--slate-400)',
    textTransform: 'uppercase',
  },
  metricVal: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--slate-800)',
    marginTop: '2px',
  },
  miniQuota: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--slate-200)',
    borderRadius: '999px',
    padding: '4px 12px',
    fontSize: '0.78rem',
    color: 'var(--slate-600)',
  },
  shortcutRow: {
    margin: 0,
    padding: '14px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textDecoration: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  },
  shortcutName: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--slate-800)',
  },
  shortcutDesc: {
    fontSize: '0.78rem',
    color: 'var(--slate-500)',
    marginTop: '2px',
  },
};

export default Dashboard;
