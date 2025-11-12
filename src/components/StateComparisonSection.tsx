'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MiniStatePyramid from './MiniStatePyramid';

interface ComparisonState {
  name: string;
  slug: string;
  data?: any;
  metrics?: any;
}

interface StateComparisonSectionProps {
  currentState: any;
  currentYearData: any;
  currentMetrics: any;
}

export default function StateComparisonSection({
  currentState,
  currentYearData,
  currentMetrics
}: StateComparisonSectionProps) {
  const [comparisonStates, setComparisonStates] = useState<ComparisonState[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComparisonData() {
      // Define comparison states based on current state
      let statesToCompare: ComparisonState[] = [];
      
      // Define neighbors and similar states for each state
      const stateComparisons: { [key: string]: ComparisonState[] } = {
        'alabama': [
          { name: 'Mississippi', slug: 'mississippi' },
          { name: 'Georgia', slug: 'georgia' },
          { name: 'Tennessee', slug: 'tennessee' }
        ],
        'alaska': [
          { name: 'Wyoming', slug: 'wyoming' },
          { name: 'Vermont', slug: 'vermont' },
          { name: 'North Dakota', slug: 'north-dakota' }
        ],
        'arizona': [
          { name: 'Nevada', slug: 'nevada' },
          { name: 'New Mexico', slug: 'new-mexico' },
          { name: 'Utah', slug: 'utah' }
        ],
        'arkansas': [
          { name: 'Mississippi', slug: 'mississippi' },
          { name: 'Louisiana', slug: 'louisiana' },
          { name: 'Oklahoma', slug: 'oklahoma' }
        ],
        'california': [
          { name: 'Texas', slug: 'texas' },
          { name: 'Florida', slug: 'florida' },
          { name: 'New York', slug: 'new-york' }
        ],
        'colorado': [
          { name: 'Utah', slug: 'utah' },
          { name: 'Arizona', slug: 'arizona' },
          { name: 'Oregon', slug: 'oregon' }
        ],
        'connecticut': [
          { name: 'Rhode Island', slug: 'rhode-island' },
          { name: 'Massachusetts', slug: 'massachusetts' },
          { name: 'New Jersey', slug: 'new-jersey' }
        ],
        'delaware': [
          { name: 'Rhode Island', slug: 'rhode-island' },
          { name: 'Vermont', slug: 'vermont' },
          { name: 'New Hampshire', slug: 'new-hampshire' }
        ],
        'district-of-columbia': [
          { name: 'Maryland', slug: 'maryland' },
          { name: 'Virginia', slug: 'virginia' },
          { name: 'Delaware', slug: 'delaware' }
        ],
        'florida': [
          { name: 'Texas', slug: 'texas' },
          { name: 'California', slug: 'california' },
          { name: 'Georgia', slug: 'georgia' }
        ],
        'georgia': [
          { name: 'North Carolina', slug: 'north-carolina' },
          { name: 'Florida', slug: 'florida' },
          { name: 'South Carolina', slug: 'south-carolina' }
        ],
        'hawaii': [
          { name: 'Alaska', slug: 'alaska' },
          { name: 'Rhode Island', slug: 'rhode-island' },
          { name: 'Delaware', slug: 'delaware' }
        ],
        'idaho': [
          { name: 'Montana', slug: 'montana' },
          { name: 'Wyoming', slug: 'wyoming' },
          { name: 'Utah', slug: 'utah' }
        ],
        'illinois': [
          { name: 'Ohio', slug: 'ohio' },
          { name: 'Pennsylvania', slug: 'pennsylvania' },
          { name: 'Michigan', slug: 'michigan' }
        ],
        'indiana': [
          { name: 'Ohio', slug: 'ohio' },
          { name: 'Kentucky', slug: 'kentucky' },
          { name: 'Michigan', slug: 'michigan' }
        ],
        'iowa': [
          { name: 'Nebraska', slug: 'nebraska' },
          { name: 'Kansas', slug: 'kansas' },
          { name: 'Wisconsin', slug: 'wisconsin' }
        ],
        'kansas': [
          { name: 'Nebraska', slug: 'nebraska' },
          { name: 'Oklahoma', slug: 'oklahoma' },
          { name: 'Missouri', slug: 'missouri' }
        ],
        'kentucky': [
          { name: 'Tennessee', slug: 'tennessee' },
          { name: 'West Virginia', slug: 'west-virginia' },
          { name: 'Indiana', slug: 'indiana' }
        ],
        'louisiana': [
          { name: 'Mississippi', slug: 'mississippi' },
          { name: 'Arkansas', slug: 'arkansas' },
          { name: 'Alabama', slug: 'alabama' }
        ],
        'maine': [
          { name: 'Vermont', slug: 'vermont' },
          { name: 'New Hampshire', slug: 'new-hampshire' },
          { name: 'Rhode Island', slug: 'rhode-island' }
        ],
        'maryland': [
          { name: 'Virginia', slug: 'virginia' },
          { name: 'Delaware', slug: 'delaware' },
          { name: 'New Jersey', slug: 'new-jersey' }
        ],
        'massachusetts': [
          { name: 'Connecticut', slug: 'connecticut' },
          { name: 'Rhode Island', slug: 'rhode-island' },
          { name: 'New Hampshire', slug: 'new-hampshire' }
        ],
        'michigan': [
          { name: 'Ohio', slug: 'ohio' },
          { name: 'Illinois', slug: 'illinois' },
          { name: 'Wisconsin', slug: 'wisconsin' }
        ],
        'minnesota': [
          { name: 'Wisconsin', slug: 'wisconsin' },
          { name: 'Iowa', slug: 'iowa' },
          { name: 'North Dakota', slug: 'north-dakota' }
        ],
        'mississippi': [
          { name: 'Alabama', slug: 'alabama' },
          { name: 'Louisiana', slug: 'louisiana' },
          { name: 'Arkansas', slug: 'arkansas' }
        ],
        'missouri': [
          { name: 'Kansas', slug: 'kansas' },
          { name: 'Illinois', slug: 'illinois' },
          { name: 'Tennessee', slug: 'tennessee' }
        ],
        'montana': [
          { name: 'Wyoming', slug: 'wyoming' },
          { name: 'Idaho', slug: 'idaho' },
          { name: 'North Dakota', slug: 'north-dakota' }
        ],
        'nebraska': [
          { name: 'Kansas', slug: 'kansas' },
          { name: 'Iowa', slug: 'iowa' },
          { name: 'South Dakota', slug: 'south-dakota' }
        ],
        'nevada': [
          { name: 'Arizona', slug: 'arizona' },
          { name: 'Utah', slug: 'utah' },
          { name: 'New Mexico', slug: 'new-mexico' }
        ],
        'new-hampshire': [
          { name: 'Vermont', slug: 'vermont' },
          { name: 'Maine', slug: 'maine' },
          { name: 'Massachusetts', slug: 'massachusetts' }
        ],
        'new-jersey': [
          { name: 'New York', slug: 'new-york' },
          { name: 'Pennsylvania', slug: 'pennsylvania' },
          { name: 'Connecticut', slug: 'connecticut' }
        ],
        'new-mexico': [
          { name: 'Arizona', slug: 'arizona' },
          { name: 'Colorado', slug: 'colorado' },
          { name: 'Texas', slug: 'texas' }
        ],
        'new-york': [
          { name: 'California', slug: 'california' },
          { name: 'Texas', slug: 'texas' },
          { name: 'Pennsylvania', slug: 'pennsylvania' }
        ],
        'north-carolina': [
          { name: 'Virginia', slug: 'virginia' },
          { name: 'South Carolina', slug: 'south-carolina' },
          { name: 'Georgia', slug: 'georgia' }
        ],
        'north-dakota': [
          { name: 'South Dakota', slug: 'south-dakota' },
          { name: 'Montana', slug: 'montana' },
          { name: 'Wyoming', slug: 'wyoming' }
        ],
        'ohio': [
          { name: 'Pennsylvania', slug: 'pennsylvania' },
          { name: 'Michigan', slug: 'michigan' },
          { name: 'Indiana', slug: 'indiana' }
        ],
        'oklahoma': [
          { name: 'Texas', slug: 'texas' },
          { name: 'Kansas', slug: 'kansas' },
          { name: 'Arkansas', slug: 'arkansas' }
        ],
        'oregon': [
          { name: 'Washington', slug: 'washington' },
          { name: 'California', slug: 'california' },
          { name: 'Idaho', slug: 'idaho' }
        ],
        'pennsylvania': [
          { name: 'New York', slug: 'new-york' },
          { name: 'Ohio', slug: 'ohio' },
          { name: 'New Jersey', slug: 'new-jersey' }
        ],
        'rhode-island': [
          { name: 'Connecticut', slug: 'connecticut' },
          { name: 'Massachusetts', slug: 'massachusetts' },
          { name: 'Delaware', slug: 'delaware' }
        ],
        'south-carolina': [
          { name: 'North Carolina', slug: 'north-carolina' },
          { name: 'Georgia', slug: 'georgia' },
          { name: 'Tennessee', slug: 'tennessee' }
        ],
        'south-dakota': [
          { name: 'North Dakota', slug: 'north-dakota' },
          { name: 'Wyoming', slug: 'wyoming' },
          { name: 'Nebraska', slug: 'nebraska' }
        ],
        'tennessee': [
          { name: 'Kentucky', slug: 'kentucky' },
          { name: 'North Carolina', slug: 'north-carolina' },
          { name: 'Georgia', slug: 'georgia' }
        ],
        'texas': [
          { name: 'California', slug: 'california' },
          { name: 'Florida', slug: 'florida' },
          { name: 'New York', slug: 'new-york' }
        ],
        'utah': [
          { name: 'Colorado', slug: 'colorado' },
          { name: 'Arizona', slug: 'arizona' },
          { name: 'Nevada', slug: 'nevada' }
        ],
        'vermont': [
          { name: 'New Hampshire', slug: 'new-hampshire' },
          { name: 'Maine', slug: 'maine' },
          { name: 'Wyoming', slug: 'wyoming' }
        ],
        'virginia': [
          { name: 'North Carolina', slug: 'north-carolina' },
          { name: 'Maryland', slug: 'maryland' },
          { name: 'Georgia', slug: 'georgia' }
        ],
        'washington': [
          { name: 'Oregon', slug: 'oregon' },
          { name: 'California', slug: 'california' },
          { name: 'Colorado', slug: 'colorado' }
        ],
        'west-virginia': [
          { name: 'Kentucky', slug: 'kentucky' },
          { name: 'Virginia', slug: 'virginia' },
          { name: 'Ohio', slug: 'ohio' }
        ],
        'wisconsin': [
          { name: 'Minnesota', slug: 'minnesota' },
          { name: 'Michigan', slug: 'michigan' },
          { name: 'Illinois', slug: 'illinois' }
        ],
        'wyoming': [
          { name: 'Montana', slug: 'montana' },
          { name: 'Idaho', slug: 'idaho' },
          { name: 'South Dakota', slug: 'south-dakota' }
        ]
      };
      
      // Get comparison states for current state
      statesToCompare = stateComparisons[currentState.slug] || [];
      
      // If no specific comparisons defined, use regional defaults
      if (statesToCompare.length === 0) {
        const regionalStates: { [key: string]: ComparisonState[] } = {
          'South': [
            { name: 'Texas', slug: 'texas' },
            { name: 'Florida', slug: 'florida' },
            { name: 'Georgia', slug: 'georgia' }
          ],
          'West': [
            { name: 'California', slug: 'california' },
            { name: 'Arizona', slug: 'arizona' },
            { name: 'Washington', slug: 'washington' }
          ],
          'Midwest': [
            { name: 'Illinois', slug: 'illinois' },
            { name: 'Ohio', slug: 'ohio' },
            { name: 'Michigan', slug: 'michigan' }
          ],
          'Northeast': [
            { name: 'New York', slug: 'new-york' },
            { name: 'Pennsylvania', slug: 'pennsylvania' },
            { name: 'Massachusetts', slug: 'massachusetts' }
          ]
        };
        
        statesToCompare = regionalStates[currentState.region]?.filter(s => s.slug !== currentState.slug).slice(0, 3) || [];
      }

      // Load data for comparison states from static data
      const statesWithData = await Promise.all(
        statesToCompare.map(async (state) => {
          try {
            // Import the state data directly
            const data = await import(`@/data/states/${state.slug}.json`);
            const yearData = data.years['2024'];
            
            // Calculate metrics
            const metrics = {
              medianAge: yearData?.medianAge || 0,
              elderlyPercentage: yearData?.ageGroups
                .filter((ag: any) => {
                  const ageStart = parseInt(ag.ageRange.split('-')[0]) || 100;
                  return ageStart >= 65;
                })
                .reduce((sum: number, ag: any) => sum + ag.total, 0) / yearData?.totalPopulation * 100 || 0,
              youthPercentage: yearData?.ageGroups
                .filter((ag: any) => {
                  const ageStart = parseInt(ag.ageRange.split('-')[0]) || 0;
                  return ageStart < 15;
                })
                .reduce((sum: number, ag: any) => sum + ag.total, 0) / yearData?.totalPopulation * 100 || 0,
              growthRate: data.years['2000'] && yearData ? 
                ((yearData.totalPopulation - data.years['2000'].totalPopulation) / data.years['2000'].totalPopulation * 100) : 0
            };
            
            return {
              ...state,
              data: yearData,
              metrics
            };
          } catch (error) {
            return state;
          }
        })
      );
      
      setComparisonStates(statesWithData);
      setLoading(false);
    }
    
    loadComparisonData();
  }, [currentState]);

  if (loading) {
    return <div className="text-gray-500">Loading comparison data...</div>;
  }

  return (
    <section className="mb-12">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          How Does {currentState.stateName} Compare to Other States?
        </h2>
        
        {/* Mini Pyramids Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Current State */}
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
            <MiniStatePyramid
              data={currentYearData}
              stateName={currentState.stateName}
              height={180}
            />
            <div className="text-center mt-2">
              <p className="text-xs font-semibold text-blue-700">Current State</p>
              <p className="text-xs text-gray-600">Pop: {currentYearData.totalPopulation.toLocaleString()}</p>
            </div>
          </div>
          
          {/* Comparison States */}
          {comparisonStates.map(state => (
            <Link
              key={state.slug}
              href={`/states/${state.slug}`}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition border border-gray-200"
            >
              <MiniStatePyramid
                data={state.data}
                stateName={state.name}
                height={180}
              />
              <div className="text-center mt-2">
                <p className="text-xs font-semibold text-gray-700">{state.name}</p>
                <p className="text-xs text-gray-600">Pop: {state.data?.totalPopulation.toLocaleString() || 'N/A'}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">State</th>
                <th className="px-4 py-2 text-right font-semibold">Population</th>
                <th className="px-4 py-2 text-right font-semibold">Median Age</th>
                <th className="px-4 py-2 text-right font-semibold">Youth (0-14)</th>
                <th className="px-4 py-2 text-right font-semibold">Elderly (65+)</th>
                <th className="px-4 py-2 text-right font-semibold">Growth 2000-24</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Current State Row */}
              <tr className="bg-blue-50 font-semibold">
                <td className="px-4 py-2 text-blue-700">{currentState.stateName}</td>
                <td className="px-4 py-2 text-right">{currentYearData.totalPopulation.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{currentMetrics.medianAge?.toFixed(1) || 'N/A'}</td>
                <td className="px-4 py-2 text-right">{currentMetrics.youthPercentage.toFixed(1)}%</td>
                <td className="px-4 py-2 text-right">{currentMetrics.elderlyPercentage.toFixed(1)}%</td>
                <td className="px-4 py-2 text-right">
                  {(() => {
                    const growth = currentState.years['2000'] ? 
                      ((currentYearData.totalPopulation - currentState.years['2000'].totalPopulation) / currentState.years['2000'].totalPopulation * 100) : null;
                    if (growth === null) return 'N/A';
                    return (
                      <span className={growth > 0 ? 'text-green-600' : 'text-red-600'}>
                        {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                      </span>
                    );
                  })()}
                </td>
              </tr>
              
              {/* Comparison States Rows */}
              {comparisonStates.map(state => (
                <tr key={state.slug} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <Link href={`/states/${state.slug}`} className="text-blue-600 hover:text-blue-800 underline">
                      {state.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-right">{state.data?.totalPopulation.toLocaleString() || 'N/A'}</td>
                  <td className="px-4 py-2 text-right">{state.metrics?.medianAge?.toFixed(1) || 'N/A'}</td>
                  <td className="px-4 py-2 text-right">{state.metrics?.youthPercentage?.toFixed(1) || 'N/A'}%</td>
                  <td className="px-4 py-2 text-right">{state.metrics?.elderlyPercentage?.toFixed(1) || 'N/A'}%</td>
                  <td className="px-4 py-2 text-right">
                    {state.metrics?.growthRate !== undefined ? (
                      <span className={state.metrics.growthRate > 0 ? 'text-green-600' : 'text-red-600'}>
                        {state.metrics.growthRate > 0 ? '+' : ''}{state.metrics.growthRate.toFixed(1)}%
                      </span>
                    ) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Insights */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <h3 className="font-semibold text-gray-800 mb-2">Key Insights</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• {currentState.stateName} has a {currentMetrics.medianAge > 38.5 ? 'higher' : 'lower'} median age than the US average of 38.5 years</li>
            <li>• The state's elderly population of {currentMetrics.elderlyPercentage.toFixed(1)}% {
              currentMetrics.elderlyPercentage > 17 ? 'exceeds' : 'is below'
            } the national average</li>
            <li>• Population growth since 2000 {
              (() => {
                const growth = currentState.years['2000'] ? 
                  ((currentYearData.totalPopulation - currentState.years['2000'].totalPopulation) / currentState.years['2000'].totalPopulation * 100) : 0;
                if (growth > 20) return 'has been rapid';
                if (growth > 10) return 'has been steady';
                if (growth > 0) return 'has been modest';
                return 'has been negative';
              })()
            }</li>
          </ul>
        </div>

        {/* Links to More States */}
        <div className="mt-4 text-center">
          <Link href="/states" className="text-blue-600 hover:text-blue-800 underline text-sm">
            View all 50 US states + DC →
          </Link>
        </div>
      </div>
    </section>
  );
}