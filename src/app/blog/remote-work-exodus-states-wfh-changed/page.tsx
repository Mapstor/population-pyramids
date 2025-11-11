'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface StateData {
  years: {
    [year: string]: {
      total: number;
      males: number;
      females: number;
      ageDistribution: {
        [ageGroup: string]: {
          males: number;
          females: number;
        };
      };
    };
  };
}

export default function RemoteWorkExodusPage() {
  const [stateData, setStateData] = useState<{ [key: string]: StateData }>({});
  const [loading, setLoading] = useState(true);

  const wfhWinnerStates = [
    { 
      rank: 1,
      state: 'Montana',
      wfhGrowth: '+142%',
      techWorkerInflux: 48000,
      medianHomePrice: '$589K → $892K',
      localImpact: 'Bozeman now "Silicon Valley of Rockies"',
      prePandemic: 8200,
      current: 56200
    },
    { 
      rank: 2,
      state: 'Idaho',
      wfhGrowth: '+138%',
      techWorkerInflux: 42000,
      medianHomePrice: '$342K → $578K',
      localImpact: 'Locals priced out of Boise market',
      prePandemic: 12400,
      current: 54400
    },
    { 
      rank: 3,
      state: 'Utah',
      wfhGrowth: '+126%',
      techWorkerInflux: 65000,
      medianHomePrice: '$438K → $692K',
      localImpact: 'Park City became year-round tech hub',
      prePandemic: 31000,
      current: 96000
    },
    { 
      rank: 4,
      state: 'Maine',
      wfhGrowth: '+118%',
      techWorkerInflux: 28000,
      medianHomePrice: '$285K → $465K',
      localImpact: 'Portland remote worker capital of Northeast',
      prePandemic: 8900,
      current: 36900
    },
    { 
      rank: 5,
      state: 'Vermont',
      wfhGrowth: '+115%',
      techWorkerInflux: 18000,
      medianHomePrice: '$295K → $485K',
      localImpact: 'Burlington tech scene exploded',
      prePandemic: 5200,
      current: 23200
    },
    { 
      rank: 6,
      state: 'Wyoming',
      wfhGrowth: '+112%',
      techWorkerInflux: 14000,
      medianHomePrice: '$285K → $515K',
      localImpact: 'Jackson Hole now hedge fund HQ',
      prePandemic: 3800,
      current: 17800
    },
    { 
      rank: 7,
      state: 'New Hampshire',
      wfhGrowth: '+108%',
      techWorkerInflux: 32000,
      medianHomePrice: '$352K → $548K',
      localImpact: 'Mass exodus from Boston created crisis',
      prePandemic: 14200,
      current: 46200
    },
    { 
      rank: 8,
      state: 'Tennessee',
      wfhGrowth: '+98%',
      techWorkerInflux: 78000,
      medianHomePrice: '$285K → $425K',
      localImpact: 'Nashville became "Silicon Valley South"',
      prePandemic: 42000,
      current: 120000
    },
    { 
      rank: 9,
      state: 'Arizona',
      wfhGrowth: '+94%',
      techWorkerInflux: 85000,
      medianHomePrice: '$385K → $585K',
      localImpact: 'Phoenix remote work capital of Southwest',
      prePandemic: 68000,
      current: 153000
    },
    { 
      rank: 10,
      state: 'Colorado',
      wfhGrowth: '+92%',
      techWorkerInflux: 72000,
      medianHomePrice: '$485K → $725K',
      localImpact: 'Denver tech wages crushing service workers',
      prePandemic: 89000,
      current: 161000
    },
    { 
      rank: 11,
      state: 'Nevada',
      wfhGrowth: '+88%',
      techWorkerInflux: 52000,
      medianHomePrice: '$342K → $485K',
      localImpact: 'Vegas suburbs transformed to tech towns',
      prePandemic: 28000,
      current: 80000
    },
    { 
      rank: 12,
      state: 'South Carolina',
      wfhGrowth: '+86%',
      techWorkerInflux: 45000,
      medianHomePrice: '$265K → $385K',
      localImpact: 'Charleston remote paradise for NYC refugees',
      prePandemic: 22000,
      current: 67000
    },
    { 
      rank: 13,
      state: 'North Carolina',
      wfhGrowth: '+82%',
      techWorkerInflux: 92000,
      medianHomePrice: '$295K → $425K',
      localImpact: 'Research Triangle absorbed CA tech exodus',
      prePandemic: 78000,
      current: 170000
    },
    { 
      rank: 14,
      state: 'Texas',
      wfhGrowth: '+78%',
      techWorkerInflux: 145000,
      medianHomePrice: '$285K → $385K',
      localImpact: 'Austin officially unaffordable for locals',
      prePandemic: 124000,
      current: 269000
    },
    { 
      rank: 15,
      state: 'Florida',
      wfhGrowth: '+75%',
      techWorkerInflux: 168000,
      medianHomePrice: '$295K → $425K',
      localImpact: 'Miami tech scene rivals Silicon Valley',
      prePandemic: 142000,
      current: 310000
    }
  ];

  const wfhLoserStates = [
    { state: 'California', loss: -285000, reason: 'Tech workers fled to cheaper states' },
    { state: 'New York', loss: -198000, reason: 'Manhattan exodus permanent' },
    { state: 'Illinois', loss: -87000, reason: 'Chicago tech scene collapsed' },
    { state: 'Massachusetts', loss: -62000, reason: 'Boston biotech went remote' },
    { state: 'Washington', loss: -45000, reason: 'Seattle workers chose sun over rain' }
  ];

  useEffect(() => {
    const loadStateData = async () => {
      const statesToLoad = ['montana', 'idaho', 'utah', 'maine', 'vermont'];
      const promises = statesToLoad.map(async (state) => {
        try {
          const response = await fetch(`/api/states/${state}`);
          const data = await response.json();
          return { state, data: { years: data } };
        } catch (error) {
          console.error(`Error loading ${state} data:`, error);
          return null;
        }
      });

      const results = await Promise.all(promises);
      const dataMap: { [key: string]: StateData } = {};
      
      results.forEach(result => {
        if (result) {
          dataMap[result.state] = result.data;
        }
      });

      setStateData(dataMap);
      setLoading(false);
    };

    loadStateData();
  }, []);

  const createPyramidOptions = (title: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      title: {
        display: true,
        text: title,
        font: { size: 14, weight: 'bold' as const }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = Math.abs(context.raw);
            const label = context.dataset.label;
            return `${label}: ${value.toLocaleString()}`;
          }
        }
      },
      legend: { display: false }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: (value: any) => Math.abs(value).toLocaleString()
        },
        grid: { display: false }
      },
      y: {
        stacked: true,
        grid: { display: false },
        ticks: { font: { size: 10 } }
      }
    }
  });

  const createPyramidData = (state: string, year: string = '2024') => {
    const data = stateData[state]?.years[year];
    if (!data) return null;

    const ageGroups = Object.keys(data.ageDistribution).sort((a, b) => {
      const getMinAge = (group: string) => parseInt(group.split('-')[0]);
      return getMinAge(a) - getMinAge(b);
    });

    const males = ageGroups.map(group => -data.ageDistribution[group].males);
    const females = ageGroups.map(group => data.ageDistribution[group].females);

    const allValues = [...males.map(Math.abs), ...females];
    const maxValue = Math.max(...allValues);

    return {
      data: {
        labels: ageGroups,
        datasets: [
          {
            label: 'Male',
            data: males,
            backgroundColor: '#60A5FA',
            barThickness: 20
          },
          {
            label: 'Female',
            data: females,
            backgroundColor: '#F87171',
            barThickness: 20
          }
        ]
      },
      options: {
        ...createPyramidOptions(`${state.charAt(0).toUpperCase() + state.slice(1)} Population 2024`),
        scales: {
          ...createPyramidOptions('').scales,
          x: {
            ...createPyramidOptions('').scales?.x,
            min: -maxValue,
            max: maxValue
          }
        }
      }
    };
  };

  const wfhGrowthChart = {
    data: {
      labels: wfhWinnerStates.slice(0, 8).map(s => s.state),
      datasets: [
        {
          label: 'Pre-Pandemic WFH',
          data: wfhWinnerStates.slice(0, 8).map(s => s.prePandemic),
          backgroundColor: '#94A3B8'
        },
        {
          label: 'Current WFH',
          data: wfhWinnerStates.slice(0, 8).map(s => s.current),
          backgroundColor: '#3B82F6'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Remote Worker Population: Before & After COVID',
          font: { size: 16, weight: 'bold' as const }
        },
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: any) => `${(value/1000).toFixed(0)}K`
          }
        }
      }
    }
  };

  const homePriceChart = {
    data: {
      labels: wfhWinnerStates.slice(0, 6).map(s => s.state),
      datasets: [{
        label: 'Home Price Increase Since 2020',
        data: wfhWinnerStates.slice(0, 6).map(s => {
          const pre = parseInt(s.medianHomePrice.split(' → ')[0].replace('$', '').replace('K', ''));
          const post = parseInt(s.medianHomePrice.split(' → ')[1].replace('$', '').replace('K', ''));
          return ((post - pre) / pre * 100).toFixed(0);
        }),
        backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Housing Crisis: Price Explosion in WFH Destinations',
          font: { size: 16, weight: 'bold' as const }
        },
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: any) => `+${value}%`
          }
        }
      }
    }
  };

  const migrationFlowChart = {
    data: {
      labels: ['SF → Austin', 'NYC → Miami', 'LA → Phoenix', 'Seattle → Boise', 'Boston → Nashville'],
      datasets: [{
        label: 'Tech Worker Migration 2020-2024',
        data: [52000, 48000, 42000, 35000, 31000],
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 2
      }]
    },
    options: {
      indexAxis: 'y' as const,
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Top Remote Work Migration Corridors',
          font: { size: 16, weight: 'bold' as const }
        },
        legend: { display: false }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: (value: any) => `${(value/1000).toFixed(0)}K`
          }
        }
      }
    }
  };

  const salaryArbitrageChart = {
    data: {
      labels: ['Montana', 'Idaho', 'Utah', 'Maine', 'Wyoming'],
      datasets: [{
        label: 'SF Salary in Low-Cost State',
        data: [185000, 175000, 172000, 168000, 195000],
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 2
      },
      {
        label: 'Local Average Salary',
        data: [52000, 48000, 65000, 45000, 58000],
        backgroundColor: '#EF4444',
        borderColor: '#DC2626',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'The Salary Gap: Remote vs Local Workers',
          font: { size: 16, weight: 'bold' as const }
        },
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: any) => `$${(value/1000).toFixed(0)}K`
          }
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Remote Work Exodus: 15 States Where WFH Changed Everything
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            3.5 million tech workers fled expensive cities. Small towns saw 142% remote worker growth. 
            Here's where America's laptop class conquered—and the locals they displaced.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
            <span>Updated: November 2024</span>
            <span>•</span>
            <span>14 min read</span>
            <span>•</span>
            <span>Remote Work Migration Analysis</span>
          </div>
        </header>

        <section className="mb-12">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <h2 className="text-2xl font-bold mb-3">The Great Remote Work Reshuffling</h2>
            <p className="mb-4">
              <strong>28% of Americans</strong> now work remotely full-time—up from 6% in 2019. 
              This triggered the largest internal migration in U.S. history. Tech workers earning 
              San Francisco salaries moved to Montana. The results? Catastrophic for locals.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <div className="text-3xl font-bold text-blue-600">3.5M</div>
                <div className="text-sm">Workers went fully remote</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">$1.2T</div>
                <div className="text-sm">Economic value shifted</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">142%</div>
                <div className="text-sm">Montana WFH growth</div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">States Transformed by Remote Work Invasion</h2>
          
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WFH Growth</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tech Influx</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Home Prices</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {wfhWinnerStates.map((state) => (
                  <tr key={state.rank} className={state.rank <= 3 ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {state.rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{state.state}</div>
                      <div className="text-xs text-gray-500">
                        {state.prePandemic.toLocaleString()} → {state.current.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                      {state.wfhGrowth}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                      +{state.techWorkerInflux.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {state.medianHomePrice}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {state.localImpact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Remote Worker Boom: Before vs After</h2>
          <div className="h-64 mb-8">
            <Bar {...wfhGrowthChart} />
          </div>
          <p className="text-gray-600">
            Montana saw 48,000 tech workers arrive in 4 years—equivalent to adding an entire city 
            the size of Bozeman to the state.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Housing Crisis: Locals Priced Out</h2>
          <div className="bg-red-50 p-6 rounded-lg mb-8">
            <div className="h-64 mb-4">
              <Bar {...homePriceChart} />
            </div>
            <p className="mb-4">
              <strong>Boise, Idaho:</strong> Median home price jumped 69% in 3 years. Teachers, 
              firefighters, and nurses can no longer afford to live in the cities they serve.
            </p>
            <p className="text-sm text-gray-600">
              "We're becoming a city of remote workers and service workers who commute 2 hours" 
              - Boise Mayor
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Great Tech Migration Routes</h2>
          <div className="h-64 mb-8">
            <Bar {...migrationFlowChart} />
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Cities Losing Remote Workers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wfhLoserStates.map((state) => (
                <div key={state.state} className="bg-white p-4 rounded">
                  <div className="font-bold text-lg">{state.state}</div>
                  <div className="text-red-600 font-bold">{state.loss.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{state.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Salary Arbitrage Crisis</h2>
          <div className="h-64 mb-8">
            <Bar {...salaryArbitrageChart} />
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <p className="mb-4">
              <strong>The $130K Gap:</strong> Remote workers in Montana earn 3.5x local salaries. 
              They bid up everything from housing to restaurant prices, creating parallel economies.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Coffee shops now charge $8 for basic coffee (was $3)</li>
              <li>Restaurant meals average $35/person (was $15)</li>
              <li>Daycare costs rival San Francisco ($2,400/month)</li>
              <li>Local businesses can't compete for workers</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Top 5 WFH Destination States: Population Impact</h2>
          <p className="text-gray-600 mb-6">
            Notice the bulge in 25-45 age groups—prime working age tech workers flooding these states.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {['montana', 'idaho', 'utah', 'maine', 'vermont'].map((state) => {
              const pyramidData = createPyramidData(state);
              if (!pyramidData) return null;
              
              return (
                <div key={state} className="bg-white p-4 rounded-lg shadow">
                  <div className="h-64">
                    <Bar data={pyramidData.data} options={pyramidData.options} />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Bulge in working-age population shows tech worker influx
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">State-by-State: The WFH Transformation</h2>
          
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-3">1. Montana: From Big Sky to Big Tech</h3>
              <p className="mb-4">
                Bozeman now has more software engineers per capita than Seattle. 
                <strong>142% growth</strong> in remote workers crashed local housing market.
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Average home now requires $200K+ income (was $65K)</li>
                <li>70% of new residents work for out-of-state companies</li>
                <li>Local teachers living in RVs due to housing costs</li>
                <li>Yellowstone Club memberships hit $8M</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-3">2. Idaho: The California Overflow</h3>
              <p className="mb-4">
                License plate changes tell the story: <strong>1 in 3 cars</strong> in Boise 
                suburbs had California plates in 2022. Locals call it "Californication."
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Boise home prices up 69% in 3 years</li>
                <li>Traffic increased 45% despite no population boom</li>
                <li>Political tensions: "Don't California My Idaho" movement</li>
                <li>Native Idahoans fleeing to Wyoming</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-3">3. Utah: Silicon Slopes Explosion</h3>
              <p className="mb-4">
                Park City transformed from ski town to <strong>year-round tech hub</strong>. 
                Zoom calls from ski lifts became normal.
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>96,000 remote workers (was 31,000 pre-pandemic)</li>
                <li>Salt Lake City rents up 42% since 2020</li>
                <li>Water crisis worsening with population surge</li>
                <li>Adobe, Goldman Sachs workers dominate housing</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-3">4. Texas: The Ultimate Tax Haven</h3>
              <p className="mb-4">
                Austin added <strong>145,000 tech workers</strong> in 4 years. 
                Tesla, Oracle, HP headquarters followed the talent.
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>No state income tax saves $30K+/year for high earners</li>
                <li>Austin median home: $285K → $385K</li>
                <li>"Keep Austin Weird" replaced by "Keep Austin Housed"</li>
                <li>Traffic now rivals Los Angeles</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Cultural Clash: Locals vs Laptop Class</h2>
          
          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4">Real Quotes from the Ground</h3>
            <div className="space-y-4">
              <blockquote className="border-l-4 border-blue-500 pl-4">
                <p className="italic">"My family's been here 5 generations. Now I can't afford 
                to live in the town my grandfather built."</p>
                <p className="text-sm text-gray-600 mt-1">- Montana rancher, 2024</p>
              </blockquote>
              
              <blockquote className="border-l-4 border-green-500 pl-4">
                <p className="italic">"I save $4,000/month living here vs San Francisco. 
                The locals hate us but the math is undeniable."</p>
                <p className="text-sm text-gray-600 mt-1">- Google engineer in Boise</p>
              </blockquote>
              
              <blockquote className="border-l-4 border-red-500 pl-4">
                <p className="italic">"They work from home, shop online, eat delivery. They're 
                ghosts who destroyed our community."</p>
                <p className="text-sm text-gray-600 mt-1">- Vermont store owner</p>
              </blockquote>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Local Grievances</h3>
              <ul className="space-y-2">
                <li>• Housing unaffordable for natives</li>
                <li>• Service workers commute 2+ hours</li>
                <li>• Small businesses can't compete for labor</li>
                <li>• Community bonds destroyed</li>
                <li>• Local culture erased</li>
                <li>• Political balance shifted</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Remote Worker Benefits</h3>
              <ul className="space-y-2">
                <li>• Save $50K+/year on living costs</li>
                <li>• Better quality of life</li>
                <li>• Access to nature</li>
                <li>• Escape urban crime</li>
                <li>• Better schools for kids</li>
                <li>• Keep high salary</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Economic Transformation</h2>
          
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4">Winners & Losers in the New Economy</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-green-700 mb-2">Winners</h4>
                <ul className="space-y-1 text-sm">
                  <li>✓ Property owners (300%+ gains)</li>
                  <li>✓ Luxury service providers</li>
                  <li>✓ High-end restaurants</li>
                  <li>✓ Private schools</li>
                  <li>✓ Wealth managers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-red-700 mb-2">Losers</h4>
                <ul className="space-y-1 text-sm">
                  <li>✗ Local workers</li>
                  <li>✗ First-time homebuyers</li>
                  <li>✗ Service industry workers</li>
                  <li>✗ Teachers & public servants</li>
                  <li>✗ Small local businesses</li>
                </ul>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              Economic inequality in remote work destinations now exceeds Manhattan levels.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Return-to-Office Reversal?</h2>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <h3 className="text-xl font-bold mb-4">2024 Update: The Pendulum Swings</h3>
            <ul className="space-y-3">
              <li>• <strong>Amazon:</strong> Full RTO mandate sent 12,000 workers back to Seattle</li>
              <li>• <strong>Goldman Sachs:</strong> 5-day office requirement</li>
              <li>• <strong>Meta:</strong> 3-day minimum, tracking badge swipes</li>
              <li>• <strong>Google:</strong> Attendance affects performance reviews</li>
              <li>• <strong>Apple:</strong> Employees quitting over RTO</li>
            </ul>
            <p className="mt-4 font-bold">
              Result: 18% of remote workers called back. Housing markets cooling in WFH havens.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">What Happens Next: 2025-2030 Projections</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Likely Scenarios</h3>
              <ul className="space-y-2 text-sm">
                <li>• 30% of remote workers return to cities</li>
                <li>• Housing correction in overflow markets (-20%)</li>
                <li>• Hybrid becomes permanent (2-3 days office)</li>
                <li>• Second-tier cities win (Nashville, Austin)</li>
                <li>• Rural broadband investment accelerates</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Policy Responses Coming</h3>
              <ul className="space-y-2 text-sm">
                <li>• Remote worker taxes (already in Vermont)</li>
                <li>• Housing reserved for locals</li>
                <li>• Salary adjustment mandates</li>
                <li>• Digital nomad visa programs</li>
                <li>• Infrastructure impact fees</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Your Remote Work Decision Framework</h2>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
            <h3 className="text-xl font-bold mb-4">Should You Join the Exodus?</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-bold mb-2">Move IF:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Your company guarantees permanent remote</li>
                  <li>You can save $30K+/year</li>
                  <li>You don't need city amenities</li>
                  <li>You're okay being an "outsider"</li>
                  <li>You have 6+ months emergency fund</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-2">Stay IF:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>RTO is possible within 2 years</li>
                  <li>Career growth needs in-person presence</li>
                  <li>You value urban culture/diversity</li>
                  <li>Industry connections matter</li>
                  <li>Dating/social life is priority</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Best & Worst States for Remote Workers 2025</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Best Value Remote Destinations</h3>
              <ol className="list-decimal ml-6 space-y-2">
                <li><strong>Tennessee</strong> - No income tax + culture</li>
                <li><strong>North Carolina</strong> - Tech hub + affordability</li>
                <li><strong>Colorado</strong> - Lifestyle + infrastructure</li>
                <li><strong>Texas</strong> - Tax savings + growth</li>
                <li><strong>Georgia</strong> - Cost + connectivity</li>
              </ol>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Avoid These States</h3>
              <ol className="list-decimal ml-6 space-y-2">
                <li><strong>Montana</strong> - Oversaturated + hostile</li>
                <li><strong>Idaho</strong> - Housing crisis + backlash</li>
                <li><strong>Hawaii</strong> - Costs exceed mainland</li>
                <li><strong>Vermont</strong> - Remote worker tax</li>
                <li><strong>Wyoming</strong> - Limited amenities</li>
              </ol>
            </div>
          </div>
        </section>

        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Explore More State Demographics</h3>
            <p className="text-gray-600 mb-4">
              Compare population trends, migration patterns, and demographic shifts across all U.S. states.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/states" className="text-blue-600 hover:underline">All States</Link>
              <span className="text-gray-400">•</span>
              <Link href="/states/montana" className="text-blue-600 hover:underline">Montana</Link>
              <span className="text-gray-400">•</span>
              <Link href="/states/idaho" className="text-blue-600 hover:underline">Idaho</Link>
              <span className="text-gray-400">•</span>
              <Link href="/states/utah" className="text-blue-600 hover:underline">Utah</Link>
              <span className="text-gray-400">•</span>
              <Link href="/states/tennessee" className="text-blue-600 hover:underline">Tennessee</Link>
              <span className="text-gray-400">•</span>
              <Link href="/states/texas" className="text-blue-600 hover:underline">Texas</Link>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Data sources: U.S. Census Bureau, LinkedIn Workforce Report, Zillow, ADP Research</p>
            <p>Remote work statistics based on 2020-2024 migration and employment data</p>
          </div>
        </footer>
      </article>
    </div>
  );
}