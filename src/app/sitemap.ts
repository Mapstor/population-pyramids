import { MetadataRoute } from 'next';
import { loadCountries } from '@/lib/data-loader';
import { loadStates } from '@/lib/state-data-loader';
import { COMPARISON_PAIRS } from '@/lib/comparison-pairs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.populationpyramids.org';
  
  try {
    // Load countries and states for dynamic routes
    const countries = await loadCountries();
    const states = await loadStates();
    
    // Static pages with optimized priorities
    const staticPages = [
      // Core Pages - Highest Priority
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/countries`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.95,
      },
      {
        url: `${baseUrl}/states`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.95,
      },
      
      // High-Value Calculator Tools (High Traffic Potential)
      {
        url: `${baseUrl}/median-age-by-country`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.95, // 7K/mo search volume
      },
      {
        url: `${baseUrl}/male-to-female-ratio`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.95, // 13K/mo search volume
      },
      {
        url: `${baseUrl}/population-growth-rate-calculator`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/dependency-ratio-calculator`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      },
      {
        url: `${baseUrl}/generation-age-ranges-calculator`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      },
      
      // Interactive Tools
      {
        url: `${baseUrl}/compare`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      },
      
      // Additional Tools
      {
        url: `${baseUrl}/search`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/generations`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/us-states`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      
      // Content Pages
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      
      // Legal Pages - Lower Priority
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
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
    
    // Blog articles - comprehensive list matching actual files
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
      
      // Demographic Transition Model Articles
      {
        url: `${baseUrl}/blog/4-stages-demographic-transition-model`,
        lastModified: new Date('2024-11-12'),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog/4-vs-5-stages-demographic-transition-model`,
        lastModified: new Date('2024-11-12'),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog/5-stages-demographic-transition-complete-model`,
        lastModified: new Date('2024-11-12'),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog/stage-1-demographic-transition`,
        lastModified: new Date('2024-11-12'),
        changeFrequency: 'monthly' as const,
        priority: 0.85,
      },
      {
        url: `${baseUrl}/blog/stage-2-demographic-transition`,
        lastModified: new Date('2024-11-12'),
        changeFrequency: 'monthly' as const,
        priority: 0.85,
      },
      {
        url: `${baseUrl}/blog/stage-3-demographic-transition`,
        lastModified: new Date('2024-11-12'),
        changeFrequency: 'monthly' as const,
        priority: 0.85,
      },
      {
        url: `${baseUrl}/blog/stage-4-demographic-transition`,
        lastModified: new Date('2024-11-12'),
        changeFrequency: 'monthly' as const,
        priority: 0.85,
      },
      {
        url: `${baseUrl}/blog/stage-5-demographic-transition`,
        lastModified: new Date('2024-11-12'),
        changeFrequency: 'monthly' as const,
        priority: 0.85,
      },
      
      // US States Articles
      {
        url: `${baseUrl}/blog/fastest-growing-states`,
        lastModified: new Date('2024-11-11'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog/states-people-fleeing`,
        lastModified: new Date('2024-11-11'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog/best-states-retire`,
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
      
      // Missing Articles Found in Actual Files
      {
        url: `${baseUrl}/blog/fastest-growing-states-population`,
        lastModified: new Date('2024-11-11'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog/fastest-growing-states-population/fastest-growing-states-population-2024`,
        lastModified: new Date('2024-11-11'),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog/oldest-countries-world-aging-population`,
        lastModified: new Date('2024-11-10'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog/oldest-states-in-us-aging-population`,
        lastModified: new Date('2024-11-10'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog/youngest-states-in-us-youth-population`,
        lastModified: new Date('2024-11-10'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
    ];

    // Comparison pages - all available comparison pairs  
    const comparisonPages = COMPARISON_PAIRS.map((pair) => ({
      url: `${baseUrl}/compare/${pair.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: pair.category === 'superpower' ? 0.9 : 0.8,
    }));

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

    return [...staticPages, ...blogArticles, ...comparisonPages, ...countryPages, ...statePages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback minimal sitemap with www domain
    const fallbackBaseUrl = 'https://www.populationpyramids.org';
    return [
      {
        url: fallbackBaseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1.0,
      },
      {
        url: `${fallbackBaseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: `${fallbackBaseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      {
        url: `${fallbackBaseUrl}/countries`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${fallbackBaseUrl}/states`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
    ];
  }
}