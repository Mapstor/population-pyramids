'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { CountryMedianData } from '@/lib/median-age-data';

interface MedianAgeInteractiveToolProps {
  worldData: CountryMedianData;
  countries: CountryMedianData[];
  initialData: {
    oldestCountries: CountryMedianData[];
    youngestCountries: CountryMedianData[];
    usData: CountryMedianData | undefined;
  };
}

export default function MedianAgeInteractiveTool({ 
  worldData, 
  countries, 
  initialData 
}: MedianAgeInteractiveToolProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('world');
  const [compareCountry, setCompareCountry] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'medianAge', 
    direction: 'desc' 
  });

  // Get selected country data
  const selectedData = useMemo(() => {
    return selectedCountry === 'world' ? worldData : countries.find(c => c.slug === selectedCountry);
  }, [countries, selectedCountry, worldData]);

  const compareData = useMemo(() => {
    return compareCountry ? countries.find(c => c.slug === compareCountry) : null;
  }, [countries, compareCountry]);

  // Get global rank
  const getGlobalRank = (data: CountryMedianData) => {
    if (data.slug === 'world') return null;
    return countries.findIndex(c => c.slug === data.slug) + 1;
  };

  // Find similar countries
  const getSimilarCountries = (data: CountryMedianData) => {
    if (!data || data.slug === 'world') return [];
    
    return countries
      .filter(c => c.slug !== data.slug)
      .map(c => ({ ...c, diff: Math.abs(c.medianAge - data.medianAge) }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 3)
      .map(c => c.name);
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

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(c => c.category === categoryFilter);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof CountryMedianData];
        const bValue = b[sortConfig.key as keyof CountryMedianData];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        const aStr = String(aValue || '');
        const bStr = String(bValue || '');
        return sortConfig.direction === 'asc' 
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(bStr);
      });
    }

    return filtered;
  }, [countries, searchTerm, regionFilter, categoryFilter, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getAgeColor = (age: number): string => {
    if (age < 20) return 'text-green-600';
    if (age < 30) return 'text-lime-600';
    if (age < 40) return 'text-yellow-600';
    if (age < 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCategoryColor = (category: string): string => {
    switch(category) {
      case 'Very Young': return 'bg-green-100 text-green-800';
      case 'Young': return 'bg-lime-100 text-lime-800';
      case 'Middle-Aged': return 'bg-yellow-100 text-yellow-800';
      case 'Aging': return 'bg-orange-100 text-orange-800';
      case 'Aged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Interactive Tool */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">"How Old Is Your Country?" — Median Age Explorer</h2>
        
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

        {/* Results */}
        {selectedData && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Primary Country */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  {selectedData.flag} {selectedData.name}
                </h3>
                
                <div className={`text-5xl font-bold mb-2 ${getAgeColor(selectedData.medianAge)}`}>
                  {selectedData.medianAge.toFixed(1)}
                  <span className="text-2xl text-gray-600 ml-2">years</span>
                </div>
                
                {selectedData.slug !== 'world' && (
                  <>
                    <div className="text-gray-600 mb-2">
                      #{getGlobalRank(selectedData)} of {countries.length} {getGlobalRank(selectedData)! <= countries.length / 2 ? 'oldest' : 'youngest'}
                    </div>
                    <div className="text-gray-600 mb-4">
                      {getGlobalRank(selectedData)! <= countries.length / 2 
                        ? `Older than ${Math.round(((countries.length - getGlobalRank(selectedData)!) / countries.length) * 100)}% of countries`
                        : `Younger than ${Math.round((getGlobalRank(selectedData)! / countries.length) * 100)}% of countries`}
                    </div>
                  </>
                )}
                
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getCategoryColor(selectedData.category)}`}>
                  {selectedData.category}
                </div>
                
                {/* Age breakdown */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Youth (0-14)</span>
                      <span className="font-semibold">{selectedData.youthPercent.toFixed(1)}% — {(selectedData.youthCount / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${selectedData.youthPercent}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Working (15-64)</span>
                      <span className="font-semibold">{selectedData.workingPercent.toFixed(1)}% — {(selectedData.workingCount / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${selectedData.workingPercent}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Elderly (65+)</span>
                      <span className="font-semibold">{selectedData.elderlyPercent.toFixed(1)}% — {(selectedData.elderlyCount / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${selectedData.elderlyPercent}%` }}></div>
                    </div>
                  </div>
                </div>
                
                {selectedData.slug !== 'world' && getSimilarCountries(selectedData).length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-sm text-gray-600">Similar to: </span>
                    <span className="text-sm font-medium">{getSimilarCountries(selectedData).join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Compare Country */}
              {compareData && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    {compareData.flag} {compareData.name}
                  </h3>
                  
                  <div className={`text-5xl font-bold mb-2 ${getAgeColor(compareData.medianAge)}`}>
                    {compareData.medianAge.toFixed(1)}
                    <span className="text-2xl text-gray-600 ml-2">years</span>
                  </div>
                  
                  <div className="text-gray-600 mb-2">
                    #{getGlobalRank(compareData)} of {countries.length} {getGlobalRank(compareData)! <= countries.length / 2 ? 'oldest' : 'youngest'}
                  </div>
                  
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getCategoryColor(compareData.category)}`}>
                    {compareData.category}
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg mb-4">
                    <span className="font-semibold">
                      {compareData.name} is {Math.abs(compareData.medianAge - selectedData.medianAge).toFixed(1)} years {compareData.medianAge > selectedData.medianAge ? 'older' : 'younger'} than {selectedData.name}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Youth (0-14)</span>
                        <span className="font-semibold">{compareData.youthPercent.toFixed(1)}% — {(compareData.youthCount / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${compareData.youthPercent}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Working (15-64)</span>
                        <span className="font-semibold">{compareData.workingPercent.toFixed(1)}% — {(compareData.workingCount / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${compareData.workingPercent}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Elderly (65+)</span>
                        <span className="font-semibold">{compareData.elderlyPercent.toFixed(1)}% — {(compareData.elderlyCount / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${compareData.elderlyPercent}%` }}></div>
                      </div>
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
        <h2 className="text-2xl font-semibold mb-6">Filter & Sort Countries</h2>
        
        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
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
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Very Young">Very Young (&lt;20)</option>
            <option value="Young">Young (20-29)</option>
            <option value="Middle-Aged">Middle-Aged (30-39)</option>
            <option value="Aging">Aging (40-49)</option>
            <option value="Aged">Aged (50+)</option>
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
                  onClick={() => handleSort('medianAge')}
                >
                  Median Age {sortConfig.key === 'medianAge' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('youthPercent')}
                >
                  Youth % {sortConfig.key === 'youthPercent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('workingPercent')}
                >
                  Working % {sortConfig.key === 'workingPercent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('elderlyPercent')}
                >
                  Elderly % {sortConfig.key === 'elderlyPercent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-2 text-center">Category</th>
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
                  <td className={`px-4 py-2 text-right font-bold ${getAgeColor(country.medianAge)}`}>
                    {country.medianAge.toFixed(1)}
                  </td>
                  <td className="px-4 py-2 text-right">{country.youthPercent.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right">{country.workingPercent.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right">{country.elderlyPercent.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(country.category)}`}>
                      {country.category}
                    </span>
                  </td>
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