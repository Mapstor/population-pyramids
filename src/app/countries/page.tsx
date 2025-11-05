import { getCountriesWithPopulationChange } from '@/lib/world-data-aggregator';
import SortableCountryTable from '@/components/SortableCountryTable';

export const metadata = {
  title: 'All Countries - Population Demographics | Population Pyramids',
  description: 'Comprehensive demographic data for all 195 countries with sorting, filtering, and search capabilities. View population trends, median age, growth rates, and dependency ratios.',
  keywords: 'world population, country demographics, population data, UN statistics, demographic trends, population growth, median age, dependency ratio',
  openGraph: {
    title: 'Demographic Data for All 195 Countries | Population Pyramids',
    description: 'Comprehensive demographic data with sorting, filtering, and search capabilities. Click any country to view detailed population pyramids and trends.',
    type: 'website',
    url: 'https://populationpyramids.org/countries',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Demographic Data for All 195 Countries | Population Pyramids',
    description: 'Comprehensive demographic data with sorting, filtering, and search capabilities.',
  },
  canonical: 'https://populationpyramids.org/countries',
};

// JSON-LD Schema for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Demographic Data for All 195 Countries',
  description: 'Comprehensive demographic data for all 195 countries with sorting, filtering, and search capabilities. View population trends, median age, growth rates, and dependency ratios.',
  url: 'https://populationpyramids.org/countries',
  mainEntity: {
    '@type': 'Dataset',
    name: 'World Countries Population Demographics Dataset',
    description: 'Complete demographic data for 195 countries including population, median age, growth rates, and dependency ratios.',
    creator: {
      '@type': 'Organization',
      name: 'United Nations Department of Economic and Social Affairs, Population Division',
    },
    distribution: {
      '@type': 'DataDownload',
      contentUrl: 'https://populationpyramids.org/countries',
      encodingFormat: 'text/html',
    },
    temporalCoverage: '1990/2024',
    spatialCoverage: {
      '@type': 'Place',
      name: 'World',
    },
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://populationpyramids.org',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Countries',
        item: 'https://populationpyramids.org/countries',
      },
    ],
  },
};

export default async function CountriesPage() {
  const countries = await getCountriesWithPopulationChange();

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li>
                <a href="/" className="hover:text-blue-600 transition">
                  Home
                </a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Countries</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Demographic Data for All {countries.length} Countries
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Comprehensive demographic data with sorting, filtering, and search capabilities. 
              Click any country to view detailed population pyramids and trends.
            </p>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {countries.length}
              </div>
              <div className="text-sm text-gray-600">Countries & Territories</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {Math.round(countries.reduce((sum, c) => sum + c.population2024, 0) / 1000000000 * 10) / 10}B
              </div>
              <div className="text-sm text-gray-600">Total World Population</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                1950-2025
              </div>
              <div className="text-sm text-gray-600">Data Coverage</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                75 Years
              </div>
              <div className="text-sm text-gray-600">Historical Data</div>
            </div>
          </div>

          {/* About the Data */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About This Data
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What's Included
                </h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• <strong>Population Data:</strong> Current 2024 population and historical trends since 1990</li>
                  <li>• <strong>Median Age:</strong> Age distribution midpoint showing demographic maturity</li>
                  <li>• <strong>Growth Rates:</strong> Population change percentages and absolute numbers</li>
                  <li>• <strong>Age Structure:</strong> Youth (0-14) and elderly (65+) percentages</li>
                  <li>• <strong>Dependency Ratios:</strong> Economic burden calculations</li>
                  <li>• <strong>Regional Groups:</strong> UN geographic classifications</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How to Use
                </h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• <strong>Sort:</strong> Click column headers to sort by any metric</li>
                  <li>• <strong>Search:</strong> Use the search box to find specific countries</li>
                  <li>• <strong>Filter:</strong> Select regions to narrow down the view</li>
                  <li>• <strong>Compare:</strong> Click country names to view detailed demographics</li>
                  <li>• <strong>Analyze:</strong> Use data for research, planning, or education</li>
                  <li>• <strong>Export:</strong> Data suitable for further analysis</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Table */}
          <SortableCountryTable countries={countries} />

          {/* Data Sources */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Data Sources & Methodology
            </h3>
            <p className="text-gray-700 text-sm mb-2">
              All demographic data is sourced from the United Nations Department of Economic and Social Affairs, 
              Population Division. World Population Prospects 2024 Revision represents the most authoritative 
              and comprehensive demographic dataset available globally.
            </p>
            <p className="text-gray-700 text-sm mb-3">
              Data includes medium-variant population projections based on comprehensive demographic research, 
              historical trends analysis, and standardized methodologies applied consistently across all {countries.length} countries.
            </p>
            <a 
              href="https://population.un.org/wpp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View Official UN World Population Prospects Data →
            </a>
          </div>

          {/* Quick Access */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Quick Access by Region
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Africa', 'Asia', 'Europe', 'Americas', 'Oceania'].map(region => {
                const regionCountries = countries.filter(c => c.region === region);
                const totalPop = regionCountries.reduce((sum, c) => sum + c.population2024, 0);
                
                return (
                  <div key={region} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                    <h4 className="font-semibold text-gray-900 mb-2">{region}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{regionCountries.length} countries</div>
                      <div>{(totalPop / 1000000000).toFixed(2)}B population</div>
                      <div className="text-blue-600 cursor-pointer hover:text-blue-700">
                        Filter to {region} →
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}