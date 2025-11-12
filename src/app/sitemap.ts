import { MetadataRoute } from 'next';
import { loadCountries } from '@/lib/data-loader';
import { loadStates } from '@/lib/state-data-loader';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://populationpyramids.org';
  
  try {
    // Load countries and states for dynamic routes
    const countries = await loadCountries();
    const states = await loadStates();
    
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
        priority: 0.9,
      },
      {
        url: `${baseUrl}/compare`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
    ];
    
    // Blog articles - comprehensive list
    const blogArticles = [
      // Demographics Education Articles (NEW)
      {
        url: `${baseUrl}/blog/population-pyramid-types-complete-guide`,
        lastModified: new Date('2024-11-12'),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog/population-pyramid-stages-demographic-transition`,
        lastModified: new Date('2024-11-12'),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
      },
      
      // US States Articles
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
        url: `${baseUrl}/blog/best-states-retire-2025`,
        lastModified: new Date('2024-11-11'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog/climate-refugees-states-flee-weather`,
        lastModified: new Date('2024-11-11'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog/remote-work-exodus-states-wfh-changed`,
        lastModified: new Date('2024-11-11'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog/alaska-gender-ratio-dating-crisis`,
        lastModified: new Date('2024-11-10'),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog/half-states-under-35-youth-vs-senior-america`,
        lastModified: new Date('2024-11-10'),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog/nevada-west-virginia-population-gap`,
        lastModified: new Date('2024-11-10'),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog/texas-added-michigan-population`,
        lastModified: new Date('2024-11-10'),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog/utah-maine-age-gap-crisis`,
        lastModified: new Date('2024-11-10'),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      
      // Global Demographics Articles
      {
        url: `${baseUrl}/blog/fertility-apocalypse-countries-stopped-having-babies`,
        lastModified: new Date('2024-11-05'),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog/africa-population-explosion-2024`,
        lastModified: new Date('2024-11-10'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog/baby-boom-echo-how-1990s-events-shape-today`,
        lastModified: new Date('2024-11-09'),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog/china-india-population-swap`,
        lastModified: new Date('2024-11-09'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog/china-india-population-swap-global-shift`,
        lastModified: new Date('2024-11-09'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog/country-2-5-men-for-every-woman-dating-crisis`,
        lastModified: new Date('2024-11-09'),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog/demographic-time-bombs-countries-losing-people`,
        lastModified: new Date('2024-11-09'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog/half-this-country-under-17-youth-explosion`,
        lastModified: new Date('2024-11-09'),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog/india-beat-china-first-time-300-years-population`,
        lastModified: new Date('2024-11-09'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog/megacity-explosion-cities-bigger-than-countries`,
        lastModified: new Date('2024-11-09'),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog/migration-nations-countries-gaining-losing-millions`,
        lastModified: new Date('2024-11-09'),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog/worlds-aging-crisis-9-countries-seniors`,
        lastModified: new Date('2024-11-09'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog/youth-explosion-africa-youngest-populations`,
        lastModified: new Date('2024-11-09'),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
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
    const statePages = states.map((state: any) => ({
      url: `${baseUrl}/states/${state.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...blogArticles, ...countryPages, ...statePages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback minimal sitemap
    return [
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
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
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
        priority: 0.9,
      },
    ];
  }
}