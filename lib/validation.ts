import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  company: z
    .string()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be less than 200 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  projectType: z
    .string()
    .min(1, 'Please select a project type'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters'),
  honeypot: z
    .string()
    .max(0, 'Invalid submission'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const replySchema = z.object({
  subject: z
    .string()
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be less than 200 characters'),
  message: z
    .string()
    .trim()
    .min(2, 'Reply must be at least 2 characters')
    .max(10000, 'Reply must be less than 10,000 characters'),
});

export const projectTypes = [
  'Travel Brand Strategy',
  'Campaign and Social',
  'Event or Experience',
  'Media Production',
  'Print and Physical',
  'Exhibition or Booth',
  'Other',
];
