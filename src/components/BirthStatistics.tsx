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

interface SeriesRow {
  year: number;
  births: number | null;
  cbr: number | null;
  tfr: number | null;
  projected: boolean;
}

interface BirthStatisticsProps {
  countryName: string;
  countrySlug: string;
  referenceYear: number;
  /** UN WPP 2024 births for the reference year (persons). */
  births: number;
  /** UN crude birth rate for the reference year (per 1,000). */
  crudeBirthRate: number;
  /** UN total fertility rate for the reference year. */
  tfr: number;
  /** Annual UN series 1950 → reference year (chart + recent-years table). */
  series: SeriesRow[];
  /** Peak crude birth rate over the 1950–2023 estimates. */
  peakCbr: { year: number; value: number } | null;
  /** Peak annual births over the 1950–2023 estimates. */
  peakBirths: { year: number; value: number } | null;
  /** World figures for the reference year (from world.json). */
  world: { births: number; birthsPerDay: number; crudeBirthRate: number };
}

export default function BirthStatistics({
  countryName,
  referenceYear,
  births,
  crudeBirthRate,
  tfr,
  series,
  peakCbr,
  peakBirths,
  world,
}: BirthStatisticsProps) {
  const [birthsToday, setBirthsToday] = useState(0);
  const [secondsUntilNext, setSecondsUntilNext] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // All figures are UN WPP 2024 values — no computed births.
  const annualBirths = births;
  const monthlyBirths = Math.round(annualBirths / 12);
  const weeklyBirths = Math.round(annualBirths / 52);
  const dailyBirths = Math.round(annualBirths / 365);
  const hourlyBirths = Math.round(dailyBirths / 24);
  const birthsPerMinute = dailyBirths / 24 / 60;
  const birthsPerSecond = birthsPerMinute / 60;
  const secondsBetweenBirths = dailyBirths > 0 ? Math.round(86400 / dailyBirths) : 0;

  const declineFromPeak = peakCbr && peakCbr.value > 0 ? ((peakCbr.value - crudeBirthRate) / peakCbr.value) * 100 : 0;

  // Global context — all from world.json for the reference year.
  const worldDailyBirths = world.birthsPerDay;
  const worldBirthRate = world.crudeBirthRate;
  const countryShareOfGlobal = world.births > 0 ? (annualBirths / world.births) * 100 : 0;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || secondsBetweenBirths <= 0) return;
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    const secondsSinceMidnight = Math.floor((now.getTime() - midnight.getTime()) / 1000);
    setBirthsToday(Math.floor(secondsSinceMidnight / secondsBetweenBirths));
    setSecondsUntilNext(secondsBetweenBirths - (secondsSinceMidnight % secondsBetweenBirths));
    const interval = setInterval(() => {
      setBirthsToday((prev) => prev + 1);
      setSecondsUntilNext(secondsBetweenBirths);
    }, secondsBetweenBirths * 1000);
    const countdownInterval = setInterval(() => {
      setSecondsUntilNext((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [secondsBetweenBirths, isClient]);

  // Recent-years table: reference year and the five before it (2021–2026), each labelled.
  const tableRows = series
    .filter((r) => r.year >= referenceYear - 5 && r.year <= referenceYear)
    .sort((a, b) => a.year - b.year);

  const chartData = {
    labels: series.map((d) => d.year),
    datasets: [
      {
        label: 'Crude Birth Rate',
        data: series.map((d) => d.cbr),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
        yAxisID: 'y',
      },
      {
        label: 'Total Fertility Rate',
        data: series.map((d) => d.tfr),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: false,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { display: true, position: 'top' as const },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: { display: true, text: 'Births per 1,000 population' },
        grid: { drawOnChartArea: true },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: { display: true, text: 'Children per woman (TFR)' },
        grid: { drawOnChartArea: false },
      },
      x: { title: { display: true, text: 'Year' } },
    },
  };

  return (
    <section id="birth-statistics" className="mb-8">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg shadow-sm p-6 border border-cyan-200">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">👶</span>
          <h2 className="text-2xl font-bold text-gray-900">Birth Statistics &amp; Natality Data</h2>
        </div>

        <div className="bg-white rounded-lg p-5 border border-cyan-100">
          {/* Professional Statistics Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Live Counter Panel */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                Births per day (UN projection)
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
                    <span className="text-gray-600">Daily ({referenceYear}):</span>
                    <span className="font-semibold">{dailyBirths.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 pt-1">
                  Simulated from the UN WPP 2024 projection of {annualBirths.toLocaleString()} births in {referenceYear}.
                </p>
              </div>
            </div>

            {/* Key Metrics Panel */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                Current Birth Metrics ({referenceYear})
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{crudeBirthRate.toFixed(1)}</div>
                    <div className="text-xs text-gray-600">per 1,000 population</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{tfr.toFixed(2)}</div>
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
            <h3 className="font-semibold text-gray-900 mb-3">Historical Birth Rate Trends (1950–{referenceYear})</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div style={{ height: '350px' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
              <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 rounded p-3 border border-blue-200">
                  <div className="font-semibold text-blue-900 mb-1">Crude Birth Rate (Blue Line)</div>
                  <div className="text-blue-800">
                    Live births per 1,000 people per year. Measures actual birth frequency in the population.
                  </div>
                </div>
                <div className="bg-red-50 rounded p-3 border border-red-200">
                  <div className="font-semibold text-red-900 mb-1">Total Fertility Rate (Red Line)</div>
                  <div className="text-red-800">
                    Average number of children a woman would have in her lifetime (2.1 = replacement level).
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Years Birth Statistics Table (UN WPP 2024) */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Birth Statistics — {referenceYear - 5}–{referenceYear}</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Births</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Birth Rate<br/>(per 1,000)</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">TFR<br/>(children/woman)</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tableRows.length > 0 ? tableRows.map((row) => (
                    <tr key={row.year} className={row.year === referenceYear ? 'bg-blue-50 font-semibold' : ''}>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.year}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-900">{row.births != null ? row.births.toLocaleString() : 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-900">{row.cbr != null ? row.cbr.toFixed(1) : 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-900">{row.tfr != null ? row.tfr.toFixed(2) : 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span className={`text-xs px-2 py-1 rounded ${row.projected ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}>
                          {row.projected ? 'projection' : 'estimate'}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-sm text-center text-gray-500">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
                    <span className="text-gray-600">Highest birth rate since 1950:</span>
                    <span className="font-semibold">{peakCbr ? `${peakCbr.value.toFixed(1)} per 1,000 (${peakCbr.year})` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Decline from peak rate:</span>
                    <span className="font-semibold text-red-600">-{declineFromPeak.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Most births since 1950:</span>
                    <span className="font-semibold">{peakBirths ? `${peakBirths.value.toLocaleString()} (${peakBirths.year})` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Births in {referenceYear}:</span>
                    <span className="font-semibold">{annualBirths.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Context — world.json, reference year */}
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-sm mr-2">🌍</span> Global Context ({referenceYear})
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
                    <span className="font-semibold">{worldBirthRate.toFixed(1)} per 1,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{countryName} birth rate:</span>
                    <span className="font-semibold">{crudeBirthRate.toFixed(1)} per 1,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Relative to world avg:</span>
                    <span className={`font-semibold ${crudeBirthRate < worldBirthRate ? 'text-red-600' : 'text-green-600'}`}>
                      {worldBirthRate > 0 ? ((crudeBirthRate / worldBirthRate) * 100).toFixed(1) : '0.0'}%
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
                  <li>• Birth rate: {crudeBirthRate.toFixed(1)} per 1,000</li>
                  <li>• Annual births: {annualBirths.toLocaleString()}</li>
                  <li>• Daily average: {dailyBirths.toLocaleString()}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-amber-900 mb-2">Fertility Context</h4>
                <ul className="space-y-1 text-amber-800">
                  <li>• TFR: {tfr.toFixed(2)} children/woman</li>
                  <li>• Replacement level: 2.1</li>
                  <li>• {tfr < 2.1 ? 'Below replacement fertility' : 'Above replacement fertility'}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-amber-900 mb-2">Economic Impact</h4>
                <ul className="space-y-1 text-amber-800">
                  <li>• New arrivals: {dailyBirths.toLocaleString()}/day</li>
                  <li>• Future workforce: {annualBirths.toLocaleString()}/year</li>
                  <li>• Dependency outlook: {tfr < 1.5 ? 'Critical' : tfr < 2.1 ? 'Concerning' : 'Stable'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Source */}
          <div className="mt-4 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            <p>
              <strong>Source:</strong> UN WPP 2024: births, birth rate and fertility for 2024 and later are
              medium-variant projections; 1950–2023 are estimates. The live counter is a uniform simulation
              of the {referenceYear} projection ({annualBirths.toLocaleString()} births), not a real-time feed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
