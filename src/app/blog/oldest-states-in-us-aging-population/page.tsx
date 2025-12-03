import Link from 'next/link';

export const metadata = {
  title: 'States With Oldest Population 2024: Top 15 US States by Median Age | Population Pyramids',
  description: 'Discover which state has the oldest population. Maine leads at 45.1 years median age. Complete ranking of states with oldest population, senior citizens data, and cheapest states for seniors to live.',
  keywords: 'oldest states in the US, states with oldest population, which state has the oldest population, state with most senior citizens, cheapest states for seniors to live, median age by state',
};

export default function OldestStatesPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          States With Oldest Population: The 15 Most Senior US States in 2024
        </h1>
        <div className="flex items-center text-gray-600 text-sm space-x-4">
          <time dateTime="2024-11-12">November 12, 2024</time>
          <span>•</span>
          <span>10 min read</span>
          <span>•</span>
          <span className="text-purple-600 font-medium">US Demographics</span>
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          Maine has the oldest population in America with a median age of 45.1 years—nearly 7 years older than the US average. Vermont and New Hampshire follow closely behind. These aging states face unique challenges: shrinking workforces, overwhelmed healthcare systems, and dying rural towns. Here are the 15 oldest states in the US and what their aging populations mean for America's future.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Quick Answer: Which State Has the Oldest Population?</h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-blue-900">Top 5 Oldest States by Median Age (2024)</h3>
          <ol className="space-y-2 text-blue-800">
            <li><strong>1. Maine:</strong> 45.1 years (23% over 65)</li>
            <li><strong>2. Vermont:</strong> 43.7 years (21% over 65)</li>
            <li><strong>3. West Virginia:</strong> 43.5 years (22% over 65)</li>
            <li><strong>4. New Hampshire:</strong> 43.3 years (20% over 65)</li>
            <li><strong>5. Florida:</strong> 43.1 years (21% over 65)</li>
          </ol>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Complete Ranking: 15 States With Oldest Population</h2>

        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Rank</th>
                <th className="border border-gray-300 px-4 py-2 text-left">State</th>
                <th className="border border-gray-300 px-4 py-2">Median Age</th>
                <th className="border border-gray-300 px-4 py-2">% Over 65</th>
                <th className="border border-gray-300 px-4 py-2">% Over 85</th>
                <th className="border border-gray-300 px-4 py-2">Total Seniors</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">1</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Maine</td>
                <td className="border border-gray-300 px-4 py-2 text-center">45.1</td>
                <td className="border border-gray-300 px-4 py-2 text-center">23.0%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">2.9%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">321,015</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">2</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Vermont</td>
                <td className="border border-gray-300 px-4 py-2 text-center">43.7</td>
                <td className="border border-gray-300 px-4 py-2 text-center">21.2%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">2.7%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">137,301</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">3</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">West Virginia</td>
                <td className="border border-gray-300 px-4 py-2 text-center">43.5</td>
                <td className="border border-gray-300 px-4 py-2 text-center">22.1%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">2.5%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">391,186</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">4</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">New Hampshire</td>
                <td className="border border-gray-300 px-4 py-2 text-center">43.3</td>
                <td className="border border-gray-300 px-4 py-2 text-center">20.0%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">2.6%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">280,411</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">5</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Florida</td>
                <td className="border border-gray-300 px-4 py-2 text-center">43.1</td>
                <td className="border border-gray-300 px-4 py-2 text-center">21.3%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">3.1%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">4,816,085</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">6</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Connecticut</td>
                <td className="border border-gray-300 px-4 py-2 text-center">41.8</td>
                <td className="border border-gray-300 px-4 py-2 text-center">18.9%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">2.8%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">683,646</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">7</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Delaware</td>
                <td className="border border-gray-300 px-4 py-2 text-center">41.7</td>
                <td className="border border-gray-300 px-4 py-2 text-center">20.5%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">2.4%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">211,537</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">8</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Pennsylvania</td>
                <td className="border border-gray-300 px-4 py-2 text-center">41.6</td>
                <td className="border border-gray-300 px-4 py-2 text-center">19.6%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">2.9%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">2,540,490</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">9</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Rhode Island</td>
                <td className="border border-gray-300 px-4 py-2 text-center">41.4</td>
                <td className="border border-gray-300 px-4 py-2 text-center">18.5%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">3.0%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">202,689</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">10</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Hawaii</td>
                <td className="border border-gray-300 px-4 py-2 text-center">40.8</td>
                <td className="border border-gray-300 px-4 py-2 text-center">20.1%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">2.3%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">288,441</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">11</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Montana</td>
                <td className="border border-gray-300 px-4 py-2 text-center">40.7</td>
                <td className="border border-gray-300 px-4 py-2 text-center">20.8%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">2.2%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">235,625</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">12</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Massachusetts</td>
                <td className="border border-gray-300 px-4 py-2 text-center">40.7</td>
                <td className="border border-gray-300 px-4 py-2 text-center">18.1%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">2.7%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">1,267,253</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">13</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">New Jersey</td>
                <td className="border border-gray-300 px-4 py-2 text-center">40.7</td>
                <td className="border border-gray-300 px-4 py-2 text-center">17.5%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">2.5%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">1,625,897</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">14</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">South Carolina</td>
                <td className="border border-gray-300 px-4 py-2 text-center">40.6</td>
                <td className="border border-gray-300 px-4 py-2 text-center">19.2%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">2.0%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">1,031,723</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">15</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Michigan</td>
                <td className="border border-gray-300 px-4 py-2 text-center">40.5</td>
                <td className="border border-gray-300 px-4 py-2 text-center">18.7%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">2.6%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">1,876,967</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">State With Most Senior Citizens: Florida's 4.8 Million</h2>

        <p>
          While Maine has the oldest median age, Florida has by far the most senior citizens in absolute numbers. With 4.8 million residents over 65, Florida has more seniors than the entire population of many states. California follows with 6.1 million seniors (but a younger median age due to its massive overall population).
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
          <h4 className="font-bold text-yellow-800 mb-2">States With Most Senior Citizens (Total Numbers)</h4>
          <ol className="text-yellow-700 space-y-1">
            <li>1. <strong>California:</strong> 6.1 million seniors (15.4% of population)</li>
            <li>2. <strong>Florida:</strong> 4.8 million seniors (21.3% of population)</li>
            <li>3. <strong>Texas:</strong> 3.9 million seniors (13.0% of population)</li>
            <li>4. <strong>New York:</strong> 3.4 million seniors (17.4% of population)</li>
            <li>5. <strong>Pennsylvania:</strong> 2.5 million seniors (19.6% of population)</li>
          </ol>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Why Are These States So Old? 5 Key Factors</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">1. Young People Are Fleeing</h3>
        <p>
          Maine, Vermont, and West Virginia consistently rank among the states losing the most young adults. College graduates leave for better jobs in Boston, New York, or growing Sun Belt cities. This "brain drain" leaves behind an increasingly elderly population.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">2. Retirees Are Moving In</h3>
        <p>
          Florida's age isn't just from locals aging—it's from massive retirement migration. Over 300,000 seniors move to Florida annually, drawn by no state income tax, warm weather, and retirement communities. Delaware and South Carolina see similar retirement influxes.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3. Low Birth Rates</h3>
        <p>
          Vermont has one of the nation's lowest birth rates at just 8.6 births per 1,000 people. Maine and New Hampshire aren't far behind. Fewer babies means the population naturally skews older over time.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">4. Economic Decline in Rural Areas</h3>
        <p>
          West Virginia's coal industry collapse eliminated jobs that attracted young families. Similar economic declines in rural Maine (paper mills) and Vermont (dairy farms) push working-age adults to leave while retirees stay.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">5. High Cost of Living</h3>
        <p>
          Connecticut, Massachusetts, and New Jersey have such high costs that young families can't afford to stay. Meanwhile, older homeowners who bought decades ago remain, creating age imbalances.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Cheapest States for Seniors to Live: Where Retirees Get Most Value</h2>

        <p>
          Not all aging states are expensive. Some offer incredible value for seniors on fixed incomes. Here are the cheapest states for seniors considering taxes, healthcare, housing, and overall cost of living:
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
          <h3 className="text-xl font-bold mb-4 text-green-900">Top 10 Cheapest States for Seniors to Live (2024)</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-green-800">1. Mississippi</h4>
              <p className="text-green-700">Cost of living: 15% below national average. No tax on Social Security, median home price $189,000</p>
            </div>
            
            <div>
              <h4 className="font-bold text-green-800">2. Oklahoma</h4>
              <p className="text-green-700">Cost of living: 13% below average. Low property taxes, affordable healthcare</p>
            </div>
            
            <div>
              <h4 className="font-bold text-green-800">3. Alabama</h4>
              <p className="text-green-700">Cost of living: 12% below average. No tax on Social Security, mild winters</p>
            </div>
            
            <div>
              <h4 className="font-bold text-green-800">4. Arkansas</h4>
              <p className="text-green-700">Cost of living: 11% below average. Low property taxes, affordable Medicare supplemental insurance</p>
            </div>
            
            <div>
              <h4 className="font-bold text-green-800">5. Georgia</h4>
              <p className="text-green-700">$65,000 retirement income exclusion, no tax on Social Security, moderate climate</p>
            </div>
            
            <div>
              <h4 className="font-bold text-green-800">6. Tennessee</h4>
              <p className="text-green-700">No state income tax, low property taxes, excellent healthcare facilities</p>
            </div>
            
            <div>
              <h4 className="font-bold text-green-800">7. Missouri</h4>
              <p className="text-green-700">Social Security not taxed, affordable housing, good healthcare access</p>
            </div>
            
            <div>
              <h4 className="font-bold text-green-800">8. Indiana</h4>
              <p className="text-green-700">Low property taxes, affordable healthcare, no tax on Social Security</p>
            </div>
            
            <div>
              <h4 className="font-bold text-green-800">9. West Virginia</h4>
              <p className="text-green-700">Low cost of living, beautiful scenery, low crime rates in rural areas</p>
            </div>
            
            <div>
              <h4 className="font-bold text-green-800">10. Kentucky</h4>
              <p className="text-green-700">No tax on Social Security, low property taxes, mild climate</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Northeast Aging Crisis: A Regional Phenomenon</h2>

        <p>
          Seven of the 15 oldest states are in the Northeast, creating a regional aging crisis. Maine, Vermont, New Hampshire, Connecticut, Pennsylvania, Rhode Island, and Massachusetts all have median ages above 40. This concentration creates unique challenges:
        </p>

        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Healthcare shortages:</strong> Rural hospitals closing, not enough geriatric specialists</li>
          <li><strong>Tax base erosion:</strong> Fewer workers supporting more retirees</li>
          <li><strong>Housing crisis:</strong> Seniors can't downsize, young families can't afford homes</li>
          <li><strong>School closures:</strong> Declining youth populations force consolidations</li>
          <li><strong>Economic stagnation:</strong> Businesses avoid areas without young workers</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">What Happens When States Get Too Old?</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">The Maine Warning: America's Future?</h3>
        <p>
          Maine offers a preview of what happens when aging goes too far. With 23% of residents over 65 and climbing, the state faces:
        </p>

        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>Worker shortage so severe that businesses can't find employees</li>
          <li>Property taxes skyrocketing as the tax base shrinks</li>
          <li>Rural towns literally dying as young people vanish</li>
          <li>Healthcare system overwhelmed by elderly patients</li>
          <li>Schools consolidating or closing entirely</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">The Florida Model: Can Immigration Save Aging States?</h3>
        <p>
          Florida manages its elderly population better than most through constant immigration. Despite having the 5th oldest population, Florida maintains economic growth by attracting both retirees (who bring wealth) and young immigrants (who provide labor). This dual-migration model might be the only solution for aging states.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Aging Demographics by Region</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-3">Northeast: The Oldest Region</h3>
            <p className="text-sm text-blue-700 mb-2">Average median age: 41.2 years</p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• 7 of 9 states have median age above 40</li>
              <li>• Losing young adults to Sun Belt</li>
              <li>• Low birth rates accelerating aging</li>
              <li>• High costs pushing out families</li>
            </ul>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-bold text-red-800 mb-3">South: Mixed Ages</h3>
            <p className="text-sm text-red-700 mb-2">Average median age: 39.1 years</p>
            <ul className="text-xs text-red-600 space-y-1">
              <li>• Florida very old, Texas very young</li>
              <li>• Retirement destinations aging fast</li>
              <li>• Growing states staying younger</li>
              <li>• Rural areas aging, cities young</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-green-800 mb-3">Midwest: Steady Aging</h3>
            <p className="text-sm text-green-700 mb-2">Average median age: 39.5 years</p>
            <ul className="text-xs text-green-600 space-y-1">
              <li>• Consistent aging across states</li>
              <li>• Rural depopulation accelerating</li>
              <li>• Cities attracting some youth</li>
              <li>• Manufacturing decline impacts</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-bold text-yellow-800 mb-3">West: Youngest Region</h3>
            <p className="text-sm text-yellow-700 mb-2">Average median age: 37.8 years</p>
            <ul className="text-xs text-yellow-600 space-y-1">
              <li>• Utah youngest at 32.3 years</li>
              <li>• Tech hubs attracting youth</li>
              <li>• Mountain states growing younger</li>
              <li>• Only Hawaii aging significantly</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Economic Impact of State Aging</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">Healthcare Costs Exploding</h3>
        <p>
          States with older populations spend dramatically more on healthcare. Maine spends $11,000 per capita on healthcare—nearly double the national average. Medicare and Medicaid consume over 30% of state budgets in the oldest states.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Tax Revenue Declining</h3>
        <p>
          Retirees typically pay less in taxes than working-age adults. States like Vermont see income tax revenue declining even as service costs rise. Property taxes must increase to compensate, further driving out young families.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Economic Growth Stalling</h3>
        <p>
          The 10 oldest states averaged just 0.8% GDP growth over the past decade, compared to 2.1% for the 10 youngest states. Aging populations simply don't drive economic expansion like younger ones do.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Future Projections: Which States Will Age Fastest?</h2>

        <p>
          By 2030, demographers predict significant shifts in state age rankings:
        </p>

        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-6">
          <h4 className="font-bold text-purple-800 mb-2">States That Will Age Most Rapidly 2024-2030</h4>
          <ul className="text-purple-700 space-y-1">
            <li>• <strong>Alaska:</strong> Median age rising from 35.6 to 39.2 (+3.6 years)</li>
            <li>• <strong>New Mexico:</strong> From 39.1 to 42.3 (+3.2 years)</li>
            <li>• <strong>Oregon:</strong> From 40.3 to 43.1 (+2.8 years)</li>
            <li>• <strong>Arizona:</strong> From 38.8 to 41.5 (+2.7 years)</li>
            <li>• <strong>Nevada:</strong> From 39.0 to 41.6 (+2.6 years)</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Policy Solutions for Aging States</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">What States Are Trying:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Maine:</strong> Free community college to retain young adults</li>
          <li><strong>Vermont:</strong> $10,000 grants for remote workers to relocate</li>
          <li><strong>West Virginia:</strong> $12,000 plus free outdoor recreation passes for movers</li>
          <li><strong>Connecticut:</strong> Student loan forgiveness for STEM graduates who stay</li>
          <li><strong>New Hampshire:</strong> No income or sales tax to attract residents</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">What Actually Works:</h3>
        <p>
          Research shows that economic opportunity matters more than incentives. States that successfully attract young people focus on:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Creating tech hubs and innovation districts</li>
          <li>Investing in universities and research</li>
          <li>Building walkable, vibrant downtowns</li>
          <li>Providing affordable housing options</li>
          <li>Embracing immigration and diversity</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Bottom Line: America's Aging Divide</h2>

        <p>
          The gap between America's oldest and youngest states continues widening. Maine's median age (45.1) is now 13 years older than Utah's (32.3)—a gap that was just 8 years in 2000. This divergence creates two different Americas:
        </p>

        <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4">Two Americas Emerging</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-2">Old America (Northeast, Rural Midwest)</h4>
              <ul className="text-sm space-y-1">
                <li>• Shrinking populations</li>
                <li>• Rising healthcare costs</li>
                <li>• Closing schools and hospitals</li>
                <li>• Increasing property taxes</li>
                <li>• Economic stagnation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-2">Young America (Sun Belt, Mountain West)</h4>
              <ul className="text-sm space-y-1">
                <li>• Growing populations</li>
                <li>• Building new infrastructure</li>
                <li>• Opening schools and businesses</li>
                <li>• Economic dynamism</li>
                <li>• Housing shortages from growth</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4 text-blue-900">Key Takeaways: States With Oldest Population</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• <strong>Maine has the oldest population</strong> with median age 45.1 years</li>
            <li>• <strong>Florida has the most seniors</strong> with 4.8 million residents over 65</li>
            <li>• <strong>Northeast dominates</strong> the list with 7 of 15 oldest states</li>
            <li>• <strong>Mississippi is cheapest</strong> for seniors despite not being among oldest</li>
            <li>• <strong>Aging accelerates</strong> as young people flee to opportunity states</li>
          </ul>
        </div>

        <p className="text-lg text-gray-700 mt-8">
          Understanding which states have the oldest populations helps predict economic trends, healthcare needs, and migration patterns. As America's age divide widens, these demographic differences will increasingly shape politics, economics, and the fundamental character of different regions. The challenge for aging states is clear: attract young people or face irreversible decline.
        </p>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-bold mb-3">Explore State Demographics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/states" className="text-blue-600 hover:text-blue-800 underline">
              View all US state demographics →
            </Link>
            <Link href="/states/maine" className="text-blue-600 hover:text-blue-800 underline">
              See Maine's population pyramid →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}