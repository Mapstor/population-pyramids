import Link from 'next/link';

export const metadata = {
  title: 'US States Demographics - Population Trends & Analysis | Population Pyramids',
  description: 'Explore demographic trends and population data for all 50 US states. Discover which states are growing, shrinking, and transforming.',
  keywords: 'US states demographics, state population, population growth, migration patterns, US census data',
};

const stateArticles = [
  {
    slug: '15-fastest-growing-states-2024',
    title: '15 Fastest Growing States in America (2024)',
    excerpt: 'Texas adds 1,600 people daily. Florida gains a Miami every year. Idaho grows 5x the national average.',
    readTime: '12 min read',
    type: 'growth'
  },
  {
    slug: '10-states-people-fleeing-2024',
    title: '10 States People Are Fleeing in 2024',
    excerpt: 'New York loses 500 people daily. California sees historic exodus. Illinois empties entire towns.',
    readTime: '10 min read',
    type: 'decline'
  }
];

export default function USStatesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            US States Demographics
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore population trends, migration patterns, and demographic shifts across all 50 US states. 
            Discover which states are booming and which are facing population challenges.
          </p>
        </div>

        {/* Featured Articles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured State Analysis</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {stateArticles.map(article => (
              <Link 
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group"
              >
                <div className={`h-4 ${article.type === 'growth' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                    <span className="text-blue-600 font-medium text-sm group-hover:underline">
                      Read Analysis →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">US Population Quick Facts</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">345.4M</div>
              <div className="text-sm text-gray-600 mt-1">Total US Population</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">+0.5%</div>
              <div className="text-sm text-gray-600 mt-1">Annual Growth Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">39.3</div>
              <div className="text-sm text-gray-600 mt-1">Median Age</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">50</div>
              <div className="text-sm text-gray-600 mt-1">States Analyzed</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">More State Analysis Coming Soon</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            We're constantly analyzing demographic trends across US states. 
            Check back regularly for new insights on migration patterns, age distributions, and population projections.
          </p>
          <Link 
            href="/blog"
            className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}