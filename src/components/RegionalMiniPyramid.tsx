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
import type { AgeGroupData } from '@/types/population';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RegionalMiniPyramidProps {
  ageGroups: AgeGroupData[];
  countryName: string;
  isHighlighted?: boolean;
}

export default function RegionalMiniPyramid({ 
  ageGroups, 
  countryName, 
  isHighlighted = false 
}: RegionalMiniPyramidProps) {
  const chartData = {
    labels: ageGroups.map(ag => ag.ageRange).reverse(),
    datasets: [
      {
        label: 'Male',
        data: ageGroups.map(ag => -ag.male).reverse(),
        backgroundColor: isHighlighted ? 'rgba(34, 197, 94, 0.8)' : 'rgba(59, 130, 246, 0.8)',
        borderColor: isHighlighted ? 'rgba(34, 197, 94, 1)' : 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Female',
        data: ageGroups.map(ag => ag.female).reverse(),
        backgroundColor: isHighlighted ? 'rgba(251, 146, 60, 0.8)' : 'rgba(236, 72, 153, 0.8)',
        borderColor: isHighlighted ? 'rgba(251, 146, 60, 1)' : 'rgba(236, 72, 153, 1)',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: {
        stacked: true,
        display: false,
      },
      y: {
        stacked: true,
        display: false,
      }
    }
  };

  return <Bar data={chartData} options={options} />;
}