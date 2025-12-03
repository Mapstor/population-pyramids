import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadStates, loadStateData, getAvailableYears } from '@/lib/state-data-loader';
import { calculateMetrics } from '@/lib/calculations';
import { cleanStateYearData } from '@/lib/state-data-cleaner';
import PopulationPyramid from '@/components/PopulationPyramid';
import TimelinePyramid from '@/components/TimelinePyramid';
import StatsTable from '@/components/StatsTable';
import StateComparisonSection from '@/components/StateComparisonSection';
import { Metadata } from 'next';

export const dynamicParams = false;
export const revalidate = false;

interface StatePageProps {
  params: {
    state: string;
  };
}

// Generate static params for all states
export async function generateStaticParams() {
  const states = await loadStates();
  return states.map((state: any) => ({
    state: state.slug
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  try {
    const stateSlug = params.state;
    const stateData = await loadStateData(stateSlug);
    const availableYears = getAvailableYears(stateData);
    const latestYear = Math.max(...availableYears);
    const yearData = stateData.years[latestYear.toString()];
    
    return {
      title: `${stateData.stateName} Population Pyramid 2024 - Demographics & Age Distribution`,
      description: `Explore ${stateData.stateName}'s population pyramid and demographic data for 2024. Total population: ${yearData.totalPopulation.toLocaleString()}. Interactive visualizations showing age distribution, gender balance, and demographic trends from 2000-2024.`,
      keywords: `${stateData.stateName} population pyramid, ${stateData.stateName} demographics, ${stateData.stateName} population, ${stateData.stateName} age distribution, ${stateData.stateName} census data, ${stateData.stateName} population statistics`,
      openGraph: {
        title: `${stateData.stateName} Population Pyramid & Demographics 2024`,
        description: `Interactive population pyramid and demographic analysis for ${stateData.stateName}. Population: ${yearData.totalPopulation.toLocaleString()}`,
        type: 'website',
        url: `https://populationpyramids.org/states/${stateSlug}`,
      }
    };
  } catch {
    return {
      title: 'State Not Found'
    };
  }
}

export default async function StatePage({ params }: StatePageProps) {
  try {
    const stateSlug = params.state;
    const stateData = await loadStateData(stateSlug);
    
    // Clean the data to fix elderly age group issues
    Object.keys(stateData.years).forEach(year => {
      stateData.years[year] = cleanStateYearData(stateData.years[year]);
    });
    
    const states = await loadStates();
    const availableYears = getAvailableYears(stateData);
    const latestYear = Math.max(...availableYears);
    const yearData = stateData.years[latestYear.toString()];
    const metrics = calculateMetrics(yearData);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition">
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/states" className="hover:text-blue-600 transition">
                  US States
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">{stateData.stateName}</li>
            </ol>
          </nav>

          {/* Hero Section with SEO Keywords */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 mb-8 shadow-lg">
            <h1 className="text-3xl font-bold mb-3">
              {stateData.stateName} Population Pyramid {latestYear}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">👥</span>
                <div>
                  <div className="text-blue-100 text-xs">Total Population</div>
                  <div className="font-bold">{yearData.totalPopulation.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <div>
                  <div className="text-blue-100 text-xs">Median Age</div>
                  <div className="font-bold">{yearData.medianAge ? yearData.medianAge.toFixed(1) : yearData.medianAge} years</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🏛️</span>
                <div>
                  <div className="text-blue-100 text-xs">State Code</div>
                  <div className="font-bold">{stateData.stateCode}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🗺️</span>
                <div>
                  <div className="text-blue-100 text-xs">Region</div>
                  <div className="font-bold">{stateData.region}</div>
                </div>
              </div>
            </div>
          </div>


          {/* STATIC POPULATION PYRAMID - Latest Year */}
          <section className="mb-12">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {stateData.stateName} Population Pyramid {latestYear}
              </h2>
              <p className="text-gray-600 mb-6">
                Current age and gender distribution for {stateData.stateName}'s {yearData.totalPopulation.toLocaleString()} residents
              </p>
              <PopulationPyramid
                data={yearData}
                countryName={stateData.stateName}
                year={latestYear}
                height={600}
              />
            </div>
          </section>

          {/* ANIMATED TIMELINE PYRAMID - 2000-2024 */}
          <section className="mb-12">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {stateData.stateName} Population Changes 2000-2024
              </h2>
              <p className="text-gray-600 mb-6">
                Watch how {stateData.stateName}'s demographics evolved over the past 24 years
              </p>
              <TimelinePyramid
                countryData={stateData}
                countryName={stateData.stateName}
                className="mt-6"
              />
            </div>
          </section>

          {/* Compact Demographics Overview */}
          <section className="mb-12">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {stateData.stateName} Demographics Overview
              </h2>
              
              {/* Primary Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-700 font-medium uppercase">Total Population</p>
                  <p className="text-xl font-bold text-blue-900">{yearData.totalPopulation.toLocaleString()}</p>
                  <p className="text-xs text-blue-600 mt-1">{latestYear}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-700 font-medium uppercase">Median Age</p>
                  <p className="text-xl font-bold text-green-900">{yearData.medianAge ? yearData.medianAge.toFixed(1) : 'N/A'} yrs</p>
                  <p className="text-xs text-green-600 mt-1">US: 38.5</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-700 font-medium uppercase">Sex Ratio</p>
                  <p className="text-xl font-bold text-purple-900">{Math.round((yearData.malePopulation / yearData.femalePopulation) * 100)}</p>
                  <p className="text-xs text-purple-600 mt-1">M per 100 F</p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs text-orange-700 font-medium uppercase">Growth '00-'24</p>
                  <p className="text-xl font-bold text-orange-900">
                    {(() => {
                      const year2000 = stateData.years['2000'];
                      if (year2000) {
                        const growth = ((yearData.totalPopulation - year2000.totalPopulation) / year2000.totalPopulation * 100);
                        return growth > 0 ? '+' + growth.toFixed(1) + '%' : growth.toFixed(1) + '%';
                      }
                      return 'N/A';
                    })()}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">24-year</p>
                </div>
              </div>

              {/* Detailed Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Age Structure */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-bold text-gray-700 uppercase mb-2">Age Structure</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Youth (0-14)</span>
                      <span className="font-semibold">{metrics.youthPercentage.toFixed(1)}% • {Math.round(yearData.totalPopulation * metrics.youthPercentage / 100).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Working (15-64)</span>
                      <span className="font-semibold">{metrics.workingAgePercentage.toFixed(1)}% • {Math.round(yearData.totalPopulation * metrics.workingAgePercentage / 100).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Seniors (65+)</span>
                      <span className="font-semibold">{metrics.elderlyPercentage.toFixed(1)}% • {Math.round(yearData.totalPopulation * metrics.elderlyPercentage / 100).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1 border-t">
                      <span className="text-gray-600">Very Old (85+)</span>
                      <span className="font-semibold">
                        {(() => {
                          const veryOld = yearData.ageGroups
                            .filter(ag => ag.ageRange === '85+' || ag.ageRange === '85-89' || 
                                         (ag.ageRange === '100+' && ag.total > 0))
                            .reduce((sum, ag) => sum + ag.total, 0);
                          const percent = (veryOld / yearData.totalPopulation * 100);
                          return `${percent.toFixed(1)}% • ${veryOld.toLocaleString()}`;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dependency & Economic */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-bold text-gray-700 uppercase mb-2">Dependency Ratios</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Youth Dep.</span>
                      <span className="font-semibold">{metrics.youthDependencyRatio ? metrics.youthDependencyRatio.toFixed(1) : 'N/A'} per 100</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Old-age Dep.</span>
                      <span className="font-semibold">{metrics.oldAgeDependencyRatio ? metrics.oldAgeDependencyRatio.toFixed(1) : 'N/A'} per 100</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Total Dep.</span>
                      <span className="font-semibold">{metrics.totalDependencyRatio ? metrics.totalDependencyRatio.toFixed(1) : 'N/A'} per 100</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1 border-t">
                      <span className="text-gray-600">Support Ratio</span>
                      <span className="font-semibold">{metrics.oldAgeDependencyRatio ? (100 / metrics.oldAgeDependencyRatio).toFixed(1) : 'N/A'} : 1</span>
                    </div>
                  </div>
                </div>

                {/* Gender & Demographics */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-bold text-gray-700 uppercase mb-2">Gender Balance</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Male Pop.</span>
                      <span className="font-semibold">{((yearData.malePopulation / yearData.totalPopulation) * 100).toFixed(1)}% • {yearData.malePopulation.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Female Pop.</span>
                      <span className="font-semibold">{((yearData.femalePopulation / yearData.totalPopulation) * 100).toFixed(1)}% • {yearData.femalePopulation.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Gap</span>
                      <span className="font-semibold">{Math.abs(yearData.malePopulation - yearData.femalePopulation).toLocaleString()} more {yearData.femalePopulation > yearData.malePopulation ? 'F' : 'M'}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1 border-t">
                      <span className="text-gray-600">Density</span>
                      <span className="font-semibold">{(yearData.totalPopulation / 52420).toFixed(0)}/mi²</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historical Comparison */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-6">
                <p className="text-xs font-bold text-blue-900 uppercase mb-1">Historical Trends</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  {[2000, 2010, 2020, 2024].map(year => {
                    const data = stateData.years[year.toString()];
                    if (!data) return null;
                    return (
                      <div key={year}>
                        <span className="text-blue-700 font-semibold">{year}:</span>
                        <span className="text-blue-900 ml-1">{data.totalPopulation.toLocaleString()}</span>
                        {year !== 2000 && stateData.years['2000'] && (
                          <span className="text-blue-600 ml-1">
                            ({((data.totalPopulation - stateData.years['2000'].totalPopulation) / stateData.years['2000'].totalPopulation * 100 > 0 ? '+' : '')}{((data.totalPopulation - stateData.years['2000'].totalPopulation) / stateData.years['2000'].totalPopulation * 100).toFixed(0)}%)
                          </span>
                        )}
                      </div>
                    );
                  }).filter(Boolean)}
                </div>
              </div>
              
              <StatsTable 
                data={yearData} 
                metrics={metrics} 
                countryName={stateData.stateName}
                year={latestYear}
              />
            </div>
          </section>

          {/* State Comparison Section with Mini Pyramids */}
          <StateComparisonSection
            currentState={stateData}
            currentYearData={yearData}
            currentMetrics={metrics}
          />

          {/* Related Insights and Analysis */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-sm p-6 border border-indigo-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Trending Analysis & State Rankings
              </h2>
              <div className="space-y-4">
                {(() => {
                  const stateNameLower = stateData.stateName.toLowerCase();
                  const relatedArticles = [];
                  
                  // Check if state is in fastest growing
                  const fastGrowingStates = ['south carolina', 'florida', 'texas', 'idaho', 'north carolina', 'georgia', 'utah', 'tennessee', 'nevada', 'arizona', 'delaware', 'montana', 'oklahoma', 'colorado', 'oregon'];
                  if (fastGrowingStates.includes(stateNameLower)) {
                    relatedArticles.push({
                      title: "15 Fastest Growing States in 2024",
                      description: `${stateData.stateName} ranks among America's fastest-growing states, attracting thousands with its economic opportunities and lifestyle benefits.`,
                      link: "/blog/fastest-growing-states"
                    });
                  }
                  
                  // Check if state is losing population
                  const fleeingStates = ['new jersey', 'illinois', 'new york', 'massachusetts', 'california', 'maryland', 'ohio', 'louisiana', 'west virginia', 'hawaii'];
                  if (fleeingStates.includes(stateNameLower)) {
                    relatedArticles.push({
                      title: "10 States People Are Fleeing in 2024",
                      description: `Discover why residents are leaving ${stateData.stateName} and where they're heading in the great American migration.`,
                      link: "/blog/states-people-fleeing"
                    });
                  }
                  
                  // Check if state is good for retirement
                  const retirementStates = ['delaware', 'south carolina', 'georgia', 'nevada', 'florida', 'tennessee', 'alabama', 'north carolina', 'arizona', 'texas', 'virginia', 'oklahoma', 'arkansas', 'mississippi', 'kentucky'];
                  if (retirementStates.includes(stateNameLower)) {
                    relatedArticles.push({
                      title: "Best States to Retire 2025",
                      description: `See why ${stateData.stateName} is attracting retirees with its tax advantages, climate, and cost of living benefits.`,
                      link: "/blog/best-states-retire"
                    });
                  }
                  
                  // Check if state is affected by climate migration
                  const climateStates = ['louisiana', 'florida', 'california', 'texas', 'arizona', 'mississippi', 'alaska', 'oklahoma', 'nevada', 'new mexico', 'west virginia', 'hawaii'];
                  const climateHavenStates = ['michigan', 'vermont', 'maine', 'minnesota', 'wisconsin'];
                  if (climateStates.includes(stateNameLower)) {
                    relatedArticles.push({
                      title: "Climate Refugees: 12 States Americans Flee Due to Weather",
                      description: `${stateData.stateName} faces increasing climate challenges driving residents to seek safer locations across America.`,
                      link: "/blog/climate-refugees-states-flee-weather"
                    });
                  } else if (climateHavenStates.includes(stateNameLower)) {
                    relatedArticles.push({
                      title: "Climate Refugees: 12 States Americans Flee Due to Weather",
                      description: `${stateData.stateName} emerges as a climate haven, attracting Americans fleeing extreme weather and natural disasters.`,
                      link: "/blog/climate-refugees-states-flee-weather"
                    });
                  }
                  
                  // Check if state is affected by remote work
                  const remoteWinnerStates = ['montana', 'idaho', 'utah', 'maine', 'vermont', 'wyoming', 'new hampshire', 'tennessee', 'arizona', 'colorado', 'nevada', 'south carolina', 'north carolina', 'texas', 'florida'];
                  const remoteLoserStates = ['california', 'new york', 'illinois', 'massachusetts', 'washington'];
                  if (remoteWinnerStates.includes(stateNameLower)) {
                    relatedArticles.push({
                      title: "Remote Work Exodus: 15 States Where WFH Changed Everything",
                      description: `${stateData.stateName} transformed by the remote work revolution, with tech workers driving up housing costs and reshaping local communities.`,
                      link: "/blog/remote-work-exodus-states-wfh-changed"
                    });
                  } else if (remoteLoserStates.includes(stateNameLower)) {
                    relatedArticles.push({
                      title: "Remote Work Exodus: 15 States Where WFH Changed Everything",
                      description: `The remote work revolution triggered a massive exodus from ${stateData.stateName} as workers sought lower costs and better lifestyles.`,
                      link: "/blog/remote-work-exodus-states-wfh-changed"
                    });
                  }
                  
                  // If no specific articles match, show general trending content
                  if (relatedArticles.length === 0) {
                    relatedArticles.push({
                      title: "15 Fastest Growing States in 2024",
                      description: "Discover which states are experiencing explosive growth and how your state compares in the national migration patterns.",
                      link: "/blog/fastest-growing-states"
                    });
                    relatedArticles.push({
                      title: "Best States to Retire 2025",
                      description: "Compare retirement destinations across America based on taxes, healthcare, climate, and cost of living.",
                      link: "/blog/best-states-retire"
                    });
                  }
                  
                  return relatedArticles.map((article, index) => (
                    <Link key={index} href={article.link} className="block group">
                      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-400 transition-all hover:shadow-md">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {article.description}
                        </p>
                      </div>
                    </Link>
                  ));
                })()}
              </div>
            </div>
          </section>

          {/* Detailed Demographic Analysis */}
          <section className="mb-12">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Detailed {stateData.stateName} Demographic Analysis
              </h2>
              
              {/* Gender Balance Analysis */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Gender Distribution</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {stateData.stateName}'s population of {yearData.totalPopulation.toLocaleString()} consists of{' '}
                  {yearData.malePopulation.toLocaleString()} males ({((yearData.malePopulation / yearData.totalPopulation) * 100).toFixed(1)}%) and{' '}
                  {yearData.femalePopulation.toLocaleString()} females ({((yearData.femalePopulation / yearData.totalPopulation) * 100).toFixed(1)}%). 
                  This represents a sex ratio of {Math.round((yearData.malePopulation / yearData.femalePopulation) * 100)} males per 100 females, 
                  which is {Math.round((yearData.malePopulation / yearData.femalePopulation) * 100) > 97 ? 'relatively balanced' : 'slightly female-skewed'} compared to the national average.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The gender balance varies significantly across age groups. In younger cohorts (0-24 years), males slightly outnumber females, 
                  which is typical due to naturally higher male birth rates. However, in older age groups (65+), females substantially outnumber males 
                  due to their longer life expectancy. This pattern has important implications for healthcare planning, particularly for gender-specific 
                  medical services and elder care facilities.
                </p>
              </div>

              {/* Age Structure Deep Dive */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Age Structure and Dependency Ratios</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The median age of {yearData.medianAge || 'N/A'} years places {stateData.stateName} {
                    yearData.medianAge > 38.5 ? 'above' : 'below'
                  } the national median, indicating a {
                    yearData.medianAge > 40 ? 'relatively older' : 
                    yearData.medianAge > 35 ? 'middle-aged' : 
                    'relatively younger'
                  } population profile. The youth dependency ratio stands at {metrics.youthDependencyRatio ? metrics.youthDependencyRatio.toFixed(1) : 'N/A'}, 
                  meaning there are approximately {metrics.youthDependencyRatio ? metrics.youthDependencyRatio.toFixed(0) : 'N/A'} children and teenagers for every 100 working-age adults. 
                  Meanwhile, the old-age dependency ratio is {metrics.oldAgeDependencyRatio ? metrics.oldAgeDependencyRatio.toFixed(1) : 'N/A'}, indicating {metrics.oldAgeDependencyRatio ? metrics.oldAgeDependencyRatio.toFixed(0) : 'N/A'} seniors 
                  for every 100 working-age residents.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The total dependency ratio of {metrics.totalDependencyRatio ? metrics.totalDependencyRatio.toFixed(1) : 'N/A'} suggests that each working-age person in {stateData.stateName} 
                  theoretically supports {metrics.totalDependencyRatio ? (metrics.totalDependencyRatio / 100).toFixed(2) : 'N/A'} dependents. This ratio is crucial for understanding 
                  the economic burden on the productive population and has direct implications for tax policy, social services funding, 
                  and workforce development strategies.
                </p>
              </div>

              {/* Working Age Population Analysis */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Labor Force and Economic Potential</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {stateData.stateName}'s working-age population (15-64 years) comprises {metrics.workingAgePercentage.toFixed(1)}% of the total population, 
                  representing approximately {Math.round(yearData.totalPopulation * metrics.workingAgePercentage / 100).toLocaleString()} potential workers. 
                  This demographic segment is the economic engine of the state, generating tax revenue, driving consumer spending, 
                  and supporting both younger and older dependents.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Within the working-age population, the distribution across age cohorts reveals important economic dynamics. 
                  The 25-54 age range, often considered prime working years, represents the core of {stateData.stateName}'s labor force. 
                  The size and growth trajectory of this group directly impacts economic productivity, housing demand, and consumer market dynamics. 
                  {metrics.workingAgePercentage > 65 ? 
                    `With a robust ${metrics.workingAgePercentage.toFixed(1)}% working-age population, ${stateData.stateName} is well-positioned for economic growth.` :
                    `The working-age percentage of ${metrics.workingAgePercentage.toFixed(1)}% suggests potential labor force challenges that may require targeted immigration or retention policies.`
                  }
                </p>
              </div>

              {/* Youth Population Analysis */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Youth Demographics and Future Workforce</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The youth population (ages 0-14) accounts for {metrics.youthPercentage.toFixed(1)}% of {stateData.stateName}'s total population, 
                  numbering approximately {Math.round(yearData.totalPopulation * metrics.youthPercentage / 100).toLocaleString()} children and teenagers. 
                  This cohort represents the future workforce and tax base of the state. The size of this group relative to the total population 
                  indicates {metrics.youthPercentage > 20 ? 'strong population momentum and future growth potential' : 
                           metrics.youthPercentage > 17 ? 'moderate regeneration capacity' : 
                           'potential challenges in maintaining population levels without migration'}.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Educational infrastructure requirements are directly tied to youth population size. With approximately{' '}
                  {Math.round(yearData.totalPopulation * metrics.youthPercentage / 100 / 3).toLocaleString()} children in each 5-year age cohort, 
                  {stateData.stateName} must maintain adequate capacity in elementary, middle, and high schools. 
                  The transition of these youth cohorts into working age over the next two decades will be critical for replacing 
                  retiring baby boomers and maintaining economic vitality.
                </p>
              </div>

              {/* Senior Population Analysis */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Aging Population and Healthcare Implications</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {stateData.stateName}'s senior population (65+) comprises {metrics.elderlyPercentage.toFixed(1)}% of residents, 
                  totaling approximately {Math.round(yearData.totalPopulation * metrics.elderlyPercentage / 100).toLocaleString()} individuals. 
                  This represents {metrics.elderlyPercentage > 16 ? 'a significantly aged population requiring substantial senior services' :
                               metrics.elderlyPercentage > 13 ? 'a moderately aged population with growing senior care needs' :
                               'a relatively young population with manageable senior care requirements'}.
                  The aging index of {metrics.agingIndex ? metrics.agingIndex.toFixed(1) : 'N/A'} indicates there are {metrics.agingIndex ? metrics.agingIndex.toFixed(0) : 'N/A'} seniors 
                  for every 100 children under 15, reflecting the state's position in the demographic transition.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Healthcare system capacity becomes increasingly critical with {metrics.elderlyPercentage.toFixed(1)}% of the population 
                  in age groups with higher medical needs. The 85+ population, requiring the most intensive care, represents 
                  the fastest-growing segment in many states. {stateData.stateName} must plan for expanded geriatric care, 
                  assisted living facilities, and specialized medical services. The potential support ratio of {metrics.potentialSupportRatio ? metrics.potentialSupportRatio.toFixed(1) : 'N/A'} 
                  means there are approximately {metrics.potentialSupportRatio ? metrics.potentialSupportRatio.toFixed(0) : 'N/A'} working-age adults for each senior, 
                  a critical metric for understanding the sustainability of pension systems and senior care programs.
                </p>
              </div>

              {/* Population Growth Trends */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Population Growth and Migration Patterns</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Between 2000 and {latestYear}, {stateData.stateName}'s population evolved from{' '}
                  {stateData.years['2000'].totalPopulation.toLocaleString()} to {yearData.totalPopulation.toLocaleString()}, 
                  representing a {((yearData.totalPopulation - stateData.years['2000'].totalPopulation) / stateData.years['2000'].totalPopulation * 100).toFixed(1)}%{' '}
                  {yearData.totalPopulation > stateData.years['2000'].totalPopulation ? 'increase' : 'decrease'}. 
                  This translates to an average annual growth rate of{' '}
                  {((Math.pow(yearData.totalPopulation / stateData.years['2000'].totalPopulation, 1/24) - 1) * 100).toFixed(2)}%, 
                  {(Math.pow(yearData.totalPopulation / stateData.years['2000'].totalPopulation, 1/24) - 1) > 0.007 ? 'exceeding' : 'trailing'} the national average.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The median age shift from {stateData.years['2000'].medianAge} years in 2000 to {yearData.medianAge || 'N/A'} years 
                  in {latestYear} reflects broader demographic transitions. This {yearData.medianAge - stateData.years['2000'].medianAge > 0 ? 'increase' : 'change'} of{' '}
                  {yearData.medianAge && stateData.years['2000'].medianAge ? Math.abs(yearData.medianAge - stateData.years['2000'].medianAge).toFixed(1) : 'N/A'} years indicates{' '}
                  {yearData.medianAge - stateData.years['2000'].medianAge > 3 ? 'significant population aging' :
                   yearData.medianAge - stateData.years['2000'].medianAge > 1 ? 'moderate aging trends' :
                   'relative age stability'}. These patterns result from the complex interplay of birth rates, death rates, 
                  and migration flows that shape {stateData.stateName}'s demographic landscape.
                </p>
              </div>

              {/* Economic and Social Implications */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Economic and Social Policy Implications</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {stateData.stateName}'s demographic structure has profound implications for economic planning and social policy. 
                  With {metrics.workingAgePercentage.toFixed(1)}% of the population in prime productive years, the state's tax base 
                  and economic output depend heavily on this group's employment rates and productivity levels. 
                  The relatively {metrics.elderlyPercentage > 16 ? 'high' : metrics.elderlyPercentage > 13 ? 'moderate' : 'low'} senior 
                  population share of {metrics.elderlyPercentage.toFixed(1)}% creates{' '}
                  {metrics.elderlyPercentage > 16 ? 'substantial pressure' : metrics.elderlyPercentage > 13 ? 'growing pressure' : 'manageable pressure'} on 
                  pension systems, Medicare, and social security programs.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Educational investment priorities must align with the youth population of {metrics.youthPercentage.toFixed(1)}%. 
                  {metrics.youthPercentage < 17 ? 
                    `The relatively small youth cohort suggests potential school consolidations and resource reallocation may be necessary.` :
                    `The substantial youth population requires continued investment in educational infrastructure and teacher recruitment.`
                  } Furthermore, workforce development programs must anticipate the skills needed as {Math.round(yearData.totalPopulation * metrics.youthPercentage / 100).toLocaleString()} 
                  young people enter the labor market over the coming decades, while simultaneously managing the transition of 
                  {' '}{Math.round(yearData.totalPopulation * metrics.elderlyPercentage / 100).toLocaleString()} seniors into retirement.
                </p>
              </div>
            </div>
          </section>

          {/* Population Growth Analysis */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-sm p-6 border border-green-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {stateData.stateName} Population Dynamics Summary
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {stateData.stateName}'s population pyramid and demographic indicators reveal a state {
                  metrics.pyramidType === 'expansive' ? 'with strong growth potential and a young population base' :
                  metrics.pyramidType === 'stationary' ? 'in demographic transition with balanced age cohorts' :
                  'facing demographic challenges with an aging population and narrowing base'
                }. The current demographic structure suggests {stateData.stateName} will need to focus on{' '}
                {metrics.elderlyPercentage > 16 ? 'expanding senior services and healthcare infrastructure' :
                 metrics.youthPercentage > 20 ? 'educational investment and youth development programs' :
                 'balanced policies addressing both youth development and senior care needs'}.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Looking ahead, these demographic trends will shape {stateData.stateName}'s economic competitiveness, 
                fiscal sustainability, and quality of life. Policy makers must consider these population dynamics 
                when planning infrastructure investments, designing social programs, and developing economic strategies 
                that leverage the state's demographic strengths while addressing its challenges.
              </p>
            </div>
          </section>

          {/* SEO Footer Content */}
          <section className="mb-8">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                About {stateData.stateName} Demographics Data
              </h3>
              <p className="text-gray-700 text-sm">
                This {stateData.stateName} population pyramid and demographic analysis uses official US Census data 
                to provide accurate, up-to-date population statistics. The interactive visualizations help researchers, 
                policymakers, businesses, and students understand {stateData.stateName}'s demographic structure and trends.
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading state data:', error);
    notFound();
  }
}