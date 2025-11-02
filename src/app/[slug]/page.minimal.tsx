import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadCountryData, getAvailableYears } from '@/lib/data-loader';
import { calculateMetrics } from '@/lib/calculations';
import PopulationPyramid from '@/components/PopulationPyramid';

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
    const metrics = calculateMetrics(yearData);

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <span>{countryData.countryName}</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {countryData.countryName} Population Pyramid ({latestYear})
          </h1>
          <p className="text-lg text-gray-600">
            Interactive demographic visualization and analysis
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {(yearData.totalPopulation / 1_000_000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Total Population</div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {metrics.medianAge.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Median Age</div>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {(metrics.growthRate * 100).toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600">Growth Rate</div>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {metrics.dependencyRatio.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Dependency Ratio</div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="mb-8">
          <PopulationPyramid
            data={yearData}
            countryName={countryData.countryName}
            year={latestYear}
          />
        </div>

        {/* Year Navigation */}
        <div className="mb-8 bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Explore Other Years</h2>
          <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 gap-2">
            {availableYears.slice(-10).map(year => (
              <Link
                key={year}
                href={`/${params.slug}/${year}`}
                className={`p-2 text-center rounded transition ${
                  year === latestYear
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {year}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Country page error:', error);
    notFound();
  }
}