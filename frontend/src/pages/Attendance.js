import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText,
  UserCheck,
} from 'lucide-react';

const Attendance = () => {
  const { hasAnyRole } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

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
      // handled
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
  }, []);

  const handleCheckIn = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/attendance/check-in', { remarks });
      setTodayAttendance(res.data.data);
      setMessage({ type: 'success', text: 'Checked in successfully!' });
      setRemarks('');
      fetchAttendanceData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Check-in failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/attendance/check-out', { remarks });
      setTodayAttendance(res.data.data);
      setMessage({ type: 'success', text: 'Checked out successfully!' });
      setRemarks('');
      fetchAttendanceData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Check-out failed' });
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
      <div className="ems-card-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="ems-card-title" style={{ fontSize: '1.5rem' }}>Attendance Portal</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '4px' }}>
            Track daily work hours, check-in timestamps, and view historical compliance logs
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
              Company Daily Roster
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
          {/* Punch Clock Card */}
          <div className="ems-card">
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '14px' }}>
              Today's Punch Status ({new Date().toLocaleDateString()})
            </h2>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={styles.clockBox}>
                <Clock size={28} color="var(--primary-600)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase' }}>
                    Current Status
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                    {!todayAttendance
                      ? 'Not Checked In'
                      : !todayAttendance.checkOutTime
                      ? 'Checked In (Active)'
                      : 'Completed Workday'}
                  </div>
                </div>
              </div>

              {todayAttendance && (
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={styles.timeTag}>
                    <span>Check-In:</span>
                    <strong>{todayAttendance.checkInTime}</strong>
                  </div>
                  {todayAttendance.checkOutTime && (
                    <div style={styles.timeTag}>
                      <span>Check-Out:</span>
                      <strong>{todayAttendance.checkOutTime}</strong>
                    </div>
                  )}
                  {todayAttendance.workingHours != null && (
                    <div style={styles.timeTag}>
                      <span>Hours Logged:</span>
                      <strong>{todayAttendance.workingHours} hrs</strong>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Check-in / Check-out actions */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="form-input"
                style={{ maxWidth: '360px' }}
                placeholder="Optional remarks (e.g. WFH, client meeting)..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={loading || (todayAttendance && !!todayAttendance.checkOutTime)}
              />

              {!todayAttendance ? (
                <button
                  onClick={handleCheckIn}
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', gap: '6px' }}
                >
                  <Clock size={16} />
                  <span>{loading ? 'Processing...' : 'Punch In Now'}</span>
                </button>
              ) : !todayAttendance.checkOutTime ? (
                <button
                  onClick={handleCheckOut}
                  disabled={loading}
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', gap: '6px' }}
                >
                  <Clock size={16} />
                  <span>{loading ? 'Processing...' : 'Punch Out Now'}</span>
                </button>
              ) : (
                <span className="badge badge-success">Workday Attendance Recorded</span>
              )}
            </div>
          </div>

          {/* Historical Logs Table */}
          <div className="ems-card" style={{ padding: 0 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray-200)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>My Attendance History</h2>
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
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-500)' }}>
                        No attendance records yet.
                      </td>
                    </tr>
                  ) : (
                    history.map((att) => (
                      <tr key={att.id}>
                        <td style={{ fontWeight: '600' }}>{att.attendanceDate}</td>
                        <td>{att.checkInTime || '—'}</td>
                        <td>{att.checkOutTime || '—'}</td>
                        <td style={{ fontWeight: '600' }}>{att.workingHours != null ? `${att.workingHours} hrs` : 'In Progress'}</td>
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
                            {att.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--gray-600)' }}>{att.remarks || '—'}</td>
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
              borderBottom: '1px solid var(--gray-200)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Company Attendance Roster</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                Inspect daily attendance logs across all departments
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--gray-500)" />
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
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-500)' }}>
                      No attendance logged for {selectedDate}.
                    </td>
                  </tr>
                ) : (
                  dailyRoster.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: '600', color: 'var(--primary-700)' }}>{item.employeeCode}</td>
                      <td style={{ fontWeight: '600' }}>{item.employeeName}</td>
                      <td>{item.checkInTime || '—'}</td>
                      <td>{item.checkOutTime || '—'}</td>
                      <td>{item.workingHours != null ? `${item.workingHours} hrs` : 'In Progress'}</td>
                      <td>
                        <span className={`badge ${item.status === 'PRESENT' ? 'badge-success' : 'badge-warning'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--gray-600)' }}>{item.remarks || '—'}</td>
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
  clockBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 18px',
    backgroundColor: 'var(--primary-50)',
    borderRadius: '10px',
  },
  timeTag: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 14px',
    borderRadius: '8px',
    backgroundColor: 'var(--gray-100)',
    fontSize: '0.85rem',
  },
};

export default Attendance;
