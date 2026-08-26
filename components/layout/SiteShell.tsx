'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Preloader from '@/components/layout/Preloader';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Preloader />
      <Navigation />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
