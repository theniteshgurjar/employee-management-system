import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  UserPlus,
  Search,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  LayoutGrid,
  List as ListIcon,
  Mail,
  Building2,
  User,
} from 'lucide-react';

const EmployeeList = () => {
  const { hasAnyRole } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const [empRes, deptRes] = await Promise.all([
        api.get('/employees'),
        api.get('/departments'),
      ]);
      setEmployees(empRes.data.data);
      setDepartments(deptRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load employees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get(`/employees/search?keyword=${encodeURIComponent(searchTerm)}`);
      setEmployees(res.data.data);
    } catch (err) {
      setError('Search query failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate employee: ${name}?`)) return;
    try {
      await api.delete(`/employees/${id}`);
      setSuccess(`Employee ${name} deactivated successfully.`);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deactivate employee.');
    }
  };

  // Client-side filtering for Department and Status
  const filteredEmployees = employees.filter((emp) => {
    const matchesDept = !deptFilter || String(emp.departmentId) === deptFilter;
    const matchesStatus = !statusFilter || emp.status === statusFilter;
    return matchesDept && matchesStatus;
  });

  const getAvatarColor = (code) => {
    const colors = ['#2563eb', '#7c3aed', '#059669', '#0284c7', '#0f172a'];
    const index = (code?.charCodeAt(code.length - 1) || 0) % colors.length;
    return colors[index];
  };

  return (
    <div>
      {/* Header */}
      <div className="ems-card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="ems-card-title">Employee Directory</h1>
            <span className="badge badge-primary">
              {filteredEmployees.length} Total
            </span>
          </div>
          <p className="ems-card-subtitle">
            Manage personnel profiles, organizational assignments, and reporting lines
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* View Mode Toggle */}
          <div style={styles.toggleGroup}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                ...styles.toggleBtn,
                ...(viewMode === 'table' ? styles.toggleBtnActive : {}),
              }}
              title="Table View"
            >
              <ListIcon size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                ...styles.toggleBtn,
                ...(viewMode === 'grid' ? styles.toggleBtnActive : {}),
              }}
              title="Grid Cards View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          {hasAnyRole(['ADMIN', 'HR']) && (
            <Link to="/employees/new" className="btn btn-primary">
              <UserPlus size={18} />
              <span>Onboard Employee</span>
            </Link>
          )}
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

      {/* Filter and Search Bar */}
      <div className="ems-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ flex: '2', minWidth: '260px', display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--slate-400)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="Search by name, code, designation, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              Search
            </button>
          </form>

          {/* Department Filter */}
          <div style={{ flex: '1', minWidth: '180px' }}>
            <select
              className="form-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.departmentCode})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ flex: '0.8', minWidth: '140px' }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="PROBATION">PROBATION</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid View */}
      {viewMode === 'table' ? (
        <div className="ems-card" style={{ padding: 0 }}>
          <div className="table-container">
            <table className="ems-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Contact Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Reporting Manager</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-500)' }}>
                      Loading employee records...
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-500)' }}>
                      No matching employee records found.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              ...styles.tableAvatar,
                              backgroundColor: getAvatarColor(emp.employeeCode),
                            }}
                          >
                            {(emp.firstName?.[0] || 'E').toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--slate-900)' }}>
                              {emp.firstName} {emp.lastName}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontFamily: "'JetBrains Mono', monospace" }}>
                              {emp.employeeCode}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--slate-600)' }}>{emp.email}</td>
                      <td>
                        <span className="badge badge-primary">
                          <Building2 size={12} />
                          {emp.departmentName || 'Unassigned'}
                        </span>
                      </td>
                      <td style={{ fontWeight: '500' }}>{emp.designation}</td>
                      <td style={{ color: 'var(--slate-600)' }}>{emp.managerName || '—'}</td>
                      <td>
                        <span className={`badge ${emp.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                          <span className="badge-dot" />
                          {emp.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <Link to={`/employees/${emp.id}`} className="btn btn-sm btn-secondary" title="View Profile">
                            <Eye size={14} />
                          </Link>
                          {hasAnyRole(['ADMIN', 'HR']) && (
                            <>
                              <Link to={`/employees/edit/${emp.id}`} className="btn btn-sm btn-secondary" title="Edit Employee">
                                <Edit2 size={14} />
                              </Link>
                              {emp.status === 'ACTIVE' && (
                                <button
                                  onClick={() => handleDeactivate(emp.id, `${emp.firstName} ${emp.lastName}`)}
                                  className="btn btn-sm btn-danger"
                                  title="Deactivate Employee"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div style={styles.gridCards}>
          {filteredEmployees.map((emp) => (
            <div key={emp.id} className="ems-card ems-card-hover" style={styles.employeeCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{ ...styles.gridAvatar, backgroundColor: getAvatarColor(emp.employeeCode) }}>
                  {(emp.firstName?.[0] || 'E').toUpperCase()}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--slate-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {emp.firstName} {emp.lastName}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                    {emp.designation}
                  </div>
                </div>
              </div>

              <div style={styles.gridInfoRows}>
                <div style={styles.gridInfoRow}>
                  <Building2 size={14} color="var(--slate-400)" />
                  <span>{emp.departmentName || 'Unassigned'}</span>
                </div>
                <div style={styles.gridInfoRow}>
                  <Mail size={14} color="var(--slate-400)" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.email}</span>
                </div>
                {emp.managerName && (
                  <div style={styles.gridInfoRow}>
                    <User size={14} color="var(--slate-400)" />
                    <span>Reports to: {emp.managerName}</span>
                  </div>
                )}
              </div>

              <div style={styles.gridCardFooter}>
                <span className={`badge ${emp.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                  <span className="badge-dot" />
                  {emp.status}
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <Link to={`/employees/${emp.id}`} className="btn btn-sm btn-secondary">
                    View
                  </Link>
                  {hasAnyRole(['ADMIN', 'HR']) && (
                    <Link to={`/employees/edit/${emp.id}`} className="btn btn-sm btn-secondary">
                      <Edit2 size={13} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  toggleGroup: {
    display: 'flex',
    backgroundColor: 'var(--slate-100)',
    borderRadius: 'var(--radius-md)',
    padding: '3px',
    border: '1px solid var(--slate-200)',
  },
  toggleBtn: {
    padding: '6px 10px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--slate-500)',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  },
  toggleBtnActive: {
    backgroundColor: '#ffffff',
    color: 'var(--slate-900)',
    boxShadow: 'var(--shadow-subtle)',
  },
  tableAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.85rem',
    flexShrink: 0,
  },
  gridCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  employeeCard: {
    padding: '22px',
    marginBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  gridAvatar: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: '800',
    fontSize: '1.1rem',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  gridInfoRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    margin: '12px 0 16px',
    paddingTop: '12px',
    borderTop: '1px solid var(--slate-100)',
  },
  gridInfoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.825rem',
    color: 'var(--slate-600)',
  },
  gridCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid var(--slate-100)',
  },
};

export default EmployeeList;
