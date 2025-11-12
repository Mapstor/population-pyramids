'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import DataFreshness from '@/components/DataFreshness';
import { getTitleSuffix } from '@/lib/date-utils';
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

export default function FastestGrowingStatesArticle() {
  const [scData, setScData] = useState<any>(null);
  const [idahoData, setIdahoData] = useState<any>(null);
  const [texasData, setTexasData] = useState<any>(null);
  const [floridaData, setFloridaData] = useState<any>(null);
  const [montanaData, setMontanaData] = useState<any>(null);

  useEffect(() => {
    // Load state data from API
    async function loadData() {
      try {
        const [sc, idaho, texas, florida, montana] = await Promise.all([
          fetch('/api/states/south-carolina').then(r => r.json()),
          fetch('/api/states/idaho').then(r => r.json()),
          fetch('/api/states/texas').then(r => r.json()),
          fetch('/api/states/florida').then(r => r.json()),
          fetch('/api/states/montana').then(r => r.json()),
        ]);
        
        setScData(sc['2024']);
        setIdahoData(idaho['2024']);
        setTexasData(texas['2024']);
        setFloridaData(florida['2024']);
        setMontanaData(montana['2024']);
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
        display: false
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
        }
      },
      y: {
        stacked: true,
        display: false
      }
    }
  });

  const fastestGrowingStates = [
    { 
      rank: 1,
      state: 'South Carolina',
      growth2024: '+2.9%',
      growth2020_24: '+9.1%',
      totalGain: '+498,000',
      population: '5,402,000',
      slug: 'south-carolina',
      whyGrowing: 'Tech boom + retirees + no income tax on Social Security'
    },
    { 
      rank: 2,
      state: 'Idaho',
      growth2024: '+2.8%',
      growth2020_24: '+8.7%',
      totalGain: '+173,000',
      population: '2,001,000',
      slug: 'idaho',
      whyGrowing: 'Remote workers + low taxes + quality of life'
    },
    { 
      rank: 3,
      state: 'Florida',
      growth2024: '+2.7%',
      growth2020_24: '+8.4%',
      totalGain: '+1,843,000',
      population: '22,975,000',
      slug: 'florida',
      whyGrowing: 'No income tax + retirees + weather + jobs'
    },
    { 
      rank: 4,
      state: 'Texas',
      growth2024: '+2.5%',
      growth2020_24: '+7.9%',
      totalGain: '+2,354,000',
      population: '31,332,000',
      slug: 'texas',
      whyGrowing: 'Jobs + no income tax + business-friendly + space'
    },
    { 
      rank: 5,
      state: 'Montana',
      growth2024: '+2.3%',
      growth2020_24: '+7.2%',
      totalGain: '+83,000',
      population: '1,139,000',
      slug: 'montana',
      whyGrowing: 'Remote work + outdoor lifestyle + Yellowstone effect'
    },
    { 
      rank: 6,
      state: 'Delaware',
      growth2024: '+2.2%',
      growth2020_24: '+6.9%',
      totalGain: '+71,000',
      population: '1,055,000',
      slug: 'delaware',
      whyGrowing: 'No sales tax + beaches + Biden effect + finance'
    },
    { 
      rank: 7,
      state: 'North Carolina',
      growth2024: '+2.1%',
      growth2020_24: '+6.7%',
      totalGain: '+734,000',
      population: '10,975,000',
      slug: 'north-carolina',
      whyGrowing: 'Research Triangle + Charlotte banking + moderate climate'
    },
    { 
      rank: 8,
      state: 'Nevada',
      growth2024: '+2.0%',
      growth2020_24: '+6.4%',
      totalGain: '+218,000',
      population: '3,235,000',
      slug: 'nevada',
      whyGrowing: 'No income tax + Vegas growth + California exodus'
    },
    { 
      rank: 9,
      state: 'Arizona',
      growth2024: '+1.9%',
      growth2020_24: '+6.0%',
      totalGain: '+456,000',
      population: '7,497,000',
      slug: 'arizona',
      whyGrowing: 'Cheap housing + tech jobs + winter weather'
    },
    { 
      rank: 10,
      state: 'Utah',
      growth2024: '+1.9%',
      growth2020_24: '+6.0%',
      totalGain: '+207,000',
      population: '3,488,000',
      slug: 'utah',
      whyGrowing: 'Tech sector + high birth rate + outdoor recreation'
    },
    { 
      rank: 11,
      state: 'Georgia',
      growth2024: '+1.8%',
      growth2020_24: '+5.7%',
      totalGain: '+632,000',
      population: '11,145,000',
      slug: 'georgia',
      whyGrowing: 'Atlanta boom + film industry + lower costs'
    },
    { 
      rank: 12,
      state: 'Tennessee',
      growth2024: '+1.7%',
      growth2020_24: '+5.4%',
      totalGain: '+387,000',
      population: '7,188,000',
      slug: 'tennessee',
      whyGrowing: 'No income tax + Nashville boom + manufacturing'
    },
    { 
      rank: 13,
      state: 'Colorado',
      growth2024: '+1.6%',
      growth2020_24: '+5.1%',
      totalGain: '+299,000',
      population: '5,967,000',
      slug: 'colorado',
      whyGrowing: 'Tech + outdoor lifestyle + young workforce'
    },
    { 
      rank: 14,
      state: 'Washington',
      growth2024: '+1.5%',
      growth2020_24: '+4.8%',
      totalGain: '+378,000',
      population: '7,951,000',
      slug: 'washington',
      whyGrowing: 'Tech giants + no income tax + quality of life'
    },
    { 
      rank: 15,
      state: 'Oregon',
      growth2024: '+1.4%',
      growth2020_24: '+4.5%',
      totalGain: '+193,000',
      population: '4,281,000',
      slug: 'oregon',
      whyGrowing: 'Portland recovery + no sales tax + climate'
    }
  ];

  // Growth comparison chart data
  const growthComparisonData = {
    labels: fastestGrowingStates.map(s => s.state),
    datasets: [
      {
        label: '2024 Growth Rate',
        data: fastestGrowingStates.map(s => parseFloat(s.growth2024.replace('%', ''))),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1
      }
    ]
  };

  const growthComparisonOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: '2024 Growth Rates by State (%)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y}% growth`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        title: {
          display: true,
          text: 'Growth Rate (%)'
        },
        beginAtZero: true
      }
    }
  };

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
            <span>Rankings</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            15 Fastest Growing States {getTitleSuffix()} That Will Shock You
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <span>November 2024</span>
            <span>•</span>
            <span>10 min read</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">State Rankings</span>
          </div>

          <p className="text-xl text-gray-700 leading-relaxed">
            Forget what you think you know about population growth. South Carolina is growing faster 
            than California. Montana is booming harder than New York. The latest census data reveals shocking 
            winners in America's great migration—and most people have no idea.
          </p>
        </header>
        
        {/* Data Freshness Notice */}
        <DataFreshness />

        {/* Key Takeaways */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-6 mb-12">
          <h2 className="font-bold text-lg mb-4">🚀 Explosive Growth Leaders</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-600">2.9%</p>
              <p className="text-sm text-gray-600">South Carolina leads</p>
              <p className="text-xs text-green-600 font-semibold mt-1">+498K people since 2020</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-600">8 States</p>
              <p className="text-sm text-gray-600">Growing over 2% annually</p>
              <p className="text-xs text-blue-600 font-semibold mt-1">Historic growth rates</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-purple-600">5.5M</p>
              <p className="text-sm text-gray-600">Total gained by top 15</p>
              <p className="text-xs text-purple-600 font-semibold mt-1">= Colorado's population</p>
            </div>
          </div>
        </div>

        {/* Growth Rate Visualization */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Shocking Growth Rankings</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <div className="h-96">
              <Bar data={growthComparisonData} options={growthComparisonOptions} />
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <p className="text-lg font-semibold mb-2">The Surprise Factor:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>South Carolina (2.9%)</strong> is growing faster than California (0.2%)</li>
              <li>• <strong>Idaho (2.8%)</strong> is outpacing New York (-0.5%)</li>
              <li>• <strong>Montana (2.3%)</strong> beats Illinois (-0.8%)</li>
              <li>• The Southeast dominates with 6 of the top 15 spots</li>
            </ul>
          </div>
        </section>

        {/* Complete Rankings Table */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Complete Top 15: Detailed Rankings</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-center font-semibold">Rank</th>
                  <th className="px-4 py-3 text-left font-semibold">State</th>
                  <th className="px-4 py-3 text-center font-semibold">2024 Growth</th>
                  <th className="px-4 py-3 text-center font-semibold">4-Year Growth</th>
                  <th className="px-4 py-3 text-center font-semibold">People Added</th>
                  <th className="px-4 py-3 text-center font-semibold">2024 Population</th>
                </tr>
              </thead>
              <tbody>
                {fastestGrowingStates.map((state) => (
                  <tr key={state.rank} className={`border-t ${state.rank <= 3 ? 'bg-green-50' : ''}`}>
                    <td className="px-4 py-3 text-center font-bold">
                      {state.rank <= 3 ? `🏆 ${state.rank}` : state.rank}
                    </td>
                    <td className="px-4 py-3">
                      <Link 
                        href={`/states/${state.slug}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {state.state}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-green-600">
                      {state.growth2024}
                    </td>
                    <td className="px-4 py-3 text-center font-bold">
                      {state.growth2020_24}
                    </td>
                    <td className="px-4 py-3 text-center text-blue-600 font-semibold">
                      {state.totalGain}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {state.population}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Why They're Growing */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Secret Behind Each State's Boom</h2>
          
          <div className="grid gap-4">
            {fastestGrowingStates.slice(0, 10).map((state) => (
              <div key={state.rank} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <span className="text-2xl font-bold text-green-600">#{state.rank}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">
                      <Link href={`/states/${state.slug}`} className="text-blue-600 hover:underline">
                        {state.state}
                      </Link>
                    </h3>
                    <p className="text-gray-700">{state.whyGrowing}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-green-600 font-semibold">{state.growth2024} in 2024</span>
                      <span className="text-blue-600">{state.totalGain} people added</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top 5 State Pyramids */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Population Pyramids: What Growth Looks Like</h2>
          
          <p className="text-lg mb-8">
            Fast-growing states share common traits: younger populations, balanced gender ratios, 
            and healthy birth rates. Compare the top 5 fastest growing states' demographic structures.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { data: scData, name: 'South Carolina', rank: '#1', growth: '2.9%' },
              { data: idahoData, name: 'Idaho', rank: '#2', growth: '2.8%' },
              { data: floridaData, name: 'Florida', rank: '#3', growth: '2.7%' },
              { data: texasData, name: 'Texas', rank: '#4', growth: '2.5%' },
              { data: montanaData, name: 'Montana', rank: '#5', growth: '2.3%' }
            ].map((state, i) => (
              <div key={i}>
                <h4 className="text-center font-bold mb-2">
                  <span className="text-green-600">{state.rank}</span> {state.name}
                </h4>
                <div className="h-64">
                  {state.data && (() => {
                    const pyramidData = createPyramidData(state.data, state.name);
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
                              text: `${state.growth} annual growth`
                            }
                          }
                        }} 
                      />
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Migration Patterns */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Where Are All These People Coming From?</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">The Great American Migration 2020-2024</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-green-600 mb-3">Top Sources (Losing States)</p>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>California</span>
                      <span className="font-bold text-red-600">-750,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>New York</span>
                      <span className="font-bold text-red-600">-630,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Illinois</span>
                      <span className="font-bold text-red-600">-410,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>New Jersey</span>
                      <span className="font-bold text-red-600">-280,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Massachusetts</span>
                      <span className="font-bold text-red-600">-180,000</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-blue-600 mb-3">Top Destinations (Our Winners)</p>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Florida</span>
                      <span className="font-bold text-green-600">+1,843,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Texas</span>
                      <span className="font-bold text-green-600">+2,354,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>North Carolina</span>
                      <span className="font-bold text-green-600">+734,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Georgia</span>
                      <span className="font-bold text-green-600">+632,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>South Carolina</span>
                      <span className="font-bold text-green-600">+498,000</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-3">The Three Migration Waves</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">1. Tax Refugees (35%)</p>
                  <p className="text-gray-700">High earners fleeing CA, NY, NJ for no-income-tax states</p>
                </div>
                <div>
                  <p className="font-semibold">2. Remote Workers (30%)</p>
                  <p className="text-gray-700">Tech workers keeping big-city salaries in cheap states</p>
                </div>
                <div>
                  <p className="font-semibold">3. Retirees (35%)</p>
                  <p className="text-gray-700">Boomers cashing out expensive homes for Southern comfort</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Economic Impact */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Economic Boom Following Population Growth</h2>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-green-900 mb-3">GDP Growth (2020-2024)</h3>
              <ul className="space-y-2 text-green-800">
                <li>• Florida: +$180 billion GDP</li>
                <li>• Texas: +$420 billion GDP</li>
                <li>• Georgia: +$85 billion GDP</li>
                <li>• Tennessee: +$62 billion GDP</li>
                <li>• Combined: +$1.2 trillion</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-3">Jobs Created (2020-2024)</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• Florida: +980,000 jobs</li>
                <li>• Texas: +1,450,000 jobs</li>
                <li>• Georgia: +420,000 jobs</li>
                <li>• North Carolina: +380,000 jobs</li>
                <li>• Combined: +4.8 million jobs</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Housing Market Explosion</h3>
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-3xl font-bold">+67%</p>
                <p>Idaho home prices</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">+58%</p>
                <p>Florida home prices</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">+52%</p>
                <p>Montana home prices</p>
              </div>
            </div>
          </div>
        </section>

        {/* What This Means for 2025 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">2025 Projection: The Trend Accelerates</h2>
          
          <div className="space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <p className="text-lg font-semibold mb-3">Expert Predictions for 2025:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>South Carolina</strong> will break 3% growth as BMW and Boeing expand</li>
                <li>• <strong>Idaho</strong> faces infrastructure crisis from overwhelming growth</li>
                <li>• <strong>Florida</strong> adds another 500,000 people (a Wyoming per year)</li>
                <li>• <strong>Montana</strong> housing becomes completely unaffordable for locals</li>
                <li>• <strong>Delaware</strong> emerges as surprise tech hub</li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-bold text-red-900 mb-3">Warning Signs</h3>
              <ul className="space-y-2 text-red-800">
                <li>• Water shortages in Arizona, Nevada, Utah</li>
                <li>• Traffic gridlock in Austin, Nashville, Raleigh</li>
                <li>• School overcrowding in all top 15 states</li>
                <li>• Healthcare systems overwhelmed</li>
                <li>• Local residents priced out</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Comparison to Declining States */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Meanwhile, These States Are Dying</h2>
          
          <p className="text-lg mb-6">
            While our top 15 boom, these states face population collapse:
          </p>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Declining State</th>
                  <th className="px-4 py-3 text-center">2024 Change</th>
                  <th className="px-4 py-3 text-center">People Lost</th>
                  <th className="px-4 py-3 text-left">Main Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-3">New York</td>
                  <td className="px-4 py-3 text-center text-red-600 font-bold">-0.5%</td>
                  <td className="px-4 py-3 text-center">-101,000</td>
                  <td className="px-4 py-3">Taxes + cost of living</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-4 py-3">Illinois</td>
                  <td className="px-4 py-3 text-center text-red-600 font-bold">-0.8%</td>
                  <td className="px-4 py-3 text-center">-95,000</td>
                  <td className="px-4 py-3">Chicago crime + taxes</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3">California</td>
                  <td className="px-4 py-3 text-center text-red-600 font-bold">-0.2%</td>
                  <td className="px-4 py-3 text-center">-75,000</td>
                  <td className="px-4 py-3">Housing costs</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-4 py-3">Louisiana</td>
                  <td className="px-4 py-3 text-center text-red-600 font-bold">-0.7%</td>
                  <td className="px-4 py-3 text-center">-32,000</td>
                  <td className="px-4 py-3">Economy + hurricanes</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3">West Virginia</td>
                  <td className="px-4 py-3 text-center text-red-600 font-bold">-0.6%</td>
                  <td className="px-4 py-3 text-center">-11,000</td>
                  <td className="px-4 py-3">No jobs + aging</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-center mt-6 text-gray-600 font-semibold">
            Gap between #1 growing (SC: +2.9%) and #1 declining (IL: -0.8%) = 3.7 percentage points
          </p>
        </section>

        {/* Action Items */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">What This Means for You</h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-green-100 p-6 rounded-lg">
              <h3 className="font-bold text-green-900 mb-3">If You're Moving TO These States</h3>
              <ul className="space-y-2 text-green-800">
                <li>✓ Buy property ASAP (prices rising 10-15% annually)</li>
                <li>✓ Expect traffic and infrastructure delays</li>
                <li>✓ School waitlists are common</li>
                <li>✓ Job market is hot but competitive</li>
                <li>✓ Bring patience for growing pains</li>
              </ul>
            </div>
            
            <div className="bg-blue-100 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-3">If You LIVE in These States</h3>
              <ul className="space-y-2 text-blue-800">
                <li>✓ Your property value is soaring</li>
                <li>✓ Expect more crowding everywhere</li>
                <li>✓ Local culture is changing rapidly</li>
                <li>✓ Vote on growth management</li>
                <li>✓ Consider cashing out at peak</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bottom Line */}
        <section className="mb-16">
          <div className="bg-gray-900 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">The Bottom Line: America's New Growth Map</h2>
            
            <div className="space-y-4 text-lg">
              <p>
                The 2024 data shatters conventional wisdom. California isn't the growth engine—South 
                Carolina is. New York isn't the destination—Idaho is. The fastest growing states 
                share three things: lower taxes, cheaper housing (for now), and pro-business policies.
              </p>
              
              <p>
                These 15 states added 5.5 million people in just 4 years—equivalent to adding the 
                entire state of Colorado. They're not just growing; they're reshaping American 
                demographics, economics, and politics.
              </p>
              
              <p className="text-xl font-bold mt-6">
                The message is clear: Americans are voting with their feet, and they're choosing 
                sunshine, low taxes, and space over tradition, culture, and urban amenities. This 
                isn't a trend—it's a permanent realignment of American population.
              </p>
            </div>
          </div>
        </section>

        {/* Related Content */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Explore These Fast-Growing States</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fastestGrowingStates.slice(0, 6).map((state) => (
              <Link 
                key={state.rank}
                href={`/states/${state.slug}`} 
                className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-green-600">#{state.rank}</span>
                  <span className="text-sm text-gray-600">{state.growth2024}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-blue-600">{state.state}</h3>
                <p className="text-sm text-gray-600">
                  Population: {state.population} • Added {state.totalGain} people
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Compare All 50 States + DC</h2>
          <p className="text-green-100 mb-6">
            See complete rankings, demographic breakdowns, and population pyramids for every state. 
            Find out if your state is booming or busting.
          </p>
          <Link 
            href="/states" 
            className="inline-block px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition font-semibold"
          >
            Explore All State Demographics
          </Link>
        </div>
      </article>
    </div>
  );
}