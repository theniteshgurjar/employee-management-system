import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  ShieldCheck,
  ArrowLeft,
  Edit3,
  AlertCircle,
  Award,
  CalendarRange,
} from 'lucide-react';

const EmployeeProfile = () => {
  const { id } = useParams();
  const { hasAnyRole } = useAuth();
  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        let empRes;
        if (id) {
          empRes = await api.get(`/employees/${id}`);
        } else {
          empRes = await api.get('/employees/profile/me');
        }
        const emp = empRes.data.data;
        setProfile(emp);

        if (emp?.id) {
          const balRes = await api.get(`/leaves/balance/${emp.id}`);
          setBalance(balRes.data.data);
        }
      } catch (err) {
        setError('Failed to load employee profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--slate-500)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--slate-200)', borderTopColor: 'var(--primary-600)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontWeight: '500' }}>Loading executive profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '40px auto' }}>
        <AlertCircle size={20} />
        <div>
          <strong style={{ display: 'block', marginBottom: '2px' }}>Profile Error</strong>
          <span>{error || 'Employee profile not found in enterprise directory.'}</span>
        </div>
      </div>
    );
  }

  const initials = `${profile.firstName?.charAt(0) || ''}${profile.lastName?.charAt(0) || ''}`.toUpperCase();

  // Calculate tenure
  const calculateTenure = (joiningDateStr) => {
    if (!joiningDateStr) return 'New Member';
    const start = new Date(joiningDateStr);
    const now = new Date();
    const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (diffMonths < 1) return 'Just joined';
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    const years = (diffMonths / 12).toFixed(1);
    return `${years} yrs`;
  };

  return (
    <div>
      {/* Top Breadcrumb & Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {id ? (
            <Link to="/employees" className="btn btn-secondary" style={{ padding: '8px 12px' }} title="Back to Directory">
              <ArrowLeft size={16} />
              <span>Directory</span>
            </Link>
          ) : (
            <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '8px 12px' }}>
              <ArrowLeft size={16} />
              <span>Dashboard</span>
            </Link>
          )}
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-400)' }}>/</span>
          <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--slate-600)' }}>
            {profile.firstName} {profile.lastName}
          </span>
        </div>

        {hasAnyRole(['ADMIN', 'HR']) && (
          <Link
            to={`/employees/edit/${profile.id}`}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', gap: '8px', border: '1px solid var(--slate-300)' }}
          >
            <Edit3 size={16} color="var(--primary-600)" />
            <span>Edit Profile Details</span>
          </Link>
        )}
      </div>

      {/* Clean Profile Header Card */}
      <div className="ems-card" style={{ marginBottom: '20px', padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '8px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {initials}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                  {profile.firstName} {profile.lastName}
                </h1>
                <span className={`badge ${profile.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                  {profile.status}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  {profile.employeeCode}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', flexWrap: 'wrap', fontSize: '0.85rem', color: '#64748b' }}>
                <strong style={{ color: '#0f172a' }}>{profile.designation}</strong>
                <span>&bull;</span>
                <span>{profile.departmentName || 'General Staff'}</span>
                <span>&bull;</span>
                <span>Joined {profile.joiningDate} ({calculateTenure(profile.joiningDate)})</span>
              </div>
            </div>
          </div>

          <Link to="/leaves/apply" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <CalendarRange size={15} />
            <span>Request Time Off</span>
          </Link>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid-responsive-2" style={{ marginBottom: '20px' }}>
        {/* Personal & Contact Information Card */}
        <div className="ems-card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--slate-100)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} color="var(--primary-600)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--slate-900)', margin: 0 }}>
                Personal & Contact Details
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>Verified employee identity records</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={styles.recordRow}>
              <div style={styles.recordLabel}>
                <Mail size={16} color="var(--slate-400)" />
                <span>Corporate Email</span>
              </div>
              <a href={`mailto:${profile.email}`} style={{ ...styles.recordValue, color: 'var(--primary-600)', textDecoration: 'none' }}>
                {profile.email}
              </a>
            </div>

            <div style={styles.recordRow}>
              <div style={styles.recordLabel}>
                <Phone size={16} color="var(--slate-400)" />
                <span>Direct Phone</span>
              </div>
              <span style={styles.recordValue}>{profile.phone || 'Not registered'}</span>
            </div>

            <div style={styles.recordRow}>
              <div style={styles.recordLabel}>
                <MapPin size={16} color="var(--slate-400)" />
                <span>Residential Address</span>
              </div>
              <span style={{ ...styles.recordValue, textAlign: 'right', maxWidth: '240px' }}>
                {profile.address || 'Not registered'}
              </span>
            </div>

            <div style={styles.recordRow}>
              <div style={styles.recordLabel}>
                <Calendar size={16} color="var(--slate-400)" />
                <span>Date of Birth</span>
              </div>
              <span style={styles.recordValue}>{profile.dateOfBirth || 'Confidential'}</span>
            </div>

            <div style={styles.recordRow}>
              <div style={styles.recordLabel}>
                <Briefcase size={16} color="var(--slate-400)" />
                <span>Appointment Date</span>
              </div>
              <span style={styles.recordValue}>{profile.joiningDate}</span>
            </div>
          </div>
        </div>

        {/* Corporate Hierarchy & Security Privileges */}
        <div className="ems-card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--slate-100)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--accent-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={18} color="var(--accent-600)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--slate-900)', margin: 0 }}>
                Organizational Hierarchy
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>Department, reporting line & security</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={styles.recordRow}>
              <div style={styles.recordLabel}>
                <Building2 size={16} color="var(--slate-400)" />
                <span>Department Unit</span>
              </div>
              <span style={styles.recordValue}>
                {profile.departmentName} ({profile.departmentCode || 'N/A'})
              </span>
            </div>

            <div style={styles.recordRow}>
              <div style={styles.recordLabel}>
                <User size={16} color="var(--slate-400)" />
                <span>Reporting Manager</span>
              </div>
              <span style={{ ...styles.recordValue, fontWeight: '600' }}>
                {profile.managerName ? profile.managerName : 'Executive Department Lead'}
              </span>
            </div>

            <div style={styles.recordRow}>
              <div style={styles.recordLabel}>
                <ShieldCheck size={16} color="var(--slate-400)" />
                <span>System SSO Account</span>
              </div>
              <span style={{ ...styles.recordValue, fontFamily: 'monospace', fontSize: '0.82rem', background: 'var(--slate-100)', padding: '2px 8px', borderRadius: '4px' }}>
                {profile.username || 'Unassigned'}
              </span>
            </div>

            <div style={styles.recordRow}>
              <div style={styles.recordLabel}>
                <Award size={16} color="var(--slate-400)" />
                <span>Security Roles</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {profile.roles?.map((r) => (
                  <span
                    key={r}
                    className="badge badge-primary"
                    style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                  >
                    {r.replace('ROLE_', '')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Quota Balance Overview */}
      {balance && (
        <div className="ems-card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--slate-900)' }}>
                Annual Leave Balances — FY {balance.year}
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                Allocated paid time-off days and active remaining quotas
              </p>
            </div>
            <Link to="/leaves/balance" className="btn btn-sm btn-secondary">
              View Detailed Ledger
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
            {/* Casual Leave */}
            <div style={{ ...styles.quotaCard, borderLeft: '4px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={styles.quotaTitle}>Casual Leave</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>CL</span>
              </div>
              <div style={styles.quotaNumber}>
                {balance.casualLeaveBalance} <span style={styles.quotaUnit}>days left</span>
              </div>
              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${Math.min(100, (balance.casualLeaveBalance / 12) * 100)}%`,
                    backgroundColor: '#3b82f6',
                  }}
                />
              </div>
              <div style={styles.quotaSub}>Out of 12 standard annual days</div>
            </div>

            {/* Sick Leave */}
            <div style={{ ...styles.quotaCard, borderLeft: '4px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={styles.quotaTitle}>Sick Leave</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>SL</span>
              </div>
              <div style={styles.quotaNumber}>
                {balance.sickLeaveBalance} <span style={styles.quotaUnit}>days left</span>
              </div>
              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${Math.min(100, (balance.sickLeaveBalance / 10) * 100)}%`,
                    backgroundColor: '#10b981',
                  }}
                />
              </div>
              <div style={styles.quotaSub}>Out of 10 annual medical days</div>
            </div>

            {/* Earned Leave */}
            <div style={{ ...styles.quotaCard, borderLeft: '4px solid #8b5cf6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={styles.quotaTitle}>Earned Leave</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>EL</span>
              </div>
              <div style={styles.quotaNumber}>
                {balance.earnedLeaveBalance} <span style={styles.quotaUnit}>days left</span>
              </div>
              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${Math.min(100, (balance.earnedLeaveBalance / 15) * 100)}%`,
                    backgroundColor: '#8b5cf6',
                  }}
                />
              </div>
              <div style={styles.quotaSub}>Accrued privilege vacation</div>
            </div>

            {/* Unpaid Leave Used */}
            <div style={{ ...styles.quotaCard, borderLeft: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={styles.quotaTitle}>Unpaid Leave Taken</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>LWP</span>
              </div>
              <div style={{ ...styles.quotaNumber, color: 'var(--warning-700)' }}>
                {balance.unpaidLeaveUsed} <span style={styles.quotaUnit}>days taken</span>
              </div>
              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${Math.min(100, (balance.unpaidLeaveUsed / 5) * 100)}%`,
                    backgroundColor: '#f59e0b',
                  }}
                />
              </div>
              <div style={styles.quotaSub}>Loss of pay duration</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  recordRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid var(--slate-100)',
    fontSize: '0.88rem',
  },
  recordLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--slate-500)',
    fontWeight: '500',
  },
  recordValue: {
    fontWeight: '600',
    color: 'var(--slate-800)',
  },
  quotaCard: {
    padding: '16px 18px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    border: '1px solid var(--slate-200)',
  },
  quotaTitle: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--slate-600)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  quotaNumber: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'var(--slate-900)',
    marginTop: '6px',
    letterSpacing: '-0.02em',
  },
  quotaUnit: {
    fontSize: '0.8rem',
    fontWeight: '500',
    color: 'var(--slate-500)',
  },
  progressTrack: {
    height: '6px',
    borderRadius: '999px',
    backgroundColor: 'var(--slate-200)',
    overflow: 'hidden',
    marginTop: '10px',
  },
  progressBar: {
    height: '100%',
    borderRadius: '999px',
    transition: 'width 0.4s ease',
  },
  quotaSub: {
    fontSize: '0.72rem',
    color: 'var(--slate-400)',
    marginTop: '6px',
  },
};

export default EmployeeProfile;
