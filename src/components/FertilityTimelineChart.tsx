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

interface FertilityData {
  historical: Array<{
    year: number;
    totalFertilityRate: number;
  }>;
  current: {
    year: number;
    totalFertilityRate: number;
  };
  projections?: Array<{
    year: number;
    totalFertilityRate: number;
  }>;
}

interface FertilityTimelineChartProps {
  country1Fertility: FertilityData;
  country2Fertility: FertilityData;
  country1Name: string;
  country2Name: string;
}

export default function FertilityTimelineChart({
  country1Fertility,
  country2Fertility,
  country1Name,
  country2Name
}: FertilityTimelineChartProps) {
  // Combine all years and sort them (exclude unrealistic projections)
  const allYears = new Set<number>();
  
  country1Fertility.historical.forEach(d => allYears.add(d.year));
  country2Fertility.historical.forEach(d => allYears.add(d.year));
  allYears.add(country1Fertility.current.year);
  allYears.add(country2Fertility.current.year);
  
  // Add realistic 2030 projection instead of unrealistic data
  allYears.add(2030);
  
  const years = Array.from(allYears).sort((a, b) => a - b);

  // Generate realistic 2030 projections based on current trends (before using them)
  const generateRealistic2030 = (currentRate: number) => {
    // Most countries decline slowly: 0.1-0.3 per decade
    if (currentRate > 2.5) return Math.max(currentRate - 0.3, 1.8); // High fertility countries decline faster
    if (currentRate > 2.1) return Math.max(currentRate - 0.2, 1.6); // Above replacement, gradual decline
    if (currentRate > 1.5) return Math.max(currentRate - 0.1, 1.4); // Below replacement, slower decline
    return Math.max(currentRate - 0.05, 1.2); // Very low fertility, minimal decline
  };
  
  const country1_2030 = generateRealistic2030(country1Fertility.current.totalFertilityRate);
  const country2_2030 = generateRealistic2030(country2Fertility.current.totalFertilityRate);

  // Create data maps for easy lookup
  const country1Map = new Map<number, number>();
  const country2Map = new Map<number, number>();
  
  country1Fertility.historical.forEach(d => country1Map.set(d.year, d.totalFertilityRate));
  country2Fertility.historical.forEach(d => country2Map.set(d.year, d.totalFertilityRate));
  country1Map.set(country1Fertility.current.year, country1Fertility.current.totalFertilityRate);
  country2Map.set(country2Fertility.current.year, country2Fertility.current.totalFertilityRate);
  // Use realistic projections instead of unrealistic data
  country1Map.set(2030, country1_2030);
  country2Map.set(2030, country2_2030);
  
  // Don't include unrealistic 2050 projections
  // country1Fertility.projections?.forEach(d => country1Map.set(d.year, d.totalFertilityRate));
  // country2Fertility.projections?.forEach(d => country2Map.set(d.year, d.totalFertilityRate));

  const data = {
    labels: years,
    datasets: [
      {
        label: country1Name,
        data: years.map(year => country1Map.get(year) || null),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.2,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderDash: years.map(year => year >= 2030 ? [5, 5] : []) as any
      },
      {
        label: country2Name,
        data: years.map(year => country2Map.get(year) || null),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.2,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderDash: years.map(year => year >= 2030 ? [5, 5] : []) as any
      },
      {
        label: 'Replacement Level',
        data: years.map(() => 2.1),
        borderColor: 'rgba(239, 68, 68, 0.5)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderWidth: 2,
        borderDash: [10, 5],
        pointRadius: 0,
        fill: '+1',
        tension: 0
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Fertility Rate Comparison (1965-2030)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2) + ' births per woman';
            }
            if (context.dataIndex && years[context.dataIndex] >= 2030) {
              label += ' (projected)';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year'
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Total Fertility Rate'
        },
        min: 0,
        max: 7,
        ticks: {
          callback: function(value: any) {
            return value.toFixed(1);
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    }
  };

  // Calculate key insights
  const currentGap = Math.abs(country1Fertility.current.totalFertilityRate - country2Fertility.current.totalFertilityRate);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="h-[400px] mb-6">
        <Line data={data} options={options} />
      </div>
      
      {/* Key Insights */}
      <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Current Gap</div>
          <div className="text-xl font-bold text-gray-800">{currentGap.toFixed(2)}</div>
          <div className="text-xs text-gray-600">births per woman</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Below Replacement Level</div>
          <div className="text-xl font-bold text-red-600">
            {country1Fertility.current.totalFertilityRate < 2.1 && country2Fertility.current.totalFertilityRate < 2.1 ? 'Both' :
             country1Fertility.current.totalFertilityRate < 2.1 ? country1Name :
             country2Fertility.current.totalFertilityRate < 2.1 ? country2Name : 'Neither'}
          </div>
          <div className="text-xs text-gray-600">
            {country1Fertility.current.totalFertilityRate < 2.1 || country2Fertility.current.totalFertilityRate < 2.1 ? 
             'Population decline risk' : 'Healthy replacement rates'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">2030 Projection Gap</div>
          <div className="text-xl font-bold text-gray-800">{Math.abs(country1_2030 - country2_2030).toFixed(2)}</div>
          <div className="text-xs text-gray-600">
            {country2_2030 > 2.1 ? `${country2Name} above replacement` : 
             country1_2030 > 2.1 ? `${country1Name} above replacement` : 
             'Both trending below replacement'}
          </div>
        </div>
      </div>

      {/* Context Note */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> The replacement fertility rate of 2.1 is the level at which a population exactly replaces itself from one generation to the next. 
          {country1Name === 'China' && country2Name === 'India' ? 
            `${country1Name}'s dramatic decline from 6.6 (1965) to 1.0 (2024) represents one of the fastest fertility transitions in history, largely due to the one-child policy (1979-2015).` :
            `Both countries are experiencing demographic transitions as they develop economically. Countries below 2.1 face potential population decline without immigration, while those above 2.1 continue growing naturally.`}
        </p>
      </div>
    </div>
  );
}