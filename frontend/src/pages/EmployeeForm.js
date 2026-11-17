import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Building2,
  Mail,
} from 'lucide-react';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    joiningDate: new Date().toISOString().split('T')[0],
    designation: '',
    departmentId: '',
    managerId: '',
    status: 'ACTIVE',
    username: '',
    password: '',
    roles: ['ROLE_EMPLOYEE'],
  });

  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, empRes] = await Promise.all([
          api.get('/departments'),
          api.get('/employees'),
        ]);
        setDepartments(deptRes.data.data);
        setManagers(empRes.data.data);

        if (isEditMode) {
          const empRes = await api.get(`/employees/${id}`);
          const emp = empRes.data.data;
          setFormData({
            employeeCode: emp.employeeCode || '',
            firstName: emp.firstName || '',
            lastName: emp.lastName || '',
            email: emp.email || '',
            phone: emp.phone || '',
            address: emp.address || '',
            dateOfBirth: emp.dateOfBirth || '',
            joiningDate: emp.joiningDate || '',
            designation: emp.designation || '',
            departmentId: emp.departmentId || '',
            managerId: emp.managerId || '',
            status: emp.status || 'ACTIVE',
            username: emp.username || '',
            password: '',
            roles: emp.roles ? Array.from(emp.roles) : ['ROLE_EMPLOYEE'],
          });
        }
      } catch (err) {
        setError('Failed to load form dependencies.');
      }
    };
    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (role) => {
    setFormData((prev) => {
      const exists = prev.roles.includes(role);
      const updated = exists ? prev.roles.filter((r) => r !== role) : [...prev.roles, role];
      return { ...prev, roles: updated.length ? updated : ['ROLE_EMPLOYEE'] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        departmentId: Number(formData.departmentId),
        managerId: formData.managerId ? Number(formData.managerId) : null,
      };

      if (isEditMode) {
        await api.put(`/employees/${id}`, payload);
      } else {
        await api.post('/employees', payload);
      }

      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving employee.');
    } finally {
      setLoading(false);
    }
  };

  const selectedDepartment = departments.find((d) => String(d.id) === String(formData.departmentId));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <Link to="/employees" className="btn btn-secondary" style={{ padding: '8px' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="ems-card-title">
            {isEditMode ? 'Edit Personnel Profile' : 'Onboard New Employee'}
          </h1>
          <p className="ems-card-subtitle">
            Configure employee demographic data, departmental assignments, and authentication credentials
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <div className="employee-form-layout">
        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          {/* Section 1 */}
          <div className="ems-card">
            <h2 style={styles.sectionHeading}>1. Personal & Contact Demographics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
              <div className="form-group">
                <label className="form-label">Employee Code *</label>
                <input
                  type="text"
                  name="employeeCode"
                  className="form-input"
                  placeholder="e.g. EMP005"
                  value={formData.employeeCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-input"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-input"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="form-input"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Residential Address</label>
              <input
                type="text"
                name="address"
                className="form-input"
                placeholder="Street address, City, State, Country"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section 2 */}
          <div className="ems-card">
            <h2 style={styles.sectionHeading}>2. Organizational Assignment</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
              <div className="form-group">
                <label className="form-label">Designation / Role Title *</label>
                <input
                  type="text"
                  name="designation"
                  className="form-input"
                  placeholder="e.g. Senior Backend Engineer"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Joining Date *</label>
                <input
                  type="date"
                  name="joiningDate"
                  className="form-input"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  name="departmentId"
                  className="form-select"
                  value={formData.departmentId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.departmentCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Direct Reporting Manager</label>
                <select
                  name="managerId"
                  className="form-select"
                  value={formData.managerId}
                  onChange={handleChange}
                >
                  <option value="">-- None (Reports to Head of Dept) --</option>
                  {managers
                    .filter((m) => !isEditMode || m.id !== Number(id))
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.firstName} {m.lastName} ({m.designation})
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Employment Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PROBATION">PROBATION</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="TERMINATED">TERMINATED</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="ems-card">
            <h2 style={styles.sectionHeading}>
              3. System Access & Security Privileges
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
              <div className="form-group">
                <label className="form-label">Login Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  placeholder="e.g. j_smith"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isEditMode && !!formData.username}
                />
              </div>

              {!isEditMode && (
                <div className="form-group">
                  <label className="form-label">Initial Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    placeholder="Set temporary password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>

            <div style={{ marginTop: '12px' }}>
              <label className="form-label">Role Authorization Badges</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
                {['ROLE_EMPLOYEE', 'ROLE_MANAGER', 'ROLE_HR', 'ROLE_ADMIN'].map((role) => (
                  <label
                    key={role}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      backgroundColor: formData.roles.includes(role) ? 'var(--primary-50)' : 'var(--slate-50)',
                      border: `1.5px solid ${formData.roles.includes(role) ? 'var(--primary-600)' : 'var(--slate-200)'}`,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                    />
                    <span>{role.replace('ROLE_', '')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '40px' }}>
            <Link to="/employees" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ display: 'inline-flex', gap: '8px' }}>
              <Save size={18} />
              <span>{loading ? 'Saving Changes...' : isEditMode ? 'Update Employee Profile' : 'Onboard Employee'}</span>
            </button>
          </div>
        </form>

        {/* Live Employee Badge Preview Card */}
        <div style={styles.previewCard} className="ems-card">
          <div style={styles.previewHeader}>Live ID Preview</div>
          <div style={styles.previewAvatar}>
            {(formData.firstName?.[0] || 'E').toUpperCase()}
          </div>
          <div style={styles.previewName}>
            {formData.firstName || formData.lastName
              ? `${formData.firstName} ${formData.lastName}`
              : 'New Employee'}
          </div>
          <div style={styles.previewCode}>
            {formData.employeeCode || 'EMP-XXXX'}
          </div>
          <div style={styles.previewDesignation}>
            {formData.designation || 'Staff Designation'}
          </div>

          <div style={styles.previewDivider} />

          <div style={styles.previewInfoRow}>
            <Building2 size={14} color="var(--slate-400)" />
            <span>{selectedDepartment?.name || 'Department'}</span>
          </div>
          <div style={styles.previewInfoRow}>
            <Mail size={14} color="var(--slate-400)" />
            <span>{formData.email || 'email@company.com'}</span>
          </div>

          <div style={{ marginTop: '16px' }}>
            <span className={`badge ${formData.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
              <span className="badge-dot" />
              {formData.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  sectionHeading: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'var(--slate-900)',
    marginBottom: '18px',
    paddingBottom: '10px',
    borderBottom: '1px solid var(--slate-100)',
  },
  previewCard: {
    position: 'sticky',
    top: '90px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '28px 20px',
    backgroundColor: '#ffffff',
  },
  previewHeader: {
    fontSize: '0.72rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--slate-400)',
    marginBottom: '16px',
  },
  previewAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '8px',
    background: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#ffffff',
    border: '1px solid #1e293b',
    marginBottom: '14px',
  },
  previewName: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--slate-900)',
  },
  previewCode: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.8rem',
    color: 'var(--primary-600)',
    fontWeight: '600',
    marginTop: '2px',
  },
  previewDesignation: {
    fontSize: '0.825rem',
    color: 'var(--slate-500)',
    marginTop: '4px',
  },
  previewDivider: {
    width: '100%',
    height: '1px',
    backgroundColor: 'var(--slate-100)',
    margin: '16px 0',
  },
  previewInfoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    color: 'var(--slate-600)',
    marginBottom: '6px',
  },
};

export default EmployeeForm;
