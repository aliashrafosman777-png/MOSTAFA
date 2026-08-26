import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'Mostafa Ahmed',
  title: 'Mostafa Ahmed — Marketing Travel Consultant',
  description:
    'Mostafa Ahmed helps airlines, GSAs, travel agencies, and B2B travel platforms turn complex offers into clear, premium brand experiences through travel marketing, campaign creative, event execution, media production, and exhibition work.',
  tagline: 'Marketing that goes beyond borders and skies.',
  role: 'Founder and Marketing Travel Consultant',
  phone: null,
  email: 'admin@MostafaAhmed.com',
  whatsappEnabled: false,
  socialLinks: null,
  domain: 'mostafaconsultant.com',
  analyticsId: null,
  contactProvider: 'resend',
  legalName: null,
};

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
];

export const navLinksRight = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
