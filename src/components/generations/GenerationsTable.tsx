import type { GenerationPopulation } from '@/lib/generation-utils';

interface GenerationsTableProps {
  generationData: GenerationPopulation[];
  countryName: string;
}

export function GenerationsTable({ generationData, countryName }: GenerationsTableProps) {
  // Handle empty data
  if (generationData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <p className="text-gray-600 text-center">
          Generation data not available for {countryName}.
        </p>
      </div>
    );
  }

  const totalPopulation = generationData.reduce((sum, gen) => sum + gen.population, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
      <div className="p-6 border-b bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900">
          Generation Breakdown by Population {countryName !== 'World' && `- ${countryName}`}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Total Population: {totalPopulation.toLocaleString()}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Generation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Birth Years
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Age Range (2026)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Population
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                % of Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Male
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Female
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {generationData.map((gen, index) => (
              <tr key={gen.generation.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                      style={{ backgroundColor: gen.generation.color }}
                      aria-hidden="true"
                    />
                    <span className="font-medium text-gray-900">
                      {gen.generation.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {gen.generation.birthYearStart}-{gen.generation.birthYearEnd}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {gen.ageRange} years
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                  {gen.population.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                  {gen.percentOfTotal.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                  {gen.malePopulation.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                  {gen.femalePopulation.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td colSpan={3} className="px-6 py-3 text-left font-medium text-gray-900">
                Total
              </td>
              <td className="px-6 py-3 text-right font-bold text-gray-900">
                {totalPopulation.toLocaleString()}
              </td>
              <td className="px-6 py-3 text-right font-bold text-gray-900">
                100.0%
              </td>
              <td className="px-6 py-3 text-right font-medium text-gray-700">
                {generationData.reduce((sum, gen) => sum + gen.malePopulation, 0).toLocaleString()}
              </td>
              <td className="px-6 py-3 text-right font-medium text-gray-700">
                {generationData.reduce((sum, gen) => sum + gen.femalePopulation, 0).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {/* Data source attribution */}
      <div className="px-6 py-3 bg-gray-50 border-t text-xs text-gray-600">
        <p>
          Source: UN World Population Prospects 2024 • Generation definitions: Pew Research Center
        </p>
      </div>
    </div>
  );
}