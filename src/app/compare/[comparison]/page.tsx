import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import SideBySidePyramids from '@/components/SideBySidePyramids';
import AnimatedComparisonPyramids from '@/components/AnimatedComparisonPyramids';
import SuperimposedPyramid from '@/components/SuperimposedPyramid';
import DemographicMetricsComparison from '@/components/DemographicMetricsComparison';
import KeyMetricsDashboard from '@/components/KeyMetricsDashboard';
import FertilityTimelineChart from '@/components/FertilityTimelineChart';
import PopulationMilestoneChart from '@/components/PopulationMilestoneChart';
import ComparisonFAQ from '@/components/ComparisonFAQ';
import ComparisonStructuredData from '@/components/ComparisonStructuredData';
import { calculateMetrics } from '@/lib/calculations';
import type { CountryData, YearData } from '@/types/population';
import populationRankings from '@/data/population-rankings-2025.json';
import { COMPARISON_PAIRS } from '@/lib/comparison-pairs';
import { 
  calculateGrowthRate, 
  calculateProjectedGrowth, 
  calculateBirthRate,
  getYouthBulge,
  getWorkforceShare 
} from '@/lib/comparison-metrics';
import { getRelatedComparisons } from '@/lib/country-comparison-links';

// Get all valid comparison slugs from the imported pairs
const VALID_COMPARISONS = COMPARISON_PAIRS.map(pair => pair.slug);

// Build metadata lookup from COMPARISON_PAIRS
const COMPARISON_METADATA: Record<string, {
  title: string;
  description: string;
  country1: string;
  country2: string;
  country1Name: string;
  country2Name: string;
}> = COMPARISON_PAIRS.reduce((acc, pair) => {
  acc[pair.slug] = {
    title: pair.title,
    description: pair.description,
    country1: pair.country1,
    country2: pair.country2,
    country1Name: pair.country1Name,
    country2Name: pair.country2Name
  };
  return acc;
}, {} as any);

// Legacy metadata for backward compatibility (will be overridden by new pairs if they match)
const LEGACY_METADATA = {
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

// Merge legacy metadata with new metadata (new takes precedence)
Object.assign(COMPARISON_METADATA, LEGACY_METADATA);

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
    // Load both country data and fertility files with better error handling
    const [data1Module, data2Module, fertility1Module, fertility2Module] = await Promise.all([
      import(`@/data/population/${country1Slug}.json`).catch(() => {
        console.error(`Failed to load population data for ${country1Slug}`);
        return null;
      }),
      import(`@/data/population/${country2Slug}.json`).catch(() => {
        console.error(`Failed to load population data for ${country2Slug}`);
        return null;
      }),
      import(`@/data/fertility/${country1Slug}.json`).catch(() => null),
      import(`@/data/fertility/${country2Slug}.json`).catch(() => null)
    ]);
    
    // If either country data is missing, return null
    if (!data1Module || !data2Module) {
      return null;
    }
    
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
  // First check if it's a predefined comparison
  let comparisonData = COMPARISON_METADATA[params.comparison];
  
  // If not predefined, try to parse it as a dynamic comparison
  if (!comparisonData) {
    const parts = params.comparison.split('-vs-');
    if (parts.length !== 2) {
      notFound();
    }
    
    let [country1Slug, country2Slug] = parts;
    
    // Check if the reverse order exists in predefined comparisons
    const reverseComparison = `${country2Slug}-vs-${country1Slug}`;
    if (COMPARISON_METADATA[reverseComparison]) {
      // Redirect to the canonical order
      redirect(`/compare/${reverseComparison}`);
    }
    
    // Try to load country names from data
    try {
      const countriesModule = await import('@/data/countries.json');
      const countries = countriesModule.default;
      
      const country1 = countries.find((c: any) => c.slug === country1Slug);
      const country2 = countries.find((c: any) => c.slug === country2Slug);
      
      if (!country1 || !country2) {
        notFound();
      }
      
      // Create dynamic comparison metadata
      comparisonData = {
        title: `${country1.name} vs ${country2.name}: Population Comparison`,
        description: `Compare the demographics, population pyramids, and age structures of ${country1.name} and ${country2.name}. Explore population trends, growth rates, and demographic indicators.`,
        country1: country1Slug,
        country2: country2Slug,
        country1Name: country1.name,
        country2Name: country2.name
      };
    } catch (error) {
      notFound();
    }
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
  
  // Calculate additional comparison metrics
  const growthRate1 = calculateGrowthRate(country1Data, selectedYear);
  const growthRate2 = calculateGrowthRate(country2Data, selectedYear);
  const projectedGrowth1 = calculateProjectedGrowth(country1Data, selectedYear, 2050);
  const projectedGrowth2 = calculateProjectedGrowth(country2Data, selectedYear, 2050);
  const birthRate1 = calculateBirthRate(currentYear1Data);
  const birthRate2 = calculateBirthRate(currentYear2Data);
  const youthBulge1 = getYouthBulge(currentYear1Data);
  const youthBulge2 = getYouthBulge(currentYear2Data);
  const workforceShare1 = getWorkforceShare(currentYear1Data);
  const workforceShare2 = getWorkforceShare(currentYear2Data);
  
  // Get fertility rates if available
  const fertilityRate1 = country1Fertility?.current?.totalFertilityRate || 
                         country1Fertility?.historical?.[country1Fertility.historical.length - 1]?.totalFertilityRate || 0;
  const fertilityRate2 = country2Fertility?.current?.totalFertilityRate || 
                         country2Fertility?.historical?.[country2Fertility.historical.length - 1]?.totalFertilityRate || 0;

  // Get country rankings (populationRankings is an object with country slugs as keys)
  const country1Rank = (populationRankings as any)[comparisonData.country1] || null;
  const country2Rank = (populationRankings as any)[comparisonData.country2] || null;
  
  // Get related comparisons
  const relatedComparisons = getRelatedComparisons(params.comparison);

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
        country1Pop={currentYear1Data.totalPopulation}
        country2Pop={currentYear2Data.totalPopulation}
        comparison={params.comparison}
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
          fertility1={fertilityRate1}
          fertility2={fertilityRate2}
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

        {/* Comprehensive Comparison Data Table - Server Rendered for SEO */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Comprehensive Demographic Comparison {selectedYear}
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
                      Difference / Ratio
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Population Metrics */}
                  <tr className="bg-blue-50">
                    <td colSpan={4} className="px-6 py-2 text-sm font-semibold text-blue-900">
                      Population Metrics
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Total Population ({selectedYear})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {formatPopulation(currentYear1Data.totalPopulation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {formatPopulation(currentYear2Data.totalPopulation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {currentYear1Data.totalPopulation > currentYear2Data.totalPopulation ? 
                        `${(currentYear1Data.totalPopulation / currentYear2Data.totalPopulation).toFixed(1)}x larger` :
                        `${(currentYear2Data.totalPopulation / currentYear1Data.totalPopulation).toFixed(1)}x smaller`}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      World Population Ranking
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      #{country1Rank || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      #{country2Rank || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {country1Rank && country2Rank ? `${Math.abs(country1Rank - country2Rank)} places apart` : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Population Growth Rate (5-year)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className={growthRate1 > 0 ? 'text-green-600' : 'text-red-600'}>
                        {growthRate1 > 0 ? '+' : ''}{growthRate1.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className={growthRate2 > 0 ? 'text-green-600' : 'text-red-600'}>
                        {growthRate2 > 0 ? '+' : ''}{growthRate2.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {Math.abs(growthRate1 - growthRate2).toFixed(2)}pp difference
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Projected Growth (2025-2050)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className={projectedGrowth1 > 0 ? 'text-green-600' : 'text-red-600'}>
                        {projectedGrowth1 > 0 ? '+' : ''}{projectedGrowth1.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className={projectedGrowth2 > 0 ? 'text-green-600' : 'text-red-600'}>
                        {projectedGrowth2 > 0 ? '+' : ''}{projectedGrowth2.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {Math.abs(projectedGrowth1 - projectedGrowth2).toFixed(2)}pp difference
                    </td>
                  </tr>

                  {/* Age Structure */}
                  <tr className="bg-green-50">
                    <td colSpan={4} className="px-6 py-2 text-sm font-semibold text-green-900">
                      Age Structure
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Median Age
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {currentYear1Data.medianAge.toFixed(1)} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {currentYear2Data.medianAge.toFixed(1)} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {Math.abs(currentYear1Data.medianAge - currentYear2Data.medianAge).toFixed(1)} years
                      {currentYear1Data.medianAge > currentYear2Data.medianAge ? ' older' : ' younger'}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Youth (0-14) Population
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {metrics1.youthPercentage.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {metrics2.youthPercentage.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {Math.abs(metrics1.youthPercentage - metrics2.youthPercentage).toFixed(1)}pp difference
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Working Age (15-64) Population
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {metrics1.workingAgePercentage.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {metrics2.workingAgePercentage.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {Math.abs(metrics1.workingAgePercentage - metrics2.workingAgePercentage).toFixed(1)}pp difference
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Elderly (65+) Population
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {metrics1.elderlyPercentage.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {metrics2.elderlyPercentage.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {Math.abs(metrics1.elderlyPercentage - metrics2.elderlyPercentage).toFixed(1)}pp difference
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Youth Bulge (15-29)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {youthBulge1.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {youthBulge2.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {Math.abs(youthBulge1 - youthBulge2).toFixed(1)}pp difference
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Prime Workforce (25-54)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {workforceShare1.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {workforceShare2.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {Math.abs(workforceShare1 - workforceShare2).toFixed(1)}pp difference
                    </td>
                  </tr>

                  {/* Demographic Indicators */}
                  <tr className="bg-purple-50">
                    <td colSpan={4} className="px-6 py-2 text-sm font-semibold text-purple-900">
                      Demographic Indicators
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Total Dependency Ratio
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {metrics1.dependencyRatio.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {metrics2.dependencyRatio.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {Math.abs(metrics1.dependencyRatio - metrics2.dependencyRatio).toFixed(1)}pp difference
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Child Dependency Ratio
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {metrics1.childDependencyRatio.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {metrics2.childDependencyRatio.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {Math.abs(metrics1.childDependencyRatio - metrics2.childDependencyRatio).toFixed(1)}pp difference
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Old-Age Dependency Ratio
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {metrics1.oldAgeDependencyRatio.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {metrics2.oldAgeDependencyRatio.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {Math.abs(metrics1.oldAgeDependencyRatio - metrics2.oldAgeDependencyRatio).toFixed(1)}pp difference
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Sex Ratio (males per 100 females)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {metrics1.sexRatio.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {metrics2.sexRatio.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {Math.abs(metrics1.sexRatio - metrics2.sexRatio).toFixed(1)} difference
                    </td>
                  </tr>
                  {fertilityRate1 > 0 && fertilityRate2 > 0 && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Total Fertility Rate
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {fertilityRate1.toFixed(2)} children/woman
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {fertilityRate2.toFixed(2)} children/woman
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {Math.abs(fertilityRate1 - fertilityRate2).toFixed(2)} difference
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Estimated Birth Rate
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {birthRate1.toFixed(1)} per 1,000
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {birthRate2.toFixed(1)} per 1,000
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {Math.abs(birthRate1 - birthRate2).toFixed(1)} difference
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Aging Index (65+/0-14)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {metrics1.agingIndex.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {metrics2.agingIndex.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {Math.abs(metrics1.agingIndex - metrics2.agingIndex).toFixed(1)}pp difference
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Population Pyramid Type
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="capitalize">{metrics1.pyramidType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="capitalize">{metrics2.pyramidType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {metrics1.pyramidType === metrics2.pyramidType ? 'Same type' : 'Different types'}
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


        <DemographicMetricsComparison
          metrics1={metrics1}
          metrics2={metrics2}
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
          comparison={params.comparison}
          country1Name={comparisonData.country1Name}
          country2Name={comparisonData.country2Name}
          country1Pop2025={currentYear1Data.totalPopulation}
          country2Pop2025={currentYear2Data.totalPopulation}
          country1Fertility={fertilityRate1}
          country2Fertility={fertilityRate2}
          country1MedianAge={currentYear1Data.medianAge}
          country2MedianAge={currentYear2Data.medianAge}
        />

        {/* Links to Individual Countries */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Explore Individual Countries
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href={`/${comparisonData.country1}`}
              className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">📊</span>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-blue-700">
                    {comparisonData.country1Name} Population Pyramid
                  </div>
                  <div className="text-sm text-gray-600">
                    View detailed demographics for {comparisonData.country1Name}
                  </div>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            <Link
              href={`/${comparisonData.country2}`}
              className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">📈</span>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-green-700">
                    {comparisonData.country2Name} Population Pyramid
                  </div>
                  <div className="text-sm text-gray-600">
                    View detailed demographics for {comparisonData.country2Name}
                  </div>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Related Comparisons */}
        {relatedComparisons.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Comparisons
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {relatedComparisons.map((comparison) => (
                <Link
                  key={comparison.slug}
                  href={`/compare/${comparison.slug}`}
                  className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <span className="text-xl mr-3">🔄</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 group-hover:text-blue-600">
                      {comparison.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {comparison.description}
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/compare"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Browse all comparisons
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Generate static params for all valid comparisons
export async function generateStaticParams() {
  return COMPARISON_PAIRS.map((pair) => ({
    comparison: pair.slug,
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
  
  if (rank1 && rank2) {
    paragraphs.push(
      `In 2025, ${comparisonData.country1Name} has a population of ${formatPopulation(data1.totalPopulation)}, ` +
      `while ${comparisonData.country2Name} has ${formatPopulation(data2.totalPopulation)}. ` +
      `This represents a difference of ${formatPopulation(Math.abs(popDiff))}, with ${popDiff > 0 ? comparisonData.country1Name : comparisonData.country2Name} ` +
      `having ${Math.abs(popRatio > 1 ? popRatio : 1/popRatio).toFixed(1)} times the population of the other. ` +
      `${comparisonData.country1Name} ranks #${rank1} globally by population size, ` +
      `while ${comparisonData.country2Name} ranks #${rank2}.`
    );
  } else {
    // Omit ranking sentence when either rank is missing
    paragraphs.push(
      `In 2025, ${comparisonData.country1Name} has a population of ${formatPopulation(data1.totalPopulation)}, ` +
      `while ${comparisonData.country2Name} has ${formatPopulation(data2.totalPopulation)}. ` +
      `This represents a difference of ${formatPopulation(Math.abs(popDiff))}, with ${popDiff > 0 ? comparisonData.country1Name : comparisonData.country2Name} ` +
      `having ${Math.abs(popRatio > 1 ? popRatio : 1/popRatio).toFixed(1)} times the population of the other.`
    );
  }
  
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