import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  CalendarPlus,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  History,
  X,
} from 'lucide-react';

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // History Audit Modal
  const [auditModal, setAuditModal] = useState({ open: false, records: [], leaveId: null });
  const [auditLoading, setAuditLoading] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leaves/my-leaves');
      setLeaves(res.data.data);
    } catch (err) {
      setError('Failed to load leave history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this leave application?')) return;
    try {
      await api.put(`/leaves/${id}/cancel`);
      setSuccess('Leave application cancelled successfully.');
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel leave.');
    }
  };

  const openAuditModal = async (leaveId) => {
    setAuditLoading(true);
    setAuditModal({ open: true, records: [], leaveId });
    try {
      const res = await api.get(`/leaves/${leaveId}/history`);
      setAuditModal({ open: true, records: res.data.data, leaveId });
    } catch (err) {
      setError('Could not retrieve audit history.');
    } finally {
      setAuditLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="badge badge-success">APPROVED</span>;
      case 'PENDING':
        return <span className="badge badge-warning">PENDING</span>;
      case 'REJECTED':
        return <span className="badge badge-danger">REJECTED</span>;
      case 'CANCELLED':
        return <span className="badge badge-secondary" style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>CANCELLED</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      <div className="ems-card-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="ems-card-title" style={{ fontSize: '1.5rem' }}>My Leave Applications</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '4px' }}>
            Historical record of your time-off applications, review outcomes, and cancellation options
          </p>
        </div>
        <Link to="/leaves/apply" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px' }}>
          <CalendarPlus size={18} />
          <span>Apply New Leave</span>
        </Link>
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
                <th>Category</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Reviewer Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-500)' }}>
                    Loading leave history...
                  </td>
                </tr>
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-500)' }}>
                    No leave requests found. Click "Apply New Leave" to submit your first request.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <span className="badge badge-primary">{leave.leaveType}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {leave.startDate} &rarr; {leave.endDate}
                    </td>
                    <td style={{ fontWeight: '600' }}>{leave.totalDays} day(s)</td>
                    <td style={{ maxWidth: '240px', fontSize: '0.85rem' }}>{leave.reason}</td>
                    <td>{getStatusBadge(leave.status)}</td>
                    <td style={{ color: 'var(--gray-600)', fontSize: '0.85rem' }}>
                      {leave.rejectionReason || (leave.approvedByName ? `Approved by ${leave.approvedByName}` : '—')}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => openAuditModal(leave.id)}
                          className="btn btn-sm btn-secondary"
                          title="View Approval Audit Trail"
                        >
                          <History size={14} />
                        </button>
                        {(leave.status === 'PENDING' || leave.status === 'APPROVED') && (
                          <button
                            onClick={() => handleCancel(leave.id)}
                            className="btn btn-sm btn-danger"
                            title="Cancel Request"
                          >
                            Cancel
                          </button>
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

      {/* Audit History Modal */}
      {auditModal.open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="ems-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Leave Decision Trail</h2>
              <button
                onClick={() => setAuditModal({ open: false, records: [], leaveId: null })}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} color="var(--gray-500)" />
              </button>
            </div>

            {auditLoading ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading audit records...</p>
            ) : auditModal.records.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '20px' }}>No audit records found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {auditModal.records.map((r) => (
                  <div key={r.id} style={styles.auditItem}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-primary">{r.action}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        {r.actionTimestamp ? new Date(r.actionTimestamp).toLocaleString() : '—'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', marginTop: '6px', color: 'var(--gray-800)' }}>
                      Action By: <strong>{r.actionBy?.firstName} {r.actionBy?.lastName}</strong> ({r.actionBy?.designation})
                    </div>
                    {r.comments && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: '4px', fontStyle: 'italic' }}>
                        "{r.comments}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={() => setAuditModal({ open: false, records: [], leaveId: null })}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
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
    maxWidth: '520px',
    margin: '20px',
  },
  auditItem: {
    padding: '12px 14px',
    backgroundColor: 'var(--gray-50)',
    borderRadius: '8px',
    border: '1px solid var(--gray-200)',
  },
};

export default LeaveHistory;
