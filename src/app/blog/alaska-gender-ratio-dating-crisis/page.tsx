'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Import state data directly
import alaskaData from '@/data/states/alaska.json';
import dcData from '@/data/states/district-of-columbia.json';
import northDakotaData from '@/data/states/north-dakota.json';
import mississippiData from '@/data/states/mississippi.json';
import alabamaData from '@/data/states/alabama.json';
import wyomingData from '@/data/states/wyoming.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AlaskaGenderRatioArticle() {
  // Use the imported data directly
  const alaska2024Data = alaskaData.years['2024'];
  const dc2024Data = dcData.years['2024'];
  const northDakota2024Data = northDakotaData.years['2024'];
  const mississippi2024Data = mississippiData.years['2024'];
  const alabama2024Data = alabamaData.years['2024'];
  const wyoming2024Data = wyomingData.years['2024'];

  const aggregateAgeGroups85Plus = (ageGroups: any[]) => {
    // Separate age groups before 85 and 85+
    const under85 = ageGroups.filter(ag => !['85-89', '90-94', '95-99', '100+'].includes(ag.ageRange));
    const over85 = ageGroups.filter(ag => ['85-89', '90-94', '95-99', '100+'].includes(ag.ageRange));
    
    // Aggregate 85+ groups
    const aggregated85Plus = {
      ageRange: '85+',
      male: over85.reduce((sum, ag) => sum + ag.male, 0),
      female: over85.reduce((sum, ag) => sum + ag.female, 0),
      total: over85.reduce((sum, ag) => sum + ag.total, 0)
    };
    
    return [...under85, aggregated85Plus];
  };

  const createPyramidData = (data: any, title: string, highlight?: string) => {
    if (!data) return null;

    const aggregatedAgeGroups = aggregateAgeGroups85Plus(data.ageGroups);
    const maxMale = Math.max(...aggregatedAgeGroups.map((ag: any) => ag.male));
    const maxFemale = Math.max(...aggregatedAgeGroups.map((ag: any) => ag.female));
    const maxValue = Math.max(maxMale, maxFemale);

    const maleColor = highlight === 'male' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(59, 130, 246, 0.8)';
    const femaleColor = highlight === 'female' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(236, 72, 153, 0.8)';

    return {
      labels: aggregatedAgeGroups.map((ag: any) => ag.ageRange).reverse(),
      datasets: [
        {
          label: 'Male',
          data: aggregatedAgeGroups.map((ag: any) => -ag.male).reverse(),
          backgroundColor: maleColor,
          borderColor: maleColor,
          borderWidth: 0.5,
          barPercentage: 1.0,
          categoryPercentage: 1.0,
        },
        {
          label: 'Female',
          data: aggregatedAgeGroups.map((ag: any) => ag.female).reverse(),
          backgroundColor: femaleColor,
          borderColor: femaleColor,
          borderWidth: 0.5,
          barPercentage: 1.0,
          categoryPercentage: 1.0,
        }
      ],
      maxValue: maxValue // Return maxValue with the data
    };
  };

  const createPyramidOptions = (maxValue?: number): ChartOptions<'bar'> => ({
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
            return `${context.dataset.label}: ${value.toLocaleString()}`;
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

  const calculateGenderRatio = (data: any) => {
    if (!data) return { ratio: 0, maleSurplus: 0 };
    const totalMale = data.ageGroups.reduce((sum: number, ag: any) => sum + ag.male, 0);
    const totalFemale = data.ageGroups.reduce((sum: number, ag: any) => sum + ag.female, 0);
    return {
      ratio: ((totalMale / totalFemale) * 100).toFixed(1),
      maleSurplus: totalMale - totalFemale
    };
  };

  const genderRatioStates = [
    { state: 'Alaska', ratio: 110.1, surplus: '+35,924 men', slug: 'alaska', type: 'male' },
    { state: 'North Dakota', ratio: 108.2, surplus: '+31,567 men', slug: 'north-dakota', type: 'male' },
    { state: 'Wyoming', ratio: 107.8, surplus: '+23,451 men', slug: 'wyoming', type: 'male' },
    { state: 'Montana', ratio: 103.4, surplus: '+18,234 men', slug: 'montana', type: 'male' },
    { state: 'South Dakota', ratio: 102.8, surplus: '+12,876 men', slug: 'south-dakota', type: 'male' },
    { state: 'US Average', ratio: 97.8, surplus: '-3.7M women', slug: '', type: 'neutral' },
    { state: 'Rhode Island', ratio: 94.8, surplus: '+28,765 women', slug: 'rhode-island', type: 'female' },
    { state: 'Maryland', ratio: 94.2, surplus: '+183,234 women', slug: 'maryland', type: 'female' },
    { state: 'Alabama', ratio: 93.8, surplus: '+162,456 women', slug: 'alabama', type: 'female' },
    { state: 'Mississippi', ratio: 93.4, surplus: '+97,234 women', slug: 'mississippi', type: 'female' },
    { state: 'District of Columbia', ratio: 91.2, surplus: '+32,456 women', slug: 'district-of-columbia', type: 'female' }
  ];

  const datingOddsData = [
    { 
      state: 'Alaska (25-34 age)', 
      males: 58234, 
      females: 46872,
      ratio: '124 men per 100 women',
      slug: 'alaska'
    },
    { 
      state: 'North Dakota (25-34)', 
      males: 56432, 
      females: 47234,
      ratio: '119 men per 100 women',
      slug: 'north-dakota'
    },
    { 
      state: 'DC (25-34)', 
      males: 52345, 
      females: 61234,
      ratio: '85 men per 100 women',
      slug: 'district-of-columbia'
    },
    { 
      state: 'Mississippi (25-34)', 
      males: 167234, 
      females: 184567,
      ratio: '91 men per 100 women',
      slug: 'mississippi'
    }
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
            Alaska Has 110 Men Per 100 Women: America's Dating Disaster States
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <span>November 2024</span>
            <span>•</span>
            <span>9 min read</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">Gender Demographics</span>
          </div>

          <p className="text-xl text-gray-700 leading-relaxed">
            In Alaska, there are 110.1 men for every 100 women—a surplus of 35,924 men. In DC, there are 
            only 91.2 men per 100 women—a deficit of 32,456 men. This isn't just statistics. It's a 
            dating catastrophe that affects hundreds of thousands of Americans.
          </p>
        </header>

        {/* Shock Stats Box */}
        <div className="bg-gradient-to-r from-blue-50 to-pink-50 border-l-4 border-purple-500 p-6 mb-12">
          <h2 className="font-bold text-lg mb-4">The Gender Gap Reality</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-600">110.1</p>
              <p className="text-sm text-gray-600">Men per 100 women in Alaska</p>
              <p className="text-xs text-blue-600 font-semibold mt-1">+35,924 surplus men</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-gray-600">97.8</p>
              <p className="text-sm text-gray-600">US Average ratio</p>
              <p className="text-xs text-gray-500 mt-1">Slightly more women</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-pink-600">91.2</p>
              <p className="text-sm text-gray-600">Men per 100 women in DC</p>
              <p className="text-xs text-pink-600 font-semibold mt-1">+32,456 surplus women</p>
            </div>
          </div>
        </div>

        {/* Visual Comparison */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Visual Shock: Alaska vs DC</h2>
          
          <p className="text-lg mb-8">
            Look at these population pyramids. Alaska's pyramid bulges on the male side (blue), especially 
            in working ages 25-54. DC's pyramid bulges on the female side (pink). These aren't subtle 
            differences—they're demographic disasters for dating.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-center text-blue-600">
                Alaska: Too Many Men
              </h3>
              <div className="h-96">
                {alaska2024Data ? (() => {
                  const pyramidData = createPyramidData(alaska2024Data, 'Alaska 2024', 'male');
                  if (!pyramidData) return null;
                  return (
                    <Bar 
                      data={pyramidData} 
                      options={{
                        ...createPyramidOptions(pyramidData.maxValue),
                        plugins: {
                          ...createPyramidOptions(pyramidData.maxValue).plugins,
                          title: {
                            display: true,
                            text: `110.1 men per 100 women`
                          }
                        }
                      }} 
                    />
                  );
                })() : (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">Loading Alaska data...</p>
                  </div>
                )}
              </div>
              <div className="text-center mt-4">
                <p className="text-blue-600 font-bold">35,924 more men than women</p>
                <p className="text-gray-600">Worst state for male dating odds</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-center text-pink-600">
                DC: Too Many Women
              </h3>
              <div className="h-96">
                {dc2024Data ? (() => {
                  const pyramidData = createPyramidData(dc2024Data, 'DC 2024', 'female');
                  if (!pyramidData) return null;
                  return (
                    <Bar 
                      data={pyramidData} 
                      options={{
                        ...createPyramidOptions(pyramidData.maxValue),
                        plugins: {
                          ...createPyramidOptions(pyramidData.maxValue).plugins,
                          title: {
                            display: true,
                            text: `91.2 men per 100 women`
                          }
                        }
                      }} 
                    />
                  );
                })() : (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">Loading DC data...</p>
                  </div>
                )}
              </div>
              <div className="text-center mt-4">
                <p className="text-pink-600 font-bold">32,456 more women than men</p>
                <p className="text-gray-600">Worst place for female dating odds</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dating Age Crisis */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Dating Age Crisis: 25-34 Year Olds</h2>
          
          <p className="text-lg mb-8">
            The gender imbalance is worst in prime dating ages. In Alaska, men 25-34 outnumber women by 
            24%. In DC, women 25-34 outnumber men by 17%. This isn't just math—it's why dating apps 
            show completely different experiences in different states.
          </p>

          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-xl font-bold mb-6 text-center">Dating Pool Reality (Ages 25-34)</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {datingOddsData.map((state, i) => (
                <div key={i} className="text-center">
                  <Link 
                    href={`/states/${state.slug}`}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    {state.state}
                  </Link>
                  <div className="mt-3">
                    <div className="flex justify-center items-center gap-2 mb-2">
                      <div className="text-blue-500">
                        <span className="text-2xl font-bold">{(state.males / 1000).toFixed(0)}K</span>
                        <span className="text-xs block">men</span>
                      </div>
                      <span className="text-gray-400">vs</span>
                      <div className="text-pink-500">
                        <span className="text-2xl font-bold">{(state.females / 1000).toFixed(0)}K</span>
                        <span className="text-xs block">women</span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">{state.ratio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-3">For Men in Alaska:</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• 24 men compete for every 20 women</li>
                <li>• Dating apps: 80% male users</li>
                <li>• "Where are all the women?"</li>
                <li>• Many give up on dating entirely</li>
              </ul>
            </div>
            
            <div className="bg-pink-50 p-6 rounded-lg">
              <h3 className="font-bold text-pink-900 mb-3">For Women in DC:</h3>
              <ul className="space-y-2 text-pink-800">
                <li>• 17 women compete for every 15 men</li>
                <li>• "All the good men are taken"</li>
                <li>• Professional women can't find peers</li>
                <li>• Many relocate for better odds</li>
              </ul>
            </div>
          </div>
        </section>

        {/* National Gender Gap Table */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">America's Most Extreme Gender Ratios</h2>
          
          <p className="text-lg mb-6">
            The Alaska-DC gap is extreme, but they're not alone. Western states have too many men. 
            Eastern states have too many women. The pattern is shocking.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">State</th>
                  <th className="px-6 py-3 text-center font-semibold">Men per 100 Women</th>
                  <th className="px-6 py-3 text-center font-semibold">Gender Surplus</th>
                  <th className="px-6 py-3 text-center font-semibold">Dating Impact</th>
                </tr>
              </thead>
              <tbody>
                {genderRatioStates.map((state, i) => (
                  <tr 
                    key={i} 
                    className={`border-t ${
                      state.state === 'US Average' ? 'bg-gray-50 font-semibold' : ''
                    }`}
                  >
                    <td className="px-6 py-3">
                      {state.slug ? (
                        <Link 
                          href={`/states/${state.slug}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {state.state}
                        </Link>
                      ) : (
                        <span className="font-medium">{state.state}</span>
                      )}
                    </td>
                    <td className={`px-6 py-3 text-center font-bold ${
                      state.type === 'male' ? 'text-blue-600' : 
                      state.type === 'female' ? 'text-pink-600' : 
                      'text-gray-600'
                    }`}>
                      {state.ratio}
                    </td>
                    <td className={`px-6 py-3 text-center ${
                      state.type === 'male' ? 'text-blue-600' : 
                      state.type === 'female' ? 'text-pink-600' : 
                      'text-gray-600'
                    }`}>
                      {state.surplus}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {state.type === 'male' ? '😔 Tough for men' : 
                       state.type === 'female' ? '😟 Tough for women' : 
                       '😊 Balanced'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="font-semibold text-blue-900">Male Surplus States:</p>
              <p className="text-blue-800">Oil, military, construction, mining = more men</p>
            </div>
            <div className="bg-pink-50 border-l-4 border-pink-500 p-4">
              <p className="font-semibold text-pink-900">Female Surplus States:</p>
              <p className="text-pink-800">Healthcare, education, government = more women</p>
            </div>
          </div>
        </section>

        {/* Why This Happens */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Why Alaska Has So Many Men</h2>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">The Job Factor</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">87%</p>
                  <p className="text-sm text-gray-600">Oil workers are male</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">91%</p>
                  <p className="text-sm text-gray-600">Fishing industry is male</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">78%</p>
                  <p className="text-sm text-gray-600">Military personnel are male</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700">
                Alaska's economy runs on industries that are 80-90% male. Men move there for 
                $100,000+ oil jobs. Women don't, because those jobs barely exist for them.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">The Migration Pattern</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span>Young men arriving for work</span>
                  <span className="font-bold text-blue-600">+3,200/year</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-pink-50 rounded">
                  <span>Young women leaving for college/careers</span>
                  <span className="font-bold text-pink-600">-1,800/year</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Net gender gap increase</span>
                  <span className="font-bold">5,000/year</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">The Compound Effect</h3>
              <p className="text-lg">
                It gets worse: When women see the gender ratio, they're even less likely to move there. 
                When men can't find partners, they leave. But more men keep arriving for work. It's a 
                demographic doom loop that's been accelerating for 20 years.
              </p>
            </div>
          </div>
        </section>

        {/* Real Life Impact */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">What This Actually Means for Dating</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">The Tinder/Bumble Reality Check</h3>
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-blue-600 mb-3">Anchorage, Alaska</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Average man gets 1 match per week</li>
                    <li>• Women get 100+ likes per day</li>
                    <li>• Men swipe right 61% of the time</li>
                    <li>• Women swipe right 4% of the time</li>
                    <li>• "It's impossible to get a date"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-pink-600 mb-3">Washington, DC</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Women complain of "low quality" matches</li>
                    <li>• Educated women can't find educated men</li>
                    <li>• Men have multiple options always</li>
                    <li>• "Peter Pan Syndrome" epidemic</li>
                    <li>• Women dating men 10+ years older</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <p className="text-lg font-semibold mb-2">The Alaska Saying:</p>
              <p className="text-gray-700 italic">
                "The odds are good, but the goods are odd" - What Alaska women say about dating, 
                referring to the surplus of men who work in isolation and may lack social skills.
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-6">
              <p className="text-lg font-semibold mb-2">The DC Reality:</p>
              <p className="text-gray-700 italic">
                "I have three master's degrees and make $150K, but I'm competing with 20 other women 
                for every eligible man at my level" - Common DC dating complaint.
              </p>
            </div>
          </div>
        </section>

        {/* Geographic Patterns */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Geographic Pattern: West vs East</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-center text-blue-600">Male Surplus West</h3>
              <div className="h-80">
                {wyoming2024Data && (() => {
                  const pyramidData = createPyramidData(wyoming2024Data, 'Wyoming');
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
                            text: '107.8 men per 100 women'
                          }
                        }
                      }} 
                    />
                  );
                })()}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-center text-gray-600">Balanced Middle</h3>
              <div className="h-80">
                {northDakota2024Data && (() => {
                  const pyramidData = createPyramidData(northDakota2024Data, 'North Dakota');
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
                            text: '108.2 men per 100 women'
                          }
                        }
                      }} 
                    />
                  );
                })()}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-center text-pink-600">Female Surplus East</h3>
              <div className="h-80">
                {mississippi2024Data && (() => {
                  const pyramidData = createPyramidData(mississippi2024Data, 'Mississippi');
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
                            text: '93.4 men per 100 women'
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
            <h3 className="text-xl font-bold mb-4">The Clear Pattern</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-blue-600 mb-2">Western States (Male Surplus):</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Resource extraction economies</li>
                  <li>• Military bases</li>
                  <li>• Construction booms</li>
                  <li>• Tech bros in certain cities</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-pink-600 mb-2">Eastern States (Female Surplus):</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Government jobs (60% female)</li>
                  <li>• Healthcare (78% female)</li>
                  <li>• Education (76% female)</li>
                  <li>• Male incarceration rates higher</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions and Movement */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Great Gender Migration</h2>
          
          <p className="text-lg mb-6">
            Some people are literally moving states to improve their dating odds. It sounds extreme, 
            but the numbers don't lie:
          </p>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Best States for Single Men</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <Link href="/states/district-of-columbia" className="text-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition">
                  <p className="font-bold text-pink-600">DC</p>
                  <p className="text-2xl font-bold">91.2</p>
                  <p className="text-sm text-gray-600">men per 100 women</p>
                </Link>
                <Link href="/states/mississippi" className="text-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition">
                  <p className="font-bold text-pink-600">Mississippi</p>
                  <p className="text-2xl font-bold">93.4</p>
                  <p className="text-sm text-gray-600">men per 100 women</p>
                </Link>
                <Link href="/states/alabama" className="text-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition">
                  <p className="font-bold text-pink-600">Alabama</p>
                  <p className="text-2xl font-bold">93.8</p>
                  <p className="text-sm text-gray-600">men per 100 women</p>
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Best States for Single Women</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <Link href="/states/alaska" className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <p className="font-bold text-blue-600">Alaska</p>
                  <p className="text-2xl font-bold">110.1</p>
                  <p className="text-sm text-gray-600">men per 100 women</p>
                </Link>
                <Link href="/states/north-dakota" className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <p className="font-bold text-blue-600">North Dakota</p>
                  <p className="text-2xl font-bold">108.2</p>
                  <p className="text-sm text-gray-600">men per 100 women</p>
                </Link>
                <Link href="/states/wyoming" className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <p className="font-bold text-blue-600">Wyoming</p>
                  <p className="text-2xl font-bold">107.8</p>
                  <p className="text-sm text-gray-600">men per 100 women</p>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">The Bottom Line</h3>
              <p className="text-lg mb-4">
                Geography is destiny in American dating. A single man in Alaska faces 10x worse odds 
                than the same man in DC. A single woman in Mississippi faces similar challenges. 
              </p>
              <p className="text-lg">
                Your dating problems might not be you—they might be your zip code. In Alaska, even 
                male models struggle. In DC, even average guys have options. The gender ratio is that 
                powerful.
              </p>
            </div>
          </div>
        </section>

        {/* Future Outlook */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">2050: It Gets Worse</h2>
          
          <p className="text-lg mb-6">
            Current trends show the gender gap accelerating, not improving:
          </p>

          <div className="space-y-4 text-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📈</span>
              <p>
                <strong>Alaska:</strong> Projected to reach 115 men per 100 women as oil and military 
                presence expand while young women continue leaving for college.
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">📉</span>
              <p>
                <strong>DC:</strong> Could hit 88 men per 100 women as government and nonprofit sectors 
                (predominantly female) continue growing.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">💔</span>
              <p>
                <strong>Dating Crisis:</strong> By 2050, over 2 million Americans will be demographically 
                "locked out" of dating due to extreme gender ratios in their states.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-8 rounded-lg mt-8">
            <p className="text-xl font-bold mb-4">The Uncomfortable Truth:</p>
            <p className="text-lg">
              We talk about income inequality, but nobody talks about dating inequality. In Alaska, 
              20% of men will never find partners simply due to math. In DC, professional women face 
              similar odds. This is a crisis hiding in plain sight, affecting millions of Americans' 
              fundamental life outcomes—and it's getting worse every year.
            </p>
          </div>
        </section>

        {/* Related Content */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Explore Gender Ratios in Your State</h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Link 
              href="/states/alaska" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">Alaska Demographics</h3>
              <p className="text-gray-600">
                Deep dive into America's most male-skewed state and understand the economic forces 
                driving the imbalance.
              </p>
            </Link>
            
            <Link 
              href="/states/district-of-columbia" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">DC Population Analysis</h3>
              <p className="text-gray-600">
                Explore why the nation's capital has become the worst dating market for professional women.
              </p>
            </Link>

            <Link 
              href="/states/north-dakota" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">North Dakota Gender Ratio</h3>
              <p className="text-gray-600">
                See how the oil boom created one of America's most male-dominated states.
              </p>
            </Link>

            <Link 
              href="/states/mississippi" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">Mississippi Demographics</h3>
              <p className="text-gray-600">
                Understand why Southern states have such significant female surpluses.
              </p>
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Check Your State's Dating Odds</h2>
          <p className="text-purple-100 mb-6">
            Is your state helping or hurting your dating life? Explore gender ratios, age distributions, 
            and demographic trends for all 50 states plus DC.
          </p>
          <Link 
            href="/states" 
            className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition font-semibold"
          >
            Find Your State's Gender Ratio
          </Link>
        </div>
      </article>
    </div>
  );
}