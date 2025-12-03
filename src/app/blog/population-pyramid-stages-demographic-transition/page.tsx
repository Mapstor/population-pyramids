'use client';

import Link from 'next/link';
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

// Import country data for examples of each stage
import nigerData from '@/data/population/niger.json';           // Stage 1
import kenyaData from '@/data/population/kenya.json';           // Stage 2  
import brazilData from '@/data/population/brazil.json';         // Stage 3
import germanyData from '@/data/population/germany.json';       // Stage 4
import japanData from '@/data/population/japan.json';           // Stage 5

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export default function PopulationPyramidStagesPage() {
  // Get the latest year data for each country
  const niger2024Data = nigerData.years['2024'];
  const kenya2024Data = kenyaData.years['2024'];
  const brazil2024Data = brazilData.years['2024'];
  const germany2024Data = germanyData.years['2024'];
  const japan2024Data = japanData.years['2024'];

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
          backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue for males
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 0,
          barPercentage: 0.95,
          categoryPercentage: 1.0,
          barThickness: 'flex',
        },
        {
          label: 'Female',
          data: data.ageGroups.map((ag: any) => ag.female).reverse(),
          backgroundColor: 'rgba(236, 72, 153, 0.8)', // Pink for females
          borderColor: 'rgba(236, 72, 153, 1)',
          borderWidth: 0,
          barPercentage: 0.95,
          categoryPercentage: 1.0,
          barThickness: 'flex',
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

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          5 Population Pyramid Stages: The Complete Journey Through Demographic Transition
        </h1>
        <div className="flex items-center text-gray-600 text-sm space-x-4">
          <time dateTime="2024-11-12">November 12, 2024</time>
          <span>•</span>
          <span>12 min read</span>
          <span>•</span>
          <span className="text-purple-600 font-medium">Demographics Guide</span>
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          Every country on Earth travels through 5 distinct population pyramid stages during demographic transition. This journey from high birth and death rates to low birth and death rates reshapes societies, economies, and civilizations. Understanding these 5 stages reveals where every nation has been—and where it's heading.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Overview: The 5 Population Pyramid Stages</h2>

        <div className="bg-gradient-to-r from-red-100 via-yellow-100 via-green-100 via-blue-100 to-purple-100 border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900">The Complete Demographic Transition Model</h3>
          <div className="grid md:grid-cols-5 gap-3 text-sm">
            <div className="bg-red-50 p-3 rounded border">
              <h4 className="font-bold text-red-800">Stage 1</h4>
              <p className="text-red-700">High Stationary</p>
              <p className="text-xs">High birth/death rates</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded border">
              <h4 className="font-bold text-yellow-800">Stage 2</h4>
              <p className="text-yellow-700">Early Expanding</p>
              <p className="text-xs">Death rates fall</p>
            </div>
            <div className="bg-green-50 p-3 rounded border">
              <h4 className="font-bold text-green-800">Stage 3</h4>
              <p className="text-green-700">Late Expanding</p>
              <p className="text-xs">Birth rates fall</p>
            </div>
            <div className="bg-blue-50 p-3 rounded border">
              <h4 className="font-bold text-blue-800">Stage 4</h4>
              <p className="text-blue-700">Low Stationary</p>
              <p className="text-xs">Low birth/death rates</p>
            </div>
            <div className="bg-purple-50 p-3 rounded border">
              <h4 className="font-bold text-purple-800">Stage 5</h4>
              <p className="text-purple-700">Natural Decrease</p>
              <p className="text-xs">Below replacement</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Stage 1: High Stationary (Pre-Industrial)</h2>

        <p>
          Stage 1 represents humanity's natural state for most of history. Both birth rates and death rates are extremely high, resulting in very slow population growth or even periodic decline. The population pyramid shows a classic expansive shape, but high mortality creates a very narrow top.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Stage 1 Characteristics:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Birth rates:</strong> 40-50 per 1,000 people (very high)</li>
          <li><strong>Death rates:</strong> 35-45 per 1,000 people (very high)</li>
          <li><strong>Population growth:</strong> 0-0.5% annually (very slow)</li>
          <li><strong>Life expectancy:</strong> 25-35 years</li>
          <li><strong>Infant mortality:</strong> 200-300 per 1,000 births</li>
          <li><strong>Family size:</strong> 6-8 children per woman</li>
        </ul>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
          <h4 className="font-bold text-red-800 mb-2">Why Stage 1 Exists:</h4>
          <ul className="text-red-700 space-y-2">
            <li>• <strong>High mortality:</strong> Disease, famine, and conflict kill many infants and children</li>
            <li>• <strong>Economic necessity:</strong> Children provide labor and old-age security</li>
            <li>• <strong>No family planning:</strong> Limited knowledge or access to contraception</li>
            <li>• <strong>Cultural values:</strong> Large families seen as blessing and insurance</li>
            <li>• <strong>Agricultural society:</strong> More children = more hands for farming</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Population Pyramid Shape in Stage 1:</h3>
        <p>
          The pyramid has an extremely wide base due to high birth rates, but it narrows dramatically with each age group due to high mortality. Very few people survive to old age, creating a sharp, narrow top.
        </p>

        {/* Stage 1 Population Pyramid Example */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-8">
          <h4 className="text-xl font-bold mb-4 text-red-800">Stage 1 Example: Niger (Closest to Historic Stage 1)</h4>
          <p className="text-red-700 mb-4">
            While no country today is purely Stage 1, Niger shows the closest characteristics with very high birth rates. Notice the extremely wide base and sharp narrowing typical of Stage 1.
          </p>
          <div className="h-96 bg-white p-4 rounded-lg border">
            {niger2024Data && (() => {
              const pyramidData = createPyramidData(niger2024Data, 'Niger 2024');
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
                        text: `Niger: Birth Rate 42/1000, Death Rate 9/1000, Growth 3.8%`
                      }
                    }
                  }} 
                />
              );
            })()}
          </div>
        </div>

        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 my-6">
          <h4 className="font-bold text-gray-800 mb-2">Historical Examples:</h4>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Medieval Europe:</strong> Before the Industrial Revolution</li>
            <li>• <strong>Pre-colonial Africa:</strong> Before European contact</li>
            <li>• <strong>Ancient civilizations:</strong> Rome, Egypt, China before modernization</li>
            <li>• <strong>Today:</strong> Some isolated populations in remote areas</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Stage 2: Early Expanding (Early Transition)</h2>

        <p>
          Stage 2 begins when death rates start declining while birth rates remain high. This creates rapid population growth as more children survive to adulthood. The population pyramid becomes more expansive with a very broad base.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Stage 2 Characteristics:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Birth rates:</strong> 35-45 per 1,000 people (still high)</li>
          <li><strong>Death rates:</strong> 15-25 per 1,000 people (declining)</li>
          <li><strong>Population growth:</strong> 2-4% annually (rapid)</li>
          <li><strong>Life expectancy:</strong> 40-55 years</li>
          <li><strong>Infant mortality:</strong> 100-200 per 1,000 births</li>
          <li><strong>Family size:</strong> 5-7 children per woman</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">What Triggers the Transition to Stage 2:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Medical advances:</strong> Vaccines, antibiotics, and basic healthcare</li>
          <li><strong>Improved sanitation:</strong> Clean water and waste management</li>
          <li><strong>Better nutrition:</strong> More reliable food supply</li>
          <li><strong>Education:</strong> Basic literacy and health knowledge</li>
          <li><strong>Economic development:</strong> Rising incomes and living standards</li>
        </ul>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
          <h4 className="font-bold text-yellow-800 mb-2">Countries Currently in Stage 2:</h4>
          <ul className="text-yellow-700 space-y-1">
            <li>• <strong>Sub-Saharan Africa:</strong> Niger, Chad, Mali, Nigeria</li>
            <li>• <strong>Parts of Asia:</strong> Afghanistan, Yemen, East Timor</li>
            <li>• <strong>Some Pacific Islands:</strong> Solomon Islands, Vanuatu</li>
            <li>• <strong>Historical examples:</strong> Europe 1800-1880, US 1800-1860</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Population Pyramid Shape in Stage 2:</h3>
        <p>
          The pyramid maintains a very wide base as birth rates stay high, but the middle sections become broader as more children survive to adulthood. This creates the classic expansive pyramid shape with rapid population growth.
        </p>

        {/* Stage 2 Population Pyramid Example */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-8">
          <h4 className="text-xl font-bold mb-4 text-yellow-800">Stage 2 Example: Kenya (Early Expanding)</h4>
          <p className="text-yellow-700 mb-4">
            Kenya demonstrates classic Stage 2 with high birth rates but much-improved child mortality. Notice the wide base but broader middle sections compared to Stage 1.
          </p>
          <div className="h-96 bg-white p-4 rounded-lg border">
            {kenya2024Data && (() => {
              const pyramidData = createPyramidData(kenya2024Data, 'Kenya 2024');
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
                        text: `Kenya: Birth Rate 25/1000, Death Rate 5/1000, Growth 2.0%`
                      }
                    }
                  }} 
                />
              );
            })()}
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Stage 3: Late Expanding (Middle Transition)</h2>

        <p>
          Stage 3 is characterized by declining birth rates while death rates continue to fall more slowly. Population growth begins to slow, though it's still significant. The population pyramid starts to take on a more barrel-like shape as the base narrows.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Stage 3 Characteristics:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Birth rates:</strong> 20-35 per 1,000 people (declining)</li>
          <li><strong>Death rates:</strong> 10-15 per 1,000 people (low)</li>
          <li><strong>Population growth:</strong> 1-2% annually (moderate)</li>
          <li><strong>Life expectancy:</strong> 60-75 years</li>
          <li><strong>Infant mortality:</strong> 20-100 per 1,000 births</li>
          <li><strong>Family size:</strong> 2-4 children per woman</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">What Drives the Decline in Birth Rates:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Urbanization:</strong> Children become economic burden in cities</li>
          <li><strong>Women's education:</strong> Educated women have fewer children</li>
          <li><strong>Economic development:</strong> Higher living standards reduce need for large families</li>
          <li><strong>Family planning:</strong> Access to contraception and reproductive choice</li>
          <li><strong>Child survival:</strong> Lower infant mortality means fewer births needed</li>
          <li><strong>Changing values:</strong> Quality of life prioritized over family size</li>
        </ul>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 my-6">
          <h4 className="font-bold text-green-800 mb-2">Countries Currently in Stage 3:</h4>
          <ul className="text-green-700 space-y-1">
            <li>• <strong>Latin America:</strong> Mexico, Brazil, Colombia, Peru</li>
            <li>• <strong>Asia:</strong> India, Indonesia, Bangladesh, Philippines</li>
            <li>• <strong>Middle East:</strong> Turkey, Iran, Egypt</li>
            <li>• <strong>Africa:</strong> South Africa, Morocco, Algeria</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Population Pyramid Shape in Stage 3:</h3>
        <p>
          The pyramid begins transitioning from expansive to stationary. The base narrows as birth rates decline, while the middle sections expand as large cohorts from earlier high-birth periods age. This creates a "barrel" or "bell" shape.
        </p>

        {/* Stage 3 Population Pyramid Example */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-8">
          <h4 className="text-xl font-bold mb-4 text-green-800">Stage 3 Example: Brazil (Late Expanding)</h4>
          <p className="text-green-700 mb-4">
            Brazil shows Stage 3 characteristics with rapidly declining birth rates. Notice the narrowing base and bulging working-age population - this is the "demographic dividend" period.
          </p>
          <div className="h-96 bg-white p-4 rounded-lg border">
            {brazil2024Data && (() => {
              const pyramidData = createPyramidData(brazil2024Data, 'Brazil 2024');
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
                        text: `Brazil: Birth Rate 13/1000, Death Rate 7/1000, Growth 0.6%`
                      }
                    }
                  }} 
                />
              );
            })()}
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Stage 4: Low Stationary (Late Transition)</h2>

        <p>
          Stage 4 represents the completion of demographic transition. Both birth and death rates are low, resulting in slow population growth or stability. The population pyramid becomes rectangular or stationary, with relatively equal numbers in each age group.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Stage 4 Characteristics:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Birth rates:</strong> 10-20 per 1,000 people (low)</li>
          <li><strong>Death rates:</strong> 8-12 per 1,000 people (low)</li>
          <li><strong>Population growth:</strong> 0-0.5% annually (slow/stable)</li>
          <li><strong>Life expectancy:</strong> 75-85 years</li>
          <li><strong>Infant mortality:</strong> 3-20 per 1,000 births</li>
          <li><strong>Family size:</strong> 1.5-2.5 children per woman</li>
        </ul>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
          <h4 className="font-bold text-blue-800 mb-2">Countries Currently in Stage 4:</h4>
          <ul className="text-blue-700 space-y-1">
            <li>• <strong>North America:</strong> United States, Canada</li>
            <li>• <strong>Western Europe:</strong> France, United Kingdom, Netherlands</li>
            <li>• <strong>Developed Asia:</strong> Australia, New Zealand</li>
            <li>• <strong>Some Eastern Europe:</strong> Czech Republic, Slovenia</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Population Pyramid Shape in Stage 4:</h3>
        <p>
          The pyramid becomes rectangular or cylindrical. Birth rates near replacement level (2.1 children per woman) create relatively equal numbers across age groups. The top begins to widen as more people survive to old age.
        </p>

        {/* Stage 4 Population Pyramid Example */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
          <h4 className="text-xl font-bold mb-4 text-blue-800">Stage 4 Example: Germany (Low Stationary)</h4>
          <p className="text-blue-700 mb-4">
            Germany exemplifies Stage 4 with very low birth and death rates. Notice the rectangular shape and growing elderly population at the top - the aging society challenge.
          </p>
          <div className="h-96 bg-white p-4 rounded-lg border">
            {germany2024Data && (() => {
              const pyramidData = createPyramidData(germany2024Data, 'Germany 2024');
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
                        text: `Germany: Birth Rate 9/1000, Death Rate 12/1000, Growth -0.3%`
                      }
                    }
                  }} 
                />
              );
            })()}
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Key Features of Stage 4 Societies:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>High levels of education and healthcare</li>
          <li>Advanced economic development</li>
          <li>Urbanized populations</li>
          <li>Gender equality in education and workforce</li>
          <li>Strong social safety nets</li>
          <li>Focus on quality of life over family size</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Stage 5: Natural Decrease (Post-Transition)</h2>

        <p>
          Stage 5 is a recent addition to demographic transition theory. It occurs when birth rates fall below death rates, leading to natural population decline. The population pyramid becomes constrictive (inverted) with a narrow base and wide top.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Stage 5 Characteristics:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Birth rates:</strong> 6-12 per 1,000 people (very low)</li>
          <li><strong>Death rates:</strong> 10-15 per 1,000 people (rising due to aging)</li>
          <li><strong>Population growth:</strong> -0.5 to -2% annually (decline)</li>
          <li><strong>Life expectancy:</strong> 80-90 years</li>
          <li><strong>Infant mortality:</strong> 1-5 per 1,000 births</li>
          <li><strong>Family size:</strong> 0.8-1.8 children per woman</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">What Causes Stage 5:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Economic pressures:</strong> High cost of raising children</li>
          <li><strong>Career prioritization:</strong> Women delay or avoid childbearing</li>
          <li><strong>Lifestyle changes:</strong> Individual fulfillment over family life</li>
          <li><strong>Uncertainty:</strong> Economic and environmental concerns about the future</li>
          <li><strong>Social changes:</strong> Marriage rates decline, family structures change</li>
        </ul>

        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-6">
          <h4 className="font-bold text-purple-800 mb-2">Countries Currently in Stage 5:</h4>
          <ul className="text-purple-700 space-y-1">
            <li>• <strong>East Asia:</strong> Japan, South Korea, Taiwan, Singapore</li>
            <li>• <strong>Eastern Europe:</strong> Russia, Poland, Hungary, Baltic states</li>
            <li>• <strong>Southern Europe:</strong> Italy, Spain, Greece, Portugal</li>
            <li>• <strong>Others:</strong> Germany (without immigration), Ukraine</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Population Pyramid Shape in Stage 5:</h3>
        <p>
          The pyramid becomes inverted or constrictive. The base is narrow due to very low birth rates, while the top is wide due to large elderly populations. This creates an upside-down triangle that signals population decline.
        </p>

        {/* Stage 5 Population Pyramid Example */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 my-8">
          <h4 className="text-xl font-bold mb-4 text-purple-800">Stage 5 Example: Japan (Natural Decrease)</h4>
          <p className="text-purple-700 mb-4">
            Japan represents Stage 5 with birth rates well below replacement level and negative population growth. Notice the narrow base and very wide top - the inverted pyramid of population decline.
          </p>
          <div className="h-96 bg-white p-4 rounded-lg border">
            {japan2024Data && (() => {
              const pyramidData = createPyramidData(japan2024Data, 'Japan 2024');
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
                        text: `Japan: Birth Rate 7/1000, Death Rate 11/1000, Growth -0.4%`
                      }
                    }
                  }} 
                />
              );
            })()}
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Timeline: How Long Each Stage Lasts</h2>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4">Historical Timeline Examples</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-gray-800">England (First Country Through Transition):</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Stage 1: Pre-1750 (thousands of years)</li>
                <li>• Stage 2: 1750-1880 (130 years)</li>
                <li>• Stage 3: 1880-1940 (60 years)</li>
                <li>• Stage 4: 1940-2000 (60 years)</li>
                <li>• Stage 5: 2000-present (beginning)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800">China (Rapid Transition):</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Stage 1: Pre-1949 (thousands of years)</li>
                <li>• Stage 2: 1949-1970 (21 years)</li>
                <li>• Stage 3: 1970-2000 (30 years)</li>
                <li>• Stage 4: 2000-2020 (20 years)</li>
                <li>• Stage 5: 2020-present (beginning)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800">Sub-Saharan Africa (Current Transition):</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Stage 1: Pre-1950 (thousands of years)</li>
                <li>• Stage 2: 1950-present (most countries still here)</li>
                <li>• Stage 3: Beginning in some countries</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Factors That Accelerate or Slow Transition:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Education:</strong> Faster education expansion = faster transition</li>
          <li><strong>Economic development:</strong> Rapid GDP growth accelerates stages</li>
          <li><strong>Government policy:</strong> Family planning programs can speed transition</li>
          <li><strong>Cultural factors:</strong> Religious or traditional values may slow transition</li>
          <li><strong>External shocks:</strong> War, disease, or economic crisis can interrupt transition</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Economic Implications of Each Stage</h2>

        <div className="grid md:grid-cols-5 gap-4 my-8">
          <div className="bg-red-50 p-4 rounded-lg border">
            <h3 className="font-bold text-red-800 mb-2">Stage 1</h3>
            <p className="text-sm text-red-700 mb-2"><strong>Economy:</strong></p>
            <ul className="text-xs text-red-600 space-y-1">
              <li>• Agricultural subsistence</li>
              <li>• High mortality limits growth</li>
              <li>• Child labor essential</li>
              <li>• Little surplus for investment</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border">
            <h3 className="font-bold text-yellow-800 mb-2">Stage 2</h3>
            <p className="text-sm text-yellow-700 mb-2"><strong>Economy:</strong></p>
            <ul className="text-xs text-yellow-600 space-y-1">
              <li>• Labor force grows rapidly</li>
              <li>• High dependency ratios</li>
              <li>• Need for job creation</li>
              <li>• Investment in education/health</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border">
            <h3 className="font-bold text-green-800 mb-2">Stage 3</h3>
            <p className="text-sm text-green-700 mb-2"><strong>Economy:</strong></p>
            <ul className="text-xs text-green-600 space-y-1">
              <li>• Demographic dividend begins</li>
              <li>• More workers, fewer dependents</li>
              <li>• Savings and investment rise</li>
              <li>• Economic growth accelerates</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border">
            <h3 className="font-bold text-blue-800 mb-2">Stage 4</h3>
            <p className="text-sm text-blue-700 mb-2"><strong>Economy:</strong></p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Peak demographic dividend</li>
              <li>• High productivity workers</li>
              <li>• Innovation and technology</li>
              <li>• Aging begins to impact costs</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border">
            <h3 className="font-bold text-purple-800 mb-2">Stage 5</h3>
            <p className="text-sm text-purple-700 mb-2"><strong>Economy:</strong></p>
            <ul className="text-xs text-purple-600 space-y-1">
              <li>• Shrinking workforce</li>
              <li>• High healthcare costs</li>
              <li>• Pension system stress</li>
              <li>• Need for automation</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Demographic Dividend: Stages 3 & 4's Economic Boost</h2>

        <p>
          The demographic dividend occurs during stages 3 and 4 when the working-age population is large relative to dependents (children and elderly). This creates ideal conditions for economic growth.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">How the Demographic Dividend Works:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Lower dependency ratios:</strong> Fewer children to support per working adult</li>
          <li><strong>Higher savings rates:</strong> Working adults save more without many dependents</li>
          <li><strong>Increased investment:</strong> More capital available for productive investment</li>
          <li><strong>Higher productivity:</strong> Educated workforce with modern skills</li>
          <li><strong>Consumer demand:</strong> Working-age population drives economic consumption</li>
        </ul>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
          <h4 className="font-bold text-green-800 mb-3">Countries That Maximized Their Demographic Dividend:</h4>
          <ul className="text-green-700 space-y-2">
            <li>• <strong>East Asian Tigers (1960-2000):</strong> South Korea, Taiwan, Hong Kong, Singapore</li>
            <li>• <strong>China (1980-2015):</strong> Massive economic growth during one-child policy era</li>
            <li>• <strong>Ireland (1990-2010):</strong> "Celtic Tiger" economic boom</li>
            <li>• <strong>Current opportunity:</strong> India entering peak dividend phase now</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Social and Cultural Changes by Stage</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">Family Structure Evolution:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Stage 1-2:</strong> Extended families, multiple generations together</li>
          <li><strong>Stage 3:</strong> Nuclear families become dominant</li>
          <li><strong>Stage 4:</strong> Diverse family structures, delayed marriage</li>
          <li><strong>Stage 5:</strong> Single-person households increase, childless couples common</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Women's Roles Transformation:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Stage 1-2:</strong> Primarily mothers and homemakers</li>
          <li><strong>Stage 3:</strong> Enter workforce while maintaining family roles</li>
          <li><strong>Stage 4:</strong> Career and family balance, reproductive choice</li>
          <li><strong>Stage 5:</strong> Career often prioritized over childbearing</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Global Patterns: Where Countries Stand Today</h2>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4">Current Global Distribution by Stage</h3>
          
          <div className="space-y-4">
            <div>
              <p><strong>Stage 1:</strong> Very few countries remain (some isolated populations)</p>
            </div>
            <div>
              <p><strong>Stage 2 (47 countries):</strong> Most of sub-Saharan Africa, parts of Asia and Middle East</p>
            </div>
            <div>
              <p><strong>Stage 3 (76 countries):</strong> Most of Latin America, much of Asia, North Africa</p>
            </div>
            <div>
              <p><strong>Stage 4 (48 countries):</strong> Most developed countries, some middle-income nations</p>
            </div>
            <div>
              <p><strong>Stage 5 (24 countries):</strong> East Asia, Eastern Europe, parts of Southern Europe</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Regional Transition Patterns:</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">Africa: Still Early in Transition</h4>
        <p>Most African countries remain in stages 2-3. Nigeria alone will add 200 million people by 2050. The continent represents the world's last great demographic transition.</p>

        <h4 className="text-lg font-semibold mt-4 mb-2">Asia: Mixed but Moving Fast</h4>
        <p>Asia shows all stages: Afghanistan in stage 2, India in stage 3, China moving to stage 5. The speed of transition has been unprecedented.</p>

        <h4 className="text-lg font-semibold mt-4 mb-2">Europe: Pioneered and Completed Transition</h4>
        <p>Western Europe completed the transition and is now grappling with stage 5 challenges. Eastern Europe moved rapidly from stages 2-5 after 1990.</p>

        <h4 className="text-lg font-semibold mt-4 mb-2">Americas: North vs South Divide</h4>
        <p>North America reached stage 4 with immigration maintaining growth. Latin America is transitioning rapidly through stages 3-4.</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Future Predictions: What Comes Next?</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">By 2050:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Stage 2 countries will shrink:</strong> Most African countries will enter stage 3</li>
          <li><strong>Stage 3 will dominate:</strong> India, Indonesia, Brazil leading this group</li>
          <li><strong>Stage 4 will expand:</strong> China, Thailand, Chile joining this stage</li>
          <li><strong>Stage 5 will grow:</strong> Most developed countries experiencing population decline</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">By 2100:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Most of the world will be in stages 4-5</li>
          <li>Africa will complete its demographic transition</li>
          <li>Global population will peak and begin declining</li>
          <li>Aging will be a universal challenge</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Policy Implications for Each Stage</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">Stage-Specific Policy Priorities:</h3>

        <div className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-800">Stage 2 Countries Should Focus On:</h4>
            <ul className="text-yellow-700 space-y-1 mt-2">
              <li>• Education, especially for girls</li>
              <li>• Healthcare infrastructure</li>
              <li>• Job creation for growing workforce</li>
              <li>• Family planning access</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
            <h4 className="font-bold text-green-800">Stage 3 Countries Should Focus On:</h4>
            <ul className="text-green-700 space-y-1 mt-2">
              <li>• Maximizing demographic dividend</li>
              <li>• Skills development and training</li>
              <li>• Infrastructure investment</li>
              <li>• Preparing for aging</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
            <h4 className="font-bold text-blue-800">Stage 4 Countries Should Focus On:</h4>
            <ul className="text-blue-700 space-y-1 mt-2">
              <li>• Immigration policy</li>
              <li>• Productivity enhancement</li>
              <li>• Pension system sustainability</li>
              <li>• Work-life balance policies</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
            <h4 className="font-bold text-purple-800">Stage 5 Countries Should Focus On:</h4>
            <ul className="text-purple-700 space-y-1 mt-2">
              <li>• Pro-natalist policies (baby bonuses)</li>
              <li>• Automation and AI</li>
              <li>• Healthcare for aging populations</li>
              <li>• Immigration to maintain workforce</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">How to Identify a Country's Stage</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">Key Indicators to Look For:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Total Fertility Rate (TFR):</strong> Most important single indicator</li>
          <li><strong>Population growth rate:</strong> Shows overall demographic momentum</li>
          <li><strong>Median age:</strong> Indicates age structure of population</li>
          <li><strong>Life expectancy:</strong> Reflects healthcare and living standards</li>
          <li><strong>Infant mortality rate:</strong> Shows development level</li>
          <li><strong>Urban vs rural population:</strong> Indicates economic structure</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4 text-blue-900">Quick Stage Identification Guide</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold mb-2">High Growth (Stages 2-3):</h4>
              <ul className="text-sm space-y-1">
                <li>• TFR above 2.5</li>
                <li>• Growth rate above 1.5%</li>
                <li>• Median age under 30</li>
                <li>• Expansive pyramid shape</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Low Growth/Decline (Stages 4-5):</h4>
              <ul className="text-sm space-y-1">
                <li>• TFR below 2.1</li>
                <li>• Growth rate below 0.5%</li>
                <li>• Median age above 35</li>
                <li>• Stationary/constrictive pyramid</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparative Population Pyramids Section */}
        <h2 className="text-2xl font-bold mt-12 mb-6">Complete Journey: All 5 Population Pyramid Stages</h2>
        <p className="text-lg mb-8">
          Witness the complete demographic transformation from high mortality/fertility to population decline. Each stage represents a fundamental shift in society, economy, and human experience.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 my-12">
          {/* Stage 1 */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <h4 className="text-md font-bold text-red-800 mb-2 text-center">Stage 1: Niger</h4>
            <div className="h-64">
              {niger2024Data && (() => {
                const pyramidData = createPyramidData(niger2024Data, 'Niger');
                if (!pyramidData) return null;
                return <Bar data={pyramidData} options={createPyramidOptions(pyramidData.maxValue)} />;
              })()}
            </div>
            <p className="text-red-700 text-xs text-center mt-2">High birth/death rates<br/>3.8% growth</p>
          </div>

          {/* Stage 2 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h4 className="text-md font-bold text-yellow-800 mb-2 text-center">Stage 2: Kenya</h4>
            <div className="h-64">
              {kenya2024Data && (() => {
                const pyramidData = createPyramidData(kenya2024Data, 'Kenya');
                if (!pyramidData) return null;
                return <Bar data={pyramidData} options={createPyramidOptions(pyramidData.maxValue)} />;
              })()}
            </div>
            <p className="text-yellow-700 text-xs text-center mt-2">Death rates fall<br/>2.0% growth</p>
          </div>

          {/* Stage 3 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="text-md font-bold text-green-800 mb-2 text-center">Stage 3: Brazil</h4>
            <div className="h-64">
              {brazil2024Data && (() => {
                const pyramidData = createPyramidData(brazil2024Data, 'Brazil');
                if (!pyramidData) return null;
                return <Bar data={pyramidData} options={createPyramidOptions(pyramidData.maxValue)} />;
              })()}
            </div>
            <p className="text-green-700 text-xs text-center mt-2">Birth rates fall<br/>0.6% growth</p>
          </div>

          {/* Stage 4 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-md font-bold text-blue-800 mb-2 text-center">Stage 4: Germany</h4>
            <div className="h-64">
              {germany2024Data && (() => {
                const pyramidData = createPyramidData(germany2024Data, 'Germany');
                if (!pyramidData) return null;
                return <Bar data={pyramidData} options={createPyramidOptions(pyramidData.maxValue)} />;
              })()}
            </div>
            <p className="text-blue-700 text-xs text-center mt-2">Low birth/death rates<br/>-0.3% growth</p>
          </div>

          {/* Stage 5 */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <h4 className="text-md font-bold text-purple-800 mb-2 text-center">Stage 5: Japan</h4>
            <div className="h-64">
              {japan2024Data && (() => {
                const pyramidData = createPyramidData(japan2024Data, 'Japan');
                if (!pyramidData) return null;
                return <Bar data={pyramidData} options={createPyramidOptions(pyramidData.maxValue)} />;
              })()}
            </div>
            <p className="text-purple-700 text-xs text-center mt-2">Below replacement<br/>-0.4% decline</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-100 via-yellow-100 via-green-100 via-blue-100 to-purple-100 border border-gray-200 rounded-lg p-6 my-8">
          <h4 className="text-xl font-bold mb-4 text-center">The Complete Demographic Transformation</h4>
          <div className="grid grid-cols-5 gap-2 text-xs text-center">
            <div>
              <span className="font-bold text-red-800">Stage 1 (Niger)</span>
              <p className="text-red-700">Birth: 42/1000<br/>Death: 9/1000<br/>TFR: 6.8</p>
            </div>
            <div>
              <span className="font-bold text-yellow-800">Stage 2 (Kenya)</span>
              <p className="text-yellow-700">Birth: 25/1000<br/>Death: 5/1000<br/>TFR: 3.3</p>
            </div>
            <div>
              <span className="font-bold text-green-800">Stage 3 (Brazil)</span>
              <p className="text-green-700">Birth: 13/1000<br/>Death: 7/1000<br/>TFR: 1.7</p>
            </div>
            <div>
              <span className="font-bold text-blue-800">Stage 4 (Germany)</span>
              <p className="text-blue-700">Birth: 9/1000<br/>Death: 12/1000<br/>TFR: 1.5</p>
            </div>
            <div>
              <span className="font-bold text-purple-800">Stage 5 (Japan)</span>
              <p className="text-purple-700">Birth: 7/1000<br/>Death: 11/1000<br/>TFR: 1.3</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-100 to-purple-100 border border-gray-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Key Takeaways: The 5 Population Pyramid Stages</h3>
          <div className="space-y-3 text-sm">
            <div>
              <strong>Stage 1 (High Stationary):</strong> High birth and death rates, slow growth, pre-industrial societies.
            </div>
            <div>
              <strong>Stage 2 (Early Expanding):</strong> Death rates fall, birth rates stay high, rapid population growth.
            </div>
            <div>
              <strong>Stage 3 (Late Expanding):</strong> Birth rates decline, demographic dividend begins, moderate growth.
            </div>
            <div>
              <strong>Stage 4 (Low Stationary):</strong> Low birth and death rates, stable populations, developed economies.
            </div>
            <div>
              <strong>Stage 5 (Natural Decrease):</strong> Birth rates below replacement, aging societies, population decline.
            </div>
          </div>
        </div>

        <p className="text-lg text-gray-700 mt-8">
          The 5 population pyramid stages represent humanity's greatest demographic journey. Every society travels this path, though at different speeds and with varying outcomes. Understanding these stages is crucial for policymakers, businesses, and anyone seeking to understand how populations evolve and what challenges and opportunities lie ahead for different nations around the world.
        </p>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-bold mb-3">Explore More Population Data</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/countries" className="text-blue-600 hover:text-blue-800 underline">
              View countries by demographic stage →
            </Link>
            <Link href="/blog/population-pyramid-types-complete-guide" className="text-blue-600 hover:text-blue-800 underline">
              Learn about population pyramid types →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}