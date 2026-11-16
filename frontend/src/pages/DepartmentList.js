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
      alert(`Cannot delete '${name}' because ${count} employee(s) are currently assigned to it.`);
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
      <div className="ems-card-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="ems-card-title" style={{ fontSize: '1.5rem' }}>Department Management</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '4px' }}>
            Configure enterprise divisions, organizational codes, and monitor headcounts
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

      <div className="ems-card" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="ems-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Department Name</th>
                <th>Description</th>
                <th>Headcount</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-500)' }}>
                    Loading departments...
                  </td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-500)' }}>
                    No departments created yet.
                  </td>
                </tr>
              ) : (
                departments.map((dept) => (
                  <tr key={dept.id}>
                    <td style={{ fontWeight: '600', color: 'var(--primary-700)' }}>{dept.departmentCode}</td>
                    <td style={{ fontWeight: '600' }}>{dept.name}</td>
                    <td style={{ color: 'var(--gray-600)' }}>{dept.description || '—'}</td>
                    <td>
                      <span className="badge badge-primary" style={{ display: 'inline-flex', gap: '4px' }}>
                        <Users size={12} />
                        {dept.employeeCount} Members
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {hasAnyRole(['ADMIN', 'HR']) && (
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => openEditModal(dept)}
                            className="btn btn-sm btn-secondary"
                            title="Edit Department"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(dept.id, dept.name, dept.employeeCount)}
                            className="btn btn-sm btn-danger"
                            title="Delete Department"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Create/Edit */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="ems-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                {editingDept ? 'Edit Department' : 'Create New Department'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="var(--gray-500)" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Department Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Artificial Intelligence"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department Code *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. AI or ENG"
                  value={deptForm.departmentCode}
                  onChange={(e) => setDeptForm({ ...deptForm, departmentCode: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Responsibilities and domain..."
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
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
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '100%',
    maxWidth: '480px',
    margin: '20px',
  },
};

export default DepartmentList;
