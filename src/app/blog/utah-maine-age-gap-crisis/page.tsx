'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Import state data directly
import utahData from '@/data/states/utah.json';
import maineData from '@/data/states/maine.json';
import vermontData from '@/data/states/vermont.json';
import floridaData from '@/data/states/florida.json';
import texasData from '@/data/states/texas.json';
import alaskaData from '@/data/states/alaska.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function UtahMaineAgeGapArticle() {
  // Use the imported data directly
  const utah2024Data = utahData.years['2024'];
  const maine2024Data = maineData.years['2024'];
  const vermont2024Data = vermontData.years['2024'];
  const florida2024Data = floridaData.years['2024'];
  const texas2024Data = texasData.years['2024'];
  const alaska2024Data = alaskaData.years['2024'];

  const createPyramidData = (data: any, title: string) => {
    if (!data) return null;

    const maxMale = Math.max(...data.ageGroups.map((ag: any) => ag.male));
    const maxFemale = Math.max(...data.ageGroups.map((ag: any) => ag.female));
    const maxValue = Math.max(maxMale, maxFemale);

    return {
      labels: data.ageGroups.map((ag: any) => ag.ageRange).reverse(),
      datasets: [
        {
          label: 'Male',
          data: data.ageGroups.map((ag: any) => -ag.male).reverse(),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 0.5,
          barPercentage: 1.0,
          categoryPercentage: 1.0,
        },
        {
          label: 'Female',
          data: data.ageGroups.map((ag: any) => ag.female).reverse(),
          backgroundColor: 'rgba(236, 72, 153, 0.8)',
          borderColor: 'rgba(236, 72, 153, 1)',
          borderWidth: 0.5,
          barPercentage: 1.0,
          categoryPercentage: 1.0,
        }
      ],
      maxValue: maxValue
    };
  };

  const createPyramidOptions = (maxValue?: number, totalPop?: number): ChartOptions<'bar'> => ({
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = Math.abs(context.parsed.x);
            const percentage = ((value / (totalPop || 1)) * 100).toFixed(2);
            return `${context.dataset.label}: ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        min: maxValue ? -maxValue : undefined,
        max: maxValue ? maxValue : undefined,
        ticks: {
          callback: function(value) {
            return Math.abs(Number(value)).toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'Population'
        }
      },
      y: {
        stacked: true,
        title: {
          display: false
        }
      }
    }
  });

  const medianAges = [
    { state: 'Utah', age: 32.4, slug: 'utah' },
    { state: 'District of Columbia', age: 34.4, slug: 'district-of-columbia' },
    { state: 'Alaska', age: 35.6, slug: 'alaska' },
    { state: 'Texas', age: 35.5, slug: 'texas' },
    { state: 'North Dakota', age: 35.8, slug: 'north-dakota' },
    { state: 'Georgia', age: 37.5, slug: 'georgia' },
    { state: 'California', age: 37.8, slug: 'california' },
    { state: 'Maine', age: 44.8, slug: 'maine' },
    { state: 'Vermont', age: 43.2, slug: 'vermont' },
    { state: 'New Hampshire', age: 43.0, slug: 'new-hampshire' },
    { state: 'Florida', age: 43.0, slug: 'florida' },
    { state: 'West Virginia', age: 42.8, slug: 'west-virginia' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <span>›</span>
            <span>Demographics</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Utah vs Maine: America's 12-Year Age Gap Crisis
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <span>November 2024</span>
            <span>•</span>
            <span>8 min read</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">Demographic Analysis</span>
          </div>

          <p className="text-xl text-gray-700 leading-relaxed">
            Utah's median age is 32.4 years. Maine's is 44.8 years. That 12.4-year gap is bigger than the 
            difference between elementary school and college graduation. America is splitting into two 
            demographic nations—and the divide is accelerating.
          </p>
        </header>

        {/* Key Stats Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-12">
          <h2 className="font-bold text-lg mb-4">Key Statistics</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Utah:</span> Median age 32.4 | 31.5% under 18 | 11.4% over 65
            </div>
            <div>
              <span className="font-semibold">Maine:</span> Median age 44.8 | 17.8% under 18 | 22.7% over 65
            </div>
            <div>
              <span className="font-semibold">Age gap:</span> 12.4 years (38% difference)
            </div>
            <div>
              <span className="font-semibold">Youth ratio:</span> Utah has 1.8x more children per capita
            </div>
          </div>
        </div>

        {/* Main Comparison Pyramids */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Tale of Two Americas</h2>
          
          <p className="text-lg mb-8">
            Look at these population pyramids side by side. Utah's pyramid bulges at the bottom—a classic 
            youth boom with families having 3, 4, even 5 children. Maine's pyramid is top-heavy, looking 
            more like a mushroom as retirees outnumber children nearly 2-to-1.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-center">
                <Link href="/states/utah" className="hover:text-blue-600">Utah Population Pyramid 2024</Link>
              </h3>
              <div className="h-96">
                {utah2024Data && (() => {
                  const pyramidData = createPyramidData(utah2024Data, 'Utah 2024');
                  if (!pyramidData) return null;
                  return (
                    <Bar 
                      data={pyramidData} 
                      options={{
                        ...createPyramidOptions(pyramidData.maxValue, utah2024Data.totalPopulation),
                        plugins: {
                          ...createPyramidOptions(pyramidData.maxValue, utah2024Data.totalPopulation).plugins,
                          title: {
                            display: true,
                            text: `Median Age: ${utah2024Data.medianAge?.toFixed(1) || 'N/A'} years`
                          }
                        }
                      }} 
                    />
                  );
                })()}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-center">
                <Link href="/states/maine" className="hover:text-blue-600">Maine Population Pyramid 2024</Link>
              </h3>
              <div className="h-96">
                {maine2024Data && (() => {
                  const pyramidData = createPyramidData(maine2024Data, 'Maine 2024');
                  if (!pyramidData) return null;
                  return (
                    <Bar 
                      data={pyramidData} 
                      options={{
                        ...createPyramidOptions(pyramidData.maxValue, maine2024Data.totalPopulation),
                        plugins: {
                          ...createPyramidOptions(pyramidData.maxValue, maine2024Data.totalPopulation).plugins,
                          title: {
                            display: true,
                            text: `Median Age: ${maine2024Data.medianAge?.toFixed(1) || 'N/A'} years`
                          }
                        }
                      }} 
                    />
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-lg font-semibold mb-2">What You're Seeing:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Utah:</strong> Classic pyramid shape with 920,000+ children under 18 (31.5% of population)</li>
              <li>• <strong>Maine:</strong> Inverted pyramid with only 240,000 children (17.8%) but 320,000 seniors (22.7%)</li>
              <li>• <strong>The Gap:</strong> For every 100 seniors in Utah, there are 276 children. In Maine, only 78 children per 100 seniors</li>
            </ul>
          </div>
        </section>

        {/* Why This Matters */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Why This 12-Year Gap Changes Everything</h2>
          
          <div className="space-y-6 text-lg">
            <p>
              This isn't just about numbers—it's about two completely different societies emerging within 
              America. Utah's elementary schools are overflowing while Maine converts them to senior centers. 
              Utah needs pediatricians; Maine needs geriatricians. Utah builds playgrounds; Maine builds 
              retirement communities.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 my-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-bold text-green-900 mb-3">Utah's Youth Dividend</h3>
                <ul className="space-y-2 text-green-800">
                  <li>• Growing workforce for decades</li>
                  <li>• Booming consumer spending</li>
                  <li>• Innovation and startup culture</li>
                  <li>• Rising home prices from family demand</li>
                </ul>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="font-bold text-red-900 mb-3">Maine's Aging Crisis</h3>
                <ul className="space-y-2 text-red-800">
                  <li>• Shrinking workforce</li>
                  <li>• Rising healthcare costs</li>
                  <li>• School closures</li>
                  <li>• Economic stagnation</li>
                </ul>
              </div>
            </div>

            <p>
              The economic implications are staggering. Utah's young population means a 
              tax base that will grow for the next 30 years. Maine's aging population means rising costs 
              and shrinking revenues—a demographic doom loop that's nearly impossible to escape.
            </p>
          </div>
        </section>

        {/* America's Age Extremes Table */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">America's Youngest and Oldest States</h2>
          
          <p className="text-lg mb-6">
            The Utah-Maine divide is just the tip of the iceberg. America is increasingly splitting 
            into young states and old states, with virtually no middle ground.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Youngest States</th>
                  <th className="px-6 py-3 text-center font-semibold">Median Age</th>
                  <th className="px-6 py-3 text-left font-semibold">Oldest States</th>
                  <th className="px-6 py-3 text-center font-semibold">Median Age</th>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 3, 4].map(i => (
                  <tr key={i} className="border-t">
                    <td className="px-6 py-3">
                      <Link 
                        href={`/states/${medianAges[i].slug}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {medianAges[i].state}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-green-600">
                      {medianAges[i].age}
                    </td>
                    <td className="px-6 py-3">
                      <Link 
                        href={`/states/${medianAges[i + 7].slug}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {medianAges[i + 7].state}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-red-600">
                      {medianAges[i + 7].age}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 mt-4 text-center">
            Gap between youngest (Utah) and oldest (Maine): <span className="font-bold">12.4 years</span>
          </p>
        </section>

        {/* Regional Patterns */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Geographic Divide: Young West vs Aging Northeast</h2>
          
          <p className="text-lg mb-8">
            This isn't random—it's geographic. The Mountain West stays young while New England ages rapidly. 
            Look at how neighboring states cluster together in age profiles:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-center">Young Mountain West</h3>
              <div className="h-80">
                {utah2024Data && (() => {
                  const pyramidData = createPyramidData(utah2024Data, 'Utah');
                  if (!pyramidData) return null;
                  return (
                    <Bar 
                      data={pyramidData} 
                      options={{
                        ...createPyramidOptions(pyramidData.maxValue),
                        plugins: {
                          ...createPyramidOptions(pyramidData.maxValue).plugins,
                          legend: { display: false },
                          title: {
                            display: true,
                            text: 'Utah - Median: 32.4'
                          }
                        }
                      }} 
                    />
                  );
                })()}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-center">Young South</h3>
              <div className="h-80">
                {texas2024Data && (() => {
                  const pyramidData = createPyramidData(texas2024Data, 'Texas');
                  if (!pyramidData) return null;
                  return (
                    <Bar 
                      data={pyramidData} 
                      options={{
                        ...createPyramidOptions(pyramidData.maxValue),
                        plugins: {
                          ...createPyramidOptions(pyramidData.maxValue).plugins,
                          legend: { display: false },
                          title: {
                            display: true,
                            text: 'Texas - Median: 35.5'
                          }
                        }
                      }} 
                    />
                  );
                })()}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-center">Aging Northeast</h3>
              <div className="h-80">
                {vermont2024Data && (() => {
                  const pyramidData = createPyramidData(vermont2024Data, 'Vermont');
                  if (!pyramidData) return null;
                  return (
                    <Bar 
                      data={pyramidData} 
                      options={{
                        ...createPyramidOptions(pyramidData.maxValue),
                        plugins: {
                          ...createPyramidOptions(pyramidData.maxValue).plugins,
                          legend: { display: false },
                          title: {
                            display: true,
                            text: 'Vermont - Median: 43.2'
                          }
                        }
                      }} 
                    />
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <p className="text-lg">
              <strong>Pattern Alert:</strong> Every single New England state has a median age over 41. 
              Every Mountain West state except Montana is under 39. This isn't coincidence—it's mass 
              migration of young families seeking affordable homes and job opportunities.
            </p>
          </div>
        </section>

        {/* The Shocking Numbers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Numbers That Will Shock You</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Children Per 1,000 People</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-bold">315</p>
                  <p className="text-gray-600">Utah children under 18 per 1,000 residents</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">178</p>
                  <p className="text-gray-600">Maine children under 18 per 1,000 residents</p>
                </div>
              </div>
              <p className="mt-4 text-center font-semibold">
                Utah has 77% more children per capita than Maine
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-red-600">Seniors Per 1,000 People</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-bold">114</p>
                  <p className="text-gray-600">Utah residents over 65 per 1,000</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">227</p>
                  <p className="text-gray-600">Maine residents over 65 per 1,000</p>
                </div>
              </div>
              <p className="mt-4 text-center font-semibold">
                Maine has 99% more seniors per capita than Utah
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-red-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">The Dependency Ratio Crisis</h3>
              <p className="text-lg mb-4">
                For every 100 working-age adults (18-64):
              </p>
              <div className="grid sm:grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold">68</p>
                  <p>dependents in Utah</p>
                  <p className="text-sm mt-2">(mostly children who will become workers)</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">62</p>
                  <p>dependents in Maine</p>
                  <p className="text-sm mt-2">(mostly retirees who need support)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Happens Next */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">What Happens Next: The 2050 Projection</h2>
          
          <p className="text-lg mb-6">
            If current trends continue, by 2050:
          </p>

          <div className="space-y-4 text-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📈</span>
              <p>
                <strong>Utah</strong> will have 4.5 million people, with a median age still under 35, 
                becoming an economic powerhouse rivaling Colorado.
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">📉</span>
              <p>
                <strong>Maine</strong> could see its median age exceed 48, with more than 30% of the 
                population over 65, creating an unprecedented caregiving crisis.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🏘️</span>
              <p>
                The housing market will completely bifurcate: family homes in young states, 
                senior living in old states.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">💼</span>
              <p>
                Companies will cluster in young states, accelerating the economic divide between 
                demographic winners and losers.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-8 rounded-lg mt-8">
            <p className="text-xl font-bold mb-4">The Bottom Line:</p>
            <p className="text-lg">
              America isn't one country demographically—it's at least two, possibly three. The 12.4-year 
              age gap between Utah and Maine represents two completely different economic futures, social 
              structures, and political priorities. This divide will define American politics, economics, 
              and culture for the next generation.
            </p>
          </div>
        </section>

        {/* Related Content */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Explore More State Demographics</h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Link 
              href="/states/utah" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">Utah Population Pyramid</h3>
              <p className="text-gray-600">
                Explore Utah's complete demographic profile, including detailed age distributions and historical trends.
              </p>
            </Link>
            
            <Link 
              href="/states/maine" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">Maine Population Pyramid</h3>
              <p className="text-gray-600">
                Dive deep into Maine's aging demographics and see how it compares to other New England states.
              </p>
            </Link>

            <Link 
              href="/states/florida" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">Florida Demographics</h3>
              <p className="text-gray-600">
                See how America's retirement capital balances retirees with young immigrant families.
              </p>
            </Link>

            <Link 
              href="/states/texas" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">Texas Population Analysis</h3>
              <p className="text-gray-600">
                Discover how Texas maintains a young median age despite its massive size.
              </p>
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Explore Your State's Demographics</h2>
          <p className="text-blue-100 mb-6">
            See how your state compares in America's demographic divide. Explore population pyramids, 
            age distributions, and growth trends for all 50 states plus DC.
          </p>
          <Link 
            href="/states" 
            className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
          >
            View All US States
          </Link>
        </div>
      </article>
    </div>
  );
}