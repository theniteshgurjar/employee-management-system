import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
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

  const fetchPendingLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = hasAnyRole(['ADMIN', 'HR']) ? '/leaves/all' : '/leaves/team-pending';
      const res = await api.get(endpoint);
      const pendingOnly = res.data.data.filter((l) => l.status === 'PENDING');
      setLeaves(pendingOnly);
    } catch (err) {
      setError('Failed to load pending leave requests.');
    } finally {
      setLoading(false);
    }
  }, [hasAnyRole]);

  useEffect(() => {
    fetchPendingLeaves();
  }, [fetchPendingLeaves]);

  const handleApprove = async (id, name) => {
    if (!window.confirm(`Approve leave request for ${name}? Quota balance will be deducted immediately.`)) return;
    setActionLoading(true);
    setError(null);
    try {
      await api.put(`/leaves/${id}/review`, {
        status: 'APPROVED',
        comments: 'Authorized by management',
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
        comments: rejectReason || 'Declined due to operational priorities',
      });
      setSuccess(`Leave request for ${rejectModal.employeeName} has been declined.`);
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
      <div className="ems-card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="ems-card-title">Leave Approval Queue</h1>
            <span className="badge badge-warning">
              <Clock size={12} />
              {leaves.length} Pending Actions
            </span>
          </div>
          <p className="ems-card-subtitle">
            Review, authorize, or decline employee time-off applications with automatic balance synchronization
          </p>
        </div>
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

      <div className="ems-card" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="ems-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Category</th>
                <th>Dates & Duration</th>
                <th>Days</th>
                <th>Stated Reason</th>
                <th>Application Date</th>
                <th style={{ textAlign: 'right' }}>Review Decision</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-500)' }}>
                    Loading pending approval queue...
                  </td>
                </tr>
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-500)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={36} color="var(--success-500)" />
                      <span style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--slate-800)' }}>
                        All Caught Up!
                      </span>
                      <span style={{ fontSize: '0.85rem' }}>
                        No pending leave applications currently require your review.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={styles.applicantAvatar}>
                          {(leave.employeeName?.[0] || 'U').toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--slate-900)' }}>{leave.employeeName}</div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontFamily: "'JetBrains Mono', monospace" }}>
                            {leave.employeeCode}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{leave.leaveType}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <strong>{leave.startDate}</strong> &rarr; <strong>{leave.endDate}</strong>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--primary-600)' }}>{leave.totalDays} day(s)</strong>
                    </td>
                    <td style={{ maxWidth: '260px', color: 'var(--slate-700)', fontSize: '0.85rem' }}>
                      {leave.reason}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      {leave.createdAt ? new Date(leave.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleApprove(leave.id, leave.employeeName)}
                          disabled={actionLoading}
                          className="btn btn-sm btn-success"
                          style={{ gap: '5px' }}
                          title="Approve Leave"
                        >
                          <CheckCircle2 size={14} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => openRejectModal(leave.id, leave.employeeName)}
                          disabled={actionLoading}
                          className="btn btn-sm btn-danger"
                          style={{ gap: '5px' }}
                          title="Decline Leave"
                        >
                          <XCircle size={14} />
                          <span>Decline</span>
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
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--danger-700)' }}>
                Decline Leave Application
              </h2>
              <button
                onClick={() => setRejectModal({ open: false, leaveId: null, employeeName: '' })}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} color="var(--slate-500)" />
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '16px' }}>
              Provide a constructive reason for declining the time-off request for <strong>{rejectModal.employeeName}</strong>:
            </p>

            <form onSubmit={handleRejectSubmit}>
              <div className="form-group">
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="e.g. Critical release scheduled during this period, please discuss alternative dates..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setRejectModal({ open: false, leaveId: null, employeeName: '' })}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger" disabled={actionLoading}>
                  {actionLoading ? 'Declining...' : 'Confirm Decision'}
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
  applicantAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-100)',
    color: 'var(--primary-700)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.8rem',
  },
};

export default LeaveApproval;
