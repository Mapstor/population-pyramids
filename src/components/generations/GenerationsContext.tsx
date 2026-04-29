import Link from 'next/link';
import { GenerationPopulation } from '@/lib/generation-utils';

interface GenerationsContextProps {
  worldGenerations: GenerationPopulation[];
}

export function GenerationsContext({ worldGenerations }: GenerationsContextProps) {
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
            <h3 className="text-2xl font-bold text-purple-900 mb-4">
              Gen Alpha Age Range in 2026 (Born 2013-2026)
            </h3>
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
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              Gen Z Age Range in 2026 (Born 1997-2012)
            </h3>
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
            <h3 className="text-2xl font-bold text-emerald-900 mb-4">
              Millennial Age Range in 2026 (Born 1981-1996)
            </h3>
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
            <h3 className="text-2xl font-bold text-amber-900 mb-4">
              Gen X Age Range in 2026 (Born 1965-1980)
            </h3>
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
            <h3 className="text-2xl font-bold text-red-900 mb-4">
              Baby Boomer Age Range in 2026 (Born 1946-1964)
            </h3>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Silent Generation Age Range in 2026 (Born 1928-1945)
            </h3>
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

      {/* FAQ Section - Optimized for SEO */}
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
        </div>
      </section>
    </div>
  );
}