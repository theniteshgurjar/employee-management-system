import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div
        className="ems-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          padding: '48px 36px',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-card-hover)',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            backgroundColor: 'var(--danger-50)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 0 0 8px rgba(239, 68, 68, 0.08)',
          }}
        >
          <ShieldAlert size={36} color="var(--danger-600)" />
        </div>

        <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '999px', backgroundColor: 'var(--danger-50)', color: 'var(--danger-700)', border: '1px solid var(--danger-100)', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Error 403 &bull; Authorization Required
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--slate-900)', marginBottom: '10px', letterSpacing: '-0.02em' }}>
          Restricted Security Zone
        </h1>

        <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '28px' }}>
          Your active account does not have sufficient RBAC privilege scopes to access this area. If you believe this is an error, please contact your System Administrator.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link to="/dashboard" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px', padding: '10px 20px' }}>
            <Home size={16} />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
