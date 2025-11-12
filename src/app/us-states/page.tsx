'use client';

import Link from 'next/link';
import { useState } from 'react';

// State flag emojis mapping
const stateFlags: Record<string, string> = {
  AL: '🏴', AK: '🏔️', AZ: '🌵', AR: '💎', CA: '🐻', CO: '⛰️', CT: '🌳', DE: '💎', FL: '🌴', GA: '🍑',
  HI: '🌺', ID: '🥔', IL: '🌆', IN: '🏁', IA: '🌽', KS: '🌻', KY: '🐎', LA: '⚜️', ME: '🦞', MD: '🦀',
  MA: '📚', MI: '🚗', MN: '❄️', MS: '🎵', MO: '🏛️', MT: '🦌', NE: '🌾', NV: '🎰', NH: '🗿', NJ: '🏖️',
  NM: '🌶️', NY: '🗽', NC: '✈️', ND: '🦬', OH: '🌰', OK: '🛢️', OR: '🦫', PA: '🔔', RI: '⚓', SC: '🌙',
  SD: '🗿', TN: '🎸', TX: '⭐', UT: '🏔️', VT: '🍁', VA: '🏛️', WA: '🍎', WV: '⛏️', WI: '🧀', WY: '🦬'
};

// Comprehensive US States data with slugs
const statesData = [
  { rank: 1, name: 'California', code: 'CA', slug: 'california', population: 38965193, growth2020: -0.8, growth2010: 6.0, medianAge: 37.8, region: 'West' },
  { rank: 2, name: 'Texas', code: 'TX', slug: 'texas', population: 30503301, growth2020: 4.7, growth2010: 15.9, medianAge: 35.5, region: 'South' },
  { rank: 3, name: 'Florida', code: 'FL', slug: 'florida', population: 22610726, growth2020: 3.3, growth2010: 14.6, medianAge: 43.1, region: 'South' },
  { rank: 4, name: 'New York', code: 'NY', slug: 'new-york', population: 19571216, growth2020: -1.8, growth2010: 4.3, medianAge: 39.9, region: 'Northeast' },
  { rank: 5, name: 'Pennsylvania', code: 'PA', slug: 'pennsylvania', population: 12961683, growth2020: -0.6, growth2010: 2.4, medianAge: 41.6, region: 'Northeast' },
  { rank: 6, name: 'Illinois', code: 'IL', slug: 'illinois', population: 12549689, growth2020: -2.1, growth2010: -0.1, medianAge: 39.4, region: 'Midwest' },
  { rank: 7, name: 'Ohio', code: 'OH', slug: 'ohio', population: 11780017, growth2020: 0.5, growth2010: 2.3, medianAge: 40.4, region: 'Midwest' },
  { rank: 8, name: 'Georgia', code: 'GA', slug: 'georgia', population: 11029227, growth2020: 3.3, growth2010: 10.6, medianAge: 37.5, region: 'South' },
  { rank: 9, name: 'North Carolina', code: 'NC', slug: 'north-carolina', population: 10835491, growth2020: 3.9, growth2010: 9.5, medianAge: 39.6, region: 'South' },
  { rank: 10, name: 'Michigan', code: 'MI', slug: 'michigan', population: 10037261, growth2020: 0.3, growth2010: 2.0, medianAge: 40.5, region: 'Midwest' },
  { rank: 11, name: 'New Jersey', code: 'NJ', slug: 'new-jersey', population: 9290841, growth2020: 1.0, growth2010: 5.7, medianAge: 40.7, region: 'Northeast' },
  { rank: 12, name: 'Virginia', code: 'VA', slug: 'virginia', population: 8715698, growth2020: 2.1, growth2010: 7.9, medianAge: 39.6, region: 'South' },
  { rank: 13, name: 'Washington', code: 'WA', slug: 'washington', population: 7812880, growth2020: 3.3, growth2010: 14.1, medianAge: 38.1, region: 'West' },
  { rank: 14, name: 'Arizona', code: 'AZ', slug: 'arizona', population: 7431344, growth2020: 3.8, growth2010: 11.9, medianAge: 38.8, region: 'West' },
  { rank: 15, name: 'Tennessee', code: 'TN', slug: 'tennessee', population: 7126489, growth2020: 3.5, growth2010: 8.9, medianAge: 39.5, region: 'South' },
  { rank: 16, name: 'Massachusetts', code: 'MA', slug: 'massachusetts', population: 7001399, growth2020: 0.8, growth2010: 7.4, medianAge: 40.7, region: 'Northeast' },
  { rank: 17, name: 'Indiana', code: 'IN', slug: 'indiana', population: 6862199, growth2020: 1.5, growth2010: 4.7, medianAge: 38.5, region: 'Midwest' },
  { rank: 18, name: 'Missouri', code: 'MO', slug: 'missouri', population: 6196715, growth2020: 0.7, growth2010: 2.8, medianAge: 39.7, region: 'Midwest' },
  { rank: 19, name: 'Maryland', code: 'MD', slug: 'maryland', population: 6165129, growth2020: 1.7, growth2010: 7.1, medianAge: 39.7, region: 'South' },
  { rank: 20, name: 'Wisconsin', code: 'WI', slug: 'wisconsin', population: 5910955, growth2020: 1.1, growth2010: 3.6, medianAge: 40.5, region: 'Midwest' },
  { rank: 21, name: 'Colorado', code: 'CO', slug: 'colorado', population: 5877610, growth2020: 2.8, growth2010: 14.5, medianAge: 37.5, region: 'West' },
  { rank: 22, name: 'Minnesota', code: 'MN', slug: 'minnesota', population: 5737915, growth2020: 1.6, growth2010: 7.6, medianAge: 39.2, region: 'Midwest' },
  { rank: 23, name: 'South Carolina', code: 'SC', slug: 'south-carolina', population: 5373555, growth2020: 4.2, growth2010: 10.7, medianAge: 40.6, region: 'South' },
  { rank: 24, name: 'Alabama', code: 'AL', slug: 'alabama', population: 5108468, growth2020: 1.9, growth2010: 5.1, medianAge: 40.0, region: 'South' },
  { rank: 25, name: 'Louisiana', code: 'LA', slug: 'louisiana', population: 4573749, growth2020: -1.4, growth2010: 2.7, medianAge: 38.1, region: 'South' },
  { rank: 26, name: 'Kentucky', code: 'KY', slug: 'kentucky', population: 4526154, growth2020: 1.1, growth2010: 3.8, medianAge: 39.7, region: 'South' },
  { rank: 27, name: 'Oregon', code: 'OR', slug: 'oregon', population: 4233358, growth2020: 1.0, growth2010: 10.6, medianAge: 40.3, region: 'West' },
  { rank: 28, name: 'Oklahoma', code: 'OK', slug: 'oklahoma', population: 4053824, growth2020: 2.3, growth2010: 5.5, medianAge: 37.5, region: 'South' },
  { rank: 29, name: 'Connecticut', code: 'CT', slug: 'connecticut', population: 3617176, growth2020: 0.3, growth2010: 0.9, medianAge: 41.8, region: 'Northeast' },
  { rank: 30, name: 'Utah', code: 'UT', slug: 'utah', population: 3417734, growth2020: 5.4, growth2010: 18.4, medianAge: 32.3, region: 'West' },
  { rank: 31, name: 'Iowa', code: 'IA', slug: 'iowa', population: 3207004, growth2020: 1.5, growth2010: 4.7, medianAge: 39.1, region: 'Midwest' },
  { rank: 32, name: 'Nevada', code: 'NV', slug: 'nevada', population: 3194176, growth2020: 4.9, growth2010: 15.0, medianAge: 39.0, region: 'West' },
  { rank: 33, name: 'Arkansas', code: 'AR', slug: 'arkansas', population: 3067732, growth2020: 1.8, growth2010: 3.3, medianAge: 39.0, region: 'South' },
  { rank: 34, name: 'Mississippi', code: 'MS', slug: 'mississippi', population: 2940057, growth2020: -0.8, growth2010: 0.2, medianAge: 38.8, region: 'South' },
  { rank: 35, name: 'Kansas', code: 'KS', slug: 'kansas', population: 2940546, growth2020: 0.5, growth2010: 3.0, medianAge: 37.9, region: 'Midwest' },
  { rank: 36, name: 'New Mexico', code: 'NM', slug: 'new-mexico', population: 2114371, growth2020: 0.6, growth2010: 2.8, medianAge: 39.1, region: 'West' },
  { rank: 37, name: 'Nebraska', code: 'NE', slug: 'nebraska', population: 1978379, growth2020: 2.3, growth2010: 7.4, medianAge: 37.4, region: 'Midwest' },
  { rank: 38, name: 'Idaho', code: 'ID', slug: 'idaho', population: 1964726, growth2020: 6.0, growth2010: 17.3, medianAge: 37.5, region: 'West' },
  { rank: 39, name: 'West Virginia', code: 'WV', slug: 'west-virginia', population: 1770071, growth2020: -2.9, growth2010: -3.2, medianAge: 43.5, region: 'South' },
  { rank: 40, name: 'Hawaii', code: 'HI', slug: 'hawaii', population: 1435138, growth2020: -1.3, growth2010: 7.0, medianAge: 40.8, region: 'West' },
  { rank: 41, name: 'New Hampshire', code: 'NH', slug: 'new-hampshire', population: 1402054, growth2020: 2.1, growth2010: 4.6, medianAge: 43.3, region: 'Northeast' },
  { rank: 42, name: 'Maine', code: 'ME', slug: 'maine', population: 1395722, growth2020: 2.9, growth2010: 2.6, medianAge: 45.1, region: 'Northeast' },
  { rank: 43, name: 'Montana', code: 'MT', slug: 'montana', population: 1132812, growth2020: 4.7, growth2010: 9.7, medianAge: 40.7, region: 'West' },
  { rank: 44, name: 'Rhode Island', code: 'RI', slug: 'rhode-island', population: 1095610, growth2020: 0.7, growth2010: 4.3, medianAge: 41.4, region: 'Northeast' },
  { rank: 45, name: 'Delaware', code: 'DE', slug: 'delaware', population: 1031890, growth2020: 4.4, growth2010: 10.2, medianAge: 41.7, region: 'South' },
  { rank: 46, name: 'South Dakota', code: 'SD', slug: 'south-dakota', population: 919318, growth2020: 3.4, growth2010: 8.9, medianAge: 38.0, region: 'Midwest' },
  { rank: 47, name: 'North Dakota', code: 'ND', slug: 'north-dakota', population: 783926, growth2020: 2.3, growth2010: 15.8, medianAge: 36.4, region: 'Midwest' },
  { rank: 48, name: 'Alaska', code: 'AK', slug: 'alaska', population: 733406, growth2020: 0.0, growth2010: 3.3, medianAge: 35.6, region: 'West' },
  { rank: 49, name: 'Vermont', code: 'VT', slug: 'vermont', population: 647464, growth2020: 0.8, growth2010: 2.8, medianAge: 43.7, region: 'Northeast' },
  { rank: 50, name: 'Wyoming', code: 'WY', slug: 'wyoming', population: 584057, growth2020: 0.3, growth2010: 2.2, medianAge: 39.7, region: 'West' }
];

export default function USStatesPage() {
  const [sortBy, setSortBy] = useState<'rank' | 'name' | 'population' | 'growth2020' | 'medianAge'>('rank');
  const [filterRegion, setFilterRegion] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate statistics
  const totalPopulation = statesData.reduce((sum, state) => sum + state.population, 0);
  const avgGrowth = statesData.reduce((sum, state) => sum + state.growth2020, 0) / statesData.length;
  const avgMedianAge = statesData.reduce((sum, state) => sum + state.medianAge, 0) / statesData.length;

  // Filter and sort states
  let filteredStates = statesData.filter(state => {
    const matchesSearch = state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         state.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'All' || state.region === filterRegion;
    return matchesSearch && matchesRegion;
  });

  // Sort states
  filteredStates = [...filteredStates].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'population': return b.population - a.population;
      case 'growth2020': return b.growth2020 - a.growth2020;
      case 'medianAge': return b.medianAge - a.medianAge;
      default: return a.rank - b.rank;
    }
  });

  const getGrowthColor = (growth: number) => {
    if (growth > 3) return 'text-green-600 font-medium';
    if (growth > 0) return 'text-green-500';
    if (growth === 0) return 'text-gray-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            US States Demographics
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive population data for all 50 US states. Explore growth trends, 
            demographic patterns, and migration flows across America.
          </p>
        </div>

        {/* National Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">United States Overview</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {(totalPopulation / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600 mt-1">Total US Population</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {avgGrowth > 0 ? '+' : ''}{avgGrowth.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Avg State Growth (2020-24)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {avgMedianAge.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Average Median Age</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">50</div>
              <div className="text-sm text-gray-600 mt-1">States + DC</div>
            </div>
          </div>
        </div>

        {/* Featured Articles Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Analysis</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              href="/blog/15-fastest-growing-states-2024"
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition group"
            >
              <div className="h-3 bg-gradient-to-r from-green-500 to-emerald-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
                  15 Fastest Growing States in 2024
                </h3>
                <p className="text-gray-600 mb-4">
                  Texas adds 1,600 people daily. Florida gains a Miami every year. Idaho grows 5x the national average.
                </p>
                <span className="text-blue-600 font-medium text-sm group-hover:underline">
                  Read Analysis →
                </span>
              </div>
            </Link>
            
            <Link 
              href="/blog/10-states-people-fleeing-2024"
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition group"
            >
              <div className="h-3 bg-gradient-to-r from-red-500 to-pink-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
                  10 States People Are Fleeing
                </h3>
                <p className="text-gray-600 mb-4">
                  New York loses 500 people daily. California sees historic exodus. Illinois empties entire towns.
                </p>
                <span className="text-blue-600 font-medium text-sm group-hover:underline">
                  Read Analysis →
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search States
              </label>
              <input
                type="text"
                placeholder="Search by name or code..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Region
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
              >
                <option value="All">All Regions</option>
                <option value="Northeast">Northeast</option>
                <option value="South">South</option>
                <option value="Midwest">Midwest</option>
                <option value="West">West</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredStates.length} of {statesData.length} states
          </div>
        </div>

        {/* States Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <button
                      onClick={() => setSortBy('rank')}
                      className="flex items-center space-x-1 hover:text-blue-600 transition"
                    >
                      <span>Rank</span>
                      <span className={sortBy === 'rank' ? 'text-blue-600' : 'text-gray-400'}>
                        {sortBy === 'rank' ? '↓' : '⇅'}
                      </span>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <button
                      onClick={() => setSortBy('name')}
                      className="flex items-center space-x-1 hover:text-blue-600 transition"
                    >
                      <span>State</span>
                      <span className={sortBy === 'name' ? 'text-blue-600' : 'text-gray-400'}>
                        {sortBy === 'name' ? '↓' : '⇅'}
                      </span>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Region</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    <button
                      onClick={() => setSortBy('population')}
                      className="flex items-center space-x-1 hover:text-blue-600 transition ml-auto"
                    >
                      <span>2024 Population</span>
                      <span className={sortBy === 'population' ? 'text-blue-600' : 'text-gray-400'}>
                        {sortBy === 'population' ? '↓' : '⇅'}
                      </span>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    <button
                      onClick={() => setSortBy('growth2020')}
                      className="flex items-center space-x-1 hover:text-blue-600 transition ml-auto"
                    >
                      <span>Growth 2020-24</span>
                      <span className={sortBy === 'growth2020' ? 'text-blue-600' : 'text-gray-400'}>
                        {sortBy === 'growth2020' ? '↓' : '⇅'}
                      </span>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Growth 2010-20
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    <button
                      onClick={() => setSortBy('medianAge')}
                      className="flex items-center space-x-1 hover:text-blue-600 transition ml-auto"
                    >
                      <span>Median Age</span>
                      <span className={sortBy === 'medianAge' ? 'text-blue-600' : 'text-gray-400'}>
                        {sortBy === 'medianAge' ? '↓' : '⇅'}
                      </span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStates.map((state) => (
                  <tr key={state.code} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-500">{state.rank}</td>
                    <td className="px-6 py-4">
                      <Link href={`/us-states/${state.slug || state.name.toLowerCase().replace(/ /g, '-')}`} className="group">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{stateFlags[state.code] || '🏴'}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition">{state.name}</div>
                            <div className="text-xs text-gray-500">{state.code}</div>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{state.region}</td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900 font-medium">
                      {state.population.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <span className={getGrowthColor(state.growth2020)}>
                        {state.growth2020 > 0 ? '+' : ''}{state.growth2020.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <span className={getGrowthColor(state.growth2010)}>
                        {state.growth2010 > 0 ? '+' : ''}{state.growth2010.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900 font-medium">
                      {state.medianAge.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional Summary */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Regional Patterns</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">South</h3>
              <p className="text-sm text-gray-600">Fastest growing region with average +2.3% growth</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">West</h3>
              <p className="text-sm text-gray-600">Mixed patterns: CA declining, ID/UT booming</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Northeast</h3>
              <p className="text-sm text-gray-600">Losing population, highest median ages</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Midwest</h3>
              <p className="text-sm text-gray-600">Slow decline, industrial states struggling</p>
            </div>
          </div>
        </div>

        {/* Data Source Note */}
        <div className="mt-8 text-sm text-gray-600 text-center">
          Data sources: US Census Bureau 2024 estimates. Growth rates calculated from 2020 and 2010 census data.
        </div>
      </div>
    </div>
  );
}