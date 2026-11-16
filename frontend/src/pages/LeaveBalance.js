import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Clock, CalendarPlus, CheckCircle2, AlertCircle, Info } from 'lucide-react';

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

  return (
    <div>
      <div className="ems-card-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="ems-card-title" style={{ fontSize: '1.5rem' }}>Annual Leave Quotas</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '4px' }}>
            Overview of your allotted, remaining, and utilized time-off balances for Year {balance?.year || new Date().getFullYear()}
          </p>
        </div>
        <Link to="/leaves/apply" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px' }}>
          <CalendarPlus size={18} />
          <span>Apply for Leave</span>
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>
          Loading leave balance quotas...
        </div>
      ) : balance ? (
        <>
          <div style={styles.grid}>
            {/* Casual Leave */}
            <div className="ems-card" style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Casual Leave (CL)</span>
                <span className="badge badge-primary">Annual Quota</span>
              </div>
              <div style={styles.cardNumber}>{balance.casualLeaveBalance}</div>
              <p style={styles.cardSub}>Days Remaining</p>
              <div style={styles.cardFooter}>
                Allotted: 12 days / year &bull; For short personal commitments
              </div>
            </div>

            {/* Sick Leave */}
            <div className="ems-card" style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Sick Leave (SL)</span>
                <span className="badge badge-success">Medical</span>
              </div>
              <div style={{ ...styles.cardNumber, color: 'var(--success-500)' }}>
                {balance.sickLeaveBalance}
              </div>
              <p style={styles.cardSub}>Days Remaining</p>
              <div style={styles.cardFooter}>
                Allotted: 10 days / year &bull; Medical recovery & appointments
              </div>
            </div>

            {/* Earned Leave */}
            <div className="ems-card" style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Earned Leave (EL)</span>
                <span className="badge badge-warning">Vacation</span>
              </div>
              <div style={{ ...styles.cardNumber, color: 'var(--warning-500)' }}>
                {balance.earnedLeaveBalance}
              </div>
              <p style={styles.cardSub}>Days Remaining</p>
              <div style={styles.cardFooter}>
                Allotted: 15 days / year &bull; Planned holidays & vacations
              </div>
            </div>

            {/* Unpaid Leave */}
            <div className="ems-card" style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Unpaid Leave</span>
                <span className="badge badge-danger">Loss of Pay</span>
              </div>
              <div style={{ ...styles.cardNumber, color: 'var(--gray-700)' }}>
                {balance.unpaidLeaveUsed}
              </div>
              <p style={styles.cardSub}>Days Utilized</p>
              <div style={styles.cardFooter}>
                No annual cap &bull; Deducted from monthly payroll
              </div>
            </div>
          </div>

          {/* Policy Notes */}
          <div className="ems-card" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Info size={18} color="var(--primary-600)" />
              <h2 style={{ fontSize: '1rem', fontWeight: '600' }}>Organizational Leave Rules & Guidelines</h2>
            </div>
            <ul style={{ paddingLeft: '20px', color: 'var(--gray-600)', fontSize: '0.875rem', lineHeight: 1.8 }}>
              <li>Leave applications must be submitted in advance whenever possible.</li>
              <li>Leave balances are dynamically deducted only upon manager or HR authorization.</li>
              <li>Cancelling an approved leave prior to its start date automatically restores your leave quota.</li>
              <li>Overlapping leave requests across the same date range are strictly prohibited by the system.</li>
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '24px',
    marginBottom: 0,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--gray-700)',
  },
  cardNumber: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'var(--primary-600)',
    lineHeight: 1,
  },
  cardSub: {
    fontSize: '0.8rem',
    color: 'var(--gray-500)',
    marginTop: '6px',
  },
  cardFooter: {
    marginTop: '18px',
    paddingTop: '14px',
    borderTop: '1px solid var(--gray-100)',
    fontSize: '0.75rem',
    color: 'var(--gray-500)',
  },
};

export default LeaveBalance;
