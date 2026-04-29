'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { loadCountries, loadCountryData } from '@/lib/data-loader';
import { 
  generations, 
  getGenerationByBirthYear, 
  getAgeFromBirthYear,
  calculateGenerationPopulations,
  calculateWorldGenerationPopulations,
  type Generation,
  type GenerationPopulation 
} from '@/lib/generation-utils';
import type { Country } from '@/types/country';
import GenerationsContent from '@/components/GenerationsContent';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function GenerationsPage() {
  const [birthYear, setBirthYear] = useState<string>('');
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  const [worldGenerations, setWorldGenerations] = useState<GenerationPopulation[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('world');
  const [countryGenerations, setCountryGenerations] = useState<GenerationPopulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  // Create year options for dropdown
  const yearOptions = [];
  for (let year = 2026; year >= 1901; year--) {
    yearOptions.push(year);
  }

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load countries
        const countriesData = await loadCountries();
        setCountries(countriesData);
        
        // Load world generation data
        const worldGenData = await calculateWorldGenerationPopulations();
        setWorldGenerations(worldGenData);
        setCountryGenerations(worldGenData);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Handle country selection (separate from calculator)
  useEffect(() => {
    if (selectedCountry === 'world') {
      setCountryGenerations(worldGenerations);
      return;
    }

    const loadCountryGenerations = async () => {
      setCalculating(true);
      try {
        const countryData = await loadCountryData(selectedCountry);
        const year2024 = countryData.years['2024'] || countryData.years['2023'];
        if (year2024) {
          const genData = calculateGenerationPopulations(year2024, 2026);
          setCountryGenerations(genData);
        }
      } catch (error) {
        console.error('Failed to load country data:', error);
      } finally {
        setCalculating(false);
      }
    };

    if (selectedCountry !== 'world') {
      loadCountryGenerations();
    }
  }, [selectedCountry, worldGenerations]);

  const handleBirthYearChange = (year: string) => {
    setBirthYear(year);
    if (year) {
      const gen = getGenerationByBirthYear(parseInt(year));
      setSelectedGeneration(gen);
    } else {
      setSelectedGeneration(null);
    }
  };

  const currentAge = birthYear ? getAgeFromBirthYear(parseInt(birthYear)) : null;

  // Chart data for generation populations
  const chartData = {
    labels: countryGenerations.map(g => g.generation.name),
    datasets: [{
      label: 'Population',
      data: countryGenerations.map(g => g.population),
      backgroundColor: countryGenerations.map(g => g.generation.color),
      borderWidth: 0,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const gen = countryGenerations[context.dataIndex];
            return [
              `${gen.generation.name}: ${gen.population.toLocaleString()}`,
              `${gen.percentOfTotal.toFixed(1)}% of population`,
              `Ages ${gen.ageRange} in 2026`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => {
            if (value === 0) return '0';
            if (value >= 1000000000) {
              return (value / 1000000000).toFixed(1) + 'B';
            }
            return (value / 1000000).toFixed(0) + 'M';
          }
        },
        title: {
          display: true,
          text: 'Population'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading generation data...</p>
        </div>
      </div>
    );
  }

  // ALWAYS use world data for calculator display
  const selectedGenData = selectedGeneration 
    ? worldGenerations.find(g => g.generation.id === selectedGeneration.id)
    : null;

  // Get country name for display
  const selectedCountryName = selectedCountry === 'world' 
    ? 'World' 
    : countries.find(c => c.slug === selectedCountry)?.name || 'World';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Generation Age Ranges 2026: Gen Z, Millennial, Gen X, Boomer Calculator
          </h1>
          <p className="text-lg text-gray-600">
            What generation am I? Enter your birth year to find out. See 2026 age ranges and real population data for Gen Z, Millennials, Gen X, Baby Boomers, Gen Alpha.
          </p>
        </div>

        {/* Calculator Tool */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">What Generation Am I?</h2>
          
          <div className="mb-4">
            <div className="flex gap-4 items-center">
              <label htmlFor="birth-year" className="text-gray-700 font-medium">
                Birth Year:
              </label>
              <select
                id="birth-year"
                value={birthYear}
                onChange={(e) => handleBirthYearChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select year</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results - More Compact */}
          {selectedGeneration && selectedGenData && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
              <div className="mb-3">
                <h3 className="text-2xl font-bold text-gray-900">
                  You are a {selectedGeneration.name}
                </h3>
                <p className="text-gray-700">
                  Born {selectedGeneration.birthYearStart}-{selectedGeneration.birthYearEnd}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 mb-3">
                <div className="bg-white rounded p-3">
                  <div className="text-xs text-gray-600">Your age in 2026</div>
                  <div className="text-xl font-bold text-gray-900">{currentAge} years old</div>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="text-xs text-gray-600">Generation's global population</div>
                  <div className="text-xl font-bold text-gray-900">
                    {selectedGenData.population.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="text-xs text-gray-600">% of world population</div>
                  <div className="text-xl font-bold text-gray-900">
                    {selectedGenData.percentOfTotal.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Mini visualization with all labels */}
              <div className="bg-white rounded p-3">
                <div className="flex items-stretch gap-0.5 h-10">
                  {worldGenerations.map(gen => (
                    <div
                      key={gen.generation.id}
                      className={`relative flex-1 rounded-sm transition-all flex items-center justify-center ${
                        gen.generation.id === selectedGeneration.id
                          ? 'ring-2 ring-offset-1 ring-blue-600'
                          : 'opacity-70'
                      }`}
                      style={{ 
                        backgroundColor: gen.generation.color,
                        flexGrow: gen.percentOfTotal
                      }}
                      title={`${gen.generation.name}: ${gen.percentOfTotal.toFixed(1)}%`}
                    >
                      <span className="text-[8px] text-white font-semibold transform -rotate-45 whitespace-nowrap">
                        {gen.generation.name.replace('Generation', '').replace('Baby ', '')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-600">
                  <span>← Youngest</span>
                  <span>Oldest →</span>
                </div>
              </div>
            </div>
          )}

          {/* Country Selector - Separate Feature */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              See generation sizes for:
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={calculating}
            >
              <option value="world">🌍 World (All Countries)</option>
              {countries.map(country => (
                <option key={country.slug} value={country.slug}>
                  {country.flag || '🏳️'} {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Generation Population Distribution {selectedCountry !== 'world' && `- ${selectedCountryName}`}
          </h2>
          <div style={{ height: '400px' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900">
              Generation Breakdown by Population {selectedCountry !== 'world' && `- ${selectedCountryName}`}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr className="border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Generation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Birth Years
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Age Range (2026)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Population
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {countryGenerations.map((gen, index) => (
                  <tr key={gen.generation.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                          style={{ backgroundColor: gen.generation.color }}
                        />
                        <span className="font-medium text-gray-900">
                          {gen.generation.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {gen.generation.birthYearStart}-{gen.generation.birthYearEnd}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {gen.ageRange} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                      {gen.population.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                      {gen.percentOfTotal.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content sections */}
        <GenerationsContent worldGenerations={worldGenerations} />
      </div>
    </div>
  );
}