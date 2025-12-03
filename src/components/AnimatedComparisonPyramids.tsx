'use client';

import { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import type { CountryData, YearData } from '@/types/population';

interface AnimatedComparisonPyramidsProps {
  country1Data: CountryData;
  country2Data: CountryData;
  country1Name: string;
  country2Name: string;
}

export default function AnimatedComparisonPyramids({
  country1Data,
  country2Data,
  country1Name,
  country2Name
}: AnimatedComparisonPyramidsProps) {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get available years (assuming both countries have same years)
  const availableYears = Object.keys(country1Data.years)
    .map(Number)
    .filter(year => !isNaN(year) && country2Data.years[year])
    .sort((a, b) => a - b);

  const minYear = availableYears[0];
  const maxYear = availableYears[availableYears.length - 1];

  // Intersection observer for auto-play on scroll
  useEffect(() => {
    if (!containerRef.current || hasAutoPlayed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAutoPlayed) {
            // Start from beginning and play
            setSelectedYear(minYear);
            setIsPlaying(true);
            setHasAutoPlayed(true);
          }
        });
      },
      {
        threshold: 0.5 // Trigger when 50% of the component is visible
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasAutoPlayed, minYear]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setSelectedYear(prev => {
          if (prev >= maxYear) {
            setIsPlaying(false);
            return maxYear; // Stay at max year instead of resetting
          }
          return prev + 1;
        });
      }, 200); // Change year every 200ms
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, maxYear, minYear]);

  const currentYear1Data = country1Data.years[selectedYear];
  const currentYear2Data = country2Data.years[selectedYear];

  if (!currentYear1Data || !currentYear2Data) {
    return <div>No data available for {selectedYear}</div>;
  }

  const createPyramidData = (data: YearData) => ({
    labels: data.ageGroups.map(ag => ag.ageRange).reverse(),
    datasets: [
      // Base male bars (up to the minimum)
      {
        label: 'Male',
        data: data.ageGroups.map(ag => -Math.min(ag.male, ag.female)).reverse(),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderWidth: 0,
        barPercentage: 0.9,
      },
      // Male surplus (only if males > females)
      {
        label: '',
        data: data.ageGroups.map(ag => {
          const surplus = ag.male - ag.female;
          return surplus > 0 ? -surplus : 0;
        }).reverse(),
        backgroundColor: 'rgba(30, 64, 175, 0.9)',
        borderWidth: 0,
        barPercentage: 0.9,
      },
      // Base female bars (up to the minimum)
      {
        label: 'Female',
        data: data.ageGroups.map(ag => Math.min(ag.male, ag.female)).reverse(),
        backgroundColor: 'rgba(236, 72, 153, 0.8)',
        borderWidth: 0,
        barPercentage: 0.9,
      },
      // Female surplus (only if females > males)
      {
        label: '',
        data: data.ageGroups.map(ag => {
          const surplus = ag.female - ag.male;
          return surplus > 0 ? surplus : 0;
        }).reverse(),
        backgroundColor: 'rgba(190, 24, 93, 0.9)',
        borderWidth: 0,
        barPercentage: 0.9,
      }
    ]
  });

  // Find max value across all years for consistent scaling
  const getAllMaxValues = () => {
    let maxVal = 0;
    availableYears.forEach(year => {
      const data1 = country1Data.years[year];
      const data2 = country2Data.years[year];
      if (data1 && data2) {
        const max1 = Math.max(...data1.ageGroups.map(ag => Math.max(ag.male, ag.female)));
        const max2 = Math.max(...data2.ageGroups.map(ag => Math.max(ag.male, ag.female)));
        maxVal = Math.max(maxVal, max1, max2);
      }
    });
    return maxVal * 1.1;
  };

  const maxValue = getAllMaxValues();

  const createOptions = (title: string): ChartOptions<'bar'> => ({
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Disable animation for smooth transitions
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${title} - ${selectedYear}`,
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
          }
        },
        max: maxValue,
        min: -maxValue
      },
      y: {
        stacked: true,
        grid: {
          display: false
        }
      }
    }
  });

  return (
    <div ref={containerRef}>
      {/* Controls */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              isPlaying 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play Animation'}
          </button>
          
          <div className="flex-1 w-full">
            <input
              type="range"
              min={minYear}
              max={maxYear}
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>{minYear}</span>
              <span className="font-bold text-lg text-blue-600">{selectedYear}</span>
              <span>{maxYear}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedYear(prev => Math.max(minYear, prev - 1))}
              disabled={selectedYear <= minYear}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedYear(prev => Math.min(maxYear, prev + 1))}
              disabled={selectedYear >= maxYear}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Animated Pyramids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[500px]">
          <Bar 
            data={createPyramidData(currentYear1Data)} 
            options={createOptions(country1Name)}
          />
        </div>
        <div className="h-[500px]">
          <Bar 
            data={createPyramidData(currentYear2Data)} 
            options={createOptions(country2Name)}
          />
        </div>
      </div>

      {/* Year-specific stats */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Population Difference</p>
            <p className="text-xl font-bold">
              {((currentYear1Data.totalPopulation - currentYear2Data.totalPopulation) / 1_000_000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-500">
              {currentYear1Data.totalPopulation > currentYear2Data.totalPopulation 
                ? `${country1Name} larger` 
                : `${country2Name} larger`}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Growth Since {minYear}</p>
            <div className="flex justify-center gap-4">
              <div>
                <p className="font-semibold text-blue-600">{country1Name}</p>
                <p className="text-lg">
                  {country1Data.years[minYear] ? 
                    `+${(((currentYear1Data.totalPopulation / country1Data.years[minYear].totalPopulation) - 1) * 100).toFixed(1)}%` :
                    'N/A'
                  }
                </p>
              </div>
              <div>
                <p className="font-semibold text-pink-600">{country2Name}</p>
                <p className="text-lg">
                  {country2Data.years[minYear] ? 
                    `+${(((currentYear2Data.totalPopulation / country2Data.years[minYear].totalPopulation) - 1) * 100).toFixed(1)}%` :
                    'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Population Ratio</p>
            <p className="text-xl font-bold">
              1 : {(currentYear2Data.totalPopulation / currentYear1Data.totalPopulation).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">{country1Name} : {country2Name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}