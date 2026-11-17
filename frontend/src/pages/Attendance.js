import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';

const Attendance = () => {
  const { hasAnyRole } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [liveSeconds, setLiveSeconds] = useState(0);

  // HR Daily View
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyRoster, setDailyRoster] = useState([]);
  const [activeTab, setActiveTab] = useState('my-attendance');

  const fetchAttendanceData = async () => {
    try {
      const [todayRes, historyRes] = await Promise.all([
        api.get('/attendance/today'),
        api.get('/attendance/my-history'),
      ]);
      setTodayAttendance(todayRes.data.data);
      setHistory(historyRes.data.data);
    } catch (err) {
      // not checked in yet
    }
  };

  const fetchDailyRoster = async (date) => {
    try {
      const res = await api.get(`/attendance/daily?date=${date}`);
      setDailyRoster(res.data.data);
    } catch (err) {
      // handled
    }
  };

  useEffect(() => {
    fetchAttendanceData();
    if (hasAnyRole(['ADMIN', 'HR'])) {
      fetchDailyRoster(selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live stopwatch when checked in and not checked out yet
  useEffect(() => {
    let interval = null;
    if (todayAttendance && todayAttendance.checkInTime && !todayAttendance.checkOutTime) {
      interval = setInterval(() => {
        const [h, m, s] = todayAttendance.checkInTime.split(':').map(Number);
        const checkInDate = new Date();
        checkInDate.setHours(h, m, s || 0);

        const diffSeconds = Math.max(0, Math.floor((new Date() - checkInDate) / 1000));
        setLiveSeconds(diffSeconds);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [todayAttendance]);

  const formatStopwatch = (totalSec) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleCheckIn = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/attendance/check-in', { remarks });
      setTodayAttendance(res.data.data);
      setMessage({ type: 'success', text: 'Checked in successfully for today!' });
      setRemarks('');
      fetchAttendanceData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Check-in failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!window.confirm('Confirm clock out for today? Total hours will be computed.')) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/attendance/check-out', { remarks });
      setTodayAttendance(res.data.data);
      setMessage({ type: 'success', text: 'Checked out successfully! Working hours recorded.' });
      setRemarks('');
      fetchAttendanceData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Check-out failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    fetchDailyRoster(newDate);
  };

  return (
    <div>
      {/* Header */}
      <div className="ems-card-header">
        <div>
          <h1 className="ems-card-title">Attendance & Timecard</h1>
          <p className="ems-card-subtitle">
            Record working hours, monitor daily compliance, and review historical shifts
          </p>
        </div>

        {hasAnyRole(['ADMIN', 'HR']) && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-sm ${activeTab === 'my-attendance' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('my-attendance')}
            >
              My Attendance
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'company-roster' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('company-roster')}
            >
              Company Roster
            </button>
          </div>
        )}
      </div>

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {activeTab === 'my-attendance' ? (
        <>
          {/* Punch Hero Card */}
          <div className="ems-card" style={styles.punchHero}>
            <div style={styles.punchHeroLeft}>
              <div style={styles.statusChip}>
                <span className="badge-dot live-pulse" style={{ backgroundColor: !todayAttendance ? '#94a3b8' : !todayAttendance.checkOutTime ? '#10b981' : '#3b82f6' }} />
                <span>
                  {!todayAttendance
                    ? 'Shift Not Started'
                    : !todayAttendance.checkOutTime
                    ? 'Active Shift in Progress'
                    : 'Shift Completed & Logged'}
                </span>
              </div>

              {/* Digital Stopwatch Timer */}
              {todayAttendance && !todayAttendance.checkOutTime && (
                <div style={styles.stopwatchContainer}>
                  <div style={styles.stopwatchLabel}>Active Working Timer</div>
                  <div style={styles.stopwatchDigits}>{formatStopwatch(liveSeconds)}</div>
                </div>
              )}

              {todayAttendance?.checkOutTime && (
                <div style={styles.stopwatchContainer}>
                  <div style={styles.stopwatchLabel}>Total Workday Duration</div>
                  <div style={{ ...styles.stopwatchDigits, color: 'var(--success-600)' }}>
                    {todayAttendance.workingHours} Hours Logged
                  </div>
                </div>
              )}

              <div style={styles.timestampsRow}>
                <div style={styles.timestampCard}>
                  <span style={styles.tsLabel}>Punch In Time</span>
                  <strong style={styles.tsValue}>{todayAttendance?.checkInTime || '—:—'}</strong>
                </div>
                <div style={styles.timestampCard}>
                  <span style={styles.tsLabel}>Punch Out Time</span>
                  <strong style={styles.tsValue}>{todayAttendance?.checkOutTime || '—:—'}</strong>
                </div>
                <div style={styles.timestampCard}>
                  <span style={styles.tsLabel}>Shift Classification</span>
                  <strong style={{ ...styles.tsValue, color: 'var(--primary-600)' }}>
                    {todayAttendance?.status || 'STANDARD'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Punch Action Box */}
            <div style={styles.punchHeroRight}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '10px' }}>
                Quick Action Panel
              </h3>
              <input
                type="text"
                className="form-input"
                placeholder="Optional shift notes (e.g. Remote, client site)..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={loading || (todayAttendance && !!todayAttendance.checkOutTime)}
                style={{ marginBottom: '14px' }}
              />

              {!todayAttendance ? (
                <button
                  onClick={handleCheckIn}
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', gap: '10px', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35)' }}
                >
                  <Clock size={20} />
                  <span>{loading ? 'Recording Punch In...' : 'Punch In (Start Shift)'}</span>
                </button>
              ) : !todayAttendance.checkOutTime ? (
                <button
                  onClick={handleCheckOut}
                  disabled={loading}
                  className="btn btn-danger btn-lg"
                  style={{ width: '100%', gap: '10px' }}
                >
                  <Clock size={20} />
                  <span>{loading ? 'Recording Punch Out...' : 'Punch Out (End Shift)'}</span>
                </button>
              ) : (
                <div style={styles.completeBox}>
                  <CheckCircle2 size={24} color="#10b981" />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Attendance Complete</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      Total logged: {todayAttendance.workingHours} hrs
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Historical Logs Table */}
          <div className="ems-card" style={{ padding: 0 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--slate-900)' }}>
                  Personal Shift History
                </h2>
                <span style={{ fontSize: '0.825rem', color: 'var(--slate-500)' }}>
                  Showing your recent punch records and computed working duration
                </span>
              </div>
              <span className="badge badge-neutral">{history.length} Records</span>
            </div>

            <div className="table-container">
              <table className="ems-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Punch In</th>
                    <th>Punch Out</th>
                    <th>Working Hours</th>
                    <th>Status</th>
                    <th>Notes & Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-500)' }}>
                        No historical attendance logged yet.
                      </td>
                    </tr>
                  ) : (
                    history.map((att) => (
                      <tr key={att.id}>
                        <td style={{ fontWeight: '600', color: 'var(--slate-900)' }}>{att.attendanceDate}</td>
                        <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>{att.checkInTime || '—'}</td>
                        <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>{att.checkOutTime || '—'}</td>
                        <td>
                          <strong style={{ color: att.workingHours ? 'var(--slate-900)' : 'var(--primary-600)' }}>
                            {att.workingHours != null ? `${att.workingHours} hrs` : 'In Progress'}
                          </strong>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              att.status === 'PRESENT'
                                ? 'badge-success'
                                : att.status === 'HALF_DAY'
                                ? 'badge-warning'
                                : 'badge-danger'
                            }`}
                          >
                            <span className="badge-dot" />
                            {att.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--slate-600)' }}>{att.remarks || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Company Daily Attendance Roster (Admin / HR) */
        <div className="ems-card" style={{ padding: 0 }}>
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--slate-200)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--slate-900)' }}>
                Company-Wide Attendance Roster
              </h2>
              <span style={{ fontSize: '0.825rem', color: 'var(--slate-500)' }}>
                Audit employee punch-in records for any calendar day
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--slate-500)" />
              <input
                type="date"
                className="form-input"
                style={{ width: 'auto' }}
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="ems-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Employee Name</th>
                  <th>Punch In</th>
                  <th>Punch Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {dailyRoster.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-500)' }}>
                      No attendance records logged for {selectedDate}.
                    </td>
                  </tr>
                ) : (
                  dailyRoster.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: '600', color: 'var(--primary-700)', fontFamily: "'JetBrains Mono', monospace" }}>
                        {item.employeeCode}
                      </td>
                      <td style={{ fontWeight: '600' }}>{item.employeeName}</td>
                      <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>{item.checkInTime || '—'}</td>
                      <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>{item.checkOutTime || '—'}</td>
                      <td>
                        <strong>{item.workingHours != null ? `${item.workingHours} hrs` : 'In Progress'}</strong>
                      </td>
                      <td>
                        <span className={`badge ${item.status === 'PRESENT' ? 'badge-success' : 'badge-warning'}`}>
                          <span className="badge-dot" />
                          {item.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--slate-600)' }}>{item.remarks || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  punchHero: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    padding: '20px 22px',
    backgroundColor: '#ffffff',
  },
  punchHeroLeft: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  statusChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.825rem',
    fontWeight: '700',
    color: 'var(--slate-700)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '16px',
  },
  stopwatchContainer: {
    marginBottom: '20px',
  },
  stopwatchLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--slate-500)',
  },
  stopwatchDigits: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.02em',
    marginTop: '4px',
  },
  timestampsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
    gap: '10px',
  },
  timestampCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 14px',
    backgroundColor: 'var(--slate-50)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--slate-200)',
  },
  tsLabel: {
    fontSize: '0.7rem',
    color: 'var(--slate-500)',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tsValue: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--slate-800)',
    marginTop: '4px',
  },
  punchHeroRight: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '24px',
    backgroundColor: 'var(--slate-50)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--slate-200)',
  },
  completeBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--slate-200)',
  },
};

export default Attendance;
