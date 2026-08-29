import ReactGA from 'react-ga4';

export type ConsentChoice = 'granted' | 'denied';

export const CONSENT_STORAGE_KEY = 'ga_consent';

// 12 months, expressed in milliseconds, matches the product requirement to
// re-ask for consent once a year.
const CONSENT_MAX_AGE_MS = 12 * 30 * 24 * 60 * 60 * 1000;

interface StoredConsent {
  choice: ConsentChoice;
  timestamp: number;
}

const isConsentChoice = (value: unknown): value is ConsentChoice => (
  value === 'granted' || value === 'denied'
);

const isStoredConsent = (value: unknown): value is StoredConsent => (
  typeof value === 'object'
  && value !== null
  && isConsentChoice((value as StoredConsent).choice)
  && typeof (value as StoredConsent).timestamp === 'number'
);

/**
 * Reads the user's previously stored consent choice, if any.
 *
 * Returns `null` when there is nothing stored, the value is malformed, or the
 * choice has expired (older than 12 months) — all three cases mean "ask
 * again". Wrapped in try/catch because `localStorage` can throw (Safari
 * private mode, SSR where `window` is undefined, disabled storage, etc.).
 */
export const getStoredConsent = (): ConsentChoice | null => {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isStoredConsent(parsed)) return null;

    const hasExpired = Date.now() - parsed.timestamp > CONSENT_MAX_AGE_MS;
    if (hasExpired) return null;

    return parsed.choice;
  } catch {
    return null;
  }
};

/** Persists the user's choice. Silently no-ops if storage is unavailable. */
export const storeConsent = (choice: ConsentChoice): void => {
  try {
    const stored: StoredConsent = { choice, timestamp: Date.now() };
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Ignore: worst case we ask the user again next visit.
  }
};

/**
 * Sets the Consent Mode v2 default state to "denied" for every signal Google
 * checks. Must run before `ReactGA.initialize()` so GA4 never fires with
 * storage access before the user has made a choice. We only use analytics,
 * not ads, but Consent Mode v2 requires all four fields to be present for the
 * mode to apply correctly.
 */
export const setDefaultConsent = (): void => {
  ReactGA.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
};

/** Updates the live consent state after the user accepts or declines. */
export const updateConsent = (choice: ConsentChoice): void => {
  ReactGA.gtag('consent', 'update', {
    analytics_storage: choice,
  });
};
