export type ConsentState = {
  necessary: true; // always true, cannot be rejected
  analytics: boolean;
  marketing: boolean;
  decidedAt: string; // ISO timestamp (legal requirement — you need to record WHEN)
  version: string; // bump this when your policy changes → forces re-consent
};

const CONSENT_KEY = 'cryptokit_consent';
const CONSENT_VERSION = '1.0'; // bump when privacy policy changes

export const getConsent = (): ConsentState | null => {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed: ConsentState = JSON.parse(raw);
    // If policy version changed, force re-consent
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveConsent = (analytics: boolean, marketing: boolean) => {
  const state: ConsentState = {
    necessary: true,
    analytics,
    marketing,
    decidedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  return state;
};

export const revokeConsent = () => {
  localStorage.removeItem(CONSENT_KEY);
};
