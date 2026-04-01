import Link from 'next/link';
import { getGenderRatioData } from '@/lib/gender-ratio-data';
import GenderRatioInteractiveTool from './GenderRatioInteractiveTool';

// JSON-LD Schema for SEO
function generateStructuredData(worldData: any, countries: any[], highestRatioCountries: any[], lowestRatioCountries: any[], usData: any) {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the male to female ratio in the world?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The global male to female ratio is approximately ${worldData?.ratio.toFixed(1)} males per 100 females, with ${(worldData?.male / 1000000000).toFixed(1)} billion males and ${(worldData?.female / 1000000000).toFixed(1)} billion females worldwide. Males slightly outnumber females overall because more boys are born than girls, though women outnumber men in older age groups.`
        }
      },
      {
        "@type": "Question",
        "name": "What is the ratio of men to women globally?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Globally, there are roughly ${worldData?.ratio.toFixed(1)} men for every 100 women, making the population approximately ${worldData?.malePercent.toFixed(1)}% male and ${worldData?.femalePercent.toFixed(1)}% female.`
        }
      },
      {
        "@type": "Question",
        "name": "What is the human sex ratio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The human sex ratio at birth is naturally about 105 males per 100 females. Over a lifetime this evens out because males have higher mortality at every age. By age 65+, women outnumber men in nearly every country.`
        }
      },
      {
        "@type": "Question",
        "name": "What is the sex ratio at birth?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The natural human sex ratio at birth is approximately 105 boys per 100 girls. Some countries show ratios above 110 due to sex-selective practices, while others are near the natural rate.`
        }
      },
      {
        "@type": "Question",
        "name": "What country has the highest male to female ratio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${highestRatioCountries[0]?.name} has the highest male to female ratio at ${highestRatioCountries[0]?.ratio.toFixed(1)} per 100, driven primarily by male migrant workers.`
        }
      },
      {
        "@type": "Question",
        "name": "What is the gender ratio in the United States?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The US has a sex ratio of ${usData?.ratio.toFixed(1)} males per 100 females, with approximately ${(usData?.male / 1000000).toFixed(1)} million males and ${(usData?.female / 1000000).toFixed(1)} million females.`
        }
      }
    ]
  };

  const webAppStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Gender Ratio Calculator",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Interactive tool to explore and compare male to female ratios by country and age group"
  };

  const datasetStructuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Global Male to Female Ratio Data 2026",
    "description": "Gender ratio statistics for all countries from UN World Population Prospects",
    "creator": {
      "@type": "Organization",
      "name": "United Nations",
      "url": "https://population.un.org/"
    },
    "distribution": {
      "@type": "DataDownload",
      "encodingFormat": "application/json",
      "contentUrl": "https://populationpyramids.org/api/gender-ratios"
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
        "name": "Male to Female Ratio",
        "item": "https://populationpyramids.org/male-to-female-ratio"
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

export default async function MaleToFemaleRatioPage() {
  const { world: worldData, countries } = await getGenderRatioData();
  
  // Get specific country data for content
  const highestRatioCountries = countries.slice(0, 15);
  const lowestRatioCountries = [...countries].sort((a, b) => a.ratio - b.ratio).slice(0, 15);
  const usData = countries.find(c => c.slug === 'united-states');

  // Generate structured data
  const {
    faqStructuredData,
    webAppStructuredData,
    datasetStructuredData,
    breadcrumbStructuredData
  } = generateStructuredData(worldData, countries, highestRatioCountries, lowestRatioCountries, usData);

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
            Male to Female Ratio by Country 2026: Global Gender Demographics
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Male-to-female ratio measures how many males exist per 100 females in a population. The global average is {worldData.ratio.toFixed(1)} males 
            per 100 females, but this varies dramatically worldwide — from {lowestRatioCountries[0]?.ratio.toFixed(1)} in {lowestRatioCountries[0]?.name} 
            to {highestRatioCountries[0]?.ratio.toFixed(1)} in {highestRatioCountries[0]?.name}. These imbalances reflect migration patterns, 
            cultural factors, conflict history, and varying male-female life expectancy gaps across regions.
          </p>

          {/* Interactive Tool - Client Component */}
          <GenderRatioInteractiveTool 
            worldData={worldData} 
            countries={countries} 
            initialData={{ highestRatioCountries, lowestRatioCountries, usData }}
          />

          {/* Server-Side Rendered Table */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">All 195 Countries Ranked by Male-to-Female Ratio</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sex Ratio</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Male %</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Female %</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">2024 Population</th>
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
                          country.ratio > 110 ? 'text-blue-600' :
                          country.ratio > 103 ? 'text-blue-500' :
                          country.ratio > 97 ? 'text-gray-900' :
                          country.ratio > 90 ? 'text-pink-500' :
                          'text-pink-600'
                        }`}>
                          {country.ratio.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                        {country.malePercent.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                        {country.femalePercent.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                        {(country.total / 1000000).toFixed(1)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SEO Content Sections */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">Global Gender Demographics: Understanding Sex Ratios</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Gulf States Lead in Male-Heavy Demographics</h3>
            <p>
              The world's most extreme gender imbalances occur in Gulf states, where massive male labor migration creates unprecedented sex ratios. 
              {highestRatioCountries[0]?.name} leads globally with {highestRatioCountries[0]?.ratio.toFixed(1)} males per 100 females, 
              meaning {highestRatioCountries[0]?.malePercent.toFixed(1)}% of its population is male. This pattern extends across the 
              region: {highestRatioCountries[1]?.name} ({highestRatioCountries[1]?.ratio.toFixed(1)}), {highestRatioCountries[2]?.name} ({highestRatioCountries[2]?.ratio.toFixed(1)}), 
              and {highestRatioCountries[3]?.name} ({highestRatioCountries[3]?.ratio.toFixed(1)}). These ratios reflect economic structures 
              built on foreign male workers in construction, oil, and service industries, creating societies where men dramatically outnumber women.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Eastern Europe's Female Majority: War's Long Shadow</h3>
            <p>
              Eastern European nations show the opposite extreme, with women significantly outnumbering men. {lowestRatioCountries[0]?.name} 
              has the world's lowest sex ratio at {lowestRatioCountries[0]?.ratio.toFixed(1)} males per 100 females, where 
              {lowestRatioCountries[0]?.femalePercent.toFixed(1)}% of the population is female. Countries like {lowestRatioCountries[1]?.name} ({lowestRatioCountries[1]?.ratio.toFixed(1)}) 
              and {lowestRatioCountries[2]?.name} ({lowestRatioCountries[2]?.ratio.toFixed(1)}) reflect historical impacts from World War II, 
              Soviet-era policies, and ongoing male health crises. Higher male mortality rates, emigration of working-age men, and 
              significant gender gaps in life expectancy create these female-heavy demographics.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Why Sex Ratios Vary: Migration, Culture, and Conflict</h3>
            <p>
              Gender ratios reflect complex interactions of economic migration, cultural preferences, conflict history, and health disparities. 
              Gulf states import predominantly male workers for labor-intensive industries, while maintaining family structures in origin countries. 
              South Asian countries like {countries.find(c => c.name.includes('India'))?.name || 'India'} historically showed male preferences 
              leading to sex-selective practices, though this is changing. Eastern Europe faces "masculinity crises" where men experience 
              higher rates of cardiovascular disease, alcohol-related mortality, and workplace accidents, combined with post-Soviet emigration 
              patterns that favor male out-migration for work.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Societal Implications of Gender Imbalances</h2>
            <p>
              Extreme gender ratios create profound social and economic challenges. Male-surplus societies face "marriage squeezes" where 
              millions of men cannot find partners, affecting everything from crime rates to savings patterns. Countries like China and India 
              have created entire generations of surplus males, leading to increased bride trafficking, delayed marriage ages, and altered 
              family structures. Conversely, female-heavy societies struggle with eldercare burdens, pension sustainability, and workforce 
              gaps in traditionally male industries.
            </p>

            <p>
              Economic effects ripple through consumption patterns, housing markets, and labor dynamics. Male-heavy countries show distinct 
              spending patterns favoring durables over services, while female-majority nations face challenges in physically demanding industries. 
              These imbalances also drive international migration, as people move to regions with more balanced demographics for family formation. 
              Understanding these patterns helps policymakers anticipate social needs, from healthcare services to housing demand to 
              immigration policies.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">The United States: Near-Global Average Gender Balance</h3>
            <p>
              The United States maintains a relatively balanced gender ratio at {usData?.ratio.toFixed(1)} males per 100 females, 
              close to the global average. With {(usData?.male / 1000000).toFixed(1)} million males and {(usData?.female / 1000000).toFixed(1)} million females, 
              America represents {usData?.malePercent.toFixed(1)}% male and {usData?.femalePercent.toFixed(1)}% female. This balance shifts 
              with age: {usData?.atBirthRatio.toFixed(1)} males per 100 females at birth, {usData?.workingAgeRatio.toFixed(1)} among 
              working-age adults, and {usData?.elderlyRatio.toFixed(1)} among those 65 and older, reflecting typical patterns where 
              female longevity advantages emerge with age.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}