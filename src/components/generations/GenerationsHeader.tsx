import Link from 'next/link';

interface GenerationsHeaderProps {
  countryName: string;
  isWorld: boolean;
  countrySlug?: string;
}

export function GenerationsHeader({ countryName, isWorld, countrySlug }: GenerationsHeaderProps) {
  return (
    <div className="mb-8">
      {/* Breadcrumb navigation */}
      <nav className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        <span className="text-gray-600 mx-2">→</span>
        {isWorld ? (
          <span className="text-gray-900 font-medium">Generation Calculator</span>
        ) : (
          <>
            <Link href="/generations" className="text-blue-600 hover:underline">
              Generation Calculator
            </Link>
            <span className="text-gray-600 mx-2">→</span>
            <span className="text-gray-900 font-medium">{countryName}</span>
          </>
        )}
      </nav>

      {/* Main heading */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {isWorld 
          ? 'Generation Age Ranges 2026: Gen Z, Millennial, Gen X, Boomer Calculator'
          : `${countryName} Generation Breakdown 2026: How Many Millennials, Gen Z, and Boomers?`}
      </h1>

      {/* Description */}
      <p className="text-lg text-gray-600">
        {isWorld 
          ? 'What generation am I? Enter your birth year to find out. See 2026 age ranges and real population data for Gen Z, Millennials, Gen X, Baby Boomers, Gen Alpha.'
          : `Generation population distribution in ${countryName}. See how many Millennials, Gen Z, Boomers, and other generations live in ${countryName} with current UN data.`}
      </p>

      {/* Link to main country page if on country-specific generation page */}
      {!isWorld && countrySlug && (
        <p className="mt-2 text-sm text-gray-500">
          See also: <Link href={`/${countrySlug}`} className="text-blue-600 hover:underline">
            {countryName} complete population pyramid and demographics
          </Link>
        </p>
      )}
    </div>
  );
}