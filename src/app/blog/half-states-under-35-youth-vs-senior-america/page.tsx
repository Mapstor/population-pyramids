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
import dcData from '@/data/states/district-of-columbia.json';
import alaskaData from '@/data/states/alaska.json';
import texasData from '@/data/states/texas.json';
import northDakotaData from '@/data/states/north-dakota.json';
import maineData from '@/data/states/maine.json';
import vermontData from '@/data/states/vermont.json';
import floridaData from '@/data/states/florida.json';
import westVirginiaData from '@/data/states/west-virginia.json';
import newHampshireData from '@/data/states/new-hampshire.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function YouthVsSeniorStatesArticle() {
  // Use the imported data directly
  const utah2024Data = utahData.years['2024'];
  const dc2024Data = dcData.years['2024'];
  const alaska2024Data = alaskaData.years['2024'];
  const texas2024Data = texasData.years['2024'];
  const northDakota2024Data = northDakotaData.years['2024'];
  const maine2024Data = maineData.years['2024'];
  const vermont2024Data = vermontData.years['2024'];
  const florida2024Data = floridaData.years['2024'];
  const westVirginia2024Data = westVirginiaData.years['2024'];
  const newHampshire2024Data = newHampshireData.years['2024'];

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

  const allStatesRanking = [
    { rank: 1, state: 'Utah', medianAge: 32.4, under35Pct: '52.1%', over65Pct: '11.4%', slug: 'utah' },
    { rank: 2, state: 'District of Columbia', medianAge: 34.4, under35Pct: '51.8%', over65Pct: '12.4%', slug: 'district-of-columbia' },
    { rank: 3, state: 'Alaska', medianAge: 35.6, under35Pct: '50.7%', over65Pct: '13.6%', slug: 'alaska' },
    { rank: 4, state: 'Texas', medianAge: 35.5, under35Pct: '50.6%', over65Pct: '13.1%', slug: 'texas' },
    { rank: 5, state: 'North Dakota', medianAge: 35.8, under35Pct: '50.2%', over65Pct: '15.8%', slug: 'north-dakota' },
    { rank: 6, state: 'Georgia', medianAge: 37.5, under35Pct: '48.9%', over65Pct: '14.7%', slug: 'georgia' },
    { rank: 7, state: 'Idaho', medianAge: 37.2, under35Pct: '48.7%', over65Pct: '16.2%', slug: 'idaho' },
    { rank: 8, state: 'Nebraska', medianAge: 37.1, under35Pct: '48.5%', over65Pct: '16.1%', slug: 'nebraska' },
    { rank: 9, state: 'California', medianAge: 37.8, under35Pct: '48.3%', over65Pct: '15.2%', slug: 'california' },
    { rank: 10, state: 'Kansas', medianAge: 37.5, under35Pct: '48.2%', over65Pct: '16.4%', slug: 'kansas' },
    { rank: '...', state: '31 States in Middle', medianAge: '38-42', under35Pct: '40-48%', over65Pct: '16-20%', slug: '' },
    { rank: 42, state: 'Delaware', medianAge: 41.7, under35Pct: '42.3%', over65Pct: '19.5%', slug: 'delaware' },
    { rank: 43, state: 'Connecticut', medianAge: 41.8, under35Pct: '42.1%', over65Pct: '18.0%', slug: 'connecticut' },
    { rank: 44, state: 'Pennsylvania', medianAge: 41.9, under35Pct: '41.9%', over65Pct: '19.0%', slug: 'pennsylvania' },
    { rank: 45, state: 'Montana', medianAge: 42.0, under35Pct: '41.7%', over65Pct: '19.8%', slug: 'montana' },
    { rank: 46, state: 'Rhode Island', medianAge: 42.4, under35Pct: '41.2%', over65Pct: '17.7%', slug: 'rhode-island' },
    { rank: 47, state: 'West Virginia', medianAge: 42.8, under35Pct: '40.8%', over65Pct: '21.2%', slug: 'west-virginia' },
    { rank: 48, state: 'Florida', medianAge: 43.0, under35Pct: '40.5%', over65Pct: '21.3%', slug: 'florida' },
    { rank: 49, state: 'New Hampshire', medianAge: 43.0, under35Pct: '40.3%', over65Pct: '19.3%', slug: 'new-hampshire' },
    { rank: 50, state: 'Vermont', medianAge: 43.2, under35Pct: '40.1%', over65Pct: '20.6%', slug: 'vermont' },
    { rank: 51, state: 'Maine', medianAge: 44.8, under35Pct: '38.7%', over65Pct: '22.7%', slug: 'maine' }
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
            Half of These States Are Under 35: America's Youth vs Senior States
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <span>November 2024</span>
            <span>•</span>
            <span>11 min read</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">Age Demographics</span>
          </div>

          <p className="text-xl text-gray-700 leading-relaxed">
            In Utah, half the population is under 32.4 years old. In Maine, half is over 44.8. 
            That's not just an age gap—it's two completely different Americas. Young states are 
            building schools. Old states are building nursing homes. The divide is accelerating.
          </p>
        </header>

        {/* Shock Statistics */}
        <div className="bg-gradient-to-r from-green-50 to-red-50 border-l-4 border-purple-500 p-6 mb-12">
          <h2 className="font-bold text-lg mb-4">The Stunning Age Divide</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">5 Youngest States (Median Age)</p>
              <ul className="space-y-1">
                <li className="flex justify-between">
                  <span className="font-medium">Utah</span>
                  <span className="font-bold text-green-600">32.4</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">DC</span>
                  <span className="font-bold text-green-600">34.4</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Alaska</span>
                  <span className="font-bold text-green-600">35.6</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Texas</span>
                  <span className="font-bold text-green-600">35.5</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">North Dakota</span>
                  <span className="font-bold text-green-600">35.8</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">5 Oldest States (Median Age)</p>
              <ul className="space-y-1">
                <li className="flex justify-between">
                  <span className="font-medium">Maine</span>
                  <span className="font-bold text-red-600">44.8</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Vermont</span>
                  <span className="font-bold text-red-600">43.2</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">New Hampshire</span>
                  <span className="font-bold text-red-600">43.0</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Florida</span>
                  <span className="font-bold text-red-600">43.0</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">West Virginia</span>
                  <span className="font-bold text-red-600">42.8</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-center font-bold text-lg">
            Gap: 12.4 years — larger than elementary to college
          </p>
        </div>

        {/* Visual Extremes */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Visual Shock: Young vs Old America</h2>
          
          <p className="text-lg mb-8">
            These aren't subtle differences. Look at Utah's pyramid—a classic triangle with massive 
            youth at the bottom. Now look at Maine—inverted, top-heavy, with more seniors than children.
            These states exist in different demographic universes.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-center text-green-600">
                Utah: America's Youngest
              </h3>
              <div className="h-80">
                {utah2024Data && (() => {
                  const pyramidData = createPyramidData(utah2024Data, 'Utah 2024');
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
                            text: `Median: 32.4 | 52.1% under 35`
                          }
                        }
                      }} 
                    />
                  );
                })()}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-center text-red-600">
                Maine: America's Oldest
              </h3>
              <div className="h-80">
                {maine2024Data && (() => {
                  const pyramidData = createPyramidData(maine2024Data, 'Maine 2024');
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
                            text: `Median: 44.8 | 38.7% under 35`
                          }
                        }
                      }} 
                    />
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="bg-purple-100 p-6 rounded-lg">
            <p className="text-lg font-semibold mb-2">What You're Seeing:</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-green-700">Utah (Young State):</p>
                <ul className="text-green-600 mt-1">
                  <li>• 52.1% under age 35</li>
                  <li>• Only 11.4% over 65</li>
                  <li>• 4.6 children per senior</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-red-700">Maine (Old State):</p>
                <ul className="text-red-600 mt-1">
                  <li>• Only 38.7% under 35</li>
                  <li>• 22.7% over 65</li>
                  <li>• 0.8 children per senior</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The Complete Ranking */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">All 50 States + DC: Young to Old</h2>
          
          <p className="text-lg mb-6">
            America isn't aging uniformly. Some states stay perpetually young through immigration 
            and high birth rates. Others age rapidly as youth flee and seniors accumulate.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-center font-semibold">Rank</th>
                  <th className="px-4 py-3 text-left font-semibold">State</th>
                  <th className="px-4 py-3 text-center font-semibold">Median Age</th>
                  <th className="px-4 py-3 text-center font-semibold">% Under 35</th>
                  <th className="px-4 py-3 text-center font-semibold">% Over 65</th>
                </tr>
              </thead>
              <tbody>
                {allStatesRanking.map((state, i) => (
                  <tr 
                    key={i} 
                    className={`border-t ${
                      state.rank === '...' ? 'bg-gray-50 font-semibold' : 
                      i < 5 ? 'bg-green-50' : 
                      i >= allStatesRanking.length - 5 ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-center">{state.rank}</td>
                    <td className="px-4 py-3">
                      {state.slug ? (
                        <Link 
                          href={`/states/${state.slug}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {state.state}
                        </Link>
                      ) : (
                        <span>{state.state}</span>
                      )}
                    </td>
                    <td className={`px-4 py-3 text-center font-bold ${
                      typeof state.rank === 'number' && state.rank <= 5 ? 'text-green-600' :
                      typeof state.rank === 'number' && state.rank >= 47 ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {state.medianAge}
                    </td>
                    <td className="px-4 py-3 text-center">{state.under35Pct}</td>
                    <td className="px-4 py-3 text-center">{state.over65Pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <div className="bg-green-100 p-4 rounded text-center">
              <p className="font-bold text-green-800">Young States</p>
              <p className="text-green-600">Over 50% under 35</p>
            </div>
            <div className="bg-gray-100 p-4 rounded text-center">
              <p className="font-bold text-gray-800">Middle States</p>
              <p className="text-gray-600">40-50% under 35</p>
            </div>
            <div className="bg-red-100 p-4 rounded text-center">
              <p className="font-bold text-red-800">Old States</p>
              <p className="text-red-600">Under 40% under 35</p>
            </div>
          </div>
        </section>

        {/* Top 5 Young vs Old Visual */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Extremes: 5 Youngest vs 5 Oldest</h2>
          
          <p className="text-lg mb-8">
            These 10 states represent America's demographic extremes. The youngest 5 are building 
            for the future. The oldest 5 are managing decline. Look at the dramatic pyramid differences.
          </p>

          {/* Youngest 5 */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-green-600">The 5 Youngest States</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { data: utah2024Data, name: 'Utah', age: '32.4' },
                { data: dc2024Data, name: 'DC', age: '34.4' },
                { data: alaska2024Data, name: 'Alaska', age: '35.6' },
                { data: texas2024Data, name: 'Texas', age: '35.5' },
                { data: northDakota2024Data, name: 'North Dakota', age: '35.8' }
              ].map((state, i) => (
                <div key={i}>
                  <h4 className="text-center font-bold mb-2">{state.name}</h4>
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
                              legend: { display: false },
                              title: {
                                display: true,
                                text: `Median: ${state.age}`
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
          </div>

          {/* Oldest 5 */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-red-600">The 5 Oldest States</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { data: maine2024Data, name: 'Maine', age: '44.8' },
                { data: vermont2024Data, name: 'Vermont', age: '43.2' },
                { data: newHampshire2024Data, name: 'New Hampshire', age: '43.0' },
                { data: florida2024Data, name: 'Florida', age: '43.0' },
                { data: westVirginia2024Data, name: 'West Virginia', age: '42.8' }
              ].map((state, i) => (
                <div key={i}>
                  <h4 className="text-center font-bold mb-2">{state.name}</h4>
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
                              legend: { display: false },
                              title: {
                                display: true,
                                text: `Median: ${state.age}`
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
          </div>
        </section>

        {/* What This Means */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Two Americas: What The Age Divide Means</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-green-900 mb-4">Young States Reality</h3>
              <ul className="space-y-3 text-green-800">
                <li className="flex items-start gap-2">
                  <span className="text-xl">🏫</span>
                  <div>
                    <strong>Schools:</strong> Building 3-5 new schools annually, teacher shortages, 
                    overcrowded classrooms
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">🏘️</span>
                  <div>
                    <strong>Housing:</strong> Starter home shortage, family housing boom, 
                    playgrounds everywhere
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">💼</span>
                  <div>
                    <strong>Economy:</strong> Growing workforce, startup culture, consumer spending surge
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">🏥</span>
                  <div>
                    <strong>Healthcare:</strong> Maternity wards expanding, pediatricians in demand
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">📈</span>
                  <div>
                    <strong>Future:</strong> 30+ years of workforce growth ahead
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-red-900 mb-4">Old States Reality</h3>
              <ul className="space-y-3 text-red-800">
                <li className="flex items-start gap-2">
                  <span className="text-xl">🏚️</span>
                  <div>
                    <strong>Schools:</strong> Closing 2-3 schools annually, consolidating districts, 
                    empty playgrounds
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">🏛️</span>
                  <div>
                    <strong>Housing:</strong> Senior living boom, nursing homes expanding, 
                    family homes empty
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">📉</span>
                  <div>
                    <strong>Economy:</strong> Shrinking workforce, fixed incomes dominate, 
                    businesses closing
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">⚕️</span>
                  <div>
                    <strong>Healthcare:</strong> Geriatric care crisis, Medicare overwhelming budgets
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <strong>Future:</strong> Accelerating decline, tax base collapse approaching
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
            <p className="text-lg font-semibold mb-2">The Feedback Loop:</p>
            <p className="text-gray-700">
              Young people move to young states (jobs, culture, opportunity). Old people move to 
              old states (retirement, healthcare, peace). This self-segregation by age is creating 
              two completely different Americas that barely understand each other.
            </p>
          </div>
        </section>

        {/* Economic Impact */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Economic Chasm</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">GDP Growth Rate (2020-2024 Average)</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-green-600 mb-3">Young States (Median &lt; 38)</p>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Utah</span>
                      <span className="font-bold">+4.2% annually</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Texas</span>
                      <span className="font-bold">+3.8% annually</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Idaho</span>
                      <span className="font-bold">+3.6% annually</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Average</span>
                      <span className="font-bold text-green-600">+3.5%</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-red-600 mb-3">Old States (Median &gt; 42)</p>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Maine</span>
                      <span className="font-bold">+0.8% annually</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Vermont</span>
                      <span className="font-bold">+0.6% annually</span>
                    </li>
                    <li className="flex justify-between">
                      <span>West Virginia</span>
                      <span className="font-bold">-0.2% annually</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Average</span>
                      <span className="font-bold text-red-600">+0.7%</span>
                    </li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-center font-bold text-lg">
                Young states growing 5x faster economically
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">The Dependency Disaster</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-2xl font-bold">Young States</p>
                  <p className="mt-2">68 dependents per 100 workers</p>
                  <p className="text-sm mt-1">But mostly children who will become workers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">Old States</p>
                  <p className="mt-2">74 dependents per 100 workers</p>
                  <p className="text-sm mt-1">But mostly retirees who need expensive care</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Political Divide */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Political Split</h2>
          
          <p className="text-lg mb-6">
            Age drives politics. Young states and old states vote differently, prioritize differently, 
            and see America's future differently.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-3 text-green-600">Young State Priorities</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Education funding (K-12)</li>
                <li>• Job creation programs</li>
                <li>• Family tax credits</li>
                <li>• Infrastructure for growth</li>
                <li>• Tech and innovation</li>
                <li>• Childcare support</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-3 text-red-600">Old State Priorities</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Medicare/Social Security</li>
                <li>• Property tax freezes</li>
                <li>• Healthcare access</li>
                <li>• Infrastructure maintenance</li>
                <li>• Prescription drug costs</li>
                <li>• Senior services</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-lg font-semibold mb-2">The Conflict:</p>
            <p className="text-gray-700">
              Young states want investment in the future (schools, infrastructure, innovation). 
              Old states want protection of the present (pensions, healthcare, stability). 
              This isn't just politics—it's a fundamental conflict over resource allocation between 
              America's demographic winners and losers.
            </p>
          </div>
        </section>

        {/* 2050 Projection */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">2050: The Age Chasm Becomes Permanent</h2>
          
          <div className="space-y-6">
            <p className="text-lg">
              Current trends aren't slowing—they're accelerating. By 2050:
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-green-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-green-900 mb-4">Young States in 2050</h3>
                <ul className="space-y-2 text-green-800">
                  <li>• Utah median age: Still under 35</li>
                  <li>• Texas: 55 million people, median 37</li>
                  <li>• 60% of US children in 10 states</li>
                  <li>• Economic powerhouses</li>
                  <li>• Immigration magnets</li>
                </ul>
              </div>
              
              <div className="bg-red-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-red-900 mb-4">Old States in 2050</h3>
                <ul className="space-y-2 text-red-800">
                  <li>• Maine median age: Over 50</li>
                  <li>• Vermont: 40% over 65</li>
                  <li>• School systems collapsed</li>
                  <li>• Economic stagnation permanent</li>
                  <li>• Healthcare systems overwhelmed</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-600 text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">The Two Americas</h3>
              <p className="text-lg mb-4">
                By 2050, we won't have one America—we'll have two. Young America will look like 
                Utah today: dynamic, growing, building. Old America will look like rural Japan: 
                emptying, aging, managing decline.
              </p>
              <p className="text-lg">
                The 12.4-year age gap between Utah and Maine today becomes a 20-year gap by 2050. 
                These won't just be different states—they'll be different civilizations.
              </p>
            </div>
          </div>
        </section>

        {/* The Bottom Line */}
        <section className="mb-16">
          <div className="bg-gray-900 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">The Uncomfortable Truth</h2>
            
            <div className="space-y-4 text-lg">
              <p>
                America isn't aging—it's splitting. Half our states are getting younger. 
                Half are getting older. There's almost nothing in between.
              </p>
              
              <p>
                In Utah, DC, Alaska, Texas, and North Dakota, over 50% of people are under 35. 
                These states are building schools, creating jobs, and planning for growth.
              </p>
              
              <p>
                In Maine, Vermont, New Hampshire, Florida, and West Virginia, the future is already 
                here—and it's old. These states are closing schools, losing workers, and managing decline.
              </p>
              
              <p className="text-xl font-bold mt-6">
                Your state's median age isn't just a statistic—it's destiny. Young states will 
                dominate America's future. Old states will struggle to maintain the present. 
                The age divide is becoming the most important divide in America.
              </p>
            </div>
          </div>
        </section>

        {/* Related Content */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Explore Your State's Age Profile</h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Link 
              href="/states/utah" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">Utah Demographics</h3>
              <p className="text-gray-600">
                Explore America's youngest state with a median age of just 32.4 years and understand 
                what drives perpetual youth.
              </p>
            </Link>
            
            <Link 
              href="/states/maine" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">Maine Population Analysis</h3>
              <p className="text-gray-600">
                See why Maine became America's oldest state with a median age of 44.8 and what 
                this means for its future.
              </p>
            </Link>

            <Link 
              href="/states/texas" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">Texas Age Distribution</h3>
              <p className="text-gray-600">
                Discover how Texas maintains a young median age despite its massive size through 
                immigration and high birth rates.
              </p>
            </Link>

            <Link 
              href="/states/florida" 
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2 text-blue-600">Florida's Age Paradox</h3>
              <p className="text-gray-600">
                Understand how Florida balances massive retiree immigration with young immigrant 
                families to create unique demographics.
              </p>
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-red-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Is Your State Young or Old?</h2>
          <p className="text-green-100 mb-6">
            Find out where your state ranks in America's age divide. Explore detailed demographics, 
            population pyramids, and future projections for all 50 states plus DC.
          </p>
          <Link 
            href="/states" 
            className="inline-block px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition font-semibold"
          >
            Check Your State's Age Profile
          </Link>
        </div>
      </article>
    </div>
  );
}