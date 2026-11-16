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
  Filter,
} from 'lucide-react';

const EmployeeList = () => {
  const { hasAnyRole } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employees');
      setEmployees(res.data.data);
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
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate employee: ${name}?`)) {
      return;
    }
    try {
      await api.delete(`/employees/${id}`);
      setSuccess(`Employee ${name} deactivated successfully.`);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deactivate employee.');
    }
  };

  return (
    <div>
      <div className="ems-card-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="ems-card-title" style={{ fontSize: '1.5rem' }}>Employee Directory</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '4px' }}>
            Manage staff profiles, department assignments, and organizational reporting hierarchy
          </p>
        </div>
        {hasAnyRole(['ADMIN', 'HR']) && (
          <Link to="/employees/new" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px' }}>
            <UserPlus size={18} />
            <span>Add Employee</span>
          </Link>
        )}
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

      {/* Search & Filter Bar */}
      <div className="ems-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--gray-400)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="Search by name, employee code, email, or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm('');
                fetchEmployees();
              }}
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="ems-card" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="ems-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Manager</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-500)' }}>
                    Loading employee records...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-500)' }}>
                    No employee records found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td style={{ fontWeight: '600', color: 'var(--primary-700)' }}>{emp.employeeCode}</td>
                    <td style={{ fontWeight: '600' }}>{emp.firstName} {emp.lastName}</td>
                    <td>{emp.email}</td>
                    <td>
                      <span className="badge badge-primary">{emp.departmentName || 'Unassigned'}</span>
                    </td>
                    <td>{emp.designation}</td>
                    <td>{emp.managerName || '—'}</td>
                    <td>
                      <span className={`badge ${emp.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
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
    </div>
  );
};

export default EmployeeList;
