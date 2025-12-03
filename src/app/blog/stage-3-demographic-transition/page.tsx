'use client';

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Link from 'next/link';

// Import country data
import brazilData from '@/data/population/brazil.json';
import iranData from '@/data/population/iran.json';
import mexicoData from '@/data/population/mexico.json';
import turkeyData from '@/data/population/turkey.json';

// Import comparison countries
import nigerData from '@/data/population/niger.json';
import kenyaData from '@/data/population/kenya.json';
import germanyData from '@/data/population/germany.json';
import japanData from '@/data/population/japan.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Stage3DemographicTransition = () => {
  // Prepare data for Stage 3 countries
  const brazil2024Data = brazilData.years['2024'];
  const iran2024Data = iranData.years['2024'];
  const mexico2024Data = mexicoData.years['2024'];
  const turkey2024Data = turkeyData.years['2024'];

  // Prepare comparison data
  const niger2024Data = nigerData.years['2024'];
  const kenya2024Data = kenyaData.years['2024'];
  const germany2024Data = germanyData.years['2024'];
  const japan2024Data = japanData.years['2024'];


  const createPyramidData = (countryData: any, title: string, color: string) => ({
    labels: countryData.ageGroups.map((ag: any) => ag.ageRange).reverse(),
    datasets: [
      {
        label: 'Male',
        data: countryData.ageGroups.map((ag: any) => -ag.male).reverse(),
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue for males
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 0,
        barPercentage: 0.95,
        categoryPercentage: 1.0,
        barThickness: 'flex',
      },
      {
        label: 'Female',
        data: countryData.ageGroups.map((ag: any) => ag.female).reverse(),
        backgroundColor: 'rgba(236, 72, 153, 0.8)', // Pink for females
        borderColor: 'rgba(236, 72, 153, 1)',
        borderWidth: 0,
        barPercentage: 0.95,
        categoryPercentage: 1.0,
        barThickness: 'flex',
      },
    ],
  });

  const pyramidOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Population by Age and Gender (thousands)',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = Math.abs(context.parsed.x);
            if (context.dataset.label?.includes('Surplus')) {
              return `${context.dataset.label}: ${value.toLocaleString()}`;
            }
            return `${context.dataset.label}: ${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: function(value: any) {
            return Math.abs(value).toLocaleString();
          },
        },
      },
      y: {
        stacked: true,
      },
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Stage 3 Demographic Transition: Late Expanding Phase
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Understanding the late expanding phase through population pyramids of Brazil, Iran, Mexico, and Turkey
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
          <h2>What is Stage 3 Demographic Transition?</h2>
          
          <p>
            Stage 3 of demographic transition, known as the Late Expanding phase, represents a critical turning point 
            in a country's population dynamics. During this stage, <strong>birth rates begin to decline significantly 
            while death rates continue to fall or stabilize at low levels</strong>. This creates a distinctive 
            population structure that resembles a barrel or cylinder more than the classic pyramid shape.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Stage 3 Key Characteristics:</h3>
            <ul className="text-yellow-700">
              <li><strong>Declining birth rates</strong> (15-25 per 1,000)</li>
              <li><strong>Low death rates</strong> (8-15 per 1,000)</li>
              <li><strong>Slowing population growth</strong> (1-2% annually)</li>
              <li><strong>Rectangular population pyramid</strong> - wider middle, narrower base</li>
              <li><strong>Urbanization and education</strong> drive fertility decline</li>
              <li><strong>Beginning of population aging</strong></li>
            </ul>
          </div>

          <h2>Stage 3 Countries: Population Pyramid Examples</h2>
          
          <p>
            Let's examine four countries currently in Stage 3 of demographic transition, each showing 
            the characteristic rectangular or barrel-shaped population structure:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Brazil (Stage 3)</h3>
              <div style={{ height: '400px' }}>
                <Bar 
                  data={createPyramidData(brazil2024Data, 'Brazil', 'rgba(255, 193, 7, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Population:</strong> 216 million</p>
                <p><strong>Birth Rate:</strong> 14.1 per 1,000</p>
                <p><strong>Death Rate:</strong> 6.7 per 1,000</p>
                <p><strong>Growth Rate:</strong> 0.7% annually</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Iran (Stage 3)</h3>
              <div style={{ height: '400px' }}>
                <Bar 
                  data={createPyramidData(iran2024Data, 'Iran', 'rgba(255, 193, 7, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Population:</strong> 86 million</p>
                <p><strong>Birth Rate:</strong> 16.2 per 1,000</p>
                <p><strong>Death Rate:</strong> 5.3 per 1,000</p>
                <p><strong>Growth Rate:</strong> 1.1% annually</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Mexico (Stage 3)</h3>
              <div style={{ height: '400px' }}>
                <Bar 
                  data={createPyramidData(mexico2024Data, 'Mexico', 'rgba(255, 193, 7, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Population:</strong> 131 million</p>
                <p><strong>Birth Rate:</strong> 17.6 per 1,000</p>
                <p><strong>Death Rate:</strong> 5.4 per 1,000</p>
                <p><strong>Growth Rate:</strong> 1.2% annually</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Turkey (Stage 3)</h3>
              <div style={{ height: '400px' }}>
                <Bar 
                  data={createPyramidData(turkey2024Data, 'Turkey', 'rgba(255, 193, 7, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Population:</strong> 85 million</p>
                <p><strong>Birth Rate:</strong> 15.4 per 1,000</p>
                <p><strong>Death Rate:</strong> 6.1 per 1,000</p>
                <p><strong>Growth Rate:</strong> 0.9% annually</p>
              </div>
            </div>
          </div>

          <h2>Stage 3 vs Other Demographic Transition Stages</h2>
          
          <p>
            To understand Stage 3's unique characteristics, let's compare it with countries in other demographic stages:
          </p>

          <h3>Stage 3 vs Stage 1: From Pyramid to Rectangle</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Brazil (Stage 3) - Rectangular Shape</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(brazil2024Data, 'Brazil', 'rgba(255, 193, 7, 0.8)')} 
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
              <strong>Key Difference:</strong> Brazil's rectangular shape shows declining fertility and aging population, 
              while Niger's pyramid shows continued high birth rates and young population structure.
            </p>
          </div>

          <h3>Stage 3 vs Stage 2: Fertility Decline Begins</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Iran (Stage 3) - Base Narrowing</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(iran2024Data, 'Iran', 'rgba(255, 193, 7, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Kenya (Stage 2) - Broad Base</h4>
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
              <strong>Key Difference:</strong> Iran shows clear narrowing at the base (fewer young children), 
              while Kenya maintains the broad base typical of Stage 2's population explosion.
            </p>
          </div>

          <h3>Stage 3 vs Stage 4: Approaching Stability</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Mexico (Stage 3) - Still Growing</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(mexico2024Data, 'Mexico', 'rgba(255, 193, 7, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Germany (Stage 4) - Stable Population</h4>
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
              <strong>Key Difference:</strong> Mexico still shows population momentum with broader younger cohorts, 
              while Germany has achieved near-replacement level fertility with a more uniform age distribution.
            </p>
          </div>

          <h3>Stage 3 vs Stage 5: Population Aging Trajectory</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Turkey (Stage 3) - Beginning to Age</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(turkey2024Data, 'Turkey', 'rgba(255, 193, 7, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-center">Japan (Stage 5) - Advanced Aging</h4>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={createPyramidData(japan2024Data, 'Japan', 'rgba(102, 16, 242, 0.8)')} 
                  options={pyramidOptions} 
                />
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
            <p className="text-blue-800">
              <strong>Key Difference:</strong> Turkey shows early signs of population aging but maintains replacement-level fertility, 
              while Japan displays extreme population aging with an inverted pyramid structure.
            </p>
          </div>

          <h2>What Drives Stage 3 Demographic Transition?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Economic Factors</h3>
              <ul className="text-yellow-700 space-y-2">
                <li>• Rising incomes and living standards</li>
                <li>• Urbanization and industrialization</li>
                <li>• Increased cost of raising children</li>
                <li>• Women's participation in workforce</li>
                <li>• Economic incentives for smaller families</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Social & Cultural Changes</h3>
              <ul className="text-yellow-700 space-y-2">
                <li>• Improved education, especially for women</li>
                <li>• Access to family planning services</li>
                <li>• Changing family values and structures</li>
                <li>• Delayed marriage and childbearing</li>
                <li>• Quality vs quantity of children preference</li>
              </ul>
            </div>
          </div>

          <h2>Policy Challenges in Stage 3 Countries</h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 my-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-3">Key Policy Areas</h3>
            <div className="text-amber-700 space-y-3">
              <p><strong>Education Planning:</strong> Managing the demographic dividend as large youth cohorts enter the workforce</p>
              <p><strong>Healthcare Systems:</strong> Preparing for gradual population aging while maintaining maternal and child health services</p>
              <p><strong>Economic Development:</strong> Leveraging the working-age population bulge for economic growth</p>
              <p><strong>Urban Planning:</strong> Managing continued urbanization and internal migration patterns</p>
              <p><strong>Social Security:</strong> Beginning to plan for future aging populations and pension systems</p>
            </div>
          </div>

          <h2>Transition Timeline: Moving Toward Stage 4</h2>
          
          <p>
            Stage 3 countries are typically 10-30 years away from achieving Stage 4 stability. The transition depends on:
          </p>

          <ul className="list-disc pl-6 my-4">
            <li><strong>Continued economic development</strong> and rising living standards</li>
            <li><strong>Educational advancement</strong>, particularly female education completion rates</li>
            <li><strong>Healthcare access</strong> and family planning availability</li>
            <li><strong>Cultural adaptation</strong> to smaller family norms</li>
            <li><strong>Government policies</strong> supporting the demographic transition</li>
          </ul>

          <div className="bg-green-50 border-l-4 border-green-400 p-6 my-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Stage 3 Success Indicators</h3>
            <p className="text-green-700">
              Countries successfully progressing through Stage 3 show declining total fertility rates (approaching 2.1), 
              stable institutions, growing middle class, and effective governance that can manage both the opportunities 
              and challenges of demographic change.
            </p>
          </div>

          <h2>Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
            <Link href="/blog/stage-1-demographic-transition" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-red-600">Stage 1: High Stationary</h3>
              <p className="text-sm text-gray-600 mt-2">Pre-industrial societies with high birth and death rates</p>
            </Link>
            <Link href="/blog/stage-2-demographic-transition" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-orange-600">Stage 2: Early Expanding</h3>
              <p className="text-sm text-gray-600 mt-2">Population explosion phase with declining death rates</p>
            </Link>
            <Link href="/blog/4-stages-demographic-transition-model" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-blue-600">4-Stage Model Overview</h3>
              <p className="text-sm text-gray-600 mt-2">Complete overview of the classic demographic transition model</p>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default Stage3DemographicTransition;