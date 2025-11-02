import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Population Pyramids Platform',
  description: 'Learn about our demographic visualization platform providing interactive population data for 195 countries. Built on UN World Population Prospects 2024 data with comprehensive analysis tools.',
  openGraph: {
    title: 'About - Population Pyramids Platform',
    description: 'Learn about our demographic visualization platform providing interactive population data for 195 countries. Built on UN World Population Prospects 2024 data.',
    url: 'https://populationpyramids.org/about',
  },
  twitter: {
    title: 'About - Population Pyramids Platform',
    description: 'Learn about our demographic visualization platform providing interactive population data for 195 countries.',
  },
};

// JSON-LD Schema for About page
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  mainEntity: {
    '@type': 'SoftwareApplication',
    name: 'Population Pyramids',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Interactive demographic visualization platform providing comprehensive population data for 195 countries from 1950-2025.',
    url: 'https://populationpyramids.org',
    author: {
      '@type': 'Organization',
      name: 'Population Pyramids',
    },
    sourceOrganization: {
      '@type': 'Organization',
      name: 'United Nations Department of Economic and Social Affairs, Population Division',
      url: 'https://population.un.org',
    },
    applicationSubCategory: 'Demographics and Population Analysis',
    featureList: [
      'Interactive population pyramids for 195 countries',
      'Animated world population visualization',
      'Demographic data from 1950-2025',
      'Age structure analysis tools',
      'Gender distribution charts',
      'Population growth statistics',
      'Mobile-responsive design',
      'Real-time data filtering and sorting'
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            About This Demographics Platform
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Comprehensive demographic visualization and analysis platform providing interactive access to population data 
            from the United Nations World Population Prospects 2024 Revision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Mission and Purpose */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Mission and Purpose</h2>
            <p className="text-gray-700 mb-4">
              This platform democratizes access to authoritative demographic data by providing interactive, user-friendly 
              visualizations of population statistics from the United Nations. We transform complex demographic datasets 
              into accessible, visual formats that serve researchers, educators, policymakers, and the general public.
            </p>
            <p className="text-gray-700 mb-4">
              Our goal is to make demographic analysis more accessible and intuitive through interactive population pyramids, 
              comprehensive data tables, and animated visualizations that reveal demographic trends across time and geography.
            </p>
            <p className="text-gray-700">
              By providing direct access to UN demographic data in an interactive format, we support evidence-based 
              decision making, academic research, and public understanding of global population dynamics.
            </p>
          </div>

          {/* Platform Scope */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Platform Scope</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Geographic Coverage</h3>
                <p className="text-gray-700">
                  Complete coverage of all 195 countries and territories recognized by the United Nations, 
                  ensuring global representation across all continents and regions.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Temporal Coverage</h3>
                <p className="text-gray-700">
                  Historical and projected population data spanning 75 years from 1950 to 2025, 
                  providing comprehensive demographic analysis across three-quarters of a century.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Granularity</h3>
                <p className="text-gray-700">
                  Age-specific population data broken down into 21 five-year age groups (0-4, 5-9, through 100+), 
                  with complete male and female population breakdowns for detailed demographic analysis.
                </p>
              </div>
            </div>
          </div>

          {/* Platform Features */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Platform Features</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Interactive World Population Pyramid</h3>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Animated progression through 75 years of global demographic change</li>
                  <li>• Manual year selection with responsive slider controls</li>
                  <li>• Playback speed adjustment for detailed analysis</li>
                  <li>• Real-time statistics display for population totals and median age</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Individual Country Analysis</h3>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Dedicated pages for each of the 195 countries and territories</li>
                  <li>• Interactive population pyramids with year-by-year progression</li>
                  <li>• Hover tooltips showing exact population figures by age and gender</li>
                  <li>• Direct URL access for easy sharing and bookmarking</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Advanced Data Analysis Tools</h3>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Sortable data tables with multiple demographic indicators</li>
                  <li>• Search functionality by country name or ISO code</li>
                  <li>• Regional filtering based on UN geographic classifications</li>
                  <li>• Comparative analysis across population growth, age structure, and dependency ratios</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Methodology */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Data Methodology</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Source Authority</h3>
                <p className="text-gray-700">
                  All demographic data originates from the UN World Population Prospects 2024 Revision, 
                  prepared by the Population Division of the UN Department of Economic and Social Affairs. 
                  This represents the most authoritative and internationally recognized demographic dataset available.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Processing</h3>
                <p className="text-gray-700">
                  Population figures are aggregated and processed to generate world-level statistics while 
                  maintaining country-specific detail. Median ages are calculated using population-weighted 
                  averages to ensure accurate global demographic indicators.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assurance</h3>
                <p className="text-gray-700">
                  Data integrity is maintained through direct import of UN datasets without modification, 
                  ensuring that all demographic indicators reflect the official UN estimates and projections 
                  used by international organizations and governments worldwide.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Architecture */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Technical Architecture</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Optimization</h3>
                <p className="text-gray-700">
                  Built with Next.js and optimized for fast loading through data caching, 
                  static generation, and efficient data aggregation to ensure responsive 
                  performance across all demographic visualizations.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Visualization Technology</h3>
                <p className="text-gray-700">
                  Chart.js powers all population pyramid visualizations, providing smooth animations, 
                  interactive tooltips, and responsive design that works across desktop and mobile devices.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Accessibility Standards</h3>
                <p className="text-gray-700">
                  Designed with semantic HTML structure, screen reader compatibility, 
                  and keyboard navigation support to ensure accessibility for users with disabilities.
                </p>
              </div>
            </div>
          </div>

          {/* Understanding Population Pyramids */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Understanding Population Pyramids</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Visual Structure</h3>
                <p className="text-gray-700">
                  Population pyramids display age structure using horizontal bars where males appear 
                  on the left (blue) and females on the right (pink). Age groups progress from youngest 
                  at the bottom to oldest at the top, with bar width indicating population size.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pyramid Shapes and Their Meaning</h3>
                <ul className="text-gray-700 space-y-2 ml-4">
                  <li>• <strong>Expansive (Triangle):</strong> Wide base indicates high birth rates and young population</li>
                  <li>• <strong>Constrictive (Inverted):</strong> Narrow base shows low birth rates and aging population</li>
                  <li>• <strong>Stationary (Rectangle):</strong> Uniform width suggests stable birth and death rates</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Demographic Indicators</h3>
                <p className="text-gray-700">
                  Our platform calculates key demographic indicators including dependency ratios 
                  (economic burden of non-working age populations), youth percentages (under-15 populations), 
                  and elderly percentages (65+ populations) to provide comprehensive demographic analysis.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mt-12 sm:mt-16">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Platform Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Academic and Research</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Demographic transition research</li>
                  <li>• Population geography studies</li>
                  <li>• Social science analysis</li>
                  <li>• Comparative demographic research</li>
                  <li>• Educational curriculum support</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Government and Policy</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Infrastructure planning</li>
                  <li>• Healthcare system planning</li>
                  <li>• Education capacity planning</li>
                  <li>• Social security analysis</li>
                  <li>• Economic development planning</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business and Development</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Market research and analysis</li>
                  <li>• International expansion planning</li>
                  <li>• Consumer demographic analysis</li>
                  <li>• Development aid allocation</li>
                  <li>• Investment decision support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Data Citation */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Official Data Citation</h3>
            <p className="text-gray-700 mb-6 max-w-4xl mx-auto">
              United Nations, Department of Economic and Social Affairs, Population Division (2024). 
              World Population Prospects 2024, Online Edition.
            </p>
            <a 
              href="https://population.un.org/wpp/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-lg transition"
            >
              Access Official UN Population Database
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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