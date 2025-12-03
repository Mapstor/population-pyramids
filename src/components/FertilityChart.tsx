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
  const originalProjections = fertilityData.fertilityData.projections;
  const replacementLevel = fertilityData.fertilityData.replacementLevel;

  // Create realistic year-by-year projections based on historical trends
  const lastHistoricalYear = Math.max(...historicalData.map(d => d.year));
  const lastHistoricalTfr = historicalData.find(d => d.year === lastHistoricalYear)?.totalFertilityRate || 2.0;
  
  // Calculate recent trend from last 10 years of data for more realistic projection
  const recentData = historicalData.filter(d => d.year >= lastHistoricalYear - 10).sort((a, b) => a.year - b.year);
  let yearlyDecline = 0.02; // Default modest decline
  
  if (recentData.length >= 3) {
    // Calculate average yearly decline from recent data
    const declines = [];
    for (let i = 1; i < recentData.length; i++) {
      const yearDiff = recentData[i].year - recentData[i-1].year;
      const tfrDiff = recentData[i].totalFertilityRate - recentData[i-1].totalFertilityRate;
      if (yearDiff > 0) {
        declines.push(tfrDiff / yearDiff);
      }
    }
    if (declines.length > 0) {
      const avgDecline = declines.reduce((a, b) => a + b, 0) / declines.length;
      // Smooth the decline - don't let it be too steep or positive
      yearlyDecline = Math.min(0, Math.max(-0.05, avgDecline * 0.7));
    }
  }
  
  // Generate smooth projections with gradual leveling
  const projections = [];
  
  for (let year = lastHistoricalYear + 1; year <= 2050; year++) {
    const yearsFromStart = year - lastHistoricalYear;
    
    // Apply declining decline rate (levels off over time)
    const declineMultiplier = Math.exp(-yearsFromStart * 0.05); // Exponential decay of decline rate
    const adjustedDecline = yearlyDecline * declineMultiplier;
    
    // Calculate TFR with minimum floor
    let projectedTfr = lastHistoricalTfr + (adjustedDecline * yearsFromStart);
    
    // Set realistic floor - countries rarely go below 1.0 for extended periods
    const floor = Math.max(0.9, lastHistoricalTfr * 0.5);
    projectedTfr = Math.max(floor, projectedTfr);
    
    projections.push({
      year,
      totalFertilityRate: projectedTfr,
      crudebirthRate: Math.round(Math.max(6, projectedTfr * 5.5))
    });
  }

  // Combine historical and projection data
  const allData = [...historicalData, ...projections];
  const years = allData.map(d => d.year);
  const tfrValues = allData.map(d => d.totalFertilityRate);
  
  // Split data for different styling
  const historicalYears = historicalData.map(d => d.year);
  const historicalTfr = historicalData.map(d => d.totalFertilityRate);
  const projectionYears = projections.map(d => d.year);
  const projectionTfr = projections.map(d => d.totalFertilityRate);

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
            <div className="font-medium text-blue-900">Highest TFR</div>
            <div className="text-lg font-bold text-blue-700">
              {Math.max(...historicalTfr).toFixed(2)}
            </div>
            <div className="text-xs text-blue-600">
              {historicalYears[historicalTfr.indexOf(Math.max(...historicalTfr))]}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="font-medium text-gray-900">Current TFR</div>
            <div className="text-lg font-bold text-gray-700">
              {fertilityData.fertilityData.current.totalFertilityRate?.toFixed(2) || 'N/A'}
            </div>
            <div className="text-xs text-gray-600">
              {fertilityData.fertilityData.current.year}
            </div>
          </div>
          <div className="bg-pink-50 rounded-lg p-3">
            <div className="font-medium text-pink-900">Projected 2050</div>
            <div className="text-lg font-bold text-pink-700">
              {projections.find(p => p.year === 2050)?.totalFertilityRate?.toFixed(2) || 'N/A'}
            </div>
            <div className="text-xs text-pink-600">
              Estimate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}