export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  tagline: string;
  role: string;
  phone: string | null;
  email: string | null;
  whatsappEnabled: boolean;
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    behance?: string;
  } | null;
  domain: string | null;
  analyticsId: string | null;
  contactProvider: 'resend' | null;
  legalName: string | null;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  categories: string[];
  filterCategory: string;
  clientOrContext: string;
  servicesShown: string[];
  summary: string;
  evidenceNote: string;
  heroImage: ProjectImage;
  galleryImages: ProjectImage[];
  featured: boolean;
  order: number;
}

export interface Value {
  title: string;
  description: string;
}

export interface ExperienceColumn {
  title: string;
  names: string[];
}

export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  projectType: string;
  message: string;
  honeypot: string;
}

export type ContactResponse = {
  success: true;
  message: string;
} | {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
} | {
  success: false;
  unconfigured: true;
  message: string;
};

export interface NavLink {
  label: string;
  href: string;
}
