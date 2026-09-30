import type { Metadata } from 'next';
import ContactCTA from '@/components/sections/ContactCTA';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Mostafa Ahmed to discuss your travel marketing project, campaign, event, or brand challenge.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return <ContactCTA />;
}
