import { COMPARISON_PAIRS } from './comparison-pairs';

interface ComparisonLink {
  slug: string;
  label: string;
  partnerCountry: string;
  partnerCountrySlug: string;
  description: string;
}

// Get top 5 comparison links for a country
export function getTopComparisonsForCountry(countrySlug: string): ComparisonLink[] {
  // Find all comparisons involving this country
  const relevantComparisons = COMPARISON_PAIRS.filter(
    pair => pair.country1 === countrySlug || pair.country2 === countrySlug
  );

  // Sort by importance (superpowers and regional rivals first)
  const priorityOrder = ['superpower', 'regional', 'development', 'economic', 'vs-china', 'vs-usa'];
  
  const sortedComparisons = relevantComparisons.sort((a, b) => {
    const priorityA = priorityOrder.indexOf(a.category);
    const priorityB = priorityOrder.indexOf(b.category);
    return (priorityA === -1 ? 999 : priorityA) - (priorityB === -1 ? 999 : priorityB);
  });

  // Get top 5 and format them
  return sortedComparisons.slice(0, 5).map(pair => {
    const isCountry1 = pair.country1 === countrySlug;
    const partnerSlug = isCountry1 ? pair.country2 : pair.country1;
    const partnerName = isCountry1 ? pair.country2Name : pair.country1Name;
    
    return {
      slug: pair.slug,
      label: `vs ${partnerName}`,
      partnerCountry: partnerName,
      partnerCountrySlug: partnerSlug,
      description: pair.description
    };
  });
}

// Get related comparisons for a comparison page
export function getRelatedComparisons(comparisonSlug: string, limit: number = 6): ComparisonLink[] {
  const currentPair = COMPARISON_PAIRS.find(p => p.slug === comparisonSlug);
  if (!currentPair) return [];

  // Find comparisons that share at least one country
  const relatedPairs = COMPARISON_PAIRS.filter(pair => {
    if (pair.slug === comparisonSlug) return false;
    return (
      pair.country1 === currentPair.country1 ||
      pair.country1 === currentPair.country2 ||
      pair.country2 === currentPair.country1 ||
      pair.country2 === currentPair.country2
    );
  });

  // Prioritize same category
  const sameCategoryFirst = relatedPairs.sort((a, b) => {
    const aSameCategory = a.category === currentPair.category ? 0 : 1;
    const bSameCategory = b.category === currentPair.category ? 0 : 1;
    return aSameCategory - bSameCategory;
  });

  return sameCategoryFirst.slice(0, limit).map(pair => ({
    slug: pair.slug,
    label: `${pair.country1Name} vs ${pair.country2Name}`,
    partnerCountry: '',
    partnerCountrySlug: '',
    description: pair.description
  }));
}

// Predefined top comparisons for major countries (for performance)
const TOP_COMPARISONS_CACHE: Record<string, ComparisonLink[]> = {
  'united-states': [
    { slug: 'usa-vs-china', label: 'vs China', partnerCountry: 'China', partnerCountrySlug: 'china', description: 'Superpower rivalry' },
    { slug: 'usa-vs-india', label: 'vs India', partnerCountry: 'India', partnerCountrySlug: 'india', description: 'Democracy giants' },
    { slug: 'usa-vs-russia', label: 'vs Russia', partnerCountry: 'Russia', partnerCountrySlug: 'russia', description: 'Cold War rivals' },
    { slug: 'usa-vs-mexico', label: 'vs Mexico', partnerCountry: 'Mexico', partnerCountrySlug: 'mexico', description: 'North American neighbors' },
    { slug: 'usa-vs-brazil', label: 'vs Brazil', partnerCountry: 'Brazil', partnerCountrySlug: 'brazil', description: 'Americas comparison' }
  ],
  'china': [
    { slug: 'china-vs-india', label: 'vs India', partnerCountry: 'India', partnerCountrySlug: 'india', description: 'Asian giants' },
    { slug: 'usa-vs-china', label: 'vs USA', partnerCountry: 'United States', partnerCountrySlug: 'united-states', description: 'Superpower rivalry' },
    { slug: 'china-vs-japan', label: 'vs Japan', partnerCountry: 'Japan', partnerCountrySlug: 'japan', description: 'East Asian powers' },
    { slug: 'china-vs-taiwan', label: 'vs Taiwan', partnerCountry: 'Taiwan', partnerCountrySlug: 'taiwan', description: 'Cross-strait comparison' },
    { slug: 'china-vs-russia', label: 'vs Russia', partnerCountry: 'Russia', partnerCountrySlug: 'russia', description: 'Strategic partners' }
  ],
  'india': [
    { slug: 'india-vs-china', label: 'vs China', partnerCountry: 'China', partnerCountrySlug: 'china', description: 'Population giants' },
    { slug: 'india-vs-pakistan', label: 'vs Pakistan', partnerCountry: 'Pakistan', partnerCountrySlug: 'pakistan', description: 'South Asian rivals' },
    { slug: 'india-vs-bangladesh', label: 'vs Bangladesh', partnerCountry: 'Bangladesh', partnerCountrySlug: 'bangladesh', description: 'Bengal neighbors' },
    { slug: 'usa-vs-india', label: 'vs USA', partnerCountry: 'United States', partnerCountrySlug: 'united-states', description: 'Democracy comparison' },
    { slug: 'india-vs-indonesia', label: 'vs Indonesia', partnerCountry: 'Indonesia', partnerCountrySlug: 'indonesia', description: 'Developing giants' }
  ],
  'japan': [
    { slug: 'japan-vs-germany', label: 'vs Germany', partnerCountry: 'Germany', partnerCountrySlug: 'germany', description: 'Aging societies' },
    { slug: 'japan-vs-south-korea', label: 'vs South Korea', partnerCountry: 'South Korea', partnerCountrySlug: 'south-korea', description: 'East Asian neighbors' },
    { slug: 'china-vs-japan', label: 'vs China', partnerCountry: 'China', partnerCountrySlug: 'china', description: 'Historical rivals' },
    { slug: 'japan-vs-italy', label: 'vs Italy', partnerCountry: 'Italy', partnerCountrySlug: 'italy', description: 'G7 aging nations' },
    { slug: 'japan-vs-singapore', label: 'vs Singapore', partnerCountry: 'Singapore', partnerCountrySlug: 'singapore', description: 'Asian developed nations' }
  ],
  'germany': [
    { slug: 'germany-vs-france', label: 'vs France', partnerCountry: 'France', partnerCountrySlug: 'france', description: 'EU powerhouses' },
    { slug: 'japan-vs-germany', label: 'vs Japan', partnerCountry: 'Japan', partnerCountrySlug: 'japan', description: 'Export champions' },
    { slug: 'uk-vs-germany', label: 'vs UK', partnerCountry: 'United Kingdom', partnerCountrySlug: 'united-kingdom', description: 'European rivals' },
    { slug: 'germany-vs-italy', label: 'vs Italy', partnerCountry: 'Italy', partnerCountrySlug: 'italy', description: 'Southern neighbor' },
    { slug: 'germany-vs-poland', label: 'vs Poland', partnerCountry: 'Poland', partnerCountrySlug: 'poland', description: 'Eastern neighbor' }
  ],
  'brazil': [
    { slug: 'brazil-vs-argentina', label: 'vs Argentina', partnerCountry: 'Argentina', partnerCountrySlug: 'argentina', description: 'South American rivals' },
    { slug: 'usa-vs-brazil', label: 'vs USA', partnerCountry: 'United States', partnerCountrySlug: 'united-states', description: 'Americas comparison' },
    { slug: 'brazil-vs-mexico', label: 'vs Mexico', partnerCountry: 'Mexico', partnerCountrySlug: 'mexico', description: 'Latin American giants' },
    { slug: 'brazil-vs-india', label: 'vs India', partnerCountry: 'India', partnerCountrySlug: 'india', description: 'BRICS partners' },
    { slug: 'brazil-vs-colombia', label: 'vs Colombia', partnerCountry: 'Colombia', partnerCountrySlug: 'colombia', description: 'Amazon neighbors' }
  ]
};

// Use cache first, then generate dynamically
export function getTopComparisonsForCountryOptimized(countrySlug: string): ComparisonLink[] {
  return TOP_COMPARISONS_CACHE[countrySlug] || getTopComparisonsForCountry(countrySlug);
}