'use client';

import { useMemo } from 'react';
import Link from 'next/link';

export default function PopulationGrowthContent() {
  // Hardcoded world population data for reliability
  const worldPopulationGrowth = useMemo(() => {
    const world2025 = 8190000000;
    const world2020 = 7794798739;
    const worldGrowthRate = ((Math.pow(world2025 / world2020, 1/5) - 1) * 100).toFixed(2);
    
    return { 
      worldGrowthRate, 
      world2025, 
      world2020,
      annualIncrease: Math.round((world2025 - world2020) / 5)
    };
  }, []);

  // Example country growth rates (hardcoded for reliability)
  const exampleCountries = useMemo(() => {
    return [
      {
        name: 'Nigeria',
        flag: '🇳🇬',
        population2025: 237527793,
        population2020: 213996191,
        growthRate: 2.11,
        doublingTime: 33,
        status: 'Explosive Growth',
        description: 'Africa\'s most populous nation maintains one of the world\'s highest growth rates, driven by a fertility rate of 5.2 children per woman.',
        additionalContext: 'Half the population is under 18 years old, creating enormous demographic momentum.'
      },
      {
        name: 'Japan',
        flag: '🇯🇵',
        population2025: 122631000,
        population2020: 125244761,
        growthRate: -0.42,
        doublingTime: null,
        status: 'Declining',
        description: 'Japan faces accelerating population decline with the world\'s highest proportion of elderly citizens.',
        additionalContext: 'Deaths exceed births by over 500,000 annually, with minimal immigration to offset losses.',
        peakPopulation: '128 million (2010)'
      },
      {
        name: 'India',
        flag: '🇮🇳',
        population2025: 1451593336,
        population2020: 1396387127,
        growthRate: 0.78,
        doublingTime: 90,
        status: 'Moderate Growth',
        description: 'The world\'s most populous country continues growing despite fertility dropping to 2.0 children per woman.',
        additionalContext: 'India surpassed China in 2023 and adds 11 million people annually.'
      },
      {
        name: 'United States',
        flag: '🇺🇸',
        population2025: 345426571,
        population2020: 335942003,
        growthRate: 0.56,
        doublingTime: 125,
        status: 'Slow Growth',
        description: 'The US maintains positive growth primarily through immigration, offsetting below-replacement fertility.',
        additionalContext: 'Natural increase contributes only 0.1% growth, with immigration providing the remainder.'
      },
      {
        name: 'China',
        flag: '🇨🇳',
        population2025: 1415076444,
        population2020: 1424929781,
        growthRate: -0.14,
        doublingTime: null,
        status: 'Beginning Decline',
        description: 'China\'s population has peaked and begun declining, marking a historic demographic turning point.',
        additionalContext: 'The workforce shrinks by 10 million annually while retirees increase by 20 million.',
        peakPopulation: '1.426 billion (2022)'
      },
      {
        name: 'United Arab Emirates',
        flag: '🇦🇪',
        population2025: 10432860,
        population2020: 9287289,
        growthRate: 2.40,
        doublingTime: 29,
        status: 'Migration Boom',
        description: 'The UAE\'s population explodes through labor migration, with 88% foreign-born residents.',
        additionalContext: 'Economic diversification attracts workers from South Asia, creating one of the world\'s most diverse populations.'
      }
    ];
  }, []);

  // Fastest growing countries (hardcoded)
  const fastestGrowing = [
    { name: 'Niger', rate: 3.66, flag: '🇳🇪' },
    { name: 'Chad', rate: 3.44, flag: '🇹🇩' },
    { name: 'Mali', rate: 3.31, flag: '🇲🇱' },
    { name: 'DR Congo', rate: 3.29, flag: '🇨🇩' },
    { name: 'Tanzania', rate: 3.27, flag: '🇹🇿' }
  ];

  // Fastest declining countries (hardcoded)
  const fastestDeclining = [
    { name: 'Bulgaria', rate: -1.39, flag: '🇧🇬' },
    { name: 'Lithuania', rate: -1.35, flag: '🇱🇹' },
    { name: 'Latvia', rate: -1.26, flag: '🇱🇻' },
    { name: 'Ukraine', rate: -1.20, flag: '🇺🇦' },
    { name: 'Serbia', rate: -1.04, flag: '🇷🇸' }
  ];

  return (
    <div className="prose prose-lg max-w-4xl mx-auto mt-16">
      {/* Understanding Population Growth Rates */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding Population Growth Rates</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">What Is Population Growth Rate?</h3>
          <p className="text-gray-600">Population growth rate measures the annual percentage change in a population's size, combining natural increase (births minus deaths) and net migration. A positive rate indicates population growth, while negative rates signal decline.</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">The Growth Rate Formula</h3>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-center mb-4">
            Annual Growth Rate = ((P₂ / P₁)^(1/t) - 1) × 100
          </div>
          <p className="text-gray-600 mb-2">Where:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>P₂ = Ending population</li>
            <li>P₁ = Starting population</li>
            <li>t = Number of years</li>
          </ul>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Current World Growth Rate</h3>
          <p className="text-gray-600">The current world population growth rate is approximately <span className="font-semibold text-blue-600">{worldPopulationGrowth.worldGrowthRate}%</span> per year, adding about {Math.round(worldPopulationGrowth.annualIncrease / 1000000)} million people annually. This represents a significant decline from the peak growth rate of 2.1% in 1968.</p>
          <div className="mt-4 p-4 bg-white rounded">
            <p className="text-sm text-gray-500">World Population Growth</p>
            <p className="text-gray-600">From {worldPopulationGrowth.world2020.toLocaleString()} in 2020 to {worldPopulationGrowth.world2025.toLocaleString()} in 2025</p>
          </div>
        </div>
      </section>

      {/* Country Growth Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Population Growth by Country: Real Examples</h2>
        
        <p className="text-gray-600 mb-8">Population growth rates vary dramatically worldwide, from explosive growth in sub-Saharan Africa to rapid decline in Eastern Europe and East Asia. Here are detailed examples showing this global diversity:</p>

        <div className="space-y-6">
          {exampleCountries.map(country => (
            <div key={country.name} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 text-lg">
                  {country.flag} {country.name} - {country.status}
                </h4>
                <span className={`font-bold text-lg ${
                  country.growthRate > 2 ? 'text-green-600' :
                  country.growthRate > 0 ? 'text-blue-600' :
                  'text-red-600'
                }`}>
                  {country.growthRate > 0 ? '+' : ''}{country.growthRate.toFixed(2)}% annual
                </span>
              </div>
              <p className="text-gray-600 mb-4">{country.description}</p>
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                <div>
                  <p className="text-sm text-gray-500">Population 2025</p>
                  <p className="font-semibold">{country.population2025.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {country.doublingTime ? 'Doubling Time' : 'Peak Population'}
                  </p>
                  <p className="font-semibold">
                    {country.doublingTime ? `${country.doublingTime} years` : 
                     country.peakPopulation || 'Still growing'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">{country.additionalContext}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fastest Growing and Declining */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Global Growth Rate Rankings</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Fastest Growing Countries</h3>
            <div className="space-y-3">
              {fastestGrowing.map((country, index) => (
                <div key={country.name} className="flex items-center justify-between p-3 bg-white rounded">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-gray-500">#{index + 1}</span>
                    <span className="text-lg">{country.flag}</span>
                    <span className="font-medium">{country.name}</span>
                  </div>
                  <span className="font-bold text-green-600">+{country.rate}%</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">Most rapid growth concentrates in sub-Saharan Africa, driven by high fertility rates.</p>
          </div>

          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Fastest Declining Countries</h3>
            <div className="space-y-3">
              {fastestDeclining.map((country, index) => (
                <div key={country.name} className="flex items-center justify-between p-3 bg-white rounded">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-gray-500">#{index + 1}</span>
                    <span className="text-lg">{country.flag}</span>
                    <span className="font-medium">{country.name}</span>
                  </div>
                  <span className="font-bold text-red-600">{country.rate}%</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">Eastern Europe leads population decline due to low fertility and emigration.</p>
          </div>
        </div>
      </section>

      {/* Doubling Time */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Population Doubling Time Explained</h2>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">The Rule of 70</h3>
          <p className="text-gray-600 mb-4">Population doubling time estimates how long a population takes to double at its current growth rate. Calculate it using the "Rule of 70":</p>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-center mb-4">
            Doubling Time (years) = 70 ÷ Annual Growth Rate (%)
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-blue-50 rounded">
              <p className="font-semibold text-blue-900">1% Growth</p>
              <p className="text-2xl font-bold text-blue-600">70 years</p>
              <p className="text-sm text-gray-600">to double</p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <p className="font-semibold text-green-900">2% Growth</p>
              <p className="text-2xl font-bold text-green-600">35 years</p>
              <p className="text-sm text-gray-600">to double</p>
            </div>
            <div className="p-4 bg-orange-50 rounded">
              <p className="font-semibold text-orange-900">3% Growth</p>
              <p className="text-2xl font-bold text-orange-600">23 years</p>
              <p className="text-sm text-gray-600">to double</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Important Note</h3>
          <p className="text-gray-600">Doubling time assumes constant growth rates, which rarely occur in reality. Most countries experience declining growth rates as they develop economically, making actual doubling times longer than calculated.</p>
        </div>
      </section>

      {/* Historical Context */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Historical Population Growth Patterns</h2>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Major Growth Periods</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full p-2 mt-1">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Pre-1800: Slow Growth</h4>
                <p className="text-gray-600">Population grew at 0.04% annually, taking 1,800 years to double.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full p-2 mt-1">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold">1800-1950: Acceleration</h4>
                <p className="text-gray-600">Industrial Revolution and improved medicine pushed growth to 0.6% annually.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full p-2 mt-1">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold">1950-1970: Peak Growth</h4>
                <p className="text-gray-600">The "population explosion" saw rates exceed 2% as mortality fell faster than fertility.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full p-2 mt-1">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold">1970-Present: Deceleration</h4>
                <p className="text-gray-600">Declining fertility reduces growth to under 1%, heading toward stabilization.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Projections */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Future Population Projections</h2>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">UN Population Projections to 2100</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-500">2050 Projection</p>
              <p className="text-2xl font-bold text-blue-600">9.7 billion</p>
              <p className="text-sm text-gray-600">Medium variant</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-500">2100 Projection</p>
              <p className="text-2xl font-bold text-purple-600">10.4 billion</p>
              <p className="text-sm text-gray-600">Likely peak</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-500">Growth Rate 2100</p>
              <p className="text-2xl font-bold text-gray-600">0.04%</p>
              <p className="text-sm text-gray-600">Near stability</p>
            </div>
          </div>
          <p className="text-gray-600 mt-4">Most growth will occur in Africa, while Asia and Europe experience decline. Global population may peak around 2086 before beginning gradual decline.</p>
        </div>
      </section>

      {/* Regional Variations */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Regional Growth Variations</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">By Continent (2020-2025)</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Africa</span>
                <span className="font-bold text-green-600">+2.37%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Oceania</span>
                <span className="font-bold text-blue-600">+1.18%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Asia</span>
                <span className="font-bold text-blue-600">+0.68%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Latin America</span>
                <span className="font-bold text-blue-600">+0.52%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>North America</span>
                <span className="font-bold text-blue-600">+0.38%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Europe</span>
                <span className="font-bold text-red-600">-0.05%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Regional Trends</h3>
            <div className="space-y-3 text-gray-600">
              <p>• <strong>Africa:</strong> Youngest continent with highest fertility drives rapid growth</p>
              <p>• <strong>Asia:</strong> Slowing growth as China declines and India stabilizes</p>
              <p>• <strong>Europe:</strong> First continent experiencing sustained population decline</p>
              <p>• <strong>Americas:</strong> Migration sustains moderate growth despite low fertility</p>
            </div>
          </div>
        </div>
      </section>

      {/* Factors Affecting Growth */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Factors Influencing Population Growth</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Fertility Rates</h3>
            <p className="text-gray-600">The primary driver of growth. Countries need 2.1 children per woman for replacement. Current global average: 2.3.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Life Expectancy</h3>
            <p className="text-gray-600">Rising from 47 years (1950) to 73 years (2025), longer lives increase population even with fewer births.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Migration</h3>
            <p className="text-gray-600">International migration redistributes population, crucial for growth in developed nations.</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">The Demographic Transition</h3>
          <p className="text-gray-600">Countries typically progress through four stages:</p>
          <ol className="list-decimal list-inside text-gray-600 mt-3 space-y-2">
            <li><strong>High stationary:</strong> High birth and death rates, slow growth</li>
            <li><strong>Early expanding:</strong> Death rates fall, birth rates remain high, rapid growth</li>
            <li><strong>Late expanding:</strong> Birth rates decline, growth slows</li>
            <li><strong>Low stationary:</strong> Low birth and death rates, minimal growth</li>
          </ol>
        </div>
      </section>

      {/* Related Tools Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Related Demographics Tools</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/median-age-by-country" className="block bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-400 transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Median Age by Country</h3>
            <p className="text-gray-600 mb-3">Compare median ages across 195 countries. See which populations are aging fastest and which remain young.</p>
            <span className="text-blue-500 font-medium">Explore median ages →</span>
          </Link>
          
          <Link href="/male-to-female-ratio" className="block bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-400 transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Male to Female Ratio</h3>
            <p className="text-gray-600 mb-3">Analyze gender ratios worldwide. See how sex ratios vary by country and change with age groups.</p>
            <span className="text-blue-500 font-medium">View gender ratios →</span>
          </Link>
          
          <Link href="/dependency-ratio-calculator" className="block bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-400 transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Dependency Ratio Calculator</h3>
            <p className="text-gray-600 mb-3">Calculate the ratio of dependents to working-age population for any country.</p>
            <span className="text-blue-500 font-medium">Calculate ratios →</span>
          </Link>
          
          <Link href="/generation-age-ranges-calculator" className="block bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-400 transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Generation Age Ranges</h3>
            <p className="text-gray-600 mb-3">Find out age ranges for Gen Z, Millennials, Gen X, and other generations in 2026.</p>
            <span className="text-blue-500 font-medium">View generations →</span>
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Explore More Population Data</h2>
          <p className="mb-6">Dive deeper into demographic trends with our interactive tools and visualizations.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/countries" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Browse All Countries
            </Link>
            <Link href="/compare" className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition">
              Compare Countries
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}