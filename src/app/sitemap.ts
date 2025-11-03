import { MetadataRoute } from 'next';
import { loadCountries } from '@/lib/data-loader';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://populationpyramids.org';
  
  // Load countries for dynamic routes
  const countries = await loadCountries();
  
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
  ];

  // Dynamic country pages
  const countryPages = countries.map((country) => ({
    url: `${baseUrl}/countries/${country.slug}-population-pyramid`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...countryPages];
}