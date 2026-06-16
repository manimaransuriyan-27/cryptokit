// apps/web/src/components/cookie-banner/cookie-banner.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getConsent, saveConsent } from '@/lib/consent';

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only if no decision has been made yet
    if (!getConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    saveConsent(true, false); // analytics: true when you add GA
    setVisible(false);
    // TODO: initialize GA here when you add it
    // initGoogleAnalytics();
  };

  const handleReject = () => {
    saveConsent(false, false); // necessary cookies still set on login — that's correct
    setVisible(false);
    // analytics scripts are simply never loaded
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--color-background-primary)',
        borderTop: '0.5px solid var(--color-border-secondary)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        zIndex: 9999,
        flexWrap: 'wrap',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          flex: 1,
        }}
      >
        We use strictly necessary cookies for authentication. With your consent,
        we also use analytics cookies to improve the platform.{' '}
        <Link to="/cookies" style={{ color: 'var(--color-text-info)' }}>
          Cookie Policy
        </Link>
        {' · '}
        <Link to="/privacy" style={{ color: 'var(--color-text-info)' }}>
          Privacy Policy
        </Link>
      </p>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={handleReject}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            cursor: 'pointer',
            border: '0.5px solid var(--color-border-secondary)',
            borderRadius: 'var(--border-radius-md)',
            background: 'transparent',
            color: 'var(--color-text-secondary)',
          }}
        >
          Reject non-essential
        </button>
        <button
          onClick={handleAccept}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            cursor: 'pointer',
            border: '0.5px solid var(--color-border-info)',
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--color-background-info)',
            color: 'var(--color-text-info)',
          }}
        >
          Accept all
        </button>
      </div>
    </div>
  );
};
