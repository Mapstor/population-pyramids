import Link from 'next/link';
import { generateWorldPopulationData, getCountriesWithPopulationChange } from '@/lib/world-data-aggregator';
import WorldPopulationPyramid from '@/components/WorldPopulationPyramid';
import SortableCountryTable from '@/components/SortableCountryTable';

// JSON-LD Schema for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Population Pyramids',
  description: 'Interactive demographic visualization platform providing comprehensive population data for 195 countries from 1950-2025 based on UN World Population Prospects 2024.',
  url: 'https://populationpyramids.org',
  author: {
    '@type': 'Organization',
    name: 'Population Pyramids',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Population Pyramids',
  },
  mainEntity: {
    '@type': 'Dataset',
    name: 'World Population Demographics Dataset',
    description: 'Comprehensive demographic data for 195 countries covering 75 years (1950-2025) sourced from UN World Population Prospects 2024 Revision.',
    creator: {
      '@type': 'Organization',
      name: 'United Nations Department of Economic and Social Affairs, Population Division',
    },
    distribution: {
      '@type': 'DataDownload',
      contentUrl: 'https://populationpyramids.org',
      encodingFormat: 'application/json',
    },
    temporalCoverage: '1950/2025',
    spatialCoverage: {
      '@type': 'Place',
      name: 'World',
    },
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  applicationCategory: 'EducationalApplication',
  applicationSubCategory: 'Demographics',
  operatingSystem: 'Web Browser',
};

export default async function HomePage() {
  const [worldData, countries] = await Promise.all([
    generateWorldPopulationData(),
    getCountriesWithPopulationChange()
  ]);

  const totalWorldPop2024 = worldData.years['2024']?.totalPopulation || 0;
  const totalWorldPop2000 = worldData.years['2000']?.totalPopulation || 0;
  const worldGrowthPercent = totalWorldPop2000 > 0 ? 
    ((totalWorldPop2024 - totalWorldPop2000) / totalWorldPop2000 * 100) : 0;
  
  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Global Population Demographics
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto mb-6 sm:mb-8 px-2">
              Interactive visualization of world population data from 1950-2025, based on UN World Population Prospects 2024
            </p>
            
            {/* Compact Key Stats */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{(totalWorldPop2024 / 1000000000).toFixed(2)}B</div>
                <div className="text-xs sm:text-sm text-gray-500">World Population 2024</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-green-600">+{worldGrowthPercent.toFixed(2)}%</div>
                <div className="text-xs sm:text-sm text-gray-500">Growth Since 2000</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-purple-600">{countries.length}</div>
                <div className="text-xs sm:text-sm text-gray-500">Countries Analyzed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* World Population Pyramid */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              World Population Pyramid
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-2">
              Watch how the world's age structure has evolved over 75 years. Use the slider or play button to animate through time.
            </p>
          </div>
          
          <WorldPopulationPyramid worldData={worldData.years} className="max-w-6xl mx-auto" />
        </div>

        {/* SEO Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Understanding Population Pyramids */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Understanding Population Pyramids
            </h2>
            <p className="text-gray-600 mb-4">
              Population pyramids are essential demographic tools that visualize the age and gender distribution of a country's population. 
              These charts reveal critical insights about a nation's demographic transition, economic potential, and social challenges.
            </p>
            <p className="text-gray-600 mb-4">
              Our interactive population pyramids use authentic UN World Population Prospects 2024 data, providing the most accurate 
              demographic information available. Each pyramid displays male population on the left (blue) and female population on the 
              right (pink), with age groups stacked from youngest at the bottom to oldest at the top.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Types of Population Structures:
            </h3>
            <ul className="text-gray-600 space-y-1">
              <li><strong>Expansive (Triangle):</strong> High birth rates, young population - typical in developing countries</li>
              <li><strong>Constrictive (Inverted):</strong> Low birth rates, aging population - common in developed nations</li>
              <li><strong>Stationary (Rectangle):</strong> Stable birth/death rates - demographic equilibrium</li>
            </ul>
          </div>

          {/* Global Demographic Trends */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Global Demographic Trends 2024
            </h2>
            <p className="text-gray-600 mb-4">
              The world's population reached {(totalWorldPop2024 / 1000000000).toFixed(2)} billion in 2024, representing a {worldGrowthPercent.toFixed(2)}% 
              increase since 2000. This growth reflects significant regional variations, with Sub-Saharan Africa experiencing rapid 
              expansion while East Asia and Europe face population decline.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Key Demographic Indicators:
            </h3>
            <ul className="text-gray-600 space-y-1">
              <li><strong>Median Age:</strong> Global median age continues rising, indicating worldwide population aging</li>
              <li><strong>Dependency Ratio:</strong> Economic burden calculation of non-working age population</li>
              <li><strong>Youth Bulge:</strong> Countries with over 30% population under 15 face unique challenges</li>
              <li><strong>Demographic Dividend:</strong> Working-age majority can drive economic growth</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Understanding these trends helps policymakers plan for healthcare, education, pensions, and economic development.
            </p>
          </div>

          {/* Regional Analysis */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Regional Demographic Patterns
            </h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Africa: Youth-Driven Growth
            </h3>
            <p className="text-gray-600 mb-3">
              African countries dominate global population growth, with nations like Nigeria, Ethiopia, and Democratic Republic of Congo 
              experiencing rapid expansion. High fertility rates and improving healthcare create expansive population pyramids.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Asia: Demographic Transition
            </h3>
            <p className="text-gray-600 mb-3">
              Asia shows diverse patterns - India recently surpassed China as the most populous country, while East Asian nations 
              like Japan and South Korea face severe aging challenges. China's one-child policy effects continue shaping its pyramid.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Europe: Aging Societies
            </h3>
            <p className="text-gray-600">
              European countries exhibit constrictive pyramids with low birth rates and high life expectancy. Countries like Germany, 
              Italy, and Eastern European nations face population decline and aging workforce challenges.
            </p>
          </div>

          {/* Data Applications */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Applications of Population Data
            </h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Economic Planning:
            </h3>
            <ul className="text-gray-600 space-y-1 mb-3">
              <li>Labor force projections and workforce planning</li>
              <li>Social security and pension system sustainability</li>
              <li>Healthcare infrastructure and aging population needs</li>
              <li>Education system capacity and demographic dividend</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Research Applications:
            </h3>
            <ul className="text-gray-600 space-y-1 mb-3">
              <li>Academic research in demography and sociology</li>
              <li>Economic development and migration studies</li>
              <li>Public health and epidemiological analysis</li>
              <li>Urban planning and infrastructure development</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Business Intelligence:
            </h3>
            <ul className="text-gray-600 space-y-1">
              <li>Market sizing and consumer demographic analysis</li>
              <li>Investment decisions and economic forecasting</li>
              <li>Insurance and financial services planning</li>
              <li>International development and aid allocation</li>
            </ul>
          </div>
        </div>

        {/* Countries Section */}
        <div>
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Demographic Data for All {countries.length} Countries
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-2">
              Comprehensive demographic data with sorting, filtering, and search capabilities. Click any country to view detailed population pyramids and trends.
            </p>
          </div>

          <SortableCountryTable countries={countries} />
        </div>

        {/* About This Website */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">About This Population Data Platform</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* What We Provide */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Comprehensive Population Data Visualization</h3>
                <p className="text-gray-600 mb-4">
                  This platform provides interactive visualization and analysis of demographic data for all {countries.length} countries and territories 
                  recognized by the United Nations. Our database spans from 1950 to 2025, offering 75 years of comprehensive population insights.
                </p>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Interactive Features:</h4>
                <ul className="text-gray-600 space-y-2 mb-4">
                  <li>• <strong>World Population Pyramid:</strong> Animated visualization showing global age structure evolution from 1950-2025</li>
                  <li>• <strong>Individual Country Pages:</strong> Detailed population pyramids for each of the {countries.length} countries</li>
                  <li>• <strong>Sortable Data Tables:</strong> Complete demographic statistics with sorting, filtering, and search capabilities</li>
                  <li>• <strong>Real-time Statistics:</strong> Current world population of {(totalWorldPop2024 / 1000000000).toFixed(2)} billion with {worldGrowthPercent.toFixed(2)}% growth since 2000</li>
                  <li>• <strong>Mobile Responsive:</strong> Full functionality across desktop, tablet, and mobile devices</li>
                </ul>
              </div>

              {/* Data Coverage */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Extensive Data Coverage</h3>
                <p className="text-gray-600 mb-4">
                  Every country page and dataset includes comprehensive demographic indicators sourced directly from the 
                  UN World Population Prospects 2024 Revision, providing the most current and authoritative population data available.
                </p>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Available Metrics:</h4>
                <ul className="text-gray-600 space-y-2 mb-4">
                  <li>• <strong>Total Population:</strong> Annual population figures from 1950-2025</li>
                  <li>• <strong>Age Structure:</strong> 21 age groups (0-4, 5-9, ..., 95-99, 100+) with male/female breakdown</li>
                  <li>• <strong>Median Age:</strong> Population age distribution midpoint for demographic analysis</li>
                  <li>• <strong>Growth Rates:</strong> Population change percentages and absolute numbers</li>
                  <li>• <strong>Dependency Ratios:</strong> Economic burden calculations for non-working age populations</li>
                  <li>• <strong>Youth Demographics:</strong> Under-15 population percentages (0-4, 5-9, 10-14 age groups)</li>
                  <li>• <strong>Elderly Demographics:</strong> 65+ population percentages across all senior age groups</li>
                  <li>• <strong>Regional Classifications:</strong> UN geographic region groupings for comparative analysis</li>
                </ul>
              </div>

              {/* Technical Implementation */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Implementation</h3>
                <p className="text-gray-600 mb-4">
                  Built with modern web technologies to ensure fast, reliable access to demographic data visualization 
                  and analysis tools for researchers, policymakers, educators, and the general public.
                </p>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Platform Features:</h4>
                <ul className="text-gray-600 space-y-2 mb-4">
                  <li>• <strong>Performance Optimized:</strong> Cached data processing for instant visualization loading</li>
                  <li>• <strong>Interactive Charts:</strong> Chart.js powered population pyramids with hover tooltips and animations</li>
                  <li>• <strong>Advanced Filtering:</strong> Search by country name, code, or filter by UN geographic regions</li>
                  <li>• <strong>Data Export Ready:</strong> Structured data suitable for research and analysis applications</li>
                  <li>• <strong>Accessible Design:</strong> Screen reader compatible with semantic HTML structure</li>
                  <li>• <strong>Direct Linking:</strong> Individual country URLs for easy sharing and bookmarking</li>
                </ul>
              </div>

              {/* Use Cases */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Applications and Use Cases</h3>
                <p className="text-gray-600 mb-4">
                  This platform serves diverse users requiring accurate, up-to-date demographic data for various 
                  professional, academic, and personal research needs.
                </p>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Primary Users:</h4>
                <ul className="text-gray-600 space-y-2 mb-4">
                  <li>• <strong>Academic Researchers:</strong> Demographic transition studies, population geography, and social science research</li>
                  <li>• <strong>Government Planners:</strong> Policy development, infrastructure planning, and resource allocation analysis</li>
                  <li>• <strong>Business Analysts:</strong> Market research, consumer demographics, and international expansion planning</li>
                  <li>• <strong>NGO Organizations:</strong> Development aid allocation, humanitarian planning, and impact assessment</li>
                  <li>• <strong>Students and Educators:</strong> Demographic education, geography curriculum, and population studies</li>
                  <li>• <strong>Media and Journalists:</strong> Factual demographic reporting and data-driven storytelling</li>
                  <li>• <strong>General Public:</strong> Understanding global population trends and country-specific demographics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Data Source Citation */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Authoritative Data Source</h3>
            <p className="text-gray-600 mb-4">
              All demographic data is sourced directly from the United Nations Department of Economic and Social Affairs, 
              Population Division. World Population Prospects 2024 Revision. This ensures the highest level of accuracy, 
              consistency, and international standardization across all {countries.length} countries and territories.
            </p>
            <p className="text-gray-600 mb-4">
              The UN World Population Prospects represents the official United Nations population estimates and projections, 
              prepared by the Population Division of the Department of Economic and Social Affairs. These estimates are 
              used throughout the UN system and serve as the standard demographic reference for international organizations, 
              governments, and research institutions worldwide.
            </p>
            <a 
              href="https://population.un.org/wpp/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition"
            >
              Visit Official UN Population Database
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}