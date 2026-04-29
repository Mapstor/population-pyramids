import Link from 'next/link';
import type { Country } from '@/types/country';

interface GenerationsCountrySelectorProps {
  countries: Country[];
  currentCountry: string; // 'world' or country slug
}

export function GenerationsCountrySelector({ countries, currentCountry }: GenerationsCountrySelectorProps) {
  // Group countries by region for better organization
  const regions: Record<string, Country[]> = {
    'Africa': [],
    'Asia': [],
    'Europe': [],
    'North America': [],
    'South America': [],
    'Oceania': []
  };

  // Simple region detection based on common countries (can be enhanced)
  countries.forEach(country => {
    // This is a simplified approach - in production, use proper region data
    if (['nigeria', 'egypt', 'south-africa', 'ethiopia', 'kenya', 'ghana', 'morocco', 'algeria', 'uganda', 'sudan'].includes(country.slug)) {
      regions['Africa'].push(country);
    } else if (['china', 'india', 'japan', 'indonesia', 'pakistan', 'bangladesh', 'philippines', 'vietnam', 'thailand', 'south-korea'].includes(country.slug)) {
      regions['Asia'].push(country);
    } else if (['germany', 'france', 'united-kingdom', 'italy', 'spain', 'poland', 'netherlands', 'belgium', 'greece', 'portugal'].includes(country.slug)) {
      regions['Europe'].push(country);
    } else if (['united-states', 'canada', 'mexico'].includes(country.slug)) {
      regions['North America'].push(country);
    } else if (['brazil', 'argentina', 'colombia', 'peru', 'venezuela', 'chile', 'ecuador', 'bolivia', 'paraguay', 'uruguay'].includes(country.slug)) {
      regions['South America'].push(country);
    } else if (['australia', 'new-zealand', 'papua-new-guinea', 'fiji'].includes(country.slug)) {
      regions['Oceania'].push(country);
    } else {
      // Default to Asia for unlisted countries
      regions['Asia'].push(country);
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Explore Generation Data by Country</h2>
      
      {/* World option */}
      <div className="mb-6">
        <Link 
          href="/generations" 
          className={`inline-flex items-center px-4 py-2 rounded-lg transition ${
            currentCountry === 'world' 
              ? 'bg-blue-600 text-white font-bold' 
              : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
          }`}
        >
          🌍 World (All Countries Combined)
        </Link>
      </div>

      {/* Countries by region */}
      <div className="space-y-6">
        {Object.entries(regions).map(([regionName, regionCountries]) => {
          if (regionCountries.length === 0) return null;
          
          return (
            <div key={regionName}>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{regionName}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {regionCountries.sort((a, b) => a.name.localeCompare(b.name)).map(country => (
                  <Link 
                    key={country.slug}
                    href={`/generations/${country.slug}`}
                    className={`text-sm px-3 py-1.5 rounded transition ${
                      currentCountry === country.slug 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {country.flag || '🏳️'} {country.name}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* SEO-friendly links to popular countries */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Popular Countries:</h3>
        <div className="flex flex-wrap gap-2">
          {['united-states', 'china', 'india', 'japan', 'germany', 'united-kingdom', 'brazil', 'nigeria'].map(slug => {
            const country = countries.find(c => c.slug === slug);
            if (!country) return null;
            return (
              <Link
                key={slug}
                href={`/generations/${slug}`}
                className="text-blue-600 hover:underline text-sm"
              >
                {country.name} generations
              </Link>
            );
          })}
        </div>
      </div>

      {/* Helper text for SEO */}
      <p className="mt-4 text-xs text-gray-600">
        Compare generation sizes across all 195 countries. See how many Millennials, Gen Z, Boomers, and other generations live in each country based on UN population data.
      </p>
    </div>
  );
}