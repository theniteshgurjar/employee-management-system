import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CalendarPlus, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

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

    try {
      await api.post('/leaves/apply', formData);
      setSuccess('Leave application submitted successfully! Redirecting to history...');
      setTimeout(() => {
        navigate('/leaves/history');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div className="ems-card-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="ems-card-title" style={{ fontSize: '1.5rem' }}>Apply for Leave</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '4px' }}>
            Submit a formal time-off request with automatic balance deduction upon approval
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

      {/* Available Balance Overview */}
      {balance && (
        <div className="ems-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-700)' }}>
              Current Available Quota ({balance.year}):
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="badge badge-primary">Casual: {balance.casualLeaveBalance}</span>
              <span className="badge badge-primary">Sick: {balance.sickLeaveBalance}</span>
              <span className="badge badge-primary">Earned: {balance.earnedLeaveBalance}</span>
            </div>
          </div>
        </div>
      )}

      <div className="ems-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Leave Category *</label>
            <select
              name="leaveType"
              className="form-select"
              value={formData.leaveType}
              onChange={handleChange}
              required
            >
              <option value="CASUAL">Casual Leave (Short notice, personal affairs)</option>
              <option value="SICK">Sick Leave (Medical & health recovery)</option>
              <option value="EARNED">Earned Leave (Planned vacation / annual quota)</option>
              <option value="UNPAID">Unpaid Leave (Loss of pay)</option>
            </select>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '6px' }}>
              Available in category: <strong>{getAvailableForType(formData.leaveType)}</strong> days
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Start Date *</label>
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

            <div className="form-group">
              <label className="form-label">End Date *</label>
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

          {requestedDays > 0 && (
            <div style={{ marginBottom: '16px', padding: '10px 14px', backgroundColor: 'var(--gray-100)', borderRadius: '8px', fontSize: '0.875rem' }}>
              Total Leave Duration: <strong>{requestedDays} day(s)</strong>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Reason / Notes *</label>
            <textarea
              name="reason"
              className="form-textarea"
              rows="4"
              placeholder="State the reason for your time-off request..."
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
              disabled={loading || requestedDays <= 0}
              style={{ display: 'inline-flex', gap: '8px' }}
            >
              <CalendarPlus size={16} />
              <span>{loading ? 'Submitting...' : 'Submit Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveApply;
