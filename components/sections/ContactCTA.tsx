'use client';

import { useState, useCallback } from 'react';
import { siteConfig } from '@/content/site';
import { contactSchema, projectTypes } from '@/lib/validation';
import type { ContactResponse } from '@/types';
import RevealOnScroll from '@/components/motion/RevealOnScroll';
import { trackMetaEvent } from '@/lib/meta-pixel';

interface FormErrors {
  name?: string[];
  company?: string[];
  position?: string[];
  phone?: string[];
  email?: string[];
  projectType?: string[];
  message?: string[];
}

export default function ContactCTA() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    position: '',
    phone: '',
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
          trackMetaEvent('Lead', {
            content_name: 'Contact form',
            content_category: formData.projectType,
          });
          setFormData({
            name: '',
            company: '',
            position: '',
            phone: '',
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
      className="relative overflow-hidden pb-20 pt-28 sm:pt-32 md:pb-28 md:pt-36"
      aria-label="Contact"
    >
      {/* Background atmosphere */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-carbon via-flight-950/30 to-carbon pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-site relative z-10">
        <div className="mx-auto max-w-6xl">
          {/* Compact introduction, aligned to the upper right on desktop */}
          <div className="mb-10 flex justify-end md:mb-14">
            <RevealOnScroll className="w-full max-w-xl" direction="right">
              <div className="border-l border-runway/40 pl-5 lg:border-l-0 lg:border-r lg:pl-0 lg:pr-6 lg:text-right">
                <p className="text-label mb-3">Ready for Takeoff?</p>
                <h1 className="text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
                  Let us move your travel brand forward.
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-mist sm:text-base lg:ml-auto lg:max-w-lg">
                  Share the route, campaign, event, or brand challenge you are
                  planning. The first conversation starts with context.
                </p>
              </div>
            </RevealOnScroll>
          </div>

          {/* Contact Form */}
          <RevealOnScroll delay={0.3}>
            <form
              onSubmit={handleSubmit}
              className="max-w-5xl space-y-6"
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
                {/* Position */}
                <div>
                  <label
                    htmlFor="position"
                    className="block text-sm text-mist mb-2"
                  >
                    Position
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Your position"
                    autoComplete="organization-title"
                    aria-invalid={!!errors.position}
                    aria-describedby={errors.position ? 'position-error' : undefined}
                  />
                  {errors.position && (
                    <p id="position-error" className="text-xs text-red-400 mt-1.5" role="alert">
                      {errors.position[0]}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm text-mist mb-2"
                  >
                    Phone number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="+20 100 000 0000"
                    autoComplete="tel"
                    inputMode="tel"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="text-xs text-red-400 mt-1.5" role="alert">
                      {errors.phone[0]}
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
