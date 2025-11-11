import { MetadataRoute } from 'next';
import { loadCountries } from '@/lib/data-loader';
import fs from 'fs';
import path from 'path';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://populationpyramids.org';
  
  // Load countries for dynamic routes
  const countries = await loadCountries();
  
  // Load US states
  const statesDir = path.join(process.cwd(), 'src/data/states');
  const stateFiles = fs.readdirSync(statesDir);
  const states = stateFiles
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/countries`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/states`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];
  
  // Blog articles
  const blogArticles = [
    {
      url: `${baseUrl}/blog/15-fastest-growing-states-2024`,
      lastModified: new Date('2024-11-11'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/10-states-people-fleeing-2024`,
      lastModified: new Date('2024-11-11'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/global-fertility-crisis-2024`,
      lastModified: new Date('2024-11-11'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/japan-demographic-time-bomb`,
      lastModified: new Date('2024-11-11'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/africa-population-explosion-2024`,
      lastModified: new Date('2024-11-11'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/china-india-population-shift`,
      lastModified: new Date('2024-11-11'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/europe-aging-crisis-2024`,
      lastModified: new Date('2024-11-11'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/us-immigration-demographics-2024`,
      lastModified: new Date('2024-11-11'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/youth-bulge-political-instability`,
      lastModified: new Date('2024-11-11'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/middle-east-demographic-divide`,
      lastModified: new Date('2024-11-11'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Dynamic country pages
  const countryPages = countries.map((country) => ({
    url: `${baseUrl}/${country.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  
  // Dynamic US state pages
  const statePages = states.map((state) => ({
    url: `${baseUrl}/states/${state}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogArticles, ...countryPages, ...statePages];
}