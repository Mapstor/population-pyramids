'use client';

import { useEffect, useState } from 'react';
import type { YearData } from '@/types/population';

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
  const [ChartComponent, setChartComponent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChart = async () => {
      try {
        const { Bar } = await import('react-chartjs-2');
        const {
          Chart as ChartJS,
          CategoryScale,
          LinearScale,
          BarElement,
          Title,
          Tooltip,
          Legend
        } = await import('chart.js');

        ChartJS.register(
          CategoryScale,
          LinearScale,
          BarElement,
          Title,
          Tooltip,
          Legend
        );

        setChartComponent(() => Bar);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load chart component');
        setIsLoading(false);
      }
    };

    loadChart();
  }, []);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div style={{ height: `${height}px` }} className="flex items-center justify-center">
          <div className="text-gray-500">Loading population pyramid...</div>
        </div>
      </div>
    );
  }

  if (error || !ChartComponent) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-center">
            {countryName} Population Pyramid ({year})
          </h3>
        </div>
        <div className="bg-gray-100 rounded-lg p-8 text-center" style={{ height: `${height}px` }}>
          <div className="text-gray-500 mb-4">Population pyramid visualization temporarily unavailable</div>
          <div className="text-sm text-gray-600">
            <p>Male population: {data.malePopulation.toLocaleString()}</p>
            <p>Female population: {data.femalePopulation.toLocaleString()}</p>
            <p>Total population: {data.totalPopulation.toLocaleString()}</p>
          </div>
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

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${countryName} Population Pyramid (${year})`,
        font: {
          size: 18,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
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
        ticks: {
          callback: function(value: any) {
            const numValue = typeof value === 'number' ? value : 0;
            return Math.abs(numValue).toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'Population'
        }
      },
      y: {
        stacked: true,
        position: 'left' as const,
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
        <ChartComponent data={chartData} options={options} />
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