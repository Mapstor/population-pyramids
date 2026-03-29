import Link from 'next/link';
import { GenerationPopulation } from '@/lib/generation-utils';

interface GenerationsContentProps {
  worldGenerations: GenerationPopulation[];
}

export default function GenerationsContent({ worldGenerations }: GenerationsContentProps) {
  // Find specific generations for insights
  const genAlpha = worldGenerations.find(g => g.generation.id === 'gen-alpha');
  const genZ = worldGenerations.find(g => g.generation.id === 'gen-z');
  const millennials = worldGenerations.find(g => g.generation.id === 'millennials');
  const genX = worldGenerations.find(g => g.generation.id === 'gen-x');
  const boomers = worldGenerations.find(g => g.generation.id === 'baby-boomers');
  const silent = worldGenerations.find(g => g.generation.id === 'silent');
  
  // Find largest generation
  const largestGen = worldGenerations.reduce((prev, current) => 
    prev.population > current.population ? prev : current
  );

  const totalWorldPop = worldGenerations.reduce((sum, gen) => sum + gen.population, 0);

  return (
    <div className="space-y-12">
      {/* Section 1: Understanding Generation Age Ranges */}
      <section className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6">Understanding Generation Age Ranges in 2026</h2>
        
        <p className="text-lg text-gray-700 mb-4">
          Generations are cohorts of people born within the same period who experience similar cultural, social, and economic events during their formative years. These shared experiences shape their values, behaviors, and perspectives throughout life. The boundaries between generations are defined by demographic researchers and sociologists, with Pew Research Center serving as the leading authority on standardized generation definitions.
        </p>
        
        <p className="text-lg text-gray-700 mb-4">
          The global population of {(totalWorldPop / 1000000000).toFixed(1)} billion people is distributed across seven major generations, from the Greatest Generation (born 1901-1927) to Generation Alpha (born 2013-2026). Each generation's size and distribution varies dramatically by country and region. Understanding these demographic patterns is crucial for economic planning, social policy, and market analysis.
        </p>
        
        <p className="text-lg text-gray-700">
          Generation boundaries matter because they help researchers track social change, marketers understand consumer behavior, and policymakers plan for demographic shifts. The largest generation globally is currently {largestGen.generation.name} with {(largestGen.population / 1000000000).toFixed(2)} billion people, representing {largestGen.percentOfTotal.toFixed(1)}% of the world's population. These demographic waves create predictable patterns in everything from housing demand to healthcare needs.
        </p>
      </section>

      {/* Section 2: Generation Breakdown */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold">Generation Breakdown: Population Sizes & Demographics</h2>

        {/* Gen Alpha */}
        {genAlpha && (
          <div className="bg-purple-50 rounded-lg shadow-lg p-8 border-l-4 border-purple-500">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">
              Gen Alpha Age Range in 2026 (Born 2013-2026)
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <p className="text-gray-700 mb-2">
                  <strong>Current age range in 2026:</strong> {genAlpha.ageRange} years
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Global population:</strong> {genAlpha.population.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Share of world:</strong> {genAlpha.percentOfTotal.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-700 mb-2">
                  <strong>Male population:</strong> {genAlpha.malePopulation.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Female population:</strong> {genAlpha.femalePopulation.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-gray-700">
              Gen Alpha age range in 2026 is {genAlpha.ageRange} years old, born between 2013 and 2026. The majority of Gen Alpha lives in developing nations, with <Link href="/india" className="text-blue-600 hover:underline">India</Link> and <Link href="/nigeria" className="text-blue-600 hover:underline">Nigeria</Link> having the largest populations. This generation will be the most educated and technologically fluent in history.
            </p>
          </div>
        )}

        {/* Gen Z */}
        {genZ && (
          <div className="bg-blue-50 rounded-lg shadow-lg p-8 border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Gen Z Age Range in 2026 (Born 1997-2012)
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <p className="text-gray-700 mb-2">
                  <strong>Current age range in 2026:</strong> {genZ.ageRange} years
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Global population:</strong> {genZ.population.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Share of world:</strong> {genZ.percentOfTotal.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-700 mb-2">
                  <strong>Male population:</strong> {genZ.malePopulation.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Female population:</strong> {genZ.femalePopulation.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-gray-700">
              Gen Z age range in 2026 is {genZ.ageRange} years old, born between 1997 and 2012. Currently entering the workforce, Gen Z represents {genZ.percentOfTotal.toFixed(1)}% of the global population. In <Link href="/united-states" className="text-blue-600 hover:underline">the United States</Link>, Gen Z is the most racially and ethnically diverse generation, while in Africa, they represent the continent's demographic dividend.
            </p>
          </div>
        )}

        {/* Millennials */}
        {millennials && (
          <div className="bg-emerald-50 rounded-lg shadow-lg p-8 border-l-4 border-emerald-500">
            <h2 className="text-2xl font-bold text-emerald-900 mb-4">
              Millennial Age Range in 2026 (Born 1981-1996)
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <p className="text-gray-700 mb-2">
                  <strong>Current age range in 2026:</strong> {millennials.ageRange} years
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Global population:</strong> {millennials.population.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Share of world:</strong> {millennials.percentOfTotal.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-700 mb-2">
                  <strong>Male population:</strong> {millennials.malePopulation.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Female population:</strong> {millennials.femalePopulation.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-gray-700">
              Millennial age range in 2026 is {millennials.ageRange} years old, born between 1981 and 1996. As the prime working-age generation, Millennials drive consumer markets globally. <Link href="/china" className="text-blue-600 hover:underline">China's</Link> millennials, shaped by the one-child policy, differ markedly from <Link href="/india" className="text-blue-600 hover:underline">India's</Link> larger millennial cohort.
            </p>
          </div>
        )}

        {/* Gen X */}
        {genX && (
          <div className="bg-amber-50 rounded-lg shadow-lg p-8 border-l-4 border-amber-500">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">
              Gen X Age Range in 2026 (Born 1965-1980)
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <p className="text-gray-700 mb-2">
                  <strong>Current age range in 2026:</strong> {genX.ageRange} years
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Global population:</strong> {genX.population.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Share of world:</strong> {genX.percentOfTotal.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-700 mb-2">
                  <strong>Male population:</strong> {genX.malePopulation.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Female population:</strong> {genX.femalePopulation.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-gray-700">
              Gen X age range in 2026 is {genX.ageRange} years old, born between 1965 and 1980. Smaller than both Boomers and Millennials, Gen X holds significant economic power as peak earners. In <Link href="/japan" className="text-blue-600 hover:underline">Japan</Link> and <Link href="/germany" className="text-blue-600 hover:underline">Germany</Link>, Gen X faces unique pressures supporting both aging parents and adult children.
            </p>
          </div>
        )}

        {/* Baby Boomers */}
        {boomers && (
          <div className="bg-red-50 rounded-lg shadow-lg p-8 border-l-4 border-red-500">
            <h2 className="text-2xl font-bold text-red-900 mb-4">
              Baby Boomer Age Range in 2026 (Born 1946-1964)
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <p className="text-gray-700 mb-2">
                  <strong>Current age range in 2026:</strong> {boomers.ageRange} years
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Global population:</strong> {boomers.population.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Share of world:</strong> {boomers.percentOfTotal.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-700 mb-2">
                  <strong>Male population:</strong> {boomers.malePopulation.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Female population:</strong> {boomers.femalePopulation.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-gray-700">
              Baby Boomer age range in 2026 is {boomers.ageRange} years old, born between 1946 and 1964. This "silver tsunami" is reshaping healthcare, pension systems, and housing markets globally. Countries like <Link href="/italy" className="text-blue-600 hover:underline">Italy</Link> and <Link href="/south-korea" className="text-blue-600 hover:underline">South Korea</Link> face acute challenges as Boomers retire with insufficient younger workers to support them.
            </p>
          </div>
        )}

        {/* Silent Generation */}
        {silent && (
          <div className="bg-gray-50 rounded-lg shadow-lg p-8 border-l-4 border-gray-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Silent Generation Age Range in 2026 (Born 1928-1945)
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <p className="text-gray-700 mb-2">
                  <strong>Current age range in 2026:</strong> {silent.ageRange} years
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Global population:</strong> {silent.population.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Share of world:</strong> {silent.percentOfTotal.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-700 mb-2">
                  <strong>Male population:</strong> {silent.malePopulation.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Female population:</strong> {silent.femalePopulation.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-gray-700">
              Silent Generation age range in 2026 is {silent.ageRange} years old, born between 1928 and 1945. Now in their 80s and 90s, this generation requires intensive healthcare support. Countries with large Silent Generation populations like <Link href="/japan" className="text-blue-600 hover:underline">Japan</Link> lead in eldercare innovation.
            </p>
          </div>
        )}
      </section>

      {/* Section 3: Key Insights */}
      <section className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6">5 Key Insights About Generations Worldwide</h2>
        
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-xl font-bold mb-2">1. The Largest Generation Globally</h3>
            <p className="text-gray-700">
              {largestGen.generation.name} is currently the world's largest generation with {(largestGen.population / 1000000000).toFixed(2)} billion people, representing {largestGen.percentOfTotal.toFixed(1)}% of the global population. This generation dominates consumer markets and workforce demographics. However, this varies dramatically by region - while {largestGen.generation.name} leads globally, Gen Z dominates in Africa while aging societies in Europe have larger proportions of Boomers and Gen X.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-xl font-bold mb-2">2. The Youth Bulge in Developing Nations</h3>
            <p className="text-gray-700">
              In countries like <Link href="/nigeria" className="text-blue-600 hover:underline">Nigeria</Link>, <Link href="/uganda" className="text-blue-600 hover:underline">Uganda</Link>, and <Link href="/mali" className="text-blue-600 hover:underline">Mali</Link>, Gen Z and Gen Alpha combined represent over 60% of the population. This youth bulge creates both opportunities for economic growth and challenges for job creation. Africa's median age of 19 years means Gen Z outnumbers all other generations combined in many African nations.
            </p>
          </div>

          <div className="border-l-4 border-red-500 pl-6">
            <h3 className="text-xl font-bold mb-2">3. The Aging Crisis in Developed Nations</h3>
            <p className="text-gray-700">
              Baby Boomers comprise over 20% of the population in <Link href="/japan" className="text-blue-600 hover:underline">Japan</Link>, <Link href="/italy" className="text-blue-600 hover:underline">Italy</Link>, and <Link href="/germany" className="text-blue-600 hover:underline">Germany</Link>. With {boomers?.population.toLocaleString()} Boomers globally entering retirement, pension systems face unprecedented strain. Japan leads with 30% of its population over 65, creating a blueprint for other aging societies.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-xl font-bold mb-2">4. The Missing Middle in China</h3>
            <p className="text-gray-700">
              <Link href="/china" className="text-blue-600 hover:underline">China's</Link> one-child policy created a unique generational imbalance with fewer Millennials and Gen Z than Gen X. This "4-2-1" problem means one child supports two parents and four grandparents. Meanwhile, <Link href="/india" className="text-blue-600 hover:underline">India</Link> has surpassed China in young population, with more Gen Z and Millennials combined.
            </p>
          </div>

          <div className="border-l-4 border-amber-500 pl-6">
            <h3 className="text-xl font-bold mb-2">5. Generation Sizes Predict Economic Futures</h3>
            <p className="text-gray-700">
              Countries with large working-age populations (Millennials and Gen X) like <Link href="/brazil" className="text-blue-600 hover:underline">Brazil</Link> and <Link href="/mexico" className="text-blue-600 hover:underline">Mexico</Link> enjoy a demographic dividend. By 2050, Gen Alpha will be the prime working generation, with today's youth-heavy nations becoming economic powerhouses. Understanding generation distributions helps predict everything from housing demand to healthcare needs.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Methodology */}
      <section className="bg-gray-50 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6">How We Calculate Generation Populations</h2>
        
        <p className="text-gray-700 mb-4">
          Our generation population calculations use official UN World Population Prospects 2024 data, aggregating 5-year age cohorts (0-4, 5-9, 10-14, etc.) into generation boundaries defined by Pew Research Center. When generation boundaries fall within age cohorts, we use proportional allocation based on uniform age distribution within each 5-year band. This methodology provides accurate estimates while acknowledging that exact boundaries between generations are approximations.
        </p>
        
        <p className="text-gray-700">
          Data source: <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">UN Population Division World Population Prospects 2024</a>. Generation definitions follow <a href="https://www.pewresearch.org/topic/generations-age/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pew Research Center</a> standards, the most widely accepted framework for generational analysis. All population figures represent medium-variant projections for 2024-2026.
        </p>
      </section>

      {/* Section 5: Generations by Country */}
      <section className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6">Generations by Country</h2>
        
        <p className="text-gray-700 mb-4">
          Generation sizes vary dramatically between countries due to different fertility rates, life expectancy, and historical events. Use the dropdown tool above to explore generation breakdowns for all 195 countries. Each nation tells a unique demographic story through its generation distribution.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2">🇳🇬 Nigeria: Youth Explosion</h3>
            <p className="text-sm text-gray-700">
              Gen Z and Gen Alpha dominate with over 65% of population. Median age just 18 years. See <Link href="/nigeria" className="text-blue-600 hover:underline">Nigeria's population pyramid</Link>.
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-bold text-red-900 mb-2">🇯🇵 Japan: Aging Society</h3>
            <p className="text-sm text-gray-700">
              Baby Boomers and Silent Generation comprise 40% of population. World's oldest median age at 49. See <Link href="/japan" className="text-blue-600 hover:underline">Japan's population pyramid</Link>.
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-green-900 mb-2">🇺🇸 USA: Balanced Distribution</h3>
            <p className="text-sm text-gray-700">
              Relatively even generation sizes, with Millennials as largest at 22%. See <Link href="/united-states" className="text-blue-600 hover:underline">USA's population pyramid</Link>.
            </p>
          </div>
        </div>
        
        <p className="text-gray-700 mt-4">
          Explore more: <Link href="/compare" className="text-blue-600 hover:underline">Compare generation structures between countries</Link> or view <Link href="/" className="text-blue-600 hover:underline">population pyramids for all 195 countries</Link>.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-2">What are the generation age ranges in 2026?</h3>
            <p className="text-gray-700">
              In 2026, generation age ranges are: Gen Alpha (0-13), Gen Z (14-29), Millennials (30-45), Gen X (46-61), Baby Boomers (62-80), Silent Generation (81-98), and Greatest Generation (99+). These boundaries are based on Pew Research definitions and represent ages as of 2026.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">What age is Gen Z in 2026?</h3>
            <p className="text-gray-700">
              Gen Z is 14-29 years old in 2026, born between 1997-2012. The oldest Gen Z members are 29 and entering their prime career years, while the youngest are 14 and in high school. Gen Z represents {genZ?.percentOfTotal.toFixed(1)}% of the global population.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">What age is a millennial in 2026?</h3>
            <p className="text-gray-700">
              Millennials are 30-45 years old in 2026, born between 1981-1996. They are in their prime working and family-forming years. With {millennials?.population.toLocaleString()} people globally, Millennials represent {millennials?.percentOfTotal.toFixed(1)}% of world population.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">What age is Gen X in 2026?</h3>
            <p className="text-gray-700">
              Gen X is 46-61 years old in 2026, born between 1965-1980. They are at peak earning power and many are caring for both children and aging parents. Gen X comprises {genX?.population.toLocaleString()} people or {genX?.percentOfTotal.toFixed(1)}% of global population.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">What years are Gen Z?</h3>
            <p className="text-gray-700">
              Gen Z birth years span 1997-2012 according to Pew Research Center. The generation begins with those who don't remember 9/11 (too young) and ends before widespread smartphone adoption at birth. Some researchers use slightly different boundaries, but 1997-2012 is the most widely accepted range.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">What is the Gen Z cutoff year?</h3>
            <p className="text-gray-700">
              The Gen Z cutoff year is 2012 - anyone born in 2013 or later is Generation Alpha. The 1996/1997 boundary separates Millennials from Gen Z, while 2012/2013 separates Gen Z from Gen Alpha. These cutoffs are based on shared generational experiences and technological milestones.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">What generation is 1996? What generation is 1997?</h3>
            <p className="text-gray-700">
              1996 is the last year of Millennials, while 1997 is the first year of Gen Z. This boundary marks those who came of age before vs. after smartphones and social media became ubiquitous. People born in these years often identify with both generations depending on their experiences.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">How many Gen Z are there in the world?</h3>
            <p className="text-gray-700">
              There are approximately {genZ ? (genZ.population / 1000000000).toFixed(2) : '2'} billion Gen Z members globally, representing {genZ?.percentOfTotal.toFixed(1)}% of world population. Gen Z is largest in Asia, particularly in India and Indonesia, while smallest in aging countries like Japan and Italy.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">What is Gen Alpha age range?</h3>
            <p className="text-gray-700">
              Gen Alpha's age range in 2026 is 0-13 years, born 2013-2026. They are the first generation born entirely in the 2010s and 2020s. With {genAlpha?.population.toLocaleString()} members globally, Gen Alpha will be the most technologically integrated generation in history.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">What generation am I if I was born in [year]?</h3>
            <p className="text-gray-700">
              Use the calculator above to find your generation instantly. Enter any birth year from 1901-2026 to see your generation, current age, and your generation's global population. The tool uses official Pew Research definitions and real UN population data.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}