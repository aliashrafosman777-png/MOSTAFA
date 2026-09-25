'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getMarketingConsent,
  HAS_VALID_META_PIXEL_ID,
  META_CONSENT_EVENT,
  META_PIXEL_ID,
  type MarketingConsent,
} from '@/lib/meta-pixel';

function prepareMetaQueue() {
  if (window.fbq) return;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue?.push(args);
    }
  } as NonNullable<Window['fbq']>;

  fbq.queue = [] as unknown[][];
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.push = fbq;
  window.fbq = fbq;
  window._fbq = fbq;
}

export default function MetaPixel() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<MarketingConsent | null>(null);
  const [queueReady, setQueueReady] = useState(false);
  const initialized = useRef(false);
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      setConsent(getMarketingConsent());
    }, 0);

    const updateConsent = (event: Event) => {
      setConsent((event as CustomEvent<MarketingConsent>).detail);
    };

    window.addEventListener(META_CONSENT_EVENT, updateConsent);
    return () => {
      window.clearTimeout(hydrationTimer);
      window.removeEventListener(META_CONSENT_EVENT, updateConsent);
    };
  }, []);

  useEffect(() => {
    if (consent !== 'accepted' || !HAS_VALID_META_PIXEL_ID) return;
    prepareMetaQueue();
    const readyTimer = window.setTimeout(() => setQueueReady(true), 0);
    return () => window.clearTimeout(readyTimer);
  }, [consent]);

  useEffect(() => {
    if (consent === 'declined' && initialized.current) {
      window.fbq?.('consent', 'revoke');
    }
  }, [consent]);

  const initializeAndTrack = useCallback(() => {
    if (!window.fbq || consent !== 'accepted' || pathname.startsWith('/admin')) {
      return;
    }

    if (!initialized.current) {
      window.fbq('init', META_PIXEL_ID);
      window.fbq('consent', 'grant');
      initialized.current = true;
    }

    if (lastTrackedPath.current !== pathname) {
      window.fbq('track', 'PageView');
      lastTrackedPath.current = pathname;
    }
  }, [consent, pathname]);

  useEffect(() => {
    if (initialized.current) initializeAndTrack();
  }, [initializeAndTrack]);

  if (!queueReady || consent !== 'accepted' || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <Script
      id="meta-pixel"
      src="https://connect.facebook.net/en_US/fbevents.js"
      strategy="lazyOnload"
      onLoad={initializeAndTrack}
      onReady={initializeAndTrack}
    />
  );
}
