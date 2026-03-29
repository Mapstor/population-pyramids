import { Metadata } from 'next';
import Link from 'next/link';
import ComparePageClient from '@/components/ComparePageClient';
import countries from '@/data/countries.json';

export const metadata: Metadata = {
  title: 'Compare Population Pyramids - Side-by-Side Country Demographics',
  description: 'Compare population pyramids and demographic data between countries. Interactive visualizations showing age distribution, sex ratios, and population structures for any two countries.',
  openGraph: {
    title: 'Compare Population Pyramids - Side-by-Side Country Demographics',
    description: 'Compare population pyramids and demographic data between countries. Interactive visualizations for 195+ countries.',
    type: 'website',
    url: 'https://populationpyramids.org/compare',
    images: [
      {
        url: 'https://populationpyramids.org/og-compare.png',
        width: 1200,
        height: 630,
        alt: 'Compare Population Pyramids Tool'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Population Pyramids',
    description: 'Compare demographics between any two countries with interactive population pyramids.',
  }
};

// Popular comparison pairs with metadata
const POPULAR_COMPARISONS = [
  { 
    slug: 'usa-vs-china',
    country1: 'united-states', 
    country2: 'china', 
    label: 'USA vs China',
    description: 'Superpowers face-off: Compare aging China with immigration-driven USA'
  },
  { 
    slug: 'india-vs-china',
    country1: 'india', 
    country2: 'china', 
    label: 'India vs China',
    description: 'The demographic giants: World\'s two most populous nations compared'
  },
  { 
    slug: 'japan-vs-germany',
    country1: 'japan', 
    country2: 'germany', 
    label: 'Japan vs Germany',
    description: 'Export powerhouses: Two aging societies confronting similar challenges'
  },
  { 
    slug: 'india-vs-pakistan',
    country1: 'india', 
    country2: 'pakistan', 
    label: 'India vs Pakistan',
    description: 'South Asian rivals: Contrasting demographic trajectories'
  },
  { 
    slug: 'usa-vs-brazil',
    country1: 'united-states', 
    country2: 'brazil', 
    label: 'USA vs Brazil',
    description: 'Americas comparison: North vs South population dynamics'
  },
  { 
    slug: 'uk-vs-france',
    country1: 'united-kingdom', 
    country2: 'france', 
    label: 'UK vs France',
    description: 'Channel rivals: Post-Brexit demographics and population trends'
  }
];

// Featured comparisons with rich data
const FEATURED_COMPARISONS = [
  {
    slug: 'usa-vs-china',
    title: 'USA vs China: Superpowers Demographics',
    country1: { name: 'United States', code: 'US', population: '345M', medianAge: 39.5 },
    country2: { name: 'China', code: 'CN', population: '1.41B', medianAge: 39.6 },
    insights: [
      'China\'s population is 4x larger but declining',
      'Similar median ages despite different trajectories',
      'USA grows through immigration, China faces rapid aging'
    ],
    tags: ['Superpowers', 'Economic Giants', 'Different Systems']
  },
  {
    slug: 'india-vs-china',
    title: 'India vs China: The Population Shift',
    country1: { name: 'India', code: 'IN', population: '1.45B', medianAge: 28.7 },
    country2: { name: 'China', code: 'CN', population: '1.41B', medianAge: 39.6 },
    insights: [
      'India overtook China as most populous in 2023',
      'India 11 years younger on average',
      'India growing, China declining'
    ],
    tags: ['Most Populous', 'Asian Giants', 'Historic Shift']
  },
  {
    slug: 'japan-vs-germany',
    title: 'Japan vs Germany: Aging Societies',
    country1: { name: 'Japan', code: 'JP', population: '123M', medianAge: 49.1 },
    country2: { name: 'Germany', code: 'DE', population: '84M', medianAge: 46.7 },
    insights: [
      'World\'s oldest large populations',
      'Both face workforce shortages',
      'Different immigration approaches'
    ],
    tags: ['Aging', 'Developed', 'Export Leaders']
  },
  {
    slug: 'nigeria-vs-ethiopia',
    title: 'Nigeria vs Ethiopia: African Powerhouses',
    country1: { name: 'Nigeria', code: 'NG', population: '238M', medianAge: 18.6 },
    country2: { name: 'Ethiopia', code: 'ET', population: '132M', medianAge: 19.5 },
    insights: [
      'Africa\'s demographic giants',
      'Youngest populations globally',
      'Massive youth bulges'
    ],
    tags: ['African Leaders', 'Young', 'Fast Growth']
  }
];

// Regional comparison suggestions
const REGIONAL_COMPARISONS = {
  'Asia': [
    { label: 'China vs India', slug: 'china-vs-india' },
    { label: 'Japan vs South Korea', slug: 'japan-vs-south-korea' },
    { label: 'Indonesia vs Philippines', slug: 'indonesia-vs-philippines' }
  ],
  'Europe': [
    { label: 'Germany vs France', slug: 'germany-vs-france' },
    { label: 'UK vs Italy', slug: 'uk-vs-italy' },
    { label: 'Poland vs Spain', slug: 'poland-vs-spain' }
  ],
  'Americas': [
    { label: 'USA vs Mexico', slug: 'usa-vs-mexico' },
    { label: 'Brazil vs Argentina', slug: 'brazil-vs-argentina' },
    { label: 'Canada vs Australia', slug: 'canada-vs-australia' }
  ],
  'Africa': [
    { label: 'Nigeria vs Egypt', slug: 'nigeria-vs-egypt' },
    { label: 'Ethiopia vs Kenya', slug: 'ethiopia-vs-kenya' },
    { label: 'South Africa vs Morocco', slug: 'south-africa-vs-morocco' }
  ]
};

export default async function ComparePage() {
  // Pre-process countries data for the client component
  const countriesData = countries.map(country => ({
    slug: country.slug,
    name: country.name,
    code: country.code,
    region: country.region || 'Other',
    population2024: country.population2024 || 0
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Server Rendered for SEO */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold mb-4">
            Compare Population Pyramids
          </h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Explore demographic differences between countries with side-by-side population pyramids. 
            Compare age structures, sex ratios, and demographic trends for any two countries using 
            the latest UN World Population Prospects data.
          </p>
        </div>
      </div>

      {/* Popular Comparisons Pills - Server Rendered */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Comparisons</h2>
          <div className="flex flex-wrap gap-3">
            {POPULAR_COMPARISONS.map((comparison) => (
              <Link
                key={comparison.slug}
                href={`/compare/${comparison.slug}`}
                className="inline-flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full font-medium transition-colors"
              >
                <span className="mr-2">🔄</span>
                {comparison.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Comparison Cards - Server Rendered */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Comparisons</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURED_COMPARISONS.map((comparison) => (
              <Link
                key={comparison.slug}
                href={`/compare/${comparison.slug}`}
                className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {comparison.title}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{getCountryFlag(comparison.country1.code)}</span>
                        <span className="font-semibold">{comparison.country1.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Pop: {comparison.country1.population}</div>
                        <div>Median: {comparison.country1.medianAge}y</div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{getCountryFlag(comparison.country2.code)}</span>
                        <span className="font-semibold">{comparison.country2.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Pop: {comparison.country2.population}</div>
                        <div>Median: {comparison.country2.medianAge}y</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    {comparison.insights.map((insight, index) => (
                      <div key={index} className="flex items-start text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        {insight}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {comparison.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Regional Comparisons - Server Rendered */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Compare by Region</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(REGIONAL_COMPARISONS).map(([region, comparisons]) => (
              <div key={region}>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">{getRegionEmoji(region)}</span>
                  {region}
                </h3>
                <div className="space-y-2">
                  {comparisons.map((comp) => (
                    <Link
                      key={comp.slug}
                      href={`/compare/${comp.slug}`}
                      className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      → {comp.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Comparison Tool - Client Component */}
        <ComparePageClient countries={countriesData} />

        {/* SEO Content - Server Rendered */}
        <div className="prose prose-lg max-w-4xl mx-auto mt-12 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Understanding Population Pyramid Comparisons</h2>
          
          <p className="text-gray-600">
            Population pyramids are powerful visualization tools that reveal the age and sex distribution 
            of a population at a glance. When comparing two countries side-by-side, these pyramids 
            unveil striking differences in demographic structures, from youthful populations with 
            wide bases in developing nations to the inverted pyramids of aging societies.
          </p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">What Can You Learn from Comparisons?</h3>
          
          <div className="bg-blue-50 rounded-lg p-6 my-6">
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">📊</span>
                <div>
                  <strong>Population Structure:</strong> Compare whether countries have young, 
                  aging, or balanced populations by examining pyramid shapes.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">👥</span>
                <div>
                  <strong>Gender Balance:</strong> Identify sex ratio imbalances that may indicate 
                  selective practices, war impacts, or migration patterns.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">📈</span>
                <div>
                  <strong>Economic Implications:</strong> Young populations suggest future growth 
                  potential, while aging ones indicate healthcare and pension challenges.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">🌍</span>
                <div>
                  <strong>Development Stage:</strong> Pyramid shapes often correlate with economic 
                  development levels and demographic transition phases.
                </div>
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">Types of Population Pyramids</h3>
          
          <div className="grid md:grid-cols-3 gap-4 my-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800">Expansive (Triangle)</h4>
              <p className="text-sm text-gray-600 mt-2">
                Wide base, narrow top. High birth rates, young population. 
                Common in: Nigeria, Ethiopia, Afghanistan.
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800">Stationary (Rectangle)</h4>
              <p className="text-sm text-gray-600 mt-2">
                Even distribution across ages. Stable population growth. 
                Common in: USA, France, New Zealand.
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-800">Constrictive (Inverted)</h4>
              <p className="text-sm text-gray-600 mt-2">
                Narrow base, wider middle. Declining population. 
                Common in: Japan, Germany, Italy.
              </p>
            </div>
          </div>

          <p className="text-gray-600">
            Our comparison tool uses the latest UN World Population Prospects data, updated annually 
            with projections through 2100. Each visualization includes detailed metrics like median age, 
            dependency ratios, and sex ratios to provide comprehensive demographic insights.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to get country flag emoji
function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    'US': '🇺🇸', 'CN': '🇨🇳', 'IN': '🇮🇳', 'JP': '🇯🇵',
    'DE': '🇩🇪', 'NG': '🇳🇬', 'ET': '🇪🇹', 'BR': '🇧🇷',
    'UK': '🇬🇧', 'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸',
    'CA': '🇨🇦', 'AU': '🇦🇺', 'MX': '🇲🇽', 'ID': '🇮🇩',
    'PH': '🇵🇭', 'EG': '🇪🇬', 'KE': '🇰🇪', 'ZA': '🇿🇦'
  };
  return flags[code] || '🏳️';
}

// Helper function to get region emoji
function getRegionEmoji(region: string): string {
  const emojis: Record<string, string> = {
    'Asia': '🌏',
    'Europe': '🇪🇺',
    'Americas': '🌎',
    'Africa': '🌍',
    'Oceania': '🏝️'
  };
  return emojis[region] || '🌐';
}