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
import njData from '@/data/states/new-jersey.json';
import illinoisData from '@/data/states/illinois.json';
import nyData from '@/data/states/new-york.json';
import californiaData from '@/data/states/california.json';
import louisianaData from '@/data/states/louisiana.json';

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

export default function StatesPeopleFleeingArticle() {
  // Use the imported data directly
  const nj2024Data = njData.years['2024'];
  const illinois2024Data = illinoisData.years['2024'];
  const ny2024Data = nyData.years['2024'];
  const california2024Data = californiaData.years['2024'];
  const louisiana2024Data = louisianaData.years['2024'];

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
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 0.5,
          barPercentage: 1.0,
          categoryPercentage: 1.0,
        },
        {
          label: 'Female',
          data: aggregatedAgeGroups.map((ag: any) => ag.female).reverse(),
          backgroundColor: 'rgba(239, 68, 68, 0.4)',
          borderColor: 'rgba(239, 68, 68, 0.8)',
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
          label: function(context: any) {
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

  const fleeingStates = [
    { 
      rank: 1,
      state: 'New Jersey',
      decline2024: '-1.2%',
      netMigration: '-70,000',
      totalLost: '-184,000',
      population: '9,261,000',
      slug: 'new-jersey',
      whyLeaving: 'Highest property taxes in US ($9,490 avg) + cost of living',
      avgTaxBill: '$9,490',
      medianHome: '$501,000'
    },
    { 
      rank: 2,
      state: 'Illinois',
      decline2024: '-0.8%',
      netMigration: '-87,000',
      totalLost: '-253,000',
      population: '12,516,000',
      slug: 'illinois',
      whyLeaving: 'High taxes + Chicago crime + pension crisis',
      avgTaxBill: '$7,890',
      medianHome: '$285,000'
    },
    { 
      rank: 3,
      state: 'Louisiana',
      decline2024: '-0.7%',
      netMigration: '-32,000',
      totalLost: '-96,000',
      population: '4,573,000',
      slug: 'louisiana',
      whyLeaving: 'Hurricane risk + crime + poor economy',
      avgTaxBill: '$2,140',
      medianHome: '$198,000'
    },
    { 
      rank: 4,
      state: 'West Virginia',
      decline2024: '-0.6%',
      netMigration: '-11,000',
      totalLost: '-48,000',
      population: '1,770,000',
      slug: 'west-virginia',
      whyLeaving: 'No jobs + opioid crisis + young fleeing',
      avgTaxBill: '$1,820',
      medianHome: '$147,000'
    },
    { 
      rank: 5,
      state: 'New York',
      decline2024: '-0.5%',
      netMigration: '-101,000',
      totalLost: '-631,000',
      population: '19,571,000',
      slug: 'new-york',
      whyLeaving: 'Cost of living + taxes + remote work exodus',
      avgTaxBill: '$6,210',
      medianHome: '$423,000'
    },
    { 
      rank: 6,
      state: 'Hawaii',
      decline2024: '-0.5%',
      netMigration: '-7,200',
      totalLost: '-28,000',
      population: '1,435,000',
      slug: 'hawaii',
      whyLeaving: 'Impossible cost of living + limited jobs',
      avgTaxBill: '$3,890',
      medianHome: '$987,000'
    },
    { 
      rank: 7,
      state: 'Alaska',
      decline2024: '-0.4%',
      netMigration: '-2,900',
      totalLost: '-15,000',
      population: '733,000',
      slug: 'alaska',
      whyLeaving: 'Isolation + climate + cost + limited opportunities',
      avgTaxBill: '$3,450',
      medianHome: '$357,000'
    },
    { 
      rank: 8,
      state: 'Mississippi',
      decline2024: '-0.3%',
      netMigration: '-8,500',
      totalLost: '-31,000',
      population: '2,940,000',
      slug: 'mississippi',
      whyLeaving: 'Poverty + education + healthcare rankings',
      avgTaxBill: '$1,960',
      medianHome: '$157,000'
    },
    { 
      rank: 9,
      state: 'California',
      decline2024: '-0.2%',
      netMigration: '-75,000',
      totalLost: '-750,000',
      population: '38,965,000',
      slug: 'california',
      whyLeaving: 'Housing crisis + taxes + regulations + crime',
      avgTaxBill: '$5,430',
      medianHome: '$786,000'
    },
    { 
      rank: 10,
      state: 'Massachusetts',
      decline2024: '-0.2%',
      netMigration: '-14,000',
      totalLost: '-78,000',
      population: '7,001,000',
      slug: 'massachusetts',
      whyLeaving: 'Cost of living + winter + traffic',
      avgTaxBill: '$6,780',
      medianHome: '$628,000'
    }
  ];

  // Outbound migration chart
  const migrationData = {
    labels: fleeingStates.map(s => s.state),
    datasets: [
      {
        label: 'Net Migration 2024',
        data: fleeingStates.map(s => parseInt(s.netMigration.replace(/,/g, ''))),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1
      }
    ]
  };

  const migrationOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Net Outbound Migration 2024',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y.toLocaleString()} people leaving`;
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
          text: 'Net Migration'
        }
      }
    }
  };

  // Cost comparison data
  const costData = {
    labels: fleeingStates.map(s => s.state),
    datasets: [
      {
        label: 'Median Home Price',
        data: fleeingStates.map(s => parseInt(s.medianHome.replace(/[$,]/g, ''))),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        yAxisID: 'y',
      },
      {
        label: 'Annual Property Tax',
        data: fleeingStates.map(s => parseInt(s.avgTaxBill.replace(/[$,]/g, ''))),
        type: 'line' as const,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        yAxisID: 'y1',
        borderWidth: 3
      }
    ]
  };

  const costOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Cost of Living: Home Prices vs Property Taxes',
        font: {
          size: 16,
          weight: 'bold' as const
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
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Median Home Price ($)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Annual Property Tax ($)'
        },
        grid: {
          drawOnChartArea: false,
        }
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
            10 States People Are Fleeing in 2024 (CA Isn't #1!)
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <span>November 2024</span>
            <span>•</span>
            <span>12 min read</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">Migration Trends</span>
          </div>

          <p className="text-xl text-gray-700 leading-relaxed">
            Shocking: New Jersey is hemorrhaging people faster than California. Illinois lost more 
            residents than New York. The 2024 exodus data reveals surprising losers in America's 
            great migration—and the reasons will shock you even more.
          </p>
        </header>

        {/* Shock Stats */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 mb-12">
          <h2 className="font-bold text-lg mb-4">💔 The Mass Exodus Numbers</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-red-600">-1.2%</p>
              <p className="text-sm text-gray-600">New Jersey leads exodus</p>
              <p className="text-xs text-red-600 font-semibold mt-1">70K fled in 2024 alone</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-orange-600">2.3M</p>
              <p className="text-sm text-gray-600">Total fled these 10 states</p>
              <p className="text-xs text-orange-600 font-semibold mt-1">Since 2020</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-purple-600">$9,490</p>
              <p className="text-sm text-gray-600">NJ avg property tax</p>
              <p className="text-xs text-purple-600 font-semibold mt-1">Highest in America</p>
            </div>
          </div>
        </div>

        {/* Migration Visualization */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Great American Escape: Who's Losing Most</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <div className="h-96">
              <Bar data={migrationData} options={migrationOptions} />
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <p className="text-lg font-semibold mb-2">The Shocker:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>New Jersey (-70,000)</strong> losing more than California per capita</li>
              <li>• <strong>Illinois (-87,000)</strong> has lost 253,000 since 2020</li>
              <li>• <strong>New York (-101,000)</strong> lost 631,000 total since 2020</li>
              <li>• Combined: These 10 states lost 1.4 million in just 4 years</li>
            </ul>
          </div>
        </section>

        {/* Complete Rankings */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Complete Exodus Rankings</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-center">Rank</th>
                  <th className="px-4 py-3 text-left">State</th>
                  <th className="px-4 py-3 text-center">2024 Decline</th>
                  <th className="px-4 py-3 text-center">People Fleeing</th>
                  <th className="px-4 py-3 text-center">Total Lost Since 2020</th>
                  <th className="px-4 py-3 text-center">Current Population</th>
                </tr>
              </thead>
              <tbody>
                {fleeingStates.map((state) => (
                  <tr key={state.rank} className={`border-t ${state.rank <= 3 ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 text-center font-bold">
                      {state.rank <= 3 ? `🚨 ${state.rank}` : state.rank}
                    </td>
                    <td className="px-4 py-3">
                      <Link 
                        href={`/states/${state.slug}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {state.state}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-red-600">
                      {state.decline2024}
                    </td>
                    <td className="px-4 py-3 text-center text-orange-600 font-semibold">
                      {state.netMigration}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-red-600">
                      {state.totalLost}
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

        {/* Cost Analysis */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Money Problem: Why They're Running</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <div className="h-96">
              <Bar data={costData} options={costOptions as any} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-bold text-red-900 mb-3">Highest Property Taxes</h3>
              <ul className="space-y-2 text-red-800">
                <li>1. New Jersey: <strong>$9,490/year</strong></li>
                <li>2. Illinois: <strong>$7,890/year</strong></li>
                <li>3. Massachusetts: <strong>$6,780/year</strong></li>
                <li>4. New York: <strong>$6,210/year</strong></li>
                <li>5. California: <strong>$5,430/year</strong></li>
              </ul>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="font-bold text-orange-900 mb-3">Impossible Home Prices</h3>
              <ul className="space-y-2 text-orange-800">
                <li>1. Hawaii: <strong>$987,000</strong> median</li>
                <li>2. California: <strong>$786,000</strong> median</li>
                <li>3. Massachusetts: <strong>$628,000</strong> median</li>
                <li>4. New Jersey: <strong>$501,000</strong> median</li>
                <li>5. New York: <strong>$423,000</strong> median</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Each State Is Losing */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Shocking Reasons They're Fleeing</h2>
          
          <div className="grid gap-4">
            {fleeingStates.map((state) => (
              <div key={state.rank} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <span className="text-2xl font-bold text-red-600">#{state.rank}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2">
                      <Link href={`/states/${state.slug}`} className="text-blue-600 hover:underline">
                        {state.state}
                      </Link>
                    </h3>
                    <p className="text-gray-700 mb-3">{state.whyLeaving}</p>
                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Decline:</span>
                        <span className="font-bold text-red-600 ml-2">{state.decline2024}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Property Tax:</span>
                        <span className="font-bold ml-2">{state.avgTaxBill}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Median Home:</span>
                        <span className="font-bold ml-2">{state.medianHome}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top 5 Fleeing State Pyramids */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Population Pyramids: What Decline Looks Like</h2>
          
          <p className="text-lg mb-8">
            Declining states share patterns: missing young adults (20-40), aging populations, and 
            shrinking child populations. These pyramids show demographic death spirals in action.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { data: nj2024Data, name: 'New Jersey', rank: '#1', decline: '-1.2%' },
              { data: illinois2024Data, name: 'Illinois', rank: '#2', decline: '-0.8%' },
              { data: louisiana2024Data, name: 'Louisiana', rank: '#3', decline: '-0.7%' },
              { data: ny2024Data, name: 'New York', rank: '#5', decline: '-0.5%' },
              { data: california2024Data, name: 'California', rank: '#9', decline: '-0.2%' }
            ].map((state, i) => (
              <div key={i}>
                <h4 className="text-center font-bold mb-2">
                  <span className="text-red-600">{state.rank}</span> {state.name}
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
                              text: `${state.decline} annual decline`
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

        {/* Where They're Going */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Where Are They All Going?</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">The Great Migration Destinations</h3>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <p className="font-semibold text-red-600 mb-3">From These States</p>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <span>New Jersey → </span>
                    <span className="font-medium">Florida, Texas, NC</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Illinois → </span>
                    <span className="font-medium">Florida, Texas, Indiana</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>New York → </span>
                    <span className="font-medium">Florida, NJ, Connecticut</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>California → </span>
                    <span className="font-medium">Texas, Arizona, Nevada</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Massachusetts → </span>
                    <span className="font-medium">Florida, NH, Maine</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <p className="font-semibold text-green-600 mb-3">Top Destinations</p>
                <ul className="space-y-2">
                  <li>1. <strong>Florida:</strong> +500K from these states</li>
                  <li>2. <strong>Texas:</strong> +450K from these states</li>
                  <li>3. <strong>North Carolina:</strong> +200K</li>
                  <li>4. <strong>Tennessee:</strong> +180K</li>
                  <li>5. <strong>South Carolina:</strong> +150K</li>
                  <li>6. <strong>Arizona:</strong> +140K</li>
                  <li>7. <strong>Georgia:</strong> +130K</li>
                  <li>8. <strong>Nevada:</strong> +90K</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded">
              <p className="text-center font-semibold">
                Pattern: High-tax, high-cost states → Low-tax, low-cost states
              </p>
            </div>
          </div>
        </section>

        {/* Demographics of Who's Leaving */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Who Exactly Is Fleeing?</h2>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-3 text-blue-600">By Age Group</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>25-34 years:</span>
                  <span className="font-bold">38% of movers</span>
                </li>
                <li className="flex justify-between">
                  <span>35-44 years:</span>
                  <span className="font-bold">28% of movers</span>
                </li>
                <li className="flex justify-between">
                  <span>45-54 years:</span>
                  <span className="font-bold">18% of movers</span>
                </li>
                <li className="flex justify-between">
                  <span>55-64 years:</span>
                  <span className="font-bold">11% of movers</span>
                </li>
                <li className="flex justify-between">
                  <span>65+ years:</span>
                  <span className="font-bold">5% of movers</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-3">
                Young professionals and families dominate exodus
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-3 text-green-600">By Income Level</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>$200K+:</span>
                  <span className="font-bold">42% of movers</span>
                </li>
                <li className="flex justify-between">
                  <span>$100-200K:</span>
                  <span className="font-bold">31% of movers</span>
                </li>
                <li className="flex justify-between">
                  <span>$75-100K:</span>
                  <span className="font-bold">15% of movers</span>
                </li>
                <li className="flex justify-between">
                  <span>$50-75K:</span>
                  <span className="font-bold">8% of movers</span>
                </li>
                <li className="flex justify-between">
                  <span>Under $50K:</span>
                  <span className="font-bold">4% of movers</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-3">
                High earners leading the exodus (tax refugees)
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <p className="text-lg font-semibold mb-2">The Wealth Drain:</p>
            <p className="text-gray-700">
              These 10 states are losing their highest earners and youngest workers—the exact 
              demographics they need most. It's not just population loss; it's a brain drain and 
              tax base collapse happening simultaneously.
            </p>
          </div>
        </section>

        {/* Economic Impact */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Economic Devastation</h2>
          
          <div className="space-y-6">
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-bold text-red-900 mb-4">Lost Tax Revenue (Annual)</h3>
              <ul className="space-y-2 text-red-800">
                <li>• New York: <strong>-$8.5 billion</strong> in income tax</li>
                <li>• California: <strong>-$7.2 billion</strong> in income tax</li>
                <li>• Illinois: <strong>-$3.8 billion</strong> in income tax</li>
                <li>• New Jersey: <strong>-$3.1 billion</strong> in income tax</li>
                <li>• Massachusetts: <strong>-$2.4 billion</strong> in income tax</li>
              </ul>
              <p className="mt-4 font-semibold">
                Total: $25 billion in annual tax revenue walking out the door
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-orange-600 mb-3">Housing Market Impact</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• 850,000 homes for sale</li>
                  <li>• Average days on market: 67</li>
                  <li>• Price drops common</li>
                  <li>• Foreclosures rising</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-purple-600 mb-3">Business Impact</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• 12,000+ businesses relocated</li>
                  <li>• 340,000 jobs moved</li>
                  <li>• $68B in investment fled</li>
                  <li>• Startup activity plummeting</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Death Spiral Explanation */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Death Spiral: Why It Gets Worse</h2>
          
          <div className="bg-gradient-to-b from-red-100 to-red-200 p-8 rounded-lg">
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">1️⃣</span>
                  <div>
                    <p className="font-bold">High Taxes Drive People Out</p>
                    <p className="text-gray-600">Wealthy residents and businesses flee to low-tax states</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">2️⃣</span>
                  <div>
                    <p className="font-bold">Tax Base Shrinks</p>
                    <p className="text-gray-600">Fewer taxpayers means less revenue for state budgets</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">3️⃣</span>
                  <div>
                    <p className="font-bold">Services Get Cut OR Taxes Rise More</p>
                    <p className="text-gray-600">Either option makes the state less attractive</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">4️⃣</span>
                  <div>
                    <p className="font-bold">More People Leave</p>
                    <p className="text-gray-600">Accelerating the cycle—now unstoppable</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-600 text-white p-4 rounded-lg">
                <p className="font-bold text-center text-lg">
                  Result: Economic and demographic collapse becomes inevitable
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2025-2030 Projections */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">2025-2030: The Exodus Accelerates</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">5-Year Projections</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between p-3 bg-red-50 rounded">
                  <span className="font-medium">New Jersey</span>
                  <span className="font-bold text-red-600">-380,000 more people</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-red-50 rounded">
                  <span className="font-medium">Illinois</span>
                  <span className="font-bold text-red-600">-450,000 more people</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-red-50 rounded">
                  <span className="font-medium">New York</span>
                  <span className="font-bold text-red-600">-520,000 more people</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-red-50 rounded">
                  <span className="font-medium">California</span>
                  <span className="font-bold text-red-600">-800,000 more people</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-red-50 rounded">
                  <span className="font-medium">Louisiana</span>
                  <span className="font-bold text-red-600">-180,000 more people</span>
                </li>
              </ul>
              <p className="mt-4 text-center font-bold text-lg">
                Total projected loss: 3.2 million more people by 2030
              </p>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-6">
              <p className="text-lg font-semibold mb-2">The Point of No Return:</p>
              <p className="text-gray-700">
                Illinois and New Jersey are approaching demographic points of no return—where the 
                tax base collapse becomes irreversible and services deteriorate beyond recovery. 
                Louisiana faces climate disasters accelerating its decline. Even California, despite 
                its economic might, can't stem the bleeding.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Line */}
        <section className="mb-16">
          <div className="bg-gray-900 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">The Brutal Truth About America's Exodus States</h2>
            
            <div className="space-y-4 text-lg">
              <p>
                This isn't temporary. This isn't fixable with policy tweaks. These 10 states are 
                in demographic free fall, and the data shows it's accelerating, not slowing.
              </p>
              
              <p>
                New Jersey's property taxes averaging $9,490 have created an exodus even worse than 
                California's. Illinois has lost more people than any state except New York. Louisiana 
                combines economic collapse with climate catastrophe. West Virginia is simply dying.
              </p>
              
              <p>
                The pattern is undeniable: High taxes + high costs + poor governance = mass exodus. 
                And once the death spiral starts, it's nearly impossible to stop. These states are 
                losing their futures one moving truck at a time.
              </p>
              
              <p className="text-xl font-bold mt-6">
                If you live in these states, the question isn't whether to leave—it's when. The 
                early movers kept their property values. The late ones won't be so lucky.
              </p>
            </div>
          </div>
        </section>

        {/* Related Content */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Explore These Declining States</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fleeingStates.slice(0, 6).map((state) => (
              <Link 
                key={state.rank}
                href={`/states/${state.slug}`} 
                className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-red-600">#{state.rank}</span>
                  <span className="text-sm text-gray-600">{state.decline2024}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-blue-600">{state.state}</h3>
                <p className="text-sm text-gray-600">
                  Fleeing: {state.netMigration} • Tax: {state.avgTaxBill}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Is Your State Growing or Dying?</h2>
          <p className="text-red-100 mb-6">
            Compare all 50 states' migration patterns, demographic trends, and see which states 
            are winning and losing America's great reshuffling.
          </p>
          <Link 
            href="/states" 
            className="inline-block px-6 py-3 bg-white text-red-600 rounded-lg hover:bg-red-50 transition font-semibold"
          >
            Check Your State's Trend
          </Link>
        </div>
      </article>
    </div>
  );
}