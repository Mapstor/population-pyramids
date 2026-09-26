'use client';

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
import type { ChartOptions } from 'chart.js';
import type { FertilityData } from '@/lib/fertility-loader';
import { hasValue } from '@/lib/render-guards';

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

interface FertilityChartProps {
  fertilityData: FertilityData;
  countryName: string;
  className?: string;
}

export default function FertilityChart({
  fertilityData,
  countryName,
  className = ''
}: FertilityChartProps) {
  const historicalData = fertilityData.fertilityData.historical;
  const replacementLevel = fertilityData.fertilityData.replacementLevel;

  // Estimates are 1950–2023; 2024+ are UN medium-variant projections. Plot the UN
  // series directly (no synthetic model): the projected line is the reference-year
  // window from `historical` plus the UN `projections` (2030, 2050).
  const estimates = historicalData.filter((d) => d.year <= 2023);
  const projById = new Map<number, { year: number; totalFertilityRate: number }>();
  for (const d of historicalData.filter((d) => d.year >= 2024)) projById.set(d.year, { year: d.year, totalFertilityRate: d.totalFertilityRate });
  for (const d of fertilityData.fertilityData.projections) projById.set(d.year, { year: d.year, totalFertilityRate: d.totalFertilityRate });
  const projections = Array.from(projById.values()).sort((a, b) => a.year - b.year);

  const historicalYears = estimates.map((d) => d.year);
  const historicalTfr = estimates.map((d) => d.totalFertilityRate);
  const projectionYears = projections.map((d) => d.year);
  const projectionTfr = projections.map((d) => d.totalFertilityRate);
  const years = [...historicalYears, ...projectionYears];
  const tfrValues = [...historicalTfr, ...projectionTfr];
  // Peak TFR over the estimate window (1950–2023).
  const peakTfr = historicalTfr.length ? Math.max(...historicalTfr) : 0;
  const peakTfrYear = historicalYears[historicalTfr.indexOf(peakTfr)];
  const projected2050 = fertilityData.fertilityData.projections.find((p) => p.year === 2050)?.totalFertilityRate;

  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Historical TFR',
        data: historicalYears.map((year, index) => ({
          x: year,
          y: historicalTfr[index]
        })),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: false,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.4
      },
      {
        label: 'Projected TFR', 
        data: projectionYears.map((year, index) => ({
          x: year,
          y: projectionTfr[index]
        })),
        borderColor: 'rgba(236, 72, 153, 1)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        borderDash: [5, 5],
        fill: false,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(236, 72, 153, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.4
      },
      {
        label: 'Replacement Level',
        data: years.map(year => ({
          x: year,
          y: replacementLevel
        })),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        borderDash: [2, 2],
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: `${countryName} Total Fertility Rate Trends`,
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#374151'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            const value = typeof context.parsed.y === 'number' ? context.parsed.y.toFixed(2) : 'N/A';
            return `${context.dataset.label}: ${value} children per woman`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Year',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          display: true,
          color: 'rgba(156, 163, 175, 0.2)'
        },
        ticks: {
          callback: function(value) {
            return typeof value === 'number' ? value.toString() : value;
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Total Fertility Rate (children per woman)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        min: 0,
        max: Math.max(...tfrValues, replacementLevel) * 1.1,
        grid: {
          display: true,
          color: 'rgba(156, 163, 175, 0.2)'
        },
        ticks: {
          callback: function(value) {
            return typeof value === 'number' ? value.toFixed(1) : value;
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="text-xl mr-2">📈</span>
          Fertility Rate Trends
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Historical data (solid line) and future projections (dashed line)
        </p>
      </div>
      <div className="p-4">
        <div style={{ height: '350px' }}>
          <Line data={chartData} options={options} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="font-medium text-blue-900">Highest TFR since 1950</div>
            <div className="text-lg font-bold text-blue-700">
              {peakTfr.toFixed(2)}
            </div>
            <div className="text-xs text-blue-600">
              {peakTfrYear}
            </div>
          </div>
          {hasValue(fertilityData.fertilityData.current.totalFertilityRate) && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="font-medium text-gray-900">Current TFR</div>
              <div className="text-lg font-bold text-gray-700">
                {fertilityData.fertilityData.current.totalFertilityRate.toFixed(2)}
              </div>
              <div className="text-xs text-gray-600">
                {fertilityData.fertilityData.current.year}
              </div>
            </div>
          )}
          <div className="bg-pink-50 rounded-lg p-3">
            <div className="font-medium text-pink-900">Projected 2050</div>
            <div className="text-lg font-bold text-pink-700">
              {projected2050 != null ? projected2050.toFixed(2) : 'N/A'}
            </div>
            <div className="text-xs text-pink-600">
              UN projection
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}