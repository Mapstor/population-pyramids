'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface BirthStatisticsProps {
  countryName: string;
  countrySlug: string;
  population: number;
  crudeBirthRate: number;
  fertilityData: any;
}

export default function BirthStatistics({
  countryName,
  countrySlug,
  population,
  crudeBirthRate,
  fertilityData
}: BirthStatisticsProps) {
  const [birthsToday, setBirthsToday] = useState(0);
  const [secondsUntilNext, setSecondsUntilNext] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Calculate comprehensive birth statistics
  const annualBirths = Math.round((population * crudeBirthRate) / 1000);
  const monthlyBirths = Math.round(annualBirths / 12);
  const weeklyBirths = Math.round(annualBirths / 52);
  const dailyBirths = Math.round(annualBirths / 365);
  const hourlyBirths = Math.round(dailyBirths / 24);
  const birthsPerMinute = (dailyBirths / 24 / 60);
  const birthsPerSecond = birthsPerMinute / 60;
  const secondsBetweenBirths = Math.round(86400 / dailyBirths);

  // Calculate historical comparisons
  const historicalData = fertilityData.historical || [];
  const currentYear = fertilityData.current?.year || 2024;
  const currentTFR = fertilityData.current?.totalFertilityRate || 0;
  
  // Peak birth rate year
  const peakYear = historicalData.reduce((max: any, d: any) => 
    d.crudebirthRate > (max?.crudebirthRate || 0) ? d : max, historicalData[0]);
  
  // Calculate percentage changes
  const declineFromPeak = peakYear ? ((peakYear.crudebirthRate - crudeBirthRate) / peakYear.crudebirthRate * 100) : 0;
  const annualBirthsAtPeak = peakYear ? Math.round((population * peakYear.crudebirthRate) / 1000) : 0;
  const birthsLostSincePeak = annualBirthsAtPeak - annualBirths;

  // Global comparisons - using real UN data
  // World birth rate is approximately 17 per 1,000 (UN 2024 data)
  // World population is approximately 8.1 billion (UN 2024)
  const worldPopulation = 8100000000;
  const worldBirthRate = 17; // per 1,000 (UN global average)
  const worldAnnualBirths = (worldPopulation * worldBirthRate) / 1000;
  const worldDailyBirths = Math.round(worldAnnualBirths / 365);
  const countryShareOfGlobal = (dailyBirths / worldDailyBirths) * 100;
  const birthsPerThousand = crudeBirthRate;
  
  // Note: We only show birth data as we don't have death rate in our dataset
  // Natural increase calculation removed to maintain data accuracy

  // Set client flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Live counter effect - only runs on client
  useEffect(() => {
    if (!isClient) return;

    // Calculate births so far today based on current time
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    const secondsSinceMidnight = Math.floor((now.getTime() - midnight.getTime()) / 1000);
    const birthsSinceMidnight = Math.floor(secondsSinceMidnight / secondsBetweenBirths);
    setBirthsToday(birthsSinceMidnight);
    setSecondsUntilNext(secondsBetweenBirths - (secondsSinceMidnight % secondsBetweenBirths));

    // Set up interval for live updates
    const interval = setInterval(() => {
      setBirthsToday(prev => prev + 1);
      setSecondsUntilNext(secondsBetweenBirths);
    }, secondsBetweenBirths * 1000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setSecondsUntilNext(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [secondsBetweenBirths, isClient]);

  // Sort historical data by year (ascending)
  const sortedHistoricalData = [...historicalData].sort((a: any, b: any) => a.year - b.year);
  
  // Get last 5 years of data for the table
  const last5Years = sortedHistoricalData.slice(-5);
  
  // Calculate actual births for last 5 years - ensure consistent rendering
  const birthsTableData = last5Years.map((yearData: any) => {
    const annualBirthsForYear = Math.round((population * yearData.crudebirthRate) / 1000);
    return {
      year: yearData.year,
      birthRate: yearData.crudebirthRate,
      totalFertilityRate: yearData.totalFertilityRate || 0,
      estimatedBirths: annualBirthsForYear,
      dailyBirths: Math.round(annualBirthsForYear / 365)
    };
  });
  
  // Prepare comprehensive chart data
  const chartData = {
    labels: sortedHistoricalData.map((d: any) => d.year),
    datasets: [
      {
        label: 'Crude Birth Rate',
        data: sortedHistoricalData.map((d: any) => d.crudebirthRate),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        yAxisID: 'y',
      },
      {
        label: 'Total Fertility Rate',
        data: sortedHistoricalData.map((d: any) => d.totalFertilityRate),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: false,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        yAxisID: 'y1',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context: any) {
            if (context.datasetIndex === 0) {
              const year = context.label;
              const rate = context.parsed.y;
              const estimatedBirths = Math.round((population * rate) / 1000);
              return `Est. Annual Births: ${estimatedBirths.toLocaleString()}`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Births per 1,000 population'
        },
        grid: {
          drawOnChartArea: true,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Children per woman (TFR)'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Year'
        }
      }
    }
  };

  return (
    <section id="birth-statistics" className="mb-8">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg shadow-sm p-6 border border-cyan-200">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">👶</span>
          <h2 className="text-2xl font-bold text-gray-900">
            Birth Statistics &amp; Natality Data
          </h2>
        </div>
        
        <div className="bg-white rounded-lg p-5 border border-cyan-100">
        
        {/* Professional Statistics Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Live Counter Panel */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
              Real-Time Birth Tracking
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-3xl font-bold text-blue-700">
                  {isClient ? birthsToday.toLocaleString() : '---'}
                </div>
                <div className="text-sm text-gray-600">Births today (since midnight)</div>
              </div>
              <div className="pt-3 border-t border-blue-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next birth:</span>
                  <span className="font-semibold">{isClient ? `${secondsUntilNext}s` : '--s'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-semibold">Every {secondsBetweenBirths}s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Daily projection:</span>
                  <span className="font-semibold">{dailyBirths.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Panel */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
              Current Birth Metrics
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{crudeBirthRate}</div>
                  <div className="text-xs text-gray-600">per 1,000 population</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{currentTFR}</div>
                  <div className="text-xs text-gray-600">children per woman</div>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Annual births:</span>
                  <span className="font-semibold">{annualBirths.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly average:</span>
                  <span className="font-semibold">{monthlyBirths.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Weekly average:</span>
                  <span className="font-semibold">{weeklyBirths.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Distribution Panel */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
              Temporal Distribution
            </h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Per Second:</span>
                  <span className="font-bold text-green-700">{birthsPerSecond.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Per Minute:</span>
                  <span className="font-bold text-green-700">{birthsPerMinute.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Per Hour:</span>
                  <span className="font-bold text-green-700">{hourlyBirths.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Per Day:</span>
                  <span className="font-bold text-green-700">{dailyBirths.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Per Year:</span>
                  <span className="font-bold text-green-700">{annualBirths.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Trends Chart */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Historical Birth Rate Trends (1965-{currentYear})</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div style={{ height: '350px' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
            {/* Chart Legend Explanation */}
            <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 rounded p-3 border border-blue-200">
                <div className="font-semibold text-blue-900 mb-1">Crude Birth Rate (Blue Line)</div>
                <div className="text-blue-800">
                  Number of live births per 1,000 people in the total population per year. 
                  Measures actual birth frequency in the population.
                </div>
              </div>
              <div className="bg-red-50 rounded p-3 border border-red-200">
                <div className="font-semibold text-red-900 mb-1">Total Fertility Rate (Red Line)</div>
                <div className="text-red-800">
                  Average number of children a woman would have in her lifetime. 
                  Key indicator of population replacement (2.1 = replacement level).
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Years Birth Statistics Table */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Birth Statistics - Last 5 Years</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Birth Rate<br/>(per 1,000)</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">TFR<br/>(children/woman)</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Births<br/>(estimated)</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Average</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {birthsTableData.length > 0 ? birthsTableData.map((row: any, index: number) => (
                  <tr key={row.year} className={index === birthsTableData.length - 1 ? 'bg-blue-50 font-semibold' : ''}>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.year}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900">{row.birthRate}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900">{row.totalFertilityRate ? row.totalFertilityRate.toFixed(2) : 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900">{row.estimatedBirths.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900">{row.dailyBirths.toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-sm text-center text-gray-500">No data available</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                <tr>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">5-Year Average</td>
                  <td className="px-4 py-3 text-sm text-center font-semibold text-gray-900">
                    {birthsTableData.length > 0 ? (birthsTableData.reduce((sum: number, row: any) => sum + row.birthRate, 0) / birthsTableData.length).toFixed(1) : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-center font-semibold text-gray-900">
                    {birthsTableData.length > 0 ? (birthsTableData.reduce((sum: number, row: any) => sum + row.totalFertilityRate, 0) / birthsTableData.length).toFixed(2) : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-center font-semibold text-gray-900">
                    {birthsTableData.length > 0 ? Math.round(birthsTableData.reduce((sum: number, row: any) => sum + row.estimatedBirths, 0) / birthsTableData.length).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-center font-semibold text-gray-900">
                    {birthsTableData.length > 0 ? Math.round(birthsTableData.reduce((sum: number, row: any) => sum + row.dailyBirths, 0) / birthsTableData.length).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            * Birth numbers calculated using crude birth rate × population for each year. Most recent year highlighted in blue.
          </p>
        </div>

        {/* Detailed Analysis Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Historical Comparison */}
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-sm mr-2">📈</span> Historical Analysis
            </h3>
            <div className="space-y-3">
              <div className="pb-3 border-b border-gray-100">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Peak birth rate year:</span>
                  <span className="font-semibold">{peakYear?.year || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Peak rate:</span>
                  <span className="font-semibold">{peakYear?.crudebirthRate || 'N/A'} per 1,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Decline from peak:</span>
                  <span className="font-semibold text-red-600">-{declineFromPeak.toFixed(1)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Annual births at peak:</span>
                  <span className="font-semibold">{annualBirthsAtPeak.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current annual births:</span>
                  <span className="font-semibold">{annualBirths.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Annual birth deficit:</span>
                  <span className="font-semibold text-red-600">-{birthsLostSincePeak.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Global Context */}
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-sm mr-2">🌍</span> Global Context
            </h3>
            <div className="space-y-3">
              <div className="pb-3 border-b border-gray-100">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">World daily births:</span>
                  <span className="font-semibold">{worldDailyBirths.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{countryName} daily births:</span>
                  <span className="font-semibold">{dailyBirths.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Share of global births:</span>
                  <span className="font-semibold text-blue-600">{countryShareOfGlobal.toFixed(3)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">World avg birth rate:</span>
                  <span className="font-semibold">{worldBirthRate} per 1,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{countryName} birth rate:</span>
                  <span className="font-semibold">{crudeBirthRate} per 1,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Relative to world avg:</span>
                  <span className={`font-semibold ${crudeBirthRate < worldBirthRate ? 'text-red-600' : 'text-green-600'}`}>
                    {((crudeBirthRate / worldBirthRate) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demographic Implications */}
        <div className="bg-amber-50 rounded-lg p-5 border border-amber-200">
          <h3 className="font-semibold text-gray-900 mb-3">Demographic Implications</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-amber-900 mb-2">Birth Rate Impact</h4>
              <ul className="space-y-1 text-amber-800">
                <li>• Birth rate: {crudeBirthRate} per 1,000</li>
                <li>• Annual births: {annualBirths.toLocaleString()}</li>
                <li>• Daily average: {dailyBirths.toLocaleString()}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-amber-900 mb-2">Fertility Context</h4>
              <ul className="space-y-1 text-amber-800">
                <li>• TFR: {currentTFR} children/woman</li>
                <li>• Replacement level: 2.1</li>
                <li>• {currentTFR < 2.1 ? 'Below replacement fertility' : 'Above replacement fertility'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-amber-900 mb-2">Economic Impact</h4>
              <ul className="space-y-1 text-amber-800">
                <li>• New consumers: {dailyBirths.toLocaleString()}/day</li>
                <li>• Future workforce: {annualBirths.toLocaleString()}/year</li>
                <li>• Dependency outlook: {currentTFR < 1.5 ? 'Critical' : currentTFR < 2.1 ? 'Concerning' : 'Stable'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Note */}
        <div className="mt-4 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
          <p>
            <strong>Data Source:</strong> UN World Population Prospects 2024. Birth statistics calculated using crude birth rate 
            ({crudeBirthRate} per 1,000) applied to current population ({population.toLocaleString()}). 
            Daily distribution assumes uniform births across the year. Real-time counter simulates births based on statistical average.
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}