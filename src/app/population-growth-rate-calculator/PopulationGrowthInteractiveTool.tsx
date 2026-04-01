'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { CountryGrowthData } from '@/lib/growth-rate-data';

interface PopulationGrowthInteractiveToolProps {
  worldData: CountryGrowthData;
  countries: CountryGrowthData[];
  initialData: {
    fastestGrowing: CountryGrowthData[];
    slowestGrowing: CountryGrowthData[];
    usData: CountryGrowthData | undefined;
  };
}

export default function PopulationGrowthInteractiveTool({ 
  worldData, 
  countries, 
  initialData 
}: PopulationGrowthInteractiveToolProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('world');
  const [compareCountry, setCompareCountry] = useState<string>('');
  const [calculatorMode, setCalculatorMode] = useState<'country' | 'custom' | 'projection'>('country');
  
  // Custom calculator state
  const [startPop, setStartPop] = useState<string>('1000000');
  const [endPop, setEndPop] = useState<string>('1500000');
  const [numYears, setNumYears] = useState<string>('10');
  
  // Projection calculator state
  const [currentPop, setCurrentPop] = useState<string>('1000000');
  const [growthRate, setGrowthRate] = useState<string>('2.5');
  const [projectionYears, setProjectionYears] = useState<string>('25');
  
  // Table filters
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'annualGrowthRate', 
    direction: 'desc' 
  });

  // Get selected country data
  const selectedData = useMemo(() => {
    return selectedCountry === 'world' ? worldData : countries.find(c => c.slug === selectedCountry);
  }, [countries, selectedCountry, worldData]);

  const compareData = useMemo(() => {
    return compareCountry ? countries.find(c => c.slug === compareCountry) : null;
  }, [countries, compareCountry]);

  const getInterpretation = (rate: number): string => {
    if (rate > 3) return 'Very rapid growth - doubling in ~23 years';
    if (rate > 2) return 'Rapid growth - doubling in ~35 years';
    if (rate > 1) return 'Moderate growth - doubling in ~70 years';
    if (rate > 0) return 'Slow growth - doubling in 100+ years';
    if (rate > -1) return 'Slight decline - manageable';
    return 'Rapid decline - concerning trend';
  };

  // Custom calculation
  const customCalculations = useMemo(() => {
    const start = parseFloat(startPop) || 0;
    const end = parseFloat(endPop) || 0;
    const years = parseFloat(numYears) || 0;
    
    if (start > 0 && end > 0 && years > 0) {
      const annualRate = (Math.pow(end / start, 1 / years) - 1) * 100;
      const totalChange = end - start;
      const totalPercent = ((end - start) / start) * 100;
      const doublingTime = annualRate > 0 ? 70 / annualRate : null;
      
      return {
        annualRate: annualRate.toFixed(3),
        totalChange: totalChange.toLocaleString(),
        totalPercent: totalPercent.toFixed(1),
        doublingTime: doublingTime ? doublingTime.toFixed(1) : null,
        interpretation: getInterpretation(annualRate)
      };
    }
    return null;
  }, [startPop, endPop, numYears]);

  // Projection calculation
  const projectionResults = useMemo(() => {
    const current = parseFloat(currentPop) || 0;
    const rate = parseFloat(growthRate) / 100 || 0;
    const years = parseFloat(projectionYears) || 0;
    
    if (current > 0 && years > 0) {
      const projected = current * Math.pow(1 + rate, years);
      const added = projected - current;
      const doublingTime = rate > 0 ? 70 / (rate * 100) : null;
      
      return {
        projected: Math.round(projected).toLocaleString(),
        added: Math.round(added).toLocaleString(),
        doublingTime: doublingTime ? doublingTime.toFixed(1) : null,
        interpretation: getInterpretation(rate * 100)
      };
    }
    return null;
  }, [currentPop, growthRate, projectionYears]);

  const getGrowthColor = (rate: number): string => {
    if (rate > 3) return 'text-green-600';
    if (rate > 2) return 'text-green-500';
    if (rate > 1) return 'text-blue-600';
    if (rate > 0) return 'text-gray-700';
    if (rate > -1) return 'text-orange-600';
    return 'text-red-600';
  };

  // Get global rank
  const getGlobalRank = (data: CountryGrowthData) => {
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

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof CountryGrowthData];
        const bValue = b[sortConfig.key as keyof CountryGrowthData];
        
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
  }, [countries, searchTerm, regionFilter, statusFilter, sortConfig]);

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
        <h2 className="text-2xl font-semibold mb-6">Population Growth Calculator & Country Explorer</h2>
        
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
              📊 Country Rankings
            </div>
            <div className="text-xs text-gray-600">View growth rates for any of 195 countries</div>
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
              🧮 Calculate Growth Rate
            </div>
            <div className="text-xs text-gray-600">Calculate rate from population changes</div>
          </button>
          <button
            onClick={() => setCalculatorMode('projection')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              calculatorMode === 'projection'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className={`font-semibold mb-1 ${calculatorMode === 'projection' ? 'text-blue-700' : 'text-gray-900'}`}>
              📈 Project Future Population
            </div>
            <div className="text-xs text-gray-600">Forecast future population growth</div>
          </button>
        </div>

        {/* Country Rankings Mode */}
        {calculatorMode === 'country' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔄 Compare With (optional)
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

            {selectedData && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Primary Country */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    {selectedData.flag} {selectedData.name}
                    {selectedData.slug !== 'world' && (
                      <span className="text-sm text-gray-500">
                        (#{getGlobalRank(selectedData)} of {countries.length})
                      </span>
                    )}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Annual Growth Rate</div>
                      <div className={`text-3xl font-bold ${getGrowthColor(selectedData.annualGrowthRate)}`}>
                        {selectedData.annualGrowthRate > 0 ? '+' : ''}{selectedData.annualGrowthRate.toFixed(2)}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getInterpretation(selectedData.annualGrowthRate)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Population 2024</div>
                        <div className="font-semibold">{(selectedData.population2024 / 1000000).toFixed(1)}M</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Annual Change</div>
                        <div className={`font-semibold ${selectedData.absoluteChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedData.absoluteChange > 0 ? '+' : ''}{(selectedData.absoluteChange / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="text-sm space-y-1">
                        <div>Growth since 2000: <span className="font-medium">{selectedData.growthSince2000.toFixed(1)}%</span></div>
                        <div>Status: <span className={`font-medium ${selectedData.status === 'Growing' ? 'text-green-600' : selectedData.status === 'Declining' ? 'text-red-600' : 'text-gray-600'}`}>{selectedData.status}</span></div>
                        {selectedData.doublingTime && (
                          <div>Doubling time: <span className="font-medium">{selectedData.doublingTime.toFixed(1)} years</span></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compare Country */}
                {compareData && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      {compareData.flag} {compareData.name}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Annual Growth Rate</div>
                        <div className={`text-3xl font-bold ${getGrowthColor(compareData.annualGrowthRate)}`}>
                          {compareData.annualGrowthRate > 0 ? '+' : ''}{compareData.annualGrowthRate.toFixed(2)}%
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg">
                        <span className="font-semibold">
                          {compareData.name} grows {Math.abs(compareData.annualGrowthRate - selectedData.annualGrowthRate).toFixed(2)}% 
                          {compareData.annualGrowthRate > selectedData.annualGrowthRate ? ' faster' : ' slower'} than {selectedData.name}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Population 2024</div>
                          <div className="font-semibold">{(compareData.population2024 / 1000000).toFixed(1)}M</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Annual Change</div>
                          <div className={`font-semibold ${compareData.absoluteChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {compareData.absoluteChange > 0 ? '+' : ''}{(compareData.absoluteChange / 1000).toFixed(0)}K
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Custom Calculator Mode */}
        {calculatorMode === 'custom' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 Starting Population
                </label>
                <input
                  type="number"
                  value={startPop}
                  onChange={(e) => setStartPop(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="1000000"
                />
                <p className="text-xs text-gray-600 mt-1">Initial population size</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📈 Ending Population
                </label>
                <input
                  type="number"
                  value={endPop}
                  onChange={(e) => setEndPop(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="1500000"
                />
                <p className="text-xs text-gray-600 mt-1">Final population size</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ⏱️ Time Period (Years)
                </label>
                <input
                  type="number"
                  value={numYears}
                  onChange={(e) => setNumYears(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="10"
                />
                <p className="text-xs text-gray-600 mt-1">Years between measurements</p>
              </div>
            </div>

            {customCalculations && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-lg mb-4">📊 Calculated Growth Rate</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Annual Growth Rate</div>
                      <div className={`text-2xl font-bold ${getGrowthColor(parseFloat(customCalculations.annualRate))}`}>
                        {parseFloat(customCalculations.annualRate) > 0 ? '+' : ''}{customCalculations.annualRate}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{customCalculations.interpretation}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Total Change</div>
                      <div className="text-xl font-bold text-blue-600">{customCalculations.totalPercent}%</div>
                      <div className="text-xs text-gray-500">{customCalculations.totalChange} people</div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Growth Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div>Population grows from {parseFloat(startPop).toLocaleString()} to {parseFloat(endPop).toLocaleString()}</div>
                      <div>Change of {customCalculations.totalChange} people over {numYears} years</div>
                      <div>Average annual increase: {((parseFloat(endPop) - parseFloat(startPop)) / parseFloat(numYears)).toLocaleString()} people/year</div>
                      {customCalculations.doublingTime && (
                        <div>At this rate, population doubles every {customCalculations.doublingTime} years</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Projection Mode */}
        {calculatorMode === 'projection' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👥 Current Population
                </label>
                <input
                  type="number"
                  value={currentPop}
                  onChange={(e) => setCurrentPop(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="1000000"
                />
                <p className="text-xs text-gray-600 mt-1">Starting population</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📈 Growth Rate (% per year)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="2.5"
                />
                <p className="text-xs text-gray-600 mt-1">Annual percentage growth</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ⏱️ Years to Project
                </label>
                <input
                  type="number"
                  value={projectionYears}
                  onChange={(e) => setProjectionYears(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="25"
                />
                <p className="text-xs text-gray-600 mt-1">Years into the future</p>
              </div>
            </div>

            {projectionResults && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <h3 className="font-bold text-lg mb-4">📈 Population Projection</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Projected Population ({projectionYears} years)</div>
                      <div className="text-2xl font-bold text-green-600">{projectionResults.projected}</div>
                      <div className="text-xs text-gray-500 mt-1">Total population in {projectionYears} years</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Population Added</div>
                      <div className="text-xl font-bold text-blue-600">{projectionResults.added}</div>
                      <div className="text-xs text-gray-500">Net population increase</div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Projection Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div>Starting: {parseFloat(currentPop).toLocaleString()} people</div>
                      <div>Growth rate: {growthRate}% per year</div>
                      <div>After {projectionYears} years: {projectionResults.projected} people</div>
                      <div>Total growth: {(((parseFloat(projectionResults.projected.replace(/,/g, '')) / parseFloat(currentPop)) - 1) * 100).toFixed(1)}%</div>
                      {projectionResults.doublingTime && (
                        <div>Population doubles every {projectionResults.doublingTime} years</div>
                      )}
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
        <h2 className="text-2xl font-semibold mb-6">Filter & Sort Countries by Growth Rate</h2>
        
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Growing">Growing</option>
            <option value="Stable">Stable</option>
            <option value="Declining">Declining</option>
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
                  onClick={() => handleSort('annualGrowthRate')}
                >
                  Growth Rate {sortConfig.key === 'annualGrowthRate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('population2024')}
                >
                  Population {sortConfig.key === 'population2024' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-right cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('absoluteChange')}
                >
                  Annual Change {sortConfig.key === 'absoluteChange' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-2 text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
                  <td className={`px-4 py-2 text-right font-semibold ${getGrowthColor(country.annualGrowthRate)}`}>
                    {country.annualGrowthRate > 0 ? '+' : ''}{country.annualGrowthRate.toFixed(2)}%
                  </td>
                  <td className="px-4 py-2 text-right">{(country.population2024 / 1000000).toFixed(1)}M</td>
                  <td className={`px-4 py-2 text-right ${country.absoluteChange > 0 ? 'text-green-600' : country.absoluteChange < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {country.absoluteChange > 0 ? '+' : ''}{(country.absoluteChange / 1000).toFixed(0)}K
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      country.status === 'Growing' ? 'bg-green-100 text-green-800' :
                      country.status === 'Declining' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {country.status}
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