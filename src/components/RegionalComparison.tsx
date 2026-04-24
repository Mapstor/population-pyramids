// Server Component - no 'use client' directive

import Link from 'next/link';
import RegionalMiniPyramid from './RegionalMiniPyramid';
import { formatPopulationCompact } from '@/lib/number-format';
import type { YearData, DemographicMetrics } from '@/types/population';

interface ComparisonCountry {
  slug: string;
  name: string;
  data: YearData | null;
  metrics: DemographicMetrics | null;
}

interface RegionalComparisonProps {
  currentCountry: {
    slug: string;
    name: string;
    data: YearData;
    metrics: DemographicMetrics;
  };
  neighborCountries: ComparisonCountry[];
  year: number;
}

export default function RegionalComparison({ 
  currentCountry, 
  neighborCountries,
  year 
}: RegionalComparisonProps) {
  
  // REVISION 2a: Hide component if no neighbors
  if (neighborCountries.length === 0) {
    return null;
  }
  
  // Generate comparison insights (server-side)
  const generateInsights = () => {
    const validCountries = neighborCountries.filter(c => c.metrics);
    if (validCountries.length === 0) return 'No regional comparison data available.';

    const insights: string[] = [];
    
    // Median age comparisons
    const olderCountries = validCountries.filter(c => c.metrics!.medianAge > currentCountry.metrics.medianAge);
    const youngerCountries = validCountries.filter(c => c.metrics!.medianAge < currentCountry.metrics.medianAge);
    
    if (olderCountries.length > 0) {
      insights.push(`${currentCountry.name} has a younger population than ${olderCountries.map(c => c.name).join(', ')}`);
    }
    if (youngerCountries.length > 0) {
      insights.push(`${currentCountry.name} has an older population than ${youngerCountries.map(c => c.name).join(', ')}`);
    }
    
    // Population size comparison
    const largerCountries = validCountries.filter(c => c.data!.totalPopulation > currentCountry.data.totalPopulation);
    const smallerCountries = validCountries.filter(c => c.data!.totalPopulation < currentCountry.data.totalPopulation);
    
    if (largerCountries.length > 0) {
      insights.push(`${currentCountry.name} has a smaller population than ${largerCountries.map(c => c.name).join(', ')}`);
    }
    if (smallerCountries.length > 0) {
      insights.push(`${currentCountry.name} has a larger population than ${smallerCountries.map(c => c.name).join(', ')}`);
    }

    return insights.slice(0, 2).join('. ') + '.';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        How Does {currentCountry.name} Compare to Its Neighbors?
      </h2>
      
      {/* Insights - Server Rendered */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-gray-700 leading-relaxed">
          {generateInsights()}
        </p>
      </div>

      {/* Mini Pyramids Grid - Server Rendered Structure */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {/* Current Country (highlighted) */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="h-32 mb-3">
            <RegionalMiniPyramid 
              ageGroups={currentCountry.data.ageGroups}
              countryName={currentCountry.name}
              isHighlighted={true}
            />
          </div>
          <h3 className="font-bold text-sm text-center text-green-800 mb-1">
            {currentCountry.name}
          </h3>
          <div className="text-xs text-center text-green-600">
            {/* REVISION 1: Use formatPopulationCompact */}
            <div>Pop: {formatPopulationCompact(currentCountry.data.totalPopulation)}</div>
            <div>Age: {currentCountry.metrics.medianAge.toFixed(1)}</div>
          </div>
        </div>

        {/* Neighbor Countries */}
        {neighborCountries.map((country) => (
          <Link 
            key={country.slug} 
            href={`/${country.slug}`}
            className="block bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition"
          >
            <div className="h-32 mb-3">
              {country.data && (
                <RegionalMiniPyramid 
                  ageGroups={country.data.ageGroups}
                  countryName={country.name}
                  isHighlighted={false}
                />
              )}
            </div>
            <h3 className="font-semibold text-sm text-center text-gray-800 mb-1">
              {country.name}
            </h3>
            {country.data && country.metrics ? (
              <div className="text-xs text-center text-gray-600">
                {/* REVISION 1: Use formatPopulationCompact */}
                <div>Pop: {formatPopulationCompact(country.data.totalPopulation)}</div>
                <div>Age: {country.metrics.medianAge.toFixed(1)}</div>
              </div>
            ) : (
              <div className="text-xs text-center text-gray-400">No data</div>
            )}
          </Link>
        ))}
      </div>

      {/* Comparison Table - Fully Server Rendered */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Country</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Population</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Median Age</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Youth %</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Elderly %</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Pyramid Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* Current Country Row (highlighted) */}
            <tr className="bg-green-50">
              <td className="px-4 py-3 font-semibold text-green-800">
                {currentCountry.name} (Current)
              </td>
              <td className="px-4 py-3 text-right text-green-800">
                {currentCountry.data.totalPopulation.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right text-green-800">
                {currentCountry.metrics.medianAge.toFixed(1)}
              </td>
              <td className="px-4 py-3 text-right text-green-800">
                {currentCountry.metrics.youthPercentage.toFixed(1)}%
              </td>
              <td className="px-4 py-3 text-right text-green-800">
                {currentCountry.metrics.elderlyPercentage.toFixed(1)}%
              </td>
              <td className="px-4 py-3 text-center">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full capitalize">
                  {currentCountry.metrics.pyramidType}
                </span>
              </td>
            </tr>

            {/* Neighbor Countries */}
            {neighborCountries.map((country) => (
              <tr key={country.slug} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link 
                    href={`/${country.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {country.name}
                  </Link>
                </td>
                {country.data && country.metrics ? (
                  <>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {country.data.totalPopulation.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {country.metrics.medianAge.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {country.metrics.youthPercentage.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {country.metrics.elderlyPercentage.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full capitalize">
                        {country.metrics.pyramidType}
                      </span>
                    </td>
                  </>
                ) : (
                  <>
                    {/* REVISION 2c: CAT C - Data not available merged cells */}
                    <td colSpan={5} className="px-4 py-3 text-center text-gray-400">
                      Data not available
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Regional Context */}
      <div className="mt-6 text-sm text-gray-600">
        <p>
          Explore more countries in this region by clicking on the country names above. 
          Demographic comparisons help understand regional development patterns and population trends.
        </p>
      </div>
    </div>
  );
}