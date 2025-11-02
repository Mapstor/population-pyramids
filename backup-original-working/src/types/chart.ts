export interface PyramidChartData {
  labels: string[];
  datasets: [
    {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    },
    {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }
  ];
}

export interface PyramidChartOptions {
  indexAxis: 'y';
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
      position: 'top' | 'bottom';
    };
    tooltip: {
      callbacks: {
        label: (context: any) => string;
      };
    };
  };
  scales: {
    x: {
      stacked: boolean;
      ticks: {
        callback: (value: number) => string;
      };
    };
    y: {
      stacked: boolean;
      position: 'left';
    };
  };
}