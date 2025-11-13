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

// Import country data for examples
import germanyData from '@/data/population/germany.json';
import japanData from '@/data/population/japan.json';
import southKoreaData from '@/data/population/south-korea.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export default function FourVsFiveStagesPage() {
  // Get the latest year data for examples
  const germany2024Data = germanyData.years['2024'];
  const japan2024Data = japanData.years['2024'];
  const southKorea2024Data = southKoreaData.years['2024'];

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
          backgroundColor: color,
          borderColor: color,
          borderWidth: 0.5,
          barPercentage: 1.0,
          categoryPercentage: 1.0,
        },
        {
          label: 'Female',
          data: data.ageGroups.map((ag: any) => ag.female).reverse(),
          backgroundColor: color.replace('0.8', '0.6'),
          borderColor: color,
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

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          4 vs 5 Stages of Demographic Transition: Which Model Should You Use?
        </h1>
        <div className="flex items-center text-gray-600 text-sm space-x-4">
          <time dateTime="2024-11-13">November 13, 2024</time>
          <span>•</span>
          <span>8 min read</span>
          <span>•</span>
          <span className="text-purple-600 font-medium">Demographics Comparison</span>
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          Should you use the classic 4-stage or modern 5-stage demographic transition model? The answer depends on what you're analyzing. The original 4-stage model perfectly explains the transition from pre-industrial to post-industrial society. But when countries began experiencing population decline in the 2000s, demographers added Stage 5 to explain this new reality. Here's when and why to use each model.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Core Difference: What Happens After Stage 4?</h2>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Quick Summary</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h4 className="font-bold text-blue-800 mb-2">4-Stage Model (1929)</h4>
              <p className="text-blue-700 text-sm">
                <strong>Ends at:</strong> Low birth and death rates, stable population<br/>
                <strong>Assumption:</strong> Countries reach equilibrium and stay there<br/>
                <strong>Best for:</strong> Understanding the classic demographic transition
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h4 className="font-bold text-purple-800 mb-2">5-Stage Model (2000s)</h4>
              <p className="text-purple-700 text-sm">
                <strong>Adds Stage 5:</strong> Birth rates fall below death rates<br/>
                <strong>Reality:</strong> Many developed countries now have declining populations<br/>
                <strong>Best for:</strong> Analyzing modern demographic challenges
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Historical Context: Why the Models Evolved</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">The Original 4-Stage Model (1929)</h3>
        <p>
          Warren Thompson created the demographic transition model in 1929 by studying Western Europe's population changes during industrialization. His 4-stage model assumed that countries would eventually reach a stable equilibrium with low birth and death rates—and stay there. This made perfect sense at the time because:
        </p>

        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>No country had yet experienced sustained population decline</li>
          <li>The model successfully predicted patterns in developing countries</li>
          <li>Replacement-level fertility (2.1 children per woman) seemed like a natural stopping point</li>
          <li>Economic development appeared to stabilize populations, not shrink them</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Why Stage 5 Was Added (2000s)</h3>
        <p>
          By the early 2000s, demographic reality had outpaced Thompson's model. Countries weren't stopping at replacement-level fertility—they kept declining:
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
          <h4 className="font-bold text-gray-800 mb-3">The Stage 5 Trigger Events</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• <strong>Germany (1972):</strong> First major country to drop below replacement fertility</li>
            <li>• <strong>Japan (2007):</strong> Population began shrinking despite immigration</li>
            <li>• <strong>South Korea (2020):</strong> Hit world record low fertility rate of 0.84</li>
            <li>• <strong>Europe-wide trend:</strong> Most EU countries now below replacement level</li>
          </ul>
        </div>

        <p>
          Demographers realized they needed Stage 5 to explain this new phenomenon where birth rates fall below death rates, creating natural population decline even without war, disease, or disaster.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Stage-by-Stage Comparison</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-200 p-3 text-left font-bold">Stage</th>
                <th className="border border-gray-200 p-3 text-left font-bold">4-Stage Model</th>
                <th className="border border-gray-200 p-3 text-left font-bold">5-Stage Model</th>
                <th className="border border-gray-200 p-3 text-left font-bold">Key Difference</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr>
                <td className="border border-gray-200 p-3 font-semibold bg-red-50">Stage 1</td>
                <td className="border border-gray-200 p-3">High birth/death rates<br/>Slow growth</td>
                <td className="border border-gray-200 p-3">High birth/death rates<br/>Slow growth</td>
                <td className="border border-gray-200 p-3 text-green-600">Identical</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-semibold bg-yellow-50">Stage 2</td>
                <td className="border border-gray-200 p-3">Death rates fall<br/>Rapid growth</td>
                <td className="border border-gray-200 p-3">Death rates fall<br/>Rapid growth</td>
                <td className="border border-gray-200 p-3 text-green-600">Identical</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-semibold bg-green-50">Stage 3</td>
                <td className="border border-gray-200 p-3">Birth rates fall<br/>Slowing growth</td>
                <td className="border border-gray-200 p-3">Birth rates fall<br/>Slowing growth</td>
                <td className="border border-gray-200 p-3 text-green-600">Identical</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-semibold bg-blue-50">Stage 4</td>
                <td className="border border-gray-200 p-3"><strong>FINAL STAGE</strong><br/>Low birth/death rates<br/>Stable population</td>
                <td className="border border-gray-200 p-3">Low birth/death rates<br/>Stable population<br/><em>Temporary phase</em></td>
                <td className="border border-gray-200 p-3 text-orange-600">Stage 4 is final vs transitional</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-semibold bg-purple-50">Stage 5</td>
                <td className="border border-gray-200 p-3 text-gray-400"><em>Does not exist</em></td>
                <td className="border border-gray-200 p-3">Birth rates below death rates<br/>Population decline</td>
                <td className="border border-gray-200 p-3 text-red-600">Only 5-stage model includes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Stage 5 Debate: Real Phenomenon or Statistical Anomaly?</h2>

        <p>
          Not all demographers agree that Stage 5 deserves its own category. The debate centers on whether ultra-low fertility is:
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-green-800 mb-3">Arguments FOR Stage 5</h3>
            <ul className="text-green-700 space-y-2 text-sm">
              <li>• <strong>Sustained trend:</strong> 50+ years of below-replacement fertility in some countries</li>
              <li>• <strong>Multiple causes:</strong> Economic, cultural, and social factors drive continued decline</li>
              <li>• <strong>Policy implications:</strong> Requires fundamentally different responses than Stage 4</li>
              <li>• <strong>Predictive power:</strong> Helps forecast aging and labor shortages</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-800 mb-3">Arguments AGAINST Stage 5</h3>
            <ul className="text-red-700 space-y-2 text-sm">
              <li>• <strong>Temporary phase:</strong> Fertility might rebound to replacement level</li>
              <li>• <strong>Immigration:</strong> Many "Stage 5" countries maintain population growth through immigration</li>
              <li>• <strong>Policy responses:</strong> Governments may successfully reverse decline</li>
              <li>• <strong>Model simplicity:</strong> Adding stages makes the model less elegant</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Population Pyramids: Seeing the Difference</h2>

        <p className="mb-6">
          The clearest way to understand the 4 vs 5 stage difference is through population pyramids. Stage 4 countries have rectangular pyramids showing stability, while Stage 5 countries have inverted pyramids showing decline.
        </p>

        <div className="grid md:grid-cols-3 gap-6 my-8">
          {/* Stage 4 Example */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-lg font-bold text-blue-800 mb-3 text-center">Stage 4: Germany</h4>
            <p className="text-blue-700 text-sm mb-4 text-center">
              Classic Stage 4: Stable population, rectangular pyramid
            </p>
            <div className="h-80 bg-white p-3 rounded-lg border">
              {germany2024Data && (() => {
                const pyramidData = createPyramidData(germany2024Data, 'Germany 2024', 'rgba(59, 130, 246, 0.8)');
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
                          text: `TFR: 1.5, Growth: -0.3%`
                        }
                      }
                    }} 
                  />
                );
              })()}
            </div>
          </div>

          {/* Stage 5 Example 1 */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-lg font-bold text-purple-800 mb-3 text-center">Stage 5: Japan</h4>
            <p className="text-purple-700 text-sm mb-4 text-center">
              Clear Stage 5: Aging society, inverted pyramid
            </p>
            <div className="h-80 bg-white p-3 rounded-lg border">
              {japan2024Data && (() => {
                const pyramidData = createPyramidData(japan2024Data, 'Japan 2024', 'rgba(147, 51, 234, 0.8)');
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
                          text: `TFR: 1.3, Growth: -0.4%`
                        }
                      }
                    }} 
                  />
                );
              })()}
            </div>
          </div>

          {/* Stage 5 Example 2 */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-lg font-bold text-purple-800 mb-3 text-center">Stage 5: South Korea</h4>
            <p className="text-purple-700 text-sm mb-4 text-center">
              Extreme Stage 5: World's lowest fertility rate
            </p>
            <div className="h-80 bg-white p-3 rounded-lg border">
              {southKorea2024Data && (() => {
                const pyramidData = createPyramidData(southKorea2024Data, 'South Korea 2024', 'rgba(147, 51, 234, 0.8)');
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
                          text: `TFR: 0.8, Growth: -0.1%`
                        }
                      }
                    }} 
                  />
                );
              })()}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">When to Use Each Model</h2>

        <div className="grid md:grid-cols-2 gap-8 my-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Use the 4-Stage Model When:</h3>
            <ul className="text-blue-700 space-y-2">
              <li>• <strong>Teaching basics:</strong> Introducing demographic transition concept</li>
              <li>• <strong>Historical analysis:</strong> Studying pre-2000 demographic changes</li>
              <li>• <strong>Developing countries:</strong> Most are still in Stages 2-3</li>
              <li>• <strong>Long-term predictions:</strong> Stage 5 might be temporary</li>
              <li>• <strong>Simplified analysis:</strong> Don't need to address population decline</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-purple-800 mb-4">Use the 5-Stage Model When:</h3>
            <ul className="text-purple-700 space-y-2">
              <li>• <strong>Modern analysis:</strong> Studying current developed countries</li>
              <li>• <strong>Policy making:</strong> Addressing aging populations and labor shortages</li>
              <li>• <strong>Economic planning:</strong> Pension systems, healthcare, immigration</li>
              <li>• <strong>Comprehensive studies:</strong> Need to explain all observed patterns</li>
              <li>• <strong>Forecasting:</strong> Predicting future demographic challenges</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Geographic Distribution: Where Each Model Applies</h2>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4">Global Stage Distribution (2024)</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-blue-800 mb-2">4-Stage Model Still Accurate:</h4>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• <strong>Sub-Saharan Africa:</strong> Still in Stages 2-3</li>
                <li>• <strong>South Asia:</strong> India, Pakistan transitioning through Stage 3</li>
                <li>• <strong>Latin America:</strong> Most countries in late Stage 3</li>
                <li>• <strong>Middle East:</strong> Mixed stages, many in Stage 3</li>
                <li>• <strong>Southeast Asia:</strong> Thailand, Vietnam entering Stage 4</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-purple-800 mb-2">5-Stage Model Needed:</h4>
              <ul className="text-purple-700 space-y-1 text-sm">
                <li>• <strong>East Asia:</strong> Japan, South Korea, Taiwan, Singapore</li>
                <li>• <strong>Europe:</strong> Germany, Italy, Spain, Poland</li>
                <li>• <strong>Post-Soviet:</strong> Russia, Ukraine, Baltic states</li>
                <li>• <strong>North America:</strong> Parts of US/Canada without immigration</li>
                <li>• <strong>Oceania:</strong> Australia, New Zealand (trending toward Stage 5)</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Practical Implications for Policy and Planning</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">Stage 4 vs Stage 5: Different Challenges</h3>
        
        <div className="overflow-x-auto my-6">
          <table className="min-w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-200 p-3 text-left font-bold">Policy Area</th>
                <th className="border border-gray-200 p-3 text-left font-bold">Stage 4 Response</th>
                <th className="border border-gray-200 p-3 text-left font-bold">Stage 5 Response</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 p-3 font-semibold">Labor Force</td>
                <td className="border border-gray-200 p-3">Maintain current workforce</td>
                <td className="border border-gray-200 p-3">Increase immigration, automation</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-semibold">Healthcare</td>
                <td className="border border-gray-200 p-3">Balanced age-based planning</td>
                <td className="border border-gray-200 p-3">Focus on elderly care, chronic diseases</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-semibold">Education</td>
                <td className="border border-gray-200 p-3">Stable school-age population</td>
                <td className="border border-gray-200 p-3">Shrinking schools, teacher surpluses</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-semibold">Pensions</td>
                <td className="border border-gray-200 p-3">Standard retirement planning</td>
                <td className="border border-gray-200 p-3">Radical reforms needed</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-semibold">Housing</td>
                <td className="border border-gray-200 p-3">Steady demand</td>
                <td className="border border-gray-200 p-3">Oversupply, rural abandonment</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Future of the Models</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">Will We Need a Stage 6?</h3>
        <p>
          Some demographers are already discussing potential Stage 6 scenarios:
        </p>

        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Fertility rebound:</strong> Countries successfully reverse decline through policy</li>
          <li><strong>Immigration-driven growth:</strong> Population maintained through migration</li>
          <li><strong>Technological transformation:</strong> AI and automation change demographic needs</li>
          <li><strong>Extreme aging:</strong> Societies with 50%+ elderly populations</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Model Limitations</h3>
        <p>
          Both models share important limitations:
        </p>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 my-6">
          <h4 className="font-bold text-orange-800 mb-3">What Neither Model Explains Well</h4>
          <ul className="text-orange-700 space-y-2 text-sm">
            <li>• <strong>Immigration effects:</strong> How migration changes demographic patterns</li>
            <li>• <strong>Economic crises:</strong> Temporary fertility drops during recessions</li>
            <li>• <strong>Cultural factors:</strong> Why fertility varies between similar countries</li>
            <li>• <strong>Policy impacts:</strong> How government interventions change trajectories</li>
            <li>• <strong>Climate effects:</strong> Environmental pressures on population growth</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion: Choose Your Model Wisely</h2>

        <div className="bg-gradient-to-r from-blue-100 to-purple-100 border border-gray-200 rounded-lg p-6 my-8">
          <h3 className="text-xl font-bold mb-4 text-center">The Bottom Line</h3>
          <div className="text-center space-y-3">
            <p className="text-lg">
              <strong>For most purposes, use the 4-stage model.</strong> It's simpler, more established, and covers the main demographic transition that most countries experience.
            </p>
            <p className="text-lg">
              <strong>Use the 5-stage model when dealing with developed countries</strong> experiencing or approaching population decline. It's essential for understanding modern demographic challenges.
            </p>
            <p className="text-lg">
              <strong>Both models are tools—choose the right tool for your analysis.</strong> The goal is understanding demographic patterns, not defending theoretical positions.
            </p>
          </div>
        </div>

        <p className="text-lg text-gray-700 mt-8">
          The demographic transition model continues to evolve as human populations face new challenges. Whether you use 4 or 5 stages, the key insight remains the same: population change follows predictable patterns that societies can understand and prepare for. As we face an aging world and potential population decline, these models become more important than ever for planning our demographic future.
        </p>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-bold mb-3">Explore More Demographic Transition Content</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/blog/4-stages-demographic-transition-model" className="text-blue-600 hover:text-blue-800 underline">
              Learn about the 4-stage model in detail →
            </Link>
            <Link href="/blog/population-pyramid-stages-demographic-transition" className="text-blue-600 hover:text-blue-800 underline">
              Explore the complete 5-stage model →
            </Link>
            <Link href="/blog/stage-1-demographic-transition" className="text-blue-600 hover:text-blue-800 underline">
              Deep dive into Stage 1 countries →
            </Link>
            <Link href="/blog/stage-5-demographic-transition" className="text-blue-600 hover:text-blue-800 underline">
              Understand Stage 5 population decline →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}