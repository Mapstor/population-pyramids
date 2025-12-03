import Link from 'next/link';
import { loadCountries, loadCountryData } from '@/lib/data-loader';
import { calculateMetrics } from '@/lib/calculations';
import PopulationPyramid from '@/components/PopulationPyramid';
import { Line, Bar } from 'react-chartjs-2';

export const metadata = {
  title: 'The World\'s Aging Crisis: 9 Countries Where Half the Population Will Soon Be Seniors',
  description: 'Japan\'s median age has risen 7.5 years since 2000. South Korea ages faster than any nation in history. Explore the demographic revolution transforming our world.',
  keywords: 'aging population, demographic crisis, japan aging, south korea elderly, population aging, demographic transition',
  openGraph: {
    title: 'The World\'s Aging Crisis: 9 Countries Where Half the Population Will Soon Be Seniors',
    description: 'Japan\'s median age has risen 7.5 years since 2000. South Korea ages faster than any nation in history.',
    type: 'article',
    url: 'https://populationpyramids.org/blog/worlds-aging-crisis-9-countries-seniors',
  },
};

// Static country data for the aging countries
const agingCountriesData = [
  { slug: 'japan', name: 'Japan', medianAge: 49.0, elderlyPercent: 30.0, dependencyRatio: 70.0 },
  { slug: 'italy', name: 'Italy', medianAge: 47.8, elderlyPercent: 23.6, dependencyRatio: 58.1 },
  { slug: 'germany', name: 'Germany', medianAge: 47.8, elderlyPercent: 23.0, dependencyRatio: 59.0 },
  { slug: 'finland', name: 'Finland', medianAge: 42.8, elderlyPercent: 22.5, dependencyRatio: 61.2 },
  { slug: 'portugal', name: 'Portugal', medianAge: 46.2, elderlyPercent: 22.4, dependencyRatio: 56.8 },
  { slug: 'slovenia', name: 'Slovenia', medianAge: 44.9, elderlyPercent: 20.5, dependencyRatio: 54.3 },
  { slug: 'south-korea', name: 'South Korea', medianAge: 44.4, elderlyPercent: 17.5, dependencyRatio: 40.2 },
  { slug: 'greece', name: 'Greece', medianAge: 45.8, elderlyPercent: 22.3, dependencyRatio: 57.1 },
  { slug: 'spain', name: 'Spain', medianAge: 44.9, elderlyPercent: 19.6, dependencyRatio: 54.4 }
];

export default async function AgingCrisisArticle() {
  // Load data for key countries
  const japanData = await loadCountryData('japan');
  const japanMetrics = calculateMetrics(japanData.years['2024']);
  
  const southKoreaData = await loadCountryData('south-korea');
  const southKoreaMetrics = calculateMetrics(southKoreaData.years['2024']);
  
  const italyData = await loadCountryData('italy');
  const italyMetrics = calculateMetrics(italyData.years['2024']);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link href="/" className="hover:text-blue-600 transition">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/blog" className="hover:text-blue-600 transition">Blog</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">The World's Aging Crisis</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-8 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                Featured Analysis
              </span>
              <span className="px-3 py-1 bg-white bg-opacity-20 text-white text-xs font-semibold rounded-full">
                Aging Societies
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              The World's Aging Crisis: 9 Countries Where Half the Population Will Soon Be Seniors
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Japan's median age has risen 7.5 years since 2000. South Korea ages faster than any nation in history. 
              Italy faces a future where diapers for adults outsell baby diapers 3-to-1. Welcome to the aging revolution.
            </p>
            <div className="flex items-center space-x-4 mt-6 text-blue-100 text-sm">
              <span>November 5, 2024</span>
              <span>•</span>
              <span>8 min read</span>
              <span>•</span>
              <span>Data Analysis</span>
            </div>
          </div>
        </header>

        {/* Opening Story */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-6xl mb-4">👵</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Hiroko, 78, Tokyo</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  "When I was young, our neighborhood was full of children playing in the streets. 
                  Now I'm the youngest person at my grocery store most days. My doctor is 
                  older than I am, and he can't find a replacement."
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">👶</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Min-jun, 8 months, Seoul</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Min-jun is one of only 230,000 babies born in South Korea this year—in a country 
                  of 52 million people. He'll grow up in classrooms with half-empty desks, 
                  in a society desperately hoping he'll help care for millions of elderly.
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-xl leading-relaxed text-gray-800 mb-4">
                <strong>This is the human face of the world's aging crisis.</strong>
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                Across nine countries, the demographic balance that has sustained human civilization for millennia 
                is shifting at breakneck speed. The implications reach far beyond statistics—they're reshaping 
                how we live, work, and care for each other in ways we're only beginning to understand.
              </p>
            </div>
          </div>
        </div>

        {/* The Numbers That Tell the Story */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Numbers That Tell the Story</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <p className="text-lg text-gray-700 mb-6">
              Behind every demographic statistic is a human story. In these nine countries, those stories are converging 
              into a narrative that will define the next century of human civilization.
            </p>
            
            {/* Key Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-4xl font-bold text-red-600 mb-2">49.0</div>
                <div className="text-sm text-red-800">Japan's Median Age</div>
                <div className="text-xs text-red-600 mt-1">Half the population is older than this</div>
              </div>
              <div className="text-center p-6 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-4xl font-bold text-orange-600 mb-2">30%</div>
                <div className="text-sm text-orange-800">Japan's Elderly Population</div>
                <div className="text-xs text-orange-600 mt-1">Nearly 1 in 3 people are 65+</div>
              </div>
              <div className="text-center p-6 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-4xl font-bold text-purple-600 mb-2">3:1</div>
                <div className="text-sm text-purple-800">Adult vs Baby Diapers</div>
                <div className="text-xs text-purple-600 mt-1">Sales ratio in Japan today</div>
              </div>
            </div>
          </div>
        </section>

        {/* The Aging Hall of Fame */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Aging Hall of Fame: Top 9 Countries</h2>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Median Age</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Elderly %</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crisis Level</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agingCountriesData.map((country, index) => (
                    <tr key={country.slug} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/${country.slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
                          {country.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {country.medianAge} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {country.elderlyPercent}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          index === 0 ? 'bg-red-100 text-red-800' :
                          index < 3 ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {index === 0 ? 'Extreme' : index < 3 ? 'Severe' : 'High'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Japan: The Canary in the Coal Mine */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">🇯🇵 Japan: The Canary in the Coal Mine</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">A Nation Transformed</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm italic mb-3">
                    "I teach in a school that once had 1,200 students. Now we have 200. The hallways echo 
                    with emptiness where children's laughter used to fill every corner. We've converted 
                    three classrooms into a senior day-care center—it's the only way to keep the building alive."
                  </p>
                  <p className="text-blue-700 text-xs">— Kenji Tanaka, Elementary School Principal, Akita Prefecture</p>
                </div>
                <p className="text-gray-700 mb-4">
                  Japan isn't just aging—it's pioneering a new form of human society. With a median age of 49, 
                  Japan has become the world's first "super-aged" society where seniors don't just outnumber 
                  children—they outnumber them 3-to-1.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-red-900 mb-2">The Stark Reality:</h4>
                  <ul className="text-red-800 text-sm space-y-1">
                    <li>• 30% of population is 65+ (38.3 million people)</li>
                    <li>• Only 11% are under 15 (13.5 million children)</li>
                    <li>• 8,000+ schools closed in the past decade</li>
                    <li>• Adult diaper sales exceed baby diapers 3:1</li>
                    <li>• 28,000 "ghost towns" with no children under 14</li>
                  </ul>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div style={{ height: '400px' }}>
                  <PopulationPyramid
                    data={japanData.years['2024']}
                    countryName="Japan"
                    year={2024}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* South Korea: The Speed Champion */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">🇰🇷 South Korea: The Speed Champion</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div style={{ height: '400px' }}>
                  <PopulationPyramid
                    data={southKoreaData.years['2024']}
                    countryName="South Korea"
                    year={2024}
                    height={400}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">The Fastest Transformation in History</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-sm italic mb-3">
                    "My grandmother had 8 children. My mother had 3. I have one daughter, and she says 
                    she might not have any. Looking at the cost of raising a child here, the competition, 
                    the pressure—I understand her choice. But who will take care of us when we're old?"
                  </p>
                  <p className="text-yellow-700 text-xs">— Park Soo-jin, 45, Software Engineer, Seoul</p>
                </div>
                <p className="text-gray-700 mb-4">
                  If Japan is the canary, South Korea is the rocket ship hurtling toward an unprecedented future. 
                  No country in human history has aged faster. What took Japan 25 years to achieve, 
                  South Korea accomplished in just 18 years.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-red-900 mb-2">Speed of Light Aging:</h4>
                  <ul className="text-red-800 text-sm space-y-1">
                    <li>• Median age: 44.4 years (was 31.8 in 2000)</li>
                    <li>• Birth rate: 0.78 children per woman (lowest in world history)</li>
                    <li>• Universities closing: 40 expected to shut down by 2030</li>
                    <li>• Military recruitment crisis: Not enough young men</li>
                    <li>• Wedding industry collapse: 50% fewer marriages since 2010</li>
                  </ul>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-purple-800 text-sm font-medium">
                    💡 South Korea ages 6 months every calendar year—faster than any society in recorded history.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Italy: Where Ancient History Meets Modern Reality */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">🇮🇹 Italy: Where Ancient History Meets Modern Reality</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">When Ancient Civilizations Face Modern Aging</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 text-sm italic mb-3">
                    "Every Sunday, my nonna makes pasta for the family. But now it's just her, me, and my cousin. 
                    The dining table that once seated 12 cousins, aunts, and uncles now echoes with empty chairs. 
                    She cooks for ghosts of children who were never born."
                  </p>
                  <p className="text-green-700 text-xs">— Marco Rossi, 34, Last grandchild, Liguria</p>
                </div>
                <p className="text-gray-700 mb-4">
                  Italy, cradle of Western civilization, now confronts its own demographic winter. With a median age of 47.8 years, 
                  the country that gave us the Renaissance is painting its future in shades of silver and gray. 
                  Ancient piazzas where children once played now serve as gathering spots for pensioners.
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-orange-900 mb-2">The Mediterranean Paradox:</h4>
                  <ul className="text-orange-800 text-sm space-y-1">
                    <li>• 23.6% are 65+ (14.1 million seniors)</li>
                    <li>• Only 12.9% are under 15 (7.7 million children)</li>
                    <li>• 1,200 schools closed in past decade</li>
                    <li>• 6,000 villages at risk of complete abandonment</li>
                    <li>• Birth rate: 1.25 children per woman (EU's lowest)</li>
                    <li>• "Nonna villages": Towns with no residents under 50</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">
                    📚 <strong>Historical Irony:</strong> Italy's population is aging faster than any empire declined in history—
                    a demographic transformation more dramatic than the fall of Rome.
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div style={{ height: '400px' }}>
                  <PopulationPyramid
                    data={italyData.years['2024']}
                    countryName="Italy"
                    year={2024}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Ripple Effects */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Ripple Effects: What This Means for Humanity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Economic Earthquakes</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Pension systems buckling under pressure</li>
                <li>• Labor shortages in critical industries</li>
                <li>• Healthcare costs skyrocketing</li>
                <li>• Innovation slowdown as workforce ages</li>
                <li>• Real estate markets in rural areas collapsing</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Healthcare Revolution</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Hospitals converting pediatric wards to geriatric care</li>
                <li>• Chronic disease management becomes dominant</li>
                <li>• Caregiver shortage reaches crisis levels</li>
                <li>• Technology-assisted living becomes essential</li>
                <li>• Mental health focus shifts to elderly care</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-4xl mb-4">🏫</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Educational Transformation</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• School closures and consolidations</li>
                <li>• Universities struggling with enrollment</li>
                <li>• Adult education and retraining boom</li>
                <li>• Intergenerational learning programs</li>
                <li>• Teacher shortages in youth education</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Technology Adoption</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Automation becomes survival necessity</li>
                <li>• Elder-tech industry explosion</li>
                <li>• AI companions for senior care</li>
                <li>• Smart home technology integration</li>
                <li>• Robotics in healthcare and assistance</li>
              </ul>
            </div>
          </div>
        </section>

        {/* A Day in 2050 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">A Day in 2050: What This World Will Look Like</h2>
          
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">🌅 Morning in Tokyo</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Akiko, 65, starts her day volunteering at an AI-assisted senior center where she helps 
                  care for 90-year-olds. The building used to be an elementary school—one of 15,000 closed 
                  in Japan since 2024. Her robot companion helps her navigate to the train station, 
                  which runs on automated systems due to the labor shortage.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">🌆 Evening in Seoul</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Ji-hoon, 40, one of only 180,000 Koreans born in 2010, finishes his shift as a caregiver 
                  managing 50 elderly patients through smart home technology. He's among the last generation 
                  expected to have children—the birth rate hit 0.4 in 2045. His apartment building has 
                  been converted: 2 floors for families, 8 floors for senior living.
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-200 text-lg">
                This isn't dystopian fiction. It's the mathematical certainty of current demographic trends.
              </p>
            </div>
          </div>
        </section>

        {/* The Global Picture */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Global Picture: Who's Next?</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <p className="text-lg text-gray-700 mb-6">
              These nine countries aren't outliers—they're pioneers. Every developed nation is following 
              the same trajectory, just a few years behind. By 2050, the number of people over 65 worldwide 
              will more than double, reaching 1.6 billion people.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="font-bold text-red-900 mb-3">Already Critical (2024)</h4>
                <div className="space-y-2 text-sm">
                  {agingCountriesData.slice(0, 3).map(country => (
                    <div key={country.slug} className="flex justify-between">
                      <Link href={`/${country.slug}`} className="text-red-700 hover:text-red-900">
                        {country.name}
                      </Link>
                      <span className="text-red-600 font-semibold">{country.medianAge}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h4 className="font-bold text-orange-900 mb-3">Rapidly Aging (2024)</h4>
                <div className="space-y-2 text-sm">
                  {agingCountriesData.slice(3, 6).map(country => (
                    <div key={country.slug} className="flex justify-between">
                      <Link href={`/${country.slug}`} className="text-orange-700 hover:text-orange-900">
                        {country.name}
                      </Link>
                      <span className="text-orange-600 font-semibold">{country.medianAge}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="font-bold text-yellow-900 mb-3">Next Wave (2024)</h4>
                <div className="space-y-2 text-sm">
                  {agingCountriesData.slice(6, 9).map(country => (
                    <div key={country.slug} className="flex justify-between">
                      <Link href={`/${country.slug}`} className="text-yellow-700 hover:text-yellow-900">
                        {country.name}
                      </Link>
                      <span className="text-yellow-600 font-semibold">{country.medianAge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions and Adaptations */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Innovation Response: How Countries Are Adapting</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🇯🇵</span>
                <h3 className="text-lg font-bold text-gray-900">Japan's Tech Revolution</h3>
              </div>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Robot caregivers in nursing homes</li>
                <li>• AI-powered health monitoring systems</li>
                <li>• Senior-friendly smart cities</li>
                <li>• Automated grocery delivery networks</li>
                <li>• Intergenerational housing initiatives</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🇰🇷</span>
                <h3 className="text-lg font-bold text-gray-900">South Korea's Social Innovation</h3>
              </div>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Massive immigration policy reforms</li>
                <li>• Fertility incentive programs</li>
                <li>• Elder-tech startup ecosystem</li>
                <li>• Community-based care networks</li>
                <li>• Flexible retirement age policies</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🇮🇹</span>
                <h3 className="text-lg font-bold text-gray-900">Italy's Cultural Adaptation</h3>
              </div>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Multi-generational housing designs</li>
                <li>• Senior volunteer programs</li>
                <li>• Age-friendly urban planning</li>
                <li>• Cultural preservation through elders</li>
                <li>• Tourism adapted for senior travelers</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🇩🇪</span>
                <h3 className="text-lg font-bold text-gray-900">Germany's Systematic Approach</h3>
              </div>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• National demographic strategy</li>
                <li>• Senior-friendly workplace policies</li>
                <li>• Healthcare digitization</li>
                <li>• Skilled migration programs</li>
                <li>• Pension system reforms</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Explore the Demographics of Any Country</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Dive deep into the demographic data of all 195 countries. See population pyramids, 
              aging trends, and future projections for any nation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/countries"
                className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
              >
                Explore All Countries
              </Link>
              <Link
                href="/japan"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition font-semibold"
              >
                See Japan's Full Data
              </Link>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Youth Explosion: 8 Countries Where 45% Are Under 15
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                While some countries age rapidly, others experience unprecedented youth booms. 
                Discover the demographic opposites.
              </p>
              <span className="text-green-600 text-sm font-semibold">Coming Next Week</span>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                The Great Population Swap: China vs India
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                How India overtook China as the world's most populous country and what it means 
                for the future of Asia.
              </p>
              <span className="text-purple-600 text-sm font-semibold">Coming Soon</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-8">
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">
              Data sourced from UN World Population Prospects 2024. 
              Analysis and visualizations by PopulationPyramids.org
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/blog" className="text-blue-600 hover:text-blue-800">← Back to Blog</Link>
              <span>•</span>
              <Link href="/" className="text-blue-600 hover:text-blue-800">Explore Data</Link>
              <span>•</span>
              <Link href="/about" className="text-blue-600 hover:text-blue-800">About</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}