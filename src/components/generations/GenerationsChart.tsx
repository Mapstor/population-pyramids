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
import type { GenerationPopulation } from '@/lib/generation-utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GenerationsChartProps {
  generationData: GenerationPopulation[];
  countryName: string;
}

export function GenerationsChart({ generationData, countryName }: GenerationsChartProps) {
  // Handle empty data
  if (generationData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Generation Population Distribution {countryName !== 'World' && `- ${countryName}`}
        </h2>
        <p className="text-gray-600 text-center">
          Chart data not available for {countryName}.
        </p>
      </div>
    );
  }

  // Chart data configuration
  const chartData = {
    labels: generationData.map(g => g.generation.name),
    datasets: [{
      label: 'Population',
      data: generationData.map(g => g.population),
      backgroundColor: generationData.map(g => g.generation.color),
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
      title: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const gen = generationData[context.dataIndex];
            return [
              `${gen.generation.name}: ${gen.population.toLocaleString()}`,
              `${gen.percentOfTotal.toFixed(1)}% of population`,
              `Ages ${gen.ageRange} in 2026`,
              `Born ${gen.generation.birthYearStart}-${gen.generation.birthYearEnd}`
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
            if (value >= 1000000) {
              return (value / 1000000).toFixed(0) + 'M';
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(0) + 'K';
            }
            return value.toString();
          }
        },
        title: {
          display: true,
          text: 'Population'
        }
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6">
        Generation Population Distribution {countryName !== 'World' && `- ${countryName}`}
      </h2>
      
      {/* Chart container */}
      <div style={{ height: '400px', position: 'relative' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
      
      {/* Chart legend/key */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {generationData.map(gen => (
          <div key={gen.generation.id} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: gen.generation.color }}
              aria-hidden="true"
            />
            <span className="text-gray-700">
              {gen.generation.name}: {gen.percentOfTotal.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      {/* Additional insights */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
        <p>
          {countryName === 'World' 
            ? `Global population distributed across ${generationData.length} generations, with ${
                generationData.reduce((prev, current) => 
                  prev.population > current.population ? prev : current
                ).generation.name
              } being the largest at ${
                Math.max(...generationData.map(g => g.percentOfTotal)).toFixed(1)
              }% of world population.`
            : `In ${countryName}, ${
                generationData.reduce((prev, current) => 
                  prev.population > current.population ? prev : current
                ).generation.name
              } is the largest generation, comprising ${
                Math.max(...generationData.map(g => g.percentOfTotal)).toFixed(1)
              }% of the population.`
          }
        </p>
      </div>
    </div>
  );
}