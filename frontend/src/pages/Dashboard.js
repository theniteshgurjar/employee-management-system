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

  // Role-Specific Stat Cards (Clean, calm monochromatic design)
  let statCards = [];

  if (isAdminOrHr) {
    statCards = [
      {
        title: 'Total Workforce',
        value: stats?.totalEmployees ?? '0',
        sub: 'Active employee records',
        icon: Users,
        iconColor: '#2563eb',
        iconBg: '#eff6ff',
      },
      {
        title: 'Active Departments',
        value: stats?.totalDepartments ?? '0',
        sub: 'Operational divisions',
        icon: Building2,
        iconColor: '#4f46e5',
        iconBg: '#eef2ff',
      },
      {
        title: 'Present Today',
        value: stats?.presentToday ?? '0',
        sub: 'Staff clocked in today',
        icon: UserCheck,
        iconColor: '#059669',
        iconBg: '#ecfdf5',
      },
      {
        title: 'Absent Today',
        value: stats?.absentToday ?? '0',
        sub: 'Unclocked or on leave',
        icon: UserX,
        iconColor: '#dc2626',
        iconBg: '#fef2f2',
      },
      {
        title: 'Pending Leaves',
        value: stats?.pendingLeaves ?? '0',
        sub: 'Requires review decision',
        icon: Clock,
        iconColor: '#d97706',
        iconBg: '#fffbeb',
      },
      {
        title: 'Approved Leaves',
        value: stats?.approvedLeaves ?? '0',
        sub: 'Authorized time off',
        icon: CheckCircle2,
        iconColor: '#0284c7',
        iconBg: '#f0f9ff',
      },
    ];
  } else if (isManager) {
    statCards = [
      {
        title: 'Present Today',
        value: stats?.presentToday ?? '0',
        sub: 'Team members on shift',
        icon: UserCheck,
        iconColor: '#059669',
        iconBg: '#ecfdf5',
      },
      {
        title: 'Absent / Off Today',
        value: stats?.absentToday ?? '0',
        sub: 'Out of office',
        icon: UserX,
        iconColor: '#dc2626',
        iconBg: '#fef2f2',
      },
      {
        title: 'Pending Approvals',
        value: stats?.pendingLeaves ?? '0',
        sub: 'Team requests awaiting you',
        icon: Clock,
        iconColor: '#d97706',
        iconBg: '#fffbeb',
      },
      {
        title: 'Approved Leaves',
        value: stats?.approvedLeaves ?? '0',
        sub: 'Approved time-off',
        icon: CheckCircle2,
        iconColor: '#2563eb',
        iconBg: '#eff6ff',
      },
      {
        title: 'My Casual Balance',
        value: `${balance?.casualLeaveBalance ?? 0}d`,
        sub: 'Remaining casual quota',
        icon: Calendar,
        iconColor: '#4f46e5',
        iconBg: '#eef2ff',
      },
      {
        title: 'My Earned Balance',
        value: `${balance?.earnedLeaveBalance ?? 0}d`,
        sub: 'Accrued vacation balance',
        icon: Award,
        iconColor: '#7c3aed',
        iconBg: '#f5f3ff',
      },
    ];
  } else {
    // Pure Self-Service Employee View
    statCards = [
      {
        title: 'Casual Leave Balance',
        value: `${balance?.casualLeaveBalance ?? 0} days`,
        sub: 'Available for personal use',
        icon: Calendar,
        iconColor: '#2563eb',
        iconBg: '#eff6ff',
      },
      {
        title: 'Sick Leave Balance',
        value: `${balance?.sickLeaveBalance ?? 0} days`,
        sub: 'Medical recovery allowance',
        icon: Activity,
        iconColor: '#059669',
        iconBg: '#ecfdf5',
      },
      {
        title: 'Earned Leave Balance',
        value: `${balance?.earnedLeaveBalance ?? 0} days`,
        sub: 'Accrued vacation balance',
        icon: Award,
        iconColor: '#7c3aed',
        iconBg: '#f5f3ff',
      },
      {
        title: 'Unpaid Leave Used',
        value: `${balance?.unpaidLeaveUsed ?? 0} days`,
        sub: 'Loss of pay taken',
        icon: Clock,
        iconColor: '#d97706',
        iconBg: '#fffbeb',
      },
      {
        title: "Today's Status",
        value: !todayAttendance
          ? 'Not Clocked'
          : !todayAttendance.checkOutTime
          ? 'On Shift'
          : 'Completed',
        sub: todayAttendance?.checkInTime ? `Started at ${todayAttendance.checkInTime}` : 'Check in to start session',
        icon: UserCheck,
        iconColor: !todayAttendance ? '#64748b' : !todayAttendance.checkOutTime ? '#059669' : '#2563eb',
        iconBg: !todayAttendance ? '#f1f5f9' : !todayAttendance.checkOutTime ? '#ecfdf5' : '#eff6ff',
      },
      {
        title: 'Shift Duration',
        value: todayAttendance?.workingHours != null
          ? `${todayAttendance.workingHours} hrs`
          : todayAttendance?.checkInTime
          ? 'In Progress'
          : '0.0 hrs',
        sub: 'Target: 8.0 hours standard',
        icon: Clock,
        iconColor: '#0284c7',
        iconBg: '#f0f9ff',
      },
    ];
  }

  const roleDisplay = user?.roles?.[0]?.replace('ROLE_', '') || 'EMPLOYEE';

  return (
    <div>
      {/* Clean Hero Header */}
      <div style={styles.heroBanner}>
        <div>
          <div style={styles.roleChip}>
            {roleDisplay} WORKSPACE
          </div>
          <h1 style={styles.heroTitle}>
            {getGreeting()}, {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}
          </h1>
          <p style={styles.heroSubtitle}>
            {isAdminOrHr
              ? 'Organization summary and employee management controls.'
              : isManager
              ? 'Team attendance monitoring and pending leave review queue.'
              : 'Your personal timecard, attendance status, and leave balances.'}
          </p>
        </div>

        {/* Clean Actions */}
        <div style={styles.heroActions}>
          {isEmployeeOnly && (
            <Link to="/attendance" className="btn btn-secondary">
              <Clock size={15} />
              <span>Timecard</span>
            </Link>
          )}

          <Link to="/leaves/apply" className="btn btn-primary">
            <CalendarPlus size={15} />
            <span>Apply for Leave</span>
          </Link>

          {isManager && (
            <Link to="/leaves/approval" className="btn btn-secondary">
              <CheckSquare size={15} />
              <span>Review Requests</span>
            </Link>
          )}

          {isAdminOrHr && (
            <Link to="/employees/new" className="btn btn-secondary">
              <Users size={15} />
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

      {/* Clean Stat Cards */}
      <div style={styles.statsGrid}>
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="ems-card" style={styles.statCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={styles.statTitle}>{card.title}</span>
                  <div style={styles.statValue}>{loading ? '—' : card.value}</div>
                </div>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={19} color={card.iconColor} />
                </div>
              </div>
              <div style={styles.statFooter}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{card.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Timecard + Shortcuts */}
      <div style={styles.twoColumnGrid}>
        {/* Today's Timecard */}
        <div className="ems-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#0f172a" />
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Today's Timecard
              </h2>
            </div>
            <Link to="/attendance" style={{ fontSize: '0.82rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
              Full log &rarr;
            </Link>
          </div>

          <div style={styles.punchBox}>
            <div style={styles.punchStatusRow}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: !todayAttendance ? '#94a3b8' : !todayAttendance.checkOutTime ? '#10b981' : '#3b82f6',
                }}
              />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {!todayAttendance
                  ? 'Not Clocked In Today'
                  : !todayAttendance.checkOutTime
                  ? 'Active (Clocked In)'
                  : 'Shift Completed'}
              </span>
            </div>

            <div style={styles.punchMetricsGrid}>
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
                <strong style={{ ...styles.metricVal, color: '#2563eb' }}>
                  {todayAttendance?.workingHours != null ? `${todayAttendance.workingHours} hrs` : (todayAttendance?.checkInTime ? 'In progress' : '0.0 hrs')}
                </strong>
              </div>
            </div>

            {/* Target 8h Bar */}
            <div style={{ marginTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '5px' }}>
                <span>Daily 8h Target</span>
                <span>
                  {todayAttendance?.workingHours
                    ? `${Math.min(100, Math.round((todayAttendance.workingHours / 8) * 100))}%`
                    : todayAttendance?.checkInTime ? 'In progress' : '0%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    backgroundColor: '#0f172a',
                    width: todayAttendance?.workingHours
                      ? `${Math.min(100, (todayAttendance.workingHours / 8) * 100)}%`
                      : todayAttendance?.checkInTime ? '30%' : '0%',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="ems-card" style={{ marginBottom: 0 }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Quick Navigation
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link to="/attendance" className="ems-card ems-card-hover" style={styles.shortcutItem}>
              <div>
                <div style={styles.shortcutTitle}>Attendance & Punch Clock</div>
                <div style={styles.shortcutDesc}>Record check-in, check-out and view logs</div>
              </div>
              <ChevronRight size={16} color="#94a3b8" />
            </Link>

            <Link to="/leaves/balance" className="ems-card ems-card-hover" style={styles.shortcutItem}>
              <div>
                <div style={styles.shortcutTitle}>Leave Balances</div>
                <div style={styles.shortcutDesc}>Inspect casual, sick, and earned quotas</div>
              </div>
              <ChevronRight size={16} color="#94a3b8" />
            </Link>

            <Link to="/leaves/history" className="ems-card ems-card-hover" style={styles.shortcutItem}>
              <div>
                <div style={styles.shortcutTitle}>Leave History</div>
                <div style={styles.shortcutDesc}>Track status outcomes and cancellation options</div>
              </div>
              <ChevronRight size={16} color="#94a3b8" />
            </Link>

            {hasAnyRole(['ADMIN', 'HR', 'MANAGER']) && (
              <Link to="/leaves/approval" className="ems-card ems-card-hover" style={styles.shortcutItem}>
                <div>
                  <div style={styles.shortcutTitle}>Leave Approvals Queue</div>
                  <div style={styles.shortcutDesc}>Review and approve pending team requests</div>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </Link>
            )}

            {hasAnyRole(['ADMIN', 'HR']) && (
              <Link to="/departments" className="ems-card ems-card-hover" style={styles.shortcutItem}>
                <div>
                  <div style={styles.shortcutTitle}>Departments</div>
                  <div style={styles.shortcutDesc}>Configure business divisions and codes</div>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
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
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    padding: '24px 28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  roleChip: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.06em',
    marginBottom: '6px',
  },
  heroTitle: {
    fontSize: '1.45rem',
    fontWeight: 800,
    color: '#0f172a',
    letterSpacing: '-0.02em',
    marginBottom: '4px',
  },
  heroSubtitle: {
    fontSize: '0.88rem',
    color: '#64748b',
  },
  heroActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '14px',
    marginBottom: '20px',
  },
  statCard: {
    marginBottom: 0,
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  statTitle: {
    fontSize: '0.74rem',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#0f172a',
    marginTop: '4px',
    letterSpacing: '-0.02em',
  },
  statFooter: {
    marginTop: '12px',
    paddingTop: '8px',
    borderTop: '1px solid #f1f5f9',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '20px',
  },
  punchBox: {
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    padding: '16px 18px',
  },
  punchStatusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '14px',
  },
  punchMetricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    padding: '10px 0',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
  },
  punchMetric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: '0.7rem',
    color: '#64748b',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  metricVal: {
    fontSize: '0.92rem',
    fontWeight: 700,
    color: '#0f172a',
    marginTop: '2px',
  },
  shortcutItem: {
    margin: 0,
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textDecoration: 'none',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
  },
  shortcutTitle: {
    fontSize: '0.88rem',
    fontWeight: 600,
    color: '#0f172a',
  },
  shortcutDesc: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
};

export default Dashboard;
