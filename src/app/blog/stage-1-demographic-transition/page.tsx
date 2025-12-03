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

// Import country data - 4 examples of Stage 1 and comparison countries
import nigerData from '@/data/population/niger.json';           // Stage 1 example 1
import chadData from '@/data/population/chad.json';             // Stage 1 example 2  
import maliData from '@/data/population/mali.json';             // Stage 1 example 3
import somaliaData from '@/data/population/somalia.json';       // Stage 1 example 4

// Comparison countries for different stages
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


export default function Stage1DemographicTransitionPage() {
  // Get 2024 data for all countries
  const niger2024 = nigerData.years['2024'];
  const chad2024 = chadData.years['2024'];
  const mali2024 = maliData.years['2024'];
  const somalia2024 = somaliaData.years['2024'];
  
  // Comparison countries
  const kenya2024 = kenyaData.years['2024'];
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
            // Don't show surplus in tooltip, it's just visual
            if (!context.dataset.label || context.dataset.label === '') {
              return null;
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
          Stage 1 Demographic Transition: The Foundation of Human Population Patterns
        </h1>
        <div className="flex items-center text-gray-600 text-sm space-x-4">
          <time dateTime="2024-11-13">November 13, 2024</time>
          <span>•</span>
          <span>15 min read</span>
          <span>•</span>
          <span className="text-red-600 font-medium">Stage 1 Analysis</span>
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          Stage 1 represents humanity's natural demographic state for 99.9% of our history. Characterized by extremely high birth and death rates, this stage created the distinctive wide-based, rapidly narrowing population pyramids that sustained human civilization for millennia. Today, only a handful of countries remain close to Stage 1, offering us a window into our demographic past and the foundation upon which all other stages build.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">What Defines Stage 1: The High Stationary Stage</h2>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-red-800">Stage 1 Key Characteristics</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-red-700 mb-2">Vital Statistics</h4>
              <ul className="text-red-700 space-y-1 text-sm">
                <li>• <strong>Birth Rate:</strong> 40-50 per 1,000 people</li>
                <li>• <strong>Death Rate:</strong> 35-45 per 1,000 people</li>
                <li>• <strong>Population Growth:</strong> 0-0.5% annually</li>
                <li>• <strong>Life Expectancy:</strong> 25-35 years</li>
                <li>• <strong>Infant Mortality:</strong> 200-300 per 1,000 births</li>
                <li>• <strong>Total Fertility Rate:</strong> 6-8 children per woman</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-red-700 mb-2">Social Structure</h4>
              <ul className="text-red-700 space-y-1 text-sm">
                <li>• <strong>Economy:</strong> Agricultural subsistence</li>
                <li>• <strong>Education:</strong> Minimal formal schooling</li>
                <li>• <strong>Healthcare:</strong> Traditional/herbal medicine</li>
                <li>• <strong>Family Size:</strong> Large families for economic survival</li>
                <li>• <strong>Urbanization:</strong> Less than 10% urban</li>
                <li>• <strong>Women's Role:</strong> Primarily reproductive/domestic</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Pyramid Shape: Wide Base, Narrow Top</h2>

        <p>
          Stage 1 creates the most dramatic population pyramid shape: an extremely wide base that narrows sharply with each age group. This reflects the harsh demographic reality where many children are born but few survive to old age.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4">Why Stage 1 Pyramids Look This Way</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Wide Base (Ages 0-14)</h4>
              <ul className="text-gray-700 space-y-1">
                <li>• High fertility rates (6+ children per woman)</li>
                <li>• No family planning</li>
                <li>• Children needed for labor</li>
                <li>• High infant mortality requires "insurance births"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Narrow Middle (Ages 15-64)</h4>
              <ul className="text-gray-700 space-y-1">
                <li>• High childhood mortality</li>
                <li>• Diseases reduce adult population</li>
                <li>• Malnutrition weakens survivors</li>
                <li>• Periodic famines and epidemics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Sharp Top (Ages 65+)</h4>
              <ul className="text-gray-700 space-y-1">
                <li>• Very few reach old age</li>
                <li>• No modern healthcare</li>
                <li>• Physically demanding lifestyle</li>
                <li>• Elderly represent wisdom/experience</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Modern Stage 1 Examples: Four Countries</h2>

        <p className="mb-6">
          While no country today is truly Stage 1 (none have the extremely high death rates of pre-industrial societies), several countries in Sub-Saharan Africa maintain the high fertility patterns characteristic of Stage 1. These countries show us the closest modern approximation to historical demographic patterns.
        </p>

        <div className="grid md:grid-cols-2 gap-8 my-12">
          {/* Niger */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-red-800">1. Niger: Highest Fertility in the World</h3>
            <div className="h-96 bg-white p-4 rounded-lg border mb-4">
              {niger2024 && (() => {
                const pyramidData = createPyramidData(niger2024, 'Niger 2024', 'rgba(239, 68, 68, 0.8)');
                if (!pyramidData) return null;
                return (
                  <Bar 
                    data={pyramidData} 
                    options={createPyramidOptions(pyramidData.maxValue, 'Birth Rate: 42.1/1000 | Death Rate: 9.2/1000 | TFR: 6.8')} 
                  />
                );
              })()}
            </div>
            <div className="space-y-2 text-sm text-red-700">
              <p><strong>Population:</strong> 27 million</p>
              <p><strong>Growth Rate:</strong> 3.8% (world's highest)</p>
              <p><strong>Median Age:</strong> 14.8 years</p>
              <p><strong>Economy:</strong> 80% agriculture, mostly subsistence</p>
              <p><strong>Why Stage 1-like:</strong> Extreme poverty, traditional agriculture, high fertility culturally valued, limited family planning access</p>
            </div>
          </div>

          {/* Chad */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-red-800">2. Chad: Landlocked Sahel Challenges</h3>
            <div className="h-96 bg-white p-4 rounded-lg border mb-4">
              {chad2024 && (() => {
                const pyramidData = createPyramidData(chad2024, 'Chad 2024', 'rgba(220, 38, 38, 0.8)');
                if (!pyramidData) return null;
                return (
                  <Bar 
                    data={pyramidData} 
                    options={createPyramidOptions(pyramidData.maxValue, 'Birth Rate: 40.8/1000 | Death Rate: 11.2/1000 | TFR: 5.8')} 
                  />
                );
              })()}
            </div>
            <div className="space-y-2 text-sm text-red-700">
              <p><strong>Population:</strong> 18 million</p>
              <p><strong>Growth Rate:</strong> 2.9%</p>
              <p><strong>Median Age:</strong> 16.1 years</p>
              <p><strong>Economy:</strong> Oil and agriculture, high poverty</p>
              <p><strong>Why Stage 1-like:</strong> Civil conflict, drought cycles, nomadic populations, traditional family structures</p>
            </div>
          </div>

          {/* Mali */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-red-800">3. Mali: Traditional Sahel Society</h3>
            <div className="h-96 bg-white p-4 rounded-lg border mb-4">
              {mali2024 && (() => {
                const pyramidData = createPyramidData(mali2024, 'Mali 2024', 'rgba(185, 28, 28, 0.8)');
                if (!pyramidData) return null;
                return (
                  <Bar 
                    data={pyramidData} 
                    options={createPyramidOptions(pyramidData.maxValue, 'Birth Rate: 41.6/1000 | Death Rate: 8.4/1000 | TFR: 5.9')} 
                  />
                );
              })()}
            </div>
            <div className="space-y-2 text-sm text-red-700">
              <p><strong>Population:</strong> 23 million</p>
              <p><strong>Growth Rate:</strong> 3.3%</p>
              <p><strong>Median Age:</strong> 16.3 years</p>
              <p><strong>Economy:</strong> Agriculture, gold mining, cotton</p>
              <p><strong>Why Stage 1-like:</strong> Rural population 70%, traditional Islamic values favor large families, limited education for women</p>
            </div>
          </div>

          {/* Somalia */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-red-800">4. Somalia: Conflict and High Fertility</h3>
            <div className="h-96 bg-white p-4 rounded-lg border mb-4">
              {somalia2024 && (() => {
                const pyramidData = createPyramidData(somalia2024, 'Somalia 2024', 'rgba(153, 27, 27, 0.8)');
                if (!pyramidData) return null;
                return (
                  <Bar 
                    data={pyramidData} 
                    options={createPyramidOptions(pyramidData.maxValue, 'Birth Rate: 39.3/1000 | Death Rate: 12.8/1000 | TFR: 6.1')} 
                  />
                );
              })()}
            </div>
            <div className="space-y-2 text-sm text-red-700">
              <p><strong>Population:</strong> 18 million</p>
              <p><strong>Growth Rate:</strong> 2.6%</p>
              <p><strong>Median Age:</strong> 18.5 years</p>
              <p><strong>Economy:</strong> Pastoralism, trade, remittances</p>
              <p><strong>Why Stage 1-like:</strong> Prolonged civil conflict, nomadic culture, high child mortality creates demand for many births</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Stage 1 vs All Other Stages: Population Pyramid Comparisons</h2>

        <p className="mb-8">
          To truly understand Stage 1, we need to see how dramatically different it looks from all other demographic stages. The progression from Stage 1's wide base to Stage 5's inverted pyramid tells the story of humanity's demographic transformation.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Stage 1 vs Stage 2: Death Rates Begin to Fall</h3>
        <div className="bg-gradient-to-r from-red-50 to-yellow-50 border border-gray-200 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
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
                Sharp narrowing, few elderly
              </p>
            </div>
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
          </div>
          <div className="mt-6 bg-white p-4 rounded border">
            <h4 className="font-bold mb-2">Key Difference: Child Survival</h4>
            <p className="text-sm text-gray-700">
              Stage 2 countries like Kenya have dramatically improved child survival through basic healthcare, vaccinations, and better nutrition. Notice how Kenya's pyramid has a much broader middle section—more children survive to adulthood, creating rapid population growth.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Stage 1 vs Stage 3: Birth Rates Start Declining</h3>
        <div className="bg-gradient-to-r from-red-50 to-green-50 border border-gray-200 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-red-800 mb-3 text-center">Stage 1: Chad</h4>
              <div className="h-80 bg-white p-3 rounded-lg border">
                {chad2024 && (() => {
                  const pyramidData = createPyramidData(chad2024, 'Chad', 'rgba(220, 38, 38, 0.8)');
                  if (!pyramidData) return null;
                  return <Bar data={pyramidData} options={createPyramidOptions(pyramidData.maxValue)} />;
                })()}
              </div>
              <p className="text-red-700 text-sm text-center mt-2">
                <strong>Growth:</strong> 2.9% | <strong>TFR:</strong> 5.8<br/>
                Extremely wide base
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
                Narrowing base, bulging middle
              </p>
            </div>
          </div>
          <div className="mt-6 bg-white p-4 rounded border">
            <h4 className="font-bold mb-2">Key Difference: Family Planning Revolution</h4>
            <p className="text-sm text-gray-700">
              Brazil shows how education, urbanization, and women's empowerment transform fertility patterns. The narrower base reflects families choosing fewer children, while the bulging middle section shows the "demographic dividend" of more working-age adults.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Stage 1 vs Stage 4: Low Birth and Death Rates</h3>
        <div className="bg-gradient-to-r from-red-50 to-blue-50 border border-gray-200 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-red-800 mb-3 text-center">Stage 1: Mali</h4>
              <div className="h-80 bg-white p-3 rounded-lg border">
                {mali2024 && (() => {
                  const pyramidData = createPyramidData(mali2024, 'Mali', 'rgba(185, 28, 28, 0.8)');
                  if (!pyramidData) return null;
                  return <Bar data={pyramidData} options={createPyramidOptions(pyramidData.maxValue)} />;
                })()}
              </div>
              <p className="text-red-700 text-sm text-center mt-2">
                <strong>Growth:</strong> 3.3% | <strong>TFR:</strong> 5.9<br/>
                Classic triangle shape
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
                Rectangular, aging top
              </p>
            </div>
          </div>
          <div className="mt-6 bg-white p-4 rounded border">
            <h4 className="font-bold mb-2">Key Difference: Complete Demographic Transition</h4>
            <p className="text-sm text-gray-700">
              Germany represents the endpoint of demographic transition—low birth rates, low death rates, and an aging population. The rectangular pyramid shows stable population with growing challenges from an aging society.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Stage 1 vs Stage 5: Population Decline</h3>
        <div className="bg-gradient-to-r from-red-50 to-purple-50 border border-gray-200 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-red-800 mb-3 text-center">Stage 1: Somalia</h4>
              <div className="h-80 bg-white p-3 rounded-lg border">
                {somalia2024 && (() => {
                  const pyramidData = createPyramidData(somalia2024, 'Somalia', 'rgba(153, 27, 27, 0.8)');
                  if (!pyramidData) return null;
                  return <Bar data={pyramidData} options={createPyramidOptions(pyramidData.maxValue)} />;
                })()}
              </div>
              <p className="text-red-700 text-sm text-center mt-2">
                <strong>Growth:</strong> 2.6% | <strong>TFR:</strong> 6.1<br/>
                Youth explosion
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
                Inverted pyramid
              </p>
            </div>
          </div>
          <div className="mt-6 bg-white p-4 rounded border">
            <h4 className="font-bold mb-2">Key Difference: Opposite Extremes</h4>
            <p className="text-sm text-gray-700">
              These represent opposite ends of the demographic spectrum. Somalia has explosive youth growth with 50%+ under age 15, while Japan faces population decline with 30% over age 65. This contrast shows the complete journey from demographic expansion to contraction.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Why Countries Get Stuck in Stage 1</h2>

        <p>
          While most of the world has moved beyond Stage 1, some countries remain locked in high-fertility patterns. Understanding these barriers helps explain why demographic transition isn't automatic.
        </p>

        <div className="grid md:grid-cols-2 gap-8 my-8">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-orange-800 mb-3">Economic Barriers</h3>
            <ul className="text-orange-700 space-y-2 text-sm">
              <li>• <strong>Child labor dependency:</strong> Children provide immediate economic value</li>
              <li>• <strong>No social security:</strong> Large families provide old-age security</li>
              <li>• <strong>Agricultural economy:</strong> More hands = more production</li>
              <li>• <strong>Poverty trap:</strong> Can't afford to invest in fewer, educated children</li>
              <li>• <strong>High infant mortality:</strong> Need many births to ensure survivors</li>
            </ul>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-purple-800 mb-3">Cultural/Social Barriers</h3>
            <ul className="text-purple-700 space-y-2 text-sm">
              <li>• <strong>Traditional values:</strong> Large families bring prestige</li>
              <li>• <strong>Religious beliefs:</strong> Many faiths encourage procreation</li>
              <li>• <strong>Gender roles:</strong> Women's status tied to childbearing</li>
              <li>• <strong>Limited education:</strong> Especially for girls and women</li>
              <li>• <strong>Social pressure:</strong> Community expectations for large families</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Path Out of Stage 1: What Triggers Transition</h2>

        <p>
          Countries escape Stage 1 when death rates begin falling faster than birth rates—the beginning of Stage 2. This transition typically requires several simultaneous changes:
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4 text-green-800">Stage 1 to Stage 2 Transition Triggers</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-bold text-green-700 mb-2">Healthcare Improvements</h4>
              <ul className="text-green-600 space-y-1">
                <li>• Basic vaccinations</li>
                <li>• Clean water access</li>
                <li>• Improved sanitation</li>
                <li>• Maternal health services</li>
                <li>• Treatment of infectious diseases</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-green-700 mb-2">Economic Development</h4>
              <ul className="text-green-600 space-y-1">
                <li>• Food security improvements</li>
                <li>• Basic education access</li>
                <li>• Transportation infrastructure</li>
                <li>• Market access for farmers</li>
                <li>• Non-agricultural employment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-green-700 mb-2">Social Changes</h4>
              <ul className="text-green-600 space-y-1">
                <li>• Government stability</li>
                <li>• Women's education</li>
                <li>• Urban growth</li>
                <li>• Family planning access</li>
                <li>• Cultural modernization</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Historical Perspective: When the World Was Stage 1</h2>

        <p>
          Understanding Stage 1 helps us appreciate how recent our demographic revolution truly is. For most of human history, all societies exhibited Stage 1 characteristics.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4">Historical Stage 1 Examples</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-bold text-gray-800">Medieval Europe (800-1750)</h4>
              <p className="text-gray-700">Birth rates 40-50/1000, death rates 35-45/1000. Periodic famines and plagues kept population growth minimal. Life expectancy around 30 years.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Pre-Industrial China (to 1950)</h4>
              <p className="text-gray-700">Despite advanced civilization, remained Stage 1 due to agricultural economy, traditional values, and periodic disasters. Population cycles of growth and decline.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Pre-Columbian Americas (to 1500)</h4>
              <p className="text-gray-700">High fertility balanced by disease, warfare, and environmental challenges. Sophisticated societies but Stage 1 demographics.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Colonial Africa (to 1900)</h4>
              <p className="text-gray-700">Traditional societies with high birth/death rates. European colonization often disrupted existing demographic patterns without immediately improving survival.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion: Stage 1 as Foundation</h2>

        <div className="bg-gradient-to-r from-red-100 to-blue-100 border border-gray-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4 text-center">Stage 1: The Demographic Foundation</h3>
          <div className="text-center space-y-3">
            <p className="text-lg">
              Stage 1 represents humanity's demographic baseline—the natural state that shaped our evolution, culture, and social structures for millennia.
            </p>
            <p className="text-lg">
              Today's few remaining Stage 1 countries offer crucial insights into demographic behavior and the challenges of transitioning to sustained development.
            </p>
            <p className="text-lg">
              Understanding Stage 1 is essential for grasping the magnitude of the demographic transformation that has reshaped human civilization.
            </p>
          </div>
        </div>

        <p className="text-lg text-gray-700 mt-8">
          Stage 1 countries face immense challenges but also possess tremendous potential. Their young populations could become powerful engines of economic growth—if they can successfully navigate the transition to Stage 2. The wide-based pyramids that characterize Stage 1 aren't problems to solve but starting points for building demographic momentum that can drive development for generations.
        </p>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-bold mb-3">Continue Your Demographic Journey</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/blog/stage-2-demographic-transition" className="text-blue-600 hover:text-blue-800 underline">
              Stage 2: Early Expanding → 
            </Link>
            <Link href="/blog/4-vs-5-stages-demographic-transition-model" className="text-blue-600 hover:text-blue-800 underline">
              Compare 4 vs 5 Stage Models →
            </Link>
            <Link href="/blog/niger" className="text-blue-600 hover:text-blue-800 underline">
              Explore Niger's Population Pyramid →
            </Link>
            <Link href="/blog/chad" className="text-blue-600 hover:text-blue-800 underline">
              Analyze Chad's Demographics →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}