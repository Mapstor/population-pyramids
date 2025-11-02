'use client';

import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { CountryPopulationData, YearData, DemographicMetrics } from '@/types/population';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DemographicChartsProps {
  countryName: string;
  countryData: CountryPopulationData;
  currentYearData: YearData;
  currentMetrics: DemographicMetrics;
}

export default function DemographicCharts({ 
  countryName, 
  countryData, 
  currentYearData, 
  currentMetrics 
}: DemographicChartsProps) {
  
  // Prepare data for charts
  const years = Object.keys(countryData.years)
    .map(year => parseInt(year))
    .filter(year => year >= 1970)
    .sort((a, b) => a - b);

  const populationData = years.map(year => {
    const yearData = countryData.years[year.toString()];
    return yearData ? yearData.totalPopulation / 1000000 : null;
  }).filter(pop => pop !== null);

  const medianAgeData = years.map(year => {
    const yearData = countryData.years[year.toString()];
    return yearData ? yearData.medianAge : null;
  }).filter(age => age !== null);

  // Population trend line chart
  const populationChartData = {
    labels: years,
    datasets: [
      {
        label: 'Total Population (Millions)',
        data: populationData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.1,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const populationChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${countryName} Total Population Growth (1970-2024)`,
        font: { size: 16, weight: 'bold' as const }
      },
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y.toFixed(1)}M people`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Population (Millions)'
        },
        ticks: {
          callback: function(value: any) {
            return `${value}M`;
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Year'
        }
      }
    }
  };

  // Median age trend line chart
  const medianAgeChartData = {
    labels: years,
    datasets: [
      {
        label: 'Median Age',
        data: medianAgeData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.1,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const medianAgeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${countryName} Median Age Evolution (1970-2024)`,
        font: { size: 16, weight: 'bold' as const }
      },
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y.toFixed(1)} years`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Median Age (Years)'
        },
        ticks: {
          callback: function(value: any) {
            return `${value} yrs`;
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Year'
        }
      }
    }
  };

  // Age group comparison 1970 vs 2024
  const data1970 = countryData.years['1970'];
  const data2024 = countryData.years['2024'] || currentYearData;
  
  let ageGroupComparison = null;
  if (data1970 && data2024) {
    const calculateAgeGroups = (yearData: YearData) => {
      const youth = yearData.ageGroups
        .filter(ag => ag.ageRange && ['0-4', '5-9', '10-14'].includes(ag.ageRange))
        .reduce((sum, ag) => sum + (ag.total || 0), 0);
      const working = yearData.ageGroups
        .filter(ag => {
          const range = ag.ageRange;
          return range && !['0-4', '5-9', '10-14'].includes(range) && 
                 !range.includes('65') && !range.includes('70') && 
                 !range.includes('75') && !range.includes('80') && 
                 !range.includes('85') && !range.includes('90') && 
                 !range.includes('95') && !range.includes('100');
        })
        .reduce((sum, ag) => sum + (ag.total || 0), 0);
      const elderly = yearData.ageGroups
        .filter(ag => ag.ageRange && (ag.ageRange.includes('65') || ag.ageRange.includes('70') || 
                     ag.ageRange.includes('75') || ag.ageRange.includes('80') || 
                     ag.ageRange.includes('85') || ag.ageRange.includes('90') || 
                     ag.ageRange.includes('95') || ag.ageRange.includes('100')))
        .reduce((sum, ag) => sum + (ag.total || 0), 0);
      
      const total = yearData.totalPopulation;
      return {
        youth: (youth / total) * 100,
        working: (working / total) * 100,
        elderly: (elderly / total) * 100
      };
    };

    const groups1970 = calculateAgeGroups(data1970);
    const groups2024 = calculateAgeGroups(data2024);

    ageGroupComparison = {
      labels: ['Youth (0-14)', 'Working Age (15-64)', 'Elderly (65+)'],
      datasets: [
        {
          label: '1970',
          data: [groups1970.youth, groups1970.working, groups1970.elderly],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        },
        {
          label: '2024',
          data: [groups2024.youth, groups2024.working, groups2024.elderly],
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1
        }
      ]
    };
  }

  const ageGroupComparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${countryName} Age Structure Comparison: 1970 vs 2024`,
        font: { size: 16, weight: 'bold' as const }
      },
      legend: {
        display: true,
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 70,
        title: {
          display: true,
          text: 'Percentage of Population'
        },
        ticks: {
          callback: function(value: any) {
            return `${value}%`;
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Age Groups'
        }
      }
    }
  };

  // Current age distribution pie chart
  const currentAgeDistribution = {
    labels: ['Youth (0-14)', 'Working Age (15-64)', 'Elderly (65+)'],
    datasets: [
      {
        data: [
          currentMetrics.youthPercentage,
          currentMetrics.workingAgePercentage,
          currentMetrics.elderlyPercentage
        ],
        backgroundColor: [
          'rgba(251, 146, 60, 0.8)',  // Orange for youth
          'rgba(59, 130, 246, 0.8)',  // Blue for working age
          'rgba(156, 163, 175, 0.8)'  // Gray for elderly
        ],
        borderColor: [
          'rgba(251, 146, 60, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(156, 163, 175, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${countryName} Current Age Distribution (2024)`,
        font: { size: 16, weight: 'bold' as const }
      },
      legend: {
        display: true,
        position: 'bottom' as const
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed.toFixed(1)}%`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Demographic Data Visualizations
      </h2>
      <p className="text-gray-600 mb-8">
        Comprehensive charts showing {countryName}'s demographic trends, age structure evolution, and current population distribution patterns.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Population Growth Chart */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div style={{ height: '300px' }}>
            <Line data={populationChartData} options={populationChartOptions} />
          </div>
          <div className="mt-4 text-sm text-gray-700 leading-relaxed">
            <p>
              <strong>Population Growth Trajectory:</strong> This chart reveals {countryName}'s population growth pattern from 1970 to 2024, showing whether the country experienced steady growth, rapid expansion, or demographic transition phases. The curve shape indicates the stage of demographic development and helps predict future population trends.
            </p>
          </div>
        </div>

        {/* Median Age Evolution Chart */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div style={{ height: '300px' }}>
            <Line data={medianAgeChartData} options={medianAgeChartOptions} />
          </div>
          <div className="mt-4 text-sm text-gray-700 leading-relaxed">
            <p>
              <strong>Population Aging Trend:</strong> The median age progression illustrates {countryName}'s demographic transition speed and aging trajectory. Steep increases indicate rapid population aging, while gradual changes suggest balanced demographic development. This metric is crucial for understanding societal and economic pressures.
            </p>
          </div>
        </div>

        {/* Age Structure Comparison */}
        {ageGroupComparison && (
          <div className="bg-gray-50 rounded-lg p-6">
            <div style={{ height: '300px' }}>
              <Bar data={ageGroupComparison} options={ageGroupComparisonOptions} />
            </div>
            <div className="mt-4 text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>Generational Shift Analysis:</strong> Comparing 1970 and 2024 age structures reveals {countryName}'s demographic transformation over five decades. Changes in youth, working-age, and elderly proportions demonstrate the country's progression through demographic transition stages and highlight emerging challenges or opportunities.
              </p>
            </div>
          </div>
        )}

        {/* Current Age Distribution */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div style={{ height: '300px' }}>
            <Pie data={currentAgeDistribution} options={pieChartOptions} />
          </div>
          <div className="mt-4 text-sm text-gray-700 leading-relaxed">
            <p>
              <strong>Current Demographic Balance:</strong> This distribution shows {countryName}'s present age structure composition, highlighting the relative size of dependent populations (youth and elderly) versus the productive working-age group. The proportions directly influence economic growth potential, social service demands, and policy priorities.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Insights */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Visual Data Insights Summary
        </h3>
        <p className="text-gray-700 leading-relaxed">
          These visualizations collectively tell the story of {countryName}'s demographic evolution, 
          revealing patterns in population growth, aging trends, and structural changes that shape 
          current social and economic realities. Understanding these visual patterns helps interpret 
          the country's demographic challenges and opportunities in a global context.
        </p>
      </div>
    </div>
  );
}