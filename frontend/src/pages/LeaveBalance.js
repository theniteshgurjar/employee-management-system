import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CalendarPlus, AlertCircle, Info } from 'lucide-react';

const LeaveBalance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      try {
        const res = await api.get('/leaves/my-balance');
        setBalance(res.data.data);
      } catch (err) {
        setError('Failed to load leave balance quotas.');
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, []);

  const quotas = [
    {
      title: 'Casual Leave (CL)',
      total: 12,
      remaining: balance?.casualLeaveBalance ?? 12,
      color: '#0f172a',
      badge: 'Short Notice',
      desc: 'Allotted for urgent personal tasks, family matters, or sudden short absences.',
    },
    {
      title: 'Sick Leave (SL)',
      total: 10,
      remaining: balance?.sickLeaveBalance ?? 10,
      color: '#0f172a',
      badge: 'Medical',
      desc: 'Dedicated quota for medical illness, recovery, and healthcare appointments.',
    },
    {
      title: 'Earned Leave (EL)',
      total: 15,
      remaining: balance?.earnedLeaveBalance ?? 15,
      color: '#0f172a',
      badge: 'Annual Vacation',
      desc: 'Allotted for planned rest, extended travel, and annual vacations.',
    },
    {
      title: 'Unpaid Leave (LWP)',
      total: 'Uncapped',
      remaining: balance?.unpaidLeaveUsed ?? 0,
      color: '#475569',
      badge: 'Loss of Pay',
      isUnpaid: true,
      desc: 'Leave without pay taken beyond standard quotas, deducted from monthly payroll.',
    },
  ];

  return (
    <div>
      <div className="ems-card-header">
        <div>
          <h1 className="ems-card-title">Annual Leave Balances</h1>
          <p className="ems-card-subtitle">
            Live tracker of remaining time-off quotas, utilized allocations, and corporate policies for Year {balance?.year || new Date().getFullYear()}
          </p>
        </div>
        <Link to="/leaves/apply" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px' }}>
          <CalendarPlus size={18} />
          <span>Apply for Time Off</span>
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--slate-500)' }}>
          Loading your leave balance records...
        </div>
      ) : balance ? (
        <>
          <div style={styles.grid}>
            {quotas.map((q, idx) => {
              const used = typeof q.total === 'number' ? q.total - q.remaining : q.remaining;
              const percent = typeof q.total === 'number' ? Math.round((q.remaining / q.total) * 100) : null;

              return (
                <div key={idx} className="ems-card ems-card-hover" style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div>
                      <span style={styles.cardTitle}>{q.title}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '2px' }}>
                        {q.badge}
                      </div>
                    </div>
                    <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                      {q.isUnpaid ? 'Days Taken' : `${used} days used`}
                    </span>
                  </div>

                  <div style={{ margin: '16px 0 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: '800', color: q.color, letterSpacing: '-0.03em' }}>
                        {q.remaining}
                      </span>
                      <span style={{ fontSize: '1rem', color: 'var(--slate-500)', fontWeight: '600' }}>
                        {q.isUnpaid ? 'days used' : `/ ${q.total} days`}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {!q.isUnpaid && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--slate-500)', marginBottom: '5px' }}>
                        <span>Remaining Quota</span>
                        <span>{percent}% available</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--slate-100)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            backgroundColor: '#0f172a',
                            width: `${percent}%`,
                            borderRadius: '999px',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <p style={{ fontSize: '0.825rem', color: 'var(--slate-600)', lineHeight: 1.5, marginTop: 'auto' }}>
                    {q.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Corporate Policy Card */}
          <div className="ems-card" style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ padding: '6px', backgroundColor: 'var(--primary-50)', borderRadius: '8px' }}>
                <Info size={18} color="var(--primary-600)" />
              </div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--slate-900)' }}>
                Enterprise Leave Administration Rules
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
              <div style={styles.policyItem}>
                <strong>Automatic Balance Deduction:</strong>
                <span>Quotas are reserved and deducted from your balance immediately upon supervisor or HR approval.</span>
              </div>
              <div style={styles.policyItem}>
                <strong>Safe Cancellation & Restoration:</strong>
                <span>Cancelling a leave before its start date automatically restores the full quota back to your balance.</span>
              </div>
              <div style={styles.policyItem}>
                <strong>Overlap Prevention:</strong>
                <span>The system automatically blocks overlapping time-off applications to prevent duplicate calendar claims.</span>
              </div>
              <div style={styles.policyItem}>
                <strong>Annual Reset & Rollover:</strong>
                <span>Balances are initialized on January 1st of each calendar year.</span>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    marginBottom: 0,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--slate-900)',
  },
  policyItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '14px',
    backgroundColor: 'var(--slate-50)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--slate-200)',
  },
};

export default LeaveBalance;
