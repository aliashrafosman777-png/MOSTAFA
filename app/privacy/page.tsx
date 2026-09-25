import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Privacy & Cookies',
  description: 'How this website handles contact information, cookies, and optional analytics.',
};

export default function PrivacyPage() {
  return (
    <section className="min-h-screen pb-24 pt-32 md:pt-40">
      <div className="container-site">
        <div className="max-w-3xl">
          <p className="text-label mb-4">Privacy & Cookies</p>
          <h1 className="text-display-lg mb-6 text-white">Clear choices. Minimal data.</h1>
          <p className="text-body-lg mb-12">
            This notice explains what information this website uses when you browse or send
            an enquiry. Last updated 25 September 2026.
          </p>

          <div className="space-y-10 text-mist">
            <section>
              <h2 className="text-display-md mb-4 text-white">Contact enquiries</h2>
              <p className="text-body">
                When you submit the contact form, the details you provide are used to review
                your enquiry and reply to you. Messages are delivered and managed using Resend,
                our email service provider. Please do not include sensitive personal information.
              </p>
            </section>

            <section>
              <h2 className="text-display-md mb-4 text-white">Optional Meta Pixel</h2>
              <p className="text-body mb-4">
                If you select Accept, the website loads the Meta Pixel. It records page views
                and a Lead event after a contact form is successfully sent. We do not send the
                name, email address, company, or message entered in the form to the Pixel.
              </p>
              <p className="text-body">
                The Pixel remains disabled if you decline, have Global Privacy Control enabled,
                or do not make a choice. Your preference is stored in your browser. You can change
                it at any time from the Cookie settings link in the footer.
              </p>
            </section>

            <section>
              <h2 className="text-display-md mb-4 text-white">Essential storage</h2>
              <p className="text-body">
                The public website does not require advertising cookies to function. The protected
                admin area uses an essential security session so authorised administrators can sign in.
              </p>
            </section>

            <section>
              <h2 className="text-display-md mb-4 text-white">Questions or requests</h2>
              <p className="text-body">
                To ask about your information or request correction or deletion, email{' '}
                <a className="text-runway underline underline-offset-4" href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
                . You can also use the{' '}
                <Link className="text-runway underline underline-offset-4" href="/contact">
                  contact form
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
