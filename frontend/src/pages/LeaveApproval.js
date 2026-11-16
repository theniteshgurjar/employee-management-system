import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  X,
} from 'lucide-react';

const LeaveApproval = () => {
  const { hasAnyRole } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Reject Modal
  const [rejectModal, setRejectModal] = useState({ open: false, leaveId: null, employeeName: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPendingLeaves = async () => {
    setLoading(true);
    try {
      // HR/Admin can view all pending leaves; Managers view team pending leaves
      const endpoint = hasAnyRole(['ADMIN', 'HR']) ? '/leaves/all' : '/leaves/team-pending';
      const res = await api.get(endpoint);
      const pendingOnly = res.data.data.filter((l) => l.status === 'PENDING');
      setLeaves(pendingOnly);
    } catch (err) {
      setError('Failed to load pending leave requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const handleApprove = async (id, name) => {
    if (!window.confirm(`Approve leave request for ${name}?`)) return;
    setActionLoading(true);
    setError(null);
    try {
      await api.put(`/leaves/${id}/review`, {
        status: 'APPROVED',
        comments: 'Approved by management',
      });
      setSuccess(`Leave request for ${name} has been approved.`);
      fetchPendingLeaves();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve leave.');
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (id, name) => {
    setRejectModal({ open: true, leaveId: id, employeeName: name });
    setRejectReason('');
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    try {
      await api.put(`/leaves/${rejectModal.leaveId}/review`, {
        status: 'REJECTED',
        comments: rejectReason || 'Declined due to operational requirements',
      });
      setSuccess(`Leave request for ${rejectModal.employeeName} has been rejected.`);
      setRejectModal({ open: false, leaveId: null, employeeName: '' });
      fetchPendingLeaves();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject leave.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div className="ems-card-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="ems-card-title" style={{ fontSize: '1.5rem' }}>Leave Approvals</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '4px' }}>
            Review, authorize, or decline employee time-off applications
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

      <div className="ems-card" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="ems-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Total Days</th>
                <th>Reason</th>
                <th>Applied On</th>
                <th style={{ textAlign: 'right' }}>Review Decision</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-500)' }}>
                    Loading pending applications...
                  </td>
                </tr>
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-500)' }}>
                    No pending leave applications requiring approval.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{leave.employeeName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{leave.employeeCode}</div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{leave.leaveType}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {leave.startDate} to {leave.endDate}
                    </td>
                    <td style={{ fontWeight: '600' }}>{leave.totalDays} day(s)</td>
                    <td style={{ maxWidth: '280px', color: 'var(--gray-700)', fontSize: '0.85rem' }}>
                      {leave.reason}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                      {leave.createdAt ? new Date(leave.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleApprove(leave.id, leave.employeeName)}
                          disabled={actionLoading}
                          className="btn btn-sm btn-success"
                          style={{ display: 'inline-flex', gap: '4px' }}
                          title="Approve Leave"
                        >
                          <CheckCircle2 size={14} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => openRejectModal(leave.id, leave.employeeName)}
                          disabled={actionLoading}
                          className="btn btn-sm btn-danger"
                          style={{ display: 'inline-flex', gap: '4px' }}
                          title="Reject Leave"
                        >
                          <XCircle size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Reason Modal */}
      {rejectModal.open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="ems-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--danger-700)' }}>
                Reject Leave Request
              </h2>
              <button
                onClick={() => setRejectModal({ open: false, leaveId: null, employeeName: '' })}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} color="var(--gray-500)" />
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '16px' }}>
              Please state a reason for rejecting the request for <strong>{rejectModal.employeeName}</strong>:
            </p>

            <form onSubmit={handleRejectSubmit}>
              <div className="form-group">
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="e.g. Critical project deadline, please reschedule..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setRejectModal({ open: false, leaveId: null, employeeName: '' })}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger" disabled={actionLoading}>
                  {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
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
    maxWidth: '460px',
    margin: '20px',
  },
};

export default LeaveApproval;
