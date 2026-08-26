import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'airport-inaugural-flight-activations',
    title: 'Airport and Inaugural Flight Activations',
    shortDescription:
      'Event branding, print production, and environmental design for inaugural flight ceremonies and airport activations.',
    categories: ['Event', 'Print', 'Environment'],
    filterCategory: 'Events',
    clientOrContext: 'Airline and airport inaugural events',
    servicesShown: [
      'Event organization',
      'Print production',
      'Environmental branding',
      'Signage and outdoor media',
      'On-site coordination',
    ],
    summary:
      'The supplied portfolio shows inaugural flight activations featuring branded airport environments, signage, outdoor media placements, event coordination, and celebration materials. These projects demonstrate end-to-end event branding — from printed roll-ups and banners to on-site environmental design for airport ceremonies.',
    evidenceNote:
      'Visible in the supplied portfolio (pages 12–17), showing printed materials, airport signage, branded environments, and event photography from inaugural flight ceremonies.',
    heroImage: {
      src: '/assets/projects/airport-activations-cover.jpg',
      alt: 'Mostafa Ahmed at Sphinx International Airport — Wizz Air inaugural flight activation with branded backdrop featuring route launch details for Milan and Rome',
      width: 1920,
      height: 1440,
    },
    galleryImages: [],
    featured: true,
    order: 1,
  },
  {
    slug: 'seminars-travel-trade-events',
    title: 'Seminars and Travel Trade Events',
    shortDescription:
      'Event organization, media production, and coverage for travel industry seminars and trade gatherings.',
    categories: ['Event', 'Production', 'Coverage'],
    filterCategory: 'Events',
    clientOrContext:
      'Travel trade events including ATM Dubai and JTTX Saudi Arabia',
    servicesShown: [
      'Seminar organization',
      'Event production',
      'Media coverage',
      'Campaign materials',
    ],
    summary:
      'The supplied portfolio documents participation in and organization of travel trade seminars and industry events. Experience includes involvement with major gatherings such as ATM Dubai and JTTX Saudi Arabia, covering event production, coordination, and media coverage.',
    evidenceNote:
      'Referenced in the portfolio biography and supported by event documentation in the supplied materials.',
    heroImage: {
      src: '/assets/work/projects/seminars-travel-trade-events/company profile MOSTAFA AHMED_page-0019.jpg.jpeg',
      alt: 'Seminars and Travel Trade Events – cover image',
      width: 5000,
      height: 2917,
    },
    galleryImages: [],
    featured: true,
    order: 2,
  },
  {
    slug: 'ndc-x-b2b-travel-systems',
    title: 'NDC-X and B2B Travel Systems',
    shortDescription:
      'Digital campaign design and brand materials for B2B travel technology platforms including NDC-X and Smart GDS.',
    categories: ['Digital', 'Campaign', 'B2B'],
    filterCategory: 'B2B Systems',
    clientOrContext: 'NDC-X, Smart GDS, and related B2B travel platforms',
    servicesShown: [
      'Digital campaign design',
      'Social media assets',
      'Brand launch materials',
      'Platform marketing',
    ],
    summary:
      'The supplied portfolio presents extensive campaign work for B2B travel technology platforms, including NDC-X and Smart GDS. The work spans digital campaign design, social media asset creation, brand launch materials, and platform marketing content tailored for the travel distribution industry.',
    evidenceNote:
      'Visible in the supplied portfolio (pages 21–28), showing digital campaigns, social assets, and brand materials for NDC-X, Smart GDS, and related B2B travel platforms.',
    heroImage: {
      src: '/assets/work/projects/ndc-x-b2b-travel-systems/company profile MOSTAFA AHMED_page-0021.jpg.jpeg',
      alt: 'NDC-X and B2B Travel Systems – cover image',
      width: 5000,
      height: 2917,
    },
    galleryImages: [],
    featured: true,
    order: 3,
  },
  {
    slug: 'exhibition-booths-branded-environments',
    title: 'Exhibition Booths and Branded Environments',
    shortDescription:
      'Spatial design, branded environments, and exhibition booth concepts for travel industry events.',
    categories: ['Spatial', 'Print', 'Event'],
    filterCategory: 'Booths',
    clientOrContext:
      'Travel industry exhibitions and trade show environments',
    servicesShown: [
      'Booth concept design',
      'Spatial branding',
      'Environmental graphics',
      'Exhibition production',
    ],
    summary:
      'The supplied portfolio demonstrates exhibition booth design and branded environment creation for travel industry events. The work includes booth concepts, spatial branding, environmental graphics, and production coordination for trade show installations.',
    evidenceNote:
      'Visible in the supplied portfolio (pages 30–33), showing exhibition booth designs, spatial concepts, and branded environment installations.',
    heroImage: {
      src: '/assets/projects/exhibition-booths-cover.jpg',
      alt: 'Exhibition Booths and Branded Environments – cover image',
      width: 1920,
      height: 2560,
    },
    galleryImages: [],
    featured: true,
    order: 4,
  },
  {
    slug: 'airline-destination-campaigns',
    title: 'Airline and Destination Campaigns',
    shortDescription:
      'Social media and campaign creative for airlines, routes, and travel destinations.',
    categories: ['Social', 'Creative', 'Media'],
    filterCategory: 'Social',
    clientOrContext: 'Airlines and travel destinations across the region',
    servicesShown: [
      'Social media campaigns',
      'Creative direction',
      'Destination marketing',
      'Route launch creative',
      'Campaign asset production',
    ],
    summary:
      'The supplied portfolio presents an extensive collection of airline and destination campaign work spanning social media design, route launch creative, destination marketing visuals, and campaign asset production. The work covers campaigns connected to multiple airlines and travel destinations, demonstrating consistent creative quality across various formats and platforms.',
    evidenceNote:
      'Visible in the supplied portfolio (pages 35–52), showing social media designs, airline campaign creative, route launch materials, and destination marketing visuals.',
    heroImage: {
      src: '/assets/work/projects/airline-destination-campaigns/1.png',
      alt: 'Airline and Destination Campaigns – cover image',
      width: 1080,
      height: 1035,
    },
    galleryImages: [],
    featured: true,
    order: 5,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order);
}

export function getAllCategories(): string[] {
  return ['All', 'Events', 'Print', 'B2B Systems', 'Booths', 'Social'];
}
