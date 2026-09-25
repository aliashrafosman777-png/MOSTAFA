'use client';

export const META_CONSENT_STORAGE_KEY = 'mostafa-marketing-consent';
export const META_CONSENT_EVENT = 'mostafa:marketing-consent';
export const OPEN_COOKIE_SETTINGS_EVENT = 'mostafa:open-cookie-settings';

export type MarketingConsent = 'accepted' | 'declined';

type MetaPixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  push?: MetaPixelFunction;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
    _fbq?: MetaPixelFunction;
  }

  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

export function getMarketingConsent(): MarketingConsent | null {
  if (typeof window === 'undefined') return null;

  if (navigator.globalPrivacyControl === true) return 'declined';

  const saved = window.localStorage.getItem(META_CONSENT_STORAGE_KEY);
  return saved === 'accepted' || saved === 'declined' ? saved : null;
}

export function saveMarketingConsent(choice: MarketingConsent) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(META_CONSENT_STORAGE_KEY, choice);
  window.dispatchEvent(
    new CustomEvent<MarketingConsent>(META_CONSENT_EVENT, { detail: choice })
  );
}

export function trackMetaEvent(
  eventName: 'Lead' | 'PageView' | 'ViewContent',
  parameters?: Record<string, string | number | boolean>
) {
  if (
    typeof window === 'undefined' ||
    getMarketingConsent() !== 'accepted' ||
    !window.fbq
  ) {
    return;
  }

  window.fbq('track', eventName, parameters);
}
