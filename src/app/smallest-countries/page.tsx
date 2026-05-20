import Link from 'next/link';
import { getCountryRankings, formatPopulation, formatArea, formatDensity } from '@/lib/country-rankings';
import RankingBarChart, { BarItem } from '@/components/RankingBarChart';

export const metadata = {
  title: 'Smallest Countries in the World 2026 — By Area and Population',
  description:
    'Complete ranking of the smallest countries by both land area and population. Vatican City is smallest at 0.49 km² and ~500 people. Monaco, Nauru, Tuvalu, San Marino, Liechtenstein round out the top 6. Microstate categories, climate threats, economic models, glossary, methodology, and 15-question FAQ.',
  keywords:
    'smallest countries in the world, smallest countries, least populated countries, smallest countries by population, top 10 smallest countries, smallest nation in the world, countries with lowest population, microstates, smallest country in the world',
  openGraph: {
    title: 'Smallest Countries in the World 2026',
    description: 'Vatican City, Monaco, Nauru, Tuvalu — every microstate ranked. Categories, climate threats, economic models, glossary, methodology.',
    type: 'website',
    url: 'https://populationpyramids.org/smallest-countries',
  },
  alternates: { canonical: 'https://populationpyramids.org/smallest-countries' },
};

const LAST_UPDATED = '2026-05-18';
const PUBLISHED = '2026-05-18';

function generateSchema(top10Area: any[], top10Pop: any[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': 'https://populationpyramids.org/smallest-countries#article',
        headline: 'Smallest Countries in the World 2026',
        description: 'A complete ranking of the world\'s smallest countries by area and population.',
        author: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org' },
        publisher: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org', logo: { '@type': 'ImageObject', url: 'https://populationpyramids.org/icon.svg' } },
        datePublished: PUBLISHED,
        dateModified: LAST_UPDATED,
        articleSection: 'Geography',
        wordCount: 4500,
      },
      {
        '@type': 'WebPage',
        '@id': 'https://populationpyramids.org/smallest-countries#webpage',
        name: 'Smallest Countries in the World 2026',
        url: 'https://populationpyramids.org/smallest-countries',
        inLanguage: 'en-US',
      },
      {
        '@type': 'Dataset',
        name: 'World Countries Ranked Smallest to Largest 2026',
        description: 'Area and population for all 195 countries.',
        url: 'https://populationpyramids.org/smallest-countries',
        creator: [{ '@type': 'Organization', name: 'UN DESA Population Division', url: 'https://population.un.org/' }, { '@type': 'Organization', name: 'CIA World Factbook' }],
        publisher: { '@type': 'Organization', name: 'PopulationPyramids.org' },
        spatialCoverage: { '@type': 'Place', name: 'World' },
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
      {
        '@type': 'ItemList',
        name: 'Top 10 Smallest Countries by Area',
        numberOfItems: 10,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement: top10Area.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, description: `${c.areaKm2} km²`, url: `https://populationpyramids.org/${c.slug}` })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
          { '@type': 'ListItem', position: 2, name: 'Countries', item: 'https://populationpyramids.org/countries' },
          { '@type': 'ListItem', position: 3, name: 'Smallest Countries', item: 'https://populationpyramids.org/smallest-countries' },
        ],
      },
      {
        '@type': 'DefinedTermSet',
        name: 'Microstate Glossary',
        hasDefinedTerm: [
          { '@type': 'DefinedTerm', name: 'Microstate', description: 'Sovereign country with very small area or population.' },
          { '@type': 'DefinedTerm', name: 'City-state', description: 'A sovereign country consisting of a single city.' },
          { '@type': 'DefinedTerm', name: 'Enclave', description: 'A territory entirely surrounded by another country.' },
          { '@type': 'DefinedTerm', name: 'Atoll', description: 'A ring-shaped coral reef enclosing a lagoon.' },
          { '@type': 'DefinedTerm', name: 'Small Island Developing State (SIDS)', description: 'UN designation for small island countries facing similar development challenges.' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What is the smallest country in the world?', acceptedAnswer: { '@type': 'Answer', text: `${top10Area[0].name} at ${top10Area[0].areaKm2} km² (CIA Factbook) and ~${top10Area[0].population2024.toLocaleString()} people (UN WPP 2024) — smaller than New York's Central Park.` } },
          { '@type': 'Question', name: 'What are the 10 smallest countries?', acceptedAnswer: { '@type': 'Answer', text: top10Area.map((c, i) => `${i + 1}. ${c.name} (${c.areaKm2} km²)`).join(', ') + '.' } },
          { '@type': 'Question', name: 'What is the smallest country by population?', acceptedAnswer: { '@type': 'Answer', text: `${top10Pop[0].name} at ~${top10Pop[0].population2024.toLocaleString()} people.` } },
          { '@type': 'Question', name: 'Is Monaco smaller than Vatican City?', acceptedAnswer: { '@type': 'Answer', text: 'No. Vatican City is smaller (0.49 vs 2 km²). But Monaco has ~40,000 people (vs ~500) and is the world\'s most densely populated country.' } },
          { '@type': 'Question', name: 'How many microstates are there?', acceptedAnswer: { '@type': 'Answer', text: '10–15 depending on definition. Vatican City, Monaco, Nauru, Tuvalu, San Marino, Liechtenstein, Marshall Islands, Saint Kitts and Nevis, Maldives, Malta are typical.' } },
          { '@type': 'Question', name: 'Why do small countries exist?', acceptedAnswer: { '@type': 'Answer', text: 'Varied: papal territory (Vatican), royal protectorates that survived European unification (Monaco, San Marino, Liechtenstein, Andorra), post-colonial island states, recent independence movements.' } },
          { '@type': 'Question', name: 'Are small countries UN members?', acceptedAnswer: { '@type': 'Answer', text: 'Most are. 11 of the 12 smallest are full UN members; Vatican City is permanent observer. Nauru (~5,000) has the same UNGA vote as China.' } },
          { '@type': 'Question', name: 'How do small countries survive economically?', acceptedAnswer: { '@type': 'Answer', text: 'Specialization: financial services (Monaco, Liechtenstein), tourism (Caribbean/Pacific), single-resource exports (Brunei oil), aid (Pacific atolls), or special arrangements (Singapore as trade hub).' } },
          { '@type': 'Question', name: 'Are small island countries threatened by climate change?', acceptedAnswer: { '@type': 'Answer', text: 'Severely. Tuvalu, Kiribati, Maldives, Marshall Islands are atoll nations with max elevation just meters. Sea-level rise threatens habitability.' } },
          { '@type': 'Question', name: 'Why is Monaco so densely populated?', acceptedAnswer: { '@type': 'Answer', text: 'Monaco is a 2-km² city-state with ~40,000 people on the French Riviera — favorable tax treatment, Mediterranean climate, security attract wealthy residents. Density ~19,000/km².' } },
          { '@type': 'Question', name: 'What\'s the difference between microstate and city-state?', acceptedAnswer: { '@type': 'Answer', text: 'Microstate = any country with very small area/population. City-state = consists of a single city. Singapore and Monaco are both city-states; Vatican is both.' } },
          { '@type': 'Question', name: 'Are there micronations not in this list?', acceptedAnswer: { '@type': 'Answer', text: 'Many self-declared "micronations" (Sealand, Liberland) but not UN-recognized. This list shows only the 195 UN-recognized countries. Taiwan, Kosovo, Somaliland are not separately listed.' } },
          { '@type': 'Question', name: 'Which small countries are tax havens?', acceptedAnswer: { '@type': 'Answer', text: 'Monaco, Andorra, Liechtenstein, San Marino in Europe; Bahamas, Cayman Islands, Bermuda in Caribbean; Marshall Islands, Vanuatu in Pacific. International pressure has narrowed these models.' } },
          { '@type': 'Question', name: 'Where does the data come from?', acceptedAnswer: { '@type': 'Answer', text: 'Area: CIA World Factbook. Population: UN WPP 2024. For very small countries, population figures are usually government estimates.' } },
          { '@type': 'Question', name: 'When was this page last updated?', acceptedAnswer: { '@type': 'Answer', text: `${LAST_UPDATED}.` } },
        ],
      },
    ],
  };
}

export default async function SmallestCountriesPage() {
  const { countries } = await getCountryRankings();
  const byArea = [...countries].sort((a, b) => a.areaKm2 - b.areaKm2);
  const byPopulation = [...countries].sort((a, b) => a.population2024 - b.population2024 || a.name.localeCompare(b.name));
  const top10Area = byArea.slice(0, 10);
  const top10Pop = byPopulation.slice(0, 10);
  const schema = generateSchema(top10Area, top10Pop);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href="/countries" className="hover:text-blue-600">Countries</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Smallest Countries</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Smallest Countries in the World 2026
          </h1>
          <p className="text-lg text-gray-700 max-w-4xl mb-2">
            The world&apos;s smallest countries by both area and population. <strong>{top10Area[0].name}</strong> is smallest at{' '}
            <strong>{top10Area[0].areaKm2} km²</strong> — smaller than Central Park — and home to ~{top10Area[0].population2024.toLocaleString()} people.{' '}
            <strong>{top10Area[1].name}</strong> ({top10Area[1].areaKm2} km²) is the world&apos;s most densely populated country.{' '}
            <strong>{top10Area[2].name}</strong> ({top10Area[2].areaKm2} km²) is the smallest island nation.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> · Area:{' '}
            <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">CIA World Factbook</a>{' '}
            · Population:{' '}
            <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">UN WPP 2024</a>
          </p>

          {/* Top 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {top10Area.slice(0, 3).map((c, i) => (
              <div key={c.slug} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-amber-600">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">#{i + 1} smallest</div>
                <Link href={`/${c.slug}`} className="block text-base font-bold text-gray-900 hover:text-blue-700 mb-1">{c.name}</Link>
                <div className="text-2xl font-bold text-amber-700">{formatArea(c.areaKm2)}</div>
                <div className="text-xs text-gray-600 mt-1">Pop: {c.population2024.toLocaleString()} · CIA Factbook</div>
              </div>
            ))}
          </div>

          {/* Data Sources panel */}
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-8">
            <h2 className="text-base font-bold text-gray-900 mb-3">📋 Data Sources & Methodology</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-900 mb-1">Area</div>
                <p className="text-gray-700">Total area (land + inland water) from <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">CIA World Factbook</a>. Most stable measure available for small territories.</p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Population</div>
                <p className="text-gray-700">UN <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">World Population Prospects 2024</a>. For very small countries, figures are typically national government estimates; can change visibly year-to-year because individual births and deaths matter.</p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">What counts as a country</div>
                <p className="text-gray-700">The 195 UN-recognized sovereign states. Self-declared "micronations" (Sealand, Liberland, Hutt River) not included. Taiwan, Kosovo, Somaliland not separately listed.</p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Vatican City</div>
                <p className="text-gray-700">Population figure (~500) is set by the Holy See itself — almost all residents are Catholic clergy and Swiss Guards plus their families.</p>
              </div>
            </div>
          </section>

          {/* Quick insight cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-amber-700">
              <div className="text-3xl font-bold text-amber-700">0.49</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Vatican km²</div>
              <div className="text-sm text-gray-700 mt-1">Smaller than Central Park</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-amber-600">
              <div className="text-3xl font-bold text-amber-700">~500</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Vatican people</div>
              <div className="text-sm text-gray-700 mt-1">Smaller than one suburban school</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-amber-500">
              <div className="text-3xl font-bold text-amber-700">19K</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Monaco /km²</div>
              <div className="text-sm text-gray-700 mt-1">Densest country on Earth</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-red-500">
              <div className="text-3xl font-bold text-red-700">5</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Atoll nations</div>
              <div className="text-sm text-gray-700 mt-1">Existential climate risk</div>
            </div>
          </section>

          {/* Bar chart: smallest by area */}
          <div className="mb-6">
            <RankingBarChart
              items={top10Area.map<BarItem>((c, i) => ({
                rank: i + 1,
                name: c.name,
                slug: c.slug,
                value: c.areaKm2,
                formatted: `${c.areaKm2.toLocaleString()} km²`,
                share: `pop: ${c.population2024.toLocaleString()}`,
              }))}
              title="Top 10 Smallest Countries by Land Area"
              axisLabel="Total area in km² — Vatican&apos;s bar is clamped to a minimum width for visibility"
              source="Source: CIA World Factbook"
              color="amber"
              ticks={[
                { value: 0, label: '0' },
                { value: 50, label: '50' },
                { value: 100, label: '100' },
                { value: 150, label: '150' },
                { value: 200, label: '200' },
                { value: 250, label: '250' },
                { value: 316, label: '316 km²' },
              ]}
              caption={
                <>
                  The ratio of largest-to-smallest in the top 10 is roughly <strong>645×</strong>.
                  Vatican City at 0.49 km² is microscopic even by microstate standards. Click any
                  bar to view that country&apos;s page.
                </>
              }
            />
          </div>

          {/* Bar chart: smallest by population */}
          <div className="mb-8">
            <RankingBarChart
              items={top10Pop.map<BarItem>((c, i) => ({
                rank: i + 1,
                name: c.name,
                slug: c.slug,
                value: c.population2024,
                formatted: c.population2024.toLocaleString(),
                share: `${formatArea(c.areaKm2)}`,
              }))}
              title="Top 10 Smallest Countries by Population"
              axisLabel="Total population (UN WPP 2024 estimates)"
              source="Source: UN World Population Prospects 2024"
              color="amber"
              ticks={[
                { value: 0, label: '0' },
                { value: 10_000, label: '10K' },
                { value: 20_000, label: '20K' },
                { value: 30_000, label: '30K' },
                { value: 40_000, label: '40K' },
                { value: 49_600, label: '50K' },
              ]}
              caption={
                <>
                  Vatican City (~500 people) is two orders of magnitude smaller than the next
                  smallest. Each of these countries has the same UN General Assembly vote as
                  China or India.
                </>
              }
            />
          </div>

          {/* Smallest by area + by population — side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <section className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Top 10 Smallest by Area</h2>
                <span className="text-xs text-gray-500">Source: CIA World Factbook</span>
              </div>
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">#</th>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">Country</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Area km²</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Pop</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {top10Area.map((c, i) => (
                    <tr key={c.slug} className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-700">{i + 1}</td>
                      <td className="px-4 py-2"><Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">{c.name}</Link></td>
                      <td className="px-4 py-2 text-right text-gray-900 font-semibold">{c.areaKm2.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-gray-700">{c.population2024.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Top 10 Smallest by Population</h2>
                <span className="text-xs text-gray-500">Source: UN WPP 2024</span>
              </div>
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">#</th>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">Country</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Pop</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Area km²</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {top10Pop.map((c, i) => (
                    <tr key={c.slug} className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-700">{i + 1}</td>
                      <td className="px-4 py-2"><Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">{c.name}</Link></td>
                      <td className="px-4 py-2 text-right text-gray-900 font-semibold">{c.population2024.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-gray-700">{c.areaKm2.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>

          {/* Microstate categories — 5-card grid */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">The Five Categories of Microstates</h2>
            <p className="text-sm text-gray-600 mb-4">Small countries fall into distinct historical groupings.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'European feudal survivors',
                  icon: 'EU',
                  countries: 'Vatican City, Monaco, San Marino, Liechtenstein, Andorra, Malta',
                  detail: 'Survived European unification and the Napoleonic Wars. Most are wealthy financial centers today. San Marino claims to be the oldest republic still in existence (founded 301 CE).',
                },
                {
                  title: 'Pacific island nations',
                  icon: 'PAC',
                  countries: 'Nauru, Tuvalu, Palau, Marshall Islands, Micronesia, Kiribati, Tonga, Samoa',
                  detail: 'Mostly former colonies that stayed independent rather than federating. Severe climate vulnerability — sea-level rise threatens habitability.',
                },
                {
                  title: 'Caribbean island nations',
                  icon: 'CAR',
                  countries: 'Saint Kitts and Nevis, Grenada, Saint Vincent and the Grenadines, Barbados, Antigua and Barbuda, Saint Lucia, Dominica',
                  detail: 'Mostly gained independence from Britain in the 1960s–80s. Tourism-dominated economies.',
                },
                {
                  title: 'Recent independence',
                  icon: 'NEW',
                  countries: 'East Timor (2002), Montenegro (2006), South Sudan (2011)',
                  detail: 'Plus the seven Yugoslav successor states from the 1990s. Most are not as small as the European microstates but are small relative to neighbors.',
                },
              ].map((cat) => (
                <div key={cat.title} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{cat.icon}</span>
                    <h3 className="font-semibold text-gray-900">{cat.title}</h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-2"><strong>Countries:</strong> {cat.countries}</p>
                  <p className="text-sm text-gray-600">{cat.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">Plus unique cases like Singapore (city-state expelled from Malaysia in 1965), Brunei (oil-rich sultanate), Maldives (atoll nation in the Indian Ocean).</p>
          </section>

          {/* Climate threat callout */}
          <section className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Existential Threat: Sea-Level Rise</h2>
            <p className="text-sm text-gray-700 mb-4">
              Five UN member states are atoll nations — countries built on coral reefs with maximum elevations of a few meters. Climate change is a survival issue, not a policy preference.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
              {[
                { country: 'Tuvalu', max: '4.6 m', pop: '~10,000' },
                { country: 'Kiribati', max: '3 m', pop: '~135,000' },
                { country: 'Maldives', max: '2.4 m', pop: '~520,000' },
                { country: 'Marshall Is.', max: '~10 m', pop: '~40,000' },
                { country: 'Nauru', max: '~70 m (raised)', pop: '~12,000' },
              ].map((n) => (
                <div key={n.country} className="bg-white rounded p-3 border border-red-100">
                  <div className="font-semibold text-gray-900">{n.country}</div>
                  <div className="text-xs text-gray-500 mt-1">Max elevation: {n.max}</div>
                  <div className="text-xs text-gray-500">Pop: {n.pop}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3">
              The IPCC projects 0.4–1.0 m sea-level rise by 2100 under medium-emissions scenarios.
              Tuvalu has begun planning &quot;digital nationhood&quot; — preserving government and culture as digital archives.
            </p>
            <p className="text-xs text-gray-500 mt-1">Source: IPCC AR6 WG1 (2021); Government of Tuvalu, &quot;Future Now&quot; initiative.</p>
          </section>

          {/* Economic models — grid */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">How Small Countries Survive Economically</h2>
            <p className="text-sm text-gray-600 mb-4">Small countries can&apos;t diversify — they specialize.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {[
                { model: 'Financial services', examples: 'Monaco, Liechtenstein, Luxembourg, Bahamas, Cayman Islands, Bermuda', note: 'Among the wealthiest places per capita. International pressure (OECD CRS) has narrowed.' },
                { model: 'Tourism', examples: 'Maldives, Barbados, Seychelles, Saint Lucia, Vanuatu', note: 'Often the largest source of foreign exchange for island microstates.' },
                { model: 'Single-resource exports', examples: 'Brunei (oil), Nauru (phosphates, depleted), Botswana (diamonds), Iceland (fish, geothermal)', note: 'Highly vulnerable to commodity swings.' },
                { model: 'Aid + fishing rights', examples: 'Tuvalu, Kiribati, Marshall Is., Federated States of Micronesia, Palau', note: 'Compact of Free Association with the US for the latter three.' },
                { model: 'Strategic location', examples: 'Singapore, Hong Kong, Panama (historically)', note: 'Trade and finance hubs that leverage geography.' },
                { model: 'Special arrangements', examples: 'Vatican (donations, tourism), Monaco (no income tax, casino, real estate)', note: 'Unique to each country, often historical.' },
              ].map((m) => (
                <div key={m.model} className="border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-1">{m.model}</div>
                  <div className="text-xs text-gray-600 mb-2">{m.examples}</div>
                  <div className="text-xs text-gray-500">{m.note}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Comparative scale */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Putting Small Sizes in Perspective</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                { stat: '0.49 km²', label: 'Vatican City', detail: 'Smaller than NYC&apos;s Central Park (3.41 km²). Hyde Park is 5× larger. Walt Disney World&apos;s Magic Kingdom is 2.4× larger.' },
                { stat: '2 km²', label: 'Monaco', detail: 'Would fit inside NYC&apos;s Central Park. Houses ~40,000 people on the French Riviera — denser than Manhattan.' },
                { stat: '21 km²', label: 'Nauru', detail: 'Walkable in a day. Phosphate-mining boom in the 20th century, now largely depleted.' },
                { stat: '26 km²', label: 'Tuvalu', detail: 'Highest point: 4.6 meters above sea level. Crossable by car in an hour.' },
              ].map((c) => (
                <div key={c.label} className="bg-gray-50 rounded p-4">
                  <div className="text-2xl font-bold text-blue-700 mb-1">{c.stat}</div>
                  <div className="font-semibold text-gray-900 mb-1">{c.label}</div>
                  <div className="text-gray-700">{c.detail}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Full table */}
          <section className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-baseline flex-wrap gap-2">
              <h2 className="text-xl font-bold text-gray-900">All 195 Countries — Smallest to Largest by Area</h2>
              <span className="text-xs text-gray-500">Source: CIA Factbook (area), UN WPP 2024 (population)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">#</th>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">Country</th>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">Region</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Area km²</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Population 2024</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Density /km²</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {byArea.map((c, i) => (
                    <tr key={c.slug} className="hover:bg-blue-50">
                      <td className="px-4 py-1.5 text-gray-700">{i + 1}</td>
                      <td className="px-4 py-1.5"><Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">{c.name}</Link></td>
                      <td className="px-4 py-1.5 text-gray-600">{c.region}</td>
                      <td className="px-4 py-1.5 text-right text-gray-900 font-medium">{c.areaKm2.toLocaleString()}</td>
                      <td className="px-4 py-1.5 text-right text-gray-700">{formatPopulation(c.population2024)}</td>
                      <td className="px-4 py-1.5 text-right text-gray-700">{c.densityPerKm2 > 0 ? formatDensity(c.densityPerKm2) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Glossary */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Microstate Glossary</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                ['Microstate', 'Sovereign country with very small area (<1,000 km²) or population (<1M). No single official definition.'],
                ['City-state', 'A sovereign country consisting of a single city. Singapore, Monaco, Vatican City.'],
                ['Enclave', 'A territory entirely surrounded by another country. Vatican (in Italy), San Marino (in Italy), Lesotho (in South Africa).'],
                ['Atoll', 'A ring-shaped coral reef enclosing a lagoon. Tuvalu, Maldives, Marshall Islands, Kiribati are atoll nations.'],
                ['SIDS', 'Small Island Developing States — UN designation for small islands with similar challenges, especially climate.'],
                ['Compact of Free Association', 'US treaty with Marshall Is., FSM, Palau providing budget support + US access in exchange for strategic rights.'],
              ].map(([term, def]) => (
                <div key={term as string}>
                  <dt className="font-semibold text-gray-900">{term}</dt>
                  <dd className="text-gray-700">{def}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {[
                { q: 'What is the smallest country in the world?', a: 'Vatican City at 0.49 km² and ~500 people — smaller than Central Park.' },
                { q: 'What are the 10 smallest countries by area?', a: `${top10Area.map((c, i) => `${i + 1}. ${c.name} (${c.areaKm2} km²)`).join(', ')}.` },
                { q: 'What is the smallest country by population?', a: `Vatican City at ~${top10Pop[0].population2024.toLocaleString()} people.` },
                { q: 'Is Monaco smaller than Vatican City?', a: 'No. Vatican is smaller (0.49 vs 2 km²). But Monaco has ~40,000 people (vs ~500) — the world\'s most densely populated country.' },
                { q: 'How many microstates exist?', a: '10–15 depending on definition.' },
                { q: 'Why do small countries exist?', a: 'Papal territory (Vatican), royal protectorates (Monaco, San Marino, Liechtenstein, Andorra), post-colonial islands, recent independence.' },
                { q: 'Are they UN members?', a: '11 of the 12 smallest are full UN members. Vatican is permanent observer.' },
                { q: 'How do small countries survive?', a: 'Specialization: financial services, tourism, single-resource exports, aid, strategic location.' },
                { q: 'Climate change threat?', a: 'Atoll nations (Tuvalu, Kiribati, Maldives, Marshall Is.) face existential risk from sea-level rise.' },
                { q: 'Why is Monaco so densely populated?', a: '40,000 people in 2 km² — favorable tax, climate, security attract wealthy residents.' },
                { q: 'Microstate vs city-state?', a: 'Microstate = small country. City-state = single-city country. Vatican and Monaco are both.' },
                { q: 'Are tax havens here?', a: 'Several: Monaco, Andorra, Liechtenstein, San Marino, Bahamas, Cayman Is., Bermuda, Marshall Is., Vanuatu.' },
                { q: 'What about Sealand and other micronations?', a: 'Not UN-recognized — not included. Only 195 UN-recognized states here.' },
                { q: 'Where does the data come from?', a: 'Area: CIA Factbook. Population: UN WPP 2024. Vatican: figures from the Holy See.' },
                { q: 'When was this updated?', a: `${LAST_UPDATED}.` },
              ].map((item, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.q}</h3>
                  <p className="text-sm text-gray-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Cross-links */}
          <section className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Explore More Rankings</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <li><Link href="/largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Largest Countries by Area</Link></li>
              <li><Link href="/most-populated-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Most Populated Countries</Link></li>
              <li><Link href="/top-10-largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Top 10 Largest (detailed)</Link></li>
              <li><Link href="/top-10-most-populated-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Top 10 Most Populated</Link></li>
              <li><Link href="/countries" className="text-blue-700 hover:text-blue-900 font-medium">→ All 195 Countries</Link></li>
              <li><Link href="/compare" className="text-blue-700 hover:text-blue-900 font-medium">→ Compare Two Countries</Link></li>
            </ul>
          </section>

          {/* Sources footer */}
          <section className="bg-gray-100 rounded-lg p-5 text-sm text-gray-700">
            <h3 className="font-semibold text-gray-900 mb-2">Sources & Further Reading</h3>
            <ul className="space-y-1">
              <li><strong>Area:</strong> <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">CIA World Factbook</a></li>
              <li><strong>Population:</strong> <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">UN World Population Prospects 2024</a></li>
              <li><strong>Climate vulnerability:</strong> <a href="https://www.aosis.org/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">Alliance of Small Island States</a>; <a href="https://www.ipcc.ch/report/ar6/wg1/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">IPCC AR6 WG1</a></li>
              <li>Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
