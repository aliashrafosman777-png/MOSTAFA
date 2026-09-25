'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  getMarketingConsent,
  OPEN_COOKIE_SETTINGS_EVENT,
  saveMarketingConsent,
  type MarketingConsent,
} from '@/lib/meta-pixel';

const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? '';
const hasValidPixelId = /^\d+$/.test(pixelId);

export default function CookieConsent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      setVisible(getMarketingConsent() === null);
    }, 0);

    const openSettings = () => setVisible(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    return () => {
      window.clearTimeout(hydrationTimer);
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    };
  }, []);

  if (!hasValidPixelId || pathname.startsWith('/admin') || !visible) return null;

  const choose = (choice: MarketingConsent) => {
    saveMarketingConsent(choice);
    setVisible(false);
  };

  return (
    <section
      aria-label="Cookie preferences"
      className="fixed inset-x-4 bottom-4 z-[10000] mx-auto max-w-3xl rounded-sm border border-line bg-obsidian/95 p-5 shadow-2xl backdrop-blur-md sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h2 className="mb-2 text-sm font-semibold text-white">Your privacy, your choice</h2>
          <p className="text-sm leading-relaxed text-mist">
            We use an optional Meta Pixel to understand visits and successful enquiries.
            It stays off unless you accept marketing cookies.{' '}
            <Link href="/privacy" className="text-runway underline underline-offset-4">
              Privacy details
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={() => choose('declined')}
            className="rounded-sm border border-line px-4 py-2.5 text-sm text-mist transition-colors hover:border-mist/50 hover:text-white"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className="rounded-sm bg-white px-4 py-2.5 text-sm font-semibold text-carbon transition-colors hover:bg-ivory"
          >
            Accept
          </button>
        </div>
      </div>
    </section>
  );
}
