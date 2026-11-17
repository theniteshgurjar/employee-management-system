import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  CalendarPlus,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const LeaveApply = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [formData, setFormData] = useState({
    leaveType: 'CASUAL',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get('/leaves/my-balance');
        setBalance(res.data.data);
      } catch (err) {
        // handled
      }
    };
    fetchBalance();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const s = new Date(formData.startDate);
    const e = new Date(formData.endDate);
    if (s > e) return 0;
    const diff = (e - s) / (1000 * 60 * 60 * 24) + 1;
    return diff > 0 ? diff : 0;
  };

  const requestedDays = calculateDays();

  const getAvailableForType = (type) => {
    if (!balance) return 0;
    switch (type) {
      case 'CASUAL':
        return balance.casualLeaveBalance;
      case 'SICK':
        return balance.sickLeaveBalance;
      case 'EARNED':
        return balance.earnedLeaveBalance;
      case 'UNPAID':
        return 'Unlimited';
      default:
        return 0;
    }
  };

  const availableQuota = getAvailableForType(formData.leaveType);
  const isInsufficient = typeof availableQuota === 'number' && requestedDays > availableQuota;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (requestedDays <= 0) {
      setError('Start date cannot be after end date.');
      setLoading(false);
      return;
    }

    if (isInsufficient) {
      setError(`Insufficient ${formData.leaveType} leave balance. Available: ${availableQuota}, Requested: ${requestedDays}`);
      setLoading(false);
      return;
    }

    try {
      await api.post('/leaves/apply', formData);
      setSuccess('Leave application submitted successfully! Redirecting to history...');
      setTimeout(() => {
        navigate('/leaves/history');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave application.');
    } finally {
      setLoading(false);
    }
  };

  const leaveCategories = [
    {
      type: 'CASUAL',
      label: 'Casual Leave (CL)',
      desc: 'Short personal affairs & emergencies',
      balance: balance?.casualLeaveBalance ?? 12,
      badge: 'Annual Quota',
    },
    {
      type: 'SICK',
      label: 'Sick Leave (SL)',
      desc: 'Health, sickness & medical appointments',
      balance: balance?.sickLeaveBalance ?? 10,
      badge: 'Medical',
    },
    {
      type: 'EARNED',
      label: 'Earned Leave (EL)',
      desc: 'Planned vacations, holidays & rest',
      balance: balance?.earnedLeaveBalance ?? 15,
      badge: 'Vacation',
    },
    {
      type: 'UNPAID',
      label: 'Unpaid Leave (LWP)',
      desc: 'Loss of pay leave with no annual cap',
      balance: 'Unlimited',
      badge: 'Uncapped',
    },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="ems-card-header">
        <div>
          <h1 className="ems-card-title">Apply for Time Off</h1>
          <p className="ems-card-subtitle">
            Submit a formal leave request with real-time balance validation
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

      {/* Visual Category Selection Cards */}
      <div style={styles.categoryGrid}>
        {leaveCategories.map((cat) => (
          <div
            key={cat.type}
            onClick={() => setFormData({ ...formData, leaveType: cat.type })}
            style={{
              ...styles.categoryCard,
              ...(formData.leaveType === cat.type ? styles.categoryCardActive : {}),
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{cat.label}</span>
              <span className="badge badge-primary" style={{ fontSize: '0.675rem' }}>
                {cat.badge}
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', margin: '6px 0 10px' }}>
              {cat.desc}
            </div>
            <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--slate-800)' }}>
              Remaining: <span style={{ color: 'var(--primary-600)', fontSize: '1rem', fontWeight: '800' }}>{cat.balance}</span> {typeof cat.balance === 'number' ? 'days' : ''}
            </div>
          </div>
        ))}
      </div>

      <div className="ems-card">
        <form onSubmit={handleSubmit}>
          <div className="grid-responsive-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  name="startDate"
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">End Date *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  name="endDate"
                  className="form-input"
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Duration Summary Pill */}
          {requestedDays > 0 && (
            <div
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isInsufficient ? 'var(--danger-50)' : 'var(--slate-50)',
                border: `1px solid ${isInsufficient ? 'var(--danger-100)' : 'var(--slate-200)'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.85rem', color: isInsufficient ? 'var(--danger-700)' : 'var(--slate-600)' }}>
                  Total Requested Duration:
                </span>
                <strong style={{ fontSize: '1.05rem', marginLeft: '8px', color: isInsufficient ? 'var(--danger-700)' : 'var(--slate-900)' }}>
                  {requestedDays} calendar day(s)
                </strong>
              </div>

              {isInsufficient ? (
                <span className="badge badge-danger">
                  Exceeds quota by {requestedDays - availableQuota} day(s)
                </span>
              ) : (
                <span className="badge badge-success">
                  Quota Available ({availableQuota - requestedDays} remaining after approval)
                </span>
              )}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Reason / Purpose for Absence *</label>
            <textarea
              name="reason"
              className="form-textarea"
              rows="4"
              placeholder="State the clear reason and handover arrangements for your requested leave..."
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/leaves/history')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || requestedDays <= 0 || isInsufficient}
              style={{ display: 'inline-flex', gap: '8px' }}
            >
              <CalendarPlus size={16} />
              <span>{loading ? 'Submitting Application...' : 'Submit Leave Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
  },
  categoryCard: {
    padding: '16px 18px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    boxShadow: 'var(--shadow-subtle)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  categoryCardActive: {
    borderColor: '#0f172a',
    backgroundColor: '#f8fafc',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  },
};

export default LeaveApply;
