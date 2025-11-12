'use client';

import { useState, useEffect, useMemo } from 'react';
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

interface WorldPopulationPyramidProps {
  worldData: Record<string, YearData>;
  className?: string;
}

export default function WorldPopulationPyramid({
  worldData,
  className = ''
}: WorldPopulationPyramidProps) {
  const [currentYear, setCurrentYear] = useState(1950);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(200);

  const availableYears = Object.keys(worldData).map(Number).sort((a, b) => a - b);
  const yearData = worldData[currentYear.toString()];

  // Calculate the maximum values across all years to fix the scale
  const maxValues = useMemo(() => {
    let maxMale = 0;
    let maxFemale = 0;
    
    Object.values(worldData).forEach(data => {
      data.ageGroups.forEach(ageGroup => {
        const maleValue = ageGroup.male / 1000000;
        const femaleValue = ageGroup.female / 1000000;
        if (maleValue > maxMale) maxMale = maleValue;
        if (femaleValue > maxFemale) maxFemale = femaleValue;
      });
    });
    
    // Add some padding (10%) to the maximum values
    const padding = 1.1;
    return {
      maxMale: maxMale * padding,
      maxFemale: maxFemale * padding,
      max: Math.max(maxMale, maxFemale) * padding
    };
  }, [worldData]);

  // Animation effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentYear(prev => {
        const currentIndex = availableYears.indexOf(prev);
        if (currentIndex >= availableYears.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return availableYears[currentIndex + 1];
      });
    }, playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, availableYears]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentYear >= Math.max(...availableYears)) {
        setCurrentYear(Math.min(...availableYears));
      }
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentYear(2024);
  };

  const chartData = {
    labels: yearData?.ageGroups.map(ag => ag.ageRange).reverse() || [],
    datasets: [
      {
        label: 'Male',
        data: yearData?.ageGroups.map(ag => -ag.male / 1000000).reverse() || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
      {
        label: 'Female',
        data: yearData?.ageGroups.map(ag => ag.female / 1000000).reverse() || [],
        backgroundColor: 'rgba(236, 72, 153, 0.8)',
        borderColor: 'rgba(236, 72, 153, 1)',
        borderWidth: 1,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      }
    ]
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          generateLabels: (chart) => {
            return [
              {
                text: 'Male',
                fillStyle: 'rgba(59, 130, 246, 0.8)',
                strokeStyle: 'rgba(59, 130, 246, 1)',
                lineWidth: 1,
              },
              {
                text: 'Female',
                fillStyle: 'rgba(236, 72, 153, 0.8)',
                strokeStyle: 'rgba(236, 72, 153, 1)',
                lineWidth: 1,
              }
            ];
          }
        }
      },
      title: {
        display: true,
        text: `World Population Pyramid - ${currentYear}`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          title: function(tooltipItems) {
            return `Age Group: ${tooltipItems[0].label}`;
          },
          label: function(context) {
            const value = Math.abs(context.parsed.x || 0);
            return `${context.dataset.label}: ${(value * 1000000).toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        min: -maxValues.max,
        max: maxValues.max,
        ticks: {
          callback: function(value) {
            return Math.abs(Number(value)).toFixed(1) + 'M';
          }
        },
        title: {
          display: true,
          text: 'Population (Millions)'
        }
      },
      y: {
        stacked: true,
        position: 'left',
        title: {
          display: true,
          text: 'Age Groups'
        }
      }
    },
    animation: {
      duration: isPlaying ? 0 : 750,
    }
  };

  if (!yearData) {
    return <div className="text-center py-8">Loading world population data...</div>;
  }

  const totalPopBillions = (yearData.totalPopulation / 1000000000).toFixed(2);
  const medianAge = yearData.medianAge.toFixed(2);

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Stats Header */}
      <div className="mb-6 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{totalPopBillions}B</div>
            <div className="text-sm text-gray-600">Total Population</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{medianAge}</div>
            <div className="text-sm text-gray-600">Median Age (years)</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{currentYear}</div>
            <div className="text-sm text-gray-600">Current Year</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: '500px' }} className="mb-6">
        <Bar data={chartData} options={options} />
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Year Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year: {currentYear}
          </label>
          <input
            type="range"
            min={Math.min(...availableYears)}
            max={Math.max(...availableYears)}
            value={currentYear}
            onChange={(e) => {
              setCurrentYear(Number(e.target.value));
              setIsPlaying(false);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1950</span>
            <span>2025</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
          <button
            onClick={handlePlayPause}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition text-sm sm:text-base ${
              isPlaying 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          
          <button
            onClick={handleReset}
            className="px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
          >
            🔄 Reset
          </button>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Speed:</label>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={50}>4x</option>
              <option value={100}>2x</option>
              <option value={200}>1x</option>
              <option value={500}>0.5x</option>
            </select>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}