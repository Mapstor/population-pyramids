import Link from 'next/link';
import React from 'react';

interface DependencyRatioContentProps {
  countryData: any[];
}

export default function DependencyRatioContent({ countryData }: DependencyRatioContentProps) {
  // Get specific country data for examples
  const japan = countryData.find(c => c.name === 'Japan');
  const niger = countryData.find(c => c.name === 'Niger');
  const qatar = countryData.find(c => c.name === 'Qatar');
  const usa = countryData.find(c => c.name === 'United States');
  const china = countryData.find(c => c.name === 'China');

  return (
    <div className="prose prose-gray max-w-none mt-12">
      <h2 id="what-is-dependency-ratio" className="text-2xl font-bold mb-4">What Is Dependency Ratio?</h2>
      <p>
        The dependency ratio measures the number of dependents (people aged 0-14 and 65+) for every 100 working-age people (aged 15-64) in a population. 
        It consists of three types: total dependency ratio (all dependents), youth dependency ratio (children only), and old-age dependency ratio (elderly only). 
        A dependency ratio of 50 means there are 50 dependents for every 100 workers, indicating that each worker supports half a dependent on average.
      </p>
      <p>
        This metric is crucial for understanding economic pressure on the productive population. 
        Countries with lower dependency ratios can invest more in economic development, while those with higher ratios must allocate more resources to dependent care. 
        The global average dependency ratio in 2026 stands at approximately 53.8, with significant variations between regions.
      </p>

      <h2 id="how-to-calculate" className="text-2xl font-bold mb-4 mt-8">How to Calculate Dependency Ratio (Formula & Examples)</h2>
      <p className="mb-4">
        The dependency ratio formulas are:
      </p>
      <div className="bg-gray-100 p-4 rounded-lg mb-6 font-mono text-sm">
        <div>Total DR = ((Pop 0-14 + Pop 65+) / Pop 15-64) × 100</div>
        <div className="mt-2">Youth DR = (Pop 0-14 / Pop 15-64) × 100</div>
        <div className="mt-2">Old-Age DR = (Pop 65+ / Pop 15-64) × 100</div>
      </div>

      {japan && (
        <div className="mb-6">
          <p className="font-semibold">Example 1: Japan (Highest Old-Age Dependency)</p>
          <p>
            Japan has {japan.youthPopulation.toLocaleString()} people aged 0-14, {japan.workingAgePopulation.toLocaleString()} people aged 15-64, and {japan.elderlyPopulation.toLocaleString()} people aged 65+.
            Total DR = (({japan.youthPopulation.toLocaleString()} + {japan.elderlyPopulation.toLocaleString()}) / {japan.workingAgePopulation.toLocaleString()}) × 100 = {japan.totalDR.toFixed(1)}.
            This means for every 100 working-age Japanese, there are {Math.round(japan.totalDR)} dependents — {Math.round(japan.youthDR)} children and {Math.round(japan.oldAgeDR)} elderly.
          </p>
        </div>
      )}

      {niger && (
        <div className="mb-6">
          <p className="font-semibold">Example 2: Niger (Highest Youth Dependency)</p>
          <p>
            Niger has {niger.youthPopulation.toLocaleString()} people aged 0-14, {niger.workingAgePopulation.toLocaleString()} people aged 15-64, and {niger.elderlyPopulation.toLocaleString()} people aged 65+.
            Total DR = (({niger.youthPopulation.toLocaleString()} + {niger.elderlyPopulation.toLocaleString()}) / {niger.workingAgePopulation.toLocaleString()}) × 100 = {niger.totalDR.toFixed(1)}.
            This means for every 100 working-age Nigeriens, there are {Math.round(niger.totalDR)} dependents — {Math.round(niger.youthDR)} children and {Math.round(niger.oldAgeDR)} elderly.
          </p>
        </div>
      )}

      {qatar && (
        <div className="mb-6">
          <p className="font-semibold">Example 3: Qatar (Lowest Total Dependency)</p>
          <p>
            Qatar has {qatar.youthPopulation.toLocaleString()} people aged 0-14, {qatar.workingAgePopulation.toLocaleString()} people aged 15-64, and {qatar.elderlyPopulation.toLocaleString()} people aged 65+.
            Total DR = (({qatar.youthPopulation.toLocaleString()} + {qatar.elderlyPopulation.toLocaleString()}) / {qatar.workingAgePopulation.toLocaleString()}) × 100 = {qatar.totalDR.toFixed(1)}.
            This means for every 100 working-age residents in Qatar, there are only {Math.round(qatar.totalDR)} dependents — {Math.round(qatar.youthDR)} children and {Math.round(qatar.oldAgeDR)} elderly.
          </p>
        </div>
      )}

      {usa && (
        <div className="mb-6">
          <p className="font-semibold">Example 4: United States (Balanced Moderate)</p>
          <p>
            The United States has {usa.youthPopulation.toLocaleString()} people aged 0-14, {usa.workingAgePopulation.toLocaleString()} people aged 15-64, and {usa.elderlyPopulation.toLocaleString()} people aged 65+.
            Total DR = (({usa.youthPopulation.toLocaleString()} + {usa.elderlyPopulation.toLocaleString()}) / {usa.workingAgePopulation.toLocaleString()}) × 100 = {usa.totalDR.toFixed(1)}.
            This means for every 100 working-age Americans, there are {Math.round(usa.totalDR)} dependents — {Math.round(usa.youthDR)} children and {Math.round(usa.oldAgeDR)} elderly.
          </p>
        </div>
      )}

      {china && (
        <div className="mb-6">
          <p className="font-semibold">Example 5: China (Rapid Transition)</p>
          <p>
            China has {china.youthPopulation.toLocaleString()} people aged 0-14, {china.workingAgePopulation.toLocaleString()} people aged 15-64, and {china.elderlyPopulation.toLocaleString()} people aged 65+.
            Total DR = (({china.youthPopulation.toLocaleString()} + {china.elderlyPopulation.toLocaleString()}) / {china.workingAgePopulation.toLocaleString()}) × 100 = {china.totalDR.toFixed(1)}.
            This means for every 100 working-age Chinese, there are {Math.round(china.totalDR)} dependents — {Math.round(china.youthDR)} children and {Math.round(china.oldAgeDR)} elderly, showing China's rapid aging transition.
          </p>
        </div>
      )}

      <h2 id="dependency-by-country" className="text-2xl font-bold mb-4 mt-8">Dependency Ratio by Country: Global Rankings 2026</h2>
      <p>
        The global dependency ratio landscape reveals stark contrasts between nations. 
        Countries with the highest total dependency ratios include <Link href="/niger" className="text-blue-600 hover:underline">Niger</Link> (109.5), <Link href="/chad" className="text-blue-600 hover:underline">Chad</Link> (104.2), <Link href="/somalia" className="text-blue-600 hover:underline">Somalia</Link> (101.8), <Link href="/mali" className="text-blue-600 hover:underline">Mali</Link> (101.5), and <Link href="/democratic-republic-of-the-congo" className="text-blue-600 hover:underline">Democratic Republic of the Congo</Link> (99.7). 
        These nations face significant economic pressure with more dependents than workers.
      </p>
      <p>
        Conversely, countries with the lowest dependency ratios enjoy demographic dividends. 
        <Link href="/qatar" className="text-blue-600 hover:underline">Qatar</Link> (16.8), <Link href="/united-arab-emirates" className="text-blue-600 hover:underline">United Arab Emirates</Link> (18.2), <Link href="/bahrain" className="text-blue-600 hover:underline">Bahrain</Link> (24.5), <Link href="/kuwait" className="text-blue-600 hover:underline">Kuwait</Link> (29.1), and <Link href="/singapore" className="text-blue-600 hover:underline">Singapore</Link> (35.2) benefit from large working-age populations, often bolstered by migrant workers. 
        African nations dominate youth dependency rankings, while European and East Asian nations lead in old-age dependency.
      </p>

      <h2 id="economically-active" className="text-2xl font-bold mb-4 mt-8">Economically Active Population & Working-Age Demographics</h2>
      <p>
        The economically active population consists of people aged 15-64 who are available for work, representing the potential labor force. 
        Globally, approximately 5.1 billion people fall into this economically active category in 2026, comprising 65.0% of the world's population. 
        Countries where the working-age population exceeds 65% are considered to be in their demographic dividend window, a period of potential economic growth.
      </p>
      <p>
        Nations with the highest working-age population share include <Link href="/qatar" className="text-blue-600 hover:underline">Qatar</Link> (85.6%), <Link href="/united-arab-emirates" className="text-blue-600 hover:underline">United Arab Emirates</Link> (84.6%), <Link href="/bahrain" className="text-blue-600 hover:underline">Bahrain</Link> (80.3%), and <Link href="/singapore" className="text-blue-600 hover:underline">Singapore</Link> (73.9%). 
        These countries maximize their economic potential with minimal dependent populations. 
        In contrast, countries like <Link href="/niger" className="text-blue-600 hover:underline">Niger</Link> (47.7%) and <Link href="/chad" className="text-blue-600 hover:underline">Chad</Link> (49.0%) have less than half their population in the working-age bracket.
      </p>
      <p>
        The demographic dividend presents a unique opportunity for countries like <Link href="/india" className="text-blue-600 hover:underline">India</Link> (67.8% working-age), <Link href="/brazil" className="text-blue-600 hover:underline">Brazil</Link> (69.2%), and <Link href="/indonesia" className="text-blue-600 hover:underline">Indonesia</Link> (68.1%). 
        These nations can leverage their large economically active populations for accelerated development if they create sufficient employment opportunities. 
        The window typically lasts 30-40 years before aging populations increase the old-age dependency ratio.
      </p>

      <h2 id="youth-dependency" className="text-2xl font-bold mb-4 mt-8">Youth Dependency Ratio: Countries with Young Populations</h2>
      <p>
        The youth dependency ratio measures the economic burden of supporting children aged 0-14. 
        Countries with the highest youth dependency ratios face significant challenges in education funding and future job creation. 
        <Link href="/niger" className="text-blue-600 hover:underline">Niger</Link> leads with 106.5 children per 100 working-age adults, followed by <Link href="/chad" className="text-blue-600 hover:underline">Chad</Link> (100.8), <Link href="/somalia" className="text-blue-600 hover:underline">Somalia</Link> (98.4), <Link href="/mali" className="text-blue-600 hover:underline">Mali</Link> (98.1), and <Link href="/democratic-republic-of-the-congo" className="text-blue-600 hover:underline">Democratic Republic of the Congo</Link> (95.2).
      </p>
      <p>
        High youth dependency indicates rapid population growth and places immense pressure on education systems and healthcare. 
        Sub-Saharan African nations dominate this category, with 28 of the 30 highest youth dependency countries located in Africa. 
        These nations must invest heavily in schools, child healthcare, and eventually job creation to accommodate their youth bulge entering the workforce.
      </p>

      <h2 id="old-age-dependency" className="text-2xl font-bold mb-4 mt-8">Old-Age Dependency Ratio: The Aging Crisis</h2>
      <p>
        The old-age dependency ratio reveals the economic burden of supporting elderly populations aged 65 and above. 
        <Link href="/japan" className="text-blue-600 hover:underline">Japan</Link> faces the world's highest old-age dependency at 52.0 elderly per 100 workers, followed by <Link href="/italy" className="text-blue-600 hover:underline">Italy</Link> (40.8), <Link href="/finland" className="text-blue-600 hover:underline">Finland</Link> (40.2), <Link href="/portugal" className="text-blue-600 hover:underline">Portugal</Link> (39.6), and <Link href="/greece" className="text-blue-600 hover:underline">Greece</Link> (39.3). 
        These nations grapple with rising pension costs and healthcare expenditures for aging populations.
      </p>
      <p>
        The aging crisis particularly affects developed nations in Europe and East Asia. 
        <Link href="/south-korea" className="text-blue-600 hover:underline">South Korea</Link> (28.9) and <Link href="/germany" className="text-blue-600 hover:underline">Germany</Link> (37.1) face rapidly rising old-age dependency as birth rates remain low and life expectancy increases. 
        By 2050, many developed nations will have more elderly than children, fundamentally reshaping social support systems and requiring significant policy adaptations.
      </p>

      <h2 id="changes-over-time" className="text-2xl font-bold mb-4 mt-8">How Dependency Ratio Changes Over Time</h2>
      <p>
        Global dependency ratios have undergone dramatic shifts since 1950, reflecting demographic transitions worldwide. 
        The world dependency ratio peaked at 75.8 in 1967, driven by high youth dependency from the post-war baby boom, then declined to a low of 52.2 in 2015 as fertility rates dropped globally. 
        Since 2015, the global dependency ratio has begun rising again, reaching 53.8 in 2026, primarily due to population aging.
      </p>
      <p>
        Countries experiencing the fastest increases in dependency ratios include those undergoing rapid aging like <Link href="/south-korea" className="text-blue-600 hover:underline">South Korea</Link>, where the old-age dependency ratio has tripled since 2000. 
        Meanwhile, countries like <Link href="/bangladesh" className="text-blue-600 hover:underline">Bangladesh</Link> and <Link href="/ethiopia" className="text-blue-600 hover:underline">Ethiopia</Link> have seen dependency ratios fall as fertility declines reduce youth dependency faster than aging increases old-age dependency. 
        UN projections suggest the global dependency ratio will reach 61.5 by 2050, with old-age dependency surpassing youth dependency for the first time in human history.
      </p>

      <h2 id="other-indicators" className="text-2xl font-bold mb-4 mt-8">Dependency Ratio vs Other Demographic Indicators</h2>
      <p>
        Dependency ratios correlate strongly with median age, as younger populations have high youth dependency while older populations face high old-age dependency. 
        Countries with median ages below 20, like <Link href="/niger" className="text-blue-600 hover:underline">Niger</Link> (14.8 years), have dependency ratios dominated by children, while those above 40, like <Link href="/japan" className="text-blue-600 hover:underline">Japan</Link> (49.5 years), struggle with elderly support. 
        The sweet spot for low dependency occurs around median ages of 30-35, where youth dependency has fallen but old-age dependency hasn't yet risen significantly.
      </p>
      <p>
        Fertility rates directly drive youth dependency ratios, with each child born adding to the dependent population for 15 years. 
        Countries with fertility rates above 5.0 children per woman invariably have youth dependency ratios exceeding 80. 
        The relationship between dependency ratios and population pyramids is visually striking: expansive pyramids indicate high youth dependency, constrictive pyramids show high old-age dependency, while barrel-shaped pyramids suggest balanced, low dependency.
      </p>
      <p>
        However, dependency ratios have limitations that require careful interpretation. 
        They assume all people 15-64 are economically productive, ignoring unemployment, education beyond age 15, and early retirement. 
        Many developing nations have large informal economies where children contribute economically and elderly continue working, while developed nations often have effective retirement ages below 65 despite longer lifespans.
      </p>

      <h2 id="faq" className="text-2xl font-bold mb-4 mt-8">Frequently Asked Questions</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold">What is the dependency ratio?</h3>
          <p>
            The dependency ratio measures the number of dependents (aged 0-14 and 65+) per 100 working-age people (aged 15-64). 
            The global average dependency ratio in 2026 is 53.8, meaning there are approximately 54 dependents for every 100 working-age people worldwide.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">What is the dependency ratio formula?</h3>
          <p>
            Total DR = ((Pop 0-14 + Pop 65+) / Pop 15-64) × 100. 
            Youth DR = (Pop 0-14 / Pop 15-64) × 100. 
            Old-Age DR = (Pop 65+ / Pop 15-64) × 100.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">What is a good dependency ratio?</h3>
          <p>
            A dependency ratio below 50 is generally favorable, indicating more than 2 working-age people support each dependent. 
            Qatar has one of the lowest at 16.8, while Niger has one of the highest at 109.5. 
            Countries with ratios between 40-50 balance economic productivity with social support needs effectively.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">What is the youth dependency ratio?</h3>
          <p>
            The youth dependency ratio measures children aged 0-14 per 100 working-age people aged 15-64. 
            The global youth dependency ratio in 2026 is approximately 37.2. 
            High youth dependency indicates rapid population growth and increased education needs.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">What is the old age dependency ratio?</h3>
          <p>
            The old-age dependency ratio measures people aged 65+ per 100 working-age people aged 15-64. 
            Japan has the highest old-age dependency ratio at 52.0 in 2026. 
            High old-age dependency indicates population aging and increased healthcare and pension costs.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">What is the dependency ratio of the United States?</h3>
          <p>
            The United States has a total dependency ratio of 53.8 in 2026, with a youth dependency ratio of 27.6 and an old-age dependency ratio of 26.2. 
            This balanced split between youth and elderly dependents reflects America's moderate fertility rates and aging baby boomer population.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Which country has the highest dependency ratio?</h3>
          <p>
            Niger has the highest total dependency ratio at 109.5 in 2026. 
            This is driven by its extremely high youth dependency ratio of 106.5 due to a fertility rate exceeding 6.7 children per woman. 
            Every working-age person in Niger supports more than one dependent on average.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Which country has the lowest dependency ratio?</h3>
          <p>
            Qatar has the lowest total dependency ratio at 16.8 in 2026. 
            This results from its large working-age migrant population supporting a relatively small dependent population. 
            The UAE (18.2) and Bahrain (24.5) similarly benefit from migrant workers in their demographic structure.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">What is the economically active population?</h3>
          <p>
            The economically active population consists of people aged 15-64 who are available for work, representing the labor force. 
            Globally, there are approximately 5.1 billion economically active people in 2026, comprising 65% of the world's population. 
            Countries with over 65% working-age population are in their demographic dividend window, offering economic growth opportunities.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">How does dependency ratio affect the economy?</h3>
          <p>
            High dependency ratios increase tax burden on workers and strain social services, requiring more resources for education, healthcare, and pensions. 
            Low dependency ratios create a demographic dividend opportunity for economic growth, allowing more investment in infrastructure and development. 
            Countries with dependency ratios below 50 can allocate more resources to economic development rather than dependent care.
          </p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-4">External Resources</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              UN World Population Prospects - Official demographic data source
            </a>
          </li>
          <li>
            <a href="https://www.worldbank.org/en/topic/demographics" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              World Bank Demographics - Economic implications of dependency ratios
            </a>
          </li>
          <li>
            <a href="https://www.who.int/data/gho/data/themes/topics/indicator-groups/indicator-group-details/GHO/population-dynamics" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              WHO Population Dynamics - Health system impacts of dependency
            </a>
          </li>
          <li>
            <a href="https://www.ilo.org/global/topics/future-of-work/trends/lang--en/index.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              ILO Future of Work - Labor force and dependency trends
            </a>
          </li>
          <li>
            <a href="https://www.imf.org/en/Topics/Demographics" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              IMF Demographics - Fiscal implications of aging populations
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-600">
          Explore more demographic insights: Visit our <Link href="/" className="text-blue-600 hover:underline">homepage</Link> to see population pyramids for all countries, 
          use our <Link href="/generation-age-ranges-calculator" className="text-blue-600 hover:underline">generation calculator</Link> to understand age cohorts, 
          or <Link href="/compare" className="text-blue-600 hover:underline">compare demographics</Link> between countries.
        </p>
      </div>
    </div>
  );
}