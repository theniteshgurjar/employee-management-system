import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ display: 'inline-flex', padding: '20px', borderRadius: '50%', backgroundColor: 'var(--warning-50)', marginBottom: '20px' }}>
        <AlertTriangle size={48} color="var(--warning-500)" />
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--gray-500)', marginBottom: '24px' }}>
        The page you are looking for does not exist or has been relocated.
      </p>
      <Link to="/dashboard" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px' }}>
        <ArrowLeft size={16} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFound;
