'use client';

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Link from 'next/link';

// Import country data
import germanyData from '@/data/population/germany.json';
import australiaData from '@/data/population/australia.json';
import canadaData from '@/data/population/canada.json';
import unitedKingdomData from '@/data/population/united-kingdom.json';

// Import comparison countries
import nigerData from '@/data/population/niger.json';
import kenyaData from '@/data/population/kenya.json';
import brazilData from '@/data/population/brazil.json';
import japanData from '@/data/population/japan.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Stage4DemographicTransition = () => {
  // Prepare data for Stage 4 countries
  const germany2024Data = germanyData.years['2024'];
  const australia2024Data = australiaData.years['2024'];
  const canada2024Data = canadaData.years['2024'];
  const uk2024Data = unitedKingdomData.years['2024'];

  // Prepare comparison data
  const niger2024Data = nigerData.years['2024'];
  const kenya2024Data = kenyaData.years['2024'];
  const brazil2024Data = brazilData.years['2024'];
  const japan2024Data = japanData.years['2024'];


  const createPyramidData = (countryData: any, title: string, color: string) => ({
    labels: countryData.ageGroups.map((ag: any) => ag.ageRange).reverse(),
    datasets: [
      {
        label: `${title} - Male`,
        data: countryData.ageGroups.map((ag: any) => -ag.male).reverse(),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      },
      {
        label: `${title} - Female`,
        data: countryData.ageGroups.map((ag: any) => ag.female).reverse(),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      },
    ],
  });

  const pyramidOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Population by Age and Gender (thousands)',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return Math.abs(value).toLocaleString();
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    tooltips: {
      callbacks: {
        label: function(context: any) {
          return `${context.dataset.label}: ${Math.abs(context.raw).toLocaleString()}`;
        },
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Stage 4 Demographic Transition: Low Stationary Phase
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Understanding population stability through population pyramids of Germany, Australia, Canada, and United Kingdom
          </p>
          <div className="text-sm text-gray-500">
            Published: November 13, 2025 | 
            <Link href="/blog/population-pyramid-stages-demographic-transition" className="text-blue-600 hover:underline ml-1">
              5-Stage Demographic Transition Overview
            </Link> | 
            <Link href="/blog/4-vs-5-stages-demographic-transition-model" className="text-blue-600 hover:underline ml-1">
              4 vs 5 Stage Models
            </Link>
          </div>
        </header>

        <div className="prose max-w-none">
          <h2>What is Stage 4 Demographic Transition?</h2>
          
          <p>
            Stage 4 of demographic transition, known as the Low Stationary phase, represents population stability 
            in developed nations. During this stage, <strong>both birth rates and death rates are low and approximately 
            equal, resulting in zero or minimal population growth</strong>. The population structure typically shows 
            a rectangular or columnar shape, indicating balanced age distribution with slight population aging.
          </p>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 my-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Stage 4 Key Characteristics:</h3>
            <ul className="text-green-700">
              <li><strong>Low birth rates</strong> (8-15 per 1,000) - at or near replacement level</li>
              <li><strong>Low death rates</strong> (8-12 per 1,000) - advanced healthcare systems</li>
              <li><strong>Zero population growth</strong> (0-0.5% annually)</li>
              <li><strong>Rectangular population structure</strong> - balanced age distribution</li>
              <li><strong>High life expectancy</strong> (75-85 years)</li>
              <li><strong>Established aging population</strong> - but manageable dependency ratios</li>
            </ul>
          </div>

          <h2>Stage 4 Countries: Population Pyramid Examples</h2>
          
          <p>
            Let's examine four countries representing classic Stage 4 demographic transition, each showing 
            the characteristic stable population structure of developed nations:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Germany (Stage 4)</h3>
              <div style={{ height: '400px' }}>
                <Bar 
                  data={createPyramidData(germany2024Data, 'Germany', 'rgba(40, 167, 69, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Population:</strong> 84 million</p>
                <p><strong>Birth Rate:</strong> 9.4 per 1,000</p>
                <p><strong>Death Rate:</strong> 12.0 per 1,000</p>
                <p><strong>Growth Rate:</strong> -0.1% annually</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Australia (Stage 4)</h3>
              <div style={{ height: '400px' }}>
                <Bar 
                  data={createPyramidData(australia2024Data, 'Australia', 'rgba(40, 167, 69, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Population:</strong> 26 million</p>
                <p><strong>Birth Rate:</strong> 12.3 per 1,000</p>
                <p><strong>Death Rate:</strong> 6.8 per 1,000</p>
                <p><strong>Growth Rate:</strong> 1.0% annually (immigration)</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Canada (Stage 4)</h3>
              <div style={{ height: '400px' }}>
                <Bar 
                  data={createPyramidData(canada2024Data, 'Canada', 'rgba(40, 167, 69, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Population:</strong> 39 million</p>
                <p><strong>Birth Rate:</strong> 10.2 per 1,000</p>
                <p><strong>Death Rate:</strong> 8.1 per 1,000</p>
                <p><strong>Growth Rate:</strong> 0.9% annually (immigration)</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">United Kingdom (Stage 4)</h3>
              <div style={{ height: '400px' }}>
                <Bar 
                  data={createPyramidData(uk2024Data, 'United Kingdom', 'rgba(40, 167, 69, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Population:</strong> 68 million</p>
                <p><strong>Birth Rate:</strong> 11.4 per 1,000</p>
                <p><strong>Death Rate:</strong> 9.0 per 1,000</p>
                <p><strong>Growth Rate:</strong> 0.5% annually</p>
              </div>
            </div>
          </div>

          <h2>Stage 4 vs Other Demographic Transition Stages</h2>
          
          <p>
            Stage 4 represents the goal of demographic transition - population stability with high quality of life. 
            Let's compare it with countries in other stages:
          </p>

          <h3>Stage 4 vs Stage 1: Development Transformation</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Germany (Stage 4) - Stable Structure</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(germany2024Data, 'Germany', 'rgba(40, 167, 69, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Niger (Stage 1) - High Growth Pyramid</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(niger2024Data, 'Niger', 'rgba(220, 53, 69, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
            <p className="text-blue-800">
              <strong>Key Difference:</strong> Germany shows balanced age distribution with advanced healthcare extending life expectancy, 
              while Niger displays rapid population growth with high mortality and fertility.
            </p>
          </div>

          <h3>Stage 4 vs Stage 2: Controlled vs Explosive Growth</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Australia (Stage 4) - Managed Growth</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(australia2024Data, 'Australia', 'rgba(40, 167, 69, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Kenya (Stage 2) - Population Explosion</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(kenya2024Data, 'Kenya', 'rgba(255, 152, 0, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
            <p className="text-blue-800">
              <strong>Key Difference:</strong> Australia maintains population growth through immigration rather than high birth rates, 
              while Kenya experiences natural population explosion with declining but still high fertility.
            </p>
          </div>

          <h3>Stage 4 vs Stage 3: Achieving Stability</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Canada (Stage 4) - Population Equilibrium</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(canada2024Data, 'Canada', 'rgba(40, 167, 69, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Brazil (Stage 3) - Transitioning to Stability</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(brazil2024Data, 'Brazil', 'rgba(255, 193, 7, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
            <p className="text-blue-800">
              <strong>Key Difference:</strong> Canada has achieved replacement-level fertility with stable institutions, 
              while Brazil is still experiencing demographic momentum with declining but above-replacement fertility.
            </p>
          </div>

          <h3>Stage 4 vs Stage 5: Preventing Population Decline</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">United Kingdom (Stage 4) - Balanced Aging</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(uk2024Data, 'United Kingdom', 'rgba(40, 167, 69, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Japan (Stage 5) - Population Decline</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(japan2024Data, 'Japan', 'rgba(102, 16, 242, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
            <p className="text-blue-800">
              <strong>Key Difference:</strong> The UK maintains near-replacement fertility avoiding severe population aging, 
              while Japan faces extreme aging and population decline with below-replacement fertility.
            </p>
          </div>

          <h2>Achieving Stage 4: Development Success Factors</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Institutional Foundations</h3>
              <ul className="text-green-700 space-y-2">
                <li>• Strong healthcare systems ensuring low mortality</li>
                <li>• Universal education creating informed family planning</li>
                <li>• Economic stability and social safety nets</li>
                <li>• Gender equality and women's empowerment</li>
                <li>• Effective governance and rule of law</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Cultural & Economic Factors</h3>
              <ul className="text-green-700 space-y-2">
                <li>• Urban, post-industrial society structure</li>
                <li>• High cost of raising children</li>
                <li>• Career prioritization and delayed childbearing</li>
                <li>• Access to contraception and family planning</li>
                <li>• Quality of life focus over family size</li>
              </ul>
            </div>
          </div>

          <h2>Policy Priorities in Stage 4 Countries</h2>

          <div className="bg-emerald-50 border-l-4 border-emerald-400 p-6 my-6">
            <h3 className="text-lg font-semibold text-emerald-800 mb-3">Key Policy Focus Areas</h3>
            <div className="text-emerald-700 space-y-3">
              <p><strong>Immigration Policy:</strong> Managing immigration to maintain workforce levels and support population growth (Australia, Canada)</p>
              <p><strong>Family Support:</strong> Providing childcare, parental leave, and family benefits to prevent fertility decline (Germany, UK)</p>
              <p><strong>Aging Preparation:</strong> Building sustainable pension and healthcare systems for gradual population aging</p>
              <p><strong>Labor Force:</strong> Maximizing productivity and workforce participation, especially women and older adults</p>
              <p><strong>Innovation Investment:</strong> Maintaining economic competitiveness despite slower population growth</p>
            </div>
          </div>

          <h2>The Stage 4 Achievement: Benefits and Challenges</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Stage 4 Benefits</h3>
              <ul className="text-blue-700 space-y-2">
                <li>• Population stability and predictable planning</li>
                <li>• High quality of life and living standards</li>
                <li>• Advanced healthcare extending life expectancy</li>
                <li>• Environmental sustainability with stable consumption</li>
                <li>• Economic prosperity and technological innovation</li>
                <li>• Gender equality and human rights protection</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">Stage 4 Challenges</h3>
              <ul className="text-amber-700 space-y-2">
                <li>• Risk of transition to Stage 5 (population decline)</li>
                <li>• Gradual workforce aging and skill gaps</li>
                <li>• Rising healthcare and pension costs</li>
                <li>• Potential economic stagnation without growth</li>
                <li>• Social tensions around immigration policies</li>
                <li>• Innovation pressure to maintain competitiveness</li>
              </ul>
            </div>
          </div>

          <h2>Maintaining Stage 4 Balance</h2>
          
          <p>
            The key to successful Stage 4 demographic transition is maintaining the delicate balance between:
          </p>

          <ul className="list-disc pl-6 my-4">
            <li><strong>Population stability</strong> without falling into Stage 5 decline</li>
            <li><strong>Economic growth</strong> through productivity rather than population increase</li>
            <li><strong>Immigration integration</strong> to maintain workforce and cultural cohesion</li>
            <li><strong>Intergenerational equity</strong> in social security and resource allocation</li>
            <li><strong>Innovation and adaptation</strong> to changing global demographics</li>
          </ul>

          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 my-6">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3">Stage 4 Success Model</h3>
            <p className="text-indigo-700">
              Countries that successfully maintain Stage 4 combine replacement-level fertility (around 2.1 children per woman), 
              selective immigration policies, strong institutions, and adaptive governance that can respond to demographic 
              changes while preserving social cohesion and economic prosperity.
            </p>
          </div>

          <h2>Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
            <Link href="/blog/stage-3-demographic-transition" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-yellow-600">Stage 3: Late Expanding</h3>
              <p className="text-sm text-gray-600 mt-2">Countries transitioning toward population stability</p>
            </Link>
            <Link href="/blog/stage-5-demographic-transition" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-purple-600">Stage 5: Declining</h3>
              <p className="text-sm text-gray-600 mt-2">Post-transition societies with population decline</p>
            </Link>
            <Link href="/blog/4-vs-5-stages-demographic-transition-model" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-blue-600">4 vs 5 Stage Models</h3>
              <p className="text-sm text-gray-600 mt-2">Understanding when to use different transition models</p>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default Stage4DemographicTransition;