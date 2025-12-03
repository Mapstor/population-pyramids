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

interface SideBySidePyramidsProps {
  country1Data: YearData;
  country2Data: YearData;
  country1Name: string;
  country2Name: string;
  year: number;
}

export default function SideBySidePyramids({
  country1Data,
  country2Data,
  country1Name,
  country2Name,
  year
}: SideBySidePyramidsProps) {
  
  const createPyramidData = (data: YearData, countryName: string) => {
    return {
      labels: data.ageGroups.map(ag => ag.ageRange).reverse(),
      datasets: [
        // Base male bars (up to the minimum)
        {
          label: 'Male',
          data: data.ageGroups.map(ag => -Math.min(ag.male, ag.female)).reverse(),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 0,
          barPercentage: 0.9,
          categoryPercentage: 1.0,
        },
        // Male surplus (only if males > females)
        {
          label: '',
          data: data.ageGroups.map(ag => {
            const surplus = ag.male - ag.female;
            return surplus > 0 ? -surplus : 0;
          }).reverse(),
          backgroundColor: 'rgba(30, 64, 175, 0.9)',
          borderColor: 'rgba(30, 64, 175, 1)',
          borderWidth: 0,
          barPercentage: 0.9,
          categoryPercentage: 1.0,
        },
        // Base female bars (up to the minimum)
        {
          label: 'Female',
          data: data.ageGroups.map(ag => Math.min(ag.male, ag.female)).reverse(),
          backgroundColor: 'rgba(236, 72, 153, 0.8)',
          borderColor: 'rgba(236, 72, 153, 1)',
          borderWidth: 0,
          barPercentage: 0.9,
          categoryPercentage: 1.0,
        },
        // Female surplus (only if females > males)
        {
          label: '',
          data: data.ageGroups.map(ag => {
            const surplus = ag.female - ag.male;
            return surplus > 0 ? surplus : 0;
          }).reverse(),
          backgroundColor: 'rgba(190, 24, 93, 0.9)',
          borderColor: 'rgba(190, 24, 93, 1)',
          borderWidth: 0,
          barPercentage: 0.9,
          categoryPercentage: 1.0,
        }
      ]
    };
  };

  const createOptions = (title: string, maxValue: number): ChartOptions<'bar'> => ({
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = Math.abs(context.raw);
            const gender = context.raw < 0 ? 'Male' : 'Female';
            return `${gender}: ${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: function(value: any) {
            return Math.abs(value).toLocaleString();
          },
          font: {
            size: 11
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        max: maxValue,
        min: -maxValue
      },
      y: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  });

  // Find max value for consistent scaling
  const maxValue1 = Math.max(
    ...country1Data.ageGroups.map(ag => Math.max(ag.male, ag.female))
  );
  const maxValue2 = Math.max(
    ...country2Data.ageGroups.map(ag => Math.max(ag.male, ag.female))
  );
  const maxValue = Math.max(maxValue1, maxValue2) * 1.1; // Add 10% padding

  const pyramid1Data = createPyramidData(country1Data, country1Name);
  const pyramid2Data = createPyramidData(country2Data, country2Name);
  const options1 = createOptions(`${country1Name} - ${year}`, maxValue);
  const options2 = createOptions(`${country2Name} - ${year}`, maxValue);

  // Calculate population percentages for comparison
  const total1 = country1Data.totalPopulation;
  const total2 = country2Data.totalPopulation;
  const youth1 = country1Data.ageGroups.slice(0, 3).reduce((sum, ag) => sum + ag.total, 0);
  const youth2 = country2Data.ageGroups.slice(0, 3).reduce((sum, ag) => sum + ag.total, 0);
  const elderly1 = country1Data.ageGroups.slice(13).reduce((sum, ag) => sum + ag.total, 0);
  const elderly2 = country2Data.ageGroups.slice(13).reduce((sum, ag) => sum + ag.total, 0);

  return (
    <div>
      {/* Pyramids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="h-[500px]">
          <Bar data={pyramid1Data} options={options1} />
        </div>
        <div className="h-[500px]">
          <Bar data={pyramid2Data} options={options2} />
        </div>
      </div>

      {/* Quick Stats Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Total Population</p>
          <div className="flex justify-center items-center space-x-4">
            <div>
              <p className="font-semibold text-blue-600">{country1Name}</p>
              <p className="text-lg font-bold">{(total1 / 1_000_000).toFixed(1)}M</p>
            </div>
            <div className="text-gray-400">vs</div>
            <div>
              <p className="font-semibold text-pink-600">{country2Name}</p>
              <p className="text-lg font-bold">{(total2 / 1_000_000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Youth (0-14)</p>
          <div className="flex justify-center items-center space-x-4">
            <div>
              <p className="font-semibold text-blue-600">{country1Name}</p>
              <p className="text-lg font-bold">{((youth1 / total1) * 100).toFixed(1)}%</p>
            </div>
            <div className="text-gray-400">vs</div>
            <div>
              <p className="font-semibold text-pink-600">{country2Name}</p>
              <p className="text-lg font-bold">{((youth2 / total2) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Elderly (65+)</p>
          <div className="flex justify-center items-center space-x-4">
            <div>
              <p className="font-semibold text-blue-600">{country1Name}</p>
              <p className="text-lg font-bold">{((elderly1 / total1) * 100).toFixed(1)}%</p>
            </div>
            <div className="text-gray-400">vs</div>
            <div>
              <p className="font-semibold text-pink-600">{country2Name}</p>
              <p className="text-lg font-bold">{((elderly2 / total2) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}