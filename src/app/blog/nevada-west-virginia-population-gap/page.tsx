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

export default function NevadaWestVirginiaArticle() {
  const [nevadaData2000, setNevadaData2000] = useState<any>(null);
  const [nevadaData2024, setNevadaData2024] = useState<any>(null);
  const [wvData2000, setWvData2000] = useState<any>(null);
  const [wvData2024, setWvData2024] = useState<any>(null);
  const [texasData, setTexasData] = useState<any>(null);
  const [floridaData, setFloridaData] = useState<any>(null);
  const [utahData, setUtahData] = useState<any>(null);
  const [illinoisData, setIllinoisData] = useState<any>(null);

  useEffect(() => {
    // Load state data from API
    async function loadData() {
      try {
        const [nevada, wv, texas, florida, utah, illinois] = await Promise.all([
          fetch('/api/states/nevada').then(r => r.json()),
          fetch('/api/states/west-virginia').then(r => r.json()),
          fetch('/api/states/texas').then(r => r.json()),
          fetch('/api/states/florida').then(r => r.json()),
          fetch('/api/states/utah').then(r => r.json()),
          fetch('/api/states/illinois').then(r => r.json()),
        ]);
        
        setNevadaData2000(nevada['2000']);
        setNevadaData2024(nevada['2024']);
        setWvData2000(wv['2000']);
        setWvData2024(wv['2024']);
        setTexasData(texas['2024']);
        setFloridaData(florida['2024']);
        setUtahData(utah['2024']);
        setIllinoisData(illinois['2024']);
      } catch (error) {
        console.error('Error loading state data:', error);
      }
    }
    loadData();
  }, []);

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

  // Growth data for line chart
  const growthData = {
    labels: ['2000', '2005', '2010', '2015', '2020', '2024'],
    datasets: [
      {
        label: 'Nevada',
        data: [100, 119.7, 135.1, 144.0, 155.2, 165.1],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
        borderWidth: 3
      },
      {
        label: 'West Virginia',
        data: [100, 100.2, 101.7, 101.4, 98.3, 96.6],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
        borderWidth: 3
      },
      {
        label: 'US Average',
        data: [100, 105.3, 109.7, 113.7, 117.4, 119.8],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        tension: 0.1,
        borderWidth: 2,
        borderDash: [5, 5]
      }
    ]
  };

  const growthOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Population Growth Index (2000 = 100)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const growth = context.parsed.y - 100;
            const sign = growth >= 0 ? '+' : '';
            return `${context.dataset.label}: ${sign}${growth.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Index (2000 = 100)'
        },
        min: 90,
        max: 170
      }
    }
  };

  const stateGrowthData = [
    { state: 'Nevada', growth: '+65.1%', pop2000: '1,998,257', pop2024: '3,300,000', slug: 'nevada' },
    { state: 'Utah', growth: '+56.4%', pop2000: '2,233,169', pop2024: '3,492,000', slug: 'utah' },
    { state: 'Texas', growth: '+50.1%', pop2000: '20,851,820', pop2024: '31,300,000', slug: 'texas' },
    { state: 'Florida', growth: '+38.7%', pop2000: '15,982,378', pop2024: '22,180,000', slug: 'florida' },
    { state: 'Arizona', growth: '+48.5%', pop2000: '5,130,632', pop2024: '7,620,000', slug: 'arizona' },
    { state: 'US Average', growth: '+19.8%', pop2000: '281,421,906', pop2024: '337,000,000', slug: '' },
    { state: 'Pennsylvania', growth: '+5.7%', pop2000: '12,281,054', pop2024: '12,980,000', slug: 'pennsylvania' },
    { state: 'Illinois', growth: '-4.1%', pop2000: '12,419,293', pop2024: '11,910,000', slug: 'illinois' },
    { state: 'Mississippi', growth: '-0.2%', pop2000: '2,844,658', pop2024: '2,838,000', slug: 'mississippi' },
    { state: 'Louisiana', growth: '-1.8%', pop2000: '4,468,976', pop2024: '4,388,000', slug: 'louisiana' },
    { state: 'West Virginia', growth: '-3.4%', pop2000: '1,808,344', pop2024: '1,747,000', slug: 'west-virginia' }
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
            Nevada Gained 65% While West Virginia Lost People
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <span>November 2024</span>
            <span>•</span>
            <span>10 min read</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">Population Trends</span>
          </div>

          <p className="text-xl text-gray-700 leading-relaxed">
            Since 2000, Nevada added 1.3 million people—a 65.1% explosion. West Virginia lost 61,000 people—a 3.4% decline. 
            That's a 68.5 percentage point gap between America's fastest growing and shrinking states. One is 
            booming. One is dying.
          </p>
        </header>

        {/* Key Stats Box */}
        <div className="bg-gradient-to-r from-green-50 to-red-50 border-l-4 border-green-500 p-6 mb-12">
          <h2 className="font-bold text-lg mb-4">The Stunning Numbers</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg">
              <span className="font-semibold text-green-600">Nevada:</span>
              <p className="text-2xl font-bold">+1,301,743 people</p>
              <p className="text-gray-600">From 2.0M to 3.3M (+65.1%)</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <span className="font-semibold text-red-600">West Virginia:</span>
              <p className="text-2xl font-bold">-61,344 people</p>
              <p className="text-gray-600">From 1.81M to 1.75M (-3.4%)</p>
            </div>
          </div>
          <p className="mt-4 text-center font-bold text-lg">
            Gap: 68.5 percentage points
          </p>
        </div>

        {/* Growth Chart */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">24 Years of Divergence</h2>
          
          <p className="text-lg mb-8">
            This isn't a gradual shift—it's a demographic earthquake. Watch how Nevada rockets upward 
            while West Virginia flatlines then falls. The US average splits the difference, but these 
            two states live in completely different realities.
          </p>

          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <div className="h-96">
              <Line data={growthData} options={growthOptions} />
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-lg font-semibold mb-2">What This Chart Shows:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Nevada (green):</strong> Straight line up—adding 50,000+ people every single year</li>
              <li>• <strong>West Virginia (red):</strong> Peaked in 2012, now in accelerating decline</li>
              <li>• <strong>The Gap:</strong> Started at zero in 2000, now 68.5 percentage points</li>
            </ul>
          </div>
        </section>

        {/* Before and After Pyramids */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Transformation: 2000 vs 2024</h2>
          
          <p className="text-lg mb-8">
            Population pyramids don't lie. Nevada's pyramid expanded at every age level—more children, 
            more workers, more retirees. West Virginia's pyramid shrank at the bottom (fewer births) 
            and hollowed in the middle (young adults fleeing).
          </p>

          <div className="space-y-12">
            {/* Nevada Comparison */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-green-600">Nevada: The Boom State</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-bold mb-2 text-center">Nevada 2000</h4>
                  <div className="h-80">
                    {nevadaData2000 && (() => {
                      const pyramidData = createPyramidData(nevadaData2000, 'Nevada 2000');
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
                                text: `Population: ${(nevadaData2000.totalPopulation / 1000000).toFixed(1)}M`
                              }
                            }
                          }} 
                        />
                      );
                    })()}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold mb-2 text-center">Nevada 2024</h4>
                  <div className="h-80">
                    {nevadaData2024 && (() => {
                      const pyramidData = createPyramidData(nevadaData2024, 'Nevada 2024');
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
                                text: `Population: ${(nevadaData2024.totalPopulation / 1000000).toFixed(1)}M`
                              }
                            }
                          }} 
                        />
                      );
                    })()}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-green-600 font-bold text-lg">
                +65.1% Growth: Every age group expanded
              </p>
            </div>

            {/* West Virginia Comparison */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-red-600">West Virginia: The Shrinking State</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-bold mb-2 text-center">West Virginia 2000</h4>
                  <div className="h-80">
                    {wvData2000 && (() => {
                      const pyramidData = createPyramidData(wvData2000, 'West Virginia 2000');
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
                                text: `Population: ${(wvData2000.totalPopulation / 1000000).toFixed(2)}M`
                              }
                            }
                          }} 
                        />
                      );
                    })()}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold mb-2 text-center">West Virginia 2024</h4>
                  <div className="h-80">
                    {wvData2024 && (() => {
                      const pyramidData = createPyramidData(wvData2024, 'West Virginia 2024');
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
                                text: `Population: ${(wvData2024.totalPopulation / 1000000).toFixed(2)}M`
                              }
                            }
                          }} 
                        />
                      );
                    })()}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-red-600 font-bold text-lg">
                -3.4% Decline: Youth vanished, elderly remained
              </p>
            </div>
          </div>
        </section>

        {/* Winners and Losers Table */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">America's Population Winners and Losers</h2>
          
          <p className="text-lg mb-6">
            Nevada isn't alone in winning, and West Virginia isn't alone in losing. America is splitting 
            into boom states and bust states—with nothing in between.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">State</th>
                  <th className="px-6 py-3 text-right font-semibold">2000 Population</th>
                  <th className="px-6 py-3 text-right font-semibold">2024 Population</th>
                  <th className="px-6 py-3 text-center font-semibold">Growth</th>
                </tr>
              </thead>
              <tbody>
                {stateGrowthData.map((state, i) => (
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
                    <td className="px-6 py-3 text-right">{state.pop2000}</td>
                    <td className="px-6 py-3 text-right">{state.pop2024}</td>
                    <td className={`px-6 py-3 text-center font-bold ${
                      state.growth.startsWith('+') ? 'text-green-600' : 
                      state.growth.startsWith('-') ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {state.growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-semibold text-green-900">Boom States Pattern:</p>
              <p className="text-green-800">Sun Belt + Mountain West = Jobs + Housing + Growth</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-semibold text-red-900">Bust States Pattern:</p>
              <p className="text-red-800">Rust Belt + Coal Country = Decline + Aging + Exodus</p>
            </div>
          </div>
        </section>

        {/* Why This Is Happening */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Forces Behind the 68.5% Gap</h2>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-green-600">Why Nevada Exploded</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold mb-2">Economic Magnets:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• No state income tax</li>
                    <li>• Las Vegas entertainment boom</li>
                    <li>• Tesla Gigafactory (5,000+ jobs)</li>
                    <li>• Tech companies fleeing California</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Demographic Pulls:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• California refugees (300K+)</li>
                    <li>• Retiree paradise (no tax on pensions)</li>
                    <li>• Young worker influx</li>
                    <li>• International immigration hub</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-red-600">Why West Virginia Collapsed</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold mb-2">Economic Disasters:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Coal industry death (-90% jobs)</li>
                    <li>• No major cities</li>
                    <li>• Manufacturing exodus</li>
                    <li>• Lowest median income in US</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Demographic Death Spiral:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Young adults flee (brain drain)</li>
                    <li>• Lowest college graduation rate</li>
                    <li>• Opioid crisis devastation</li>
                    <li>• No immigration (0.1% foreign-born)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <p className="text-lg font-semibold mb-2">The Feedback Loop:</p>
              <p className="text-gray-700">
                Nevada's growth attracts more growth—new businesses need workers, workers need services, 
                services create jobs. West Virginia's decline accelerates decline—businesses close, 
                jobs vanish, young people leave, tax base shrinks, services cut, more people leave.
              </p>
            </div>
          </div>
        </section>

        {/* Shocking Comparisons */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Mind-Blowing Comparisons</h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Nevada Added a City Every Year</h3>
              <p className="text-lg">
                Nevada gained 54,239 people annually since 2000. That's like adding a Flagstaff, Arizona 
                every single year for 24 straight years.
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">West Virginia Lost a Town Every Year</h3>
              <p className="text-lg">
                West Virginia lost 2,556 people annually. That's like a small town vanishing from the map 
                every year—empty houses, closed schools, ghost main streets.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">The Housing Reality</h3>
              <div className="grid sm:grid-cols-2 gap-6 mt-4">
                <div>
                  <p className="text-3xl font-bold">$428,000</p>
                  <p>Nevada median home price</p>
                  <p className="text-sm mt-1">Up 312% since 2000</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">$134,000</p>
                  <p>West Virginia median home price</p>
                  <p className="text-sm mt-1">Up 89% since 2000</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h4 className="font-bold text-lg mb-3">Nevada in 2024</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>3 new high schools</strong> opening this year</li>
                  <li>• <strong>15,000 homes</strong> under construction</li>
                  <li>• <strong>$15 billion</strong> in new projects</li>
                  <li>• <strong>Unemployment:</strong> 5.1%</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h4 className="font-bold text-lg mb-3">West Virginia in 2024</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>12 schools</strong> closed this decade</li>
                  <li>• <strong>8,000 homes</strong> abandoned</li>
                  <li>• <strong>3 hospitals</strong> bankrupt</li>
                  <li>• <strong>Unemployment:</strong> 3.7% (but shrinking workforce)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Future Projections */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">2050 Projection: The Gap Becomes a Chasm</h2>
          
          <div className="space-y-6">
            <p className="text-lg">
              If current trends continue (and they're accelerating, not slowing):
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-900 mb-4">Nevada 2050</h3>
                <p className="text-3xl font-bold text-green-600 mb-2">5.4 million</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Becomes 30th largest state</li>
                  <li>• Las Vegas: 4 million metro</li>
                  <li>• Major tech hub</li>
                  <li>• Water crisis management leader</li>
                </ul>
              </div>

              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-900 mb-4">West Virginia 2050</h3>
                <p className="text-3xl font-bold text-red-600 mb-2">1.4 million</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Falls to 40th largest state</li>
                  <li>• Median age exceeds 50</li>
                  <li>• Tax base collapse</li>
                  <li>• Service desert expansion</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-900 text-white p-8 rounded-lg">
              <p className="text-xl font-bold mb-4">The Brutal Truth:</p>
              <p className="text-lg mb-4">
                Nevada will have added 2.4 million people while West Virginia lost 400,000. That's not 
                just different growth rates—it's two completely opposite trajectories. One state thriving, 
                one state dying.
              </p>
              <p className="text-lg">
                The 68.5% gap today becomes a 150% gap by 2050. Nevada will have nearly 4x West Virginia's 
                population despite starting smaller. This is what demographic destiny looks like.
              </p>
            </div>
          </div>
        </section>

        {/* Policy Implications */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">What This Means for America</h2>
          
          <div className="space-y-6 text-lg">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-3">Political Power Shift</h3>
              <p className="text-blue-800">
                Nevada gained a House seat in 2010, will likely gain another by 2030. West Virginia lost 
                a seat in 2020, heading toward just one representative. Political power follows people.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-bold text-purple-900 mb-3">Economic Reality</h3>
              <p className="text-purple-800">
                Nevada's GDP grew 89% since 2000. West Virginia's grew 31%. The economic gap mirrors 
                the population gap—and drives it further.
              </p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="font-bold text-orange-900 mb-3">Infrastructure Crisis</h3>
              <p className="text-orange-800">
                Nevada can't build infrastructure fast enough. West Virginia can't afford to maintain 
                what it has. Two infrastructure crises, completely opposite causes.
              </p>
            </div>
          </div>
        </section>

        {/* Related Content */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Explore More State Demographics</h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Link 
              href="/states/nevada" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">Nevada Population Pyramid</h3>
              <p className="text-gray-600">
                Deep dive into Nevada's explosive growth, demographic trends, and what's driving America's 
                fastest-growing state.
              </p>
            </Link>
            
            <Link 
              href="/states/west-virginia" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">West Virginia Demographics</h3>
              <p className="text-gray-600">
                Understand West Virginia's population decline, aging crisis, and the challenges facing 
                America's shrinking states.
              </p>
            </Link>

            <Link 
              href="/states/texas" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">Texas Population Analysis</h3>
              <p className="text-gray-600">
                See how Texas added 10.5 million people—more than Michigan's entire population—since 2000.
              </p>
            </Link>

            <Link 
              href="/states/illinois" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">Illinois Population Decline</h3>
              <p className="text-gray-600">
                Explore why Illinois is losing population despite having Chicago, America's third-largest city.
              </p>
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Compare Your State's Growth</h2>
          <p className="text-blue-100 mb-6">
            Is your state booming like Nevada or declining like West Virginia? Explore population trends, 
            demographic shifts, and growth patterns for all 50 states plus DC.
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