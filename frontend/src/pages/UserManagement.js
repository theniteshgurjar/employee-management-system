import React, { useState } from 'react';
import api from '../services/api';
import {
  ShieldCheck,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Mail,
  Lock,
  User,
  Shield,
  Eye,
  EyeOff,
  Users,
  Briefcase,
  Check,
} from 'lucide-react';

const ROLE_DEFINITIONS = [
  {
    role: 'ROLE_EMPLOYEE',
    title: 'Employee',
    desc: 'Self-service dashboard, attendance punch-clock, time-off requests, and profile view.',
    icon: Users,
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    role: 'ROLE_MANAGER',
    title: 'Manager',
    desc: 'Department team management, review and approve team leave requests.',
    icon: Briefcase,
    color: '#8b5cf6',
    bg: '#f5f3ff',
  },
  {
    role: 'ROLE_HR',
    title: 'HR Lead',
    desc: 'Employee directory CRUD, organizational department management, and attendance logs.',
    icon: ShieldCheck,
    color: '#059669',
    bg: '#ecfdf5',
  },
  {
    role: 'ROLE_ADMIN',
    title: 'System Admin',
    desc: 'Full enterprise privileges, system user provisioning, role grants, and settings.',
    icon: Shield,
    color: '#dc2626',
    bg: '#fef2f2',
  },
];

const UserManagement = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    roles: ['ROLE_EMPLOYEE'],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRoleToggle = (role) => {
    setFormData((prev) => {
      const exists = prev.roles.includes(role);
      let updated;
      if (exists) {
        updated = prev.roles.filter((r) => r !== role);
      } else {
        updated = [...prev.roles, role];
      }
      return { ...prev, roles: updated.length ? updated : ['ROLE_EMPLOYEE'] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post('/auth/register', formData);
      setSuccess(`User account '${formData.username}' provisioned successfully!`);
      setFormData({ username: '', email: '', password: '', roles: ['ROLE_EMPLOYEE'] });
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div className="ems-card-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="ems-card-title">User & Role Provisioning</h1>
          <p className="ems-card-subtitle">
            Create enterprise user accounts and allocate granular role-based access control (RBAC) privileges
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      <div className="ems-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--slate-100)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserPlus size={20} color="var(--primary-600)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--slate-900)', margin: 0 }}>
              Provision New Account
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: 0 }}>
              Specify credentials and choose the security scopes for this team member
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Username */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Username *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="e.g. sarah_connor"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Corporate Email *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginTop: '20px' }}>
            <label className="form-label">Initial Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '38px', paddingRight: '40px' }}
                placeholder="Secure temporary password (min 6 characters)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--slate-400)',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '4px' }}>
              The employee will be required to change this upon initial login.
            </p>
          </div>

          {/* Role Privileges Cards */}
          <div className="form-group" style={{ marginTop: '24px' }}>
            <label className="form-label">Assign RBAC Security Roles</label>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '12px' }}>
              Select one or more authorization privileges for this identity
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
              {ROLE_DEFINITIONS.map((def) => {
                const isSelected = formData.roles.includes(def.role);
                const IconComponent = def.icon;
                return (
                  <div
                    key={def.role}
                    onClick={() => handleRoleToggle(def.role)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid',
                      borderColor: isSelected ? 'var(--primary-600)' : 'var(--slate-200)',
                      backgroundColor: isSelected ? 'var(--primary-50)' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      transition: 'all 0.18s ease',
                      boxShadow: isSelected ? '0 2px 6px rgba(37, 99, 235, 0.12)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: def.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconComponent size={18} color={def.color} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem', color: isSelected ? 'var(--primary-800)' : 'var(--slate-800)' }}>
                          {def.title}
                        </span>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: '1.5px solid',
                            borderColor: isSelected ? 'var(--primary-600)' : 'var(--slate-300)',
                            backgroundColor: isSelected ? 'var(--primary-600)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isSelected && <Check size={12} color="#ffffff" strokeWidth={3} />}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '4px', lineHeight: 1.4 }}>
                        {def.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px', paddingTop: '16px', borderTop: '1px solid var(--slate-100)' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ display: 'inline-flex', gap: '8px', padding: '10px 22px' }}
            >
              <UserPlus size={16} />
              <span>{loading ? 'Provisioning Account...' : 'Provision User Account'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
