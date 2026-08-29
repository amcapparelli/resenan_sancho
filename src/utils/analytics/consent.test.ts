/**
 * Consent Mode v2 helper tests. `react-ga4` is mocked because `gtag` isn't
 * available in the JSDOM test environment (no real GA4 script loaded).
 */
jest.mock('react-ga4', () => ({
  __esModule: true,
  default: { gtag: jest.fn() },
}));

import ReactGA from 'react-ga4';
import {
  CONSENT_STORAGE_KEY,
  getStoredConsent,
  storeConsent,
  setDefaultConsent,
  updateConsent,
} from './consent';

const TWELVE_MONTHS_MS = 12 * 30 * 24 * 60 * 60 * 1000;

describe('consent', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  describe('getStoredConsent', () => {
    it('returns null when nothing is stored', () => {
      expect(getStoredConsent()).toBeNull();
    });

    it('returns the stored choice when it is recent', () => {
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({ choice: 'granted', timestamp: Date.now() }),
      );

      expect(getStoredConsent()).toBe('granted');
    });

    it('returns null when the stored choice has expired', () => {
      const expiredTimestamp = Date.now() - TWELVE_MONTHS_MS - 1;
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({ choice: 'denied', timestamp: expiredTimestamp }),
      );

      expect(getStoredConsent()).toBeNull();
    });

    it('returns null when the stored value is corrupted', () => {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, 'not-json');

      expect(getStoredConsent()).toBeNull();
    });
  });

  describe('storeConsent', () => {
    it('persists the choice with a timestamp', () => {
      storeConsent('granted');

      const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw as string);
      expect(parsed.choice).toBe('granted');
      expect(typeof parsed.timestamp).toBe('number');
    });
  });

  describe('setDefaultConsent', () => {
    it('sets analytics_storage and ad signals to denied by default', () => {
      setDefaultConsent();

      expect(ReactGA.gtag).toHaveBeenCalledWith('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    });
  });

  describe('updateConsent', () => {
    it('forwards the chosen consent value', () => {
      updateConsent('granted');

      expect(ReactGA.gtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'granted',
      });
    });
  });
});
