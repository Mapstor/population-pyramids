import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Demographics Blog - Population Insights & Analysis | Population Pyramids',
  description: 'Discover fascinating demographic trends, population insights, and data-driven stories from around the world. Explore aging societies, youth booms, and population shifts.',
  keywords: 'demographics blog, population trends, aging crisis, youth boom, demographic analysis, population insights',
  openGraph: {
    title: 'Demographics Blog - Population Insights & Analysis',
    description: 'Discover fascinating demographic trends and data-driven stories from around the world.',
    type: 'website',
    url: 'https://populationpyramids.org/blog',
  },
};

const blogPosts = [
  // Demographics Education Articles
  {
    slug: 'population-pyramid-types-complete-guide',
    title: '3 Types of Population Pyramids: Complete Guide',
    primaryKeyword: 'population pyramid types',
    excerpt: 'Learn the 3 main population pyramid types: expansive (growing populations), constrictive (declining populations), and stationary (stable populations). Complete guide with examples from countries worldwide.',
    date: '2024-11-12',
    readTime: '8 min read',
    category: 'Demographics Guide',
    image: '/blog/pyramid-types.jpg',
    featured: false,
    tags: ['population pyramid types', 'demographics education', 'expansive pyramid', 'constrictive pyramid', 'stationary pyramid']
  },
  {
    slug: 'population-pyramid-stages-demographic-transition',
    title: '5 Population Pyramid Stages: Demographic Transition Model',
    primaryKeyword: 'population pyramid stages',
    excerpt: 'Understand the 5 population pyramid stages of demographic transition: from high birth/death rates to aging societies. Complete guide with country examples and economic implications.',
    date: '2024-11-12',
    readTime: '12 min read',
    category: 'Demographics Guide',
    image: '/blog/pyramid-stages.jpg',
    featured: false,
    tags: ['population pyramid stages', 'demographic transition model', 'population stages', 'demographic transition theory']
  },
  {
    slug: '4-stages-demographic-transition-model',
    title: '4 Stages of Demographic Transition: The Classic Model',
    primaryKeyword: '4 stages of demographic transition',
    excerpt: 'Learn the original 4 stages of demographic transition model: high stationary, early expanding, late expanding, and low stationary. Complete guide with historical examples and economic analysis.',
    date: '2024-11-12',
    readTime: '10 min read',
    category: 'Demographics Guide',
    image: '/blog/4-stages-transition.jpg',
    featured: false,
    tags: ['4 stages demographic transition', 'demographic theory', 'population transition', 'economic development']
  },
  {
    slug: '5-stages-demographic-transition-complete-model',
    title: '5 Stages of Demographic Transition: Complete Modern Model',
    primaryKeyword: '5 stages of demographic transition',
    excerpt: 'Discover the complete 5 stages of demographic transition including Stage 5 population decline. Modern model explains Japan, Germany aging crisis. Full guide with country examples.',
    date: '2024-11-12',
    readTime: '13 min read',
    category: 'Demographics Guide',
    image: '/blog/5-stages-transition.jpg',
    featured: false,
    tags: ['5 stages demographic transition', 'population decline', 'demographic crisis', 'aging societies']
  },
  
  // Featured Global Demographics Articles
  {
    slug: 'fertility-apocalypse-countries-stopped-having-babies',
    title: 'Fertility Crisis: Korea 0.72 Births Per Woman',
    primaryKeyword: 'fertility crisis',
    excerpt: 'South Korea: 0.72 births per woman. Singapore: 1.04. Taiwan: 0.87. Entire societies are choosing not to reproduce. Discover the countries facing fertility collapse and the end of traditional family structures.',
    date: '2024-11-05',
    readTime: '15 min read',
    category: 'Fertility Crisis',
    image: '/blog/fertility-apocalypse.jpg',
    featured: true,
    tags: ['fertility crisis', 'birth rates', 'demographic collapse', 'family structure', 'population decline', 'social change']
  },
  
  // US States Articles
  {
    slug: 'oldest-states-in-us-aging-population',
    title: 'States With Oldest Population: Top 15 Aging US States',
    primaryKeyword: 'oldest states in the us',
    excerpt: 'Maine has the oldest population in America with median age 45.1 years. Discover which state has the oldest population, states with most senior citizens, and cheapest states for seniors to live.',
    date: '2024-11-12',
    readTime: '10 min read',
    category: 'US Demographics',
    image: '/blog/oldest-states.jpg',
    featured: false,
    tags: ['oldest states', 'aging population', 'senior citizens', 'retirement states', 'demographic aging']
  },
  {
    slug: 'youngest-states-in-us-youth-population',
    title: 'Youngest States in the US: 15 Most Youthful States 2024',
    primaryKeyword: 'youngest states in the us',
    excerpt: 'Utah has the youngest population in America with median age 32.3 years. Discover the youngest states in the US, states with youngest population, and why these states attract young families.',
    date: '2024-11-12',
    readTime: '9 min read',
    category: 'US Demographics',
    image: '/blog/youngest-states.jpg',
    featured: false,
    tags: ['youngest states', 'youth population', 'young families', 'population growth', 'demographic trends']
  },
  {
    slug: 'fastest-growing-states-population-2024',
    title: 'Fastest Growing States Population 2024: Top 10 Growth',
    primaryKeyword: 'fastest growing states',
    excerpt: 'South Carolina leads with 4.2% population growth. Texas adds 470,000 people yearly. Discover the fastest growing state population, growth rates, and why these states attract millions.',
    date: '2024-11-12',
    readTime: '11 min read',
    category: 'US Demographics',
    image: '/blog/fastest-growing-states-new.jpg',
    featured: false,
    tags: ['fastest growing states', 'population growth', 'migration patterns', 'state demographics', 'economic growth']
  },
  {
    slug: '15-fastest-growing-states-2024',
    title: '15 Fastest Growing US States',
    primaryKeyword: 'fastest growing states',
    excerpt: 'South Carolina leads America\'s population boom with 2.9% growth. Florida adds 1,000 people daily. Texas gains a Michigan-sized population. Discover the states experiencing explosive growth with the latest census data.',
    date: '2024-11-11',
    readTime: '12 min read',
    category: 'US Demographics',
    image: '/blog/fastest-growing-states.jpg',
    featured: false,
    tags: ['US states', 'population growth', 'migration', 'demographics', 'real estate']
  },
  {
    slug: '10-states-people-fleeing-2024',
    title: '10 States People Are Fleeing Most',
    primaryKeyword: 'states people are leaving',
    excerpt: 'New Jersey loses 279 people daily. Illinois faces a death spiral with 32% wanting to leave. California isn\'t even in the top 3. Discover which states are hemorrhaging population right now and the shocking reasons why.',
    date: '2024-11-11',
    readTime: '13 min read',
    category: 'US Demographics',
    image: '/blog/states-fleeing.jpg',
    featured: false,
    tags: ['US states', 'population decline', 'migration', 'exodus', 'economic factors']
  },
  {
    slug: 'best-states-retire-2025',
    title: 'Best States to Retire 2025',
    primaryKeyword: 'best states to retire',
    excerpt: 'Delaware beats Florida as #1 retirement destination with no sales tax and beach access. Nevada offers tax paradise with 300 sunny days. Discover the 15 best states for retirement based on taxes, healthcare, and lifestyle.',
    date: '2024-11-11',
    readTime: '14 min read',
    category: 'US Demographics',
    image: '/blog/retirement-states.jpg',
    featured: false,
    tags: ['retirement', 'US states', 'taxes', 'healthcare', 'lifestyle']
  },
  {
    slug: 'climate-refugees-states-flee-weather',
    title: 'Climate Refugees: 12 States Americans Flee Due to Weather',
    primaryKeyword: 'climate migration states',
    excerpt: '1.2 million Americans became climate migrants in 2023. Louisiana loses 125,000 to hurricanes. Insurance companies abandon Florida. Discover the states where climate disasters are forcing mass exodus.',
    date: '2024-11-11',
    readTime: '12 min read',
    category: 'US Demographics',
    image: '/blog/climate-refugees.jpg',
    featured: false,
    tags: ['climate change', 'migration', 'natural disasters', 'insurance crisis', 'US states']
  },
  {
    slug: 'remote-work-exodus-states-wfh-changed',
    title: 'Remote Work Exodus: 15 States Where WFH Changed Everything',
    primaryKeyword: 'remote work states',
    excerpt: 'Montana sees 142% remote worker growth. Boise locals priced out by Silicon Valley salaries. 3.5 million tech workers fled expensive cities. Discover how remote work completely transformed these 15 states.',
    date: '2024-11-11',
    readTime: '14 min read',
    category: 'US Demographics',
    image: '/blog/remote-work-exodus.jpg',
    featured: false,
    tags: ['remote work', 'WFH', 'tech migration', 'housing crisis', 'US states']
  },
  {
    slug: 'alaska-gender-ratio-dating-crisis',
    title: 'Alaska: 35,924 More Men Than Women',
    primaryKeyword: 'Alaska gender ratio',
    excerpt: 'Alaska has 35,924 more men than women—worst dating odds in America for men. Meanwhile, DC has 32,456 more women. Discover the extreme gender imbalances reshaping dating markets across US states.',
    date: '2024-11-10',
    readTime: '10 min read',
    category: 'US Demographics',
    image: '/blog/alaska-gender-ratio.jpg',
    featured: false,
    tags: ['gender ratio', 'Alaska', 'dating demographics', 'US states']
  },
  {
    slug: 'utah-maine-age-gap-crisis',
    title: 'Utah vs Maine: 15-Year Age Gap Crisis',
    primaryKeyword: 'state age demographics',
    excerpt: 'Utah\'s median age: 31.8 years. Maine\'s: 45.1 years. This 15-year gap creates two completely different Americas—one drowning in kids, the other in retirees. See which states are youngest and oldest.',
    date: '2024-11-10',
    readTime: '11 min read',
    category: 'US Demographics',
    image: '/blog/age-gap-states.jpg',
    featured: false,
    tags: ['age demographics', 'Utah', 'Maine', 'generational divide', 'US states']
  },
  {
    slug: 'nevada-west-virginia-population-gap',
    title: 'Nevada vs West Virginia: Boom vs Bust',
    primaryKeyword: 'state population growth',
    excerpt: 'Nevada grows 15% while West Virginia shrinks 3.2%. One state adds 450,000 people, the other loses 58,000. Discover the tale of two Americas—states booming versus states dying.',
    date: '2024-11-10',
    readTime: '9 min read',
    category: 'US Demographics',
    image: '/blog/nevada-wv-gap.jpg',
    featured: false,
    tags: ['population growth', 'Nevada', 'West Virginia', 'economic divide', 'US states']
  },
  {
    slug: 'texas-added-michigan-population',
    title: 'Texas Added an Entire Michigan Since 2000',
    primaryKeyword: 'Texas population growth',
    excerpt: 'Texas gained 9.7 million people since 2000—equivalent to adding the entire population of Michigan. Growing by 1,400 people daily, Texas is rewriting America\'s demographic map.',
    date: '2024-11-10',
    readTime: '8 min read',
    category: 'US Demographics',
    image: '/blog/texas-growth.jpg',
    featured: false,
    tags: ['Texas', 'population boom', 'migration', 'demographic shift', 'US states']
  },
  {
    slug: 'half-states-under-35-youth-vs-senior-america',
    title: 'Half of States Under 35: Youth vs Senior America',
    primaryKeyword: 'young vs old states',
    excerpt: 'Utah, DC, and Texas have median ages under 35. Maine, Vermont, and West Virginia are over 42. America is splitting into young and old states with radically different futures.',
    date: '2024-11-10',
    readTime: '12 min read',
    category: 'US Demographics',
    image: '/blog/youth-senior-divide.jpg',
    featured: false,
    tags: ['age divide', 'demographics', 'generational gap', 'US states', 'youth vs seniors']
  },
  
  // Global Demographics Articles
  {
    slug: 'megacity-explosion-cities-bigger-than-countries',
    title: 'Megacities: Tokyo Bigger Than All of Canada',
    primaryKeyword: 'megacities',
    excerpt: 'Tokyo has more people than all of Canada. Lagos grows by 1,500 people daily. Delhi adds a Miami every year. Discover how megacities are reshaping human civilization and creating unprecedented urban demographics.',
    date: '2024-11-05',
    readTime: '13 min read',
    category: 'Urban Demographics',
    image: '/blog/megacity-explosion.jpg',
    featured: false,
    tags: ['megacities', 'urban population', 'city demographics', 'population density', 'urbanization', 'infrastructure']
  },
  {
    slug: 'migration-nations-countries-gaining-losing-millions',
    title: 'Migration Crisis: Venezuela Lost 20% Population',
    primaryKeyword: 'migration crisis',
    excerpt: 'Germany gained 2 million migrants in 2 years. Venezuela lost 20% of its population. Syria emptied entire cities. Discover how mass migration is reshaping global demographics faster than birth rates.',
    date: '2024-11-05',
    readTime: '14 min read',
    category: 'Migration Patterns',
    image: '/blog/migration-nations.jpg',
    featured: false,
    tags: ['migration', 'demographics', 'population movement', 'global trends', 'economic impact', 'refugees']
  },
  {
    slug: 'india-beat-china-first-time-300-years-population',
    title: 'India Population Beats China in 2023',
    primaryKeyword: 'India population',
    excerpt: 'April 2023: India became the world\'s most populous country with 1.45 billion people, overtaking China\'s 1.42 billion. The historic demographic reversal reshaping global power that most people missed.',
    date: '2024-11-05',
    readTime: '10 min read',
    category: 'Global Trends',
    image: '/blog/india-china-milestone.jpg',
    featured: false,
    tags: ['india', 'china', 'population milestone', 'global trends', 'historic reversal', 'viral demographics']
  },
  {
    slug: 'half-this-country-under-17-youth-explosion',
    title: 'Youngest Country: Niger Median Age 16.5',
    primaryKeyword: 'youngest country',
    excerpt: 'Niger has a median age of 16.5 years—younger than TikTok\'s minimum age. Nearly half the population can\'t legally drive, vote, or work. Discover how the world\'s youngest country is reshaping global demographics.',
    date: '2024-11-05',
    readTime: '9 min read',
    category: 'Youth Demographics',
    image: '/blog/niger-youth-explosion.jpg',
    featured: false,
    tags: ['niger', 'youngest country', 'youth explosion', 'demographic dividend', 'africa', 'viral demographics']
  },
  {
    slug: 'country-2-5-men-for-every-woman-dating-crisis',
    title: 'Gender Ratio: Qatar 2.5 Men Per Woman',
    primaryKeyword: 'gender ratio',
    excerpt: 'Qatar has 71.3% male population—2.17 million men vs 875,000 women. Discover how extreme gender ratios in Gulf states create unprecedented social dynamics and dating challenges that will shock you.',
    date: '2024-11-05',
    readTime: '8 min read',
    category: 'Social Dynamics',
    image: '/blog/qatar-gender-ratio.jpg',
    featured: false,
    tags: ['qatar', 'gender ratio', 'dating crisis', 'gulf states', 'social dynamics', 'viral demographics']
  },
  {
    slug: 'baby-boom-echo-how-1990s-events-shape-today',
    title: 'Baby Boom Echo: Millennials Housing Crisis',
    primaryKeyword: 'baby boom echo',
    excerpt: 'Why can\'t millennials afford houses? Why are there teacher shortages? The answer lies in demographic waves from the 1940s that peaked in the 1990s and continue reshaping housing, job markets, and politics today.',
    date: '2024-11-05',
    readTime: '16 min read',
    category: 'Historical Impact',
    image: '/blog/baby-boom-echo.jpg',
    featured: false,
    tags: ['baby boom', 'millennials', 'economic cycles', 'housing crisis', 'demographic waves', 'historical trends']
  },
  {
    slug: 'demographic-time-bombs-countries-losing-people',
    title: 'Population Decline: Japan Loses 500K Yearly',
    primaryKeyword: 'population decline',
    excerpt: 'Japan loses 500,000 people annually. South Korea may shrink by 50% by 2100. Eastern Europe empties entire villages. Explore the countries facing catastrophic population decline and the economic devastation that follows.',
    date: '2024-11-05',
    readTime: '18 min read',
    category: 'Population Decline',
    image: '/blog/demographic-time-bombs.jpg',
    featured: false,
    tags: ['population decline', 'aging crisis', 'economic collapse', 'japan', 'south korea', 'eastern europe']
  },
  {
    slug: 'china-india-population-swap-global-shift',
    title: 'India vs China: Historic Population Swap 2023',
    primaryKeyword: 'India China population',
    excerpt: 'April 2023 marked a historic milestone: India officially surpassed China as the world\'s most populous country. Explore the demographic forces behind this shift, from China\'s One-Child Policy to India\'s demographic dividend.',
    date: '2024-11-05',
    readTime: '15 min read',
    category: 'Global Trends',
    image: '/blog/china-india-swap.jpg',
    featured: false,
    tags: ['china', 'india', 'global trends', 'demographic transition', 'population']
  },
  {
    slug: 'youth-explosion-africa-youngest-populations',
    title: 'Youth Explosion: Africa Youngest Continent',
    primaryKeyword: 'Africa youth demographics',
    excerpt: 'In Niger, 50.1% of the population is under 15. Chad follows at 47.8%. While developed nations age rapidly, Sub-Saharan Africa experiences an unprecedented youth boom that could reshape global economics by 2050.',
    date: '2024-11-05',
    readTime: '12 min read',
    category: 'Youth Demographics',
    image: '/blog/youth-explosion.jpg',
    featured: false,
    tags: ['youth', 'africa', 'demographic dividend', 'economic growth', 'development']
  },
  {
    slug: 'worlds-aging-crisis-9-countries-seniors',
    title: 'Aging Crisis: 9 Countries Face Senior Majority',
    primaryKeyword: 'aging crisis',
    excerpt: 'Japan\'s median age has risen 7.5 years since 2000. South Korea ages faster than any nation in history. Italy faces a future where diapers for adults outsell baby diapers 3-to-1. Welcome to the aging revolution.',
    date: '2024-11-05',
    readTime: '8 min read',
    category: 'Aging Societies',
    image: '/blog/aging-crisis.jpg',
    featured: false,
    tags: ['aging', 'demographics', 'japan', 'europe', 'crisis']
  }
];

export default function BlogPage() {
  // Separate posts by category
  const usStatesPosts = blogPosts.filter(post => post.category === 'US Demographics');
  const globalPosts = blogPosts.filter(post => post.category !== 'US Demographics');
  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Demographics Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the fascinating stories hidden in population data. From aging societies to youth booms, 
            explore how demographics shape our world.
          </p>
        </div>

        {/* Featured Article */}
        {featuredPost && (
          <div className="mb-16">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64 sm:h-80 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                      Featured
                    </span>
                    <span className="px-3 py-1 bg-black bg-opacity-50 text-white text-xs font-semibold rounded-full">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-blue-100 mb-4 text-lg leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-blue-100">
                      <span>{featuredPost.date}</span>
                      <span>•</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
                    >
                      Read Article
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* US States Articles Section */}
        {usStatesPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">US States Demographics</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {usStatesPosts.map(post => (
                <div key={post.slug} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
                  <div className="relative h-48 bg-gradient-to-r from-purple-600 to-pink-600">
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs font-semibold rounded">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Read Article →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Demographics Articles */}
        {globalPosts.filter(p => !p.featured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Global Demographics</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {globalPosts.filter(post => !post.featured).map(post => (
                <div key={post.slug} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
                  <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700">
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs font-semibold rounded">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Read Article →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}