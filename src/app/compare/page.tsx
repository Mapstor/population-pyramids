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
import { calculateMetrics } from '@/lib/calculations';
import type { CountryPopulationData, YearData, DemographicMetrics } from '@/types/population';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Country {
  slug: string;
  name: string;
  region: string;
  population2024: number;
}

interface ComparisonCountry {
  slug: string;
  name: string;
  data: YearData | null;
  metrics: DemographicMetrics | null;
}

const popularComparisons = [
  { country1: 'united-states', country2: 'china', label: 'USA vs China' },
  { country1: 'india', country2: 'china', label: 'India vs China' },
  { country1: 'germany', country2: 'japan', label: 'Germany vs Japan' },
  { country1: 'nigeria', country2: 'ethiopia', label: 'Nigeria vs Ethiopia' },
  { country1: 'brazil', country2: 'mexico', label: 'Brazil vs Mexico' },
  { country1: 'united-kingdom', country2: 'france', label: 'UK vs France' }
];

export default function ComparePage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry1, setSelectedCountry1] = useState<string>('');
  const [selectedCountry2, setSelectedCountry2] = useState<string>('');
  const [comparisonData1, setComparisonData1] = useState<ComparisonCountry | null>(null);
  const [comparisonData2, setComparisonData2] = useState<ComparisonCountry | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const countriesData = await loadCountries();
        setCountries(countriesData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load countries:', error);
        setLoading(false);
      }
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    async function fetchComparisonData() {
      if (!selectedCountry1 || !selectedCountry2) {
        setComparisonData1(null);
        setComparisonData2(null);
        return;
      }

      setDataLoading(true);
      try {
        const [countryData1, countryData2] = await Promise.all([
          loadCountryData(selectedCountry1),
          loadCountryData(selectedCountry2)
        ]);

        const yearData1 = countryData1.years[selectedYear.toString()];
        const yearData2 = countryData2.years[selectedYear.toString()];

        setComparisonData1({
          slug: selectedCountry1,
          name: countryData1.countryName,
          data: yearData1 || null,
          metrics: yearData1 ? calculateMetrics(yearData1) : null
        });

        setComparisonData2({
          slug: selectedCountry2,
          name: countryData2.countryName,
          data: yearData2 || null,
          metrics: yearData2 ? calculateMetrics(yearData2) : null
        });
      } catch (error) {
        console.error('Failed to load comparison data:', error);
        setComparisonData1(null);
        setComparisonData2(null);
      }
      setDataLoading(false);
    }

    fetchComparisonData();
  }, [selectedCountry1, selectedCountry2, selectedYear]);

  // Generate comparison insights
  const generateComparativeText = () => {
    if (!comparisonData1?.metrics || !comparisonData2?.metrics || !comparisonData1?.data || !comparisonData2?.data) {
      return '';
    }

    const insights: string[] = [];
    const country1 = comparisonData1.name;
    const country2 = comparisonData2.name;
    const metrics1 = comparisonData1.metrics;
    const metrics2 = comparisonData2.metrics;
    const data1 = comparisonData1.data;
    const data2 = comparisonData2.data;

    // Population comparison
    if (data1.totalPopulation > data2.totalPopulation * 1.1) {
      insights.push(`${country1} has a significantly larger population (${(data1.totalPopulation / 1000000).toFixed(1)}M) than ${country2} (${(data2.totalPopulation / 1000000).toFixed(1)}M)`);
    } else if (data2.totalPopulation > data1.totalPopulation * 1.1) {
      insights.push(`${country2} has a significantly larger population (${(data2.totalPopulation / 1000000).toFixed(1)}M) than ${country1} (${(data1.totalPopulation / 1000000).toFixed(1)}M)`);
    } else {
      insights.push(`${country1} and ${country2} have similar population sizes with ${(data1.totalPopulation / 1000000).toFixed(1)}M and ${(data2.totalPopulation / 1000000).toFixed(1)}M respectively`);
    }

    // Age structure comparison
    if (metrics1.medianAge > metrics2.medianAge + 2) {
      insights.push(`${country1} has an older population with a median age of ${metrics1.medianAge.toFixed(1)} years compared to ${country2}'s ${metrics2.medianAge.toFixed(1)} years`);
    } else if (metrics2.medianAge > metrics1.medianAge + 2) {
      insights.push(`${country2} has an older population with a median age of ${metrics2.medianAge.toFixed(1)} years compared to ${country1}'s ${metrics1.medianAge.toFixed(1)} years`);
    }

    // Pyramid type comparison
    if (metrics1.pyramidType !== metrics2.pyramidType) {
      insights.push(`The countries show different demographic patterns: ${country1} has a ${metrics1.pyramidType} pyramid while ${country2} displays a ${metrics2.pyramidType} structure`);
    }

    return insights.slice(0, 3).join('. ') + '.';
  };

  // Create side-by-side pyramid charts with fixed scale
  const createPyramidChart = (country: ComparisonCountry, isFirst: boolean) => {
    if (!country.data) return null;

    // Calculate fixed scale across both countries
    const maxPopulation1 = comparisonData1?.data ? Math.max(
      ...comparisonData1.data.ageGroups.map(ag => Math.max(ag.male, ag.female))
    ) : 0;
    const maxPopulation2 = comparisonData2?.data ? Math.max(
      ...comparisonData2.data.ageGroups.map(ag => Math.max(ag.male, ag.female))
    ) : 0;
    const maxScale = Math.ceil(Math.max(maxPopulation1, maxPopulation2) * 1.1);

    const chartData = {
      labels: country.data.ageGroups.map(ag => ag.ageRange).reverse(),
      datasets: [
        {
          label: 'Male',
          data: country.data.ageGroups.map(ag => -ag.male).reverse(),
          backgroundColor: isFirst ? 'rgba(59, 130, 246, 0.8)' : 'rgba(34, 197, 94, 0.8)',
          borderColor: isFirst ? 'rgba(59, 130, 246, 1)' : 'rgba(34, 197, 94, 1)',
          borderWidth: 1,
        },
        {
          label: 'Female',
          data: country.data.ageGroups.map(ag => ag.female).reverse(),
          backgroundColor: isFirst ? 'rgba(236, 72, 153, 0.8)' : 'rgba(251, 146, 60, 0.8)',
          borderColor: isFirst ? 'rgba(236, 72, 153, 1)' : 'rgba(251, 146, 60, 1)',
          borderWidth: 1,
        }
      ]
    };

    const options = {
      indexAxis: 'y' as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `${country.name} (${selectedYear})`,
          font: { size: 16, weight: 'bold' as const }
        },
        legend: {
          display: true,
          position: 'top' as const
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const value = Math.abs(context.parsed.x);
              const gender = context.parsed.x < 0 ? 'Male' : 'Female';
              return `${gender}: ${value.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          min: -maxScale,
          max: maxScale,
          ticks: {
            callback: function(value: any) {
              return Math.abs(value).toLocaleString();
            }
          }
        },
        y: {
          stacked: true,
        }
      }
    };

    return <Bar data={chartData} options={options} />;
  };

  const availableYears = [2024, 2023, 2022, 2021, 2020, 2015, 2010, 2005, 2000, 1995, 1990, 1985, 1980, 1975, 1970];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-lg">Loading countries...</div>
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
              <Link href="/" className="hover:text-blue-600 transition">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">Compare Countries</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Compare Population Pyramids
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare demographic trends and age distributions between two countries side by side.
            See how different nations stack up in terms of population structure and demographic transitions.
          </p>
        </div>

        {/* Popular Comparisons */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Popular Comparisons
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {popularComparisons.map(({ country1, country2, label }) => (
              <button
                key={`${country1}-${country2}`}
                onClick={() => {
                  setSelectedCountry1(country1);
                  setSelectedCountry2(country2);
                }}
                className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-center"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Country Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Select Countries to Compare
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Country
              </label>
              <select
                value={selectedCountry1}
                onChange={(e) => setSelectedCountry1(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select first country...</option>
                {countries.map(country => (
                  <option key={country.slug} value={country.slug}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Second Country
              </label>
              <select
                value={selectedCountry2}
                onChange={(e) => setSelectedCountry2(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select second country...</option>
                {countries.map(country => (
                  <option key={country.slug} value={country.slug}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Comparison Results */}
        {comparisonData1 && comparisonData2 && comparisonData1.data && comparisonData2.data && (
          <>
            {/* Comparative Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Demographic Comparison
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>{generateComparativeText()}</p>
              </div>
            </div>

            {/* Side-by-Side Pyramids */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div style={{ height: '600px' }}>
                  {createPyramidChart(comparisonData1, true)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div style={{ height: '600px' }}>
                  {createPyramidChart(comparisonData2, false)}
                </div>
              </div>
            </div>

            {/* Detailed Comparison Table */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Detailed Metrics Comparison
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Metric</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-blue-600">{comparisonData1.name}</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-green-600">{comparisonData2.name}</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Difference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900">Total Population</td>
                      <td className="px-4 py-3 text-center">{comparisonData1.data.totalPopulation.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">{comparisonData2.data.totalPopulation.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        {((comparisonData1.data.totalPopulation - comparisonData2.data.totalPopulation) / 1000000).toFixed(1)}M
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900">Median Age</td>
                      <td className="px-4 py-3 text-center">{comparisonData1.metrics?.medianAge.toFixed(1)} years</td>
                      <td className="px-4 py-3 text-center">{comparisonData2.metrics?.medianAge.toFixed(1)} years</td>
                      <td className="px-4 py-3 text-center">
                        {comparisonData1.metrics && comparisonData2.metrics ? 
                          (comparisonData1.metrics.medianAge - comparisonData2.metrics.medianAge).toFixed(1) : 'N/A'} years
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900">Youth Percentage (0-14)</td>
                      <td className="px-4 py-3 text-center">{comparisonData1.metrics?.youthPercentage.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-center">{comparisonData2.metrics?.youthPercentage.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-center">
                        {comparisonData1.metrics && comparisonData2.metrics ? 
                          (comparisonData1.metrics.youthPercentage - comparisonData2.metrics.youthPercentage).toFixed(1) : 'N/A'}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900">Working Age (15-64)</td>
                      <td className="px-4 py-3 text-center">{comparisonData1.metrics?.workingAgePercentage.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-center">{comparisonData2.metrics?.workingAgePercentage.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-center">
                        {comparisonData1.metrics && comparisonData2.metrics ? 
                          (comparisonData1.metrics.workingAgePercentage - comparisonData2.metrics.workingAgePercentage).toFixed(1) : 'N/A'}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900">Elderly Percentage (65+)</td>
                      <td className="px-4 py-3 text-center">{comparisonData1.metrics?.elderlyPercentage.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-center">{comparisonData2.metrics?.elderlyPercentage.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-center">
                        {comparisonData1.metrics && comparisonData2.metrics ? 
                          (comparisonData1.metrics.elderlyPercentage - comparisonData2.metrics.elderlyPercentage).toFixed(1) : 'N/A'}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900">Dependency Ratio</td>
                      <td className="px-4 py-3 text-center">{comparisonData1.metrics?.dependencyRatio.toFixed(1)}</td>
                      <td className="px-4 py-3 text-center">{comparisonData2.metrics?.dependencyRatio.toFixed(1)}</td>
                      <td className="px-4 py-3 text-center">
                        {comparisonData1.metrics && comparisonData2.metrics ? 
                          (comparisonData1.metrics.dependencyRatio - comparisonData2.metrics.dependencyRatio).toFixed(1) : 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900">Pyramid Type</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                          {comparisonData1.metrics?.pyramidType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full capitalize">
                          {comparisonData2.metrics?.pyramidType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Individual Country Links */}
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href={`/${comparisonData1.slug}`}
                className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  Explore {comparisonData1.name} in Detail →
                </h3>
                <p className="text-gray-600">
                  View detailed demographic analysis, historical trends, and regional comparisons for {comparisonData1.name}.
                </p>
              </Link>
              
              <Link
                href={`/${comparisonData2.slug}`}
                className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  Explore {comparisonData2.name} in Detail →
                </h3>
                <p className="text-gray-600">
                  View detailed demographic analysis, historical trends, and regional comparisons for {comparisonData2.name}.
                </p>
              </Link>
            </div>
          </>
        )}

        {/* Loading State */}
        {dataLoading && selectedCountry1 && selectedCountry2 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-lg text-gray-600">Loading comparison data...</div>
          </div>
        )}

        {/* Instructions */}
        {(!selectedCountry1 || !selectedCountry2) && !dataLoading && (
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">
              Ready to Compare Demographics?
            </h3>
            <p className="text-blue-700 text-lg mb-6">
              Select two countries above to see their population pyramids side by side and compare demographic trends.
            </p>
            <div className="text-blue-600">
              <p>✓ Side-by-side population pyramids</p>
              <p>✓ Detailed metrics comparison</p>
              <p>✓ AI-generated demographic insights</p>
              <p>✓ Historical data from 1970-2024</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}