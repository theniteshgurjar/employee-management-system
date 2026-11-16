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
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

const Dashboard = () => {
  const { user, hasAnyRole } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data.data);
      } catch (err) {
        setError('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.totalEmployees ?? '0',
      icon: Users,
      color: '#4f46e5',
      bgColor: '#eef2ff',
    },
    {
      title: 'Active Departments',
      value: stats?.totalDepartments ?? '0',
      icon: Building2,
      color: '#0891b2',
      bgColor: '#ecfeff',
    },
    {
      title: 'Present Today',
      value: stats?.presentToday ?? '0',
      icon: UserCheck,
      color: '#059669',
      bgColor: '#ecfdf5',
    },
    {
      title: 'Absent Today',
      value: stats?.absentToday ?? '0',
      icon: UserX,
      color: '#dc2626',
      bgColor: '#fef2f2',
    },
    {
      title: 'Pending Leaves',
      value: stats?.pendingLeaves ?? '0',
      icon: Clock,
      color: '#d97706',
      bgColor: '#fffbeb',
    },
    {
      title: 'Approved Leaves',
      value: stats?.approvedLeaves ?? '0',
      icon: CheckCircle2,
      color: '#2563eb',
      bgColor: '#eff6ff',
    },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div style={styles.banner}>
        <div>
          <h1 style={styles.bannerTitle}>
            Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}!
          </h1>
          <p style={styles.bannerSubtitle}>
            Role: <strong>{user?.roles?.[0]?.replace('ROLE_', '')}</strong> | System running normally.
          </p>
        </div>
        <div style={styles.bannerActions}>
          <Link to="/leaves/apply" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px' }}>
            <CalendarPlus size={16} />
            <span>Apply for Leave</span>
          </Link>
          {hasAnyRole(['ADMIN', 'HR']) && (
            <Link to="/employees/new" className="btn btn-secondary" style={{ display: 'inline-flex', gap: '8px' }}>
              <Users size={16} />
              <span>Add Employee</span>
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
            <div key={idx} className="ems-card" style={styles.statCard}>
              <div style={styles.statInfo}>
                <span style={styles.statTitle}>{card.title}</span>
                <span style={styles.statValue}>{loading ? '...' : card.value}</span>
              </div>
              <div style={{ ...styles.statIconBadge, backgroundColor: card.bgColor, color: card.color }}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div style={styles.shortcutsSection}>
        <h2 style={styles.sectionTitle}>Quick Shortcuts</h2>
        <div style={styles.shortcutsGrid}>
          <Link to="/attendance" className="ems-card" style={styles.shortcutCard}>
            <div>
              <h3 style={styles.shortcutTitle}>Attendance Portal</h3>
              <p style={styles.shortcutDesc}>Punch your daily in/out time and inspect working hours history.</p>
            </div>
            <ArrowRight size={20} color="var(--primary-600)" />
          </Link>

          <Link to="/leaves/balance" className="ems-card" style={styles.shortcutCard}>
            <div>
              <h3 style={styles.shortcutTitle}>Leave Balance</h3>
              <p style={styles.shortcutDesc}>Review your Casual, Sick, and Earned leave quotas.</p>
            </div>
            <ArrowRight size={20} color="var(--primary-600)" />
          </Link>

          {hasAnyRole(['ADMIN', 'HR', 'MANAGER']) && (
            <Link to="/leaves/approval" className="ems-card" style={styles.shortcutCard}>
              <div>
                <h3 style={styles.shortcutTitle}>Pending Approvals</h3>
                <p style={styles.shortcutDesc}>Review and approve pending team leave applications.</p>
              </div>
              <ArrowRight size={20} color="var(--primary-600)" />
            </Link>
          )}

          {hasAnyRole(['ADMIN', 'HR']) && (
            <Link to="/departments" className="ems-card" style={styles.shortcutCard}>
              <div>
                <h3 style={styles.shortcutTitle}>Department Operations</h3>
                <p style={styles.shortcutDesc}>Manage business divisions and employee headcounts.</p>
              </div>
              <ArrowRight size={20} color="var(--primary-600)" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  banner: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--card-radius)',
    border: '1px solid var(--gray-200)',
    padding: '24px 28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    boxShadow: 'var(--shadow-sm)',
    flexWrap: 'wrap',
    gap: '16px',
  },
  bannerTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'var(--gray-900)',
  },
  bannerSubtitle: {
    fontSize: '0.875rem',
    color: 'var(--gray-600)',
    marginTop: '4px',
  },
  bannerActions: {
    display: 'flex',
    gap: '12px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '28px',
  },
  statCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    marginBottom: 0,
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statTitle: {
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--gray-500)',
    marginBottom: '6px',
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'var(--gray-900)',
  },
  statIconBadge: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutsSection: {
    marginTop: '10px',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--gray-900)',
    marginBottom: '16px',
  },
  shortcutsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '18px',
  },
  shortcutCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textDecoration: 'none',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    cursor: 'pointer',
    marginBottom: 0,
  },
  shortcutTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--gray-900)',
    marginBottom: '4px',
  },
  shortcutDesc: {
    fontSize: '0.825rem',
    color: 'var(--gray-500)',
  },
};

export default Dashboard;
