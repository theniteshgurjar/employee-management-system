import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  Users,
} from 'lucide-react';

const DepartmentList = () => {
  const { hasAnyRole } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptForm, setDeptForm] = useState({ name: '', departmentCode: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/departments');
      setDepartments(res.data.data);
    } catch (err) {
      setError('Failed to load departments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openCreateModal = () => {
    setEditingDept(null);
    setDeptForm({ name: '', departmentCode: '', description: '' });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setDeptForm({
      name: dept.name,
      departmentCode: dept.departmentCode,
      description: dept.description || '',
    });
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDept(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      if (editingDept) {
        await api.put(`/departments/${editingDept.id}`, deptForm);
        setSuccess(`Department '${deptForm.name}' updated successfully.`);
      } else {
        await api.post('/departments', deptForm);
        setSuccess(`Department '${deptForm.name}' created successfully.`);
      }
      closeModal();
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save department.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id, name, count) => {
    if (count > 0) {
      alert(`Cannot delete '${name}' because ${count} employee(s) are currently assigned to it. Please reassign them first.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete department '${name}'?`)) {
      return;
    }

    try {
      await api.delete(`/departments/${id}`);
      setSuccess(`Department '${name}' deleted successfully.`);
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete department.');
    }
  };

  return (
    <div>
      <div className="ems-card-header">
        <div>
          <h1 className="ems-card-title">Department Management</h1>
          <p className="ems-card-subtitle">
            Configure organizational divisions, corporate unit codes, and monitor staff headcount allocation
          </p>
        </div>
        {hasAnyRole(['ADMIN', 'HR']) && (
          <button onClick={openCreateModal} className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px' }}>
            <Plus size={18} />
            <span>Add Department</span>
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{success}</span>
        </div>
      )}

      {/* Department Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--slate-500)' }}>
          Loading department records...
        </div>
      ) : departments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--slate-500)' }}>
          No departments registered. Click "Add Department" above.
        </div>
      ) : (
        <div style={styles.deptGrid}>
          {departments.map((dept) => (
          <div key={dept.id} className="ems-card ems-card-hover" style={styles.deptCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={styles.codeBadge}>
                <Building2 size={20} color="var(--primary-600)" />
                <span style={styles.codeText}>{dept.departmentCode}</span>
              </div>

              {hasAnyRole(['ADMIN', 'HR']) && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => openEditModal(dept)}
                    className="btn btn-sm btn-secondary"
                    style={{ padding: '6px' }}
                    title="Edit Department"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(dept.id, dept.name, dept.employeeCount)}
                    className="btn btn-sm btn-danger"
                    style={{ padding: '6px' }}
                    title="Delete Department"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>

            <div style={{ margin: '16px 0 10px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--slate-900)' }}>
                {dept.name}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '4px', lineHeight: 1.5 }}>
                {dept.description || 'No formal description provided.'}
              </p>
            </div>

            <div style={styles.deptFooter}>
              <span className="badge badge-primary">
                <Users size={12} />
                {dept.employeeCount} Assigned Personnel
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                ID: #{dept.id}
              </span>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Modal Dialog for Create/Edit */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--slate-900)' }}>
                {editingDept ? 'Edit Department Details' : 'Create New Department'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="var(--slate-500)" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Department Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Data Engineering & Analytics"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Unique Department Code *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. DEA or ENG"
                  value={deptForm.departmentCode}
                  onChange={(e) => setDeptForm({ ...deptForm, departmentCode: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Charter / Description</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Describe the department's scope, objectives and responsibilities..."
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? 'Saving...' : editingDept ? 'Save Changes' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  deptGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
  },
  deptCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '20px',
    marginBottom: 0,
  },
  codeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    backgroundColor: 'var(--primary-50)',
    borderRadius: '10px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },
  codeText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '700',
    color: 'var(--primary-700)',
    fontSize: '0.85rem',
  },
  deptFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid var(--slate-100)',
    marginTop: '12px',
  },
};

export default DepartmentList;
