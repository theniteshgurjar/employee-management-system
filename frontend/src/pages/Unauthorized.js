import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ display: 'inline-flex', padding: '20px', borderRadius: '50%', backgroundColor: 'var(--danger-50)', marginBottom: '20px' }}>
        <ShieldAlert size={48} color="var(--danger-500)" />
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>403 - Access Denied</h1>
      <p style={{ color: 'var(--gray-500)', maxWidth: '480px', margin: '0 auto 24px' }}>
        You do not have the required role privileges to access this resource. Please contact your system administrator if you believe this is in error.
      </p>
      <Link to="/dashboard" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px' }}>
        <ArrowLeft size={16} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default Unauthorized;
