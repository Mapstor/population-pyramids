'use client';

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Link from 'next/link';

// Import country data for oldest countries
import japanData from '@/data/population/japan.json';
import italyData from '@/data/population/italy.json';
import germanyData from '@/data/population/germany.json';
import portugalData from '@/data/population/portugal.json';
import finlandData from '@/data/population/finland.json';
import bulgariaDemoData from '@/data/population/bulgaria.json';
import croatiaData from '@/data/population/croatia.json';
import sloveniaData from '@/data/population/slovenia.json';
import austriaData from '@/data/population/austria.json';

// Import comparison countries (youngest)
import nigerData from '@/data/population/niger.json';
import ugandaData from '@/data/population/uganda.json';
import chadData from '@/data/population/chad.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function OldestCountriesWorld() {
  // Prepare data for oldest countries
  const japan2024Data = japanData.years['2024'];
  const italy2024Data = italyData.years['2024'];
  const germany2024Data = germanyData.years['2024'];
  const portugal2024Data = portugalData.years['2024'];
  const finland2024Data = finlandData.years['2024'];
  const bulgaria2024Data = bulgariaDemoData.years['2024'];
  const croatia2024Data = croatiaData.years['2024'];
  const slovenia2024Data = sloveniaData.years['2024'];
  const austria2024Data = austriaData.years['2024'];

  // Prepare comparison data (youngest countries)
  const niger2024Data = nigerData.years['2024'];
  const uganda2024Data = ugandaData.years['2024'];
  const chad2024Data = chadData.years['2024'];

  const aggregateAgeGroups85Plus = (ageGroups: any[]) => {
    const under85 = ageGroups.filter(ag => !['85-89', '90-94', '95-99', '100+'].includes(ag.ageRange));
    const over85 = ageGroups.filter(ag => ['85-89', '90-94', '95-99', '100+'].includes(ag.ageRange));
    
    const aggregated85Plus = {
      ageRange: '85+',
      male: over85.reduce((sum, ag) => sum + ag.male, 0),
      female: over85.reduce((sum, ag) => sum + ag.female, 0),
      total: over85.reduce((sum, ag) => sum + ag.total, 0)
    };
    
    return [...under85, aggregated85Plus];
  };

  const createPyramidData = (countryData: any, title: string, color: string) => {
    if (!countryData) return null;

    const aggregatedAgeGroups = aggregateAgeGroups85Plus(countryData.ageGroups);
    
    return {
      labels: aggregatedAgeGroups.map((ag: any) => ag.ageRange).reverse(),
      datasets: [
        {
          label: `${title} - Male`,
          data: aggregatedAgeGroups.map((ag: any) => -ag.male).reverse(),
          backgroundColor: color,
          borderColor: color,
          borderWidth: 3,
        },
        {
          label: `${title} - Female`,
          data: aggregatedAgeGroups.map((ag: any) => ag.female).reverse(),
          backgroundColor: color,
          borderColor: color,
          borderWidth: 3,
        },
      ],
    };
  };

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
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return Math.abs(value).toLocaleString();
          },
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            9 Oldest Countries in the World: Japan, Italy, Germany Lead Global Aging
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Analyzing the oldest countries by population age, examining demographic trends and aging population challenges worldwide
          </p>
          <div className="text-sm text-gray-500">
            Published: November 13, 2025 | 
            <Link href="/blog/stage-5-demographic-transition" className="text-blue-600 hover:underline ml-1">
              Stage 5 Demographics
            </Link> | 
            <Link href="/blog/4-vs-5-stages-demographic-transition-model" className="text-blue-600 hover:underline ml-1">
              Population Decline
            </Link>
          </div>
        </header>

        <div className="prose max-w-none">
          <h2>The World's Oldest Countries: A Demographic Revolution</h2>
          
          <p>
            The <strong>oldest countries in the world</strong> are experiencing an unprecedented demographic transformation. 
            Led by Japan, Italy, and Germany, these nations represent the future that awaits many developed countries as 
            birth rates plummet and life expectancy extends. Understanding the <strong>oldest countries</strong> provides 
            crucial insights into global aging trends and their societal implications.
          </p>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Top 9 Oldest Countries by Median Age (2024):</h3>
            <ol className="text-red-700 list-decimal list-inside space-y-1">
              <li><strong>Japan:</strong> 49.1 years median age</li>
              <li><strong>Italy:</strong> 47.4 years median age</li>
              <li><strong>Germany:</strong> 45.8 years median age</li>
              <li><strong>Portugal:</strong> 45.2 years median age</li>
              <li><strong>Finland:</strong> 42.8 years median age</li>
              <li><strong>Bulgaria:</strong> 42.7 years median age</li>
              <li><strong>Croatia:</strong> 42.4 years median age</li>
              <li><strong>Slovenia:</strong> 42.2 years median age</li>
              <li><strong>Austria:</strong> 42.0 years median age</li>
            </ol>
          </div>

          <h2>Japan: The World's Oldest Country</h2>
          
          <p>
            Japan stands as the undisputed leader among the <strong>oldest countries</strong>, with nearly half its population 
            over 49 years old. This demographic profile creates a distinctive inverted population pyramid that signals 
            the challenges facing the world's most aged society.
          </p>

          <div className="my-8">
            <h3 className="text-xl font-semibold mb-4 text-center">Japan: World's Oldest Country Population Structure</h3>
            <div style={{ height: '500px' }}>
              {japan2024Data && (
                <Bar 
                  data={createPyramidData(japan2024Data, 'Japan', 'rgba(102, 16, 242, 0.8)')} 
                  options={pyramidOptions} 
                />
              )}
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p><strong>Japan 2024:</strong> {japan2024Data?.totalPopulation?.toLocaleString()} population | Median Age: 49.1 years</p>
              <p><strong>65+ Population:</strong> 29.8% | <strong>Birth Rate:</strong> 7.0 per 1,000</p>
            </div>
          </div>

          <h2>Top 3 Oldest Countries: Population Pyramid Comparison</h2>
          
          <p>
            The three <strong>oldest countries in the world</strong> - Japan, Italy, and Germany - each display unique 
            demographic patterns despite similar aging challenges. Their population pyramids reveal different stages 
            of demographic transition and varying approaches to population decline.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">#1 Japan - Extreme Aging</h3>
              <div style={{ height: '400px' }}>
                {japan2024Data && (
                  <Bar 
                    data={createPyramidData(japan2024Data, 'Japan', 'rgba(102, 16, 242, 0.8)')} 
                    options={pyramidOptions} 
                  />
                )}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Population:</strong> {japan2024Data?.totalPopulation?.toLocaleString()}</p>
                <p><strong>Median Age:</strong> 49.1 years</p>
                <p><strong>65+ Population:</strong> 29.8%</p>
                <p><strong>Birth Rate:</strong> 7.0 per 1,000</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">#2 Italy - Mediterranean Aging</h3>
              <div style={{ height: '400px' }}>
                {italy2024Data && (
                  <Bar 
                    data={createPyramidData(italy2024Data, 'Italy', 'rgba(220, 53, 69, 0.8)')} 
                    options={pyramidOptions} 
                  />
                )}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Population:</strong> {italy2024Data?.totalPopulation?.toLocaleString()}</p>
                <p><strong>Median Age:</strong> 47.4 years</p>
                <p><strong>65+ Population:</strong> 23.6%</p>
                <p><strong>Birth Rate:</strong> 7.3 per 1,000</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">#3 Germany - Managed Decline</h3>
              <div style={{ height: '400px' }}>
                {germany2024Data && (
                  <Bar 
                    data={createPyramidData(germany2024Data, 'Germany', 'rgba(255, 193, 7, 0.8)')} 
                    options={pyramidOptions} 
                  />
                )}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Population:</strong> {germany2024Data?.totalPopulation?.toLocaleString()}</p>
                <p><strong>Median Age:</strong> 45.8 years</p>
                <p><strong>65+ Population:</strong> 22.1%</p>
                <p><strong>Birth Rate:</strong> 9.4 per 1,000</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">#4 Portugal - Iberian Aging</h3>
              <div style={{ height: '400px' }}>
                {portugal2024Data && (
                  <Bar 
                    data={createPyramidData(portugal2024Data, 'Portugal', 'rgba(34, 197, 94, 0.8)')} 
                    options={pyramidOptions} 
                  />
                )}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Population:</strong> {portugal2024Data?.totalPopulation?.toLocaleString()}</p>
                <p><strong>Median Age:</strong> 45.2 years</p>
                <p><strong>65+ Population:</strong> 23.4%</p>
                <p><strong>Birth Rate:</strong> 8.2 per 1,000</p>
              </div>
            </div>
          </div>

          <h2>European Dominance Among Oldest Countries</h2>
          
          <p>
            Of the world's <strong>oldest countries</strong>, eight out of nine are located in Europe, reflecting the continent's 
            advanced demographic transition. This concentration demonstrates how economic development, social welfare systems, 
            and cultural changes have combined to create unprecedented population aging across European nations.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Finland - Nordic Aging Model</h3>
              <div style={{ height: '400px' }}>
                {finland2024Data && (
                  <Bar 
                    data={createPyramidData(finland2024Data, 'Finland', 'rgba(59, 130, 246, 0.8)')} 
                    options={pyramidOptions} 
                  />
                )}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Median Age:</strong> 42.8 years</p>
                <p><strong>Population:</strong> {finland2024Data?.totalPopulation?.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Bulgaria - Eastern European Decline</h3>
              <div style={{ height: '400px' }}>
                {bulgaria2024Data && (
                  <Bar 
                    data={createPyramidData(bulgaria2024Data, 'Bulgaria', 'rgba(168, 85, 247, 0.8)')} 
                    options={pyramidOptions} 
                  />
                )}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Median Age:</strong> 42.7 years</p>
                <p><strong>Population:</strong> {bulgaria2024Data?.totalPopulation?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <h2>What Makes Countries the Oldest in the World?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3">Demographic Factors</h3>
              <ul className="text-red-700 space-y-2">
                <li>• <strong>Ultra-low birth rates</strong> (below 1.5 children per woman)</li>
                <li>• <strong>Extended life expectancy</strong> (80+ years average)</li>
                <li>• <strong>Completed demographic transition</strong> (Stage 4-5)</li>
                <li>• <strong>Low infant mortality</strong> and advanced healthcare</li>
                <li>• <strong>Delayed childbearing</strong> (first birth at 30+ years)</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Socioeconomic Drivers</h3>
              <ul className="text-blue-700 space-y-2">
                <li>• <strong>Economic development</strong> reducing family size incentives</li>
                <li>• <strong>Urbanization</strong> and changing lifestyle preferences</li>
                <li>• <strong>Educational advancement</strong> delaying family formation</li>
                <li>• <strong>Social security systems</strong> reducing need for children as support</li>
                <li>• <strong>Gender equality</strong> providing alternatives to motherhood</li>
              </ul>
            </div>
          </div>

          <h2>Oldest vs Youngest Countries: The Global Divide</h2>
          
          <p>
            The contrast between the world's <strong>oldest countries</strong> and youngest nations illustrates the dramatic 
            global demographic divide. While Japan faces extreme aging, countries like Niger maintain youthful populations 
            with median ages under 16 years.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Japan (Oldest) - Median Age: 49.1</h3>
              <div style={{ height: '300px' }}>
                {japan2024Data && (
                  <Bar 
                    data={createPyramidData(japan2024Data, 'Japan', 'rgba(102, 16, 242, 0.8)')} 
                    options={pyramidOptions} 
                  />
                )}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Niger (Youngest) - Median Age: 14.8</h3>
              <div style={{ height: '300px' }}>
                {niger2024Data && (
                  <Bar 
                    data={createPyramidData(niger2024Data, 'Niger', 'rgba(34, 197, 94, 0.8)')} 
                    options={pyramidOptions} 
                  />
                )}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">The 34-Year Age Gap</h3>
            <p className="text-yellow-700">
              The difference in median age between Japan (49.1 years) and Niger (14.8 years) represents one of the most 
              extreme demographic contrasts in human history. This 34-year gap illustrates how countries at different 
              stages of development face entirely opposite population challenges.
            </p>
          </div>

          <h2>Challenges Facing the Oldest Countries</h2>

          <div className="bg-orange-50 border-l-4 border-orange-400 p-6 my-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-3">Critical Issues for Oldest Countries</h3>
            <div className="text-orange-700 space-y-3">
              <p><strong>Economic Burden:</strong> Shrinking workforces supporting growing elderly populations</p>
              <p><strong>Healthcare Crisis:</strong> Overwhelming demand for age-related medical care and long-term care services</p>
              <p><strong>Pension Sustainability:</strong> Unfunded liabilities as few workers support many retirees</p>
              <p><strong>Innovation Risk:</strong> Aging societies may lack the dynamism for technological advancement</p>
              <p><strong>Rural Decline:</strong> Young people concentrating in cities, leaving rural areas abandoned</p>
              <p><strong>Cultural Preservation:</strong> Risk of losing cultural knowledge as populations shrink</p>
            </div>
          </div>

          <h2>Policy Responses in the Oldest Countries</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Japan's Approach</h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Society 5.0 technology integration</li>
                <li>• Robot caregivers and AI assistance</li>
                <li>• Extended working age policies</li>
                <li>• Limited immigration increases</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Germany's Strategy</h3>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Skilled worker immigration</li>
                <li>• Family-friendly policies</li>
                <li>• Industry 4.0 automation</li>
                <li>• EU labor mobility</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Italy's Measures</h3>
              <ul className="text-purple-700 space-y-1 text-sm">
                <li>• Birth incentive programs</li>
                <li>• Pension system reforms</li>
                <li>• Youth employment initiatives</li>
                <li>• Regional development focus</li>
              </ul>
            </div>
          </div>

          <h2>Future Projections for Oldest Countries</h2>
          
          <p>
            The demographic trends among the <strong>oldest countries</strong> suggest continued aging through 2050. 
            Japan's median age is projected to reach 54 years, while countries like South Korea and Singapore 
            are rapidly joining the ranks of the world's oldest nations.
          </p>

          <h3>Countries Expected to Join the "Oldest" List by 2030:</h3>
          <ul className="list-disc pl-6 my-4">
            <li><strong>South Korea:</strong> Currently 44.9 years median age, fastest aging globally</li>
            <li><strong>Spain:</strong> Approaching 44 years median age with very low birth rates</li>
            <li><strong>Singapore:</strong> Rapid aging due to economic development and low fertility</li>
            <li><strong>Czech Republic:</strong> Eastern European aging pattern emerging</li>
            <li><strong>Greece:</strong> Economic crisis accelerating demographic decline</li>
          </ul>

          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 my-6">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3">The Global Aging Future</h3>
            <p className="text-indigo-700">
              The experience of today's <strong>oldest countries</strong> provides a preview of tomorrow's global demographic 
              reality. As developing nations complete their demographic transitions, the challenges of population aging 
              will spread worldwide, making the lessons from Japan, Italy, and Germany increasingly relevant for all nations.
            </p>
          </div>

          <h2>Related Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <Link href="/blog/stage-5-demographic-transition" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-purple-600">Stage 5 Demographics</h3>
              <p className="text-sm text-gray-600 mt-2">Understanding population decline in advanced nations</p>
            </Link>
            <Link href="/blog/stage-1-demographic-transition" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-red-600">Youngest Countries</h3>
              <p className="text-sm text-gray-600 mt-2">Contrasting high fertility nations with oldest countries</p>
            </Link>
            <Link href="/blog/4-vs-5-stages-demographic-transition-model" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold text-blue-600">Demographic Transition Models</h3>
              <p className="text-sm text-gray-600 mt-2">How countries become the oldest in the world</p>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};