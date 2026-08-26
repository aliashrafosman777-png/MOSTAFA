import type { MetadataRoute } from 'next';
import { siteConfig } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.domain
    ? `https://${siteConfig.domain}`
    : 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
