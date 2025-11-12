'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StateInfo {
  stateCode: string;
  stateName: string;
  slug: string;
  fips: string;
  region: string;
  population2024: number;
  population2000?: number;
  medianAge2024?: number;
  growthRate?: number;
}

export default function StatesListPage() {
  const [states, setStates] = useState<StateInfo[]>([]);
  const [sortField, setSortField] = useState<'stateName' | 'population2024' | 'growthRate'>('stateName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load states metadata
        const statesResponse = await fetch('/api/states-data');
        const statesData = await statesResponse.json();
        
        // Calculate growth rates
        const enrichedStates = await Promise.all(statesData.map(async (state: StateInfo) => {
          try {
            const dataResponse = await fetch(`/api/states-data/${state.slug}`);
            const stateData = await dataResponse.json();
            
            const year2024 = stateData.years['2024'];
            const year2000 = stateData.years['2000'];
            
            return {
              ...state,
              population2000: year2000?.totalPopulation || null,
              medianAge2024: year2024?.medianAge || null,
              growthRate: year2000 && year2024 
                ? ((year2024.totalPopulation - year2000.totalPopulation) / year2000.totalPopulation * 100)
                : null
            };
          } catch (error) {
            return state;
          }
        }));
        
        setStates(enrichedStates);
        setLoading(false);
      } catch (error) {
        console.error('Error loading states:', error);
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Filter states
  const filteredStates = states.filter(state => {
    const matchesSearch = state.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         state.stateCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || state.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  // Sort states
  const sortedStates = [...filteredStates].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (aVal === null || aVal === undefined) aVal = sortField === 'stateName' ? '' : 0;
    if (bVal === null || bVal === undefined) bVal = sortField === 'stateName' ? '' : 0;
    
    if (typeof aVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal);
    }
    
    return sortDirection === 'asc' 
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  const handleSort = (field: 'stateName' | 'population2024' | 'growthRate') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const regions = ['all', 'Northeast', 'Midwest', 'South', 'West'];
  const totalUSPopulation = states.reduce((sum, state) => sum + state.population2024, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading states data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <a href="/" className="hover:text-blue-600 transition">
                Home
              </a>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">US States</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Demographic Data for All 50 US States + DC
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Comprehensive demographic data with sorting, filtering, and search capabilities. 
            Click any state to view detailed population pyramids and trends from 2000-2024.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-3xl font-bold text-blue-600">{states.length}</p>
            <p className="text-sm text-gray-600">States & DC</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-3xl font-bold text-green-600">
              {(totalUSPopulation / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-gray-600">Total Population</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-3xl font-bold text-purple-600">
              {(() => {
                const avgGrowth = states.filter(s => s.growthRate).reduce((sum, s) => sum + (s.growthRate || 0), 0) / states.filter(s => s.growthRate).length;
                return avgGrowth > 0 ? '+' + avgGrowth.toFixed(1) + '%' : avgGrowth.toFixed(1) + '%';
              })()}
            </p>
            <p className="text-sm text-gray-600">Avg Growth 2000-2024</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-3xl font-bold text-orange-600">25</p>
            <p className="text-sm text-gray-600">Years of Data</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search States
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Region
              </label>
              <select
                id="region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('stateName')}
                      className="flex items-center gap-1 text-xs font-medium text-gray-900 uppercase tracking-wider hover:text-blue-600"
                    >
                      State
                      <svg className={`w-4 h-4 ${sortField === 'stateName' ? 'text-blue-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                        {sortField === 'stateName' && sortDirection === 'asc' ? (
                          <path d="M5 12l5-5 5 5H5z" />
                        ) : (
                          <path d="M15 8l-5 5-5-5h10z" />
                        )}
                      </svg>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Code
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Region
                    </span>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <button
                      onClick={() => handleSort('population2024')}
                      className="flex items-center gap-1 ml-auto text-xs font-medium text-gray-900 uppercase tracking-wider hover:text-blue-600"
                    >
                      2024 Population
                      <svg className={`w-4 h-4 ${sortField === 'population2024' ? 'text-blue-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                        {sortField === 'population2024' && sortDirection === 'asc' ? (
                          <path d="M5 12l5-5 5 5H5z" />
                        ) : (
                          <path d="M15 8l-5 5-5-5h10z" />
                        )}
                      </svg>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <span className="text-xs font-medium text-gray-900 uppercase tracking-wider">
                      2000 Population
                    </span>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <button
                      onClick={() => handleSort('growthRate')}
                      className="flex items-center gap-1 ml-auto text-xs font-medium text-gray-900 uppercase tracking-wider hover:text-blue-600"
                    >
                      Growth Since 2000
                      <svg className={`w-4 h-4 ${sortField === 'growthRate' ? 'text-blue-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                        {sortField === 'growthRate' && sortDirection === 'asc' ? (
                          <path d="M5 12l5-5 5 5H5z" />
                        ) : (
                          <path d="M15 8l-5 5-5-5h10z" />
                        )}
                      </svg>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <span className="text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Median Age
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedStates.map((state, index) => (
                  <tr key={state.slug} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        href={`/states/${state.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {state.stateName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {state.stateCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        state.region === 'Northeast' ? 'bg-blue-100 text-blue-700' :
                        state.region === 'Midwest' ? 'bg-green-100 text-green-700' :
                        state.region === 'South' ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {state.region}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                      {state.population2024.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600">
                      {state.population2000 ? state.population2000.toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {state.growthRate !== null && state.growthRate !== undefined ? (
                        <span className={`font-medium ${
                          state.growthRate > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {state.growthRate > 0 ? '+' : ''}{state.growthRate.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600">
                      {state.medianAge2024 ? state.medianAge2024.toFixed(1) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {sortedStates.length} of {states.length} states
        </div>
      </div>
    </div>
  );
}