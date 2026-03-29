'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { loadCountries, loadCountryData } from '@/lib/data-loader';
import { calculateMetrics } from '@/lib/calculations';
import { getCountryFlag } from '@/lib/country-flags';
import DependencyRatioContent from '@/components/DependencyRatioContent';
import type { Country } from '@/types/country';
import type { DemographicMetrics } from '@/types/population';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CountryDependencyData {
  country: Country;
  metrics: DemographicMetrics;
  historicalData?: {
    year: number;
    totalDR: number;
    youthDR: number;
    oldAgeDR: number;
  }[];
}

interface ContentData {
  name: string;
  youthPopulation: number;
  workingAgePopulation: number;
  elderlyPopulation: number;
  totalDR: number;
  youthDR: number;
  oldAgeDR: number;
}

function DependencyCalculator() {
  const searchParams = useSearchParams();
  const [activeMode, setActiveMode] = useState<'custom' | 'country' | 'compare'>('country');
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Custom input mode state
  const [customYouth, setCustomYouth] = useState<string>('');
  const [customWorking, setCustomWorking] = useState<string>('');
  const [customElderly, setCustomElderly] = useState<string>('');
  
  // Country lookup mode state
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [countryData, setCountryData] = useState<CountryDependencyData | null>(null);
  const [worldData, setWorldData] = useState<DemographicMetrics | null>(null);
  
  // Compare mode state
  const [compareCountry1, setCompareCountry1] = useState<string>('');
  const [compareCountry2, setCompareCountry2] = useState<string>('');
  const [compareData1, setCompareData1] = useState<CountryDependencyData | null>(null);
  const [compareData2, setCompareData2] = useState<CountryDependencyData | null>(null);

  // All countries data for table
  const [allCountriesData, setAllCountriesData] = useState<CountryDependencyData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string>('totalDR');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const countriesData = await loadCountries();
        setCountries(countriesData);
        
        // Load world aggregate data
        const worldAggregateData = await calculateWorldMetrics();
        setWorldData(worldAggregateData);
        
        // Load all countries data for table
        const allData = await loadAllCountriesData(countriesData);
        setAllCountriesData(allData);
        
        // Check URL params
        const countryParam = searchParams.get('country');
        const compareParam = searchParams.get('compare');
        
        if (compareParam) {
          const [c1, c2] = compareParam.split(',');
          setActiveMode('compare');
          setCompareCountry1(c1);
          setCompareCountry2(c2);
        } else if (countryParam) {
          setActiveMode('country');
          setSelectedCountry(countryParam);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [searchParams]);

  // Load country data when selected
  useEffect(() => {
    if (selectedCountry && selectedCountry !== '') {
      loadCountryDependencyData(selectedCountry).then(setCountryData);
    }
  }, [selectedCountry]);

  // Load compare data
  useEffect(() => {
    if (compareCountry1) {
      loadCountryDependencyData(compareCountry1).then(setCompareData1);
    }
  }, [compareCountry1]);

  useEffect(() => {
    if (compareCountry2) {
      loadCountryDependencyData(compareCountry2).then(setCompareData2);
    }
  }, [compareCountry2]);

  // Calculate world metrics
  async function calculateWorldMetrics(): Promise<DemographicMetrics> {
    // Simplified - would aggregate all countries
    // For now, using a placeholder
    return {
      totalPopulation: 8100000000,
      malePopulation: 4050000000,
      femalePopulation: 4050000000,
      medianAge: 30,
      sexRatio: 100,
      malePercent: 50,
      femalePercent: 50,
      youthPopulation: 2000000000,
      workingAgePopulation: 5200000000,
      elderlyPopulation: 900000000,
      youthPercentage: 24.7,
      workingAgePercentage: 64.2,
      elderlyPercentage: 11.1,
      dependencyRatio: 55.8,
      childDependencyRatio: 38.5,
      oldAgeDependencyRatio: 17.3,
      potentialSupportRatio: 5.8,
      agingIndex: 45,
      pyramidType: 'stationary'
    };
  }

  // Load all countries data
  async function loadAllCountriesData(countriesList: Country[]): Promise<CountryDependencyData[]> {
    const data: CountryDependencyData[] = [];
    for (const country of countriesList.slice(0, 50)) { // Limit for performance
      try {
        const countryPopData = await loadCountryData(country.slug);
        const latestYear = Object.keys(countryPopData.years).sort().pop();
        if (latestYear) {
          const metrics = calculateMetrics(countryPopData.years[latestYear]);
          data.push({ country, metrics });
        }
      } catch (error) {
        // Skip countries with no data
      }
    }
    return data;
  }

  // Load country dependency data with historical trend
  async function loadCountryDependencyData(slug: string): Promise<CountryDependencyData | null> {
    try {
      const country = countries.find(c => c.slug === slug);
      if (!country) return null;
      
      const countryPopData = await loadCountryData(slug);
      const years = Object.keys(countryPopData.years).sort();
      const latestYear = years[years.length - 1];
      const metrics = calculateMetrics(countryPopData.years[latestYear]);
      
      // Calculate historical data
      const historicalData = years
        .filter(year => parseInt(year) % 5 === 0) // Every 5 years
        .map(year => {
          const yearMetrics = calculateMetrics(countryPopData.years[year]);
          return {
            year: parseInt(year),
            totalDR: yearMetrics.dependencyRatio,
            youthDR: yearMetrics.childDependencyRatio,
            oldAgeDR: yearMetrics.oldAgeDependencyRatio
          };
        });
      
      return { country, metrics, historicalData };
    } catch (error) {
      console.error(`Failed to load data for ${slug}:`, error);
      return null;
    }
  }

  // Custom calculation
  const customCalculations = useMemo(() => {
    const youth = parseFloat(customYouth) || 0;
    const working = parseFloat(customWorking) || 0;
    const elderly = parseFloat(customElderly) || 0;
    
    if (working === 0) return null;
    
    const totalDR = ((youth + elderly) / working) * 100;
    const youthDR = (youth / working) * 100;
    const oldAgeDR = (elderly / working) * 100;
    
    return {
      totalDR: totalDR.toFixed(1),
      youthDR: youthDR.toFixed(1),
      oldAgeDR: oldAgeDR.toFixed(1),
      interpretation: `For every 100 working-age people, there are ${totalDR.toFixed(0)} dependents (${youthDR.toFixed(0)} children + ${oldAgeDR.toFixed(0)} elderly)`
    };
  }, [customYouth, customWorking, customElderly]);

  // Filter and sort table data
  const filteredAndSortedData = useMemo(() => {
    let filtered = allCountriesData;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by region
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(d => d.country.region === selectedRegion);
    }
    
    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortColumn) {
        case 'name':
          aVal = a.country.name;
          bVal = b.country.name;
          break;
        case 'totalDR':
          aVal = a.metrics.dependencyRatio;
          bVal = b.metrics.dependencyRatio;
          break;
        case 'youthDR':
          aVal = a.metrics.childDependencyRatio;
          bVal = b.metrics.childDependencyRatio;
          break;
        case 'oldAgeDR':
          aVal = a.metrics.oldAgeDependencyRatio;
          bVal = b.metrics.oldAgeDependencyRatio;
          break;
        case 'workingAge':
          aVal = a.metrics.workingAgePercentage;
          bVal = b.metrics.workingAgePercentage;
          break;
        default:
          aVal = a.metrics.dependencyRatio;
          bVal = b.metrics.dependencyRatio;
      }
      
      if (typeof aVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }
      
      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    
    return filtered;
  }, [allCountriesData, searchTerm, selectedRegion, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dependency ratio data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">
                Home
              </Link>
            </li>
            <li className="text-gray-500">›</li>
            <li className="text-gray-700">Dependency Ratio Calculator</li>
          </ol>
        </nav>

        {/* Header with credibility indicators */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">UN Data Source</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">195 Countries</span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">2026 Projections</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Dependency Ratio Calculator by Country 2026
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            Calculate dependency ratio for any country or input custom population data. 
            See youth, old-age, and total dependency ratios for 195 countries with real UN data.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-4xl mx-auto">
            <p className="text-sm text-gray-700">
              <strong>What is Dependency Ratio?</strong> It measures how many non-working age people (children 0-14 and elderly 65+) 
              depend on each 100 working-age adults (15-64). A ratio of 50 means every 2 workers support 1 dependent. 
              Lower ratios indicate economic opportunity; higher ratios signal social support challenges.
            </p>
          </div>
        </div>

        {/* Calculator Tool */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-8">
          {/* Mode Selector with descriptions */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setActiveMode('country')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                activeMode === 'country'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`font-semibold mb-1 ${activeMode === 'country' ? 'text-blue-700' : 'text-gray-900'}`}>
                📊 Country Lookup
              </div>
              <div className="text-xs text-gray-600">View real dependency ratios for any of 195 countries</div>
            </button>
            <button
              onClick={() => setActiveMode('custom')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                activeMode === 'custom'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`font-semibold mb-1 ${activeMode === 'custom' ? 'text-blue-700' : 'text-gray-900'}`}>
                🧮 Custom Calculator
              </div>
              <div className="text-xs text-gray-600">Input your own population data to calculate ratios</div>
            </button>
            <button
              onClick={() => setActiveMode('compare')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                activeMode === 'compare'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`font-semibold mb-1 ${activeMode === 'compare' ? 'text-blue-700' : 'text-gray-900'}`}>
                🔄 Compare Countries
              </div>
              <div className="text-xs text-gray-600">Side-by-side comparison of two countries</div>
            </button>
          </div>

          {/* Mode A: Custom Input Calculator */}
          {activeMode === 'custom' && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Calculate Custom Dependency Ratio</h2>
              <p className="text-gray-600 mb-6">Enter population numbers for each age group to calculate dependency ratios and understand workforce burden.</p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
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

              {/* Results */}
              {customCalculations && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="font-bold text-lg mb-4">📊 Calculated Dependency Ratios</h3>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-600 mb-1">Total Dependency Ratio</div>
                        <div className="text-3xl font-bold text-blue-600">
                          {customCalculations.totalDR.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {customCalculations.totalDR < 50 ? '✅ Below 50 (favorable)' : 
                           customCalculations.totalDR > 70 ? '⚠️ Above 70 (challenging)' : '➖ Moderate (50-70)'}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-600 mb-1">Youth Dependency Ratio</div>
                        <div className="text-3xl font-bold text-green-600">
                          {customCalculations.youthDR.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Children per 100 workers
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-600 mb-1">Old-Age Dependency Ratio</div>
                        <div className="text-3xl font-bold text-orange-600">
                          {customCalculations.oldAgeDR.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Elderly per 100 workers
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-gray-700 mb-2">
                        <strong>💡 What this means:</strong>
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• For every <strong>100 working-age people</strong>, there are <strong>{Math.round(customCalculations.totalDR)} dependents</strong> to support</li>
                        <li>• This breaks down to <strong>{Math.round(customCalculations.youthDR)} children</strong> and <strong>{Math.round(customCalculations.oldAgeDR)} elderly</strong> per 100 workers</li>
                        <li>• Each working person supports approximately <strong>{(customCalculations.totalDR / 100).toFixed(2)} dependents</strong></li>
                        <li>• {customCalculations.totalDR < 50 ? 
                            'This ratio indicates a demographic dividend opportunity with more workers than dependents' :
                            customCalculations.totalDR > 70 ?
                            'This high ratio suggests significant economic pressure on the working population' :
                            'This moderate ratio balances workforce productivity with dependent care needs'}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Visual Analysis for Custom Calculation */}
                  <div className="grid lg:grid-cols-2 gap-6 mt-6">
                    {/* Bar Chart Comparison */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="text-2xl">📊</span> Dependency Ratio Breakdown
                      </h3>
                      <div style={{ height: '300px' }}>
                        <Bar
                          data={{
                            labels: ['Youth DR', 'Old-Age DR', 'Total DR'],
                            datasets: [{
                              label: 'Dependency Ratios',
                              data: [customCalculations.youthDR, customCalculations.oldAgeDR, customCalculations.totalDR],
                              backgroundColor: [
                                'rgba(34, 197, 94, 0.8)',   // Green for youth
                                'rgba(249, 115, 22, 0.8)',  // Orange for elderly
                                'rgba(59, 130, 246, 0.8)'   // Blue for total
                              ],
                              borderColor: [
                                'rgba(34, 197, 94, 1)',
                                'rgba(249, 115, 22, 1)',
                                'rgba(59, 130, 246, 1)'
                              ],
                              borderWidth: 2
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context: any) {
                                    return `${context.label}: ${context.parsed.y.toFixed(1)} dependents per 100 workers`;
                                  }
                                }
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                title: {
                                  display: true,
                                  text: 'Dependents per 100 Workers'
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Detailed Analysis Table */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="text-2xl">📋</span> Detailed Analysis
                      </h3>
                      <div className="overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-2 font-semibold text-gray-700">Metric</th>
                              <th className="text-right py-3 px-2 font-semibold text-gray-700">Value</th>
                              <th className="text-right py-3 px-2 font-semibold text-gray-700">Assessment</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-blue-50 transition-colors">
                              <td className="py-3 px-2 text-gray-600">Total Population</td>
                              <td className="py-3 px-2 text-right font-medium">{(customCalculations.youth + customCalculations.working + customCalculations.elderly).toLocaleString()}</td>
                              <td className="py-3 px-2 text-right text-xs text-gray-500">Total</td>
                            </tr>
                            <tr className="hover:bg-green-50 transition-colors">
                              <td className="py-3 px-2 text-gray-600">Youth (0-14)</td>
                              <td className="py-3 px-2 text-right font-medium text-green-600">{customCalculations.youth.toLocaleString()}</td>
                              <td className="py-3 px-2 text-right text-xs text-gray-500">{((customCalculations.youth / (customCalculations.youth + customCalculations.working + customCalculations.elderly)) * 100).toFixed(1)}%</td>
                            </tr>
                            <tr className="hover:bg-blue-50 transition-colors">
                              <td className="py-3 px-2 text-gray-600">Working-Age (15-64)</td>
                              <td className="py-3 px-2 text-right font-medium text-blue-600">{customCalculations.working.toLocaleString()}</td>
                              <td className="py-3 px-2 text-right text-xs text-gray-500">{((customCalculations.working / (customCalculations.youth + customCalculations.working + customCalculations.elderly)) * 100).toFixed(1)}%</td>
                            </tr>
                            <tr className="hover:bg-orange-50 transition-colors">
                              <td className="py-3 px-2 text-gray-600">Elderly (65+)</td>
                              <td className="py-3 px-2 text-right font-medium text-orange-600">{customCalculations.elderly.toLocaleString()}</td>
                              <td className="py-3 px-2 text-right text-xs text-gray-500">{((customCalculations.elderly / (customCalculations.youth + customCalculations.working + customCalculations.elderly)) * 100).toFixed(1)}%</td>
                            </tr>
                            <tr className="hover:bg-purple-50 transition-colors bg-purple-25">
                              <td className="py-3 px-2 font-semibold text-gray-700">Support Burden</td>
                              <td className="py-3 px-2 text-right font-bold text-purple-600">{(customCalculations.totalDR / 100).toFixed(2)}</td>
                              <td className="py-3 px-2 text-right text-xs text-gray-500">Dependents per worker</td>
                            </tr>
                            <tr className="hover:bg-amber-50 transition-colors">
                              <td className="py-3 px-2 text-gray-600">Economic Classification</td>
                              <td className="py-3 px-2 text-right font-medium text-amber-600">
                                {customCalculations.totalDR < 50 ? 'Favorable' :
                                 customCalculations.totalDR > 70 ? 'Challenging' : 'Moderate'}
                              </td>
                              <td className="py-3 px-2 text-right text-xs text-gray-500">
                                {customCalculations.totalDR < 50 ? '✅' :
                                 customCalculations.totalDR > 70 ? '⚠️' : '➖'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode B: Country Lookup */}
          {activeMode === 'country' && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Dependency Ratio by Country</h2>
              <p className="text-gray-600 mb-6">Explore dependency ratios for 195 countries using official UN World Population Prospects 2024 data.</p>
              
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🌍 Select Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    const newUrl = e.target.value 
                      ? `${window.location.pathname}?country=${e.target.value}`
                      : window.location.pathname;
                    window.history.pushState({}, '', newUrl);
                  }}
                  className="w-full md:w-96 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                >
                  <option value="">Choose a country...</option>
                  <optgroup label="Popular Countries">
                    <option value="united-states">🇺🇸 United States</option>
                    <option value="china">🇨🇳 China</option>
                    <option value="india">🇮🇳 India</option>
                    <option value="japan">🇯🇵 Japan</option>
                    <option value="germany">🇩🇪 Germany</option>
                    <option value="united-kingdom">🇬🇧 United Kingdom</option>
                  </optgroup>
                  <optgroup label="All Countries">
                    {countries.map(country => (
                      <option key={country.slug} value={country.slug}>
                        {getCountryFlag(country.code)} {country.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <p className="text-xs text-gray-500 mt-2">Data source: UN World Population Prospects 2024 Revision</p>
              </div>

              {countryData && (
                <div className="space-y-6">
                  {/* Country Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
                    <h3 className="text-2xl font-bold mb-2">
                      {getCountryFlag(countryData.country.code)} {countryData.country.name}
                    </h3>
                    <p className="text-blue-100">
                      Population: {countryData.metrics.totalPopulation.toLocaleString()} • 
                      Region: {countryData.country.region} • 
                      Data Year: 2026
                    </p>
                  </div>

                  {/* Main Metrics */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-6 rounded-xl">
                      <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-2xl">📊</span> Total Dependency Ratio
                      </h3>
                      <div className="text-5xl font-bold text-blue-700 mb-2">
                        {countryData.metrics.dependencyRatio.toFixed(1)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                          {countryData.metrics.dependencyRatio > (worldData?.dependencyRatio || 53.8) ? 
                           `📈 ${((countryData.metrics.dependencyRatio / (worldData?.dependencyRatio || 53.8) - 1) * 100).toFixed(0)}% above` : 
                           `📉 ${((1 - countryData.metrics.dependencyRatio / (worldData?.dependencyRatio || 53.8)) * 100).toFixed(0)}% below`} world average
                        </p>
                        <p className="text-xs text-gray-600">
                          World average: {worldData?.dependencyRatio.toFixed(1) || '53.8'}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Every 100 workers support {Math.round(countryData.metrics.dependencyRatio)} dependents
                        </p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-6 rounded-xl">
                      <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-2xl">👶</span> Youth Dependency Ratio
                      </h3>
                      <div className="text-5xl font-bold text-green-700 mb-2">
                        {countryData.metrics.childDependencyRatio.toFixed(1)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                          {countryData.metrics.youthPopulation.toLocaleString()} children (0-14)
                        </p>
                        <p className="text-xs text-gray-600">
                          {countryData.metrics.youthPercentage.toFixed(1)}% of total population
                        </p>
                        <p className="text-xs text-gray-500">
                          Requiring education and healthcare
                        </p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 p-6 rounded-xl">
                      <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-2xl">👴</span> Old-Age Dependency Ratio
                      </h3>
                      <div className="text-5xl font-bold text-orange-700 mb-2">
                        {countryData.metrics.oldAgeDependencyRatio.toFixed(1)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                          {countryData.metrics.elderlyPopulation.toLocaleString()} elderly (65+)
                        </p>
                        <p className="text-xs text-gray-600">
                          {countryData.metrics.elderlyPercentage.toFixed(1)}% of total population
                        </p>
                        <p className="text-xs text-gray-500">
                          Requiring pensions and care
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Population Visualization & Detailed Metrics Table */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Donut Chart for Population Breakdown */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="text-2xl">📊</span> Population Distribution
                      </h3>
                      <div style={{ height: '300px' }} className="flex items-center justify-center">
                        <Doughnut
                          data={{
                            labels: ['Working-Age (15-64)', 'Youth (0-14)', 'Elderly (65+)'],
                            datasets: [{
                              data: [
                                countryData.metrics.workingAgePercentage,
                                countryData.metrics.youthPercentage,
                                countryData.metrics.elderlyPercentage
                              ],
                              backgroundColor: [
                                'rgba(59, 130, 246, 0.8)',  // Blue for working-age
                                'rgba(34, 197, 94, 0.8)',   // Green for youth
                                'rgba(249, 115, 22, 0.8)'   // Orange for elderly
                              ],
                              borderColor: [
                                'rgba(59, 130, 246, 1)',
                                'rgba(34, 197, 94, 1)',
                                'rgba(249, 115, 22, 1)'
                              ],
                              borderWidth: 2
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom',
                                labels: {
                                  padding: 20,
                                  usePointStyle: true
                                }
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context: any) {
                                    const label = context.label || '';
                                    const value = context.parsed;
                                    return `${label}: ${value.toFixed(1)}%`;
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Detailed Metrics Table */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="text-2xl">📋</span> Detailed Metrics Summary
                      </h3>
                      <div className="overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-2 font-semibold text-gray-700">Metric</th>
                              <th className="text-right py-3 px-2 font-semibold text-gray-700">Value</th>
                              <th className="text-right py-3 px-2 font-semibold text-gray-700">Ranking</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-blue-50 transition-colors">
                              <td className="py-3 px-2 text-gray-600">Total Dependency Ratio</td>
                              <td className="py-3 px-2 text-right font-medium">{countryData.metrics.dependencyRatio.toFixed(1)}</td>
                              <td className="py-3 px-2 text-right text-xs text-gray-500">
                                {countryData.metrics.dependencyRatio < 40 ? 'Very Low' :
                                 countryData.metrics.dependencyRatio < 50 ? 'Low' :
                                 countryData.metrics.dependencyRatio < 60 ? 'Moderate' :
                                 countryData.metrics.dependencyRatio < 70 ? 'High' : 'Very High'}
                              </td>
                            </tr>
                            <tr className="hover:bg-green-50 transition-colors">
                              <td className="py-3 px-2 text-gray-600">Youth Dependency Ratio</td>
                              <td className="py-3 px-2 text-right font-medium text-green-600">{countryData.metrics.childDependencyRatio.toFixed(1)}</td>
                              <td className="py-3 px-2 text-right text-xs text-gray-500">
                                {countryData.metrics.childDependencyRatio < 25 ? 'Very Low' :
                                 countryData.metrics.childDependencyRatio < 40 ? 'Low' :
                                 countryData.metrics.childDependencyRatio < 60 ? 'Moderate' :
                                 countryData.metrics.childDependencyRatio < 80 ? 'High' : 'Very High'}
                              </td>
                            </tr>
                            <tr className="hover:bg-orange-50 transition-colors">
                              <td className="py-3 px-2 text-gray-600">Old-Age Dependency Ratio</td>
                              <td className="py-3 px-2 text-right font-medium text-orange-600">{countryData.metrics.oldAgeDependencyRatio.toFixed(1)}</td>
                              <td className="py-3 px-2 text-right text-xs text-gray-500">
                                {countryData.metrics.oldAgeDependencyRatio < 10 ? 'Very Low' :
                                 countryData.metrics.oldAgeDependencyRatio < 20 ? 'Low' :
                                 countryData.metrics.oldAgeDependencyRatio < 30 ? 'Moderate' :
                                 countryData.metrics.oldAgeDependencyRatio < 40 ? 'High' : 'Very High'}
                              </td>
                            </tr>
                            <tr className="hover:bg-blue-50 transition-colors">
                              <td className="py-3 px-2 text-gray-600">Working-Age Population %</td>
                              <td className="py-3 px-2 text-right font-medium text-blue-600">{countryData.metrics.workingAgePercentage.toFixed(1)}%</td>
                              <td className="py-3 px-2 text-right text-xs text-gray-500">
                                {countryData.metrics.workingAgePercentage > 70 ? 'Very High' :
                                 countryData.metrics.workingAgePercentage > 65 ? 'High' :
                                 countryData.metrics.workingAgePercentage > 60 ? 'Moderate' :
                                 countryData.metrics.workingAgePercentage > 55 ? 'Low' : 'Very Low'}
                              </td>
                            </tr>
                            <tr className="hover:bg-purple-50 transition-colors">
                              <td className="py-3 px-2 text-gray-600">Potential Support Ratio</td>
                              <td className="py-3 px-2 text-right font-medium text-purple-600">{countryData.metrics.potentialSupportRatio?.toFixed(1) || 'N/A'}</td>
                              <td className="py-3 px-2 text-right text-xs text-gray-500">
                                Workers per elderly
                              </td>
                            </tr>
                            <tr className="hover:bg-amber-50 transition-colors">
                              <td className="py-3 px-2 text-gray-600">Median Age</td>
                              <td className="py-3 px-2 text-right font-medium text-amber-600">{countryData.metrics.medianAge?.toFixed(1) || 'N/A'} years</td>
                              <td className="py-3 px-2 text-right text-xs text-gray-500">
                                {(countryData.metrics.medianAge || 0) < 25 ? 'Very Young' :
                                 (countryData.metrics.medianAge || 0) < 30 ? 'Young' :
                                 (countryData.metrics.medianAge || 0) < 35 ? 'Moderate' :
                                 (countryData.metrics.medianAge || 0) < 40 ? 'Mature' : 'Aging'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Economic Context & Analysis */}
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 text-yellow-800">💰 Economic Impact Analysis</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">👥 Workforce Situation</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• <strong>{countryData.metrics.workingAgePopulation.toLocaleString()}</strong> people in prime working years (15-64)</li>
                          <li>• <strong>{countryData.metrics.workingAgePercentage.toFixed(1)}%</strong> of total population economically active</li>
                          <li>• Each worker supports <strong>{(countryData.metrics.dependencyRatio / 100).toFixed(2)}</strong> dependents on average</li>
                          <li>• {countryData.metrics.workingAgePercentage > 65 ? 
                                'Strong workforce capacity - demographic dividend window' :
                                countryData.metrics.workingAgePercentage < 55 ?
                                'Limited workforce capacity - economic challenges likely' :
                                'Moderate workforce capacity - balanced demographics'}</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">🏭 Social Support Burden</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• <strong>{(countryData.metrics.youthPopulation + countryData.metrics.elderlyPopulation).toLocaleString()}</strong> total dependents requiring support</li>
                          <li>• Youth (0-14): <strong>{countryData.metrics.youthPercentage.toFixed(1)}%</strong> - education & childcare costs</li>
                          <li>• Elderly (65+): <strong>{countryData.metrics.elderlyPercentage.toFixed(1)}%</strong> - healthcare & pension costs</li>
                          <li>• {countryData.metrics.childDependencyRatio > countryData.metrics.oldAgeDependencyRatio ?
                                'Youth-dominated dependency - high education investment needs' :
                                'Aging-dominated dependency - rising healthcare and pension pressure'}</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Population Breakdown */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <span className="text-2xl">📋</span> Detailed Population Breakdown
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">👶</span>
                          <span className="font-semibold text-gray-700">Youth (Ages 0-14)</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {countryData.metrics.youthPopulation.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>{countryData.metrics.youthPercentage.toFixed(1)}%</strong> of total population</p>
                          <p>Education, healthcare, and family support needed</p>
                          <p>Future workforce entering in 15+ years</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">💼</span>
                          <span className="font-semibold text-gray-700">Working-Age (15-64)</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {countryData.metrics.workingAgePopulation.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>{countryData.metrics.workingAgePercentage.toFixed(1)}%</strong> of total population</p>
                          <p>Economically active, taxpaying population</p>
                          <p>Supporting all dependents through work</p>
                        </div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">👴</span>
                          <span className="font-semibold text-gray-700">Elderly (Ages 65+)</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          {countryData.metrics.elderlyPopulation.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>{countryData.metrics.elderlyPercentage.toFixed(1)}%</strong> of total population</p>
                          <p>Pension and healthcare recipients</p>
                          <p>Requiring increased medical and social care</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Historical Trend Chart */}
                  {countryData.historicalData && countryData.historicalData.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="text-2xl">📈</span> Historical Trend (1950-2025)
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Track how dependency ratios have changed over 75 years. Rising trends indicate aging populations or baby booms, 
                        while declining trends show demographic transitions and economic opportunities.
                      </p>
                      <div style={{ height: '350px' }}>
                        <Line
                          data={{
                            labels: countryData.historicalData.map(d => d.year),
                            datasets: [
                              {
                                label: 'Total DR',
                                data: countryData.historicalData.map(d => d.totalDR),
                                borderColor: 'rgb(59, 130, 246)',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                tension: 0.3
                              },
                              {
                                label: 'Youth DR',
                                data: countryData.historicalData.map(d => d.youthDR),
                                borderColor: 'rgb(34, 197, 94)',
                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                tension: 0.3
                              },
                              {
                                label: 'Old-Age DR',
                                data: countryData.historicalData.map(d => d.oldAgeDR),
                                borderColor: 'rgb(249, 115, 22)',
                                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                                tension: 0.3
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: true,
                                position: 'top'
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                title: {
                                  display: true,
                                  text: 'Dependency Ratio'
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mode C: Compare Countries */}
          {activeMode === 'compare' && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Compare Countries</h2>
              <p className="text-gray-600 mb-6">Compare dependency ratios between two countries to understand demographic differences and economic implications.</p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🇱 First Country
                  </label>
                  <select
                    value={compareCountry1}
                    onChange={(e) => {
                      setCompareCountry1(e.target.value);
                      if (e.target.value && compareCountry2) {
                        const newUrl = `${window.location.pathname}?compare=${e.target.value},${compareCountry2}`;
                        window.history.pushState({}, '', newUrl);
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  >
                    <option value="">Select first country...</option>
                    <optgroup label="Popular Comparisons">
                      <option value="japan">🇯🇵 Japan (Aging Leader)</option>
                      <option value="niger">🇳🇪 Niger (Youth Leader)</option>
                      <option value="united-states">🇺🇸 United States</option>
                      <option value="china">🇨🇳 China</option>
                      <option value="germany">🇩🇪 Germany</option>
                    </optgroup>
                    <optgroup label="All Countries">
                      {countries.map(country => (
                        <option key={country.slug} value={country.slug}>
                          {getCountryFlag(country.code)} {country.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🇲 Second Country
                  </label>
                  <select
                    value={compareCountry2}
                    onChange={(e) => {
                      setCompareCountry2(e.target.value);
                      if (compareCountry1 && e.target.value) {
                        const newUrl = `${window.location.pathname}?compare=${compareCountry1},${e.target.value}`;
                        window.history.pushState({}, '', newUrl);
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                  >
                    <option value="">Select second country...</option>
                    <optgroup label="Popular Comparisons">
                      <option value="qatar">🇶🇦 Qatar (Low Dependency)</option>
                      <option value="chad">🇹🇩 Chad (High Dependency)</option>
                      <option value="india">🇮🇳 India</option>
                      <option value="brazil">🇧🇷 Brazil</option>
                      <option value="united-kingdom">🇬🇧 United Kingdom</option>
                    </optgroup>
                    <optgroup label="All Countries">
                      {countries.map(country => (
                        <option key={country.slug} value={country.slug}>
                          {getCountryFlag(country.code)} {country.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {compareData1 && compareData2 && (
                <div className="space-y-8">
                  {/* Country Headers */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        {getCountryFlag(compareData1.country.code)} {compareData1.country.name}
                      </h3>
                      <p className="text-blue-100">
                        Population: {compareData1.metrics.totalPopulation.toLocaleString()} • Region: {compareData1.country.region}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        {getCountryFlag(compareData2.country.code)} {compareData2.country.name}
                      </h3>
                      <p className="text-green-100">
                        Population: {compareData2.metrics.totalPopulation.toLocaleString()} • Region: {compareData2.country.region}
                      </p>
                    </div>
                  </div>

                  {/* Comprehensive Comparison Table */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                      <span className="text-2xl">🔄</span> Detailed Comparison
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-4 px-3 font-semibold text-gray-700">Metric</th>
                            <th className="text-center py-4 px-3 font-semibold text-blue-700">{compareData1.country.name}</th>
                            <th className="text-center py-4 px-3 font-semibold text-green-700">{compareData2.country.name}</th>
                            <th className="text-center py-4 px-3 font-semibold text-gray-700">Difference</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-3 font-medium text-gray-700">Total Dependency Ratio</td>
                            <td className="py-4 px-3 text-center font-bold text-blue-600">{compareData1.metrics.dependencyRatio.toFixed(1)}</td>
                            <td className="py-4 px-3 text-center font-bold text-green-600">{compareData2.metrics.dependencyRatio.toFixed(1)}</td>
                            <td className="py-4 px-3 text-center text-sm">
                              <span className={`font-medium ${compareData1.metrics.dependencyRatio > compareData2.metrics.dependencyRatio ? 'text-red-600' : 'text-green-600'}`}>
                                {compareData1.metrics.dependencyRatio > compareData2.metrics.dependencyRatio ? '+' : ''}
                                {(compareData1.metrics.dependencyRatio - compareData2.metrics.dependencyRatio).toFixed(1)}
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-3 font-medium text-gray-700">Youth Dependency Ratio</td>
                            <td className="py-4 px-3 text-center font-bold text-blue-600">{compareData1.metrics.childDependencyRatio.toFixed(1)}</td>
                            <td className="py-4 px-3 text-center font-bold text-green-600">{compareData2.metrics.childDependencyRatio.toFixed(1)}</td>
                            <td className="py-4 px-3 text-center text-sm">
                              <span className={`font-medium ${compareData1.metrics.childDependencyRatio > compareData2.metrics.childDependencyRatio ? 'text-red-600' : 'text-green-600'}`}>
                                {compareData1.metrics.childDependencyRatio > compareData2.metrics.childDependencyRatio ? '+' : ''}
                                {(compareData1.metrics.childDependencyRatio - compareData2.metrics.childDependencyRatio).toFixed(1)}
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-3 font-medium text-gray-700">Old-Age Dependency Ratio</td>
                            <td className="py-4 px-3 text-center font-bold text-blue-600">{compareData1.metrics.oldAgeDependencyRatio.toFixed(1)}</td>
                            <td className="py-4 px-3 text-center font-bold text-green-600">{compareData2.metrics.oldAgeDependencyRatio.toFixed(1)}</td>
                            <td className="py-4 px-3 text-center text-sm">
                              <span className={`font-medium ${compareData1.metrics.oldAgeDependencyRatio > compareData2.metrics.oldAgeDependencyRatio ? 'text-red-600' : 'text-green-600'}`}>
                                {compareData1.metrics.oldAgeDependencyRatio > compareData2.metrics.oldAgeDependencyRatio ? '+' : ''}
                                {(compareData1.metrics.oldAgeDependencyRatio - compareData2.metrics.oldAgeDependencyRatio).toFixed(1)}
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-3 font-medium text-gray-700">Working-Age Population %</td>
                            <td className="py-4 px-3 text-center font-bold text-blue-600">{compareData1.metrics.workingAgePercentage.toFixed(1)}%</td>
                            <td className="py-4 px-3 text-center font-bold text-green-600">{compareData2.metrics.workingAgePercentage.toFixed(1)}%</td>
                            <td className="py-4 px-3 text-center text-sm">
                              <span className={`font-medium ${compareData1.metrics.workingAgePercentage < compareData2.metrics.workingAgePercentage ? 'text-red-600' : 'text-green-600'}`}>
                                {compareData1.metrics.workingAgePercentage > compareData2.metrics.workingAgePercentage ? '+' : ''}
                                {(compareData1.metrics.workingAgePercentage - compareData2.metrics.workingAgePercentage).toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-3 font-medium text-gray-700">Youth Population (0-14)</td>
                            <td className="py-4 px-3 text-center font-bold text-blue-600">{compareData1.metrics.youthPopulation.toLocaleString()}</td>
                            <td className="py-4 px-3 text-center font-bold text-green-600">{compareData2.metrics.youthPopulation.toLocaleString()}</td>
                            <td className="py-4 px-3 text-center text-sm text-gray-500">
                              {compareData1.metrics.youthPercentage.toFixed(1)}% vs {compareData2.metrics.youthPercentage.toFixed(1)}%
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-3 font-medium text-gray-700">Elderly Population (65+)</td>
                            <td className="py-4 px-3 text-center font-bold text-blue-600">{compareData1.metrics.elderlyPopulation.toLocaleString()}</td>
                            <td className="py-4 px-3 text-center font-bold text-green-600">{compareData2.metrics.elderlyPopulation.toLocaleString()}</td>
                            <td className="py-4 px-3 text-center text-sm text-gray-500">
                              {compareData1.metrics.elderlyPercentage.toFixed(1)}% vs {compareData2.metrics.elderlyPercentage.toFixed(1)}%
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 text-amber-800 flex items-center gap-2">
                      <span className="text-2xl">💡</span> Key Demographic Insights
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Dependency Burden</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• <strong>{compareData1.country.name}:</strong> {Math.round(compareData1.metrics.dependencyRatio)} dependents per 100 workers</li>
                          <li>• <strong>{compareData2.country.name}:</strong> {Math.round(compareData2.metrics.dependencyRatio)} dependents per 100 workers</li>
                          <li>• <strong>Difference:</strong> {Math.abs(compareData1.metrics.dependencyRatio - compareData2.metrics.dependencyRatio).toFixed(1)} point gap</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Age Structure Comparison</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• <strong>Youth Focus:</strong> {compareData1.metrics.childDependencyRatio > compareData2.metrics.childDependencyRatio ? compareData1.country.name : compareData2.country.name} has higher youth dependency</li>
                          <li>• <strong>Aging Challenge:</strong> {compareData1.metrics.oldAgeDependencyRatio > compareData2.metrics.oldAgeDependencyRatio ? compareData1.country.name : compareData2.country.name} faces greater aging pressure</li>
                          <li>• <strong>Economic Impact:</strong> {compareData1.metrics.workingAgePercentage > compareData2.metrics.workingAgePercentage ? compareData1.country.name : compareData2.country.name} has stronger workforce capacity</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Visual Comparison Charts */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Side-by-Side Bar Chart */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="text-2xl">📊</span> Dependency Ratio Comparison
                      </h3>
                      <div style={{ height: '300px' }}>
                    <Bar
                      data={{
                        labels: ['Youth DR', 'Old-Age DR'],
                        datasets: [
                          {
                            label: compareData1.country.name,
                            data: [compareData1.metrics.childDependencyRatio, compareData1.metrics.oldAgeDependencyRatio],
                            backgroundColor: 'rgba(59, 130, 246, 0.8)',
                          },
                          {
                            label: compareData2.country.name,
                            data: [compareData2.metrics.childDependencyRatio, compareData2.metrics.oldAgeDependencyRatio],
                            backgroundColor: 'rgba(249, 115, 22, 0.8)',
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: true,
                            position: 'top',
                            labels: {
                              usePointStyle: true
                            }
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context: any) {
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} dependents per 100 workers`;
                              }
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Dependents per 100 Workers'
                            }
                          }
                        }
                      }}
                    />
                      </div>
                    </div>

                    {/* Population Structure Comparison */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="text-2xl">🎂</span> Population Structure
                      </h3>
                      <div style={{ height: '300px' }}>
                        <Bar
                          data={{
                            labels: ['Youth (0-14)', 'Working-Age (15-64)', 'Elderly (65+)'],
                            datasets: [
                              {
                                label: compareData1.country.name,
                                data: [
                                  compareData1.metrics.youthPercentage,
                                  compareData1.metrics.workingAgePercentage,
                                  compareData1.metrics.elderlyPercentage
                                ],
                                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                                borderColor: 'rgba(59, 130, 246, 1)',
                                borderWidth: 2
                              },
                              {
                                label: compareData2.country.name,
                                data: [
                                  compareData2.metrics.youthPercentage,
                                  compareData2.metrics.workingAgePercentage,
                                  compareData2.metrics.elderlyPercentage
                                ],
                                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                                borderColor: 'rgba(34, 197, 94, 1)',
                                borderWidth: 2
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: true,
                                position: 'top',
                                labels: {
                                  usePointStyle: true
                                }
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context: any) {
                                    return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}% of population`;
                                  }
                                }
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                max: 100,
                                title: {
                                  display: true,
                                  text: 'Percentage of Population'
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ranked Data Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Dependency Ratio by Country: Global Rankings 2026
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Search country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Regions</option>
                  <option value="Africa">Africa</option>
                  <option value="Americas">Americas</option>
                  <option value="Asia">Asia</option>
                  <option value="Europe">Europe</option>
                  <option value="Oceania">Oceania</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th 
                    className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('name')}
                  >
                    Country {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('totalDR')}
                  >
                    Total DR {sortColumn === 'totalDR' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('youthDR')}
                  >
                    Youth DR {sortColumn === 'youthDR' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('oldAgeDR')}
                  >
                    Old-Age DR {sortColumn === 'oldAgeDR' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('workingAge')}
                  >
                    Working-Age % {sortColumn === 'workingAge' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedData.map((data, index) => (
                  <tr 
                    key={data.country.slug} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedCountry(data.country.slug);
                      setActiveMode('country');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      <span className="mr-2">{getCountryFlag(data.country.code)}</span>
                      {data.country.name}
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${
                      data.metrics.dependencyRatio > 70 ? 'text-red-600' : 
                      data.metrics.dependencyRatio < 50 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {data.metrics.dependencyRatio.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {data.metrics.childDependencyRatio.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {data.metrics.oldAgeDependencyRatio.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {data.metrics.workingAgePercentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Related Tools Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Demographics Tools</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/median-age-by-country" className="block bg-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-400 transition">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Median Age by Country</h3>
                <p className="text-gray-600 mb-3">Compare median ages across 195 countries. See which populations are aging fastest and which remain young.</p>
                <span className="text-blue-500 font-medium">Explore median ages →</span>
              </Link>
              
              <Link href="/male-to-female-ratio" className="block bg-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-400 transition">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Male to Female Ratio</h3>
                <p className="text-gray-600 mb-3">Analyze gender ratios worldwide. See how sex ratios vary by country and change with age groups.</p>
                <span className="text-blue-500 font-medium">View gender ratios →</span>
              </Link>
              
              <Link href="/population-growth-rate-calculator" className="block bg-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-400 transition">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Population Growth Rate Calculator</h3>
                <p className="text-gray-600 mb-3">Calculate and compare population growth rates. Track historical trends and future projections.</p>
                <span className="text-blue-500 font-medium">Calculate growth →</span>
              </Link>
              
              <Link href="/generation-age-ranges-calculator" className="block bg-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-400 transition">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Generation Age Ranges</h3>
                <p className="text-gray-600 mb-3">Find out age ranges for Gen Z, Millennials, Gen X, and other generations in 2026.</p>
                <span className="text-blue-500 font-medium">View generations →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Comprehensive Content Sections */}
        {allCountriesData.length > 0 && (
          <DependencyRatioContent 
            countryData={allCountriesData.map(d => ({
              name: d.country.name,
              youthPopulation: d.metrics.youthPopulation,
              workingAgePopulation: d.metrics.workingAgePopulation,
              elderlyPopulation: d.metrics.elderlyPopulation,
              totalDR: d.metrics.dependencyRatio,
              youthDR: d.metrics.childDependencyRatio,
              oldAgeDR: d.metrics.oldAgeDependencyRatio
            }))}
          />
        )}
      </div>
    </div>
  );
}

export default function DependencyRatioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dependency ratio calculator...</p>
        </div>
      </div>
    }>
      <DependencyCalculator />
    </Suspense>
  );
}