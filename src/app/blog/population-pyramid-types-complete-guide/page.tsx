import Link from 'next/link';

export const metadata = {
  title: '3 Types of Population Pyramids: Complete Guide to Expansive, Constrictive & Stationary | Population Pyramids',
  description: 'Learn the 3 main population pyramid types: expansive (growing populations), constrictive (declining populations), and stationary (stable populations). Complete guide with examples.',
  keywords: 'population pyramid types, expansive population pyramid, constrictive population pyramid, stationary population pyramid, demographic transition model, population structure',
};

export default function PopulationPyramidTypesPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          3 Types of Population Pyramids: Complete Guide to Understanding Population Structure
        </h1>
        <div className="flex items-center text-gray-600 text-sm space-x-4">
          <time dateTime="2024-11-12">November 12, 2024</time>
          <span>•</span>
          <span>8 min read</span>
          <span>•</span>
          <span className="text-purple-600 font-medium">Demographics Guide</span>
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          Population pyramids reveal the hidden story of nations. There are exactly 3 types of population pyramids, each telling a dramatically different tale about a country's future. Whether a nation is about to boom, bust, or stay stable—it's all written in the shape of its population pyramid.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">The 3 Population Pyramid Types at a Glance</h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-blue-900">Quick Reference Guide</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-100 p-4 rounded">
              <h4 className="font-bold text-green-800">1. Expansive (Growing)</h4>
              <p className="text-sm text-green-700">Wide base, narrow top</p>
              <p className="text-xs">High birth rates, young population</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded">
              <h4 className="font-bold text-yellow-800">2. Stationary (Stable)</h4>
              <p className="text-sm text-yellow-700">Rectangular shape</p>
              <p className="text-xs">Balanced birth/death rates</p>
            </div>
            <div className="bg-red-100 p-4 rounded">
              <h4 className="font-bold text-red-800">3. Constrictive (Declining)</h4>
              <p className="text-sm text-red-700">Narrow base, wide top</p>
              <p className="text-xs">Low birth rates, aging population</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Type 1: Expansive Population Pyramids (Growing Populations)</h2>

        <p>
          Expansive population pyramids look exactly like their name suggests—they're wide at the bottom and narrow at the top, resembling a traditional pyramid or triangle. This shape indicates a country with <strong>high birth rates and a young population</strong>.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Key Characteristics of Expansive Pyramids:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Wide base:</strong> Large numbers of children and teenagers (0-14 years)</li>
          <li><strong>Narrow top:</strong> Relatively few elderly people (65+ years)</li>
          <li><strong>High birth rates:</strong> Usually above 2.5 children per woman</li>
          <li><strong>Young median age:</strong> Typically under 25 years</li>
          <li><strong>Rapid population growth:</strong> Often 2-4% annually</li>
        </ul>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 my-6">
          <h4 className="font-bold text-green-800 mb-2">Real-World Examples:</h4>
          <ul className="text-green-700 space-y-1">
            <li>• <strong>Nigeria:</strong> 47% of population under 15, growing 2.6% annually</li>
            <li>• <strong>Uganda:</strong> 48% under 15, median age just 16.7 years</li>
            <li>• <strong>Niger:</strong> 50% under 15, world's highest birth rate</li>
            <li>• <strong>Democratic Republic of Congo:</strong> 46% under 15</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Why Expansive Pyramids Form:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Cultural factors:</strong> Societies that value large families</li>
          <li><strong>Economic needs:</strong> Children as economic assets in agricultural societies</li>
          <li><strong>Limited family planning:</strong> Lack of access to contraception or education</li>
          <li><strong>High infant mortality:</strong> Parents have more children to ensure some survive</li>
          <li><strong>Religious influences:</strong> Beliefs encouraging large families</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Type 2: Stationary Population Pyramids (Stable Populations)</h2>

        <p>
          Stationary population pyramids have a more rectangular or barrel-like shape. The number of people in each age group remains relatively similar from bottom to top, indicating <strong>balanced birth and death rates</strong>.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Key Characteristics of Stationary Pyramids:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Rectangular shape:</strong> Similar numbers across most age groups</li>
          <li><strong>Replacement-level fertility:</strong> Around 2.1 children per woman</li>
          <li><strong>Balanced age distribution:</strong> Roughly equal youth and elderly populations</li>
          <li><strong>Slow or zero growth:</strong> Population growth near 0-0.5% annually</li>
          <li><strong>Stable median age:</strong> Usually 35-40 years</li>
        </ul>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
          <h4 className="font-bold text-blue-800 mb-2">Real-World Examples:</h4>
          <ul className="text-blue-700 space-y-1">
            <li>• <strong>United States:</strong> 1.7 fertility rate, gradual aging transition</li>
            <li>• <strong>France:</strong> 1.8 fertility rate, balanced immigration</li>
            <li>• <strong>United Kingdom:</strong> 1.6 fertility rate, stable population</li>
            <li>• <strong>Canada:</strong> 1.5 fertility rate, immigration maintains growth</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">The Transition Phase:</h3>
        <p>
          Most stationary pyramids are actually countries transitioning between expansive and constrictive shapes. They represent the "middle phase" of demographic transition as societies modernize and birth rates decline while life expectancy increases.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Type 3: Constrictive Population Pyramids (Declining Populations)</h2>

        <p>
          Constrictive population pyramids are inverted—narrow at the bottom and wider at the top. This ominous shape indicates <strong>below-replacement birth rates and an aging population</strong>. These countries face serious demographic challenges.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Key Characteristics of Constrictive Pyramids:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Narrow base:</strong> Few children and young people</li>
          <li><strong>Bulging middle/top:</strong> Large elderly population</li>
          <li><strong>Below-replacement fertility:</strong> Under 2.1 children per woman</li>
          <li><strong>High median age:</strong> Often 40+ years</li>
          <li><strong>Population decline:</strong> Natural decrease without immigration</li>
        </ul>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
          <h4 className="font-bold text-red-800 mb-2">Real-World Examples:</h4>
          <ul className="text-red-700 space-y-1">
            <li>• <strong>Japan:</strong> 1.3 fertility rate, 29% over 65, declining since 2010</li>
            <li>• <strong>South Korea:</strong> 0.8 fertility rate, world's lowest</li>
            <li>• <strong>Italy:</strong> 1.2 fertility rate, 23% over 65</li>
            <li>• <strong>Germany:</strong> 1.5 fertility rate, aging rapidly</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">The Demographic Death Spiral:</h3>
        <p>
          Constrictive pyramids create a self-reinforcing cycle: fewer children mean fewer future parents, leading to even fewer children. Countries with constrictive pyramids face:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Shrinking workforce</li>
          <li>Overwhelming pension and healthcare costs</li>
          <li>Economic stagnation</li>
          <li>Social isolation and declining communities</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">How to Read Population Pyramid Types</h2>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
          <h3 className="text-xl font-bold mb-4">Visual Guide to Identification</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-green-400" style={{clipPath: 'polygon(0 100%, 50% 0, 100% 100%)'}}></div>
              <span><strong>Triangle:</strong> Expansive (Growing)</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-blue-400"></div>
              <span><strong>Rectangle:</strong> Stationary (Stable)</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-red-400" style={{clipPath: 'polygon(0 0, 50% 100%, 100% 0)'}}></div>
              <span><strong>Inverted Triangle:</strong> Constrictive (Declining)</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Quick Analysis Checklist:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Base width:</strong> How many 0-14 year olds?</li>
          <li><strong>Top width:</strong> How many 65+ year olds?</li>
          <li><strong>Middle bulge:</strong> Where is the largest population concentration?</li>
          <li><strong>Overall shape:</strong> Triangle, rectangle, or inverted triangle?</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Factors That Determine Pyramid Type</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">Birth Rates (Most Important Factor):</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>High (3+ children):</strong> Creates expansive pyramids</li>
          <li><strong>Replacement (2.1 children):</strong> Creates stationary pyramids</li>
          <li><strong>Low (&lt;2 children):</strong> Creates constrictive pyramids</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Death Rates and Life Expectancy:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>High life expectancy narrows the top of the pyramid</li>
          <li>Improved healthcare affects all age groups</li>
          <li>War, disease, or disaster can create unusual bulges or gaps</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Migration Patterns:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Immigration:</strong> Can make pyramids more expansive</li>
          <li><strong>Emigration:</strong> Can narrow working-age groups</li>
          <li><strong>Internal migration:</strong> Urban vs. rural differences</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Economic and Social Implications by Type</h2>

        <div className="grid md:grid-cols-3 gap-6 my-8">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-green-800 mb-3">Expansive Implications</h3>
            <p className="text-sm text-green-700 mb-2"><strong>Opportunities:</strong></p>
            <ul className="text-xs text-green-600 space-y-1 mb-3">
              <li>• Large future workforce</li>
              <li>• Economic growth potential</li>
              <li>• Innovation and dynamism</li>
            </ul>
            <p className="text-sm text-green-700 mb-2"><strong>Challenges:</strong></p>
            <ul className="text-xs text-green-600 space-y-1">
              <li>• Job creation pressure</li>
              <li>• Education/healthcare strain</li>
              <li>• Resource scarcity</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-3">Stationary Implications</h3>
            <p className="text-sm text-blue-700 mb-2"><strong>Opportunities:</strong></p>
            <ul className="text-xs text-blue-600 space-y-1 mb-3">
              <li>• Stable planning environment</li>
              <li>• Balanced dependency ratios</li>
              <li>• Sustainable resource use</li>
            </ul>
            <p className="text-sm text-blue-700 mb-2"><strong>Challenges:</strong></p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Slower economic growth</li>
              <li>• Innovation concerns</li>
              <li>• Transition management</li>
            </ul>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-bold text-red-800 mb-3">Constrictive Implications</h3>
            <p className="text-sm text-red-700 mb-2"><strong>Opportunities:</strong></p>
            <ul className="text-xs text-red-600 space-y-1 mb-3">
              <li>• Higher per-capita income</li>
              <li>• Less environmental pressure</li>
              <li>• Quality over quantity</li>
            </ul>
            <p className="text-sm text-red-700 mb-2"><strong>Challenges:</strong></p>
            <ul className="text-xs text-red-600 space-y-1">
              <li>• Workforce shortage</li>
              <li>• Pension crisis</li>
              <li>• Economic decline</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Population Pyramid Types in Different Regions</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">Africa: Predominantly Expansive</h3>
        <p>
          Sub-Saharan Africa has the most expansive population pyramids globally. Countries like Niger, Chad, and Mali have fertility rates above 5 children per woman, creating classic triangular shapes that predict massive population growth.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Europe: Moving Toward Constrictive</h3>
        <p>
          Most European countries have transitioned from stationary to constrictive pyramids. Eastern Europe shows the most dramatic declines, while Western Europe maintains slight growth through immigration.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Asia: Mixed Patterns</h3>
        <p>
          Asia shows all three types: South Asia remains largely expansive, East Asia is becoming constrictive, and Southeast Asia is transitioning to stationary patterns.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Future Trends and Transformations</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">The Global Transformation:</h3>
        <p>
          We're witnessing a historic shift. By 2100, demographers predict:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>More constrictive pyramids:</strong> As development spreads globally</li>
          <li><strong>Fewer expansive pyramids:</strong> Limited to the least developed countries</li>
          <li><strong>Migration becomes crucial:</strong> To balance population pyramids</li>
          <li><strong>Policy interventions:</strong> Countries actively trying to change their pyramid shape</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Countries Actively Changing Their Pyramid Type:</h3>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
          <h4 className="font-bold text-yellow-800 mb-3">Policy Interventions by Pyramid Type</h4>
          <div className="space-y-3">
            <div>
              <p><strong>Trying to become less expansive:</strong> China's former one-child policy, India's family planning campaigns</p>
            </div>
            <div>
              <p><strong>Trying to become less constrictive:</strong> Poland, Hungary offering baby bonuses; Singapore's marriage incentives</p>
            </div>
            <div>
              <p><strong>Using immigration to stay stationary:</strong> Canada, Australia's points-based immigration systems</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">How to Use This Knowledge</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">For Students and Researchers:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Always identify the pyramid type before analyzing demographics</li>
          <li>Look for transitions between types over time</li>
          <li>Consider external factors that might create unusual shapes</li>
          <li>Compare similar countries with different pyramid types</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">For Policy Makers:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Plan infrastructure based on predicted age distributions</li>
          <li>Adjust immigration policies to balance pyramid shapes</li>
          <li>Design social programs for your pyramid type</li>
          <li>Prepare for transitions between pyramid types</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">For Business and Investment:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Expansive markets:</strong> Focus on education, children's products, basic needs</li>
          <li><strong>Stationary markets:</strong> Diverse opportunities across age groups</li>
          <li><strong>Constrictive markets:</strong> Healthcare, luxury goods, senior services</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4 text-blue-900">Key Takeaways: The 3 Population Pyramid Types</h3>
          <div className="space-y-3">
            <div>
              <strong>Expansive (Growing):</strong> Wide base, high birth rates, young populations. Found in developing countries, especially sub-Saharan Africa.
            </div>
            <div>
              <strong>Stationary (Stable):</strong> Rectangular shape, replacement-level fertility, balanced age groups. Common in developed countries with immigration.
            </div>
            <div>
              <strong>Constrictive (Declining):</strong> Narrow base, low birth rates, aging populations. Increasingly common in developed countries without immigration.
            </div>
          </div>
        </div>

        <p className="text-lg text-gray-700 mt-8">
          Understanding these three population pyramid types is essential for grasping how societies evolve. Each type tells a story of where a country has been, where it's going, and what challenges and opportunities lie ahead. As global demographics continue shifting, the ability to read and interpret these patterns becomes increasingly valuable for anyone seeking to understand our world's future.
        </p>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-bold mb-3">Explore More Population Data</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/countries" className="text-blue-600 hover:text-blue-800 underline">
              View country population pyramids →
            </Link>
            <Link href="/states" className="text-blue-600 hover:text-blue-800 underline">
              Explore US state demographics →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}