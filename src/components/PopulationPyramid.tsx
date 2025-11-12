'use client';

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
import type { ChartOptions } from 'chart.js';
import type { YearData } from '@/types/population';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PopulationPyramidProps {
  data: YearData;
  countryName: string;
  year: number;
  showLegend?: boolean;
  height?: number;
  className?: string;
}

export default function PopulationPyramid({
  data,
  countryName,
  year,
  showLegend = true,
  height = 600,
  className = ''
}: PopulationPyramidProps) {
  const chartData = {
    labels: data.ageGroups.map(ag => ag.ageRange).reverse(),
    datasets: [
      {
        label: 'Male',
        data: data.ageGroups.map(ag => -ag.male).reverse(),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Female',
        data: data.ageGroups.map(ag => ag.female).reverse(),
        backgroundColor: 'rgba(236, 72, 153, 0.8)',
        borderColor: 'rgba(236, 72, 153, 1)',
        borderWidth: 1,
      }
    ]
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
      },
      title: {
        display: true,
        text: `${countryName} Population Pyramid (${year})`,
        font: {
          size: 18,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = Math.abs(context.parsed.x || 0);
            const formatted = value.toLocaleString();
            return `${context.dataset.label}: ${formatted}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        min: -Math.max(...data.ageGroups.map(ag => ag.male)) * 1.1,
        max: Math.max(...data.ageGroups.map(ag => ag.female)) * 1.1,
        ticks: {
          callback: function(value) {
            const numValue = typeof value === 'number' ? value : 0;
            return Math.abs(numValue).toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'Population'
        },
        grid: {
          display: true,
          drawOnChartArea: true,
          drawTicks: true
        }
      },
      y: {
        stacked: true,
        position: 'left',
        title: {
          display: true,
          text: 'Age Group'
        }
      }
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div style={{ height: `${height}px` }}>
        <Bar data={chartData} options={options} />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Male: {data.malePopulation.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pink-500 rounded"></div>
          <span>Female: {data.femalePopulation.toLocaleString()}</span>
        </div>
        <div className="font-semibold">
          Total: {data.totalPopulation.toLocaleString()}
        </div>
      </div>
    </div>
  );
}