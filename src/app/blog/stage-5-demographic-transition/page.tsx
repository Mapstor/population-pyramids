'use client';

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Link from 'next/link';

// Import country data
import japanData from '@/data/population/japan.json';
import southKoreaData from '@/data/population/south-korea.json';
import italyData from '@/data/population/italy.json';
import bulgariaDemoData from '@/data/population/bulgaria.json';

// Import comparison countries
import nigerData from '@/data/population/niger.json';
import kenyaData from '@/data/population/kenya.json';
import brazilData from '@/data/population/brazil.json';
import germanyData from '@/data/population/germany.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Stage5DemographicTransition = () => {
  // Prepare data for Stage 5 countries
  const japan2024Data = japanData.years['2024'];
  const southKorea2024Data = southKoreaData.years['2024'];
  const italy2024Data = italyData.years['2024'];
  const bulgaria2024Data = bulgariaDemoData.years['2024'];

  // Prepare comparison data
  const niger2024Data = nigerData.years['2024'];
  const kenya2024Data = kenyaData.years['2024'];
  const brazil2024Data = brazilData.years['2024'];
  const germany2024Data = germanyData.years['2024'];


  const createPyramidData = (countryData: any, title: string, color: string) => ({
    labels: countryData.ageGroups.map((ag: any) => ag.ageRange).reverse(),
    datasets: [
      {
        label: `${title} - Male`,
        data: countryData.ageGroups.map((ag: any) => -ag.male).reverse(),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      },
      {
        label: `${title} - Female`,
        data: countryData.ageGroups.map((ag: any) => ag.female).reverse(),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      },
    ],
  });

  const pyramidOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Population by Age and Gender (thousands)',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return Math.abs(value).toLocaleString();
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    tooltips: {
      callbacks: {
        label: function(context: any) {
          return `${context.dataset.label}: ${Math.abs(context.raw).toLocaleString()}`;
        },
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Stage 5 Demographic Transition: Declining Phase
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Understanding population decline through population pyramids of Japan, South Korea, Italy, and Bulgaria
          </p>
          <div className="text-sm text-gray-500">
            Published: November 13, 2025 | 
            <Link href="/blog/population-pyramid-stages-demographic-transition" className="text-blue-600 hover:underline ml-1">
              5-Stage Demographic Transition Overview
            </Link> | 
            <Link href="/blog/4-vs-5-stages-demographic-transition-model" className="text-blue-600 hover:underline ml-1">
              4 vs 5 Stage Models
            </Link>
          </div>
        </header>

        <div className="prose max-w-none">
          <h2>What is Stage 5 Demographic Transition?</h2>
          
          <p>
            Stage 5 of demographic transition, known as the Declining phase, represents the newest and most challenging 
            stage of population dynamics in developed nations. During this stage, <strong>birth rates fall significantly 
            below replacement level while death rates increase due to population aging</strong>, resulting in natural 
            population decline. The population structure shows an inverted pyramid or top-heavy shape, indicating 
            severe population aging and shrinking younger cohorts.
          </p>

          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 my-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Stage 5 Key Characteristics:</h3>
            <ul className="text-purple-700">
              <li><strong>Very low birth rates</strong> (6-10 per 1,000) - well below replacement level</li>
              <li><strong>Rising death rates</strong> (10-15+ per 1,000) - aging population mortality</li>
              <li><strong>Natural population decline</strong> (-0.5% to -1% annually)</li>
              <li><strong>Inverted population pyramid</strong> - more elderly than young</li>
              <li><strong>Extreme population aging</strong> (25%+ over 65)</li>
              <li><strong>Workforce shrinkage</strong> and dependency ratio crisis</li>
            </ul>
          </div>

          <h2>Stage 5 Countries: Population Pyramid Examples</h2>
          
          <p>
            Let's examine four countries experiencing Stage 5 demographic transition, each showing 
            the characteristic inverted or top-heavy population structure of post-transition societies:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Japan (Stage 5)</h3>
              <div style={{ height: '400px' }}>
                <Bar 
                  data={createPyramidData(japan2024Data, 'Japan', 'rgba(102, 16, 242, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Population:</strong> 123 million</p>
                <p><strong>Birth Rate:</strong> 7.0 per 1,000</p>
                <p><strong>Death Rate:</strong> 11.7 per 1,000</p>
                <p><strong>Growth Rate:</strong> -0.5% annually</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">South Korea (Stage 5)</h3>
              <div style={{ height: '400px' }}>
                <Bar 
                  data={createPyramidData(southKorea2024Data, 'South Korea', 'rgba(102, 16, 242, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Population:</strong> 51 million</p>
                <p><strong>Birth Rate:</strong> 5.9 per 1,000</p>
                <p><strong>Death Rate:</strong> 7.3 per 1,000</p>
                <p><strong>Growth Rate:</strong> -0.1% annually</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Italy (Stage 5)</h3>
              <div style={{ height: '400px' }}>
                <Bar 
                  data={createPyramidData(italy2024Data, 'Italy', 'rgba(102, 16, 242, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Population:</strong> 59 million</p>
                <p><strong>Birth Rate:</strong> 7.3 per 1,000</p>
                <p><strong>Death Rate:</strong> 10.7 per 1,000</p>
                <p><strong>Growth Rate:</strong> -0.3% annually</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Bulgaria (Stage 5)</h3>
              <div style={{ height: '400px' }}>
                <Bar 
                  data={createPyramidData(bulgaria2024Data, 'Bulgaria', 'rgba(102, 16, 242, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Population:</strong> 6.9 million</p>
                <p><strong>Birth Rate:</strong> 8.5 per 1,000</p>
                <p><strong>Death Rate:</strong> 15.4 per 1,000</p>
                <p><strong>Growth Rate:</strong> -0.7% annually</p>
              </div>
            </div>
          </div>

          <h2>Stage 5 vs Other Demographic Transition Stages</h2>
          
          <p>
            Stage 5 represents the extreme end of demographic transition - showing what happens when fertility 
            falls too far below replacement level. Let's compare it with earlier stages:
          </p>

          <h3>Stage 5 vs Stage 1: Opposite Extremes</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Japan (Stage 5) - Inverted Pyramid</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(japan2024Data, 'Japan', 'rgba(102, 16, 242, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Niger (Stage 1) - Classic Pyramid</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(niger2024Data, 'Niger', 'rgba(220, 53, 69, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
            <p className="text-blue-800">
              <strong>Key Difference:</strong> Japan's inverted structure shows extreme aging with more elderly than young, 
              while Niger's pyramid shows massive youth population with continued high fertility.
            </p>
          </div>

          <h3>Stage 5 vs Stage 2: Population Explosion vs Implosion</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">South Korea (Stage 5) - Population Implosion</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(southKorea2024Data, 'South Korea', 'rgba(102, 16, 242, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Kenya (Stage 2) - Population Explosion</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(kenya2024Data, 'Kenya', 'rgba(255, 152, 0, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
            <p className="text-blue-800">
              <strong>Key Difference:</strong> South Korea faces the world's lowest fertility rate leading to rapid population aging, 
              while Kenya's broad base indicates continued rapid population growth.
            </p>
          </div>

          <h3>Stage 5 vs Stage 3: Fertility Below vs Above Replacement</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Italy (Stage 5) - Below Replacement</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(italy2024Data, 'Italy', 'rgba(102, 16, 242, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Brazil (Stage 3) - Approaching Replacement</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(brazil2024Data, 'Brazil', 'rgba(255, 193, 7, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
            <p className="text-blue-800">
              <strong>Key Difference:</strong> Italy shows significant narrowing at the base with fertility well below replacement, 
              while Brazil maintains near-replacement fertility with more balanced age distribution.
            </p>
          </div>

          <h3>Stage 5 vs Stage 4: Stability vs Decline</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Bulgaria (Stage 5) - Rapid Decline</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(bulgaria2024Data, 'Bulgaria', 'rgba(102, 16, 242, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Germany (Stage 4) - Near Stability</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(germany2024Data, 'Germany', 'rgba(40, 167, 69, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
            <p className="text-blue-800">
              <strong>Key Difference:</strong> Bulgaria shows rapid population decline with emigration and low fertility, 
              while Germany maintains near-replacement levels avoiding severe population decline.
            </p>
          </div>

          <h2>What Drives Stage 5 Demographic Transition?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Economic Pressures</h3>
              <ul className="text-purple-700 space-y-2">
                <li>• Extremely high cost of raising children</li>
                <li>• Economic uncertainty and job market pressures</li>
                <li>• Housing affordability crises</li>
                <li>• Career prioritization over family formation</li>
                <li>• Economic stagnation reducing family confidence</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Social & Cultural Factors</h3>
              <ul className="text-purple-700 space-y-2">
                <li>• Changing attitudes toward marriage and children</li>
                <li>• Individual fulfillment prioritized over family</li>
                <li>• Gender role changes and work-life balance issues</li>
                <li>• Extended education delaying family formation</li>
                <li>• Social isolation and declining community support</li>
              </ul>
            </div>
          </div>

          <h2>The Stage 5 Crisis: Challenges and Consequences</h2>

          <div className="bg-red-50 border-l-4 border-red-400 p-6 my-6">
            <h3 className="text-lg font-semibold text-red-800 mb-3">Critical Challenges</h3>
            <div className="text-red-700 space-y-3">
              <p><strong>Economic Burden:</strong> Shrinking workforce supporting growing elderly population with unsustainable dependency ratios</p>
              <p><strong>Healthcare Crisis:</strong> Overwhelming demand for elderly care with insufficient young caregivers and healthcare workers</p>
              <p><strong>Pension Systems:</strong> Collapsing social security systems as few workers support many retirees</p>
              <p><strong>Innovation Decline:</strong> Aging societies may lose dynamism and entrepreneurial spirit</p>
              <p><strong>Rural Abandonment:</strong> Young people concentrating in cities, leaving rural areas depopulated</p>
              <p><strong>Cultural Continuity:</strong> Risk of cultural transmission gaps between shrinking generations</p>
            </div>
          </div>

          <h2>Policy Responses to Stage 5 Challenges</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">Pro-Natalist Policies</h3>
              <ul className="text-indigo-700 space-y-2">
                <li>• Generous parental leave and childcare support</li>
                <li>• Housing subsidies for families with children</li>
                <li>• Tax incentives and child allowances</li>
                <li>• Work-life balance legislation</li>
                <li>• Free or subsidized fertility treatments</li>
              </ul>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">Adaptation Strategies</h3>
              <ul className="text-indigo-700 space-y-2">
                <li>• Immigration policies to maintain workforce</li>
                <li>• Automation and AI to replace human workers</li>
                <li>• Pension reform and retirement age increases</li>
                <li>• Healthcare system restructuring</li>
                <li>• Regional consolidation and urban planning</li>
              </ul>
            </div>
          </div>

          <h2>Can Countries Reverse Stage 5?</h2>
          
          <p>
            The question of whether Stage 5 is reversible remains open. Historical evidence suggests that:
          </p>

          <ul className="list-disc pl-6 my-4">
            <li><strong>France's Success:</strong> Reversed fertility decline through comprehensive family support policies</li>
            <li><strong>Nordic Models:</strong> Sweden, Denmark maintaining higher fertility through generous welfare states</li>
            <li><strong>Immigration Solutions:</strong> Countries like Canada maintaining population growth through selective immigration</li>
            <li><strong>Cultural Factors:</strong> Some societies (Israel, certain US communities) maintain high fertility despite development</li>
          </ul>

          <div className="bg-orange-50 border-l-4 border-orange-400 p-6 my-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-3">Stage 5 Policy Requirements</h3>
            <p className="text-orange-700">
              Successfully addressing Stage 5 requires comprehensive policy packages combining generous family support, 
              immigration integration, economic adaptation, and cultural change. No single policy has proven sufficient 
              to reverse very low fertility, requiring sustained, multi-generational commitment to demographic recovery.
            </p>
          </div>

          <h2>The Future of Stage 5 Societies</h2>
          
          <p>
            Stage 5 societies face three potential paths:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Demographic Recovery</h3>
              <p className="text-sm text-gray-600">Successful policy interventions raise fertility back toward replacement level</p>
            </div>
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Managed Decline</h3>
              <p className="text-sm text-gray-600">Adaptation to smaller, older populations through technology and immigration</p>
            </div>
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Demographic Collapse</h3>
              <p className="text-sm text-gray-600">Continued decline leading to societal dysfunction and economic crisis</p>
            </div>
          </div>

          <div className="bg-violet-50 border-l-4 border-violet-400 p-6 my-6">
            <h3 className="text-lg font-semibold text-violet-800 mb-3">Stage 5 Lessons</h3>
            <p className="text-violet-700">
              Stage 5 demographic transition demonstrates that development doesn't automatically lead to population stability. 
              It requires active policy intervention to maintain replacement-level fertility while preserving the benefits 
              of advanced development. The goal is achieving sustainable population stability rather than extreme aging.
            </p>
          </div>

          <h2>Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
            <Link href="/blog/stage-4-demographic-transition" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-green-600">Stage 4: Low Stationary</h3>
              <p className="text-sm text-gray-600 mt-2">Population stability in developed nations</p>
            </Link>
            <Link href="/blog/4-vs-5-stages-demographic-transition-model" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-blue-600">4 vs 5 Stage Models</h3>
              <p className="text-sm text-gray-600 mt-2">Understanding when Stage 5 applies</p>
            </Link>
            <Link href="/blog/population-pyramid-stages-demographic-transition" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-indigo-600">5-Stage Overview</h3>
              <p className="text-sm text-gray-600 mt-2">Complete demographic transition journey</p>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default Stage5DemographicTransition;