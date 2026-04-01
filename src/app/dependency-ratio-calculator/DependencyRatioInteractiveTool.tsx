'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { CountryDependencyData } from '@/lib/dependency-ratio-data';

interface DependencyRatioInteractiveToolProps {
  worldData: CountryDependencyData;
  countries: CountryDependencyData[];
  initialData: {
    highestRatios: CountryDependencyData[];
    lowestRatios: CountryDependencyData[];
    usData: CountryDependencyData | undefined;
  };
}

export default function DependencyRatioInteractiveTool({ 
  worldData, 
  countries, 
  initialData 
}: DependencyRatioInteractiveToolProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('world');
  const [compareCountry, setCompareCountry] = useState<string>('');
  const [calculatorMode, setCalculatorMode] = useState<'country' | 'custom' | 'compare'>('country');
  
  // Custom calculator state
  const [customYouth, setCustomYouth] = useState<string>('');
  const [customWorking, setCustomWorking] = useState<string>('');
  const [customElderly, setCustomElderly] = useState<string>('');
  
  // Table filters
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'totalDependencyRatio', 
    direction: 'desc' 
  });

  // Get selected country data
  const selectedData = useMemo(() => {
    return selectedCountry === 'world' ? worldData : countries.find(c => c.slug === selectedCountry);
  }, [countries, selectedCountry, worldData]);

  const compareData = useMemo(() => {
    return compareCountry ? countries.find(c => c.slug === compareCountry) : null;
  }, [countries, compareCountry]);

  // Custom calculation
  const customCalculations = useMemo(() => {
    const youth = parseFloat(customYouth) || 0;
    const working = parseFloat(customWorking) || 0;
    const elderly = parseFloat(customElderly) || 0;
    
    if (working === 0) return null;
    
    const totalPop = youth + working + elderly;
    const totalDR = ((youth + elderly) / working) * 100;
    const youthDR = (youth / working) * 100;
    const oldAgeDR = (elderly / working) * 100;
    const supportRatio = working / elderly;
    
    return {
      totalDR: totalDR.toFixed(1),
      youthDR: youthDR.toFixed(1),
      oldAgeDR: oldAgeDR.toFixed(1),
      youthPercent: ((youth / totalPop) * 100).toFixed(1),
      workingPercent: ((working / totalPop) * 100).toFixed(1),
      elderlyPercent: ((elderly / totalPop) * 100).toFixed(1),
      supportRatio: supportRatio.toFixed(1),
      interpretation: getInterpretation(totalDR)
    };
  }, [customYouth, customWorking, customElderly]);

  const getInterpretation = (ratio: number): string => {
    if (ratio < 40) return 'Very favorable - Strong demographic dividend';
    if (ratio < 50) return 'Favorable - Good workforce capacity';
    if (ratio < 60) return 'Moderate - Balanced demographics';
    if (ratio < 70) return 'Challenging - High support burden';
    return 'Very challenging - Severe economic strain';
  };

  const getRatioColor = (ratio: number): string => {
    if (ratio > 80) return 'text-red-600';
    if (ratio > 70) return 'text-orange-600';
    if (ratio > 50) return 'text-yellow-600';
    if (ratio > 40) return 'text-blue-600';
    return 'text-green-600';
  };

  const getRankSuffix = (rank: number): string => {
    const suffix = ['th', 'st', 'nd', 'rd'];
    const mod = rank % 100;
    return suffix[(mod - 20) % 10] || suffix[mod] || suffix[0];
  };

  // Get global rank
  const getGlobalRank = (data: CountryDependencyData) => {
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
        const aValue = a[sortConfig.key as keyof CountryDependencyData];
        const bValue = b[sortConfig.key as keyof CountryDependencyData];
        
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

  return (
    <>
      {/* Calculator Mode Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Dependency Ratio Calculator & Country Explorer</h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setCalculatorMode('country')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              calculatorMode === 'country'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className={`font-semibold mb-1 ${calculatorMode === 'country' ? 'text-blue-700' : 'text-gray-900'}`}>
              📊 Country Lookup
            </div>
            <div className="text-xs text-gray-600">View dependency ratios for any of 195 countries</div>
          </button>
          <button
            onClick={() => setCalculatorMode('custom')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              calculatorMode === 'custom'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className={`font-semibold mb-1 ${calculatorMode === 'custom' ? 'text-blue-700' : 'text-gray-900'}`}>
              🧮 Custom Calculator
            </div>
            <div className="text-xs text-gray-600">Input your own population data to calculate ratios</div>
          </button>
          <button
            onClick={() => setCalculatorMode('compare')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              calculatorMode === 'compare'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className={`font-semibold mb-1 ${calculatorMode === 'compare' ? 'text-blue-700' : 'text-gray-900'}`}>
              🔄 Compare Countries
            </div>
            <div className="text-xs text-gray-600">Side-by-side comparison of two countries</div>
          </button>
        </div>

        {/* Country Lookup Mode */}
        {calculatorMode === 'country' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌍 Select Country
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

            {selectedData && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  {selectedData.flag} {selectedData.name}
                  {selectedData.slug !== 'world' && (
                    <span className="text-sm text-gray-500">
                      (#{getGlobalRank(selectedData)}{getRankSuffix(getGlobalRank(selectedData)!)} of {countries.length})
                    </span>
                  )}
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Total Dependency Ratio</div>
                    <div className={`text-3xl font-bold ${getRatioColor(selectedData.totalDependencyRatio)}`}>
                      {selectedData.totalDependencyRatio.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getInterpretation(selectedData.totalDependencyRatio)}
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Youth Dependency</div>
                    <div className="text-3xl font-bold text-green-600">
                      {selectedData.youthDependencyRatio.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Children per 100 workers</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Old-Age Dependency</div>
                    <div className="text-3xl font-bold text-orange-600">
                      {selectedData.oldAgeDependencyRatio.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Elderly per 100 workers</div>
                  </div>
                </div>

                {/* Population Breakdown */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-2xl">👶</div>
                    <div className="font-semibold text-green-600">{selectedData.youthPercentage.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Youth (0-14)</div>
                    <div className="text-xs text-gray-500">{(selectedData.youthPopulation / 1000000).toFixed(1)}M people</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-2xl">💼</div>
                    <div className="font-semibold text-blue-600">{selectedData.workingAgePercentage.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Working-Age (15-64)</div>
                    <div className="text-xs text-gray-500">{(selectedData.workingAgePopulation / 1000000).toFixed(1)}M people</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-2xl">👴</div>
                    <div className="font-semibold text-orange-600">{selectedData.elderlyPercentage.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Elderly (65+)</div>
                    <div className="text-xs text-gray-500">{(selectedData.elderlyPopulation / 1000000).toFixed(1)}M people</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Economic Impact:</strong> Each working-age person supports {(selectedData.totalDependencyRatio / 100).toFixed(2)} dependents. 
                    {selectedData.potentialSupportRatio.toFixed(1)} workers are available for every elderly person needing support.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom Calculator Mode */}
        {calculatorMode === 'custom' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👶 Youth Population (Ages 0-14)
                </label>
                <input
                  type="number"
                  value={customYouth}
                  onChange={(e) => setCustomYouth(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-medium"
                  placeholder="e.g., 15000000"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Children requiring education, healthcare, and family support
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💼 Working-Age Population (Ages 15-64)
                </label>
                <input
                  type="number"
                  value={customWorking}
                  onChange={(e) => setCustomWorking(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                  placeholder="e.g., 65000000"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Economically active population supporting dependents
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👴 Elderly Population (Ages 65+)
                </label>
                <input
                  type="number"
                  value={customElderly}
                  onChange={(e) => setCustomElderly(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg font-medium"
                  placeholder="e.g., 10000000"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Retirees requiring pensions, healthcare, and social support
                </p>
              </div>
            </div>

            {customCalculations && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-lg mb-4">📊 Calculated Dependency Ratios</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Total Dependency Ratio</div>
                    <div className={`text-3xl font-bold ${getRatioColor(parseFloat(customCalculations.totalDR))}`}>
                      {customCalculations.totalDR}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{customCalculations.interpretation}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Youth Dependency</div>
                    <div className="text-3xl font-bold text-green-600">{customCalculations.youthDR}</div>
                    <div className="text-xs text-gray-500 mt-1">Children per 100 workers</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Old-Age Dependency</div>
                    <div className="text-3xl font-bold text-orange-600">{customCalculations.oldAgeDR}</div>
                    <div className="text-xs text-gray-500 mt-1">Elderly per 100 workers</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Population Structure</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>Youth: {customCalculations.youthPercent}%</div>
                    <div>Working-Age: {customCalculations.workingPercent}%</div>
                    <div>Elderly: {customCalculations.elderlyPercent}%</div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Each worker supports {customCalculations.totalDR} dependents. 
                    There are {customCalculations.supportRatio} workers per elderly person.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Compare Mode */}
        {calculatorMode === 'compare' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🇦 First Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select first country...</option>
                  {countries.map(country => (
                    <option key={country.slug} value={country.slug}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🇧 Second Country
                </label>
                <select
                  value={compareCountry}
                  onChange={(e) => setCompareCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select second country...</option>
                  {countries.map(country => (
                    <option key={country.slug} value={country.slug}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedData && compareData && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* First Country */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    {selectedData.flag} {selectedData.name}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600">Total Dependency Ratio</div>
                      <div className={`text-2xl font-bold ${getRatioColor(selectedData.totalDependencyRatio)}`}>
                        {selectedData.totalDependencyRatio.toFixed(1)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Youth DR</div>
                        <div className="font-semibold text-green-600">{selectedData.youthDependencyRatio.toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Old-Age DR</div>
                        <div className="font-semibold text-orange-600">{selectedData.oldAgeDependencyRatio.toFixed(1)}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Working-Age: {selectedData.workingAgePercentage.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Second Country */}
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    {compareData.flag} {compareData.name}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600">Total Dependency Ratio</div>
                      <div className={`text-2xl font-bold ${getRatioColor(compareData.totalDependencyRatio)}`}>
                        {compareData.totalDependencyRatio.toFixed(1)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Youth DR</div>
                        <div className="font-semibold text-green-600">{compareData.youthDependencyRatio.toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Old-Age DR</div>
                        <div className="font-semibold text-orange-600">{compareData.oldAgeDependencyRatio.toFixed(1)}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Working-Age: {compareData.workingAgePercentage.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Comparison Summary */}
                <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold mb-3">Comparison Summary</h4>
                  <div className="text-sm space-y-2">
                    <div>
                      <strong>Total Dependency:</strong> {compareData.name} has {Math.abs(compareData.totalDependencyRatio - selectedData.totalDependencyRatio).toFixed(1)} {compareData.totalDependencyRatio > selectedData.totalDependencyRatio ? 'more' : 'fewer'} dependents per 100 workers
                    </div>
                    <div>
                      <strong>Workforce Capacity:</strong> {compareData.workingAgePercentage > selectedData.workingAgePercentage ? compareData.name : selectedData.name} has a stronger workforce ({Math.max(compareData.workingAgePercentage, selectedData.workingAgePercentage).toFixed(1)}% vs {Math.min(compareData.workingAgePercentage, selectedData.workingAgePercentage).toFixed(1)}%)
                    </div>
                    <div>
                      <strong>Age Structure:</strong> {compareData.youthDependencyRatio > selectedData.youthDependencyRatio ? compareData.name : selectedData.name} is more youth-focused, {compareData.oldAgeDependencyRatio > selectedData.oldAgeDependencyRatio ? compareData.name : selectedData.name} faces greater aging pressure
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Data Table with Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Filter & Sort Countries by Dependency Ratio</h2>
        
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
                  onClick={() => handleSort('totalDependencyRatio')}
                >
                  Total DR {sortConfig.key === 'totalDependencyRatio' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('youthDependencyRatio')}
                >
                  Youth DR {sortConfig.key === 'youthDependencyRatio' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('oldAgeDependencyRatio')}
                >
                  Old-Age DR {sortConfig.key === 'oldAgeDependencyRatio' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('workingAgePercentage')}
                >
                  Working % {sortConfig.key === 'workingAgePercentage' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData.slice(0, 50).map((country, index) => (
                <tr 
                  key={country.slug}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => {setSelectedCountry(country.slug); setCalculatorMode('country');}}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium">
                    {country.flag} <Link href={`/${country.slug}`} className="hover:text-blue-600">{country.name}</Link>
                  </td>
                  <td className={`px-4 py-2 text-right font-semibold ${getRatioColor(country.totalDependencyRatio)}`}>
                    {country.totalDependencyRatio.toFixed(1)}
                  </td>
                  <td className="px-4 py-2 text-right text-green-700">{country.youthDependencyRatio.toFixed(1)}</td>
                  <td className="px-4 py-2 text-right text-orange-700">{country.oldAgeDependencyRatio.toFixed(1)}</td>
                  <td className="px-4 py-2 text-right text-blue-700">{country.workingAgePercentage.toFixed(1)}%</td>
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