'use client';

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MiniStatePyramidProps {
  data: any;
  stateName: string;
  height?: number;
}

export default function MiniStatePyramid({ 
  data, 
  stateName,
  height = 200
}: MiniStatePyramidProps) {
  if (!data) return <div className="text-gray-500 text-sm">No data available</div>;

  // Calculate max value for symmetry
  const maxMale = Math.max(...data.ageGroups.map((ag: any) => ag.male));
  const maxFemale = Math.max(...data.ageGroups.map((ag: any) => ag.female));
  const maxValue = Math.max(maxMale, maxFemale);

  const chartData = {
    labels: data.ageGroups.map((ag: any) => ag.ageRange).reverse(),
    datasets: [
      {
        label: 'Male',
        data: data.ageGroups.map((ag: any) => -ag.male).reverse(),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 0.5,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
      {
        label: 'Female',
        data: data.ageGroups.map((ag: any) => ag.female).reverse(),
        backgroundColor: 'rgba(236, 72, 153, 0.8)',
        borderColor: 'rgba(236, 72, 153, 1)',
        borderWidth: 0.5,
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
        display: false
      },
      title: {
        display: true,
        text: stateName,
        font: {
          size: 12,
          weight: 'bold'
        }
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        stacked: true,
        min: -maxValue,
        max: maxValue,
        display: false,
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
        display: false,
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}