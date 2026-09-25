import Link from 'next/link';
import BlogThumbnailPyramid from '@/components/BlogThumbnailPyramid';
import { loadCountryData } from '@/lib/data-loader';
import { loadStateData } from '@/lib/state-data-loader';
import { CURRENT_YEAR, LAST_UPDATED_ISO } from '@/lib/site-meta';

export const revalidate = 86400;

export const metadata = {
  title: 'Demographics Blog — Population Insights & Analysis',
  description:
    'Demographic trends, population insights, and data-driven stories from around the world. Aging societies, youth booms, fertility collapse, migration, US state shifts.',
  keywords:
    'demographics blog, population trends, aging crisis, youth boom, demographic analysis, population insights',
  openGraph: {
    title: 'Demographics Blog — Population Insights & Analysis',
    description:
      'Demographic trends and data-driven stories from around the world.',
    type: 'website',
    url: 'https://populationpyramids.org/blog',
  },
  alternates: { canonical: 'https://populationpyramids.org/blog' },
};

// Year used for every thumbnail pyramid (latest UN WPP / US Census vintage we have).
const PYRAMID_YEAR = 2024;

interface BlogPost {
  slug: string;
  title: string;
  primaryKeyword: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  featured: boolean;
  tags: string[];
  /** Which country/state pyramid to render as the card thumbnail. */
  pyramid: { slug: string; kind: 'country' | 'state'; label: string };
}

const blogPosts: BlogPost[] = [
  // ── Demographics education ───────────────────────────────────────────────
  {
    slug: 'population-pyramid-types-complete-guide',
    title: '3 Types of Population Pyramids: Complete Guide',
    primaryKeyword: 'population pyramid types',
    excerpt:
      'Learn the 3 main population pyramid types: expansive (growing populations), constrictive (declining populations), and stationary (stable populations). Complete guide with examples from countries worldwide.',
    date: '2026-05-12',
    readTime: '8 min read',
    category: 'Demographics Guide',
    featured: false,
    tags: ['population pyramid types', 'demographics education', 'expansive pyramid', 'constrictive pyramid', 'stationary pyramid'],
    pyramid: { slug: 'india', kind: 'country', label: 'India' },
  },
  {
    slug: 'population-pyramid-stages-demographic-transition',
    title: '5 Population Pyramid Stages: Demographic Transition Model',
    primaryKeyword: 'population pyramid stages',
    excerpt:
      'Understand the 5 population pyramid stages of demographic transition: from high birth/death rates to aging societies. Complete guide with country examples and economic implications.',
    date: '2026-05-12',
    readTime: '12 min read',
    category: 'Demographics Guide',
    featured: false,
    tags: ['population pyramid stages', 'demographic transition model', 'population stages', 'demographic transition theory'],
    pyramid: { slug: 'japan', kind: 'country', label: 'Japan' },
  },
  {
    slug: '4-stages-demographic-transition-model',
    title: '4 Stages of Demographic Transition: The Classic Model',
    primaryKeyword: '4 stages of demographic transition',
    excerpt:
      'Learn the original 4 stages of demographic transition model: high stationary, early expanding, late expanding, and low stationary. Complete guide with historical examples and economic analysis.',
    date: '2026-05-12',
    readTime: '10 min read',
    category: 'Demographics Guide',
    featured: false,
    tags: ['4 stages demographic transition', 'demographic theory', 'population transition', 'economic development'],
    pyramid: { slug: 'germany', kind: 'country', label: 'Germany' },
  },
  {
    slug: '5-stages-demographic-transition-complete-model',
    title: '5 Stages of Demographic Transition: Complete Modern Model',
    primaryKeyword: '5 stages of demographic transition',
    excerpt:
      'Discover the complete 5 stages of demographic transition including Stage 5 population decline. Modern model explains Japan, Germany aging crisis. Full guide with country examples.',
    date: '2026-05-12',
    readTime: '13 min read',
    category: 'Demographics Guide',
    featured: false,
    tags: ['5 stages demographic transition', 'population decline', 'demographic crisis', 'aging societies'],
    pyramid: { slug: 'japan', kind: 'country', label: 'Japan' },
  },

  // ── Featured ─────────────────────────────────────────────────────────────
  {
    slug: 'fertility-apocalypse-countries-stopped-having-babies',
    title: 'Fertility Crisis: Korea 0.72 Births Per Woman',
    primaryKeyword: 'fertility crisis',
    excerpt:
      'South Korea: 0.72 births per woman. Singapore: 1.04. Taiwan: 0.87. Entire societies are choosing not to reproduce. Discover the countries facing fertility collapse and the end of traditional family structures.',
    date: '2026-05-05',
    readTime: '15 min read',
    category: 'Fertility Crisis',
    featured: true,
    tags: ['fertility crisis', 'birth rates', 'demographic collapse', 'family structure', 'population decline', 'social change'],
    pyramid: { slug: 'south-korea', kind: 'country', label: 'South Korea' },
  },

  // ── US states ────────────────────────────────────────────────────────────
  {
    slug: 'oldest-states-in-us-aging-population',
    title: 'States With Oldest Population: Top 15 Aging US States',
    primaryKeyword: 'oldest states in the us',
    excerpt:
      'Maine has the oldest population in America with median age 45.1 years. Discover which state has the oldest population, states with most senior citizens, and cheapest states for seniors to live.',
    date: '2026-05-12',
    readTime: '10 min read',
    category: 'US Demographics',
    featured: false,
    tags: ['oldest states', 'aging population', 'senior citizens', 'retirement states', 'demographic aging'],
    pyramid: { slug: 'maine', kind: 'state', label: 'Maine' },
  },
  {
    slug: 'youngest-states-in-us-youth-population',
    title: `Youngest States in the US: 15 Most Youthful States ${CURRENT_YEAR}`,
    primaryKeyword: 'youngest states in the us',
    excerpt:
      'Utah has the youngest population in America with median age 32.3 years. Discover the youngest states in the US, states with youngest population, and why these states attract young families.',
    date: '2026-05-12',
    readTime: '9 min read',
    category: 'US Demographics',
    featured: false,
    tags: ['youngest states', 'youth population', 'young families', 'population growth', 'demographic trends'],
    pyramid: { slug: 'utah', kind: 'state', label: 'Utah' },
  },
  {
    slug: 'fastest-growing-states-population',
    title: `Fastest Growing States Population ${CURRENT_YEAR}: Top 10 Growth`,
    primaryKeyword: 'fastest growing states',
    excerpt:
      'South Carolina leads with 4.2% population growth. Texas adds 470,000 people yearly. Discover the fastest growing state population, growth rates, and why these states attract millions.',
    date: '2026-05-12',
    readTime: '11 min read',
    category: 'US Demographics',
    featured: false,
    tags: ['fastest growing states', 'population growth', 'migration patterns', 'state demographics', 'economic growth'],
    pyramid: { slug: 'south-carolina', kind: 'state', label: 'South Carolina' },
  },
  {
    slug: 'fastest-growing-states',
    title: '15 Fastest Growing US States',
    primaryKeyword: 'fastest growing states',
    excerpt:
      "South Carolina leads America's population boom with 2.9% growth. Florida adds 1,000 people daily. Texas gains a Michigan-sized population. Discover the states experiencing explosive growth with the latest census data.",
    date: '2026-05-11',
    readTime: '12 min read',
    category: 'US Demographics',
    featured: false,
    tags: ['US states', 'population growth', 'migration', 'demographics', 'real estate'],
    pyramid: { slug: 'south-carolina', kind: 'state', label: 'South Carolina' },
  },
  {
    slug: 'states-people-fleeing',
    title: '10 States People Are Fleeing Most',
    primaryKeyword: 'states people are leaving',
    excerpt:
      "New Jersey loses 279 people daily. Illinois faces a death spiral with 32% wanting to leave. California isn't even in the top 3. Discover which states are hemorrhaging population right now and the shocking reasons why.",
    date: '2026-05-11',
    readTime: '13 min read',
    category: 'US Demographics',
    featured: false,
    tags: ['US states', 'population decline', 'migration', 'exodus', 'economic factors'],
    pyramid: { slug: 'new-jersey', kind: 'state', label: 'New Jersey' },
  },
  {
    slug: 'best-states-retire',
    title: `Best States to Retire ${CURRENT_YEAR}`,
    primaryKeyword: 'best states to retire',
    excerpt:
      'Delaware beats Florida as #1 retirement destination with no sales tax and beach access. Nevada offers tax paradise with 300 sunny days. Discover the 15 best states for retirement based on taxes, healthcare, and lifestyle.',
    date: '2026-05-11',
    readTime: '14 min read',
    category: 'US Demographics',
    featured: false,
    tags: ['retirement', 'US states', 'taxes', 'healthcare', 'lifestyle'],
    pyramid: { slug: 'delaware', kind: 'state', label: 'Delaware' },
  },
  {
    slug: 'climate-refugees-states-flee-weather',
    title: 'Climate Refugees: 12 States Americans Flee Due to Weather',
    primaryKeyword: 'climate migration states',
    excerpt:
      '1.2 million Americans became climate migrants in 2023. Louisiana loses 125,000 to hurricanes. Insurance companies abandon Florida. Discover the states where climate disasters are forcing mass exodus.',
    date: '2026-05-11',
    readTime: '12 min read',
    category: 'US Demographics',
    featured: false,
    tags: ['climate change', 'migration', 'natural disasters', 'insurance crisis', 'US states'],
    pyramid: { slug: 'louisiana', kind: 'state', label: 'Louisiana' },
  },
  {
    slug: 'remote-work-exodus-states-wfh-changed',
    title: 'Remote Work Exodus: 15 States Where WFH Changed Everything',
    primaryKeyword: 'remote work states',
    excerpt:
      'Montana sees 142% remote worker growth. Boise locals priced out by Silicon Valley salaries. 3.5 million tech workers fled expensive cities. Discover how remote work completely transformed these 15 states.',
    date: '2026-05-11',
    readTime: '14 min read',
    category: 'US Demographics',
    featured: false,
    tags: ['remote work', 'WFH', 'tech migration', 'housing crisis', 'US states'],
    pyramid: { slug: 'montana', kind: 'state', label: 'Montana' },
  },
  {
    slug: 'alaska-gender-ratio-dating-crisis',
    title: 'Alaska: 35,924 More Men Than Women',
    primaryKeyword: 'Alaska gender ratio',
    excerpt:
      'Alaska has 35,924 more men than women—worst dating odds in America for men. Meanwhile, DC has 32,456 more women. Discover the extreme gender imbalances reshaping dating markets across US states.',
    date: '2026-05-10',
    readTime: '10 min read',
    category: 'US Demographics',
    featured: false,
    tags: ['gender ratio', 'Alaska', 'dating demographics', 'US states'],
    pyramid: { slug: 'alaska', kind: 'state', label: 'Alaska' },
  },
  {
    slug: 'utah-maine-age-gap-crisis',
    title: 'Utah vs Maine: 15-Year Age Gap Crisis',
    primaryKeyword: 'state age demographics',
    excerpt:
      "Utah's median age: 31.8 years. Maine's: 45.1 years. This 15-year gap creates two completely different Americas—one drowning in kids, the other in retirees. See which states are youngest and oldest.",
    date: '2026-05-10',
    readTime: '11 min read',
    category: 'US Demographics',
    featured: false,
    tags: ['age demographics', 'Utah', 'Maine', 'generational divide', 'US states'],
    pyramid: { slug: 'utah', kind: 'state', label: 'Utah' },
  },
  {
    slug: 'nevada-west-virginia-population-gap',
    title: 'Nevada vs West Virginia: Boom vs Bust',
    primaryKeyword: 'state population growth',
    excerpt:
      'Nevada grows 15% while West Virginia shrinks 3.2%. One state adds 450,000 people, the other loses 58,000. Discover the tale of two Americas—states booming versus states dying.',
    date: '2026-05-10',
    readTime: '9 min read',
    category: 'US Demographics',
    featured: false,
    tags: ['population growth', 'Nevada', 'West Virginia', 'economic divide', 'US states'],
    pyramid: { slug: 'nevada', kind: 'state', label: 'Nevada' },
  },
  {
    slug: 'texas-added-michigan-population',
    title: 'Texas Added an Entire Michigan Since 2000',
    primaryKeyword: 'Texas population growth',
    excerpt:
      "Texas gained 9.7 million people since 2000—equivalent to adding the entire population of Michigan. Growing by 1,400 people daily, Texas is rewriting America's demographic map.",
    date: '2026-05-10',
    readTime: '8 min read',
    category: 'US Demographics',
    featured: false,
    tags: ['Texas', 'population boom', 'migration', 'demographic shift', 'US states'],
    pyramid: { slug: 'texas', kind: 'state', label: 'Texas' },
  },
  {
    slug: 'half-states-under-35-youth-vs-senior-america',
    title: 'Half of States Under 35: Youth vs Senior America',
    primaryKeyword: 'young vs old states',
    excerpt:
      'Utah, DC, and Texas have median ages under 35. Maine, Vermont, and West Virginia are over 42. America is splitting into young and old states with radically different futures.',
    date: '2026-05-10',
    readTime: '12 min read',
    category: 'US Demographics',
    featured: false,
    tags: ['age divide', 'demographics', 'generational gap', 'US states', 'youth vs seniors'],
    pyramid: { slug: 'utah', kind: 'state', label: 'Utah' },
  },

  // ── Global ───────────────────────────────────────────────────────────────
  {
    slug: 'megacity-explosion-cities-bigger-than-countries',
    title: 'Megacities: Tokyo Bigger Than All of Canada',
    primaryKeyword: 'megacities',
    excerpt:
      'Tokyo has more people than all of Canada. Lagos grows by 1,500 people daily. Delhi adds a Miami every year. Discover how megacities are reshaping human civilization and creating unprecedented urban demographics.',
    date: '2026-05-05',
    readTime: '13 min read',
    category: 'Urban Demographics',
    featured: false,
    tags: ['megacities', 'urban population', 'city demographics', 'population density', 'urbanization', 'infrastructure'],
    pyramid: { slug: 'japan', kind: 'country', label: 'Japan' },
  },
  {
    slug: 'migration-nations-countries-gaining-losing-millions',
    title: 'Migration Crisis: Venezuela Lost 20% Population',
    primaryKeyword: 'migration crisis',
    excerpt:
      'Germany gained 2 million migrants in 2 years. Venezuela lost 20% of its population. Syria emptied entire cities. Discover how mass migration is reshaping global demographics faster than birth rates.',
    date: '2026-05-05',
    readTime: '14 min read',
    category: 'Migration Patterns',
    featured: false,
    tags: ['migration', 'demographics', 'population movement', 'global trends', 'economic impact', 'refugees'],
    pyramid: { slug: 'germany', kind: 'country', label: 'Germany' },
  },
  {
    slug: 'india-beat-china-first-time-300-years-population',
    title: 'India Population Beats China in 2023',
    primaryKeyword: 'India population',
    excerpt:
      "April 2023: India became the world's most populous country with 1.45 billion people, overtaking China's 1.42 billion. The historic demographic reversal reshaping global power that most people missed.",
    date: '2026-05-05',
    readTime: '10 min read',
    category: 'Global Trends',
    featured: false,
    tags: ['india', 'china', 'population milestone', 'global trends', 'historic reversal', 'viral demographics'],
    pyramid: { slug: 'india', kind: 'country', label: 'India' },
  },
  {
    slug: 'half-this-country-under-17-youth-explosion',
    title: 'Youngest Country: Niger Median Age 16.5',
    primaryKeyword: 'youngest country',
    excerpt:
      "Niger has a median age of 16.5 years—younger than TikTok's minimum age. Nearly half the population can't legally drive, vote, or work. Discover how the world's youngest country is reshaping global demographics.",
    date: '2026-05-05',
    readTime: '9 min read',
    category: 'Youth Demographics',
    featured: false,
    tags: ['niger', 'youngest country', 'youth explosion', 'demographic dividend', 'africa', 'viral demographics'],
    pyramid: { slug: 'niger', kind: 'country', label: 'Niger' },
  },
  {
    slug: 'country-2-5-men-for-every-woman-dating-crisis',
    title: 'Gender Ratio: Qatar 2.5 Men Per Woman',
    primaryKeyword: 'gender ratio',
    excerpt:
      'Qatar has 71.3% male population—2.17 million men vs 875,000 women. Discover how extreme gender ratios in Gulf states create unprecedented social dynamics and dating challenges that will shock you.',
    date: '2026-05-05',
    readTime: '8 min read',
    category: 'Social Dynamics',
    featured: false,
    tags: ['qatar', 'gender ratio', 'dating crisis', 'gulf states', 'social dynamics', 'viral demographics'],
    pyramid: { slug: 'qatar', kind: 'country', label: 'Qatar' },
  },
  {
    slug: 'baby-boom-echo-how-1990s-events-shape-today',
    title: 'Baby Boom Echo: Millennials Housing Crisis',
    primaryKeyword: 'baby boom echo',
    excerpt:
      "Why can't millennials afford houses? Why are there teacher shortages? The answer lies in demographic waves from the 1940s that peaked in the 1990s and continue reshaping housing, job markets, and politics today.",
    date: '2026-05-05',
    readTime: '16 min read',
    category: 'Historical Impact',
    featured: false,
    tags: ['baby boom', 'millennials', 'economic cycles', 'housing crisis', 'demographic waves', 'historical trends'],
    pyramid: { slug: 'united-states', kind: 'country', label: 'United States' },
  },
  {
    slug: 'demographic-time-bombs-countries-losing-people',
    title: 'Population Decline: Japan Loses 500K Yearly',
    primaryKeyword: 'population decline',
    excerpt:
      'Japan loses 500,000 people annually. South Korea may shrink by 50% by 2100. Eastern Europe empties entire villages. Explore the countries facing catastrophic population decline and the economic devastation that follows.',
    date: '2026-05-05',
    readTime: '18 min read',
    category: 'Population Decline',
    featured: false,
    tags: ['population decline', 'aging crisis', 'economic collapse', 'japan', 'south korea', 'eastern europe'],
    pyramid: { slug: 'japan', kind: 'country', label: 'Japan' },
  },
  {
    slug: 'china-india-population-swap-global-shift',
    title: 'India vs China: Historic Population Swap 2023',
    primaryKeyword: 'India China population',
    excerpt:
      "April 2023 marked a historic milestone: India officially surpassed China as the world's most populous country. Explore the demographic forces behind this shift, from China's One-Child Policy to India's demographic dividend.",
    date: '2026-05-05',
    readTime: '15 min read',
    category: 'Global Trends',
    featured: false,
    tags: ['china', 'india', 'global trends', 'demographic transition', 'population'],
    pyramid: { slug: 'india', kind: 'country', label: 'India' },
  },
  {
    slug: 'youth-explosion-africa-youngest-populations',
    title: 'Youth Explosion: Africa Youngest Continent',
    primaryKeyword: 'Africa youth demographics',
    excerpt:
      'In Niger, 50.1% of the population is under 15. Chad follows at 47.8%. While developed nations age rapidly, Sub-Saharan Africa experiences an unprecedented youth boom that could reshape global economics by 2050.',
    date: '2026-05-05',
    readTime: '12 min read',
    category: 'Youth Demographics',
    featured: false,
    tags: ['youth', 'africa', 'demographic dividend', 'economic growth', 'development'],
    pyramid: { slug: 'niger', kind: 'country', label: 'Niger' },
  },
  // ── Demographics Education — Stage deep dives ────────────────────────────
  {
    slug: '4-vs-5-stages-demographic-transition-model',
    title: '4 vs 5 Stages of Demographic Transition Compared',
    primaryKeyword: '4 vs 5 stages demographic transition',
    excerpt:
      'The classic 4-stage model vs the modern 5-stage version that adds population decline. Side-by-side comparison with country examples — when each stage applies and how the boundaries are drawn.',
    date: '2026-05-08',
    readTime: '11 min read',
    category: 'Demographics Guide',
    featured: false,
    tags: ['demographic transition', 'comparison', 'population stages'],
    pyramid: { slug: 'germany', kind: 'country', label: 'Germany' },
  },
  {
    slug: 'stage-1-demographic-transition',
    title: 'Stage 1 Demographic Transition: High Stationary',
    primaryKeyword: 'stage 1 demographic transition',
    excerpt:
      'High birth + high death rates produce roughly stable, pre-industrial populations. Almost no country sits in Stage 1 today — but every modern population started here.',
    date: '2026-05-07',
    readTime: '9 min read',
    category: 'Demographics Guide',
    featured: false,
    tags: ['stage 1', 'demographic transition', 'pre-industrial demographics'],
    pyramid: { slug: 'niger', kind: 'country', label: 'Niger' },
  },
  {
    slug: 'stage-2-demographic-transition',
    title: 'Stage 2 Demographic Transition: Early Expanding',
    primaryKeyword: 'stage 2 demographic transition',
    excerpt:
      'Death rates collapse while birth rates stay high — populations explode. Many Sub-Saharan African countries are in Stage 2 today, with median ages under 20.',
    date: '2026-05-07',
    readTime: '10 min read',
    category: 'Demographics Guide',
    featured: false,
    tags: ['stage 2', 'demographic transition', 'population explosion'],
    pyramid: { slug: 'niger', kind: 'country', label: 'Niger' },
  },
  {
    slug: 'stage-3-demographic-transition',
    title: 'Stage 3 Demographic Transition: Late Expanding',
    primaryKeyword: 'stage 3 demographic transition',
    excerpt:
      'Birth rates begin to fall while death rates stay low. Populations still grow but at a slowing pace. India, Indonesia, Brazil, and Mexico are typical Stage 3 countries.',
    date: '2026-05-07',
    readTime: '11 min read',
    category: 'Demographics Guide',
    featured: false,
    tags: ['stage 3', 'demographic transition', 'fertility decline'],
    pyramid: { slug: 'india', kind: 'country', label: 'India' },
  },
  {
    slug: 'stage-4-demographic-transition',
    title: 'Stage 4 Demographic Transition: Low Stationary',
    primaryKeyword: 'stage 4 demographic transition',
    excerpt:
      'Low birth + low death rates. Slowly aging populations stabilize. The US, UK, France, Australia, and most of the developed world live in Stage 4.',
    date: '2026-05-07',
    readTime: '11 min read',
    category: 'Demographics Guide',
    featured: false,
    tags: ['stage 4', 'demographic transition', 'low stationary'],
    pyramid: { slug: 'united-states', kind: 'country', label: 'United States' },
  },
  {
    slug: 'stage-5-demographic-transition',
    title: 'Stage 5 Demographic Transition: Population Decline',
    primaryKeyword: 'stage 5 demographic transition',
    excerpt:
      "Sub-replacement fertility produces outright population decline. Japan, Italy, Germany, Greece, and South Korea are already losing population — the world's next demographic frontier.",
    date: '2026-05-07',
    readTime: '12 min read',
    category: 'Demographics Guide',
    featured: false,
    tags: ['stage 5', 'demographic transition', 'population decline'],
    pyramid: { slug: 'japan', kind: 'country', label: 'Japan' },
  },
  {
    slug: 'oldest-countries-world-aging-population',
    title: 'Oldest Countries in the World by Median Age',
    primaryKeyword: 'oldest countries in the world',
    excerpt:
      'Japan median age 49.8 — the oldest country in the world. Italy 48.1. Germany 46.7. Discover the countries where seniors outnumber children and what their pyramids look like.',
    date: '2026-05-04',
    readTime: '12 min read',
    category: 'Aging Societies',
    featured: false,
    tags: ['oldest countries', 'aging population', 'median age', 'demographic aging'],
    pyramid: { slug: 'japan', kind: 'country', label: 'Japan' },
  },
  {
    slug: 'worlds-aging-crisis-9-countries-seniors',
    title: 'Aging Crisis: 9 Countries Face Senior Majority',
    primaryKeyword: 'aging crisis',
    excerpt:
      "Japan's median age has risen 7.5 years since 2000. South Korea ages faster than any nation in history. Italy faces a future where diapers for adults outsell baby diapers 3-to-1. Welcome to the aging revolution.",
    date: '2026-05-05',
    readTime: '8 min read',
    category: 'Aging Societies',
    featured: false,
    tags: ['aging', 'demographics', 'japan', 'europe', 'crisis'],
    pyramid: { slug: 'japan', kind: 'country', label: 'Japan' },
  },
];

type AgeGroups = Array<{ ageRange: string; male: number; female: number }>;

async function loadPyramidAgeGroups(p: BlogPost): Promise<AgeGroups | null> {
  try {
    if (p.pyramid.kind === 'state') {
      const data = await loadStateData(p.pyramid.slug);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const year = (data as any)?.years?.[PYRAMID_YEAR];
      return year?.ageGroups ?? null;
    }
    const data = await loadCountryData(p.pyramid.slug);
    const year = data?.years?.[PYRAMID_YEAR];
    return (year?.ageGroups as AgeGroups) ?? null;
  } catch {
    return null;
  }
}

function themeFor(category: string, featured: boolean): 'us' | 'global' | 'featured' {
  if (featured) return 'featured';
  if (category === 'US Demographics') return 'us';
  return 'global';
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function BlogPage() {
  // Load every pyramid's age groups once, in parallel. React's cache() in the
  // loaders dedupes so repeated calls are free.
  const ageGroupsBySlug = new Map<string, AgeGroups | null>();
  await Promise.all(
    blogPosts.map(async (p) => {
      ageGroupsBySlug.set(p.slug, await loadPyramidAgeGroups(p));
    })
  );

  // Newest first
  const sorted = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  const featured = sorted.find((p) => p.featured) ?? null;
  const usStates = sorted.filter((p) => p.category === 'US Demographics' && !p.featured);
  const others = sorted.filter((p) => p.category !== 'US Demographics' && !p.featured);

  const totalCount = blogPosts.length;

  // Blog index JSON-LD — type Blog + an embedded list of BlogPosting refs so
  // crawlers see this as an article hub, not just a card grid.
  const blogSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': 'https://populationpyramids.org/blog#blog',
        name: 'Demographics Blog',
        description:
          'Data-driven demographic stories — aging societies, youth booms, fertility collapse, migration, US state shifts.',
        url: 'https://populationpyramids.org/blog',
        publisher: {
          '@type': 'Organization',
          name: 'PopulationPyramids.org',
          url: 'https://populationpyramids.org',
          logo: {
            '@type': 'ImageObject',
            url: 'https://populationpyramids.org/icon.svg',
          },
        },
        blogPost: sorted.map((p) => ({
          '@type': 'BlogPosting',
          '@id': `https://populationpyramids.org/blog/${p.slug}#post`,
          url: `https://populationpyramids.org/blog/${p.slug}`,
          headline: p.title,
          description: p.excerpt,
          datePublished: p.date,
          dateModified: p.date,
          author: {
            '@type': 'Organization',
            name: 'PopulationPyramids.org',
            url: 'https://populationpyramids.org',
          },
          keywords: p.tags.join(', '),
          articleSection: p.category,
          inLanguage: 'en-US',
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://populationpyramids.org/blog' },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Demographics Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {totalCount} data-driven stories on aging societies, youth booms, fertility collapse,
            migration, and the demographic forces reshaping every country and US state.
          </p>
          <p className="mt-3 text-xs text-gray-500">
            All articles refreshed against the latest UN World Population Prospects 2024
            Revision and US Census data · Last updated{' '}
            <time dateTime={LAST_UPDATED_ISO}>{formatDate(LAST_UPDATED_ISO)}</time>
          </p>
        </div>

        {/* Featured Article */}
        {featured && (
          <div className="mb-16">
            <Link
              href={`/blog/${featured.slug}`}
              className="group block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <div className="grid md:grid-cols-5 gap-0">
                <div className="md:col-span-3 h-64 sm:h-80 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-gray-100">
                  <BlogThumbnailPyramid
                    ageGroups={ageGroupsBySlug.get(featured.slug) ?? null}
                    label={featured.pyramid.label}
                    year={PYRAMID_YEAR}
                    idSuffix={featured.slug}
                    theme={themeFor(featured.category, true)}
                  />
                </div>
                <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                        Featured
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                        {featured.category}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-700 transition">
                      {featured.title}
                    </h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">{featured.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                      <span>•</span>
                      <span>{featured.readTime}</span>
                    </div>
                    <span className="text-blue-600 font-semibold group-hover:text-blue-800">
                      Read article →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* US States */}
        {usStates.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">US States Demographics</h2>
            <p className="text-sm text-gray-600 mb-6">
              {usStates.length} articles · sorted newest first · thumbnails show each state&apos;s
              {PYRAMID_YEAR} population pyramid
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {usStates.map((p) => (
                <BlogCard
                  key={p.slug}
                  post={p}
                  ageGroups={ageGroupsBySlug.get(p.slug) ?? null}
                />
              ))}
            </div>
          </div>
        )}

        {/* Global */}
        {others.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Global Demographics</h2>
            <p className="text-sm text-gray-600 mb-6">
              {others.length} articles · sorted newest first · thumbnails show each country&apos;s
              {PYRAMID_YEAR} population pyramid
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((p) => (
                <BlogCard
                  key={p.slug}
                  post={p}
                  ageGroups={ageGroupsBySlug.get(p.slug) ?? null}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function BlogCard({
  post,
  ageGroups,
}: {
  post: BlogPost;
  ageGroups: AgeGroups | null;
}) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition flex flex-col">
      <Link href={`/blog/${post.slug}`} className="block h-48 overflow-hidden border-b border-gray-100">
        <BlogThumbnailPyramid
          ageGroups={ageGroups}
          label={post.pyramid.label}
          year={PYRAMID_YEAR}
          idSuffix={post.slug}
          theme={themeFor(post.category, false)}
        />
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
            {post.category}
          </span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight hover:text-blue-700 transition">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed flex-1">{post.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Read →
          </Link>
        </div>
      </div>
    </article>
  );
}
