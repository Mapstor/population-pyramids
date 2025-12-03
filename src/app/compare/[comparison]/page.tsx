import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ComparisonPageClient from '@/components/ComparisonPageClient';

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
    title: 'USA vs Mexico Population Comparison: North American Neighbors Demographics 2025',
    description: 'Compare USA and Mexico population pyramids. Demographic analysis of NAFTA/USMCA partners including migration patterns, economic integration, and age structure differences across the Rio Grande.',
    country1: 'united-states',
    country2: 'mexico',
    country1Name: 'United States',
    country2Name: 'Mexico'
  },
  'usa-vs-uk': {
    title: 'USA vs UK Population Comparison: Anglo-American Demographics 2025',
    description: 'Compare USA and United Kingdom population pyramids. Demographic analysis of special relationship allies including colonial legacy, shared language, economic ties, and divergent population trends.',
    country1: 'united-states',
    country2: 'united-kingdom',
    country1Name: 'United States',
    country2Name: 'United Kingdom'
  },
  'uk-vs-germany': {
    title: 'UK vs Germany Population Comparison: European Powers Demographics 2025',
    description: 'Compare UK and Germany population pyramids. Demographic analysis of major European nations including Brexit impacts, aging societies, economic powerhouses, and post-war demographic transitions.',
    country1: 'united-kingdom',
    country2: 'germany',
    country1Name: 'United Kingdom',
    country2Name: 'Germany'
  },
  'uk-vs-france': {
    title: 'UK vs France Population Comparison: Channel Neighbors Demographics 2025',
    description: 'Compare UK and France population pyramids. Demographic analysis of historic rivals and EU neighbors including Brexit divide, cultural policies, aging societies, and cross-Channel migration patterns.',
    country1: 'united-kingdom',
    country2: 'france',
    country1Name: 'United Kingdom',
    country2Name: 'France'
  },
  'japan-vs-germany': {
    title: 'Japan vs Germany Population Comparison: Aging Powerhouses Demographics 2025',
    description: 'Compare Japan and Germany population pyramids. Demographic analysis of the world\'s most rapidly aging developed economies including shrinking populations, workforce challenges, and economic implications.',
    country1: 'japan',
    country2: 'germany',
    country1Name: 'Japan',
    country2Name: 'Germany'
  },
  'india-vs-pakistan': {
    title: 'India vs Pakistan Population Comparison: Partition Legacy Demographics 2025',
    description: 'Compare India and Pakistan population pyramids. Demographic analysis of South Asian neighbors including partition history, growth trajectories, urbanization patterns, and regional development.',
    country1: 'india',
    country2: 'pakistan',
    country1Name: 'India',
    country2Name: 'Pakistan'
  },
  'india-vs-bangladesh': {
    title: 'India vs Bangladesh Population Comparison: Bengal Division Demographics 2025',
    description: 'Compare India and Bangladesh population pyramids. Demographic analysis of Bangladesh liberation legacy, population density challenges, economic development patterns, and South Asian regional dynamics.',
    country1: 'india',
    country2: 'bangladesh',
    country1Name: 'India',
    country2Name: 'Bangladesh'
  },
};

export async function generateMetadata({ params }: { params: { comparison: string } }): Promise<Metadata> {
  const comparisonData = COMPARISON_METADATA[params.comparison];
  
  if (!comparisonData) {
    return {
      title: 'Comparison Not Found',
      description: 'This population comparison page does not exist.'
    };
  }

  const ogImageUrl = `/api/og/comparison?country1=${comparisonData.country1}&country2=${comparisonData.country2}`;

  return {
    title: comparisonData.title,
    description: comparisonData.description,
    keywords: [
      `${comparisonData.country1Name} vs ${comparisonData.country2Name}`,
      `${comparisonData.country1Name} ${comparisonData.country2Name} population comparison`,
      `${comparisonData.country1Name} ${comparisonData.country2Name} demographics`,
      'population pyramid comparison',
      'demographic comparison 2025',
      'age structure comparison',
      'sex ratio comparison',
      `${comparisonData.country1Name} population 2025`,
      `${comparisonData.country2Name} population 2025`
    ],
    openGraph: {
      title: comparisonData.title,
      description: comparisonData.description,
      type: 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${comparisonData.country1Name} vs ${comparisonData.country2Name} Population Pyramid Comparison 2025`,
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

export default function ComparisonPage({ params }: { params: { comparison: string } }) {
  if (!VALID_COMPARISONS.includes(params.comparison)) {
    notFound();
  }

  const comparisonData = COMPARISON_METADATA[params.comparison];
  
  if (!comparisonData) {
    // For comparisons not yet fully configured, use basic setup
    const [country1Slug, , country2Slug] = params.comparison.split('-');
    return (
      <ComparisonPageClient
        comparison={params.comparison}
        country1Slug={country1Slug}
        country2Slug={country2Slug}
        country1Name={country1Slug}
        country2Name={country2Slug}
      />
    );
  }

  return (
    <ComparisonPageClient
      comparison={params.comparison}
      country1Slug={comparisonData.country1}
      country2Slug={comparisonData.country2}
      country1Name={comparisonData.country1Name}
      country2Name={comparisonData.country2Name}
    />
  );
}

export async function generateStaticParams() {
  return VALID_COMPARISONS.map((comparison) => ({
    comparison,
  }));
}