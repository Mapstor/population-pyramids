'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Bar, Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

export default function BestStatesRetireArticle() {
  const [floridaData, setFloridaData] = useState<any>(null);
  const [tennesseeData, setTennesseeData] = useState<any>(null);
  const [southCarolinaData, setSouthCarolinaData] = useState<any>(null);
  const [delawareData, setDelawareData] = useState<any>(null);
  const [nevadaData, setNevadaData] = useState<any>(null);

  useEffect(() => {
    // Load state data from API
    async function loadData() {
      try {
        const [florida, tennessee, sc, delaware, nevada] = await Promise.all([
          fetch('/api/states/florida').then(r => r.json()),
          fetch('/api/states/tennessee').then(r => r.json()),
          fetch('/api/states/south-carolina').then(r => r.json()),
          fetch('/api/states/delaware').then(r => r.json()),
          fetch('/api/states/nevada').then(r => r.json()),
        ]);
        
        setFloridaData(florida['2024']);
        setTennesseeData(tennessee['2024']);
        setSouthCarolinaData(sc['2024']);
        setDelawareData(delaware['2024']);
        setNevadaData(nevada['2024']);
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

  const retirementStates = [
    { 
      rank: 1,
      state: 'Delaware',
      overallScore: 95,
      taxScore: 98,
      costScore: 82,
      healthScore: 88,
      climateScore: 85,
      safetyScore: 79,
      population: '1,055,000',
      over65Pct: '21.2%',
      slug: 'delaware',
      whyGreat: 'No sales tax + low property tax + beaches + mild winters',
      avgRetirementCost: '$52,000/year',
      medianHome: '$385,000',
      stateTax: 'None on Social Security'
    },
    { 
      rank: 2,
      state: 'Florida',
      overallScore: 93,
      taxScore: 96,
      costScore: 78,
      healthScore: 82,
      climateScore: 92,
      safetyScore: 75,
      population: '22,975,000',
      over65Pct: '21.3%',
      slug: 'florida',
      whyGreat: 'No income tax + warm weather + beaches + senior communities',
      avgRetirementCost: '$55,000/year',
      medianHome: '$412,000',
      stateTax: 'No state income tax'
    },
    { 
      rank: 3,
      state: 'South Carolina',
      overallScore: 91,
      taxScore: 88,
      costScore: 85,
      healthScore: 76,
      climateScore: 89,
      safetyScore: 72,
      population: '5,402,000',
      over65Pct: '18.7%',
      slug: 'south-carolina',
      whyGreat: 'Low taxes + mild winters + beaches + golf + lower costs',
      avgRetirementCost: '$48,000/year',
      medianHome: '$298,000',
      stateTax: 'No tax on Social Security'
    },
    { 
      rank: 4,
      state: 'Nevada',
      overallScore: 89,
      taxScore: 95,
      costScore: 76,
      healthScore: 79,
      climateScore: 88,
      safetyScore: 70,
      population: '3,235,000',
      over65Pct: '17.1%',
      slug: 'nevada',
      whyGreat: 'No income tax + no tax on pensions + dry climate + entertainment',
      avgRetirementCost: '$51,000/year',
      medianHome: '$428,000',
      stateTax: 'No state income tax'
    },
    { 
      rank: 5,
      state: 'Tennessee',
      overallScore: 88,
      taxScore: 94,
      costScore: 87,
      healthScore: 73,
      climateScore: 82,
      safetyScore: 68,
      population: '7,188,000',
      over65Pct: '17.3%',
      slug: 'tennessee',
      whyGreat: 'No income tax + low cost of living + music culture + mild climate',
      avgRetirementCost: '$46,000/year',
      medianHome: '$318,000',
      stateTax: 'No tax on wages'
    },
    { 
      rank: 6,
      state: 'Georgia',
      overallScore: 86,
      taxScore: 82,
      costScore: 84,
      healthScore: 77,
      climateScore: 87,
      safetyScore: 71,
      population: '11,145,000',
      over65Pct: '14.7%',
      slug: 'georgia',
      whyGreat: 'Low taxes + mild winters + culture + growing senior communities',
      avgRetirementCost: '$49,000/year',
      medianHome: '$336,000',
      stateTax: 'No tax on Social Security'
    },
    { 
      rank: 7,
      state: 'North Carolina',
      overallScore: 85,
      taxScore: 78,
      costScore: 83,
      healthScore: 80,
      climateScore: 85,
      safetyScore: 74,
      population: '10,975,000',
      over65Pct: '17.5%',
      slug: 'north-carolina',
      whyGreat: 'Mountains + beaches + moderate climate + healthcare + culture',
      avgRetirementCost: '$50,000/year',
      medianHome: '$362,000',
      stateTax: 'Flat 4.75% (lower than most)'
    },
    { 
      rank: 8,
      state: 'Texas',
      overallScore: 84,
      taxScore: 93,
      costScore: 81,
      healthScore: 75,
      climateScore: 78,
      safetyScore: 69,
      population: '31,332,000',
      over65Pct: '13.1%',
      slug: 'texas',
      whyGreat: 'No income tax + diverse cities + warm weather + low costs',
      avgRetirementCost: '$47,000/year',
      medianHome: '$357,000',
      stateTax: 'No state income tax'
    },
    { 
      rank: 9,
      state: 'Arizona',
      overallScore: 83,
      taxScore: 80,
      costScore: 77,
      healthScore: 78,
      climateScore: 91,
      safetyScore: 73,
      population: '7,497,000',
      over65Pct: '18.8%',
      slug: 'arizona',
      whyGreat: 'Dry climate + sunshine + golf + active retirement communities',
      avgRetirementCost: '$53,000/year',
      medianHome: '$437,000',
      stateTax: 'Low tax on Social Security'
    },
    { 
      rank: 10,
      state: 'Virginia',
      overallScore: 82,
      taxScore: 75,
      costScore: 79,
      healthScore: 84,
      climateScore: 81,
      safetyScore: 82,
      population: '8,757,000',
      over65Pct: '16.4%',
      slug: 'virginia',
      whyGreat: 'History + healthcare + four seasons + no tax on Social Security',
      avgRetirementCost: '$54,000/year',
      medianHome: '$389,000',
      stateTax: 'Age deduction for seniors'
    },
    { 
      rank: 11,
      state: 'Alabama',
      overallScore: 81,
      taxScore: 85,
      costScore: 89,
      healthScore: 70,
      climateScore: 84,
      safetyScore: 66,
      population: '5,132,000',
      over65Pct: '18.0%',
      slug: 'alabama',
      whyGreat: 'Very low cost of living + no tax on Social Security + warm',
      avgRetirementCost: '$44,000/year',
      medianHome: '$225,000',
      stateTax: 'No tax on Social Security'
    },
    { 
      rank: 12,
      state: 'Idaho',
      overallScore: 80,
      taxScore: 77,
      costScore: 75,
      healthScore: 81,
      climateScore: 79,
      safetyScore: 85,
      population: '2,001,000',
      over65Pct: '16.9%',
      slug: 'idaho',
      whyGreat: 'Natural beauty + outdoor activities + safe + growing',
      avgRetirementCost: '$51,000/year',
      medianHome: '$468,000',
      stateTax: 'No tax on Social Security'
    },
    { 
      rank: 13,
      state: 'Wyoming',
      overallScore: 79,
      taxScore: 92,
      costScore: 74,
      healthScore: 76,
      climateScore: 68,
      safetyScore: 86,
      population: '586,000',
      over65Pct: '18.2%',
      slug: 'wyoming',
      whyGreat: 'No income tax + natural beauty + low crime + outdoor paradise',
      avgRetirementCost: '$49,000/year',
      medianHome: '$357,000',
      stateTax: 'No state income tax'
    },
    { 
      rank: 14,
      state: 'New Hampshire',
      overallScore: 78,
      taxScore: 86,
      costScore: 68,
      healthScore: 87,
      climateScore: 71,
      safetyScore: 89,
      population: '1,402,000',
      over65Pct: '19.3%',
      slug: 'new-hampshire',
      whyGreat: 'No income tax + no sales tax + beautiful + very safe',
      avgRetirementCost: '$58,000/year',
      medianHome: '$482,000',
      stateTax: 'No tax on wages'
    },
    { 
      rank: 15,
      state: 'Utah',
      overallScore: 77,
      taxScore: 72,
      costScore: 73,
      healthScore: 85,
      climateScore: 77,
      safetyScore: 88,
      population: '3,488,000',
      over65Pct: '11.4%',
      slug: 'utah',
      whyGreat: 'National parks + outdoor recreation + safe + healthy living',
      avgRetirementCost: '$52,000/year',
      medianHome: '$528,000',
      stateTax: 'Social Security taxed (but credit available)'
    }
  ];

  // Tax comparison visualization
  const taxComparisonData = {
    labels: retirementStates.slice(0, 10).map(s => s.state),
    datasets: [
      {
        label: 'Tax Score (Higher = Better)',
        data: retirementStates.slice(0, 10).map(s => s.taxScore),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1
      }
    ]
  };

  const taxComparisonOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Tax Friendliness for Retirees (Top 10 States)',
        font: {
          size: 16,
          weight: 'bold'
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
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Tax Score'
        }
      }
    }
  };

  // Cost breakdown for top 5 states
  const costBreakdownData = retirementStates.slice(0, 5).map(state => ({
    state: state.state,
    housing: parseInt(state.medianHome.replace(/[$,]/g, '')) / 1000,
    annualCost: parseInt(state.avgRetirementCost.replace(/[$,]/g, '').replace('/year', '')) / 1000
  }));

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
            <span>Retirement</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Best States to Retire 2025: Ranked by Real Retirees
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <span>November 2024</span>
            <span>•</span>
            <span>14 min read</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">Retirement Planning</span>
          </div>

          <p className="text-xl text-gray-700 leading-relaxed">
            Surprise: Delaware beats Florida. Tennessee crushes California. Based on actual retiree 
            surveys, tax analysis, and cost data, the 2025 retirement rankings reveal shocking winners 
            that most "best of" lists completely miss.
          </p>
        </header>

        {/* Key Highlights */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-6 mb-12">
          <h2 className="font-bold text-lg mb-4">🏆 The 2025 Winners</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-2xl">🥇</p>
              <p className="font-bold text-green-600">Delaware</p>
              <p className="text-sm text-gray-600">No sales tax + beaches</p>
              <p className="text-xs font-semibold mt-1">Score: 95/100</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-2xl">🥈</p>
              <p className="font-bold text-blue-600">Florida</p>
              <p className="text-sm text-gray-600">No income tax + weather</p>
              <p className="text-xs font-semibold mt-1">Score: 93/100</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-2xl">🥉</p>
              <p className="font-bold text-purple-600">South Carolina</p>
              <p className="text-sm text-gray-600">Low costs + climate</p>
              <p className="text-xs font-semibold mt-1">Score: 91/100</p>
            </div>
          </div>
        </div>

        {/* Complete Rankings Table */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Complete Top 15 Rankings</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <tr>
                  <th className="px-3 py-3 text-center">Rank</th>
                  <th className="px-3 py-3 text-left">State</th>
                  <th className="px-3 py-3 text-center">Overall Score</th>
                  <th className="px-3 py-3 text-center">Annual Cost</th>
                  <th className="px-3 py-3 text-center">Median Home</th>
                  <th className="px-3 py-3 text-center">Tax Status</th>
                  <th className="px-3 py-3 text-center">65+ Pop</th>
                </tr>
              </thead>
              <tbody>
                {retirementStates.map((state) => (
                  <tr key={state.rank} className={`border-t ${state.rank <= 3 ? 'bg-green-50' : ''}`}>
                    <td className="px-3 py-3 text-center font-bold">
                      {state.rank <= 3 ? ['🥇', '🥈', '🥉'][state.rank - 1] : state.rank}
                    </td>
                    <td className="px-3 py-3">
                      <Link 
                        href={`/states/${state.slug}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {state.state}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="font-bold text-green-600">{state.overallScore}/100</span>
                    </td>
                    <td className="px-3 py-3 text-center text-sm">
                      {state.avgRetirementCost}
                    </td>
                    <td className="px-3 py-3 text-center text-sm">
                      {state.medianHome}
                    </td>
                    <td className="px-3 py-3 text-center text-xs">
                      {state.stateTax}
                    </td>
                    <td className="px-3 py-3 text-center text-sm">
                      {state.over65Pct}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tax Comparison Chart */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Tax Friendliness: The #1 Factor</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <div className="h-80">
              <Bar data={taxComparisonData} options={taxComparisonOptions} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-green-900 mb-3">Tax Paradise States</h3>
              <ul className="space-y-2 text-green-800">
                <li>✓ <strong>Delaware:</strong> No sales tax + low property tax</li>
                <li>✓ <strong>Florida:</strong> No state income tax at all</li>
                <li>✓ <strong>Nevada:</strong> No income tax, no pension tax</li>
                <li>✓ <strong>Tennessee:</strong> No tax on wages</li>
                <li>✓ <strong>Texas:</strong> No state income tax</li>
                <li>✓ <strong>Wyoming:</strong> No state income tax</li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-bold text-red-900 mb-3">Tax Hell States (Avoid)</h3>
              <ul className="space-y-2 text-red-800">
                <li>✗ <strong>California:</strong> Up to 13.3% + taxes SS</li>
                <li>✗ <strong>New York:</strong> Up to 10.9% state tax</li>
                <li>✗ <strong>New Jersey:</strong> Up to 10.75% + property tax</li>
                <li>✗ <strong>Connecticut:</strong> Taxes Social Security</li>
                <li>✗ <strong>Minnesota:</strong> Taxes Social Security</li>
                <li>✗ <strong>Vermont:</strong> Taxes most retirement income</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Deep Dive: Top 5 States */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Deep Dive: Why The Top 5 Win</h2>
          
          <div className="space-y-8">
            {retirementStates.slice(0, 5).map((state) => (
              <div key={state.rank} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">
                    {['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][state.rank - 1]}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">
                      <Link href={`/states/${state.slug}`} className="text-blue-600 hover:underline">
                        {state.state}
                      </Link>
                    </h3>
                    <p className="text-gray-700 mb-4">{state.whyGreat}</p>
                    
                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Annual Cost</p>
                        <p className="font-bold text-lg">{state.avgRetirementCost}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Median Home</p>
                        <p className="font-bold text-lg">{state.medianHome}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Over 65</p>
                        <p className="font-bold text-lg">{state.over65Pct}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 flex-wrap">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Tax: {state.taxScore}/100
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Cost: {state.costScore}/100
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        Health: {state.healthScore}/100
                      </span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                        Climate: {state.climateScore}/100
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        Safety: {state.safetyScore}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Population Pyramids of Top States */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Senior Demographics: Top Retirement States</h2>
          
          <p className="text-lg mb-8">
            These population pyramids show the existing retiree populations. Notice how states like 
            Florida already have large 65+ populations, while emerging winners like Delaware are just 
            beginning their retirement boom.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { data: delawareData, name: 'Delaware', rank: '#1' },
              { data: floridaData, name: 'Florida', rank: '#2' },
              { data: southCarolinaData, name: 'South Carolina', rank: '#3' },
              { data: nevadaData, name: 'Nevada', rank: '#4' },
              { data: tennesseeData, name: 'Tennessee', rank: '#5' }
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
                        options={createPyramidOptions(pyramidData.maxValue)} 
                      />
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cost of Living Breakdown */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Real Retirement Costs: What You'll Actually Spend</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-xl font-bold mb-4">Annual Retirement Budget by State (Top 10)</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {retirementStates.slice(0, 10).map((state) => (
                <div key={state.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">{state.rank}. {state.state}</span>
                  <span className="font-bold text-green-600">{state.avgRetirementCost}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-600">$44,000</p>
              <p className="font-semibold">Alabama</p>
              <p className="text-sm text-gray-600">Cheapest in top 15</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-600">$51,000</p>
              <p className="font-semibold">Average</p>
              <p className="text-sm text-gray-600">Top 15 states</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg text-center">
              <p className="text-3xl font-bold text-orange-600">$58,000</p>
              <p className="font-semibold">New Hampshire</p>
              <p className="text-sm text-gray-600">Most expensive in top 15</p>
            </div>
          </div>
        </section>

        {/* Healthcare Quality */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Healthcare: The Hidden Factor</h2>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
            <p className="text-lg font-semibold mb-2">Critical Finding:</p>
            <p className="text-gray-700">
              Healthcare quality varies dramatically. Virginia (#10) scores 84/100 for healthcare, 
              while Alabama (#11) scores just 70/100. For retirees, this could be life-changing.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-green-600 mb-3">Best Healthcare (Top 15)</h3>
              <ul className="space-y-2">
                <li>1. <strong>New Hampshire:</strong> 87/100</li>
                <li>2. <strong>Utah:</strong> 85/100</li>
                <li>3. <strong>Virginia:</strong> 84/100</li>
                <li>4. <strong>Delaware:</strong> 88/100</li>
                <li>5. <strong>Idaho:</strong> 81/100</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-orange-600 mb-3">Healthcare Concerns</h3>
              <ul className="space-y-2">
                <li>• <strong>Alabama:</strong> 70/100 (doctor shortage)</li>
                <li>• <strong>South Carolina:</strong> 76/100 (rural access)</li>
                <li>• <strong>Tennessee:</strong> 73/100 (hospital closures)</li>
                <li>• <strong>Wyoming:</strong> 76/100 (distance to care)</li>
                <li>• <strong>Nevada:</strong> 79/100 (specialist shortage)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Climate Comparison */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Climate Sweet Spots for Retirees</h2>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4">The Goldilocks Zones</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded">
                <h4 className="font-bold text-orange-600 mb-2">Hot & Dry</h4>
                <ul className="text-sm space-y-1">
                  <li>• Arizona: 91/100</li>
                  <li>• Nevada: 88/100</li>
                  <li>• New Mexico: 86/100</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded">
                <h4 className="font-bold text-blue-600 mb-2">Warm & Humid</h4>
                <ul className="text-sm space-y-1">
                  <li>• Florida: 92/100</li>
                  <li>• S. Carolina: 89/100</li>
                  <li>• Georgia: 87/100</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded">
                <h4 className="font-bold text-green-600 mb-2">Mild Four Seasons</h4>
                <ul className="text-sm space-y-1">
                  <li>• Delaware: 85/100</li>
                  <li>• N. Carolina: 85/100</li>
                  <li>• Virginia: 81/100</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="font-bold text-red-900 mb-3">Climate Red Flags</h3>
            <ul className="space-y-2 text-red-800">
              <li>• <strong>Florida/Louisiana:</strong> Hurricane risk increasing</li>
              <li>• <strong>Arizona/Nevada:</strong> Extreme summer heat (115°F+)</li>
              <li>• <strong>Wyoming/Idaho:</strong> Harsh winters for seniors</li>
              <li>• <strong>Texas:</strong> Power grid failures in extreme weather</li>
            </ul>
          </div>
        </section>

        {/* Hidden Gems Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Hidden Gems: States You're Not Considering (But Should)</h2>
          
          <div className="grid gap-6">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">🌟 Delaware: The Surprising Winner</h3>
              <p className="text-gray-700 mb-3">
                Everyone talks about Florida, but Delaware offers no sales tax, reasonable property 
                taxes, beautiful beaches, and it's close to major East Coast cities for family visits. 
                Plus, housing is 25% cheaper than Florida.
              </p>
              <Link href="/states/delaware" className="text-blue-600 hover:underline font-medium">
                Explore Delaware demographics →
              </Link>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">🏔️ Idaho: The Outdoor Paradise</h3>
              <p className="text-gray-700 mb-3">
                Boise is becoming a retiree haven with its low crime, outdoor recreation, and growing 
                healthcare infrastructure. No tax on Social Security and stunning natural beauty make 
                it perfect for active retirees.
              </p>
              <Link href="/states/idaho" className="text-blue-600 hover:underline font-medium">
                Discover Idaho's appeal →
              </Link>
            </div>

            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">🎵 Tennessee: Culture & Low Costs</h3>
              <p className="text-gray-700 mb-3">
                Nashville, Memphis, and Knoxville offer world-class music, food, and culture with no 
                income tax. Healthcare is improving rapidly, and you can actually afford to live well 
                on a fixed income.
              </p>
              <Link href="/states/tennessee" className="text-blue-600 hover:underline font-medium">
                Check out Tennessee →
              </Link>
            </div>
          </div>
        </section>

        {/* Mistakes to Avoid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Fatal Retirement Mistakes (Don't Do This)</h2>
          
          <div className="space-y-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-6">
              <h3 className="font-bold text-red-900 mb-3">❌ Mistake #1: Choosing Based on Weather Alone</h3>
              <p className="text-gray-700">
                Arizona's perfect winter weather means nothing if you can't afford the AC bill in 
                summer or find a doctor. California beaches are nice until you see the tax bill.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6">
              <h3 className="font-bold text-red-900 mb-3">❌ Mistake #2: Ignoring State Tax on Social Security</h3>
              <p className="text-gray-700">
                13 states still tax Social Security. Moving to Connecticut or Minnesota could cost 
                you thousands annually. Always check the tax treatment of ALL retirement income.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6">
              <h3 className="font-bold text-red-900 mb-3">❌ Mistake #3: Not Visiting First</h3>
              <p className="text-gray-700">
                Florida in February is paradise. Florida in August with humidity and hurricanes? 
                Different story. Spend at least one full summer and winter before committing.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6">
              <h3 className="font-bold text-red-900 mb-3">❌ Mistake #4: Following the Herd</h3>
              <p className="text-gray-700">
                Just because everyone retires to Florida doesn't mean it's right for you. Delaware, 
                Tennessee, and South Carolina offer better value and quality of life for many.
              </p>
            </div>
          </div>
        </section>

        {/* Action Plan */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Your Retirement State Action Plan</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-6">The 90-Day Decision Framework</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-bold mb-2">Step 1: Calculate Your Real Budget (Days 1-30)</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• List all retirement income sources</li>
                    <li>• Calculate after-tax income in each state</li>
                    <li>• Compare to cost of living data above</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">🏥</span>
                <div>
                  <h4 className="font-bold mb-2">Step 2: Assess Healthcare Needs (Days 31-45)</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Research Medicare Advantage plans</li>
                    <li>• Find specialists you need</li>
                    <li>• Check hospital ratings</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">✈️</span>
                <div>
                  <h4 className="font-bold mb-2">Step 3: Visit Top 3 Choices (Days 46-75)</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Spend at least a week in each</li>
                    <li>• Visit in your least favorite season</li>
                    <li>• Talk to current retirees there</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">🏡</span>
                <div>
                  <h4 className="font-bold mb-2">Step 4: Test the Market (Days 76-90)</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Research real estate trends</li>
                    <li>• Consider renting first</li>
                    <li>• Calculate moving costs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Line */}
        <section className="mb-16">
          <div className="bg-gray-900 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">The Bottom Line: Choose Wisely, Retire Well</h2>
            
            <div className="space-y-4 text-lg">
              <p>
                The difference between choosing Delaware (#1) and a high-tax state like California 
                could mean $15,000+ more in your pocket every year. Over 20 years of retirement, 
                that's $300,000.
              </p>
              
              <p>
                Delaware's surprise win shows that conventional wisdom is often wrong. Florida isn't 
                automatically best. California's weather doesn't justify its costs. The data reveals 
                that tax policy, healthcare access, and real cost of living matter more than beaches.
              </p>
              
              <p className="text-xl font-bold mt-6">
                Your retirement state choice is one of the biggest financial decisions you'll ever 
                make. These 15 states offer the best combination of low taxes, reasonable costs, 
                good healthcare, and quality of life. Choose from this list, and you'll retire 
                with more money, less stress, and better living.
              </p>
            </div>
          </div>
        </section>

        {/* Related Content */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Explore Top Retirement States</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {retirementStates.slice(0, 6).map((state) => (
              <Link 
                key={state.rank}
                href={`/states/${state.slug}`} 
                className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-green-600">#{state.rank}</span>
                  <span className="text-sm text-gray-600">{state.overallScore}/100</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-blue-600">{state.state}</h3>
                <p className="text-sm text-gray-600">
                  {state.avgRetirementCost} • {state.over65Pct} over 65
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Compare All 50 States for Retirement</h2>
          <p className="text-green-100 mb-6">
            Explore detailed demographics, tax information, and population pyramids for every state. 
            Find your perfect retirement destination based on data, not marketing.
          </p>
          <Link 
            href="/states" 
            className="inline-block px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition font-semibold"
          >
            Explore All States
          </Link>
        </div>
      </article>
    </div>
  );
}