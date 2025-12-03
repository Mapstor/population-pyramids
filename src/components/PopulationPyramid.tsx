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
      // Base male bars (up to the minimum)
      {
        label: 'Male',
        data: data.ageGroups.map(ag => -Math.min(ag.male, ag.female)).reverse(),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        barPercentage: 0.8,
        categoryPercentage: 1.0
      },
      // Male surplus (only if males > females)
      {
        label: '',
        data: data.ageGroups.map(ag => {
          const surplus = ag.male - ag.female;
          return surplus > 0 ? -surplus : 0;
        }).reverse(),
        backgroundColor: 'rgba(30, 64, 175, 0.9)', // Darker blue
        borderColor: 'rgba(30, 64, 175, 1)',
        borderWidth: 0,
        barPercentage: 0.8,
        categoryPercentage: 1.0
      },
      // Base female bars (up to the minimum)
      {
        label: 'Female',
        data: data.ageGroups.map(ag => Math.min(ag.male, ag.female)).reverse(),
        backgroundColor: 'rgba(236, 72, 153, 0.8)',
        borderColor: 'rgba(236, 72, 153, 1)',
        borderWidth: 1,
        barPercentage: 0.8,
        categoryPercentage: 1.0
      },
      // Female surplus (only if females > males)
      {
        label: '',
        data: data.ageGroups.map(ag => {
          const surplus = ag.female - ag.male;
          return surplus > 0 ? surplus : 0;
        }).reverse(),
        backgroundColor: 'rgba(190, 24, 93, 0.9)', // Darker red
        borderColor: 'rgba(190, 24, 93, 1)',
        borderWidth: 0,
        barPercentage: 0.8,
        categoryPercentage: 1.0
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
        align: 'center',
        usePointStyle: true,
        labels: {
          padding: 20,
          boxWidth: 12,
          boxHeight: 12,
          useBorderRadius: true,
          borderRadius: 6,
          filter: function(item) {
            // Only show Male and Female labels
            return item.text === 'Male' || item.text === 'Female';
          }
        },
        // Force center alignment with custom positioning
        maxWidth: undefined,
        fullSize: false
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
          },
          afterLabel: function(context) {
            // Show surplus info
            if (context.dataIndex !== undefined) {
              const ageGroupIndex = data.ageGroups.length - 1 - context.dataIndex;
              const ageGroup = data.ageGroups[ageGroupIndex];
              if (ageGroup) {
                const surplus = ageGroup.male - ageGroup.female;
                if (Math.abs(surplus) > 0) {
                  const surplusText = surplus > 0 
                    ? `Male surplus: ${surplus.toLocaleString()}`
                    : `Female surplus: ${Math.abs(surplus).toLocaleString()}`;
                  return surplusText;
                }
              }
            }
            return null;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        min: -Math.max(...data.ageGroups.map(ag => Math.max(ag.male, ag.female))) * 1.1,
        max: Math.max(...data.ageGroups.map(ag => Math.max(ag.male, ag.female))) * 1.1,
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
      <div style={{ height: `${height}px` }} className="pyramid-chart-container">
        <Bar data={chartData} options={options} />
      </div>
      <style jsx>{`
        .pyramid-chart-container :global(.chartjs-legend) {
          justify-content: center !important;
          display: flex !important;
        }
        .pyramid-chart-container :global(.chartjs-legend ul) {
          margin: 0 auto !important;
          display: flex !important;
          justify-content: center !important;
        }
      `}</style>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-center gap-6 text-sm mb-2">
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
        <div className="text-center text-xs text-gray-600">
          {(() => {
            const totalSurplus = data.malePopulation - data.femalePopulation;
            const surplusPercent = ((Math.abs(totalSurplus) / data.totalPopulation) * 100).toFixed(1);
            if (totalSurplus > 0) {
              return `Male surplus: ${totalSurplus.toLocaleString()} (${surplusPercent}%) • Dark blue shows male-dominant age groups`;
            } else if (totalSurplus < 0) {
              return `Female surplus: ${Math.abs(totalSurplus).toLocaleString()} (${surplusPercent}%) • Dark red shows female-dominant age groups`;
            } else {
              return `Perfectly balanced gender ratio`;
            }
          })()}
        </div>
      </div>
    </div>
  );
}