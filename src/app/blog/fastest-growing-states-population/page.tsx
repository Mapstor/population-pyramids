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

export default function FastestGrowingStatesArticle() {
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
        beginAtZero: true,
        max: maxValue ? maxValue * 1.1 : undefined,
        min: maxValue ? -maxValue * 1.1 : undefined,
        ticks: {
          callback: function(value) {
            return Math.abs(Number(value)).toLocaleString();
          }
        }
      },
      y: {
        beginAtZero: true
      }
    }
  });

  // Population data for analysis
  const texasGrowth = texas2024Data?.totalPopulation - texas2000Data?.totalPopulation;
  const floridaGrowth = florida2024Data?.totalPopulation - florida2000Data?.totalPopulation;
  const californiaGrowth = california2024Data?.totalPopulation - california2000Data?.totalPopulation;

  // Growth rate calculations
  const texasGrowthRate = ((texas2024Data?.totalPopulation - texas2000Data?.totalPopulation) / texas2000Data?.totalPopulation * 100).toFixed(1);
  const floridaGrowthRate = ((florida2024Data?.totalPopulation - florida2000Data?.totalPopulation) / florida2000Data?.totalPopulation * 100).toFixed(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fastest Growing States: Texas Leads Population Boom
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Analyzing the fastest growing states by population growth, with Texas adding over 10 million residents since 2000
          </p>
          <div className="text-sm text-gray-500">
            Published: November 13, 2025 | 
            <Link href="/blog/nevada-west-virginia-population-gap" className="text-blue-600 hover:underline ml-1">
              State Population Differences
            </Link> | 
            <Link href="/blog/best-states-retire" className="text-blue-600 hover:underline ml-1">
              Migration Trends
            </Link>
          </div>
        </header>

        <div className="prose max-w-none">
          <h2>The Fastest Growing States in America</h2>
          
          <p>
            When examining the <strong>fastest growing states</strong> in America, Texas stands out as the undisputed leader in population growth. 
            Over the past two decades, Texas has added an astounding {texasGrowth?.toLocaleString()} new residents—equivalent to adding 
            the entire population of Michigan to the Lone Star State.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Top 5 Fastest Growing States by Total Population Growth (2000-2024):</h3>
            <ol className="text-blue-700 list-decimal list-inside">
              <li><strong>Texas:</strong> +{texasGrowth?.toLocaleString()} people ({texasGrowthRate}% growth)</li>
              <li><strong>Florida:</strong> +{floridaGrowth?.toLocaleString()} people ({floridaGrowthRate}% growth)</li>
              <li><strong>California:</strong> +{californiaGrowth?.toLocaleString()} people</li>
              <li><strong>North Carolina:</strong> +4.2 million people</li>
              <li><strong>Georgia:</strong> +3.8 million people</li>
            </ol>
          </div>

          <h2>Texas: The Ultimate Population Growth Success Story</h2>
          
          <p>
            Among the <strong>states with the fastest growing population</strong>, Texas exemplifies what drives massive population growth. 
            The state's combination of economic opportunity, affordable housing, business-friendly policies, and no state income tax has 
            created a population magnet that attracts residents from across the nation.
          </p>

          <div className="my-8">
            <h3 className="text-xl font-semibold mb-4 text-center">Texas Population Pyramid: 2024</h3>
            <div style={{ height: '500px' }}>
              {texas2024Data && (
                <Bar 
                  data={createPyramidData(texas2024Data, 'Texas')} 
                  options={createPyramidOptions(createPyramidData(texas2024Data, 'Texas')?.maxValue)} 
                />
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              <strong>Texas 2024:</strong> {texas2024Data?.totalPopulation?.toLocaleString()} total population
            </p>
          </div>

          <h2>Comparing Fastest Growing States Population Structures</h2>
          
          <p>
            The demographic profiles of the <strong>fastest growing states population</strong> reveal interesting patterns. 
            States experiencing rapid growth often show broader population pyramids in working-age groups, indicating 
            strong economic migration of families and young professionals.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Texas: #1 in Population Growth</h3>
              <div style={{ height: '400px' }}>
                {texas2024Data && (
                  <Bar 
                    data={createPyramidData(texas2024Data, 'Texas')} 
                    options={createPyramidOptions()} 
                  />
                )}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>2024 Population:</strong> {texas2024Data?.totalPopulation?.toLocaleString()}</p>
                <p><strong>Growth Since 2000:</strong> +{texasGrowth?.toLocaleString()}</p>
                <p><strong>Growth Rate:</strong> {texasGrowthRate}%</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Florida: #2 in Population Growth</h3>
              <div style={{ height: '400px' }}>
                {florida2024Data && (
                  <Bar 
                    data={createPyramidData(florida2024Data, 'Florida')} 
                    options={createPyramidOptions()} 
                  />
                )}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>2024 Population:</strong> {florida2024Data?.totalPopulation?.toLocaleString()}</p>
                <p><strong>Growth Since 2000:</strong> +{floridaGrowth?.toLocaleString()}</p>
                <p><strong>Growth Rate:</strong> {floridaGrowthRate}%</p>
              </div>
            </div>
          </div>

          <h2>What Makes States Among the Fastest Growing?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Economic Drivers</h3>
              <ul className="text-green-700 space-y-2">
                <li>• Strong job markets and business growth</li>
                <li>• Lower cost of living compared to coastal states</li>
                <li>• Business-friendly tax policies</li>
                <li>• Major corporate relocations and expansions</li>
                <li>• Energy sector opportunities (Texas, North Dakota)</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Quality of Life Factors</h3>
              <ul className="text-blue-700 space-y-2">
                <li>• Affordable housing markets</li>
                <li>• Pleasant year-round climate (Sun Belt states)</li>
                <li>• Lower population density</li>
                <li>• Strong infrastructure development</li>
                <li>• Family-friendly communities</li>
              </ul>
            </div>
          </div>

          <h2>The Scale of Growth: Comparing to Entire States</h2>
          
          <p>
            To understand the massive scale of population growth in the <strong>fastest growing states</strong>, 
            consider that Texas alone has added more people since 2000 than the entire current population of Michigan. 
            This growth represents one of the largest internal migration patterns in American history.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Growth Comparison: Texas vs Michigan</h3>
              <div style={{ height: '300px' }}>
                {michigan2024Data && (
                  <Bar 
                    data={createPyramidData(michigan2024Data, 'Michigan')} 
                    options={createPyramidOptions()} 
                  />
                )}
              </div>
              <div className="mt-4 text-sm text-gray-600 text-center">
                <p><strong>Michigan Total Population:</strong> {michigan2024Data?.totalPopulation?.toLocaleString()}</p>
                <p className="text-green-600 font-semibold">Texas Growth = Entire Michigan Population!</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">California: Still Growing Despite Challenges</h3>
              <div style={{ height: '300px' }}>
                {california2024Data && (
                  <Bar 
                    data={createPyramidData(california2024Data, 'California')} 
                    options={createPyramidOptions()} 
                  />
                )}
              </div>
              <div className="mt-4 text-sm text-gray-600 text-center">
                <p><strong>California Population:</strong> {california2024Data?.totalPopulation?.toLocaleString()}</p>
                <p><strong>Growth Since 2000:</strong> +{californiaGrowth?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <h2>Regional Patterns in Population Growth</h2>
          
          <p>
            The <strong>fastest growing states population</strong> data reveals clear regional patterns. Sun Belt states 
            dominate the growth rankings, while traditional industrial states in the Northeast and Midwest have 
            experienced much slower growth or even population decline.
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 my-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-3">Regional Growth Patterns:</h3>
            <div className="text-amber-700 space-y-2">
              <p><strong>Sun Belt Dominance:</strong> Texas, Florida, Arizona, and Nevada lead in both total growth and growth rates</p>
              <p><strong>Mountain West Surge:</strong> Utah, Colorado, and Idaho show exceptional percentage growth rates</p>
              <p><strong>Traditional Centers Lag:</strong> New York, Illinois, and Pennsylvania show minimal growth or decline</p>
              <p><strong>Coastal California Paradox:</strong> High population but slowing growth due to housing costs</p>
            </div>
          </div>

          <h2>Future Projections for Fastest Growing States</h2>
          
          <p>
            Current demographic trends suggest the <strong>states with the fastest growing population</strong> will continue 
            to be in the South and West. Climate preferences, economic opportunities, and housing affordability will 
            likely maintain these regional advantages for the foreseeable future.
          </p>

          <h3>Key Factors Sustaining Growth:</h3>
          <ul className="list-disc pl-6 my-4">
            <li><strong>Remote Work Revolution:</strong> Allowing people to move to lower-cost areas while keeping high-paying jobs</li>
            <li><strong>Corporate Relocations:</strong> Major companies moving headquarters to business-friendly states</li>
            <li><strong>Retirement Migration:</strong> Baby Boomers moving to warmer, tax-friendly states</li>
            <li><strong>International Immigration:</strong> Gateway states continuing to attract new Americans</li>
            <li><strong>Energy Sector Growth:</strong> Oil, gas, and renewable energy job creation</li>
          </ul>

          <div className="bg-green-50 border-l-4 border-green-400 p-6 my-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">The Bottom Line</h3>
            <p className="text-green-700">
              The <strong>fastest growing states</strong> represent America's economic and demographic future. Texas leads 
              this transformation, having added an entire Michigan's worth of new residents while maintaining strong 
              economic growth and quality of life. Understanding these patterns helps predict where opportunity, 
              investment, and innovation will concentrate in the coming decades.
            </p>
          </div>

          <h2>Related Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <Link href="/blog/nevada-west-virginia-population-gap" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-blue-600">Population Winners & Losers</h3>
              <p className="text-sm text-gray-600 mt-2">Comparing states with the biggest population gains and losses</p>
            </Link>
            <Link href="/blog/best-states-retire" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-green-600">Retirement Migration</h3>
              <p className="text-sm text-gray-600 mt-2">How retirees are driving population growth in certain states</p>
            </Link>
            <Link href="/blog/half-states-under-35-youth-vs-senior-america" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-purple-600">Age Demographics</h3>
              <p className="text-sm text-gray-600 mt-2">Young vs aging states and their growth patterns</p>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};