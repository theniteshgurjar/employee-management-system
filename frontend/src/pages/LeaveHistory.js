import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  CalendarPlus,
  AlertCircle,
  CheckCircle2,
  Clock,
  History,
  X,
  Calendar,
  Filter,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
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
    if (!window.confirm('Are you sure you want to cancel this leave application? Quota days will be restored immediately.')) return;
    try {
      await api.put(`/leaves/${id}/cancel`);
      setSuccess('Leave application cancelled successfully. Balance restored.');
      fetchLeaves();
      setTimeout(() => setSuccess(null), 4000);
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
        return (
          <span className="badge badge-success">
            <span className="badge-dot" />
            Approved
          </span>
        );
      case 'PENDING':
        return (
          <span className="badge badge-warning">
            <span className="badge-dot" />
            Pending Review
          </span>
        );
      case 'REJECTED':
        return (
          <span className="badge badge-danger">
            <span className="badge-dot" />
            Rejected
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="badge badge-neutral">
            Cancelled
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    if (filterStatus === 'ALL') return true;
    return leave.status === filterStatus;
  });

  // Calculate summary metrics
  const totalApplications = leaves.length;
  const pendingCount = leaves.filter((l) => l.status === 'PENDING').length;
  const approvedCount = leaves.filter((l) => l.status === 'APPROVED').length;
  const rejectedCount = leaves.filter((l) => l.status === 'REJECTED').length;

  return (
    <div>
      {/* Header Bar */}
      <div className="ems-card-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="ems-card-title">My Leave History</h1>
          <p className="ems-card-subtitle">
            Track time-off applications, supervisory review status, and audit decision records
          </p>
        </div>
        <Link to="/leaves/apply" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px' }}>
          <CalendarPlus size={17} />
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

      {/* Summary KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>Total Submissions</span>
          <span style={styles.kpiValue}>{totalApplications}</span>
        </div>
        <div style={{ ...styles.kpiCard, borderLeft: '4px solid #f59e0b' }}>
          <span style={styles.kpiLabel}>Pending Review</span>
          <span style={{ ...styles.kpiValue, color: 'var(--warning-700)' }}>{pendingCount}</span>
        </div>
        <div style={{ ...styles.kpiCard, borderLeft: '4px solid #10b981' }}>
          <span style={styles.kpiLabel}>Approved</span>
          <span style={{ ...styles.kpiValue, color: 'var(--success-700)' }}>{approvedCount}</span>
        </div>
        <div style={{ ...styles.kpiCard, borderLeft: '4px solid #ef4444' }}>
          <span style={styles.kpiLabel}>Rejected</span>
          <span style={{ ...styles.kpiValue, color: 'var(--danger-700)' }}>{rejectedCount}</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="ems-card" style={{ padding: 0 }}>
        {/* Table Filters Toolbar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--slate-400)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--slate-700)' }}>Filter by Status:</span>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: filterStatus === st ? 'var(--primary-600)' : 'var(--slate-200)',
                  backgroundColor: filterStatus === st ? 'var(--primary-50)' : '#ffffff',
                  color: filterStatus === st ? 'var(--primary-700)' : 'var(--slate-600)',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="ems-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Leave Schedule</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Reviewer Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-500)' }}>
                    Loading leave history records...
                  </td>
                </tr>
              ) : filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--slate-500)' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <Calendar size={22} color="var(--slate-400)" />
                    </div>
                    <p style={{ fontWeight: '600', color: 'var(--slate-700)', marginBottom: '4px' }}>No leave applications found</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--slate-400)' }}>
                      {filterStatus !== 'ALL' ? `No requests with status '${filterStatus}'` : 'You have not submitted any leave applications yet.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <span
                        style={{
                          fontWeight: '600',
                          fontSize: '0.82rem',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          backgroundColor:
                            leave.leaveType === 'CASUAL_LEAVE'
                              ? '#eff6ff'
                              : leave.leaveType === 'SICK_LEAVE'
                              ? '#ecfdf5'
                              : leave.leaveType === 'EARNED_LEAVE'
                              ? '#f5f3ff'
                              : '#fffbeb',
                          color:
                            leave.leaveType === 'CASUAL_LEAVE'
                              ? '#1d4ed8'
                              : leave.leaveType === 'SICK_LEAVE'
                              ? '#047857'
                              : leave.leaveType === 'EARNED_LEAVE'
                              ? '#6d28d9'
                              : '#b45309',
                          border: '1px solid rgba(0,0,0,0.06)',
                        }}
                      >
                        {leave.leaveType?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{leave.startDate}</span>
                        <ArrowRight size={13} color="var(--slate-400)" />
                        <span>{leave.endDate}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: 'var(--slate-800)', fontSize: '0.88rem' }}>
                        {leave.totalDays} day{leave.totalDays > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td style={{ maxWidth: '220px', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={leave.reason}>
                        {leave.reason}
                      </div>
                    </td>
                    <td>{getStatusBadge(leave.status)}</td>
                    <td style={{ color: 'var(--slate-600)', fontSize: '0.84rem' }}>
                      {leave.rejectionReason ? (
                        <span style={{ color: 'var(--danger-700)' }}>Rejection: "{leave.rejectionReason}"</span>
                      ) : leave.approvedByName ? (
                        <span style={{ color: 'var(--success-700)' }}>Approved by {leave.approvedByName}</span>
                      ) : (
                        <span style={{ color: 'var(--slate-400)' }}>Awaiting decision</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => openAuditModal(leave.id)}
                          className="btn btn-sm btn-secondary"
                          title="View Decision Audit Trail"
                          style={{ padding: '6px 10px' }}
                        >
                          <History size={14} />
                          <span>Trail</span>
                        </button>
                        {(leave.status === 'PENDING' || leave.status === 'APPROVED') && (
                          <button
                            onClick={() => handleCancel(leave.id)}
                            className="btn btn-sm btn-danger"
                            title="Cancel Application"
                            style={{ padding: '6px 10px' }}
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

      {/* Audit History Timeline Modal */}
      {auditModal.open && (
        <div className="modal-overlay" onClick={() => setAuditModal({ open: false, records: [], leaveId: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--slate-900)' }}>
                  Decision Audit Trail
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                  Transparent lifecycle verification for Application #{auditModal.leaveId}
                </p>
              </div>
              <button
                onClick={() => setAuditModal({ open: false, records: [], leaveId: null })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '6px' }}
              >
                <X size={20} color="var(--slate-400)" />
              </button>
            </div>

            {auditLoading ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--slate-500)' }}>
                Loading audit trail records...
              </div>
            ) : auditModal.records.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--slate-500)', padding: '32px 0' }}>
                <Clock size={32} color="var(--slate-300)" style={{ margin: '0 auto 8px', display: 'block' }} />
                No workflow actions recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                {auditModal.records.map((r, idx) => (
                  <div key={r.id || idx} style={styles.timelineItem}>
                    <div style={styles.timelineIcon}>
                      <UserCheck size={16} color="var(--primary-600)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                        <span
                          style={{
                            fontWeight: '700',
                            fontSize: '0.82rem',
                            color: r.action === 'APPROVED' ? '#059669' : r.action === 'REJECTED' ? '#dc2626' : '#2563eb',
                          }}
                        >
                          {r.action}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                          {r.actionTimestamp ? new Date(r.actionTimestamp).toLocaleString() : 'Recent'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--slate-700)', marginTop: '4px' }}>
                        Authorized By: <strong>{r.actionBy?.firstName} {r.actionBy?.lastName}</strong> ({r.actionBy?.designation || 'Manager'})
                      </div>
                      {r.comments && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginTop: '6px', padding: '8px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '6px', borderLeft: '3px solid var(--slate-300)' }}>
                          "{r.comments}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={() => setAuditModal({ open: false, records: [], leaveId: null })}
                className="btn btn-secondary"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  kpiCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px 20px',
    border: '1px solid var(--slate-200)',
    boxShadow: 'var(--shadow-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  kpiLabel: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: 'var(--slate-500)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  kpiValue: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: 'var(--slate-900)',
    letterSpacing: '-0.02em',
  },
  timelineItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '12px 14px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid var(--slate-200)',
  },
  timelineIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'var(--primary-50)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
};

export default LeaveHistory;
