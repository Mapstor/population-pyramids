import type { YearData, DemographicMetrics } from '@/types/population';

interface StatsTableProps {
  data?: YearData;
  metrics: DemographicMetrics;
  countryName: string;
  year: number;
  showCalculations?: boolean;
  className?: string;
}

export default function StatsTable({
  data,
  metrics,
  countryName,
  year,
  showCalculations = false,
  className = ''
}: StatsTableProps) {
  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercent = (num: number) => `${num.toFixed(1)}%`;

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Key Demographics
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-3 text-gray-700 font-medium">Total Population</td>
              <td className="py-3 text-right font-semibold text-gray-900">
                {formatNumber(metrics.totalPopulation)}
              </td>
            </tr>

            <tr>
              <td className="py-3 text-gray-700">Male Population</td>
              <td className="py-3 text-right text-gray-900">
                {formatNumber(metrics.malePopulation)}
                <span className="ml-2 text-sm text-gray-600">
                  ({formatPercent(metrics.malePercent)})
                </span>
              </td>
            </tr>

            <tr>
              <td className="py-3 text-gray-700">Female Population</td>
              <td className="py-3 text-right text-gray-900">
                {formatNumber(metrics.femalePopulation)}
                <span className="ml-2 text-sm text-gray-600">
                  ({formatPercent(metrics.femalePercent)})
                </span>
              </td>
            </tr>

            <tr>
              <td className="py-3 text-gray-700">Median Age</td>
              <td className="py-3 text-right text-gray-900">
                {metrics.medianAge.toFixed(1)} years
              </td>
            </tr>

            <tr>
              <td className="py-3 text-gray-700">Sex Ratio</td>
              <td className="py-3 text-right text-gray-900">
                {metrics.sexRatio.toFixed(1)} males per 100 females
              </td>
            </tr>

            <tr className="bg-gray-50">
              <td className="py-3 text-gray-700 font-medium">Youth (0-14)</td>
              <td className="py-3 text-right text-gray-900">
                {formatNumber(metrics.youthPopulation)}
                <span className="ml-2 text-sm text-gray-600">
                  ({formatPercent(metrics.youthPercentage)})
                </span>
              </td>
            </tr>

            <tr className="bg-gray-50">
              <td className="py-3 text-gray-700 font-medium">Working Age (15-64)</td>
              <td className="py-3 text-right text-gray-900">
                {formatNumber(metrics.workingAgePopulation)}
                <span className="ml-2 text-sm text-gray-600">
                  ({formatPercent(metrics.workingAgePercentage)})
                </span>
              </td>
            </tr>

            <tr className="bg-gray-50">
              <td className="py-3 text-gray-700 font-medium">Elderly (65+)</td>
              <td className="py-3 text-right text-gray-900">
                {formatNumber(metrics.elderlyPopulation)}
                <span className="ml-2 text-sm text-gray-600">
                  ({formatPercent(metrics.elderlyPercentage)})
                </span>
              </td>
            </tr>

            <tr>
              <td className="py-3 text-gray-700">Total Dependency Ratio</td>
              <td className="py-3 text-right text-gray-900">
                {metrics.dependencyRatio.toFixed(1)}
              </td>
            </tr>

            <tr>
              <td className="py-3 text-gray-700">Youth Dependency Ratio</td>
              <td className="py-3 text-right text-gray-900">
                {metrics.childDependencyRatio.toFixed(1)}
              </td>
            </tr>

            <tr>
              <td className="py-3 text-gray-700">Old Age Dependency Ratio</td>
              <td className="py-3 text-right text-gray-900">
                {metrics.oldAgeDependencyRatio.toFixed(1)}
              </td>
            </tr>

            <tr>
              <td className="py-3 text-gray-700">Pyramid Type</td>
              <td className="py-3 text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  metrics.pyramidType === 'expansive' 
                    ? 'bg-green-100 text-green-800'
                    : metrics.pyramidType === 'constrictive'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {metrics.pyramidType.charAt(0).toUpperCase() + metrics.pyramidType.slice(1)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500 border-t border-gray-200 pt-4">
        <p>
          <strong>Dependency Ratios:</strong> Number of dependents per 100 working-age individuals.
        </p>
      </div>
    </div>
  );
}