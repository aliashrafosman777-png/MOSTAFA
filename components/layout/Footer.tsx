import Link from 'next/link';
import Image from 'next/image';
import { siteConfig, navLinks, navLinksRight } from '@/content/site';
import CookieSettingsButton from '@/components/privacy/CookieSettingsButton';

export default function Footer() {
  const allLinks = [...navLinks, ...navLinksRight];

  return (
    <footer
      className="border-t border-line bg-carbon"
      role="contentinfo"
    >
      <div className="container-site py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <Link href="/" aria-label="Mostafa Ahmed — Home">
              <Image
                src="/assets/brand/mostafa-logo-nav.png"
                alt="Mostafa Ahmed"
                width={754}
                height={242}
                className="h-8 mb-6"
                style={{ width: 'auto' }}
              />
            </Link>
            <p className="text-mist text-sm leading-relaxed max-w-xs">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3">
            <h3 className="text-label mb-6">Navigation</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {allLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-mist hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-16 pt-8 border-t border-line flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-sage">
            © {new Date().getFullYear()} Mostafa Ahmed. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-sage transition-colors hover:text-white"
            >
              Privacy &amp; cookies
            </Link>
            <CookieSettingsButton />
            <a
              href="https://www.facebook.com/Mostafatourism1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-sage hover:text-white transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/mostafa-ahmed-aa8752137/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-sage hover:text-white transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
