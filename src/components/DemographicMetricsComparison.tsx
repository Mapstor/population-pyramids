import type { DemographicMetrics } from '@/types/population';

interface DemographicMetricsComparisonProps {
  metrics1: DemographicMetrics;
  metrics2: DemographicMetrics;
  country1Name: string;
  country2Name: string;
}

export default function DemographicMetricsComparison({
  metrics1,
  metrics2,
  country1Name,
  country2Name
}: DemographicMetricsComparisonProps) {
  
  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  const formatPercent = (num: number) => `${num.toFixed(1)}%`;

  const metrics = [
    {
      label: 'Total Population',
      value1: formatNumber(metrics1.totalPopulation),
      value2: formatNumber(metrics2.totalPopulation),
      diff: ((metrics1.totalPopulation - metrics2.totalPopulation) / metrics2.totalPopulation * 100).toFixed(1),
      unit: ''
    },
    {
      label: 'Median Age',
      value1: `${metrics1.medianAge.toFixed(1)}`,
      value2: `${metrics2.medianAge.toFixed(1)}`,
      diff: (metrics1.medianAge - metrics2.medianAge).toFixed(1),
      unit: 'years'
    },
    {
      label: 'Youth Population (0-14)',
      value1: formatNumber(metrics1.youthPopulation),
      value2: formatNumber(metrics2.youthPopulation),
      diff: ((metrics1.youthPopulation - metrics2.youthPopulation) / metrics2.youthPopulation * 100).toFixed(1),
      unit: '',
      percent1: formatPercent(metrics1.youthPercentage),
      percent2: formatPercent(metrics2.youthPercentage)
    },
    {
      label: 'Working Age (15-64)',
      value1: formatNumber(metrics1.workingAgePopulation),
      value2: formatNumber(metrics2.workingAgePopulation),
      diff: ((metrics1.workingAgePopulation - metrics2.workingAgePopulation) / metrics2.workingAgePopulation * 100).toFixed(1),
      unit: '',
      percent1: formatPercent(metrics1.workingAgePercentage),
      percent2: formatPercent(metrics2.workingAgePercentage)
    },
    {
      label: 'Elderly Population (65+)',
      value1: formatNumber(metrics1.elderlyPopulation),
      value2: formatNumber(metrics2.elderlyPopulation),
      diff: ((metrics1.elderlyPopulation - metrics2.elderlyPopulation) / metrics2.elderlyPopulation * 100).toFixed(1),
      unit: '',
      percent1: formatPercent(metrics1.elderlyPercentage),
      percent2: formatPercent(metrics2.elderlyPercentage)
    },
    {
      label: 'Total Dependency Ratio',
      value1: metrics1.dependencyRatio.toFixed(1),
      value2: metrics2.dependencyRatio.toFixed(1),
      diff: (metrics1.dependencyRatio - metrics2.dependencyRatio).toFixed(1),
      unit: 'per 100'
    },
    {
      label: 'Youth Dependency Ratio',
      value1: metrics1.childDependencyRatio.toFixed(1),
      value2: metrics2.childDependencyRatio.toFixed(1),
      diff: (metrics1.childDependencyRatio - metrics2.childDependencyRatio).toFixed(1),
      unit: 'per 100'
    },
    {
      label: 'Old-Age Dependency Ratio',
      value1: metrics1.oldAgeDependencyRatio.toFixed(1),
      value2: metrics2.oldAgeDependencyRatio.toFixed(1),
      diff: (metrics1.oldAgeDependencyRatio - metrics2.oldAgeDependencyRatio).toFixed(1),
      unit: 'per 100'
    },
    {
      label: 'Sex Ratio',
      value1: metrics1.sexRatio.toFixed(1),
      value2: metrics2.sexRatio.toFixed(1),
      diff: (metrics1.sexRatio - metrics2.sexRatio).toFixed(1),
      unit: 'M/100F'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Metric</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">{country1Name}</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-pink-600">{country2Name}</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Difference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {metrics.map((metric, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {metric.label}
                </td>
                <td className="px-6 py-4 text-center">
                  <div>
                    <span className="text-lg font-semibold text-gray-900">
                      {metric.value1} {metric.unit}
                    </span>
                    {metric.percent1 && (
                      <span className="block text-xs text-gray-500">{metric.percent1}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div>
                    <span className="text-lg font-semibold text-gray-900">
                      {metric.value2} {metric.unit}
                    </span>
                    {metric.percent2 && (
                      <span className="block text-xs text-gray-500">{metric.percent2}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                    parseFloat(metric.diff) > 0 
                      ? 'bg-green-100 text-green-800' 
                      : parseFloat(metric.diff) < 0 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {parseFloat(metric.diff) > 0 ? '+' : ''}{metric.diff}{metric.unit === 'years' || metric.unit.includes('100') ? '' : '%'}
                  </span>
                </td>
              </tr>
            ))}
            
            {/* Pyramid Type Row */}
            <tr className="bg-yellow-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                Population Structure Type
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  metrics1.pyramidType === 'expansive' 
                    ? 'bg-green-100 text-green-800'
                    : metrics1.pyramidType === 'constrictive'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {metrics1.pyramidType.charAt(0).toUpperCase() + metrics1.pyramidType.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  metrics2.pyramidType === 'expansive' 
                    ? 'bg-green-100 text-green-800'
                    : metrics2.pyramidType === 'constrictive'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {metrics2.pyramidType.charAt(0).toUpperCase() + metrics2.pyramidType.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="text-sm text-gray-600">
                  {metrics1.pyramidType === metrics2.pyramidType ? 'Same' : 'Different'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">{metric.label}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-blue-600 font-medium mb-1">{country1Name}</p>
                <p className="text-lg font-bold">
                  {metric.value1} {metric.unit}
                </p>
                {metric.percent1 && (
                  <p className="text-xs text-gray-500">{metric.percent1}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-pink-600 font-medium mb-1">{country2Name}</p>
                <p className="text-lg font-bold">
                  {metric.value2} {metric.unit}
                </p>
                {metric.percent2 && (
                  <p className="text-xs text-gray-500">{metric.percent2}</p>
                )}
              </div>
            </div>
            <div className="mt-2 pt-2 border-t">
              <span className="text-xs text-gray-500">Difference: </span>
              <span className={`text-sm font-medium ${
                parseFloat(metric.diff) > 0 ? 'text-green-600' : parseFloat(metric.diff) < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {parseFloat(metric.diff) > 0 ? '+' : ''}{metric.diff}{metric.unit === 'years' || metric.unit.includes('100') ? '' : '%'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> Dependency ratios represent the number of dependents (youth + elderly) per 100 working-age individuals. 
          Higher ratios indicate greater economic burden on the working population.
        </p>
      </div>
    </div>
  );
}