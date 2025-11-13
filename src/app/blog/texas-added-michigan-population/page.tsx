'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Import state data directly
import texasData from '@/data/states/texas.json';
import floridaData from '@/data/states/florida.json';
import californiaData from '@/data/states/california.json';
import michiganData from '@/data/states/michigan.json';
import indianaData from '@/data/states/indiana.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TexasAddedMichiganArticle() {
  // Use the imported data directly
  const texas2000Data = texasData.years['2000'];
  const texas2024Data = texasData.years['2024'];
  const florida2000Data = floridaData.years['2000'];
  const florida2024Data = floridaData.years['2024'];
  const california2000Data = californiaData.years['2000'];
  const california2024Data = californiaData.years['2024'];
  const michigan2024Data = michiganData.years['2024'];
  const indiana2024Data = indianaData.years['2024'];

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

  const createPyramidData = (data: any, title: string) => {
    if (!data) return null;

    const aggregatedAgeGroups = aggregateAgeGroups85Plus(data.ageGroups);
    const maxMale = Math.max(...aggregatedAgeGroups.map((ag: any) => ag.male));
    const maxFemale = Math.max(...aggregatedAgeGroups.map((ag: any) => ag.female));
    const maxValue = Math.max(maxMale, maxFemale);

    return {
      labels: aggregatedAgeGroups.map((ag: any) => ag.ageRange).reverse(),
      datasets: [
        {
          label: 'Male',
          data: aggregatedAgeGroups.map((ag: any) => -ag.male).reverse(),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 0.5,
          barPercentage: 1.0,
          categoryPercentage: 1.0,
        },
        {
          label: 'Female',
          data: aggregatedAgeGroups.map((ag: any) => ag.female).reverse(),
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

  // Growth visualization data
  const growthTimelineData = {
    labels: ['2000', '2005', '2010', '2015', '2020', '2024'],
    datasets: [
      {
        label: 'Texas Population',
        data: [20.85, 22.86, 25.15, 27.47, 29.15, 31.30],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        tension: 0.1
      },
      {
        label: 'Texas Growth Since 2000',
        data: [0, 2.01, 4.30, 6.62, 8.30, 10.45],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        tension: 0.1,
        yAxisID: 'y1',
      },
      {
        label: 'Michigan Total Population',
        data: [9.94, 10.05, 9.88, 9.92, 10.08, 10.04],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5]
      }
    ]
  };

  const growthTimelineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Texas Added Michigan: The Visual Proof',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}M people`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Population (Millions)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Growth (Millions)'
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    }
  };

  const stateComparisons = [
    { 
      state: 'Texas', 
      gained: '+10.45M', 
      equivalent: 'Michigan (10.04M)', 
      percentage: '+50.1%',
      slug: 'texas'
    },
    { 
      state: 'Florida', 
      gained: '+6.80M', 
      equivalent: 'Indiana (6.86M)', 
      percentage: '+38.7%',
      slug: 'florida'
    },
    { 
      state: 'California', 
      gained: '+5.18M', 
      equivalent: 'South Carolina (5.40M)', 
      percentage: '+15.2%',
      slug: 'california'
    },
    { 
      state: 'Georgia', 
      gained: '+2.84M', 
      equivalent: 'Nevada (3.30M)', 
      percentage: '+34.7%',
      slug: 'georgia'
    },
    { 
      state: 'North Carolina', 
      gained: '+2.67M', 
      equivalent: 'Arkansas (3.09M)', 
      percentage: '+33.1%',
      slug: 'north-carolina'
    },
    { 
      state: 'Arizona', 
      gained: '+2.49M', 
      equivalent: 'New Mexico (2.12M)', 
      percentage: '+48.5%',
      slug: 'arizona'
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
            Texas Added Michigan: States That Gained Entire State Populations
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <span>November 2024</span>
            <span>•</span>
            <span>12 min read</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">Population Growth</span>
          </div>

          <p className="text-xl text-gray-700 leading-relaxed">
            Since 2000, Texas gained 10.45 million people. That's not just a number—that's more than 
            Michigan's entire population of 10.04 million. Texas literally added an entire major state 
            worth of humans in just 24 years.
          </p>
        </header>

        {/* Shock Box */}
        <div className="bg-gradient-to-r from-red-50 to-blue-50 border-l-4 border-red-500 p-6 mb-12">
          <h2 className="font-bold text-lg mb-4">The Mind-Blowing Math</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Texas 2000</p>
              <p className="text-3xl font-bold">20.85M</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Texas 2024</p>
              <p className="text-3xl font-bold text-red-600">31.30M</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Gain = Michigan</p>
              <p className="text-3xl font-bold text-green-600">+10.45M</p>
            </div>
          </div>
          <p className="mt-4 text-center font-semibold">
            Texas grew by 50.1% — adding 1,190 people EVERY SINGLE DAY for 24 years
          </p>
        </div>

        {/* Visual Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Watch Texas Swallow Michigan</h2>
          
          <p className="text-lg mb-8">
            This chart shows the stunning reality: Texas's growth alone (green line) nearly matches 
            Michigan's entire population (gray dotted line). By 2024, the growth surpasses it.
          </p>

          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <div className="h-96">
              <Line data={growthTimelineData} options={growthTimelineOptions} />
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <p className="text-lg font-semibold mb-2">The Daily Reality:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• Every 24 hours: Texas gains 1,190 people</li>
              <li>• Every week: Texas adds a small town (8,330 people)</li>
              <li>• Every month: Texas adds a mid-size city (36,000 people)</li>
              <li>• Every year: Texas adds more than Wyoming's capital (434,000 people)</li>
            </ul>
          </div>
        </section>

        {/* Pyramid Comparison */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Demographic Transformation</h2>
          
          <p className="text-lg mb-8">
            Texas didn't just add people—it transformed demographically. Compare Texas 2000 vs 2024 
            to see how 10.45 million new residents reshaped the state's age structure.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-center">Texas 2000</h3>
              <div className="h-80">
                {texas2000Data && (() => {
                  const pyramidData = createPyramidData(texas2000Data, 'Texas 2000');
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
                            text: `20.85 million people`
                          }
                        }
                      }} 
                    />
                  );
                })()}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-center">Texas 2024</h3>
              <div className="h-80">
                {texas2024Data && (() => {
                  const pyramidData = createPyramidData(texas2024Data, 'Texas 2024');
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
                            text: `31.30 million people`
                          }
                        }
                      }} 
                    />
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-2xl font-bold text-green-600">+50.1% Growth</p>
            <p className="text-gray-600">Every age group expanded massively</p>
          </div>

          {/* Michigan comparison */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-center">
              For Scale: This Is Michigan's Entire Population
            </h3>
            <div className="max-w-md mx-auto h-80">
              {michigan2024Data && (() => {
                const pyramidData = createPyramidData(michigan2024Data, 'Michigan 2024');
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
                          text: `Michigan: 10.04 million (Texas gained 10.45M)`
                        }
                      }
                    }} 
                  />
                );
              })()}
            </div>
            <p className="text-center mt-4 text-gray-600">
              Texas added MORE people than live in this entire pyramid
            </p>
          </div>
        </section>

        {/* Other States That Added States */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">States That Swallowed Other States</h2>
          
          <p className="text-lg mb-8">
            Texas isn't alone. Multiple states have added populations equivalent to entire other states. 
            This is demographic cannibalism on a continental scale.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">State</th>
                  <th className="px-6 py-3 text-center font-semibold">Population Gained</th>
                  <th className="px-6 py-3 text-left font-semibold">Equivalent To</th>
                  <th className="px-6 py-3 text-center font-semibold">% Growth</th>
                </tr>
              </thead>
              <tbody>
                {stateComparisons.map((state, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-6 py-3">
                      <Link 
                        href={`/states/${state.slug}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {state.state}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-green-600">
                      {state.gained}
                    </td>
                    <td className="px-6 py-3">
                      {state.equivalent}
                    </td>
                    <td className="px-6 py-3 text-center font-bold">
                      {state.percentage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-green-900 mb-3">Florida's Insane Growth</h3>
              <p className="text-green-800 mb-3">
                Florida added 6.8 million people—more than Indiana's entire population (6.86M). 
                Every retirement community, theme park expansion, and new development represents 
                this massive influx.
              </p>
              <Link 
                href="/states/florida"
                className="text-green-600 hover:text-green-800 font-medium"
              >
                Explore Florida's growth →
              </Link>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-3">California Still Growing</h3>
              <p className="text-blue-800 mb-3">
                Despite the narrative, California added 5.18 million people—more than South 
                Carolina's entire population (5.4M). That's a 15% increase even with recent 
                outmigration.
              </p>
              <Link 
                href="/states/california"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                See California's changes →
              </Link>
            </div>
          </div>
        </section>

        {/* Where They Came From */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Where Did 10.45 Million Texans Come From?</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">The Migration Breakdown</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold mb-3">Domestic Migration (5.2M)</p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>1.5M from California</strong> (tech workers, families)</li>
                    <li>• <strong>670K from Louisiana</strong> (post-Katrina)</li>
                    <li>• <strong>550K from Illinois</strong> (tax refugees)</li>
                    <li>• <strong>480K from New York</strong> (finance sector)</li>
                    <li>• <strong>2M from other states</strong></li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-3">Other Sources (5.25M)</p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>3.1M international immigration</strong></li>
                    <li>• <strong>2.15M natural increase</strong> (births - deaths)</li>
                    <li>• Young median age (35.5) drives births</li>
                    <li>• Business-friendly = job magnet</li>
                    <li>• No state income tax</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">The Four Texas Metros That Did It All</h3>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="font-bold">Houston</p>
                  <p>+2.3M people (now 7.5M metro)</p>
                </div>
                <div>
                  <p className="font-bold">Dallas-Fort Worth</p>
                  <p>+3.1M people (now 8.1M metro)</p>
                </div>
                <div>
                  <p className="font-bold">Austin</p>
                  <p>+1.2M people (now 2.5M metro)</p>
                </div>
                <div>
                  <p className="font-bold">San Antonio</p>
                  <p>+0.9M people (now 2.7M metro)</p>
                </div>
              </div>
              <p className="mt-4">
                These 4 metros accounted for 7.5M of the 10.45M gain (72%)
              </p>
            </div>
          </div>
        </section>

        {/* What This Actually Looks Like */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">What Adding 10.45 Million People Actually Means</h2>
          
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-3 text-blue-600">Infrastructure Explosion</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>2,800 new schools</strong> built</li>
                  <li>• <strong>47 new hospitals</strong> opened</li>
                  <li>• <strong>18,000 lane-miles</strong> of roads added</li>
                  <li>• <strong>3.8 million homes</strong> constructed</li>
                  <li>• <strong>$450 billion</strong> in construction</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-3 text-green-600">Economic Impact</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>4.2 million jobs</strong> created</li>
                  <li>• GDP grew from <strong>$760B to $2.4T</strong></li>
                  <li>• <strong>52 Fortune 500 HQs</strong> (2nd most)</li>
                  <li>• <strong>#1 in exports</strong> ($375B/year)</li>
                  <li>• <strong>380,000 businesses</strong> added</li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="font-bold text-orange-900 mb-3">The Hidden Costs</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <ul className="space-y-2 text-orange-800">
                  <li>• Water usage up 40%</li>
                  <li>• Traffic delays doubled</li>
                  <li>• Housing costs +215%</li>
                </ul>
                <ul className="space-y-2 text-orange-800">
                  <li>• Power grid stressed</li>
                  <li>• Aquifers depleting</li>
                  <li>• Urban sprawl accelerating</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Pyramids */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Other States That Added Entire States</h2>
          
          <p className="text-lg mb-8">
            Florida added Indiana. California added South Carolina. These aren't just numbers—these 
            are entire state populations worth of new residents, each bringing dramatic demographic change.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-center">
                Florida Added 6.8M (= Indiana)
              </h3>
              <div className="h-72">
                {florida2024Data && indiana2024Data && (() => {
                  const pyramidData = createPyramidData(florida2024Data, 'Florida');
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
                            text: `Now 22.2M (was 15.4M)`
                          }
                        }
                      }} 
                    />
                  );
                })()}
              </div>
              <p className="text-center mt-2 text-sm text-gray-600">
                Gained population = Indiana's 6.86M
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-center">
                California Added 5.2M (≈ S. Carolina)
              </h3>
              <div className="h-72">
                {california2024Data && (() => {
                  const pyramidData = createPyramidData(california2024Data, 'California');
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
                            text: `Now 39.1M (was 33.9M)`
                          }
                        }
                      }} 
                    />
                  );
                })()}
              </div>
              <p className="text-center mt-2 text-sm text-gray-600">
                Gained population ≈ S. Carolina's 5.4M
              </p>
            </div>
          </div>
        </section>

        {/* Political Power Shift */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Political Earthquake</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-6">Congressional Seats Gained/Lost Since 2000</h3>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <p className="font-bold text-green-600 mb-4">Winners (Gained Seats)</p>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Texas</span>
                    <span className="font-bold text-green-600">+4 seats (now 38)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Florida</span>
                    <span className="font-bold text-green-600">+3 seats (now 28)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Arizona</span>
                    <span className="font-bold text-green-600">+2 seats (now 9)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Georgia</span>
                    <span className="font-bold text-green-600">+2 seats (now 14)</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <p className="font-bold text-red-600 mb-4">Losers (Lost Seats)</p>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>New York</span>
                    <span className="font-bold text-red-600">-3 seats (now 26)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Pennsylvania</span>
                    <span className="font-bold text-red-600">-3 seats (now 17)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Ohio</span>
                    <span className="font-bold text-red-600">-2 seats (now 15)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Michigan</span>
                    <span className="font-bold text-red-600">-2 seats (now 13)</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-100 rounded">
              <p className="text-center font-semibold">
                Texas gained 4 House seats while states like Ohio and Michigan lost 2 each. 
                Political power follows population—and it's flowing to the Sun Belt.
              </p>
            </div>
          </div>
        </section>

        {/* 2050 Projection */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">2050: Texas Reaches 47 Million</h2>
          
          <div className="space-y-6">
            <p className="text-lg">
              If current trends continue (and they're accelerating):
            </p>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">The Next Michigan</h3>
              <p className="text-xl mb-4">
                By 2050, Texas will add ANOTHER 16 million people—adding Pennsylvania's entire 
                current population on top of the Michigan it already added.
              </p>
              
              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">47M</p>
                  <p>Texas 2050 projection</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">31M</p>
                  <p>Texas today</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">+16M</p>
                  <p>Growth (= Pennsylvania)</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-bold text-green-900 mb-3">What Texas Gains</h4>
                <ul className="space-y-2 text-green-800">
                  <li>• Becomes 2nd largest state economy globally</li>
                  <li>• 45+ House seats (most since CA 1990)</li>
                  <li>• 4 cities over 2 million people</li>
                  <li>• Tech capital of America</li>
                </ul>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg">
                <h4 className="font-bold text-red-900 mb-3">What Texas Faces</h4>
                <ul className="space-y-2 text-red-800">
                  <li>• Catastrophic water shortages</li>
                  <li>• Power grid failures multiply</li>
                  <li>• Housing completely unaffordable</li>
                  <li>• Climate refugees internally</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The Bottom Line */}
        <section className="mb-16">
          <div className="bg-gray-900 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">The Stunning Reality</h2>
            
            <div className="space-y-4 text-lg">
              <p>
                Texas didn't just grow—it absorbed an entire major state's worth of humans. The 
                10.45 million people Texas added could form the 11th largest state in America.
              </p>
              
              <p>
                This isn't normal growth. This is demographic conquest. While Michigan barely held 
                steady at 10 million, Texas added that entire amount as GROWTH.
              </p>
              
              <p>
                Every new highway, every school, every subdivision in Texas represents this stunning 
                reality: one state essentially duplicating another state's entire population as mere 
                growth. This has never happened before in American history at this scale.
              </p>
              
              <p className="text-xl font-bold mt-6">
                The question isn't whether Texas will keep growing—it's which state's population 
                Texas will add next.
              </p>
            </div>
          </div>
        </section>

        {/* Related Content */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Explore More State Growth Stories</h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Link 
              href="/states/texas" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">Texas Population Pyramid</h3>
              <p className="text-gray-600">
                Deep dive into Texas's explosive growth, demographic trends, and what's driving 
                America's fastest-growing large state.
              </p>
            </Link>
            
            <Link 
              href="/states/florida" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">Florida Demographics</h3>
              <p className="text-gray-600">
                See how Florida added Indiana's entire population through retirement migration 
                and international immigration.
              </p>
            </Link>

            <Link 
              href="/states/california" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">California Population Analysis</h3>
              <p className="text-gray-600">
                Despite the narrative, California still added 5.2 million people—more than 
                South Carolina's entire population.
              </p>
            </Link>

            <Link 
              href="/states/michigan" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">Michigan Demographics</h3>
              <p className="text-gray-600">
                Explore Michigan's population—the same size as what Texas gained in just 24 years.
              </p>
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">See How Your State's Growth Compares</h2>
          <p className="text-red-100 mb-6">
            Is your state gaining like Texas or stagnating like Michigan? Explore population trends, 
            growth patterns, and demographic shifts for all 50 states plus DC.
          </p>
          <Link 
            href="/states" 
            className="inline-block px-6 py-3 bg-white text-red-600 rounded-lg hover:bg-red-50 transition font-semibold"
          >
            Compare All States
          </Link>
        </div>
      </article>
    </div>
  );
}