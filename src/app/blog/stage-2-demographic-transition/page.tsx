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

// Import country data - 4 examples of Stage 2 and comparison countries
import kenyaData from '@/data/population/kenya.json';              // Stage 2 example 1
import ugandaData from '@/data/population/uganda.json';            // Stage 2 example 2  
import afghanistanData from '@/data/population/afghanistan.json';   // Stage 2 example 3
import tanzaniaData from '@/data/population/tanzania.json';         // Stage 2 example 4

// Comparison countries for different stages
import nigerData from '@/data/population/niger.json';              // Stage 1
import brazilData from '@/data/population/brazil.json';            // Stage 3
import germanyData from '@/data/population/germany.json';          // Stage 4
import japanData from '@/data/population/japan.json';              // Stage 5

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export default function Stage2DemographicTransitionPage() {
  // Get 2024 data for all countries
  const kenya2024 = kenyaData.years['2024'];
  const uganda2024 = ugandaData.years['2024'];
  const afghanistan2024 = afghanistanData.years['2024'];
  const tanzania2024 = tanzaniaData.years['2024'];
  
  // Comparison countries
  const niger2024 = nigerData.years['2024'];
  const brazil2024 = brazilData.years['2024'];
  const germany2024 = germanyData.years['2024'];
  const japan2024 = japanData.years['2024'];

  const createPyramidData = (data: any, title: string, color: string) => {
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

  const createPyramidOptions = (maxValue?: number, subtitle?: string): ChartOptions<'bar'> => ({
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: subtitle ? {
        display: true,
        text: subtitle
      } : undefined,
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
    <article className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Stage 2 Demographic Transition: The Population Explosion Years
        </h1>
        <div className="flex items-center text-gray-600 text-sm space-x-4">
          <time dateTime="2024-11-13">November 13, 2024</time>
          <span>•</span>
          <span>15 min read</span>
          <span>•</span>
          <span className="text-yellow-600 font-medium">Stage 2 Analysis</span>
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          Stage 2 is when countries experience their most dramatic population growth. Death rates plummet while birth rates remain high, creating the famous "population explosion" that transformed Europe in the 1800s and is reshaping Africa today. These countries show the classic expanding pyramid shape—wide bases that stay broad through middle age groups as more children survive to adulthood. Understanding Stage 2 is crucial because it represents both tremendous opportunity and enormous challenge.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">What Defines Stage 2: The Early Expanding Stage</h2>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-yellow-800">Stage 2 Key Characteristics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-yellow-700 mb-2">Vital Statistics</h4>
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• <strong>Birth Rate:</strong> 30-40 per 1,000 people (still high)</li>
                <li>• <strong>Death Rate:</strong> 10-20 per 1,000 people (declining rapidly)</li>
                <li>• <strong>Population Growth:</strong> 2-4% annually (very rapid)</li>
                <li>• <strong>Life Expectancy:</strong> 45-65 years (improving)</li>
                <li>• <strong>Infant Mortality:</strong> 50-150 per 1,000 births (falling)</li>
                <li>• <strong>Total Fertility Rate:</strong> 4-6 children per woman</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-yellow-700 mb-2">Social Structure</h4>
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• <strong>Economy:</strong> Agricultural with some industry</li>
                <li>• <strong>Education:</strong> Primary education expanding</li>
                <li>• <strong>Healthcare:</strong> Basic medical services available</li>
                <li>• <strong>Family Size:</strong> Large families still economically beneficial</li>
                <li>• <strong>Urbanization:</strong> 20-40% urban population</li>
                <li>• <strong>Women's Role:</strong> Starting to participate in formal economy</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Stage 2 Trigger: Why Death Rates Fall First</h2>

        <p>
          Stage 2 begins when death rates start declining significantly while birth rates remain high. This creates rapid population growth and the characteristic expanding pyramid shape. Several factors typically trigger this transition:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-green-800 mb-3">Medical Advances</h3>
            <ul className="text-green-700 space-y-1 text-sm">
              <li>• Vaccination programs</li>
              <li>• Antibiotics availability</li>
              <li>• Basic maternal care</li>
              <li>• Treatment of infectious diseases</li>
              <li>• Improved nutrition</li>
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-3">Public Health</h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Clean water systems</li>
              <li>• Sanitation improvements</li>
              <li>• Food security measures</li>
              <li>• Disease prevention campaigns</li>
              <li>• Emergency medical services</li>
            </ul>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-purple-800 mb-3">Economic Development</h3>
            <ul className="text-purple-700 space-y-1 text-sm">
              <li>• Improved transportation</li>
              <li>• Better agricultural techniques</li>
              <li>• Industrial job creation</li>
              <li>• Government investment in health</li>
              <li>• International aid programs</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Modern Stage 2 Examples: Four High-Growth Countries</h2>

        <p className="mb-6">
          Today's Stage 2 countries are primarily in Sub-Saharan Africa and conflict-affected regions. These countries show the classic expanding pyramid pattern and face the opportunities and challenges of rapid population growth.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          {/* Kenya */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-yellow-800">1. Kenya: East African Success Story</h3>
            <div className="h-96 bg-white p-4 rounded-lg border mb-4">
              {kenya2024 && (() => {
                const pyramidData = createPyramidData(kenya2024, 'Kenya 2024', 'rgba(245, 158, 11, 0.8)');
                if (!pyramidData) return null;
                return (
                  <Bar 
                    data={pyramidData} 
                    options={createPyramidOptions(pyramidData.maxValue, 'Birth Rate: 25.1/1000 | Death Rate: 5.2/1000 | TFR: 3.3')} 
                  />
                );
              })()}
            </div>
            <div className="space-y-2 text-sm text-yellow-700">
              <p><strong>Population:</strong> 55 million</p>
              <p><strong>Growth Rate:</strong> 2.0% annually</p>
              <p><strong>Median Age:</strong> 20.0 years</p>
              <p><strong>Economy:</strong> Services, agriculture, manufacturing</p>
              <p><strong>Stage 2 drivers:</strong> Improved healthcare, economic growth, education expansion, but fertility still high due to cultural preferences and rural population</p>
            </div>
          </div>

          {/* Uganda */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-yellow-800">2. Uganda: Rapid Growth Challenge</h3>
            <div className="h-96 bg-white p-4 rounded-lg border mb-4">
              {uganda2024 && (() => {
                const pyramidData = createPyramidData(uganda2024, 'Uganda 2024', 'rgba(217, 119, 6, 0.8)');
                if (!pyramidData) return null;
                return (
                  <Bar 
                    data={pyramidData} 
                    options={createPyramidOptions(pyramidData.maxValue, 'Birth Rate: 32.4/1000 | Death Rate: 5.5/1000 | TFR: 4.7')} 
                  />
                );
              })()}
            </div>
            <div className="space-y-2 text-sm text-yellow-700">
              <p><strong>Population:</strong> 48 million</p>
              <p><strong>Growth Rate:</strong> 2.9% annually</p>
              <p><strong>Median Age:</strong> 16.7 years</p>
              <p><strong>Economy:</strong> Agriculture dominant, emerging services</p>
              <p><strong>Stage 2 drivers:</strong> Post-conflict recovery, health improvements, high fertility culturally valued, 80% rural population maintains traditional family patterns</p>
            </div>
          </div>

          {/* Afghanistan */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-yellow-800">3. Afghanistan: Conflict and Demographics</h3>
            <div className="h-96 bg-white p-4 rounded-lg border mb-4">
              {afghanistan2024 && (() => {
                const pyramidData = createPyramidData(afghanistan2024, 'Afghanistan 2024', 'rgba(180, 83, 9, 0.8)');
                if (!pyramidData) return null;
                return (
                  <Bar 
                    data={pyramidData} 
                    options={createPyramidOptions(pyramidData.maxValue, 'Birth Rate: 31.6/1000 | Death Rate: 6.3/1000 | TFR: 4.3')} 
                  />
                );
              })()}
            </div>
            <div className="space-y-2 text-sm text-yellow-700">
              <p><strong>Population:</strong> 42 million</p>
              <p><strong>Growth Rate:</strong> 2.5% annually</p>
              <p><strong>Median Age:</strong> 18.9 years</p>
              <p><strong>Economy:</strong> Agriculture, informal economy</p>
              <p><strong>Stage 2 drivers:</strong> Despite conflict, basic health improvements reduced infant mortality, traditional values maintain high fertility, large families provide security</p>
            </div>
          </div>

          {/* Tanzania */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-yellow-800">4. Tanzania: Steady Transition</h3>
            <div className="h-96 bg-white p-4 rounded-lg border mb-4">
              {tanzania2024 && (() => {
                const pyramidData = createPyramidData(tanzania2024, 'Tanzania 2024', 'rgba(146, 64, 14, 0.8)');
                if (!pyramidData) return null;
                return (
                  <Bar 
                    data={pyramidData} 
                    options={createPyramidOptions(pyramidData.maxValue, 'Birth Rate: 33.2/1000 | Death Rate: 7.1/1000 | TFR: 4.8')} 
                  />
                );
              })()}
            </div>
            <div className="space-y-2 text-sm text-yellow-700">
              <p><strong>Population:</strong> 63 million</p>
              <p><strong>Growth Rate:</strong> 2.6% annually</p>
              <p><strong>Median Age:</strong> 18.2 years</p>
              <p><strong>Economy:</strong> Agriculture, mining, emerging tourism</p>
              <p><strong>Stage 2 drivers:</strong> Political stability, health system improvements, education expansion, but rural-agricultural economy maintains preference for large families</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Stage 2 vs All Other Stages: Population Pyramid Comparisons</h2>

        <p className="mb-8">
          Stage 2's distinctive expanding pyramid shape becomes clear when compared to other stages. The broad base combined with wider middle sections creates the potential for explosive population growth.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Stage 2 vs Stage 1: The Death Rate Revolution</h3>
        <div className="bg-gradient-to-r from-yellow-50 to-red-50 border border-gray-200 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-yellow-800 mb-3 text-center">Stage 2: Kenya</h4>
              <div className="h-80 bg-white p-3 rounded-lg border">
                {kenya2024 && (() => {
                  const pyramidData = createPyramidData(kenya2024, 'Kenya', 'rgba(245, 158, 11, 0.8)');
                  if (!pyramidData) return null;
                  return <Bar data={pyramidData} options={createPyramidOptions(pyramidData.maxValue)} />;
                })()}
              </div>
              <p className="text-yellow-700 text-sm text-center mt-2">
                <strong>Growth:</strong> 2.0% | <strong>TFR:</strong> 3.3<br/>
                Broader middle, more survivors
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-red-800 mb-3 text-center">Stage 1: Niger</h4>
              <div className="h-80 bg-white p-3 rounded-lg border">
                {niger2024 && (() => {
                  const pyramidData = createPyramidData(niger2024, 'Niger', 'rgba(239, 68, 68, 0.8)');
                  if (!pyramidData) return null;
                  return <Bar data={pyramidData} options={createPyramidOptions(pyramidData.maxValue)} />;
                })()}
              </div>
              <p className="text-red-700 text-sm text-center mt-2">
                <strong>Growth:</strong> 3.8% | <strong>TFR:</strong> 6.8<br/>
                Sharp narrowing, fewer survivors
              </p>
            </div>
          </div>
          <div className="mt-6 bg-white p-4 rounded border">
            <h4 className="font-bold mb-2">Key Difference: Child Survival Revolution</h4>
            <p className="text-sm text-gray-700">
              Kenya's improved healthcare means far more children survive to adulthood, creating the broader middle sections. Death rates fell from Stage 1 levels (35+/1000) to Stage 2 levels (5/1000), while birth rates remained high, triggering rapid population growth.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Stage 2 vs Stage 3: Birth Rates Begin to Decline</h3>
        <div className="bg-gradient-to-r from-yellow-50 to-green-50 border border-gray-200 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-yellow-800 mb-3 text-center">Stage 2: Uganda</h4>
              <div className="h-80 bg-white p-3 rounded-lg border">
                {uganda2024 && (() => {
                  const pyramidData = createPyramidData(uganda2024, 'Uganda', 'rgba(217, 119, 6, 0.8)');
                  if (!pyramidData) return null;
                  return <Bar data={pyramidData} options={createPyramidOptions(pyramidData.maxValue)} />;
                })()}
              </div>
              <p className="text-yellow-700 text-sm text-center mt-2">
                <strong>Growth:</strong> 2.9% | <strong>TFR:</strong> 4.7<br/>
                Very wide base, high fertility
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-green-800 mb-3 text-center">Stage 3: Brazil</h4>
              <div className="h-80 bg-white p-3 rounded-lg border">
                {brazil2024 && (() => {
                  const pyramidData = createPyramidData(brazil2024, 'Brazil', 'rgba(34, 197, 94, 0.8)');
                  if (!pyramidData) return null;
                  return <Bar data={pyramidData} options={createPyramidOptions(pyramidData.maxValue)} />;
                })()}
              </div>
              <p className="text-green-700 text-sm text-center mt-2">
                <strong>Growth:</strong> 0.6% | <strong>TFR:</strong> 1.7<br/>
                Narrower base, fertility declining
              </p>
            </div>
          </div>
          <div className="mt-6 bg-white p-4 rounded border">
            <h4 className="font-bold mb-2">Key Difference: Fertility Transition Begins</h4>
            <p className="text-sm text-gray-700">
              Brazil shows what happens when birth rates start falling in Stage 3. Notice the dramatically narrower base compared to Uganda's wide pyramid. Economic development, urbanization, and women's education drive this fertility decline.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Stage 2 vs Stage 4: Complete Demographic Transition</h3>
        <div className="bg-gradient-to-r from-yellow-50 to-blue-50 border border-gray-200 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-yellow-800 mb-3 text-center">Stage 2: Tanzania</h4>
              <div className="h-80 bg-white p-3 rounded-lg border">
                {tanzania2024 && (() => {
                  const pyramidData = createPyramidData(tanzania2024, 'Tanzania', 'rgba(146, 64, 14, 0.8)');
                  if (!pyramidData) return null;
                  return <Bar data={pyramidData} options={createPyramidOptions(pyramidData.maxValue)} />;
                })()}
              </div>
              <p className="text-yellow-700 text-sm text-center mt-2">
                <strong>Growth:</strong> 2.6% | <strong>TFR:</strong> 4.8<br/>
                Expanding pyramid, youth boom
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-blue-800 mb-3 text-center">Stage 4: Germany</h4>
              <div className="h-80 bg-white p-3 rounded-lg border">
                {germany2024 && (() => {
                  const pyramidData = createPyramidData(germany2024, 'Germany', 'rgba(59, 130, 246, 0.8)');
                  if (!pyramidData) return null;
                  return <Bar data={pyramidData} options={createPyramidOptions(pyramidData.maxValue)} />;
                })()}
              </div>
              <p className="text-blue-700 text-sm text-center mt-2">
                <strong>Growth:</strong> -0.3% | <strong>TFR:</strong> 1.5<br/>
                Rectangular, aging population
              </p>
            </div>
          </div>
          <div className="mt-6 bg-white p-4 rounded border">
            <h4 className="font-bold mb-2">Key Difference: Youth vs Aging Societies</h4>
            <p className="text-sm text-gray-700">
              Tanzania's pyramid shows a society with 45% under age 15, while Germany has 22% over age 65. This represents completely different economic and social challenges—Tanzania needs jobs and schools, Germany needs elder care and pensions.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Stage 2 vs Stage 5: Growth vs Decline Extremes</h3>
        <div className="bg-gradient-to-r from-yellow-50 to-purple-50 border border-gray-200 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-yellow-800 mb-3 text-center">Stage 2: Afghanistan</h4>
              <div className="h-80 bg-white p-3 rounded-lg border">
                {afghanistan2024 && (() => {
                  const pyramidData = createPyramidData(afghanistan2024, 'Afghanistan', 'rgba(180, 83, 9, 0.8)');
                  if (!pyramidData) return null;
                  return <Bar data={pyramidData} options={createPyramidOptions(pyramidData.maxValue)} />;
                })()}
              </div>
              <p className="text-yellow-700 text-sm text-center mt-2">
                <strong>Growth:</strong> 2.5% | <strong>TFR:</strong> 4.3<br/>
                Population doubling every 28 years
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-purple-800 mb-3 text-center">Stage 5: Japan</h4>
              <div className="h-80 bg-white p-3 rounded-lg border">
                {japan2024 && (() => {
                  const pyramidData = createPyramidData(japan2024, 'Japan', 'rgba(147, 51, 234, 0.8)');
                  if (!pyramidData) return null;
                  return <Bar data={pyramidData} options={createPyramidOptions(pyramidData.maxValue)} />;
                })()}
              </div>
              <p className="text-purple-700 text-sm text-center mt-2">
                <strong>Growth:</strong> -0.4% | <strong>TFR:</strong> 1.3<br/>
                Population shrinking rapidly
              </p>
            </div>
          </div>
          <div className="mt-6 bg-white p-4 rounded border">
            <h4 className="font-bold mb-2">Key Difference: Demographic Momentum Extremes</h4>
            <p className="text-sm text-gray-700">
              Afghanistan's wide base creates massive demographic momentum—even if fertility dropped immediately, population would keep growing for decades. Japan's inverted pyramid shows the opposite momentum—decline accelerating as small cohorts reach reproductive age.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Population Explosion: Understanding Rapid Growth</h2>

        <p>
          Stage 2 countries experience the fastest population growth in human history. This "population explosion" creates both enormous opportunities and serious challenges.
        </p>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4 text-orange-800">Historical Population Explosions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-bold text-orange-700 mb-2">Europe 1750-1900</h4>
              <ul className="text-orange-600 space-y-1">
                <li>• Population tripled in 150 years</li>
                <li>• Death rates fell from 30+ to 15/1000</li>
                <li>• Birth rates stayed 35-40/1000</li>
                <li>• Enabled industrial revolution workforce</li>
                <li>• Drove massive emigration to Americas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-orange-700 mb-2">Latin America 1950-2000</h4>
              <ul className="text-orange-600 space-y-1">
                <li>• Population quadrupled in 50 years</li>
                <li>• Medical advances reduced infant mortality</li>
                <li>• Urbanization accelerated</li>
                <li>• Created large working-age populations</li>
                <li>• Economic growth opportunities</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-orange-700 mb-2">Sub-Saharan Africa 1980-Present</h4>
              <ul className="text-orange-600 space-y-1">
                <li>• Population doubled in 40 years</li>
                <li>• HIV/AIDS slowed but didn't stop growth</li>
                <li>• Continuing high fertility</li>
                <li>• Youth bulge creating pressure</li>
                <li>• Ongoing demographic transition</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Stage 2 Challenges: Managing Rapid Growth</h2>

        <p>
          While rapid population growth can fuel economic development, it also creates significant challenges that countries must address to successfully transition to Stage 3.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-800 mb-3">Challenges & Pressures</h3>
            <ul className="text-red-700 space-y-2 text-sm">
              <li>• <strong>Education overload:</strong> Need massive school expansion for youth bulge</li>
              <li>• <strong>Job creation crisis:</strong> Must create millions of jobs annually</li>
              <li>• <strong>Infrastructure strain:</strong> Housing, transport, utilities overwhelmed</li>
              <li>• <strong>Healthcare pressure:</strong> Growing population needs more services</li>
              <li>• <strong>Environmental degradation:</strong> More people stress natural resources</li>
              <li>• <strong>Urban poverty:</strong> Rural-to-urban migration creates slums</li>
              <li>• <strong>Food security:</strong> Agricultural production must keep pace</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-green-800 mb-3">Opportunities & Advantages</h3>
            <ul className="text-green-700 space-y-2 text-sm">
              <li>• <strong>Demographic dividend potential:</strong> Large working-age population coming</li>
              <li>• <strong>Economic dynamism:</strong> Young populations drive innovation</li>
              <li>• <strong>Market expansion:</strong> Growing domestic consumer base</li>
              <li>• <strong>Labor abundance:</strong> Competitive advantage in labor-intensive industries</li>
              <li>• <strong>Entrepreneurship:</strong> Youth drive business creation</li>
              <li>• <strong>Cultural vitality:</strong> Young societies tend toward optimism</li>
              <li>• <strong>Military strength:</strong> Large pool of potential recruits</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Policy Strategies for Stage 2 Countries</h2>

        <p>
          Successful Stage 2 countries focus on managing rapid growth while laying groundwork for the eventual transition to Stage 3. This requires coordinated policies across multiple sectors.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4 text-blue-800">Stage 2 Policy Priorities</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            <div>
              <h4 className="font-bold text-blue-700 mb-2">Education Investment</h4>
              <ul className="text-blue-600 space-y-1">
                <li>• Universal primary education</li>
                <li>• Girls' education priority</li>
                <li>• Vocational training</li>
                <li>• Teacher training programs</li>
                <li>• School infrastructure</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-blue-700 mb-2">Healthcare Expansion</h4>
              <ul className="text-blue-600 space-y-1">
                <li>• Maternal health services</li>
                <li>• Family planning access</li>
                <li>• Vaccination programs</li>
                <li>• Rural health clinics</li>
                <li>• Nutrition programs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-blue-700 mb-2">Economic Development</h4>
              <ul className="text-blue-600 space-y-1">
                <li>• Job creation initiatives</li>
                <li>• Agricultural productivity</li>
                <li>• Manufacturing development</li>
                <li>• Infrastructure investment</li>
                <li>• Financial services</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-blue-700 mb-2">Urban Planning</h4>
              <ul className="text-blue-600 space-y-1">
                <li>• Housing development</li>
                <li>• Transportation systems</li>
                <li>• Water and sanitation</li>
                <li>• Electricity access</li>
                <li>• Slum upgrading</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Transition to Stage 3: When Birth Rates Start Falling</h2>

        <p>
          Stage 2 countries eventually transition to Stage 3 when birth rates begin declining significantly. This transition is triggered by several interconnected changes:
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4 text-green-800">Stage 2 to Stage 3 Transition Triggers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-bold text-green-700 mb-2">Economic Changes</h4>
              <ul className="text-green-600 space-y-1">
                <li>• Urbanization accelerates (50%+ urban)</li>
                <li>• Service economy develops</li>
                <li>• Income per capita rises</li>
                <li>• Child labor becomes less valuable</li>
                <li>• Education costs increase</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-green-700 mb-2">Social Transformations</h4>
              <ul className="text-green-600 space-y-1">
                <li>• Women enter workforce</li>
                <li>• Secondary education expands</li>
                <li>• Nuclear families become norm</li>
                <li>• Consumer culture emerges</li>
                <li>• Individual aspirations rise</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-green-700 mb-2">Cultural Shifts</h4>
              <ul className="text-green-600 space-y-1">
                <li>• Family planning acceptance</li>
                <li>• Quality over quantity in children</li>
                <li>• Women's empowerment</li>
                <li>• Secular values spread</li>
                <li>• Future orientation develops</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Success Stories: Countries That Navigated Stage 2 Well</h2>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4">Stage 2 Success Examples</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-bold text-gray-800">South Korea (1960-1990)</h4>
              <p className="text-gray-700">Rapid economic growth plus family planning programs. Invested heavily in education, especially for women. Created jobs in manufacturing and services. Successfully transitioned to Stage 3 by 1980s.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Thailand (1970-2000)</h4>
              <p className="text-gray-700">Combined economic development with effective population policies. Tourism and manufacturing created urban jobs. Strong family planning programs. Smooth transition to Stage 3.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Brazil (1950-1980)</h4>
              <p className="text-gray-700">Industrialization and urbanization drove fertility decline. Television and media spread new family models. Government invested in health and education. Successfully managing Stage 3 transition.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Bangladesh (1980-Present)</h4>
              <p className="text-gray-700">Despite poverty, successful family planning programs and women's empowerment through microcredit. Garment industry created jobs for women. Moving toward late Stage 2/early Stage 3.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion: Stage 2 as Demographic Opportunity</h2>

        <div className="bg-gradient-to-r from-yellow-100 to-green-100 border border-gray-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4 text-center">Stage 2: The Critical Transition</h3>
          <div className="text-center space-y-3">
            <p className="text-lg">
              Stage 2 represents humanity's greatest demographic opportunity and challenge. Countries that manage rapid population growth well can harness the demographic dividend.
            </p>
            <p className="text-lg">
              Those that fail to invest in education, healthcare, and job creation risk demographic disaster—large youth populations without opportunities.
            </p>
            <p className="text-lg">
              The expanding pyramid shape of Stage 2 contains tomorrow's workforce, innovators, and leaders—if countries can successfully navigate the transition.
            </p>
          </div>
        </div>

        <p className="text-lg text-gray-700 mt-8">
          Stage 2 countries stand at a crossroads. Their expanding population pyramids represent enormous potential energy—they can fuel economic growth and social progress for decades. But this potential must be carefully managed through smart policies and investments. Countries that succeed in Stage 2 lay the foundation for prosperity in Stage 3 and beyond. Those that struggle risk being trapped in poverty with unsustainable population growth.
        </p>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-bold mb-3">Continue Your Demographic Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/blog/stage-1-demographic-transition" className="text-blue-600 hover:text-blue-800 underline">
              ← Stage 1: High Stationary
            </Link>
            <Link href="/blog/stage-3-demographic-transition" className="text-blue-600 hover:text-blue-800 underline">
              Stage 3: Late Expanding →
            </Link>
            <Link href="/blog/kenya" className="text-blue-600 hover:text-blue-800 underline">
              Explore Kenya's Population Pyramid →
            </Link>
            <Link href="/blog/uganda" className="text-blue-600 hover:text-blue-800 underline">
              Analyze Uganda's Demographics →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}