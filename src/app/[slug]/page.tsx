import { notFound } from 'next/navigation';
import { loadCountryData, getAvailableYears } from '@/lib/data-loader';

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface CountryPageProps {
  params: {
    slug: string;
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  try {
    const countrySlug = params.slug.endsWith('-population-pyramid') 
      ? params.slug.replace('-population-pyramid', '')
      : params.slug;
      
    const countryData = await loadCountryData(countrySlug);
    const availableYears = getAvailableYears(countryData);
    const latestYear = Math.max(...availableYears);
    const yearData = countryData.years[latestYear.toString()];

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {countryData.countryName} Population Pyramid ({latestYear})
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Slug: <code className="bg-gray-100 px-2 py-1 rounded">{params.slug}</code>
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {(yearData.totalPopulation / 1_000_000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Total Population</div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {latestYear}
            </div>
            <div className="text-sm text-gray-600">Latest Year</div>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {availableYears.length}
            </div>
            <div className="text-sm text-gray-600">Years Available</div>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {yearData.malePopulation + yearData.femalePopulation}
            </div>
            <div className="text-sm text-gray-600">Total Population (Exact)</div>
          </div>
        </div>
        
        <p className="text-gray-700">
          ✅ Data loading successful! Country data loaded correctly.
        </p>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Error Loading Data</h1>
        <p className="text-lg text-gray-600 mb-4">
          Slug: <code className="bg-gray-100 px-2 py-1 rounded">{params.slug}</code>
        </p>
        <p className="text-red-600">Error: {error?.toString()}</p>
      </div>
    );
  }
}