import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SideBySidePyramids from '@/components/SideBySidePyramids';
import AnimatedComparisonPyramids from '@/components/AnimatedComparisonPyramids';
import SuperimposedPyramid from '@/components/SuperimposedPyramid';
import SexRatioComparison from '@/components/SexRatioComparison';
import DemographicMetricsComparison from '@/components/DemographicMetricsComparison';
import KeyMetricsDashboard from '@/components/KeyMetricsDashboard';
import FertilityTimelineChart from '@/components/FertilityTimelineChart';
import PopulationMilestoneChart from '@/components/PopulationMilestoneChart';
import ComparisonFAQ from '@/components/ComparisonFAQ';
import ComparisonStructuredData from '@/components/ComparisonStructuredData';
import { calculateMetrics } from '@/lib/calculations';
import type { CountryData, YearData } from '@/types/population';
import populationRankings from '@/data/population-rankings-2025.json';

// Define all valid comparison pairs
const VALID_COMPARISONS = [
  'china-vs-india',
  'usa-vs-china',
  'usa-vs-india',
  'usa-vs-russia',
  'usa-vs-brazil',
  'usa-vs-indonesia',
  'india-vs-indonesia',
  'india-vs-brazil',
  'china-vs-brazil',
  'usa-vs-mexico',
  'usa-vs-uk',
  'uk-vs-germany',
  'uk-vs-france',
  'japan-vs-germany',
  'india-vs-pakistan',
  'india-vs-bangladesh',
];

// Metadata for each comparison
const COMPARISON_METADATA: Record<string, {
  title: string;
  description: string;
  country1: string;
  country2: string;
  country1Name: string;
  country2Name: string;
}> = {
  'china-vs-india': {
    title: 'Population Comparison: China vs India (2025 Data)',
    description: 'Compare population pyramids of China and India. Detailed demographic analysis including age structure, sex ratio, growth trends, and future projections for 2025.',
    country1: 'china',
    country2: 'india',
    country1Name: 'China',
    country2Name: 'India'
  },
  'usa-vs-china': {
    title: 'USA vs China Demographics: Population Pyramid Analysis 2025',
    description: 'Compare USA and China population structures. Age distribution, sex ratios, demographic trends, and population pyramid comparison with 2025 data.',
    country1: 'united-states',
    country2: 'china',
    country1Name: 'United States',
    country2Name: 'China'
  },
  'usa-vs-india': {
    title: 'United States and India Population Structure Compared | 2025',
    description: 'USA vs India population pyramid comparison. Analyze demographic differences, age structures, sex ratios, and growth patterns with latest 2025 UN data.',
    country1: 'united-states',
    country2: 'india',
    country1Name: 'United States',
    country2Name: 'India'
  },
  'usa-vs-russia': {
    title: 'USA vs Russia Population Comparison: Cold War Rivals Demographics 2025',
    description: 'Compare USA and Russia population pyramids. Demographic analysis of former Cold War rivals including population decline, aging societies, and geopolitical implications.',
    country1: 'united-states',
    country2: 'russia',
    country1Name: 'United States',
    country2Name: 'Russia'
  },
  'usa-vs-brazil': {
    title: 'USA vs Brazil Population Comparison: Americas Powerhouses Demographics 2025',
    description: 'Compare USA and Brazil population pyramids. Demographic analysis of the Americas largest economies including youth demographics, urbanization, and economic development patterns.',
    country1: 'united-states',
    country2: 'brazil',
    country1Name: 'United States',
    country2Name: 'Brazil'
  },
  'usa-vs-indonesia': {
    title: 'USA vs Indonesia Population Comparison: Pacific Powerhouses Demographics 2025',
    description: 'Compare USA and Indonesia population pyramids. Demographic analysis of Pacific Rim nations including archipelago demographics, economic development, and cultural diversity patterns.',
    country1: 'united-states',
    country2: 'indonesia',
    country1Name: 'United States',
    country2Name: 'Indonesia'
  },
  'india-vs-indonesia': {
    title: 'India vs Indonesia Population Comparison: Asian Giants Demographics 2025',
    description: 'Compare India and Indonesia population pyramids. Demographic analysis of Asian powerhouses including population growth, urbanization trends, and economic development patterns.',
    country1: 'india',
    country2: 'indonesia',
    country1Name: 'India',
    country2Name: 'Indonesia'
  },
  'india-vs-brazil': {
    title: 'India vs Brazil Population Comparison: Global South Powers Demographics 2025',
    description: 'Compare India and Brazil population pyramids. Demographic analysis of emerging economy giants including BRICS cooperation, development trajectories, and economic potential.',
    country1: 'india',
    country2: 'brazil',
    country1Name: 'India',
    country2Name: 'Brazil'
  },
  'china-vs-brazil': {
    title: 'China vs Brazil Population Comparison: East-West Powerhouses Demographics 2025',
    description: 'Compare China and Brazil population pyramids. Demographic analysis of major BRICS partners including aging China vs young Brazil, economic development patterns, and population structure contrasts.',
    country1: 'china',
    country2: 'brazil',
    country1Name: 'China',
    country2Name: 'Brazil'
  },
  'usa-vs-mexico': {
    title: 'USA vs Mexico Demographics: North American Neighbors Population Analysis 2025',
    description: 'Compare USA and Mexico population structures. Analyze demographic trends, migration patterns, age distributions, and economic implications for North America\'s largest partners.',
    country1: 'united-states',
    country2: 'mexico',
    country1Name: 'United States',
    country2Name: 'Mexico'
  },
  'usa-vs-uk': {
    title: 'USA vs UK Population Comparison: Special Relationship Demographics 2025',
    description: 'Compare USA and UK population pyramids. Demographic analysis of Anglo-American partners including aging populations, immigration impacts, and post-Brexit demographic shifts.',
    country1: 'united-states',
    country2: 'united-kingdom',
    country1Name: 'United States',
    country2Name: 'United Kingdom'
  },
  'uk-vs-germany': {
    title: 'UK vs Germany Demographics: European Powerhouses Population Analysis 2025',
    description: 'Compare UK and Germany population structures. Analyze post-Brexit demographics, aging societies, immigration patterns, and economic implications for Europe\'s largest economies.',
    country1: 'united-kingdom',
    country2: 'germany',
    country1Name: 'United Kingdom',
    country2Name: 'Germany'
  },
  'uk-vs-france': {
    title: 'UK vs France Population Comparison: Channel Rivals Demographics 2025',
    description: 'Compare UK and France population pyramids. Demographic analysis of historic rivals including birth rates, immigration patterns, and contrasting approaches to population growth.',
    country1: 'united-kingdom',
    country2: 'france',
    country1Name: 'United Kingdom',
    country2Name: 'France'
  },
  'japan-vs-germany': {
    title: 'Japan vs Germany Demographics: Export Powerhouses Population Crisis 2025',
    description: 'Compare Japan and Germany population pyramids. Two export giants facing similar demographic challenges - aging populations, declining birth rates, and shrinking workforces.',
    country1: 'japan',
    country2: 'germany',
    country1Name: 'Japan',
    country2Name: 'Germany'
  },
  'india-vs-pakistan': {
    title: 'India vs Pakistan Population Comparison: South Asian Rivals Demographics 2025',
    description: 'Compare India and Pakistan population pyramids. Demographic analysis of partition neighbors including youth bulges, urbanization rates, and demographic dividend opportunities.',
    country1: 'india',
    country2: 'pakistan',
    country1Name: 'India',
    country2Name: 'Pakistan'
  },
  'india-vs-bangladesh': {
    title: 'India vs Bangladesh Demographics: Bengal Region Population Analysis 2025',
    description: 'Compare India and Bangladesh population structures. Analyze demographic transitions, fertility decline, population density challenges, and economic development patterns in South Asia.',
    country1: 'india',
    country2: 'bangladesh',
    country1Name: 'India',
    country2Name: 'Bangladesh'
  }
};

export async function generateMetadata({ params }: { params: { comparison: string } }): Promise<Metadata> {
  const comparisonData = COMPARISON_METADATA[params.comparison];
  
  if (!comparisonData) {
    return {
      title: 'Population Comparison',
      description: 'Compare population pyramids and demographic data between countries.'
    };
  }

  const ogImageUrl = `https://populationpyramids.org/og-image.png`;

  return {
    title: comparisonData.title,
    description: comparisonData.description,
    openGraph: {
      title: comparisonData.title,
      description: comparisonData.description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${comparisonData.country1Name} vs ${comparisonData.country2Name} Population Comparison`
        }
      ],
      siteName: 'Population Pyramids',
    },
    twitter: {
      card: 'summary_large_image',
      title: comparisonData.title,
      description: comparisonData.description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `/compare/${params.comparison}`
    }
  };
}

// Server-side data loading function
async function loadComparisonData(country1Slug: string, country2Slug: string) {
  try {
    // Load both country data and fertility files
    const [data1Module, data2Module, fertility1Module, fertility2Module] = await Promise.all([
      import(`@/data/population/${country1Slug}.json`),
      import(`@/data/population/${country2Slug}.json`),
      import(`@/data/fertility/${country1Slug}.json`).catch(() => null),
      import(`@/data/fertility/${country2Slug}.json`).catch(() => null)
    ]);
    
    return {
      country1Data: data1Module.default as CountryData,
      country2Data: data2Module.default as CountryData,
      country1Fertility: fertility1Module?.default?.fertilityData || null,
      country2Fertility: fertility2Module?.default?.fertilityData || null
    };
  } catch (error) {
    console.error('Error loading country data:', error);
    return null;
  }
}

// Helper function to format population
function formatPopulation(population: number): string {
  if (population >= 1_000_000_000) {
    return `${(population / 1_000_000_000).toFixed(2)}B`;
  } else {
    return `${(population / 1_000_000).toFixed(0)}M`;
  }
}

// Main page component - now server-side rendered
export default async function ComparisonPage({ params }: { params: { comparison: string } }) {
  if (!VALID_COMPARISONS.includes(params.comparison)) {
    notFound();
  }

  const comparisonData = COMPARISON_METADATA[params.comparison];
  
  if (!comparisonData) {
    notFound();
  }

  // Load data server-side
  const data = await loadComparisonData(comparisonData.country1, comparisonData.country2);
  
  if (!data) {
    notFound();
  }

  const { country1Data, country2Data, country1Fertility, country2Fertility } = data;
  
  // Use 2025 data or fallback to 2024
  const selectedYear = 2025;
  const currentYear1Data = country1Data.years[selectedYear] || country1Data.years[2024];
  const currentYear2Data = country2Data.years[selectedYear] || country2Data.years[2024];
  const metrics1 = calculateMetrics(currentYear1Data);
  const metrics2 = calculateMetrics(currentYear2Data);

  // Get country rankings
  const country1Rank = populationRankings.rankings.find(r => r.slug === comparisonData.country1);
  const country2Rank = populationRankings.rankings.find(r => r.slug === comparisonData.country2);

  // Generate demographic analysis text for SEO
  const demographicAnalysis = generateDemographicAnalysis(
    comparisonData,
    currentYear1Data,
    currentYear2Data,
    metrics1,
    metrics2,
    country1Rank,
    country2Rank
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured Data */}
      <ComparisonStructuredData
        country1Name={comparisonData.country1Name}
        country2Name={comparisonData.country2Name}
        country1Data={currentYear1Data}
        country2Data={currentYear2Data}
        year={selectedYear}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="text-sm breadcrumbs">
            <Link href="/" className="text-blue-600 hover:underline">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link href="/compare" className="text-blue-600 hover:underline">Compare</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700">{comparisonData.country1Name} vs {comparisonData.country2Name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {comparisonData.country1Name} vs {comparisonData.country2Name}: Population Comparison {selectedYear}
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          {comparisonData.description}
        </p>

        {/* Key Metrics Dashboard - Server Rendered */}
        <KeyMetricsDashboard
          country1Name={comparisonData.country1Name}
          country2Name={comparisonData.country2Name}
          country1Data={currentYear1Data}
          country2Data={currentYear2Data}
          year={selectedYear}
        />

        {/* Side by Side Pyramids - Server Rendered */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Population Pyramids Comparison
          </h2>
          <SideBySidePyramids
            country1Data={currentYear1Data}
            country2Data={currentYear2Data}
            country1Name={comparisonData.country1Name}
            country2Name={comparisonData.country2Name}
            year={selectedYear}
          />
        </div>

        {/* Demographic Analysis Text - Critical for SEO */}
        <div className="prose prose-lg max-w-none bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Demographic Analysis: {comparisonData.country1Name} vs {comparisonData.country2Name}
          </h2>
          
          {demographicAnalysis.map((paragraph, index) => (
            <p key={index} className="text-gray-700 mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Comparison Data Table - Server Rendered */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Key Demographic Indicators
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Indicator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {comparisonData.country1Name}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {comparisonData.country2Name}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difference
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Total Population
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPopulation(currentYear1Data.totalPopulation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPopulation(currentYear2Data.totalPopulation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPopulation(Math.abs(currentYear1Data.totalPopulation - currentYear2Data.totalPopulation))}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Median Age
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {currentYear1Data.medianAge.toFixed(1)} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {currentYear2Data.medianAge.toFixed(1)} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.abs(currentYear1Data.medianAge - currentYear2Data.medianAge).toFixed(1)} years
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Sex Ratio (M/F)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {metrics1.sexRatio.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {metrics2.sexRatio.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.abs(metrics1.sexRatio - metrics2.sexRatio).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Dependency Ratio
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {metrics1.dependencyRatio.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {metrics2.dependencyRatio.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.abs(metrics1.dependencyRatio - metrics2.dependencyRatio).toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      World Ranking
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{country1Rank?.rank || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{country2Rank?.rank || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {country1Rank && country2Rank ? Math.abs(country1Rank.rank - country2Rank.rank) : 'N/A'} places
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Other comparison components */}
        <SuperimposedPyramid
          country1Data={currentYear1Data}
          country2Data={currentYear2Data}
          country1Name={comparisonData.country1Name}
          country2Name={comparisonData.country2Name}
          year={selectedYear}
        />

        <AnimatedComparisonPyramids
          country1Data={country1Data}
          country2Data={country2Data}
          country1Name={comparisonData.country1Name}
          country2Name={comparisonData.country2Name}
        />

        <SexRatioComparison
          country1Data={country1Data}
          country2Data={country2Data}
          country1Name={comparisonData.country1Name}
          country2Name={comparisonData.country2Name}
        />

        <DemographicMetricsComparison
          country1Data={country1Data}
          country2Data={country2Data}
          country1Name={comparisonData.country1Name}
          country2Name={comparisonData.country2Name}
        />

        {country1Fertility && country2Fertility && (
          <FertilityTimelineChart
            country1Fertility={country1Fertility}
            country2Fertility={country2Fertility}
            country1Name={comparisonData.country1Name}
            country2Name={comparisonData.country2Name}
          />
        )}

        <PopulationMilestoneChart
          country1Data={country1Data}
          country2Data={country2Data}
          country1Name={comparisonData.country1Name}
          country2Name={comparisonData.country2Name}
        />

        <ComparisonFAQ
          country1Name={comparisonData.country1Name}
          country2Name={comparisonData.country2Name}
        />
      </div>
    </div>
  );
}

// Generate static params for all valid comparisons
export async function generateStaticParams() {
  return VALID_COMPARISONS.map((comparison) => ({
    comparison,
  }));
}

// Helper function to generate demographic analysis text
function generateDemographicAnalysis(
  comparisonData: any,
  data1: YearData,
  data2: YearData,
  metrics1: any,
  metrics2: any,
  rank1: any,
  rank2: any
): string[] {
  const paragraphs: string[] = [];
  
  // Population size comparison
  const popDiff = data1.totalPopulation - data2.totalPopulation;
  const popRatio = data1.totalPopulation / data2.totalPopulation;
  
  paragraphs.push(
    `In 2025, ${comparisonData.country1Name} has a population of ${formatPopulation(data1.totalPopulation)}, ` +
    `while ${comparisonData.country2Name} has ${formatPopulation(data2.totalPopulation)}. ` +
    `This represents a difference of ${formatPopulation(Math.abs(popDiff))}, with ${popDiff > 0 ? comparisonData.country1Name : comparisonData.country2Name} ` +
    `having ${Math.abs(popRatio > 1 ? popRatio : 1/popRatio).toFixed(1)} times the population of the other. ` +
    `${comparisonData.country1Name} ranks ${rank1?.rank || 'N/A'} globally by population size, ` +
    `while ${comparisonData.country2Name} ranks ${rank2?.rank || 'N/A'}.`
  );
  
  // Age structure comparison
  const ageDiff = data1.medianAge - data2.medianAge;
  paragraphs.push(
    `The median age reveals significant demographic differences: ${comparisonData.country1Name} has a median age of ${data1.medianAge.toFixed(1)} years, ` +
    `compared to ${data2.medianAge.toFixed(1)} years in ${comparisonData.country2Name}. ` +
    `This ${Math.abs(ageDiff).toFixed(1)}-year difference indicates that ${ageDiff > 0 ? comparisonData.country1Name : comparisonData.country2Name} ` +
    `has a significantly older population, with important implications for workforce dynamics, healthcare needs, and economic development. ` +
    `The dependency ratio in ${comparisonData.country1Name} is ${metrics1.dependencyRatio.toFixed(1)}%, ` +
    `while in ${comparisonData.country2Name} it is ${metrics2.dependencyRatio.toFixed(1)}%, ` +
    `showing the relative burden of non-working age populations on the workforce.`
  );
  
  // Gender balance comparison
  paragraphs.push(
    `Gender balance differs between the two countries: ${comparisonData.country1Name} has a sex ratio of ${metrics1.sexRatio.toFixed(2)} males per female, ` +
    `while ${comparisonData.country2Name} has ${metrics2.sexRatio.toFixed(2)}. ` +
    `${metrics1.sexRatio > metrics2.sexRatio ? comparisonData.country1Name : comparisonData.country2Name} shows a higher proportion of males, ` +
    `which can affect marriage markets, labor force composition, and social dynamics. ` +
    `These ratios reflect various factors including sex-selective practices, differential mortality rates, and migration patterns.`
  );
  
  return paragraphs;
}