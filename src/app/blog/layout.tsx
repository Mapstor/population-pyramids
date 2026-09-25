import Link from 'next/link';

/**
 * Layout wraps every /blog/* route: the index plus all article pages.
 * Appends a "Browse Population Rankings" cross-link section after each
 * page's content so every article surfaces internal links to the
 * ranking pages without per-article edits.
 */
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Browse the World Demographic Rankings
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              See the full distribution across all 195 UN-member countries — the data behind every story.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <Link
                href="/most-populated-countries"
                className="block bg-blue-50 rounded p-3 hover:bg-blue-100 transition border border-blue-100"
              >
                <div className="font-bold text-blue-900">Most populated countries</div>
                <div className="text-blue-700 text-xs mt-0.5">All 195 ranked · interactive world map</div>
              </Link>
              <Link
                href="/largest-countries"
                className="block bg-emerald-50 rounded p-3 hover:bg-emerald-100 transition border border-emerald-100"
              >
                <div className="font-bold text-emerald-900">Largest by area</div>
                <div className="text-emerald-700 text-xs mt-0.5">Russia, Canada, US — full ranking</div>
              </Link>
              <Link
                href="/smallest-countries"
                className="block bg-amber-50 rounded p-3 hover:bg-amber-100 transition border border-amber-100"
              >
                <div className="font-bold text-amber-900">Smallest countries</div>
                <div className="text-amber-700 text-xs mt-0.5">Vatican, Monaco, Nauru — with region zoom</div>
              </Link>
              <Link
                href="/life-expectancy-by-country"
                className="block bg-green-50 rounded p-3 hover:bg-green-100 transition border border-green-100"
              >
                <div className="font-bold text-green-900">Life expectancy ranking</div>
                <div className="text-green-700 text-xs mt-0.5">Monaco 87 yrs → Nigeria 54 yrs</div>
              </Link>
              <Link
                href="/median-age-by-country"
                className="block bg-purple-50 rounded p-3 hover:bg-purple-100 transition border border-purple-100"
              >
                <div className="font-bold text-purple-900">Median age ranking</div>
                <div className="text-purple-700 text-xs mt-0.5">Oldest to youngest populations</div>
              </Link>
              <Link
                href="/countries"
                className="block bg-gray-50 rounded p-3 hover:bg-gray-100 transition border border-gray-200"
              >
                <div className="font-bold text-gray-900">All 195 countries</div>
                <div className="text-gray-700 text-xs mt-0.5">Browse the full demographic library</div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
