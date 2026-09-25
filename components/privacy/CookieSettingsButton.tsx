'use client';

import {
  HAS_VALID_META_PIXEL_ID,
  OPEN_COOKIE_SETTINGS_EVENT,
} from '@/lib/meta-pixel';

export default function CookieSettingsButton() {
  if (!HAS_VALID_META_PIXEL_ID) {
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
