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
import type { YearData, DemographicMetrics, CountryPopulationData } from '@/types/population';
import { getCountryNeighbors, getRegionalCountries } from '@/lib/country-neighbors';
import { loadCountryData } from '@/lib/data-loader';
import { calculateMetrics } from '@/lib/calculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RegionalComparisonProps {
  currentCountry: {
    slug: string;
    name: string;
    data: YearData;
    metrics: DemographicMetrics;
  };
  year: number;
}

interface ComparisonCountry {
  slug: string;
  name: string;
  data: YearData | null;
  metrics: DemographicMetrics | null;
}

export default function RegionalComparison({ currentCountry, year }: RegionalComparisonProps) {
  const [comparisonCountries, setComparisonCountries] = useState<ComparisonCountry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNeighborData() {
      setIsLoading(true);
      
      // Get neighbor countries (try neighbors first, then regional)
      let neighborSlugs = getCountryNeighbors(currentCountry.slug);
      if (neighborSlugs.length === 0) {
        neighborSlugs = getRegionalCountries(currentCountry.slug);
      }
      
      // Limit to 4 countries for clean layout
      neighborSlugs = neighborSlugs.slice(0, 4);
      
      const comparisons: ComparisonCountry[] = [];
      
      for (const slug of neighborSlugs) {
        try {
          const countryData = await loadCountryData(slug);
          const yearData = countryData.years[year.toString()];
          const metrics = yearData ? calculateMetrics(yearData) : null;
          
          comparisons.push({
            slug,
            name: countryData.countryName,
            data: yearData || null,
            metrics: metrics
          });
        } catch (error) {
          console.error(`Failed to load data for ${slug}:`, error);
          comparisons.push({
            slug,
            name: slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            data: null,
            metrics: null
          });
        }
      }
      
      setComparisonCountries(comparisons);
      setIsLoading(false);
    }

    loadNeighborData();
  }, [currentCountry.slug, year]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          How Does {currentCountry.name} Compare to Its Neighbors?
        </h2>
        <div className="text-gray-500">Loading regional comparison...</div>
      </div>
    );
  }

  // Generate comparison insights
  const generateInsights = () => {
    const validCountries = comparisonCountries.filter(c => c.metrics);
    if (validCountries.length === 0) return '';

    const insights: string[] = [];
    
    // Median age comparisons
    const olderCountries = validCountries.filter(c => c.metrics!.medianAge > currentCountry.metrics.medianAge);
    const youngerCountries = validCountries.filter(c => c.metrics!.medianAge < currentCountry.metrics.medianAge);
    
    if (olderCountries.length > 0) {
      insights.push(`${currentCountry.name} has a younger population than ${olderCountries.map(c => c.name).join(', ')}`);
    }
    if (youngerCountries.length > 0) {
      insights.push(`${currentCountry.name} has an older population than ${youngerCountries.map(c => c.name).join(', ')}`);
    }
    
    // Population size comparison
    const largerCountries = validCountries.filter(c => c.data!.totalPopulation > currentCountry.data.totalPopulation);
    const smallerCountries = validCountries.filter(c => c.data!.totalPopulation < currentCountry.data.totalPopulation);
    
    if (largerCountries.length > 0) {
      insights.push(`${currentCountry.name} has a smaller population than ${largerCountries.map(c => c.name).join(', ')}`);
    }
    if (smallerCountries.length > 0) {
      insights.push(`${currentCountry.name} has a larger population than ${smallerCountries.map(c => c.name).join(', ')}`);
    }

    return insights.slice(0, 2).join('. ') + '.';
  };

  // Create mini pyramid charts
  const createMiniChart = (country: ComparisonCountry, isCurrentCountry = false) => {
    if (!country.data) return null;

    const chartData = {
      labels: country.data.ageGroups.map(ag => ag.ageRange).reverse(),
      datasets: [
        {
          label: 'Male',
          data: country.data.ageGroups.map(ag => -ag.male).reverse(),
          backgroundColor: isCurrentCountry ? 'rgba(34, 197, 94, 0.8)' : 'rgba(59, 130, 246, 0.8)',
          borderColor: isCurrentCountry ? 'rgba(34, 197, 94, 1)' : 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
        {
          label: 'Female',
          data: country.data.ageGroups.map(ag => ag.female).reverse(),
          backgroundColor: isCurrentCountry ? 'rgba(251, 146, 60, 0.8)' : 'rgba(236, 72, 153, 0.8)',
          borderColor: isCurrentCountry ? 'rgba(251, 146, 60, 1)' : 'rgba(236, 72, 153, 1)',
          borderWidth: 1,
        }
      ]
    };

    const options = {
      indexAxis: 'y' as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: {
          stacked: true,
          display: false,
        },
        y: {
          stacked: true,
          display: false,
        }
      }
    };

    return <Bar data={chartData} options={options} />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        How Does {currentCountry.name} Compare to Its Neighbors?
      </h2>
      
      {/* Insights */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-gray-700 leading-relaxed">
          {generateInsights()}
        </p>
      </div>

      {/* Mini Pyramids Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {/* Current Country (highlighted) */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="h-32 mb-3">
            {createMiniChart({ 
              slug: currentCountry.slug, 
              name: currentCountry.name, 
              data: currentCountry.data, 
              metrics: currentCountry.metrics 
            }, true)}
          </div>
          <h3 className="font-bold text-sm text-center text-green-800 mb-1">
            {currentCountry.name}
          </h3>
          <div className="text-xs text-center text-green-600">
            <div>Pop: {(currentCountry.data.totalPopulation / 1000000).toFixed(1)}M</div>
            <div>Age: {currentCountry.metrics.medianAge.toFixed(1)}</div>
          </div>
        </div>

        {/* Comparison Countries */}
        {comparisonCountries.map((country) => (
          <Link 
            key={country.slug} 
            href={`/${country.slug}`}
            className="block bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition"
          >
            <div className="h-32 mb-3">
              {createMiniChart(country)}
            </div>
            <h3 className="font-semibold text-sm text-center text-gray-800 mb-1">
              {country.name}
            </h3>
            {country.data && country.metrics ? (
              <div className="text-xs text-center text-gray-600">
                <div>Pop: {(country.data.totalPopulation / 1000000).toFixed(1)}M</div>
                <div>Age: {country.metrics.medianAge.toFixed(1)}</div>
              </div>
            ) : (
              <div className="text-xs text-center text-gray-400">No data</div>
            )}
          </Link>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Country</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Population</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Median Age</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Youth %</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Elderly %</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Pyramid Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* Current Country Row (highlighted) */}
            <tr className="bg-green-50">
              <td className="px-4 py-3 font-semibold text-green-800">
                {currentCountry.name} (Current)
              </td>
              <td className="px-4 py-3 text-right text-green-800">
                {currentCountry.data.totalPopulation.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right text-green-800">
                {currentCountry.metrics.medianAge.toFixed(1)}
              </td>
              <td className="px-4 py-3 text-right text-green-800">
                {currentCountry.metrics.youthPercentage.toFixed(1)}%
              </td>
              <td className="px-4 py-3 text-right text-green-800">
                {currentCountry.metrics.elderlyPercentage.toFixed(1)}%
              </td>
              <td className="px-4 py-3 text-center">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full capitalize">
                  {currentCountry.metrics.pyramidType}
                </span>
              </td>
            </tr>

            {/* Comparison Countries */}
            {comparisonCountries.map((country) => (
              <tr key={country.slug} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link 
                    href={`/${country.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {country.name}
                  </Link>
                </td>
                {country.data && country.metrics ? (
                  <>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {country.data.totalPopulation.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {country.metrics.medianAge.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {country.metrics.youthPercentage.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {country.metrics.elderlyPercentage.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full capitalize">
                        {country.metrics.pyramidType}
                      </span>
                    </td>
                  </>
                ) : (
                  <td colSpan={5} className="px-4 py-3 text-center text-gray-400">
                    Data not available
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Regional Context */}
      <div className="mt-6 text-sm text-gray-600">
        <p>
          Explore more countries in this region by clicking on the country names above. 
          Demographic comparisons help understand regional development patterns and population trends.
        </p>
      </div>
    </div>
  );
}