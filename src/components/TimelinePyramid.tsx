'use client';

import { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import type { CountryPopulationData } from '@/types/population';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TimelinePyramidProps {
  countryData: CountryPopulationData;
  countryName: string;
  height?: number;
  className?: string;
}

export default function TimelinePyramid({
  countryData,
  countryName,
  height = 500,
  className = ''
}: TimelinePyramidProps) {
  const availableYears = Object.keys(countryData.years).map(Number).sort();
  const minYear = Math.min(...availableYears);
  const maxYear = Math.max(...availableYears);
  
  const [currentYear, setCurrentYear] = useState(minYear);
  const [isPlaying, setIsPlaying] = useState(true); // Auto-play on load
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play animation
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentYear(prev => {
          // Find next available year
          const currentIndex = availableYears.indexOf(prev);
          if (currentIndex === -1 || currentIndex >= availableYears.length - 1) {
            return availableYears[0]; // Loop back to first available year
          }
          return availableYears[currentIndex + 1]; // Move to next available year
        });
      }, 500);
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
  }, [isPlaying, availableYears]);

  const yearData = countryData.years[currentYear.toString()];
  
  if (!yearData) {
    return <div className="bg-white rounded-lg shadow-sm p-6">No data available for {currentYear}</div>;
  }

  // Calculate max population across all years for fixed scale
  const maxPopulation = Math.max(
    ...Object.values(countryData.years).flatMap(year => 
      year.ageGroups.map(ag => Math.max(ag.male, ag.female))
    )
  );

  // Add 10% padding
  const maxScale = Math.ceil(maxPopulation * 1.1);

  const chartData = {
    labels: yearData.ageGroups.map(ag => ag.ageRange).reverse(),
    datasets: [
      {
        label: 'Male',
        data: yearData.ageGroups.map(ag => -ag.male).reverse(),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Female',
        data: yearData.ageGroups.map(ag => ag.female).reverse(),
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
    animation: {
      duration: 300 // Smooth transition between years
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = Math.abs(context.parsed.x);
            return `${context.dataset.label}: ${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        min: -maxScale,
        max: maxScale,
        ticks: {
          callback: function(value: string | number) {
            return Math.abs(Number(value)).toLocaleString();
          }
        },
      },
      y: {
        stacked: true,
        position: 'left',
      }
    }
  };


  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Historical Demographic Changes
        </h2>
        <p className="text-gray-600">
          Watch how {countryName}'s population structure evolved from {minYear} to {maxYear}
        </p>
      </div>

      {/* Year Display */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-4 bg-blue-50 px-8 py-4 rounded-lg">
          <span className="text-5xl font-bold text-blue-600">{currentYear}</span>
          <div className="text-left text-sm text-gray-600">
            <div>Population: {yearData.totalPopulation.toLocaleString()}</div>
            <div>Median Age: {yearData.medianAge.toFixed(1)} years</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: `${height}px` }} className="bg-white rounded-lg mb-4">
        <Bar data={chartData} options={options} />
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Play/Pause Button */}
        <div className="flex justify-center">
          <button
            onClick={togglePlayPause}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-semibold"
          >
            {isPlaying ? (
              <>
                <span>⏸</span>
                <span>Pause</span>
              </>
            ) : (
              <>
                <span>▶</span>
                <span>Play Animation</span>
              </>
            )}
          </button>
        </div>

        {/* Year Slider */}
        <div>
          <input
            type="range"
            min={0}
            max={availableYears.length - 1}
            value={availableYears.indexOf(currentYear)}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentYear(availableYears[parseInt(e.target.value)]);
            }}
            className="w-full h-3 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(availableYears.indexOf(currentYear) / (availableYears.length - 1)) * 100}%, #dbeafe ${(availableYears.indexOf(currentYear) / (availableYears.length - 1)) * 100}%, #dbeafe 100%)`
            }}
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{minYear}</span>
            <span className="font-semibold text-blue-600">{currentYear}</span>
            <span>{maxYear}</span>
          </div>
        </div>

        {/* Quick Jump Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[minYear, 1980, 1990, 2000, 2010, 2020, maxYear]
            .filter((year, index, self) => self.indexOf(year) === index) // Remove duplicates
            .filter(year => availableYears.includes(year))
            .map(year => (
              <button
                key={year}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentYear(year);
                }}
                className={`px-3 py-1 rounded text-sm transition ${
                  currentYear === year
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {year}
              </button>
            ))}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Animation speed: 0.5 seconds per year • Drag slider or click years to explore manually
      </div>
    </div>
  );
}