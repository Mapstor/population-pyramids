'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Country {
  code: string;
  name: string;
  slug: string;
  flag: string;
  population2024: number;
  population2000: number;
  population1990: number;
  populationChange: number;
  populationChangePercent: number;
  medianAge2024: number;
  medianAge2000: number;
  medianAgeChange: number;
  youthPercent2024: number;
  elderlyPercent2024: number;
  dependencyRatio2024: number;
  region: string;
}

interface SortConfig {
  key: keyof Country;
  direction: 'asc' | 'desc';
}

interface SortableCountryTableProps {
  countries: Country[];
}

export default function SortableCountryTable({ countries }: SortableCountryTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'population2024', 
    direction: 'desc' 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');

  // Get unique regions
  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(countries.map(c => c.region))).sort();
    return ['All', ...uniqueRegions];
  }, [countries]);

  // Filter countries based on search and region
  const filteredCountries = useMemo(() => {
    return countries.filter(country => {
      const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           country.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = regionFilter === 'All' || country.region === regionFilter;
      return matchesSearch && matchesRegion;
    });
  }, [countries, searchTerm, regionFilter]);

  // Sort countries
  const sortedCountries = useMemo(() => {
    const sorted = [...filteredCountries].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });
    
    return sorted;
  }, [filteredCountries, sortConfig]);

  const handleSort = (key: keyof Country) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getSortIcon = (columnKey: keyof Country) => {
    if (sortConfig.key !== columnKey) {
      return <span className="text-gray-400">⇅</span>;
    }
    return sortConfig.direction === 'asc' ? 
      <span className="text-blue-600">↑</span> : 
      <span className="text-blue-600">↓</span>;
  };

  const formatNumber = (num: number, decimals = 0): string => {
    if (num === 0) return '—';
    if (num > 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num > 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num > 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(Math.min(decimals, 2));
  };

  const formatPercent = (num: number): string => {
    if (num === 0) return '—';
    return `${num.toFixed(2)}%`;
  };

  const formatChange = (num: number): string => {
    if (num === 0) return '—';
    const formatted = formatNumber(Math.abs(num));
    return num > 0 ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Countries
            </label>
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Region
            </label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing {sortedCountries.length} of {countries.length} countries
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                <button 
                  onClick={() => handleSort('population2024')}
                  className="flex items-center space-x-1 hover:text-blue-600 transition"
                >
                  <span>Rank</span>
                  {sortConfig.key === 'population2024' && getSortIcon('population2024')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                <button 
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-blue-600 transition"
                >
                  <span>Country</span>
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                <button 
                  onClick={() => handleSort('region')}
                  className="flex items-center space-x-1 hover:text-blue-600 transition"
                >
                  <span>Region</span>
                  {getSortIcon('region')}
                </button>
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                <button 
                  onClick={() => handleSort('population2024')}
                  className="flex items-center space-x-1 hover:text-blue-600 transition ml-auto"
                >
                  <span>2024 Population</span>
                  {getSortIcon('population2024')}
                </button>
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                <button 
                  onClick={() => handleSort('populationChangePercent')}
                  className="flex items-center space-x-1 hover:text-blue-600 transition ml-auto"
                >
                  <span>Growth Since 2000</span>
                  {getSortIcon('populationChangePercent')}
                </button>
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                <button 
                  onClick={() => handleSort('medianAge2024')}
                  className="flex items-center space-x-1 hover:text-blue-600 transition ml-auto"
                >
                  <span>Median Age</span>
                  {getSortIcon('medianAge2024')}
                </button>
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                <button 
                  onClick={() => handleSort('youthPercent2024')}
                  className="flex items-center space-x-1 hover:text-blue-600 transition ml-auto"
                >
                  <span>Youth %</span>
                  {getSortIcon('youthPercent2024')}
                </button>
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                <button 
                  onClick={() => handleSort('elderlyPercent2024')}
                  className="flex items-center space-x-1 hover:text-blue-600 transition ml-auto"
                >
                  <span>Elderly %</span>
                  {getSortIcon('elderlyPercent2024')}
                </button>
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                <button 
                  onClick={() => handleSort('dependencyRatio2024')}
                  className="flex items-center space-x-1 hover:text-blue-600 transition ml-auto"
                >
                  <span>Dependency</span>
                  {getSortIcon('dependencyRatio2024')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedCountries.map((country, index) => (
              <tr key={country.code} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <Link 
                    href={`/${country.slug}-population-pyramid`}
                    className="flex items-center space-x-3 group"
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition">
                        {country.name}
                      </div>
                      <div className="text-xs text-gray-500">{country.code}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {country.region}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-900 font-medium">
                  {formatNumber(country.population2024)}
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  {country.populationChangePercent > 0 ? (
                    <span className="text-green-600 font-medium">
                      +{formatPercent(country.populationChangePercent)}
                    </span>
                  ) : country.populationChangePercent < 0 ? (
                    <span className="text-red-600 font-medium">
                      {formatPercent(country.populationChangePercent)}
                    </span>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-900 font-medium">
                  {country.medianAge2024 > 0 ? `${country.medianAge2024.toFixed(2)}y` : '—'}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatPercent(country.youthPercent2024)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatPercent(country.elderlyPercent2024)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {country.dependencyRatio2024 > 0 ? `${country.dependencyRatio2024.toFixed(2)}%` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}