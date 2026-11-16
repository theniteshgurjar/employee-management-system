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
  Clock,
  ArrowLeft,
  Edit2,
  AlertCircle,
} from 'lucide-react';

const EmployeeProfile = () => {
  const { id } = useParams();
  const { user, hasAnyRole } = useAuth();
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
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '32px', textAlign: 'center' }}>Loading employee profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="alert alert-danger">
        <AlertCircle size={18} />
        <span>{error || 'Employee profile not found.'}</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {id && (
            <Link to="/employees" className="btn btn-secondary" style={{ padding: '8px' }}>
              <ArrowLeft size={18} />
            </Link>
          )}
          <div>
            <h1 className="ems-card-title" style={{ fontSize: '1.4rem' }}>
              {profile.firstName} {profile.lastName}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '2px' }}>
              {profile.designation} &bull; Code: <strong>{profile.employeeCode}</strong>
            </p>
          </div>
        </div>

        {hasAnyRole(['ADMIN', 'HR']) && (
          <Link to={`/employees/edit/${profile.id}`} className="btn btn-secondary" style={{ display: 'inline-flex', gap: '6px' }}>
            <Edit2 size={16} />
            <span>Edit Profile</span>
          </Link>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Contact & Personal Details Card */}
        <div className="ems-card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px' }}>Personal & Contact</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
            <div style={styles.detailRow}>
              <Mail size={16} color="var(--gray-400)" />
              <span style={{ color: 'var(--gray-500)' }}>Email:</span>
              <strong style={{ marginLeft: 'auto' }}>{profile.email}</strong>
            </div>

            <div style={styles.detailRow}>
              <Phone size={16} color="var(--gray-400)" />
              <span style={{ color: 'var(--gray-500)' }}>Phone:</span>
              <strong style={{ marginLeft: 'auto' }}>{profile.phone || '—'}</strong>
            </div>

            <div style={styles.detailRow}>
              <MapPin size={16} color="var(--gray-400)" />
              <span style={{ color: 'var(--gray-500)' }}>Address:</span>
              <strong style={{ marginLeft: 'auto', textAlign: 'right' }}>{profile.address || '—'}</strong>
            </div>

            <div style={styles.detailRow}>
              <Calendar size={16} color="var(--gray-400)" />
              <span style={{ color: 'var(--gray-500)' }}>Date of Birth:</span>
              <strong style={{ marginLeft: 'auto' }}>{profile.dateOfBirth || '—'}</strong>
            </div>

            <div style={styles.detailRow}>
              <Briefcase size={16} color="var(--gray-400)" />
              <span style={{ color: 'var(--gray-500)' }}>Joining Date:</span>
              <strong style={{ marginLeft: 'auto' }}>{profile.joiningDate}</strong>
            </div>

            <div style={styles.detailRow}>
              <ShieldCheck size={16} color="var(--gray-400)" />
              <span style={{ color: 'var(--gray-500)' }}>Status:</span>
              <span className={`badge ${profile.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`} style={{ marginLeft: 'auto' }}>
                {profile.status}
              </span>
            </div>
          </div>
        </div>

        {/* Organizational Details Card */}
        <div className="ems-card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px' }}>Department & Hierarchy</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
            <div style={styles.detailRow}>
              <Building2 size={16} color="var(--gray-400)" />
              <span style={{ color: 'var(--gray-500)' }}>Department:</span>
              <strong style={{ marginLeft: 'auto' }}>
                {profile.departmentName} ({profile.departmentCode})
              </strong>
            </div>

            <div style={styles.detailRow}>
              <User size={16} color="var(--gray-400)" />
              <span style={{ color: 'var(--gray-500)' }}>Direct Manager:</span>
              <strong style={{ marginLeft: 'auto' }}>{profile.managerName || 'None (Department Lead)'}</strong>
            </div>

            <div style={styles.detailRow}>
              <ShieldCheck size={16} color="var(--gray-400)" />
              <span style={{ color: 'var(--gray-500)' }}>System Username:</span>
              <strong style={{ marginLeft: 'auto' }}>{profile.username || 'Not Provisioned'}</strong>
            </div>

            <div style={styles.detailRow}>
              <ShieldCheck size={16} color="var(--gray-400)" />
              <span style={{ color: 'var(--gray-500)' }}>Assigned Roles:</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {profile.roles?.map((r) => (
                  <span key={r} className="badge badge-primary">
                    {r.replace('ROLE_', '')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Balance Quotas Summary */}
      {balance && (
        <div className="ems-card" style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px' }}>
            Annual Leave Balances ({balance.year})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div style={styles.balancePill}>
              <span style={styles.balancePillTitle}>Casual Leave</span>
              <span style={styles.balancePillNumber}>{balance.casualLeaveBalance} days</span>
            </div>

            <div style={styles.balancePill}>
              <span style={styles.balancePillTitle}>Sick Leave</span>
              <span style={styles.balancePillNumber}>{balance.sickLeaveBalance} days</span>
            </div>

            <div style={styles.balancePill}>
              <span style={styles.balancePillTitle}>Earned Leave</span>
              <span style={styles.balancePillNumber}>{balance.earnedLeaveBalance} days</span>
            </div>

            <div style={styles.balancePill}>
              <span style={styles.balancePillTitle}>Unpaid Leave Taken</span>
              <span style={{ ...styles.balancePillNumber, color: 'var(--gray-600)' }}>
                {balance.unpaidLeaveUsed} days
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--gray-100)',
  },
  balancePill: {
    padding: '16px',
    borderRadius: '10px',
    backgroundColor: 'var(--gray-50)',
    border: '1px solid var(--gray-200)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  balancePillTitle: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--gray-500)',
    textTransform: 'uppercase',
  },
  balancePillNumber: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'var(--primary-600)',
    marginTop: '4px',
  },
};

export default EmployeeProfile;
