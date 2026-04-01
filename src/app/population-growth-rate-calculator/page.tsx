import Link from 'next/link';
import { getGrowthRateData } from '@/lib/growth-rate-data';
import PopulationGrowthInteractiveTool from './PopulationGrowthInteractiveTool';

// JSON-LD Schema for SEO
function generateStructuredData(worldData: any, countries: any[], fastestGrowing: any[], slowestGrowing: any[], usData: any) {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the global population growth rate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The global population growth rate is ${worldData?.annualGrowthRate.toFixed(2)}% per year, meaning the world population grows by approximately ${(worldData?.absoluteChange / 1000000).toFixed(1)} million people annually. At current rates, the global population would double in ${worldData?.doublingTime?.toFixed(1)} years.`
        }
      },
      {
        "@type": "Question",
        "name": "Which country has the highest population growth rate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${fastestGrowing[0]?.name} has the highest population growth rate at ${fastestGrowing[0]?.annualGrowthRate.toFixed(2)}% per year, adding ${(fastestGrowing[0]?.absoluteChange / 1000).toFixed(0)}K people annually to its current population of ${(fastestGrowing[0]?.currentPopulation / 1000000).toFixed(1)} million.`
        }
      },
      {
        "@type": "Question",
        "name": "Which countries have declining populations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${slowestGrowing[0]?.name} has the fastest declining population at ${slowestGrowing[0]?.annualGrowthRate.toFixed(2)}% per year. Other countries with shrinking populations include ${slowestGrowing[1]?.name} (${slowestGrowing[1]?.annualGrowthRate.toFixed(2)}%) and ${slowestGrowing[2]?.name} (${slowestGrowing[2]?.annualGrowthRate.toFixed(2)}%).`
        }
      },
      {
        "@type": "Question",
        "name": "What is the US population growth rate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The United States has a population growth rate of ${usData?.annualGrowthRate.toFixed(2)}% per year, adding approximately ${(usData?.absoluteChange / 1000000).toFixed(2)} million people annually. The US population has grown ${usData?.growthSince2000.toFixed(1)}% since 2000.`
        }
      },
      {
        "@type": "Question",
        "name": "How is population growth rate calculated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Population growth rate = ((Current Population ÷ Previous Population) - 1) × 100. This gives the annual percentage change. The doubling time can be estimated using the Rule of 70: 70 ÷ growth rate = years to double."
        }
      },
      {
        "@type": "Question",
        "name": "Why do some countries have negative growth rates?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Negative growth rates occur when deaths exceed births plus immigration. This happens due to low birth rates, aging populations, emigration, or health crises. Countries like Japan and many in Eastern Europe face this demographic challenge."
        }
      }
    ]
  };

  const webAppStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Population Growth Rate Calculator",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Calculate population growth rates and project future population changes with interactive tools and country rankings"
  };

  const datasetStructuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Global Population Growth Rate Data 2026",
    "description": "Population growth rate statistics for all countries from UN World Population Prospects",
    "creator": {
      "@type": "Organization",
      "name": "United Nations",
      "url": "https://population.un.org/"
    },
    "temporalCoverage": "1950/2025",
    "spatialCoverage": {
      "@type": "Place",
      "name": "World"
    },
    "license": "https://creativecommons.org/licenses/by/4.0/"
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://populationpyramids.org/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Population Growth Rate Calculator",
        "item": "https://populationpyramids.org/population-growth-rate-calculator"
      }
    ]
  };

  return {
    faqStructuredData,
    webAppStructuredData,
    datasetStructuredData,
    breadcrumbStructuredData
  };
}

export default async function PopulationGrowthRateCalculatorPage() {
  const { world: worldData, countries } = await getGrowthRateData();
  
  // Get specific country data for content
  const fastestGrowing = countries.slice(0, 15);
  const slowestGrowing = [...countries].sort((a, b) => a.annualGrowthRate - b.annualGrowthRate).slice(0, 15);
  const usData = countries.find(c => c.slug === 'united-states');

  // Generate structured data
  const {
    faqStructuredData,
    webAppStructuredData,
    datasetStructuredData,
    breadcrumbStructuredData
  } = generateStructuredData(worldData, countries, fastestGrowing, slowestGrowing, usData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* H1 and intro paragraph */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Population Growth Rate by Country 2026: Rankings & Calculator
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Population growth rate measures annual population change as a percentage. The global average is {worldData.annualGrowthRate.toFixed(2)}% per year, 
            ranging from {fastestGrowing[0]?.annualGrowthRate.toFixed(2)}% in {fastestGrowing[0]?.name} to {slowestGrowing[0]?.annualGrowthRate.toFixed(2)}% in {slowestGrowing[0]?.name}. 
            At current rates, the world population grows by {(worldData.absoluteChange / 1000000).toFixed(1)} million people annually, 
            driven by high fertility in Sub-Saharan Africa while Eastern Europe and East Asia experience population decline.
          </p>

          {/* Interactive Tool - Client Component */}
          <PopulationGrowthInteractiveTool 
            worldData={worldData} 
            countries={countries} 
            initialData={{ fastestGrowing, slowestGrowing, usData }}
          />

          {/* Server-Side Rendered Table */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">All 195 Countries Ranked by Population Growth Rate</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Growth Rate</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">2024 Population</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Change</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Growth Since 2000</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {countries.map((country, index) => (
                    <tr key={country.slug} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link href={`/${country.slug}`} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                          <span className="text-xl">{country.flag}</span>
                          <span className="font-medium">{country.name}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {country.region}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <span className={`font-bold text-lg ${
                          country.annualGrowthRate > 3 ? 'text-green-600' :
                          country.annualGrowthRate > 2 ? 'text-green-500' :
                          country.annualGrowthRate > 1 ? 'text-blue-600' :
                          country.annualGrowthRate > 0 ? 'text-gray-700' :
                          country.annualGrowthRate > -1 ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {country.annualGrowthRate > 0 ? '+' : ''}{country.annualGrowthRate.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                        {(country.population2024 / 1000000).toFixed(1)}M
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                        <span className={
                          country.absoluteChange > 0 ? 'text-green-600' : 
                          country.absoluteChange < 0 ? 'text-red-600' : 'text-gray-600'
                        }>
                          {country.absoluteChange > 0 ? '+' : ''}{(country.absoluteChange / 1000).toFixed(0)}K
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                        <span className={
                          country.growthSince2000 > 0 ? 'text-green-600' : 
                          country.growthSince2000 < 0 ? 'text-red-600' : 'text-gray-600'
                        }>
                          {country.growthSince2000 > 0 ? '+' : ''}{country.growthSince2000.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SEO Content Sections */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">Global Population Growth Patterns</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Sub-Saharan Africa Drives Global Growth</h3>
            <p>
              The world's fastest population growth is concentrated in Sub-Saharan Africa, where high fertility rates and improving healthcare 
              create explosive demographic expansion. {fastestGrowing[0]?.name} leads globally with {fastestGrowing[0]?.annualGrowthRate.toFixed(2)}% 
              annual growth, adding {(fastestGrowing[0]?.absoluteChange / 1000).toFixed(0)}K people yearly to its {(fastestGrowing[0]?.currentPopulation / 1000000).toFixed(1)} million population. 
              This pattern extends across the region: {fastestGrowing[1]?.name} ({fastestGrowing[1]?.annualGrowthRate.toFixed(2)}%), 
              {fastestGrowing[2]?.name} ({fastestGrowing[2]?.annualGrowthRate.toFixed(2)}%), and {fastestGrowing[3]?.name} ({fastestGrowing[3]?.annualGrowthRate.toFixed(2)}%) 
              all experience rapid expansion. These rates mean populations double every 15-25 years, creating massive challenges for infrastructure, 
              education, and job creation while offering potential demographic dividends if managed effectively.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Eastern Europe and East Asia Face Population Decline</h3>
            <p>
              At the opposite extreme, much of Eastern Europe and parts of East Asia experience population decline, with {slowestGrowing[0]?.name} 
              leading the decline at {slowestGrowing[0]?.annualGrowthRate.toFixed(2)}% annually, losing {Math.abs(slowestGrowing[0]?.absoluteChange / 1000).toFixed(0)}K 
              people each year. Countries like {slowestGrowing[1]?.name} ({slowestGrowing[1]?.annualGrowthRate.toFixed(2)}%) and 
              {slowestGrowing[2]?.name} ({slowestGrowing[2]?.annualGrowthRate.toFixed(2)}%) face similar demographic challenges. These negative growth 
              rates result from below-replacement fertility, aging populations, emigration, and in some cases, economic hardship or conflict. 
              Such trends create labor shortages, strain pension systems, and threaten long-term economic vitality, forcing governments to consider 
              immigration incentives and family support policies.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Factors Driving Population Growth and Decline</h3>
            <p>
              Population growth results from the complex interaction of births, deaths, and migration. High-growth countries typically exhibit 
              high total fertility rates (4-7 children per woman), young age structures where large cohorts enter reproductive years, and improving 
              healthcare that reduces infant and maternal mortality. Cultural preferences for large families, limited access to family planning, 
              and agricultural economies that benefit from child labor also contribute to rapid growth.
            </p>

            <p>
              Conversely, declining populations reflect total fertility rates below 2.1 children per woman, aging societies where deaths exceed births, 
              and net emigration as people seek better opportunities elsewhere. Economic uncertainty, urbanization, women's education and workforce 
              participation, and cultural shifts toward smaller families all contribute to fertility decline. Countries experiencing conflict, 
              economic collapse, or health crises may see accelerated population loss through emigration and elevated mortality.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Regional Growth Patterns and Future Implications</h2>
            <p>
              Regional growth patterns reveal dramatically different demographic futures. Africa is projected to account for over half of global 
              population growth through 2050, with countries like Nigeria potentially reaching 400 million people. This creates both opportunities 
              through expanded markets and workforces, and challenges through resource strain and urbanization pressure.
            </p>

            <p>
              Europe and East Asia face opposite challenges as shrinking populations threaten economic dynamism and social security systems. 
              Japan has already begun a sustained population decline that could reduce its population by 30% within 50 years, while countries 
              like Germany rely increasingly on immigration to maintain workforce levels. These trends reshape global economic power, trade patterns, 
              and geopolitical influence as young, growing populations gain relative importance.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">The United States: Moderate Growth in Developed Context</h3>
            <p>
              The United States maintains moderate population growth at {usData?.annualGrowthRate.toFixed(2)}% annually, adding approximately 
              {(usData?.absoluteChange / 1000000).toFixed(2)} million people per year to reach {(usData?.currentPopulation / 1000000).toFixed(1)} million. 
              This growth rate reflects below-replacement fertility (1.8 children per woman) supplemented by steady immigration, creating more 
              balanced demographics than most developed nations. The US population has grown {usData?.growthSince2000.toFixed(1)}% since 2000, 
              significantly slower than historical rates but faster than European or East Asian peers. This moderate growth provides economic 
              vitality while avoiding the infrastructure strain of rapid expansion or the economic challenges of population decline.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Economic and Environmental Consequences</h3>
            <p>
              Population growth rates directly impact economic development, resource availability, and environmental sustainability. Rapidly growing 
              populations can provide demographic dividends through expanding workforces and consumer markets, but require massive investments 
              in education, healthcare, and infrastructure to realize these benefits. Without adequate job creation, rapid growth can lead to 
              unemployment, social instability, and increased migration pressure.
            </p>

            <p>
              Declining populations offer environmental benefits through reduced resource consumption and emissions, but create economic challenges 
              through aging societies, labor shortages, and unsustainable public debt. The optimal growth rate depends on economic development level, 
              resource availability, and institutional capacity, with most economists suggesting rates between 0.5-2% annually provide sustainable 
              development opportunities while maintaining environmental balance.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}