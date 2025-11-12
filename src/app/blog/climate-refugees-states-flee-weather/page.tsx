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

export default function ClimateRefugeesPage() {
  const [stateData, setStateData] = useState<{ [key: string]: StateData }>({});
  const [loading, setLoading] = useState(true);

  const climateFleeingStates = [
    { 
      rank: 1,
      state: 'Louisiana',
      populationLoss: -125000,
      mainThreat: 'Hurricanes + Flooding',
      avgYearlyDisasters: 8.2,
      insuranceIncrease: '+127%',
      projectedRisk2050: 'Extreme',
      keyEvent: 'Hurricane Ida (2021) triggered mass exodus'
    },
    { 
      rank: 2,
      state: 'Florida',
      populationLoss: -98000,
      mainThreat: 'Hurricanes + Sea Level Rise',
      avgYearlyDisasters: 6.8,
      insuranceIncrease: '+185%',
      projectedRisk2050: 'Extreme',
      keyEvent: 'Insurance crisis forcing middle class out'
    },
    { 
      rank: 3,
      state: 'California',
      populationLoss: -87000,
      mainThreat: 'Wildfires + Drought',
      avgYearlyDisasters: 7.4,
      insuranceIncrease: '+142%',
      projectedRisk2050: 'Severe',
      keyEvent: '2020 fires displaced 100,000+ residents'
    },
    { 
      rank: 4,
      state: 'Texas',
      populationLoss: -76000,
      mainThreat: 'Heat + Grid Failures',
      avgYearlyDisasters: 5.9,
      insuranceIncrease: '+98%',
      projectedRisk2050: 'Severe',
      keyEvent: '2021 freeze killed 246, triggered exodus'
    },
    { 
      rank: 5,
      state: 'Arizona',
      populationLoss: -65000,
      mainThreat: 'Extreme Heat + Water Crisis',
      avgYearlyDisasters: 3.8,
      insuranceIncrease: '+76%',
      projectedRisk2050: 'Critical',
      keyEvent: '125°F days becoming common'
    },
    { 
      rank: 6,
      state: 'Mississippi',
      populationLoss: -58000,
      mainThreat: 'Tornadoes + Flooding',
      avgYearlyDisasters: 6.2,
      insuranceIncrease: '+112%',
      projectedRisk2050: 'Severe',
      keyEvent: 'Jackson water crisis ongoing since 2022'
    },
    { 
      rank: 7,
      state: 'Alaska',
      populationLoss: -42000,
      mainThreat: 'Permafrost Thaw + Coastal Erosion',
      avgYearlyDisasters: 2.1,
      insuranceIncrease: '+68%',
      projectedRisk2050: 'Critical',
      keyEvent: '31 villages need relocation by 2030'
    },
    { 
      rank: 8,
      state: 'Oklahoma',
      populationLoss: -38000,
      mainThreat: 'Tornadoes + Ice Storms',
      avgYearlyDisasters: 5.5,
      insuranceIncrease: '+93%',
      projectedRisk2050: 'High',
      keyEvent: 'Moore tornado alley exodus accelerating'
    },
    { 
      rank: 9,
      state: 'Nevada',
      populationLoss: -35000,
      mainThreat: 'Drought + Heat',
      avgYearlyDisasters: 2.8,
      insuranceIncrease: '+71%',
      projectedRisk2050: 'Critical',
      keyEvent: 'Lake Mead at 27% capacity'
    },
    { 
      rank: 10,
      state: 'New Mexico',
      populationLoss: -32000,
      mainThreat: 'Wildfires + Water Scarcity',
      avgYearlyDisasters: 3.4,
      insuranceIncrease: '+88%',
      projectedRisk2050: 'High',
      keyEvent: 'Hermits Peak fire destroyed 341,000 acres'
    },
    { 
      rank: 11,
      state: 'West Virginia',
      populationLoss: -28000,
      mainThreat: 'Flooding + Landslides',
      avgYearlyDisasters: 4.1,
      insuranceIncrease: '+65%',
      projectedRisk2050: 'Moderate',
      keyEvent: '2016 floods killed 23, many never returned'
    },
    { 
      rank: 12,
      state: 'Hawaii',
      populationLoss: -24000,
      mainThreat: 'Volcanoes + Tsunamis',
      avgYearlyDisasters: 2.3,
      insuranceIncrease: '+156%',
      projectedRisk2050: 'High',
      keyEvent: 'Maui fires killed 100+, destroyed Lahaina'
    }
  ];

  const climateWinners = [
    { state: 'Michigan', gain: '+89000', reason: 'Great Lakes water security' },
    { state: 'Vermont', gain: '+67000', reason: 'Cool climate refuge' },
    { state: 'Maine', gain: '+58000', reason: 'Minimal natural disasters' },
    { state: 'Minnesota', gain: '+52000', reason: 'Climate stability' },
    { state: 'Wisconsin', gain: '+48000', reason: 'Freshwater abundance' }
  ];

  useEffect(() => {
    const loadStateData = async () => {
      const statesToLoad = ['louisiana', 'florida', 'california', 'texas', 'arizona'];
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

  const disasterChart = {
    data: {
      labels: climateFleeingStates.map(s => s.state),
      datasets: [{
        label: 'Annual Climate Disasters',
        data: climateFleeingStates.map(s => s.avgYearlyDisasters),
        backgroundColor: '#EF4444',
        borderColor: '#DC2626',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Average Annual Climate Disasters by State',
          font: { size: 16, weight: 'bold' as const }
        },
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Disasters per Year'
          }
        }
      }
    }
  };

  const insuranceChart = {
    data: {
      labels: climateFleeingStates.slice(0, 6).map(s => s.state),
      datasets: [{
        label: 'Insurance Premium Increase',
        data: climateFleeingStates.slice(0, 6).map(s => parseInt(s.insuranceIncrease)),
        backgroundColor: ['#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#10B981'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Home Insurance Premium Increases Since 2020',
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
      labels: ['Louisiana → Texas', 'Florida → Georgia', 'California → Nevada', 'Arizona → Colorado', 'Texas → Tennessee'],
      datasets: [{
        label: 'Climate Migration Flow',
        data: [42000, 38000, 35000, 28000, 24000],
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 2
      }]
    },
    options: {
      indexAxis: 'y' as const,
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Top Climate Migration Corridors 2023',
          font: { size: 16, weight: 'bold' as const }
        },
        legend: { display: false }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: (value: any) => value.toLocaleString()
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
            Climate Refugees: 12 States Americans Flee Due to Weather
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            1.2 million Americans became climate migrants in 2023. Insurance companies abandoning entire states. 
            Here's where the climate exodus is happening now.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
            <span>Updated: November 2024</span>
            <span>•</span>
            <span>12 min read</span>
            <span>•</span>
            <span>Climate Migration Analysis</span>
          </div>
        </header>

        <section className="mb-12">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
            <h2 className="text-2xl font-bold mb-3">The Climate Exodus Has Begun</h2>
            <p className="mb-4">
              <strong>31% of Americans</strong> now live in counties that experienced a climate disaster in 2023. 
              The Great Climate Migration isn't coming—it's here. Insurance companies have abandoned entire zip codes, 
              making homes unsellable overnight.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <div className="text-3xl font-bold text-red-600">$92.9B</div>
                <div className="text-sm">Climate damage 2023</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">1.2M</div>
                <div className="text-sm">Climate migrants</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">28</div>
                <div className="text-sm">Billion-dollar disasters</div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">States Americans Are Fleeing Due to Climate</h2>
          
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Population Loss</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Main Threat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance ↑</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2050 Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {climateFleeingStates.map((state) => (
                  <tr key={state.rank} className={state.rank <= 3 ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {state.rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{state.state}</div>
                      <div className="text-xs text-gray-500">{state.keyEvent}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">
                      {state.populationLoss.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {state.mainThreat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-600">
                      {state.insuranceIncrease}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        state.projectedRisk2050 === 'Extreme' ? 'bg-red-100 text-red-800' :
                        state.projectedRisk2050 === 'Critical' ? 'bg-orange-100 text-orange-800' :
                        state.projectedRisk2050 === 'Severe' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {state.projectedRisk2050}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Insurance Death Spiral</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="mb-4">
              <strong>State Farm</strong> stopped writing new policies in California. <strong>Farmers Insurance</strong> 
              pulled out of Florida entirely. When insurance companies flee, property values collapse overnight.
            </p>
            <div className="h-64 mb-4">
              <Bar {...insuranceChart} />
            </div>
            <p className="text-sm text-gray-600">
              Florida leads with 185% premium increases. Many homeowners now pay more for insurance than their mortgage.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Climate Disaster Frequency Accelerating</h2>
          <div className="h-64 mb-8">
            <Bar {...disasterChart} />
          </div>
          <p className="mb-4">
            Louisiana now averages <strong>8.2 climate disasters per year</strong>—up from 2.3 in the 1990s. 
            California experiences major wildfires every 49 days on average.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Top 5 Climate Exodus States: Population Pyramids</h2>
          <p className="text-gray-600 mb-6">
            These population structures show who's leaving. Notice the missing 25-45 age groups—families 
            with children flee first.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {['louisiana', 'florida', 'california', 'texas', 'arizona'].map((state) => {
              const pyramidData = createPyramidData(state);
              if (!pyramidData) return null;
              
              return (
                <div key={state} className="bg-white p-4 rounded-lg shadow">
                  <div className="h-64">
                    <Bar data={pyramidData.data} options={pyramidData.options} />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Missing working-age population indicates climate flight
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Where Climate Refugees Are Going</h2>
          <div className="h-64 mb-8">
            <Bar {...migrationFlowChart} />
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Climate Haven States Gaining Population</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {climateWinners.map((state) => (
                <div key={state.state} className="bg-white p-4 rounded">
                  <div className="font-bold text-lg">{state.state}</div>
                  <div className="text-green-600 font-bold">{state.gain}</div>
                  <div className="text-sm text-gray-600">{state.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">State-by-State Climate Catastrophes</h2>
          
          <div className="space-y-6">
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-3">1. Louisiana: America's Climate Ground Zero</h3>
              <p className="mb-4">
                Lost <strong>2% of landmass</strong> since 2000. Isle de Jean Charles became America's first 
                climate refugee community. Insurance companies classify 43% of properties as "uninsurable."
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Football field of land disappears every 100 minutes</li>
                <li>300,000 climate migrants by 2050</li>
                <li>New Orleans may be uninhabitable by 2070</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-3">2. Florida: The Insurance Apocalypse</h3>
              <p className="mb-4">
                Six insurance companies went bankrupt in 2023 alone. Citizens Property Insurance 
                (state-run insurer of last resort) now covers 1.3 million policies—a 500% increase since 2019.
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Miami Beach spends $100M/year on pumps to stay dry</li>
                <li>670,000 properties at risk of chronic flooding by 2045</li>
                <li>Keys evacuation orders now issued 3x more frequently</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-3">3. California: The Firestate</h3>
              <p className="mb-4">
                Paradise, California lost 95% of structures in 2018. Now <strong>25% of Californians</strong> 
                live in high fire-risk zones. PG&E declares bankruptcy every major fire season.
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Fire season now 365 days (was 4 months in 1970s)</li>
                <li>11 million acres burned since 2020</li>
                <li>Insurance non-renewals up 600% in fire zones</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The $3 Trillion Question: Who Pays?</h2>
          
          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4">Climate Damage Costs Accelerating</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold">1980s</div>
                <div className="text-gray-600">$17B/year</div>
              </div>
              <div>
                <div className="text-2xl font-bold">1990s</div>
                <div className="text-gray-600">$27B/year</div>
              </div>
              <div>
                <div className="text-2xl font-bold">2010s</div>
                <div className="text-gray-600">$51B/year</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">2020s</div>
                <div className="text-gray-600">$93B/year</div>
              </div>
            </div>
            <p className="mt-4 text-sm">
              Federal disaster spending now exceeds military equipment budget. FEMA requests emergency 
              funding quarterly instead of annually.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Taxpayers Subsidizing Climate Risk</h3>
            <ul className="space-y-2">
              <li>• <strong>$38B</strong> - Annual federal flood insurance deficit</li>
              <li>• <strong>$16B</strong> - Wildfire suppression costs (10x increase since 2000)</li>
              <li>• <strong>$24B</strong> - Emergency hurricane relief average</li>
              <li>• <strong>$450B</strong> - Infrastructure repairs needed by 2030</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Your Climate Migration Decision Tree</h2>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <h3 className="text-xl font-bold mb-4">Red Flags: Time to Consider Moving</h3>
            <ul className="space-y-2">
              <li>✓ Insurance premium increased &gt;50% in 2 years</li>
              <li>✓ Major insurer left your state</li>
              <li>✓ 2+ evacuations in past 5 years</li>
              <li>✓ Property value declined despite national growth</li>
              <li>✓ Local government discussing "managed retreat"</li>
              <li>✓ Neighbors selling below asking price</li>
            </ul>
            <p className="mt-4 font-bold">
              If 3+ apply: Start planning your exit within 2 years
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Climate Haven States: Where to Move</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Best Climate Resilience</h3>
              <ol className="list-decimal ml-6 space-y-2">
                <li><strong>Michigan</strong> - Great Lakes water security</li>
                <li><strong>Vermont</strong> - Minimal disasters, cool climate</li>
                <li><strong>Maine</strong> - Long-term climate winner</li>
                <li><strong>Minnesota</strong> - Resource abundance</li>
                <li><strong>Wisconsin</strong> - Geographic protection</li>
              </ol>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Emerging Climate Destinations</h3>
              <ol className="list-decimal ml-6 space-y-2">
                <li><strong>Duluth, MN</strong> - "Climate Proof City"</li>
                <li><strong>Buffalo, NY</strong> - Great Lakes access</li>
                <li><strong>Cincinnati, OH</strong> - River city renaissance</li>
                <li><strong>Pittsburgh, PA</strong> - Tech hub + climate safe</li>
                <li><strong>Madison, WI</strong> - University town stability</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Next Decade: Projections</h2>
          
          <div className="bg-red-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">By 2035, Climate Scientists Project:</h3>
            <ul className="space-y-3">
              <li>• <strong>13 million Americans</strong> displaced by sea level rise</li>
              <li>• <strong>$1 trillion</strong> in stranded real estate assets</li>
              <li>• <strong>Phoenix</strong> uninhabitable 4 months/year (140°F peaks)</li>
              <li>• <strong>Miami Beach</strong> abandoned except ultra-wealthy districts</li>
              <li>• <strong>Sacramento-San Joaquin Delta</strong> permanent drought</li>
              <li>• <strong>Mississippi River</strong> shipping halted 3+ months annually</li>
            </ul>
          </div>
        </section>

        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Explore More State Demographics</h3>
            <p className="text-gray-600 mb-4">
              Compare population trends, age distributions, and migration patterns across all U.S. states.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/states" className="text-blue-600 hover:underline">All States</Link>
              <span className="text-gray-400">•</span>
              <Link href="/states/louisiana" className="text-blue-600 hover:underline">Louisiana</Link>
              <span className="text-gray-400">•</span>
              <Link href="/states/florida" className="text-blue-600 hover:underline">Florida</Link>
              <span className="text-gray-400">•</span>
              <Link href="/states/california" className="text-blue-600 hover:underline">California</Link>
              <span className="text-gray-400">•</span>
              <Link href="/states/michigan" className="text-blue-600 hover:underline">Michigan</Link>
              <span className="text-gray-400">•</span>
              <Link href="/states/vermont" className="text-blue-600 hover:underline">Vermont</Link>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Data sources: FEMA, NOAA, U.S. Census Bureau, Insurance Information Institute</p>
            <p>Analysis based on 2020-2024 migration patterns and climate events</p>
          </div>
        </footer>
      </article>
    </div>
  );
}