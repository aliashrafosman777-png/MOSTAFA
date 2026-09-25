'use client';

import { OPEN_COOKIE_SETTINGS_EVENT } from '@/lib/meta-pixel';

export default function CookieSettingsButton() {
  if (!/^\d+$/.test(process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? '')) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
      className="text-xs text-sage transition-colors hover:text-white"
    >
      Cookie settings
    </button>
  );
}
