import Link from 'next/link';
import { getMedianAgeData } from '@/lib/median-age-data';
import MedianAgeInteractiveTool from './MedianAgeInteractiveTool';

// JSON-LD Schema for SEO with @graph structure
function generateStructuredData(worldData: any, countries: any[], oldestCountries: any[], youngestCountries: any[], usData: any) {
  // Combined schema using @graph
  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://populationpyramids.org/median-age-by-country#webapp",
        "name": "Median Age by Country Explorer",
        "url": "https://populationpyramids.org/median-age-by-country",
        "applicationCategory": "ReferenceApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Interactive tool to explore median ages by country with comprehensive population age breakdowns and demographic analysis",
        "featureList": [
          "195 countries ranked by median age",
          "Interactive age distribution charts",
          "Population comparisons",
          "Regional demographic insights",
          "Youth vs elderly population analysis"
        ],
        "screenshot": "https://populationpyramids.org/og-median-age.png",
        "applicationSubCategory": "Demographics Tool",
        "inLanguage": "en-US"
      },
      {
        "@type": "Dataset",
        "@id": "https://populationpyramids.org/median-age-by-country#dataset",
        "name": "Global Median Age Data 2025",
        "description": "Comprehensive median age statistics and age distribution data for all 195 countries from UN World Population Prospects",
        "url": "https://populationpyramids.org/median-age-by-country",
        "creator": {
          "@type": "Organization",
          "name": "United Nations Department of Economic and Social Affairs",
          "url": "https://population.un.org/"
        },
        "publisher": {
          "@type": "Organization",
          "name": "PopulationPyramids.org",
          "url": "https://populationpyramids.org"
        },
        "distribution": {
          "@type": "DataDownload",
          "encodingFormat": "application/json",
          "contentUrl": "https://populationpyramids.org/api/median-ages"
        },
        "temporalCoverage": "1950/2025",
        "spatialCoverage": {
          "@type": "Place",
          "name": "World"
        },
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "variableMeasured": [
          {
            "@type": "PropertyValue",
            "name": "Median Age",
            "description": "The age that divides a population into two equal halves"
          },
          {
            "@type": "PropertyValue",
            "name": "Youth Percentage",
            "description": "Percentage of population under 15 years old"
          },
          {
            "@type": "PropertyValue",
            "name": "Elderly Percentage",
            "description": "Percentage of population over 65 years old"
          },
          {
            "@type": "PropertyValue",
            "name": "Working Age Percentage",
            "description": "Percentage of population aged 15-64"
          }
        ]
      },
      {
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
            "name": "Median Age by Country",
            "item": "https://populationpyramids.org/median-age-by-country"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is median age?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Median age is the age that divides a population into two numerically equal groups — half are younger, half are older. It is the single best indicator of whether a population is young or old. The world's median age is currently ${worldData?.medianAge.toFixed(1)} years.`
            }
          },
          {
            "@type": "Question",
            "name": "What is the median age in the United States?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The median age in the United States is ${usData?.medianAge.toFixed(1)} years, ranking #${usData ? countries.indexOf(usData) + 1 : 'N/A'} of 195 countries. Approximately ${usData?.youthPercent.toFixed(1)}% of Americans are under 15 and ${usData?.elderlyPercent.toFixed(1)}% are over 65.`
            }
          },
          {
            "@type": "Question",
            "name": "Which country has the highest median age?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${oldestCountries[0]?.name} has the world's highest median age at ${oldestCountries[0]?.medianAge.toFixed(1)} years. The top 5 oldest countries by median age are: ${oldestCountries.slice(0, 5).map(c => `${c.name} (${c.medianAge.toFixed(1)})`).join(', ')}.`
            }
          },
          {
            "@type": "Question",
            "name": "Which country has the youngest population?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${youngestCountries[0]?.name} has the world's lowest median age at ${youngestCountries[0]?.medianAge.toFixed(1)} years. ${youngestCountries[0]?.youthPercent.toFixed(1)}% of its population is under 15 years old.`
            }
          },
          {
            "@type": "Question",
            "name": "What is the median age of the world?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The global median age is ${worldData?.medianAge.toFixed(1)} years. This has increased from approximately 24 years in 1950 as populations worldwide age due to declining fertility and increasing life expectancy.`
            }
          }
        ]
      }
    ]
  };

  return graphSchema;
}

export default async function MedianAgeByCountryPage() {
  const { world: worldData, countries } = await getMedianAgeData();
  
  // Get specific country data
  const oldestCountries = countries.slice(0, 15);
  const youngestCountries = [...countries].sort((a, b) => a.medianAge - b.medianAge).slice(0, 15);
  const usData = countries.find(c => c.slug === 'united-states');

  // Generate structured data
  const structuredData = generateStructuredData(worldData, countries, oldestCountries, youngestCountries, usData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* H1 and intro paragraph */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Median Age by Country 2026: World's Oldest & Youngest Populations
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Median age is the age that divides a population into two equal halves — 50% are younger and 50% are older. 
            It's the single best indicator of whether a country is demographically young or old, directly influencing 
            economic growth, healthcare needs, and social policies. The global median age is {worldData.medianAge.toFixed(1)} years, 
            but varies dramatically from {youngestCountries[0]?.medianAge.toFixed(1)} in {youngestCountries[0]?.name} to {oldestCountries[0]?.medianAge.toFixed(1)} in {oldestCountries[0]?.name}.
          </p>

          {/* Interactive Tool - Client Component */}
          <MedianAgeInteractiveTool 
            worldData={worldData} 
            countries={countries} 
            initialData={{ oldestCountries, youngestCountries, usData }}
          />

          {/* Server-Side Rendered Table */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">All 195 Countries Ranked by Median Age</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Median Age</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">2024 Population</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">YoY Change</th>
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
                          country.medianAge < 20 ? 'text-green-600' :
                          country.medianAge < 30 ? 'text-lime-600' :
                          country.medianAge < 40 ? 'text-yellow-600' :
                          country.medianAge < 50 ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {country.medianAge.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                        {(country.population2024 / 1000000).toFixed(1)}M
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                        {country.populationChange !== undefined ? (
                          <span className={country.populationChange > 0 ? 'text-green-600' : 'text-red-600'}>
                            {country.populationChange > 0 ? '+' : ''}{country.populationChange.toFixed(2)}%
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SEO Content Sections */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">Understanding Global Age Demographics</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">The World's Oldest Populations: Europe and East Asia Lead</h3>
            <p>
              The demographic divide between aging and youthful nations has never been more pronounced. {oldestCountries[0]?.name} tops 
              the list with a median age of {oldestCountries[0]?.medianAge.toFixed(1)} years, where {oldestCountries[0]?.elderlyPercent.toFixed(1)}% 
              of the population is over 65. This pattern extends across Europe and East Asia, where countries like {oldestCountries[1]?.name} ({oldestCountries[1]?.medianAge.toFixed(1)} years), {oldestCountries[2]?.name} ({oldestCountries[2]?.medianAge.toFixed(1)} years), 
              and {oldestCountries[3]?.name} ({oldestCountries[3]?.medianAge.toFixed(1)} years) face shrinking workforces and mounting pension obligations. 
              These aging societies reflect decades of declining birth rates combined with increasing life expectancy, creating inverted population 
              pyramids that challenge traditional economic models.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Africa's Youth Explosion: The World's Youngest Countries</h3>
            <p>
              In stark contrast, Sub-Saharan Africa dominates the youngest demographics globally. {youngestCountries[0]?.name} has 
              the world's lowest median age at just {youngestCountries[0]?.medianAge.toFixed(1)} years, meaning half its population 
              hasn't reached their {Math.ceil(youngestCountries[0]?.medianAge)}th birthday. With {youngestCountries[0]?.youthPercent.toFixed(1)}% 
              under age 15, countries like {youngestCountries[1]?.name} ({youngestCountries[1]?.medianAge.toFixed(1)} years) 
              and {youngestCountries[2]?.name} ({youngestCountries[2]?.medianAge.toFixed(1)} years) face the opposite challenge: 
              providing education, healthcare, and eventually employment for massive youth cohorts. This demographic dividend could fuel 
              economic growth if properly managed, or create instability if opportunities remain scarce.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Regional Patterns: From Youth Bulges to Silver Tsunamis</h3>
            <p>
              Regional patterns in median age reveal profound global disparities. While African nations cluster below 20 years median age, 
              European countries consistently exceed 40 years. Asia shows the most diversity, from aging giants like Japan and South Korea 
              to youthful populations in Afghanistan and Pakistan. The Americas fall in between, with the United States at {usData?.medianAge.toFixed(1)} years 
              maintaining relative demographic balance compared to rapidly aging Canada or youthful Central American nations. These patterns 
              directly correlate with economic development stages: countries transition from high fertility/high mortality through demographic 
              transition to low fertility/low mortality, with median age rising throughout this progression.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">What Median Age Reveals About National Development</h2>
            <p>
              Median age serves as a powerful proxy for a nation's development stage and future trajectory. Countries with median ages below 20 
              typically exhibit characteristics of developing economies: high fertility rates, large families, agricultural-based economies, and 
              limited social safety nets. As median age rises to 25-35, nations often experience their demographic dividend — a sweet spot where 
              large working-age populations drive economic growth while dependency ratios remain manageable. Countries reaching 40+ median age face 
              the challenges of developed economies: aging workforces, rising healthcare costs, pension system strain, and the need for increased 
              immigration or automation to maintain economic vitality. Understanding these patterns helps policymakers, businesses, and investors 
              anticipate future challenges and opportunities across different markets.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}