import Link from 'next/link';

export const metadata = {
  title: 'The Great Population Swap: India Just Surpassed China | Population Pyramids',
  description: 'For the first time in 300 years, India is now the world\'s most populous country. This historic reversal will reshape global economics, politics, and power.',
  keywords: 'India population, China population, most populous country, demographic shift, India vs China',
};

export default function ChinaIndiaSwapPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          The Great Population Swap: India Just Surpassed China
        </h1>
        <div className="flex items-center text-gray-600 text-sm space-x-4">
          <time dateTime="2024-11-09">November 9, 2024</time>
          <span>•</span>
          <span>12 min read</span>
          <span>•</span>
          <span className="text-purple-600 font-medium">Global Demographics</span>
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          In April 2023, a historic milestone passed almost silently: India overtook China as the world's most populous nation. For the first time since the 1700s, China isn't number one. This isn't just a statistical curiosity—it's a tectonic shift that will reshape global economics, geopolitics, and the future of humanity. The implications are staggering.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Historic Moment</h2>

        <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white p-6 rounded-lg mb-8">
          <h3 className="text-xl font-bold mb-4">The Crossing Point: April 2023</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-2">🇮🇳 India</h4>
              <ul className="space-y-1">
                <li>Population: 1.428 billion</li>
                <li>Daily growth: +47,000 people</li>
                <li>Median age: 28.2 years</li>
                <li>Fertility rate: 2.0 children</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">🇨🇳 China</h4>
              <ul className="space-y-1">
                <li>Population: 1.425 billion</li>
                <li>Daily decline: -2,000 people</li>
                <li>Median age: 39.0 years</li>
                <li>Fertility rate: 1.2 children</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">300 Years of Chinese Dominance Ends</h2>

        <p className="mb-4">China has been the world's most populous country since at least 1750, when:</p>
        
        <ul className="list-disc pl-6 space-y-2 mb-8">
          <li>The Qing Dynasty ruled a quarter of humanity</li>
          <li>India was fragmented into hundreds of kingdoms</li>
          <li>The United States didn't exist</li>
          <li>The Industrial Revolution hadn't begun</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Diverging Paths</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="font-bold mb-3 text-orange-900">🇮🇳 India's Trajectory</h3>
            <ul className="text-sm space-y-2">
              <li>• <strong>2024:</strong> 1.441 billion</li>
              <li>• <strong>2030:</strong> 1.503 billion</li>
              <li>• <strong>2050:</strong> 1.670 billion</li>
              <li>• <strong>2064:</strong> Peak at 1.701 billion</li>
              <li>• <strong>2100:</strong> 1.533 billion</li>
            </ul>
            <p className="mt-3 text-orange-800">Still growing for 40 more years</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="font-bold mb-3 text-red-900">🇨🇳 China's Trajectory</h3>
            <ul className="text-sm space-y-2">
              <li>• <strong>2024:</strong> 1.419 billion</li>
              <li>• <strong>2030:</strong> 1.377 billion</li>
              <li>• <strong>2050:</strong> 1.212 billion</li>
              <li>• <strong>2070:</strong> 1.002 billion</li>
              <li>• <strong>2100:</strong> 633 million</li>
            </ul>
            <p className="mt-3 text-red-800">Will lose 800 million people</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Why This Happened</h2>

        <div className="space-y-6 mb-8">
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-bold">China's One-Child Policy Legacy</h3>
            <p className="text-sm">35 years of limiting births (1980-2015) created a demographic time bomb. Even after lifting restrictions, Chinese couples now average just 1.2 children—cultural shift is permanent.</p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-bold">India's Demographic Momentum</h3>
            <p className="text-sm">With 650 million people under 25, India has massive reproductive potential. Even as fertility falls, sheer numbers of young adults means continued growth for decades.</p>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold">Economic Development Paradox</h3>
            <p className="text-sm">China's rapid development brought prosperity but crashed fertility. India's slower development maintained higher birth rates longer.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Tale of Two Giants</h2>

        <div className="bg-gray-100 p-6 rounded-lg mb-8">
          <h3 className="font-bold mb-4">Key Demographic Differences</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">India's Advantages</h4>
              <ul className="text-sm space-y-1">
                <li>✅ Younger population (28 vs 39 median age)</li>
                <li>✅ Growing workforce</li>
                <li>✅ Demographic dividend until 2055</li>
                <li>✅ English language advantage</li>
                <li>✅ Democratic institutions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-800 mb-2">China's Advantages</h4>
              <ul className="text-sm space-y-1">
                <li>✅ Higher GDP per capita ($12,970 vs $2,410)</li>
                <li>✅ Better infrastructure</li>
                <li>✅ 95% literacy vs 74%</li>
                <li>✅ Manufacturing dominance</li>
                <li>✅ Unified governance</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Economic Implications</h2>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h3 className="font-bold mb-3">The New Economic Equation</h3>
          <p className="mb-4">Population size alone doesn't determine economic power, but it shapes potential:</p>
          <ul className="space-y-2">
            <li>📈 <strong>India:</strong> Consumer market will exceed China's by 2030</li>
            <li>🏭 <strong>Manufacturing:</strong> India could become the new "factory of the world"</li>
            <li>💻 <strong>Tech:</strong> India already dominates global IT services</li>
            <li>🌾 <strong>Agriculture:</strong> Must feed 400 million more people than China</li>
            <li>⚡ <strong>Energy:</strong> India's demand will triple by 2050</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Geopolitical Earthquake</h2>

        <p className="mb-4">This population swap reshapes global power dynamics:</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-orange-100 p-4 rounded">
            <h4 className="font-bold mb-2">India Rising</h4>
            <ul className="text-sm space-y-1">
              <li>• Larger military recruitment pool</li>
              <li>• Growing diplomatic influence</li>
              <li>• Tech superpower status</li>
              <li>• Space program acceleration</li>
            </ul>
          </div>
          <div className="bg-red-100 p-4 rounded">
            <h4 className="font-bold mb-2">China Adapting</h4>
            <ul className="text-sm space-y-1">
              <li>• Automation to offset labor decline</li>
              <li>• Focus on high-value industries</li>
              <li>• Belt and Road influence</li>
              <li>• Military modernization</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Challenges Ahead</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border border-orange-300 p-6 rounded-lg">
            <h3 className="font-bold mb-3 text-orange-900">India's Hurdles</h3>
            <ul className="text-sm space-y-2">
              <li>🏫 Education: 250 million still illiterate</li>
              <li>💧 Water: Severe scarcity for 600 million</li>
              <li>🏙️ Infrastructure: $4.5 trillion needed</li>
              <li>💼 Jobs: Must create 12 million annually</li>
              <li>🌆 Urbanization: Cities overwhelmed</li>
            </ul>
          </div>
          <div className="border border-red-300 p-6 rounded-lg">
            <h3 className="font-bold mb-3 text-red-900">China's Crises</h3>
            <ul className="text-sm space-y-2">
              <li>👵 Aging: 400 million over 60 by 2040</li>
              <li>💸 Pensions: System near collapse</li>
              <li>🏠 Property: Bubble deflating</li>
              <li>👶 Fertility: Record low births</li>
              <li>💼 Labor: Workforce shrinking fast</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Regional Variations</h2>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="font-bold mb-3">India's Demographic Diversity</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-semibold">High Growth States</h4>
              <ul className="text-xs space-y-1">
                <li>• Bihar: 3.4 children per woman</li>
                <li>• Uttar Pradesh: 2.9 children</li>
                <li>• Madhya Pradesh: 2.8 children</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Low Growth States</h4>
              <ul className="text-xs space-y-1">
                <li>• Kerala: 1.6 children per woman</li>
                <li>• Tamil Nadu: 1.7 children</li>
                <li>• Punjab: 1.8 children</li>
              </ul>
            </div>
          </div>
          
          <h3 className="font-bold mb-3 mt-4">China's Regional Crisis</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold">Shrinking Fastest</h4>
              <ul className="text-xs space-y-1">
                <li>• Northeast: -20% by 2050</li>
                <li>• Shanghai: 0.7 fertility rate</li>
                <li>• Beijing: 0.8 fertility rate</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Relative Stability</h4>
              <ul className="text-xs space-y-1">
                <li>• Xinjiang: Higher minority fertility</li>
                <li>• Tibet: Traditional families</li>
                <li>• Guangxi: Rural population</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Gender Imbalance Factor</h2>

        <div className="bg-purple-50 p-6 rounded-lg mb-8">
          <p className="mb-4">Both giants face severe gender imbalances:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">India: 108 men per 100 women</h4>
              <p className="text-sm">70 million "excess" men by 2030</p>
            </div>
            <div>
              <h4 className="font-semibold">China: 105 men per 100 women</h4>
              <p className="text-sm">30 million men won't find wives</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">What This Means for the World</h2>

        <div className="space-y-4 mb-8">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-bold">Global Labor Markets</h4>
            <p className="text-sm">India will supply the world's workers while China faces labor shortages</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="font-bold">Climate Impact</h4>
            <p className="text-sm">India's growth means 400 million more middle-class consumers—massive carbon implications</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h4 className="font-bold">Innovation Centers</h4>
            <p className="text-sm">Tech innovation shifting from aging China to youthful India</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h4 className="font-bold">Supply Chains</h4>
            <p className="text-sm">Manufacturing gradually moving from China to India and Southeast Asia</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">The 2100 Projection</h2>

        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 rounded-lg mb-8">
          <h3 className="font-bold mb-4">The Long View</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-2">India in 2100</h4>
              <ul className="text-sm space-y-1">
                <li>• Population: 1.53 billion</li>
                <li>• Still world's largest</li>
                <li>• Median age: 47</li>
                <li>• Facing own aging crisis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">China in 2100</h4>
              <ul className="text-sm space-y-1">
                <li>• Population: 633 million</li>
                <li>• Smaller than Indonesia</li>
                <li>• Median age: 57</li>
                <li>• Most aged large nation</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-center text-gray-300">China will lose more people than the entire population of the United States and Europe combined</p>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Investment and Business Impact</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-bold mb-3">Bet on India</h3>
            <ul className="text-sm space-y-2">
              <li>📈 Consumer goods boom</li>
              <li>🏢 Real estate growth</li>
              <li>📱 Digital services explosion</li>
              <li>🏫 Education sector expansion</li>
              <li>🚗 Auto market surge</li>
            </ul>
          </div>
          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="font-bold mb-3">China Pivots</h3>
            <ul className="text-sm space-y-2">
              <li>🤖 Automation/robotics</li>
              <li>📊 High-tech manufacturing</li>
              <li>👴 Elder care industry</li>
              <li>📊 Productivity tech</li>
              <li>🌍 Overseas markets</li>
            </ul>
          </div>
        </div>

        <div className="bg-black text-white p-6 rounded-lg mt-8">
          <h3 className="font-bold mb-3">The Historic Significance</h3>
          <p>We are witnessing the greatest demographic power shift in modern history. India's ascent and China's descent will define the 21st century. This isn't just about numbers—it's about the future of global economics, innovation, military power, and human civilization itself. The country that harnesses its demographic destiny will shape the next century. The one that fails faces decline. The race is on.</p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Data sources: UN World Population Prospects 2024, World Bank, IMF, national census data.
            Projections assume current fertility and mortality trends continue.
          </p>
        </div>
      </div>
    </article>
  );
}