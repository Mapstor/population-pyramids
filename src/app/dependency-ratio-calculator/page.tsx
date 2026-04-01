import Link from 'next/link';
import { getDependencyRatioData } from '@/lib/dependency-ratio-data';
import DependencyRatioInteractiveTool from './DependencyRatioInteractiveTool';

// JSON-LD Schema for SEO
function generateStructuredData(worldData: any, countries: any[], highestRatios: any[], lowestRatios: any[], usData: any) {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is dependency ratio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Dependency ratio measures how many non-working people (children 0-14 and elderly 65+) depend on working-age adults (15-64). The global average is ${worldData?.totalDependencyRatio.toFixed(1)} dependents per 100 workers. It indicates economic burden and social support needs.`
        }
      },
      {
        "@type": "Question",
        "name": "How is dependency ratio calculated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dependency ratio = (Youth population 0-14 + Elderly population 65+) ÷ Working-age population 15-64 × 100. For example, a ratio of 60 means there are 60 dependents for every 100 workers."
        }
      },
      {
        "@type": "Question",
        "name": "Which country has the highest dependency ratio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${highestRatios[0]?.name} has the highest dependency ratio at ${highestRatios[0]?.totalDependencyRatio.toFixed(1)}, driven primarily by a large youth population where ${highestRatios[0]?.youthPercentage.toFixed(1)}% are under 15.`
        }
      },
      {
        "@type": "Question",
        "name": "Which country has the lowest dependency ratio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${lowestRatios[0]?.name} has the lowest dependency ratio at ${lowestRatios[0]?.totalDependencyRatio.toFixed(1)}, with ${lowestRatios[0]?.workingAgePercentage.toFixed(1)}% of its population in the prime working years.`
        }
      },
      {
        "@type": "Question",
        "name": "What is the United States dependency ratio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The US has a dependency ratio of ${usData?.totalDependencyRatio.toFixed(1)}, breaking down to ${usData?.youthDependencyRatio.toFixed(1)} youth dependents and ${usData?.oldAgeDependencyRatio.toFixed(1)} elderly dependents per 100 workers.`
        }
      },
      {
        "@type": "Question",
        "name": "What is a good dependency ratio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A dependency ratio below 50 is generally considered favorable for economic growth, indicating more workers than dependents. Ratios above 70 suggest significant economic pressure on the working population."
        }
      }
    ]
  };

  const webAppStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Dependency Ratio Calculator",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Calculate and compare dependency ratios by country with interactive tools and demographic analysis"
  };

  const datasetStructuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Global Dependency Ratio Data 2026",
    "description": "Dependency ratio statistics for all countries from UN World Population Prospects",
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
        "name": "Dependency Ratio Calculator",
        "item": "https://populationpyramids.org/dependency-ratio-calculator"
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

export default async function DependencyRatioCalculatorPage() {
  const { world: worldData, countries } = await getDependencyRatioData();
  
  // Get specific country data for content
  const highestRatios = countries.slice(0, 15);
  const lowestRatios = [...countries].sort((a, b) => a.totalDependencyRatio - b.totalDependencyRatio).slice(0, 15);
  const usData = countries.find(c => c.slug === 'united-states');

  // Generate structured data
  const {
    faqStructuredData,
    webAppStructuredData,
    datasetStructuredData,
    breadcrumbStructuredData
  } = generateStructuredData(worldData, countries, highestRatios, lowestRatios, usData);

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
            Dependency Ratio by Country 2026: Economic Burden Calculator
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Dependency ratio measures how many non-working people (children 0-14 and elderly 65+) depend on each 100 working-age adults (15-64). 
            The global average is {worldData.totalDependencyRatio.toFixed(1)} dependents per 100 workers, ranging from 
            {lowestRatios[0]?.totalDependencyRatio.toFixed(1)} in {lowestRatios[0]?.name} to {highestRatios[0]?.totalDependencyRatio.toFixed(1)} in {highestRatios[0]?.name}. 
            Lower ratios indicate economic opportunity; higher ratios signal social support challenges and workforce strain.
          </p>

          {/* Interactive Tool - Client Component */}
          <DependencyRatioInteractiveTool 
            worldData={worldData} 
            countries={countries} 
            initialData={{ highestRatios, lowestRatios, usData }}
          />

          {/* Server-Side Rendered Table */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">All 195 Countries Ranked by Dependency Ratio</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total DR</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Youth DR</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Old-Age DR</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Working-Age %</th>
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
                          country.totalDependencyRatio > 80 ? 'text-red-600' :
                          country.totalDependencyRatio > 70 ? 'text-orange-600' :
                          country.totalDependencyRatio > 50 ? 'text-yellow-600' :
                          country.totalDependencyRatio > 40 ? 'text-blue-600' :
                          'text-green-600'
                        }`}>
                          {country.totalDependencyRatio.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-green-700 font-medium">
                        {country.youthDependencyRatio.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-orange-700 font-medium">
                        {country.oldAgeDependencyRatio.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-blue-700 font-medium">
                        {country.workingAgePercentage.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SEO Content Sections */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">Understanding Global Dependency Patterns</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">African Nations Lead in Youth-Driven Dependency</h3>
            <p>
              The world's highest dependency ratios are concentrated in Sub-Saharan Africa, where massive youth populations create unprecedented economic burdens. 
              {highestRatios[0]?.name} tops the global rankings with {highestRatios[0]?.totalDependencyRatio.toFixed(1)} dependents per 100 workers, 
              where {highestRatios[0]?.youthPercentage.toFixed(1)}% of the population is under 15 years old. This pattern extends across the continent: 
              {highestRatios[1]?.name} ({highestRatios[1]?.totalDependencyRatio.toFixed(1)}), {highestRatios[2]?.name} ({highestRatios[2]?.totalDependencyRatio.toFixed(1)}), 
              and {highestRatios[3]?.name} ({highestRatios[3]?.totalDependencyRatio.toFixed(1)}) all face similar challenges. These ratios reflect high fertility rates 
              and young populations that require massive investments in education, healthcare, and future job creation to support economic development.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Gulf States Achieve Lowest Dependency Through Migrant Workers</h3>
            <p>
              At the opposite extreme, Gulf states maintain remarkably low dependency ratios through strategic labor migration policies. 
              {lowestRatios[0]?.name} achieves the world's lowest ratio at {lowestRatios[0]?.totalDependencyRatio.toFixed(1)} dependents per 100 workers, 
              with an extraordinary {lowestRatios[0]?.workingAgePercentage.toFixed(1)}% of its population in prime working years. Countries like 
              {lowestRatios[1]?.name} ({lowestRatios[1]?.totalDependencyRatio.toFixed(1)}) and {lowestRatios[2]?.name} ({lowestRatios[2]?.totalDependencyRatio.toFixed(1)}) 
              achieve similar efficiency by importing predominantly working-age male migrants while maintaining family structures in origin countries. 
              This creates artificial demographic dividends that fuel economic growth but raise questions about long-term sustainability and social cohesion.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">The Economic Burden Spectrum: From Opportunity to Crisis</h3>
            <p>
              Dependency ratios reveal the spectrum of economic opportunity and challenge facing nations worldwide. Countries with ratios below 50, 
              like most Gulf states and some Eastern European nations, enjoy demographic dividends where abundant workers support fewer dependents, 
              enabling rapid capital accumulation and economic growth. The "sweet spot" of 40-50 dependents per 100 workers allows societies to invest 
              in infrastructure and development while maintaining manageable social support costs.
            </p>

            <p>
              Conversely, ratios above 70 indicate severe economic strain, as seen across much of Sub-Saharan Africa and parts of the Middle East. 
              In countries like {highestRatios[0]?.name}, each working-age person must effectively support nearly one full dependent, severely limiting 
              capital available for productive investment. This creates vicious cycles where high dependency ratios prevent the economic growth needed 
              to improve education, healthcare, and family planning services that could eventually reduce fertility and dependency burdens.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Regional Patterns and Economic Planning Implications</h2>
            <p>
              Regional dependency patterns reflect different stages of demographic transition and development strategies. Europe and East Asia face aging-driven 
              dependency, where declining birth rates and extending lifespans shift burdens from education to healthcare and pensions. Africa experiences 
              youth-driven dependency, requiring massive investments in schools and eventual job creation. The Americas show mixed patterns, with North America 
              approaching aging challenges while Central America and parts of South America maintain youth-heavy demographics.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Planning for Economic Sustainability</h3>
            <p>
              Dependency ratios serve as crucial indicators for economic planning and policy development. Countries with high youth dependency must prioritize 
              education systems, healthcare infrastructure, and job creation strategies to harness their demographic potential. Those with aging populations 
              need sustainable pension systems, healthcare capacity, and immigration policies to maintain workforce vitality. Understanding these ratios helps 
              policymakers anticipate infrastructure needs, budget allocation priorities, and long-term economic strategies.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">The United States: Balanced Demographics with Aging Pressure</h3>
            <p>
              The United States maintains a moderate dependency ratio of {usData?.totalDependencyRatio.toFixed(1)}, splitting relatively evenly between 
              {usData?.youthDependencyRatio.toFixed(1)} youth dependents and {usData?.oldAgeDependencyRatio.toFixed(1)} elderly dependents per 100 workers. 
              With {usData?.workingAgePercentage.toFixed(1)}% of Americans in their prime working years, the country enjoys demographic stability compared 
              to rapidly aging developed nations or youth-heavy developing countries. However, rising old-age dependency reflects the ongoing demographic 
              shift that will challenge Social Security, Medicare, and healthcare systems in coming decades, requiring careful policy adjustments to 
              maintain economic vitality.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}