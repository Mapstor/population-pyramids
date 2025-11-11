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
    slug: '15-fastest-growing-states-2024',
    title: '15 Fastest Growing States in America (2024)',
    excerpt: 'Texas adds 1,600 people daily. Florida gains a Miami every year. Idaho grows 5x the national average. Discover the states experiencing explosive population growth.',
    date: '2024-11-11',
    readTime: '12 min read',
    category: 'US States',
    featured: true,
    tags: ['us-states', 'growth', 'migration', 'demographics']
  },
  {
    slug: '10-states-people-fleeing-2024',
    title: '10 States People Are Fleeing in 2024',
    excerpt: 'New York loses 500 people daily. California sees historic exodus. Illinois empties entire towns. Discover which states Americans are abandoning and why.',
    date: '2024-11-11',
    readTime: '10 min read',
    category: 'US States',
    featured: false,
    tags: ['us-states', 'migration', 'population-decline']
  },
  {
    slug: 'worlds-aging-crisis-9-countries-seniors',
    title: 'The World\'s Aging Crisis: 9 Countries Where Half the Population Will Soon Be Seniors',
    excerpt: 'Japan\'s median age has risen 7.5 years since 2000. South Korea ages faster than any nation in history. Italy faces a future where diapers for adults outsell baby diapers 3-to-1. Welcome to the aging revolution.',
    date: '2024-11-05',
    readTime: '8 min read',
    category: 'Aging Societies',
    image: '/blog/aging-crisis.jpg',
    featured: false,
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

        {/* All Articles */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map(post => (
              <div key={post.slug} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-4">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Read Article →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}