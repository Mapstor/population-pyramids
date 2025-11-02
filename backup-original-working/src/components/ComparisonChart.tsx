'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CountryData {
  countryCode: string;
  countryName: string;
  slug: string;
  region: string;
  years: Record<string, any>;
}

interface ComparisonChartProps {
  countryData1: CountryData;
  countryData2: CountryData;
  year: number;
}

export default function ComparisonChart({
  countryData1,
  countryData2,
  year
}: ComparisonChartProps) {
  const chartRef = useRef<any>(null);

  const yearData1 = countryData1.years[year.toString()];
  const yearData2 = countryData2.years[year.toString()];

  if (!yearData1 || !yearData2) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          Data not available for {year}
        </div>
      </div>
    );
  }

  // Prepare chart data
  const ageGroups = yearData1.ageGroups.map((group: any) => group.ageRange).reverse();
  
  const data = {
    labels: ageGroups,
    datasets: [
      {
        label: `${countryData1.countryName} - Male`,
        data: yearData1.ageGroups.map((group: any) => -group.malePercent).reverse(),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: `${countryData1.countryName} - Female`,
        data: yearData1.ageGroups.map((group: any) => group.femalePercent).reverse(),
        backgroundColor: 'rgba(236, 72, 153, 0.8)',
        borderColor: 'rgba(236, 72, 153, 1)',
        borderWidth: 1,
      },
      {
        label: `${countryData2.countryName} - Male`,
        data: yearData2.ageGroups.map((group: any) => -group.malePercent).reverse(),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: `${countryData2.countryName} - Female`,
        data: yearData2.ageGroups.map((group: any) => group.femalePercent).reverse(),
        backgroundColor: 'rgba(251, 146, 60, 0.6)',
        borderColor: 'rgba(251, 146, 60, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      title: {
        display: true,
        text: `Population Pyramid Comparison - ${countryData1.countryName} vs ${countryData2.countryName} (${year})`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = Math.abs(context.parsed.x);
            const gender = context.parsed.x < 0 ? 'Male' : 'Female';
            return `${context.dataset.label}: ${value.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return Math.abs(value) + '%';
          },
        },
        title: {
          display: true,
          text: 'Percentage of Population',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Age Groups',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="h-96 md:h-[600px]">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
      
      {/* Chart Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>{countryData1.countryName} Male</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-pink-500 rounded"></div>
          <span>{countryData1.countryName} Female</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 opacity-60 rounded"></div>
          <span>{countryData2.countryName} Male</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-400 opacity-60 rounded"></div>
          <span>{countryData2.countryName} Female</span>
        </div>
      </div>
    </div>
  );
}