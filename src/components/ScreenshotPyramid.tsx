'use client';

import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import type { YearData } from '@/types/population';

interface ScreenshotPyramidProps {
  country1Data: YearData;
  country2Data: YearData;
  country1Name: string;
  country2Name: string;
  year: number;
}

export default function ScreenshotPyramid({
  country1Data,
  country2Data,
  country1Name,
  country2Name,
  year
}: ScreenshotPyramidProps) {
  
  const createPyramidData = (data: YearData, countryName: string) => {
    return {
      labels: data.ageGroups.map(ag => ag.ageRange).reverse(),
      datasets: [
        {
          label: 'Male',
          data: data.ageGroups.map(ag => -ag.male).reverse(),
          backgroundColor: countryName === country1Name 
            ? 'rgba(59, 130, 246, 0.9)' 
            : 'rgba(34, 197, 94, 0.9)',
          borderWidth: 0,
          barPercentage: 0.95,
        },
        {
          label: 'Female',
          data: data.ageGroups.map(ag => ag.female).reverse(),
          backgroundColor: countryName === country1Name 
            ? 'rgba(236, 72, 153, 0.9)'
            : 'rgba(251, 146, 60, 0.9)',
          borderWidth: 0,
          barPercentage: 0.95,
        }
      ]
    };
  };

  const createOptions = (title: string, maxValue: number, population: number): ChartOptions<'bar'> => ({
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: [
          title,
          `Population: ${(population / 1_000_000_000).toFixed(2)} Billion`
        ],
        font: {
          size: 20,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        stacked: false,
        ticks: {
          callback: function(value: any) {
            return Math.abs(value).toLocaleString();
          },
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        max: maxValue,
        min: -maxValue,
        title: {
          display: true,
          text: 'Population',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        stacked: false,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        title: {
          display: true,
          text: 'Age Groups',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  });

  const maxValue1 = Math.max(...country1Data.ageGroups.map(ag => Math.max(ag.male, ag.female)));
  const maxValue2 = Math.max(...country2Data.ageGroups.map(ag => Math.max(ag.male, ag.female)));
  const maxValue = Math.max(maxValue1, maxValue2) * 1.1;

  const pyramid1Data = createPyramidData(country1Data, country1Name);
  const pyramid2Data = createPyramidData(country2Data, country2Name);
  const options1 = createOptions(
    `${country1Name} - ${year}`, 
    maxValue,
    country1Data.totalPopulation
  );
  const options2 = createOptions(
    `${country2Name} - ${year}`, 
    maxValue,
    country2Data.totalPopulation
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-pink-50 p-8 rounded-xl">
      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {country1Name} vs {country2Name}
        </h1>
        <p className="text-xl text-gray-600">
          Population Pyramid Comparison {year}
        </p>
      </div>

      {/* Pyramids */}
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6" style={{ height: '500px' }}>
          <Bar data={pyramid1Data} options={options1} />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6" style={{ height: '500px' }}>
          <Bar data={pyramid2Data} options={options2} />
        </div>
      </div>

      {/* Key Stats */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Gap</p>
            <p className="text-2xl font-bold text-gray-900">
              {((Math.abs(country1Data.totalPopulation - country2Data.totalPopulation)) / 1_000_000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-500">
              {country2Data.totalPopulation > country1Data.totalPopulation ? country2Name : country1Name} leads
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Median Age</p>
            <p className="text-lg font-bold">
              <span className="text-blue-600">{country1Data.medianAge.toFixed(1)}</span>
              <span className="text-gray-400 mx-2">vs</span>
              <span className="text-green-600">{country2Data.medianAge.toFixed(1)}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Youth (0-14)</p>
            <p className="text-lg font-bold">
              <span className="text-blue-600">
                {((country1Data.ageGroups.slice(0, 3).reduce((sum, ag) => sum + ag.total, 0) / country1Data.totalPopulation) * 100).toFixed(1)}%
              </span>
              <span className="text-gray-400 mx-2">vs</span>
              <span className="text-green-600">
                {((country2Data.ageGroups.slice(0, 3).reduce((sum, ag) => sum + ag.total, 0) / country2Data.totalPopulation) * 100).toFixed(1)}%
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Elderly (65+)</p>
            <p className="text-lg font-bold">
              <span className="text-blue-600">
                {((country1Data.ageGroups.slice(13).reduce((sum, ag) => sum + ag.total, 0) / country1Data.totalPopulation) * 100).toFixed(1)}%
              </span>
              <span className="text-gray-400 mx-2">vs</span>
              <span className="text-green-600">
                {((country2Data.ageGroups.slice(13).reduce((sum, ag) => sum + ag.total, 0) / country2Data.totalPopulation) * 100).toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Data Source: UN World Population Prospects 2024 | PopulationPyramids.net
      </div>
    </div>
  );
}