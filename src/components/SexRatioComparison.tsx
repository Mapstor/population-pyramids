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
  ChartOptions
} from 'chart.js';
import type { CountryData } from '@/types/population';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SexRatioComparisonProps {
  country1Data: CountryData;
  country2Data: CountryData;
  country1Name: string;
  country2Name: string;
  currentYear: number;
}

export default function SexRatioComparison({
  country1Data,
  country2Data,
  country1Name,
  country2Name,
  currentYear
}: SexRatioComparisonProps) {
  
  const currentData1 = country1Data.years[currentYear] || country1Data.years[2024];
  const currentData2 = country2Data.years[currentYear] || country2Data.years[2024];

  // Calculate sex ratio by age group (males per 100 females)
  const sexRatioByAge1 = currentData1.ageGroups.map(ag => ({
    age: ag.ageRange,
    ratio: (ag.male / ag.female) * 100
  }));

  const sexRatioByAge2 = currentData2.ageGroups.map(ag => ({
    age: ag.ageRange,
    ratio: (ag.male / ag.female) * 100
  }));

  // Historical sex ratio trend (last 20 years)
  const years = Object.keys(country1Data.years)
    .map(Number)
    .filter(year => year >= currentYear - 20 && year <= currentYear && country2Data.years[year])
    .sort((a, b) => a - b);

  const historicalRatios1 = years.map(year => {
    const data = country1Data.years[year];
    return data ? (data.malePopulation / data.femalePopulation) * 100 : null;
  }).filter(r => r !== null);

  const historicalRatios2 = years.map(year => {
    const data = country2Data.years[year];
    return data ? (data.malePopulation / data.femalePopulation) * 100 : null;
  }).filter(r => r !== null);

  // Sex ratio at birth (0-4 age group)
  const sexRatioAtBirth1 = (currentData1.ageGroups[0].male / currentData1.ageGroups[0].female) * 100;
  const sexRatioAtBirth2 = (currentData2.ageGroups[0].male / currentData2.ageGroups[0].female) * 100;

  // Overall sex ratio
  const overallRatio1 = (currentData1.malePopulation / currentData1.femalePopulation) * 100;
  const overallRatio2 = (currentData2.malePopulation / currentData2.femalePopulation) * 100;

  // Chart data for age group comparison
  const ageGroupChartData = {
    labels: sexRatioByAge1.map(d => d.age),
    datasets: [
      {
        label: country1Name,
        data: sexRatioByAge1.map(d => d.ratio),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3
      },
      {
        label: country2Name,
        data: sexRatioByAge2.map(d => d.ratio),
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.3
      }
    ]
  };

  // Chart data for historical trend
  const historicalChartData = {
    labels: years,
    datasets: [
      {
        label: country1Name,
        data: historicalRatios1,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3
      },
      {
        label: country2Name,
        data: historicalRatios2,
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.3
      }
    ]
  };

  const ageGroupOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Sex Ratio by Age Group (${currentYear})`,
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} males per 100 females`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Males per 100 Females'
        },
        min: 80,
        max: 120,
        ticks: {
          callback: function(value) {
            return value;
          }
        },
        grid: {
          display: true
        }
      }
    }
  };

  const historicalOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Historical Sex Ratio Trend (20 Years)',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Males per 100 Females'
        },
        ticks: {
          callback: function(value) {
            return value;
          }
        }
      }
    }
  };

  // Calculate missing women estimate (simplified)
  const expectedRatio = 105; // Natural sex ratio at birth
  const missingWomen1 = sexRatioAtBirth1 > expectedRatio ? 
    Math.round(((sexRatioAtBirth1 - expectedRatio) / 100) * currentData1.ageGroups[0].female) : 0;
  const missingWomen2 = sexRatioAtBirth2 > expectedRatio ? 
    Math.round(((sexRatioAtBirth2 - expectedRatio) / 100) * currentData2.ageGroups[0].female) : 0;

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Overall Sex Ratio</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-600">{country1Name}</span>
              <span className="text-xl font-bold">{overallRatio1.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-pink-600">{country2Name}</span>
              <span className="text-xl font-bold">{overallRatio2.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Males per 100 females</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Sex Ratio at Birth (0-4)</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-600">{country1Name}</span>
              <span className={`text-xl font-bold ${sexRatioAtBirth1 > 110 ? 'text-red-600' : ''}`}>
                {sexRatioAtBirth1.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-pink-600">{country2Name}</span>
              <span className={`text-xl font-bold ${sexRatioAtBirth2 > 110 ? 'text-red-600' : ''}`}>
                {sexRatioAtBirth2.toFixed(1)}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Natural range: 103-107</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Gender Imbalance</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-600">{country1Name}</span>
              <span className="text-lg font-bold">
                {Math.abs(currentData1.malePopulation - currentData1.femalePopulation) > 1000000 ?
                  `${(Math.abs(currentData1.malePopulation - currentData1.femalePopulation) / 1000000).toFixed(1)}M` :
                  `${(Math.abs(currentData1.malePopulation - currentData1.femalePopulation) / 1000).toFixed(0)}K`
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-pink-600">{country2Name}</span>
              <span className="text-lg font-bold">
                {Math.abs(currentData2.malePopulation - currentData2.femalePopulation) > 1000000 ?
                  `${(Math.abs(currentData2.malePopulation - currentData2.femalePopulation) / 1000000).toFixed(1)}M` :
                  `${(Math.abs(currentData2.malePopulation - currentData2.femalePopulation) / 1000).toFixed(0)}K`
                }
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            More {currentData1.malePopulation > currentData1.femalePopulation ? 'males' : 'females'} / 
            More {currentData2.malePopulation > currentData2.femalePopulation ? 'males' : 'females'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="h-[300px]">
            <Line data={ageGroupChartData} options={ageGroupOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="h-[300px]">
            <Line data={historicalChartData} options={historicalOptions} />
          </div>
        </div>
      </div>

      {/* Analysis Text */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Sex Ratio Analysis</h3>
        <div className="prose prose-sm max-w-none text-gray-700">
          <p className="mb-3">
            The sex ratio comparison reveals important demographic patterns. {country1Name}'s overall sex ratio of {overallRatio1.toFixed(1)} 
            {overallRatio1 > overallRatio2 ? ' exceeds' : ' is lower than'} {country2Name}'s ratio of {overallRatio2.toFixed(1)} males per 100 females.
            {(sexRatioAtBirth1 > 110 || sexRatioAtBirth2 > 110) && 
              ' Notably, the sex ratio at birth shows concerning imbalances that may indicate gender-selective practices.'}
          </p>
          
          {(missingWomen1 > 0 || missingWomen2 > 0) && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
              <h4 className="font-semibold text-red-800 mb-2">Gender Imbalance Alert</h4>
              <p className="text-red-700">
                {missingWomen1 > 0 && `${country1Name}: Approximately ${missingWomen1.toLocaleString()} missing female births in 0-4 age group. `}
                {missingWomen2 > 0 && `${country2Name}: Approximately ${missingWomen2.toLocaleString()} missing female births in 0-4 age group.`}
              </p>
            </div>
          )}
          
          <p className="mt-3">
            The age-specific sex ratios show how gender balance changes across the lifespan. Both countries exhibit the natural pattern of 
            declining male-to-female ratios with age, reflecting higher male mortality rates. However, the pace and pattern of this decline 
            differs significantly, influenced by factors including healthcare access, occupational hazards, and lifestyle differences.
          </p>
        </div>
      </div>
    </div>
  );
}