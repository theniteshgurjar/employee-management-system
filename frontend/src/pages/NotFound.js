import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFound = () => {
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
            backgroundColor: 'var(--primary-50)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 0 0 8px rgba(59, 130, 246, 0.08)',
          }}
        >
          <Compass size={36} color="var(--primary-600)" />
        </div>

        <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '999px', backgroundColor: 'var(--slate-100)', color: 'var(--slate-700)', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Error 404 &bull; Page Not Found
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--slate-900)', marginBottom: '10px', letterSpacing: '-0.02em' }}>
          Lost in the enterprise system?
        </h1>

        <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '28px' }}>
          The URL you navigated to does not exist or may have been reorganized. Check your route or return to the management console.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link to="/dashboard" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px', padding: '10px 20px' }}>
            <Home size={16} />
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
