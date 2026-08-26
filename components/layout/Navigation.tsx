'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks, navLinksRight } from '@/content/site';
import { EASE_OUT_EXPO } from '@/lib/motion';

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => document.body.classList.remove('menu-open');
  }, [isMobileMenuOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    },
    [isMobileMenuOpen]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const allLinks = [...navLinks, ...navLinksRight];

  return (
    <>
      {/* ─── Floating Capsule Navbar ─── */}
      <header
        className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-500 ${
          isScrolled
            ? 'top-3 w-[95%] max-w-[1240px]'
            : 'top-6 w-[92%] max-w-[1180px]'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
      >
        <nav
          className={`flex items-center transition-all duration-500 rounded-full border backdrop-blur-[25px] backdrop-saturate-[180%] ${
            isScrolled
              ? 'px-5 md:px-7 py-2 md:py-2.5 bg-carbon/75 border-white/8 shadow-[0_15px_35px_rgba(0,0,0,0.3)]'
              : 'px-6 md:px-9 py-2.5 md:py-3 bg-carbon/55 border-white/12 shadow-[0_20px_45px_rgba(2,5,4,0.2)]'
          }`}
          style={{
            transitionTimingFunction: 'var(--ease-out-expo)',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
          }}
          aria-label="Main navigation"
        >
          {/* Left Group: Home, Work, Services */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link-capsule relative text-[0.72rem] font-semibold tracking-[0.12em] uppercase py-1 transition-colors duration-300 ${
                  isActive(link.href)
                    ? 'text-white'
                    : 'text-ivory/75 hover:text-white'
                }`}
                {...(isActive(link.href) && { 'aria-current': 'page' as const })}
              >
                {link.label}
                {/* Animated underline */}
                <span
                  className={`absolute bottom-[-2px] left-0 h-[1px] bg-runway transition-all duration-400 ease-[var(--ease-out-expo)] ${
                    isActive(link.href)
                      ? 'w-full'
                      : 'w-0 group-hover:w-full'
                  }`}
                  style={{
                    transitionProperty: 'width',
                  }}
                />
              </Link>
            ))}
          </div>

          {/* Center: Large Wordmark Logo */}
          <Link
            href="/"
            className="flex items-center justify-center"
            aria-label="Mostafa Ahmed — Home"
          >
            <Image
              src="/assets/brand/mostafa-logo-nav.png"
              alt="Mostafa Ahmed"
              width={754}
              height={242}
              className="h-10 md:h-12 w-auto"
              style={{ width: 'auto', height: undefined }}
              sizes="250px"
              priority
            />
          </Link>

          {/* Right Group: About, Contact (CTA) */}
          <div className="hidden lg:flex items-center gap-7 justify-end">
            <Link
              href="/about"
              className={`nav-link-capsule relative text-[0.72rem] font-semibold tracking-[0.12em] uppercase py-1 transition-colors duration-300 ${
                isActive('/about')
                  ? 'text-white'
                  : 'text-ivory/75 hover:text-white'
              }`}
              {...(isActive('/about') && { 'aria-current': 'page' as const })}
            >
              About
              <span
                className={`absolute bottom-[-2px] left-0 h-[1px] bg-runway transition-all duration-400 ease-[var(--ease-out-expo)] ${
                  isActive('/about') ? 'w-full' : 'w-0'
                }`}
              />
            </Link>
            <Link
              href="/contact"
              className={`text-[0.72rem] font-semibold tracking-[0.12em] uppercase px-4 py-1.5 border rounded-sm transition-all duration-300 ${
                isActive('/contact')
                  ? 'border-runway/60 text-runway bg-runway/10'
                  : 'border-runway/30 text-runway/90 hover:border-runway/50 hover:bg-runway/5'
              }`}
              {...(isActive('/contact') && { 'aria-current': 'page' as const })}
            >
              Contact
            </Link>
          </div>

          {/* Mobile: Hamburger Toggle */}
          <div className="lg:hidden flex justify-end">
            <button
              className="p-2 -mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="w-6 flex flex-col gap-[5px]">
                <span
                  className={`block h-[1.5px] bg-white transition-all duration-300 origin-center ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                  }`}
                />
                <span
                  className={`block h-[1.5px] bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''
                  }`}
                />
                <span
                  className={`block h-[1.5px] bg-white transition-all duration-300 origin-center ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* ─── Full-screen Mobile Menu ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            id="mobile-menu"
            className="fixed inset-0 z-40 bg-flight-950 flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            role="dialog"
            aria-label="Mobile navigation"
          >
            {allLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + i * 0.1,
                  ease: EASE_OUT_EXPO,
                }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-3xl font-semibold transition-colors duration-300 ${
                    isActive(link.href)
                      ? 'text-runway'
                      : 'text-white hover:text-runway'
                  }`}
                  {...(isActive(link.href) && { 'aria-current': 'page' as const })}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
