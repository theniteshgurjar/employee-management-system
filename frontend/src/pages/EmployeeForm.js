import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

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
    joiningDate: '',
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

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Link to="/employees" className="btn btn-secondary" style={{ padding: '8px' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="ems-card-title" style={{ fontSize: '1.4rem' }}>
            {isEditMode ? 'Edit Employee Profile' : 'Onboard New Employee'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '2px' }}>
            Fill in the professional demographic and organizational details
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="ems-card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px' }}>1. Basic Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
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
                placeholder="+1 555-0199"
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

          <div className="form-group">
            <label className="form-label">Residential Address</label>
            <input
              type="text"
              name="address"
              className="form-input"
              placeholder="City, State, Street address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="ems-card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px' }}>2. Organizational Assignment</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Designation / Role Title *</label>
              <input
                type="text"
                name="designation"
                className="form-input"
                placeholder="e.g. Senior Software Engineer"
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
              <label className="form-label">Reporting Manager</label>
              <select
                name="managerId"
                className="form-select"
                value={formData.managerId}
                onChange={handleChange}
              >
                <option value="">-- No Direct Manager (Reports to Head) --</option>
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

        {/* User Account Provisioning */}
        <div className="ems-card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px' }}>
            3. System Access & Roles {isEditMode && '(Credentials)'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Login Username</label>
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="username"
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
                  placeholder="Set initial password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div style={{ marginTop: '12px' }}>
            <label className="form-label">Assigned Roles</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '6px' }}>
              {['ROLE_EMPLOYEE', 'ROLE_MANAGER', 'ROLE_HR', 'ROLE_ADMIN'].map((role) => (
                <label
                  key={role}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: formData.roles.includes(role) ? 'var(--primary-50)' : 'var(--gray-100)',
                    border: `1px solid ${formData.roles.includes(role) ? 'var(--primary-600)' : 'var(--gray-300)'}`,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
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
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'inline-flex', gap: '8px' }}>
            <Save size={16} />
            <span>{loading ? 'Saving...' : isEditMode ? 'Update Employee' : 'Onboard Employee'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
