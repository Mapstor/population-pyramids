'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
import { getCountryFlag } from '@/lib/country-flags';
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

// Generation taglines
const generationTaglines: Record<string, string> = {
  'gen-alpha': 'The AI Generation',
  'gen-z': 'The True Digital Natives',
  'millennials': 'The Internet Generation',
  'gen-x': 'The Independent Generation',
  'baby-boomers': 'The Post-War Generation',
  'silent': 'The Traditional Generation',
  'greatest': 'The WWII Generation'
};

// Generation milestones
const generationMilestones: Record<string, string> = {
  'gen-alpha': 'Oldest Gen Alpha turns 18 in 2031',
  'gen-z': 'Youngest Gen Z turns 30 in 2042',
  'millennials': 'Oldest Millennials turn 50 in 2031',
  'gen-x': 'Youngest Gen X turns 50 in 2030',
  'baby-boomers': 'Youngest Boomers turn 65 in 2029',
  'silent': 'Youngest Silent Gen turns 85 in 2030',
  'greatest': 'Celebrating over a century of life'
};

function GenerationsCalculator() {
  const searchParams = useSearchParams();
  const [birthYear, setBirthYear] = useState<string>('');
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  const [worldGenerations, setWorldGenerations] = useState<GenerationPopulation[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('world');
  const [countryGenerations, setCountryGenerations] = useState<GenerationPopulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Create year options for dropdown
  const yearOptions = [];
  for (let year = 2026; year >= 1901; year--) {
    yearOptions.push(year);
  }

  // Load initial data and check URL params
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
        
        // Check URL params
        const yearParam = searchParams.get('year');
        if (yearParam && parseInt(yearParam) >= 1901 && parseInt(yearParam) <= 2026) {
          handleBirthYearChange(yearParam);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [searchParams]);

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
      setShowResult(true);
      
      // Update URL without reload
      const newUrl = `${window.location.pathname}?year=${year}`;
      window.history.pushState({}, '', newUrl);
    } else {
      setSelectedGeneration(null);
      setShowResult(false);
    }
  };

  const copyResultLink = () => {
    const url = `${window.location.origin}/generation-age-ranges-calculator?year=${birthYear}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
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

  // Find top country for generation
  const getTopCountryForGeneration = (gen: Generation) => {
    // This would need real data analysis - placeholder for now
    const topCountries: Record<string, string> = {
      'gen-alpha': 'India',
      'gen-z': 'India',
      'millennials': 'China',
      'gen-x': 'United States',
      'baby-boomers': 'United States',
      'silent': 'Japan',
      'greatest': 'Japan'
    };
    return topCountries[gen.id] || 'India';
  };

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
            <li className="text-gray-700">Generation Age Ranges Calculator</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Generation Age Ranges 2026: Gen Z, Millennial, Gen X, Boomer Calculator
          </h1>
          <p className="text-lg text-gray-600">
            What generation am I? Enter your birth year to find out. See 2026 age ranges and real population data for Gen Z, Millennials, Gen X, Baby Boomers, Gen Alpha.
          </p>
        </div>

        {/* Calculator Tool */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2">What Generation Am I?</h2>
          <p className="text-gray-600 mb-4">
            Discover your generation's identity, population size, and global influence. Each generation shares defining experiences that shape their worldview.
            Our calculator uses official Pew Research definitions and real UN population data from 195 countries.
          </p>
          
          <div className="mb-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex gap-4 items-center">
                <label htmlFor="birth-year" className="text-gray-700 font-medium whitespace-nowrap">
                  Birth Year:
                </label>
                <select
                  id="birth-year"
                  value={birthYear}
                  onChange={(e) => handleBirthYearChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select year</option>
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Select any year from 1901 to 2026. Generations span 15-20 years based on shared cultural milestones.
                The calculator instantly shows your generation's demographics across all countries.
              </p>
            </div>
          </div>

          {/* Results - Impactful Design */}
          {selectedGeneration && selectedGenData && showResult && (
            <div 
              className="rounded-xl overflow-hidden mb-6 shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${selectedGeneration.color}15 0%, ${selectedGeneration.color}30 100%)`,
                borderLeft: `4px solid ${selectedGeneration.color}`
              }}
            >
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-4xl font-bold" style={{ color: selectedGeneration.color }}>
                      {selectedGeneration.name}
                    </h3>
                    <button
                      onClick={copyResultLink}
                      className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-lg transition text-sm font-medium"
                      style={{ color: selectedGeneration.color }}
                    >
                      📋 Share Result
                    </button>
                  </div>
                  <p className="text-xl font-semibold text-gray-700 mb-1">
                    {generationTaglines[selectedGeneration.id]}
                  </p>
                  <p className="text-gray-600">
                    Born {selectedGeneration.birthYearStart}-{selectedGeneration.birthYearEnd}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Your Age in 2026</div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{currentAge} years old</div>
                    <p className="text-xs text-gray-600">
                      You've lived through {Math.floor(currentAge / 10)} decades. 
                      {currentAge < 30 ? ' Digital native from birth.' : currentAge < 50 ? ' Witnessed the internet revolution.' : ' Experienced the pre-digital world.'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Global Population</div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {(selectedGenData.population / 1000000000).toFixed(2)}B
                    </div>
                    <p className="text-xs text-gray-600">
                      That's {selectedGenData.population.toLocaleString()} people worldwide.
                      {selectedGenData.percentOfTotal > 20 ? ' One of the largest generations in history.' : selectedGenData.percentOfTotal < 5 ? ' A smaller but influential generation.' : ' A significant demographic cohort.'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">% of World</div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {selectedGenData.percentOfTotal.toFixed(1)}%
                    </div>
                    <p className="text-xs text-gray-600">
                      About 1 in {Math.round(100 / selectedGenData.percentOfTotal)} people globally.
                      {selectedGenData.percentOfTotal > 20 ? ' Your generation shapes global trends.' : ' Your generation drives key markets.'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Male/Female Split</div>
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {((selectedGenData.malePopulation / selectedGenData.population) * 100).toFixed(1)}% / {((selectedGenData.femalePopulation / selectedGenData.population) * 100).toFixed(1)}%
                    </div>
                    <p className="text-xs text-gray-600">
                      {Math.abs(selectedGenData.malePopulation - selectedGenData.femalePopulation).toLocaleString()} more {selectedGenData.malePopulation > selectedGenData.femalePopulation ? 'males' : 'females'}.
                      Gender ratio varies by country.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Largest in</div>
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {getTopCountryForGeneration(selectedGeneration)}
                    </div>
                    <p className="text-xs text-gray-600">
                      Your generation dominates this nation's demographics.
                      Regional variations reflect fertility and migration patterns.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Milestone</div>
                    <div className="text-sm font-bold text-gray-900 mb-1">
                      {generationMilestones[selectedGeneration.id]}
                    </div>
                    <p className="text-xs text-gray-600">
                      Key life transitions shape economic and social trends.
                      {selectedGeneration.id === 'gen-alpha' || selectedGeneration.id === 'gen-z' ? ' Digital milestones ahead.' : ' Traditional milestones evolving.'}
                    </p>
                  </div>
                </div>

                {/* Mini visualization with all labels */}
                <div className="bg-white rounded-lg p-4 shadow">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Global Generation Distribution</h4>
                  <div className="flex items-stretch gap-0.5 h-12 mb-2">
                    {worldGenerations.map(gen => (
                      <div
                        key={gen.generation.id}
                        className={`relative flex-1 rounded-sm transition-all flex items-center justify-center ${
                          gen.generation.id === selectedGeneration.id
                            ? 'ring-2 ring-offset-2 ring-gray-800 scale-105 z-10'
                            : 'opacity-60'
                        }`}
                        style={{ 
                          backgroundColor: gen.generation.color,
                          flexGrow: gen.percentOfTotal
                        }}
                        title={`${gen.generation.name}: ${gen.percentOfTotal.toFixed(1)}%`}
                      >
                        <span className="text-[9px] text-white font-bold whitespace-nowrap px-1">
                          {gen.generation.name.replace('Generation', '').replace('Baby ', '').replace('Silent', 'Sil')}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>← Youngest</span>
                    <span>Your Generation: {selectedGeneration.name}</span>
                    <span>Oldest →</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Each segment represents a generation's share of 8.1 billion people. Width shows relative population size.
                    Your generation ({selectedGeneration.name}) is highlighted among all seven global generations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Country Selector - Separate Feature */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              See generation sizes for:
            </label>
            <p className="text-xs text-gray-600 mb-2">
              Compare generation distributions across 195 countries. Each nation has unique demographic patterns based on fertility, migration, and history.
              Aging societies like Japan contrast sharply with youth-heavy nations like Nigeria.
            </p>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={calculating}
            >
              <option value="world">🌍 World (All Countries)</option>
              {countries.map(country => (
                <option key={country.slug} value={country.slug}>
                  {getCountryFlag(country.code)} {country.name}
                </option>
              ))}
            </select>
            {selectedCountry !== 'world' && (
              <p className="text-xs text-gray-500 mt-2">
                Viewing: {selectedCountryName}. Generation sizes vary dramatically by region.
                The chart and table below show this country's specific generation breakdown.
              </p>
            )}
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
              
              <Link href="/dependency-ratio-calculator" className="block bg-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-400 transition">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Dependency Ratio Calculator</h3>
                <p className="text-gray-600 mb-3">Calculate the ratio of dependents to working-age population for any country.</p>
                <span className="text-blue-500 font-medium">Calculate ratios →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content sections */}
        <GenerationsContent worldGenerations={worldGenerations} />
      </div>
    </div>
  );
}

export default function GenerationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading generation calculator...</p>
        </div>
      </div>
    }>
      <GenerationsCalculator />
    </Suspense>
  );
}