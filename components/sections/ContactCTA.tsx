'use client';

import { useState, useCallback } from 'react';
import { siteConfig } from '@/content/site';
import { contactSchema, projectTypes } from '@/lib/validation';
import type { ContactResponse } from '@/types';
import RevealOnScroll from '@/components/motion/RevealOnScroll';

interface FormErrors {
  name?: string[];
  company?: string[];
  email?: string[];
  projectType?: string[];
  message?: string[];
}

export default function ContactCTA() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    projectType: '',
    message: '',
    honeypot: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'unconfigured'>('idle');
  const [serverMessage, setServerMessage] = useState('');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear field error on change
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[name as keyof FormErrors];
          return next;
        });
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      setServerMessage('');

      // Client-side validation
      const result = contactSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: FormErrors = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0] as keyof FormErrors;
          if (!fieldErrors[field]) {
            fieldErrors[field] = [];
          }
          fieldErrors[field]!.push(issue.message);
        }
        setErrors(fieldErrors);
        return;
      }

      setStatus('submitting');

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data: ContactResponse = await response.json();

        if ('unconfigured' in data && data.unconfigured) {
          setStatus('unconfigured');
          setServerMessage(data.message);
        } else if (data.success) {
          setStatus('success');
          setServerMessage(data.message);
          setFormData({
            name: '',
            company: '',
            email: '',
            projectType: '',
            message: '',
            honeypot: '',
          });
        } else {
          setStatus('error');
          setServerMessage(data.message);
          if ('errors' in data && data.errors) {
            setErrors(data.errors as FormErrors);
          }
        }
      } catch {
        setStatus('error');
        setServerMessage(
          'Something went wrong. Please try calling directly.'
        );
      }
    },
    [formData]
  );

  const inputClasses =
    'w-full px-4 py-3.5 bg-flight-950 border border-line text-white text-sm placeholder:text-sage/50 rounded-sm focus:outline-none focus:ring-2 focus:ring-runway focus:ring-offset-2 focus:ring-offset-carbon transition-all duration-300';

  return (
    <section
      id="contact"
      className="section-padding relative overflow-hidden"
      aria-label="Contact"
    >
      {/* Background atmosphere */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-carbon via-flight-950/30 to-carbon pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-site relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <RevealOnScroll>
              <p className="text-label mb-4">Ready for Takeoff?</p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <h2 className="text-display-lg text-white mb-6">
                Let us move your travel brand forward.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll delay={0.2}>
              <p className="text-body-lg mx-auto text-center">
                Share the route, campaign, event, or brand challenge you are
                planning. The first conversation starts with context.
              </p>
            </RevealOnScroll>
          </div>

          {/* Quick Actions */}
          <RevealOnScroll delay={0.25}>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {siteConfig.phone && (
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 px-6 py-3 border border-line text-mist hover:text-white hover:border-mist/40 transition-all duration-300 rounded-sm text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                Call {siteConfig.phone}
              </a>
              )}
            </div>
          </RevealOnScroll>

          {/* Contact Form */}
          <RevealOnScroll delay={0.3}>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              noValidate
            >
              {/* Honeypot */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="honeypot">Leave empty</label>
                <input
                  type="text"
                  id="honeypot"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm text-mist mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Your name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs text-red-400 mt-1.5" role="alert">
                      {errors.name[0]}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm text-mist mb-2"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Your company"
                    autoComplete="organization"
                    aria-invalid={!!errors.company}
                    aria-describedby={errors.company ? 'company-error' : undefined}
                  />
                  {errors.company && (
                    <p id="company-error" className="text-xs text-red-400 mt-1.5" role="alert">
                      {errors.company[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-mist mb-2"
                  >
                    Work email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="you@company.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-xs text-red-400 mt-1.5" role="alert">
                      {errors.email[0]}
                    </p>
                  )}
                </div>

                {/* Project Type */}
                <div>
                  <label
                    htmlFor="projectType"
                    className="block text-sm text-mist mb-2"
                  >
                    Project type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className={`${inputClasses} appearance-none`}
                    aria-invalid={!!errors.projectType}
                    aria-describedby={errors.projectType ? 'projectType-error' : undefined}
                  >
                    <option value="" disabled>
                      Select a type
                    </option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.projectType && (
                    <p id="projectType-error" className="text-xs text-red-400 mt-1.5" role="alert">
                      {errors.projectType[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm text-mist mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`${inputClasses} resize-y min-h-[120px]`}
                  placeholder="Tell me about your project, timeline, and goals..."
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="text-xs text-red-400 mt-1.5" role="alert">
                    {errors.message[0]}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="px-8 py-3.5 bg-white text-carbon font-semibold text-sm tracking-wide hover:bg-ivory transition-colors duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting'
                    ? 'Sending...'
                    : 'Start a project'}
                </button>

                {status === 'success' && (
                  <p className="text-sm text-runway" role="status">
                    {serverMessage}
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-sm text-red-400" role="alert">
                    {serverMessage}
                  </p>
                )}
                {status === 'unconfigured' && (
                  <div className="text-sm text-sage" role="status">
                    <p>{serverMessage}</p>
                    {siteConfig.phone && (
                    <p className="mt-1">
                      Please call{' '}
                      <a
                        href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                        className="text-runway underline"
                      >
                        {siteConfig.phone}
                      </a>{' '}
                      to discuss your project.
                    </p>
                    )}
                  </div>
                )}
              </div>
            </form>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
