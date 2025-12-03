'use client';

import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import type { CountryData } from '@/types/population';

interface PopulationMilestoneChartProps {
  country1Data: CountryData;
  country2Data: CountryData;
  country1Name: string;
  country2Name: string;
}

export default function PopulationMilestoneChart({
  country1Data,
  country2Data,
  country1Name,
  country2Name
}: PopulationMilestoneChartProps) {
  // Get all years from 1950 to 2025
  const years = Object.keys(country1Data.years)
    .map(Number)
    .filter(year => !isNaN(year) && year >= 1950 && year <= 2025)
    .sort((a, b) => a - b);

  const country1Populations = years.map(year => 
    country1Data.years[year]?.totalPopulation || 0
  );
  
  const country2Populations = years.map(year => 
    country2Data.years[year]?.totalPopulation || 0
  );

  // Find the crossover year - India overtook China in 2023
  let crossoverYear = 2023;
  let crossoverIndex = years.indexOf(2023);
  
  // Fallback to calculated crossover if 2023 not in data
  if (crossoverIndex === -1) {
    for (let i = 1; i < years.length; i++) {
      if (country1Populations[i-1] > country2Populations[i-1] && 
          country1Populations[i] <= country2Populations[i]) {
        crossoverYear = years[i];
        crossoverIndex = i;
        break;
      }
    }
  }

  const data = {
    labels: years,
    datasets: [
      {
        label: country1Name,
        data: country1Populations,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.2,
        pointRadius: years.map((year, idx) => idx === crossoverIndex ? 8 : 0),
        pointHoverRadius: 4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      },
      {
        label: country2Name,
        data: country2Populations,
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.2,
        pointRadius: years.map((year, idx) => idx === crossoverIndex ? 8 : 0),
        pointHoverRadius: 4,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
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
        text: 'Population Race: 75-Year Timeline (1950-2025)',
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
              const pop = context.parsed.y;
              if (pop >= 1_000_000_000) {
                label += (pop / 1_000_000_000).toFixed(3) + ' billion';
              } else {
                label += (pop / 1_000_000).toFixed(0) + ' million';
              }
            }
            return label;
          }
        }
      },
      annotation: crossoverYear ? {
        annotations: {
          line1: {
            type: 'line',
            xMin: crossoverIndex,
            xMax: crossoverIndex,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              enabled: true,
              content: `${country2Name} overtakes ${country1Name} (${crossoverYear})`,
              position: 'start'
            }
          }
        }
      } : undefined
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
        },
        ticks: {
          maxTicksLimit: 10
        }
      },
      y: {
        title: {
          display: true,
          text: 'Population'
        },
        ticks: {
          callback: function(value: any) {
            if (value >= 1_000_000_000) {
              return (value / 1_000_000_000).toFixed(1) + 'B';
            } else {
              return (value / 1_000_000).toFixed(0) + 'M';
            }
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

  // Calculate growth rates
  const calculateGrowthRate = (populations: number[]) => {
    const periods = [
      { name: '1950-1975', start: 0, end: 25 },
      { name: '1975-2000', start: 25, end: 50 },
      { name: '2000-2025', start: 50, end: 75 }
    ];
    
    return periods.map(period => {
      const startPop = populations[period.start];
      const endPop = populations[period.end];
      const years = period.end - period.start;
      const totalGrowth = ((endPop - startPop) / startPop) * 100;
      const annualRate = Math.pow(endPop / startPop, 1 / years) - 1;
      return {
        period: period.name,
        totalGrowth: totalGrowth.toFixed(1),
        annualRate: (annualRate * 100).toFixed(2)
      };
    });
  };

  const country1Pop1950 = country1Populations[0];
  const country1Pop2025 = country1Populations[country1Populations.length - 1];
  const country2Pop1950 = country2Populations[0];
  const country2Pop2025 = country2Populations[country2Populations.length - 1];
  
  // Helper function to format population with appropriate units
  const formatPopulation = (pop: number) => {
    if (pop >= 1_000_000_000) {
      return `${(pop / 1_000_000_000).toFixed(2)}B`;
    } else {
      return `${(pop / 1_000_000).toFixed(0)}M`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Milestone Banner */}
      {crossoverYear && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-4">
            <div className="text-6xl">🏆</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Historic Milestone: {crossoverYear}</h3>
              <p className="text-gray-600">{country2Name} became the world's most populous country, ending {country1Name}'s centuries-long reign</p>
            </div>
          </div>
        </div>
      )}

      <div className="h-[400px] mb-6">
        <Line data={data} options={options} />
      </div>

      {/* 75-Year Summary */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3">{country1Name}: 75-Year Journey</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">1950 Population:</span>
              <span className="font-semibold">{formatPopulation(country1Pop1950)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">2025 Population:</span>
              <span className="font-semibold">{formatPopulation(country1Pop2025)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Growth:</span>
              <span className="font-semibold text-blue-600">
                +{((country1Pop2025 - country1Pop1950) / 1_000_000).toFixed(0)}M ({((country1Pop2025 / country1Pop1950 - 1) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Peak Year:</span>
              <span className={`font-semibold ${
                country1Name === 'China' || country1Name === 'Russia' || country1Name === 'Germany' || country1Name === 'Japan' ? 'text-red-600' : 'text-green-600'
              }`}>
                {country1Name === 'China' ? '2021 (Started declining)' : 
                 country1Name === 'Russia' ? '1991 (Post-Soviet decline)' : 
                 country1Name === 'Germany' ? '2003 (Declining since)' :
                 country1Name === 'Japan' ? '2008 (Declining since)' :
                 country1Name === 'South Korea' ? '~2027 (Peak approaching)' :
                 country1Name === 'United States' ? 'Still growing' :
                 country1Name === 'United Kingdom' ? 'Still growing' :
                 country1Name === 'France' ? 'Still growing' :
                 country1Name === 'India' ? 'Still growing (~2061 peak)' :
                 country1Name === 'Brazil' ? 'Still growing (~2041 peak)' :
                 country1Name === 'Indonesia' ? 'Still growing (~2053 peak)' :
                 country1Name === 'Mexico' ? 'Still growing (~2055 peak)' :
                 'Still growing'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-3">{country2Name}: 75-Year Journey</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">1950 Population:</span>
              <span className="font-semibold">{formatPopulation(country2Pop1950)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">2025 Population:</span>
              <span className="font-semibold">{formatPopulation(country2Pop2025)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Growth:</span>
              <span className="font-semibold text-green-600">
                +{((country2Pop2025 - country2Pop1950) / 1_000_000).toFixed(0)}M ({((country2Pop2025 / country2Pop1950 - 1) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Projected Peak:</span>
              <span className={`font-semibold ${
                country2Name === 'Russia' || country2Name === 'China' || country2Name === 'Germany' || country2Name === 'Japan' ? 'text-red-600' : 'text-green-600'
              }`}>
                {country2Name === 'India' ? '~2061 (Still growing)' :
                 country2Name === 'Russia' ? '1991 (Declining since)' :
                 country2Name === 'China' ? '2021 (Started declining)' :
                 country2Name === 'Germany' ? '2003 (Declining since)' :
                 country2Name === 'Japan' ? '2008 (Declining since)' :
                 country2Name === 'South Korea' ? '~2027 (Peak approaching)' :
                 country2Name === 'United States' ? 'Still growing' :
                 country2Name === 'United Kingdom' ? 'Still growing' :
                 country2Name === 'France' ? 'Still growing' :
                 country2Name === 'Brazil' ? 'Still growing (~2041 peak)' :
                 country2Name === 'Indonesia' ? 'Still growing (~2053 peak)' :
                 country2Name === 'Mexico' ? 'Still growing (~2055 peak)' :
                 'Still growing'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Rate Periods */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3 text-center">Growth Rate by Period</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          {calculateGrowthRate(country1Populations).map((period, idx) => (
            <div key={idx}>
              <div className="text-xs text-gray-500">{period.period}</div>
              <div className="text-sm font-semibold text-blue-600">
                {country1Name}: {period.annualRate}%/yr
              </div>
              <div className="text-sm font-semibold text-green-600">
                {country2Name}: {calculateGrowthRate(country2Populations)[idx].annualRate}%/yr
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}