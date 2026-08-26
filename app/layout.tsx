import type { Metadata } from 'next';
import { Manrope, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/content/site';
import SiteShell from '@/components/layout/SiteShell';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: siteConfig.domain
    ? new URL(`https://${siteConfig.domain}`)
    : new URL('http://localhost:3000'),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/assets/brand/mostafa-logo-dark.png',
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    description: siteConfig.description,
    ...(siteConfig.phone && {
      telephone: siteConfig.phone,
    }),
    ...(siteConfig.domain && {
      url: `https://${siteConfig.domain}`,
    }),
  };

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${manrope.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd),
          }}
        />
      </head>
      <body className="font-[family-name:var(--font-manrope)]">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
