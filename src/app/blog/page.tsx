import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Demographics Blog - Population Insights & Analysis | Population Pyramids',
  description: 'Discover fascinating demographic trends, population insights, and data-driven stories from around the world. Explore aging societies, youth booms, and population shifts.',
  keywords: 'demographics blog, population trends, aging crisis, youth boom, demographic analysis, population insights',
  openGraph: {
    title: 'Demographics Blog - Population Insights & Analysis',
    description: 'Discover fascinating demographic trends and data-driven stories from around the world.',
    type: 'website',
    url: 'https://populationpyramids.org/blog',
  },
};

const blogPosts = [
  {
    slug: 'worlds-aging-crisis-9-countries-seniors',
    title: 'The World\'s Aging Crisis: 9 Countries Where Half the Population Will Soon Be Seniors',
    excerpt: 'Japan\'s median age has risen 7.5 years since 2000. South Korea ages faster than any nation in history. Italy faces a future where diapers for adults outsell baby diapers 3-to-1. Welcome to the aging revolution.',
    date: '2024-11-05',
    readTime: '8 min read',
    category: 'Aging Societies',
    image: '/blog/aging-crisis.jpg',
    featured: true,
    tags: ['aging', 'demographics', 'japan', 'europe', 'crisis']
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Demographics Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the fascinating stories hidden in population data. From aging societies to youth booms, 
            explore how demographics shape our world.
          </p>
        </div>

        {/* Featured Article */}
        {blogPosts.filter(post => post.featured).map(post => (
          <div key={post.slug} className="mb-16">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64 sm:h-80 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                      Featured
                    </span>
                    <span className="px-3 py-1 bg-black bg-opacity-50 text-white text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-blue-100 mb-4 text-lg leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-blue-100">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
                    >
                      Read Article
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Coming Soon Articles */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Coming Soon</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Youth Explosion: 8 Countries Where 45% Are Under 15',
                category: 'Youth Demographics',
                color: 'from-green-500 to-emerald-600'
              },
              {
                title: 'The Great Population Swap: China vs India',
                category: 'Global Trends',
                color: 'from-purple-500 to-indigo-600'
              },
              {
                title: 'Demographic Time Bombs: Countries Losing People',
                category: 'Population Decline',
                color: 'from-red-500 to-pink-600'
              },
              {
                title: 'The Baby Boom Echo: How 1990s Events Shape Today',
                category: 'Historical Impact',
                color: 'from-orange-500 to-yellow-600'
              }
            ].map((article, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className={`h-32 bg-gradient-to-r ${article.color} relative`}>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs font-semibold rounded">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-xs">Coming Soon</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore by Category</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Aging Societies', count: 1, icon: '👴', color: 'blue' },
              { name: 'Youth Demographics', count: 0, icon: '👶', color: 'green' },
              { name: 'Global Trends', count: 0, icon: '🌍', color: 'purple' },
              { name: 'Historical Impact', count: 0, icon: '📚', color: 'orange' }
            ].map((category, index) => (
              <div key={index} className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">
                  {category.count} {category.count === 1 ? 'article' : 'articles'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated on Demographic Trends</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get notified when we publish new insights about global population trends, 
            demographic shifts, and data-driven stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900"
            />
            <button className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}