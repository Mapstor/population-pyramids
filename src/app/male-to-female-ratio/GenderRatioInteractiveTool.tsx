'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { CountryGenderData } from '@/lib/gender-ratio-data';

interface GenderRatioInteractiveToolProps {
  worldData: CountryGenderData;
  countries: CountryGenderData[];
  initialData: {
    highestRatioCountries: CountryGenderData[];
    lowestRatioCountries: CountryGenderData[];
    usData: CountryGenderData | undefined;
  };
}

export default function GenderRatioInteractiveTool({ 
  worldData, 
  countries, 
  initialData 
}: GenderRatioInteractiveToolProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('world');
  const [compareCountry, setCompareCountry] = useState<string>('');
  const [ageFilter, setAgeFilter] = useState<'all' | 'birth' | 'working' | 'elderly'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'ratio', 
    direction: 'desc' 
  });

  // Get selected country data
  const selectedData = useMemo(() => {
    return selectedCountry === 'world' ? worldData : countries.find(c => c.slug === selectedCountry);
  }, [countries, selectedCountry, worldData]);

  const compareData = useMemo(() => {
    return compareCountry ? countries.find(c => c.slug === compareCountry) : null;
  }, [countries, compareCountry]);

  // Get ratio based on age filter
  const getRatio = (data: CountryGenderData) => {
    switch (ageFilter) {
      case 'birth': return data.atBirthRatio;
      case 'working': return data.workingAgeRatio;
      case 'elderly': return data.elderlyRatio;
      default: return data.ratio;
    }
  };

  // Get global rank
  const getGlobalRank = (data: CountryGenderData) => {
    if (data.slug === 'world') return null;
    return countries.findIndex(c => c.slug === data.slug) + 1;
  };

  // Get unique regions
  const regions = useMemo(() => {
    const uniqueRegions = new Set(countries.map(c => c.region));
    return Array.from(uniqueRegions).filter(r => r !== 'Unknown').sort();
  }, [countries]);

  // Filter and sort table data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...countries];
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (regionFilter !== 'all') {
      filtered = filtered.filter(c => c.region === regionFilter);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof CountryGenderData];
        const bValue = b[sortConfig.key as keyof CountryGenderData];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        const aStr = String(aValue || '');
        const bStr = String(bValue || '');
        return sortConfig.direction === 'asc' 
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return filtered;
  }, [countries, searchTerm, regionFilter, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getRatioColor = (ratio: number): string => {
    if (ratio > 110) return 'text-blue-600';
    if (ratio > 103) return 'text-blue-500';
    if (ratio > 97) return 'text-gray-900';
    if (ratio > 90) return 'text-pink-500';
    return 'text-pink-600';
  };

  const getBalanceDescription = (ratio: number): string => {
    if (ratio > 110) return 'Heavily Male-Skewed';
    if (ratio > 103) return 'Male Majority';
    if (ratio > 97) return 'Balanced';
    if (ratio > 90) return 'Female Majority';
    return 'Heavily Female-Skewed';
  };

  return (
    <>
      {/* Interactive Tool */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Gender Ratio Explorer & Country Comparison</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="world">🌍 World</option>
              {countries.map(country => (
                <option key={country.slug} value={country.slug}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compare with (optional)
            </label>
            <select
              value={compareCountry}
              onChange={(e) => setCompareCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None</option>
              {countries.map(country => (
                <option key={country.slug} value={country.slug}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Age Group Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setAgeFilter('all')}
            className={`px-4 py-2 rounded-full ${
              ageFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Ages
          </button>
          <button
            onClick={() => setAgeFilter('birth')}
            className={`px-4 py-2 rounded-full ${
              ageFilter === 'birth' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            At Birth (0-4)
          </button>
          <button
            onClick={() => setAgeFilter('working')}
            className={`px-4 py-2 rounded-full ${
              ageFilter === 'working' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Working Age (15-64)
          </button>
          <button
            onClick={() => setAgeFilter('elderly')}
            className={`px-4 py-2 rounded-full ${
              ageFilter === 'elderly' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Elderly (65+)
          </button>
        </div>

        {/* Results */}
        {selectedData && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Primary Country */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  {selectedData.flag} {selectedData.name}
                  {selectedData.slug !== 'world' && (
                    <span className="text-sm text-gray-500">
                      (Rank #{getGlobalRank(selectedData)} of {countries.length})
                    </span>
                  )}
                </h3>
                
                <div className={`text-4xl font-bold mb-2 ${getRatioColor(getRatio(selectedData))}`}>
                  {getRatio(selectedData).toFixed(1)}
                  <span className="text-xl text-gray-600 ml-2">per 100</span>
                </div>
                <div className="text-gray-600 mb-2">males per 100 females</div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${
                  getRatio(selectedData) > 110 ? 'bg-blue-100 text-blue-800' :
                  getRatio(selectedData) > 103 ? 'bg-blue-50 text-blue-700' :
                  getRatio(selectedData) > 97 ? 'bg-gray-100 text-gray-800' :
                  getRatio(selectedData) > 90 ? 'bg-pink-50 text-pink-700' :
                  'bg-pink-100 text-pink-800'
                }`}>
                  {getBalanceDescription(getRatio(selectedData))}
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  <div>Male population: {selectedData.male.toLocaleString()}</div>
                  <div>Female population: {selectedData.female.toLocaleString()}</div>
                  <div>
                    Difference: {Math.abs(selectedData.male - selectedData.female).toLocaleString()} more {selectedData.male > selectedData.female ? 'males' : 'females'}
                  </div>
                </div>
                
                {/* Visual Bar */}
                <div className="mb-4">
                  <div className="flex h-8 rounded-lg overflow-hidden">
                    <div 
                      className="bg-blue-500 flex items-center justify-center text-white text-sm font-medium"
                      style={{ width: `${selectedData.malePercent}%` }}
                    >
                      {selectedData.malePercent.toFixed(1)}%
                    </div>
                    <div 
                      className="bg-pink-500 flex items-center justify-center text-white text-sm font-medium"
                      style={{ width: `${selectedData.femalePercent}%` }}
                    >
                      {selectedData.femalePercent.toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Males</span>
                    <span>Females</span>
                  </div>
                </div>

                {/* Age-specific breakdown */}
                <div className="space-y-2">
                  <div className="text-xs text-gray-600 font-medium">Age Group Breakdown:</div>
                  <div className="flex items-center justify-between text-sm">
                    <span>At Birth (0-4):</span>
                    <span className={`font-semibold ${getRatioColor(selectedData.atBirthRatio)}`}>
                      {selectedData.atBirthRatio.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Working Age (15-64):</span>
                    <span className={`font-semibold ${getRatioColor(selectedData.workingAgeRatio)}`}>
                      {selectedData.workingAgeRatio.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Elderly (65+):</span>
                    <span className={`font-semibold ${getRatioColor(selectedData.elderlyRatio)}`}>
                      {selectedData.elderlyRatio.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Compare Country */}
              {compareData && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    {compareData.flag} {compareData.name}
                    <span className="text-sm text-gray-500">
                      (Rank #{getGlobalRank(compareData)} of {countries.length})
                    </span>
                  </h3>
                  
                  <div className={`text-4xl font-bold mb-2 ${getRatioColor(getRatio(compareData))}`}>
                    {getRatio(compareData).toFixed(1)}
                    <span className="text-xl text-gray-600 ml-2">per 100</span>
                  </div>
                  <div className="text-gray-600 mb-2">males per 100 females</div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg mb-4">
                    <span className="font-semibold">
                      {compareData.name} has {Math.abs(getRatio(compareData) - getRatio(selectedData)).toFixed(1)} {getRatio(compareData) > getRatio(selectedData) ? 'more' : 'fewer'} males per 100 females than {selectedData.name}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div>Male population: {compareData.male.toLocaleString()}</div>
                    <div>Female population: {compareData.female.toLocaleString()}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex h-8 rounded-lg overflow-hidden">
                      <div 
                        className="bg-blue-500 flex items-center justify-center text-white text-sm font-medium"
                        style={{ width: `${compareData.malePercent}%` }}
                      >
                        {compareData.malePercent.toFixed(1)}%
                      </div>
                      <div 
                        className="bg-pink-500 flex items-center justify-center text-white text-sm font-medium"
                        style={{ width: `${compareData.femalePercent}%` }}
                      >
                        {compareData.femalePercent.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-gray-600 font-medium">Age Group Breakdown:</div>
                    <div className="flex items-center justify-between text-sm">
                      <span>At Birth (0-4):</span>
                      <span className={`font-semibold ${getRatioColor(compareData.atBirthRatio)}`}>
                        {compareData.atBirthRatio.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Working Age (15-64):</span>
                      <span className={`font-semibold ${getRatioColor(compareData.workingAgeRatio)}`}>
                        {compareData.workingAgeRatio.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Elderly (65+):</span>
                      <span className={`font-semibold ${getRatioColor(compareData.elderlyRatio)}`}>
                        {compareData.elderlyRatio.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Data Table with Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Filter & Sort Gender Ratios</h2>
        
        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Rank</th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Country {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('ratio')}
                >
                  Sex Ratio {sortConfig.key === 'ratio' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('malePercent')}
                >
                  Male % {sortConfig.key === 'malePercent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('femalePercent')}
                >
                  Female % {sortConfig.key === 'femalePercent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('atBirthRatio')}
                >
                  At Birth {sortConfig.key === 'atBirthRatio' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('elderlyRatio')}
                >
                  Elderly {sortConfig.key === 'elderlyRatio' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData.slice(0, 50).map((country, index) => (
                <tr 
                  key={country.slug}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedCountry(country.slug)}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium">
                    {country.flag} <Link href={`/${country.slug}`} className="hover:text-blue-600">{country.name}</Link>
                  </td>
                  <td className={`px-4 py-2 text-right font-semibold ${getRatioColor(country.ratio)}`}>
                    {country.ratio.toFixed(1)}
                  </td>
                  <td className="px-4 py-2 text-right">{country.malePercent.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right">{country.femalePercent.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right">{country.atBirthRatio.toFixed(1)}</td>
                  <td className="px-4 py-2 text-right">{country.elderlyRatio.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAndSortedData.length > 50 && (
            <div className="text-center py-4 text-gray-500">
              Showing 50 of {filteredAndSortedData.length} results
            </div>
          )}
        </div>
      </div>
    </>
  );
}