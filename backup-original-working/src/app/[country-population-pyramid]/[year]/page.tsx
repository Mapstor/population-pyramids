import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadCountries, loadCountryData, getAvailableYears } from '@/lib/data-loader';
import { calculateMetrics } from '@/lib/calculations';
import { generateCountryMetadata } from '@/lib/seo-helpers';
import PopulationPyramid from '@/components/PopulationPyramid';
import StatsTable from '@/components/StatsTable';
import ShareButtons from '@/components/ShareButtons';

interface CountryYearPageProps {
  params: {
    'country-population-pyramid': string;
    year: string;
  };
}

export async function generateStaticParams() {
  const countries = await loadCountries();
  const params: { 'country-population-pyramid': string; year: string }[] = [];
  
  for (const country of countries) {
    try {
      const countryData = await loadCountryData(country.slug);
      const availableYears = getAvailableYears(countryData);
      
      availableYears.forEach(year => {
        params.push({
          'country-population-pyramid': `${country.slug}-population-pyramid`,
          year: year.toString()
        });
      });
    } catch (error) {
      console.error(`Failed to load data for ${country.slug}`);
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: CountryYearPageProps) {
  try {
    const countrySlug = params['country-population-pyramid'].replace('-population-pyramid', '');
    const countryData = await loadCountryData(countrySlug);
    const year = parseInt(params.year);
    const yearData = countryData.years[params.year];
    
    if (!yearData) {
      return { title: 'Year Not Found' };
    }
    
    return generateCountryMetadata(
      countryData.countryName,
      year,
      yearData.totalPopulation
    );
  } catch {
    return { title: 'Country Not Found' };
  }
}

export default async function CountryYearPage({ params }: CountryYearPageProps) {
  try {
    const countrySlug = params['country-population-pyramid'].replace('-population-pyramid', '');
    const countryData = await loadCountryData(countrySlug);
    const yearData = countryData.years[params.year];
    
    if (!yearData) {
      notFound();
    }
    
    const availableYears = getAvailableYears(countryData);
    const year = parseInt(params.year);
    const metrics = calculateMetrics(yearData);

    const prevYear = year > Math.min(...availableYears) ? year - 1 : null;
    const nextYear = year < Math.max(...availableYears) ? year + 1 : null;

    return (
      <div>
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${params['country-population-pyramid']}`} className="hover:text-blue-600">
            {countryData.countryName}
          </Link>
          <span className="mx-2">/</span>
          <span>{year}</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {countryData.countryName} Population Pyramid ({year})
          </h1>
          <p className="text-lg text-gray-600">
            Historical population data and demographic trends.
          </p>
        </div>

        {/* Year Navigation */}
        <div className="mb-8 flex gap-4">
          {prevYear && (
            <Link
              href={`/${params['country-population-pyramid']}/${prevYear}`}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              ← {prevYear}
            </Link>
          )}
          <Link
            href={`/${params['country-population-pyramid']}`}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Current ({Math.max(...availableYears)})
          </Link>
          {nextYear && (
            <Link
              href={`/${params['country-population-pyramid']}/${nextYear}`}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              {nextYear} →
            </Link>
          )}
        </div>

        {/* Main Chart */}
        <div className="mb-8">
          <PopulationPyramid
            data={yearData}
            countryName={countryData.countryName}
            year={year}
          />
        </div>

        {/* Stats Table */}
        <div className="mb-8">
          <StatsTable 
            data={yearData} 
            metrics={metrics} 
            countryName={countryData.countryName}
            year={year}
          />
        </div>

        {/* Share Buttons */}
        <div className="mb-8">
          <ShareButtons
            url={`https://populationpyramids.org/${params['country-population-pyramid']}/${year}`}
            title={`${countryData.countryName} Population Pyramid ${year}`}
          />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}