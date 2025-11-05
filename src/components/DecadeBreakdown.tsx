'use client';

import { useState } from 'react';
import type { CountryPopulationData } from '@/types/population';
import { generateDecadeAnalysis } from '@/lib/decade-analyzer';

interface DecadeBreakdownProps {
  countryName: string;
  countrySlug: string;
  countryData: CountryPopulationData;
}

export default function DecadeBreakdown({ countryName, countrySlug, countryData }: DecadeBreakdownProps) {
  const [expandedDecade, setExpandedDecade] = useState<string | null>('1970s');
  
  const decadeAnalysis = generateDecadeAnalysis(countryName, countrySlug, countryData);
  
  const decades = [
    { key: '1970s', title: '1970s: Foundation Years', icon: '🌱', period: '1970-1980' },
    { key: '1980s', title: '1980s: Transformation Period', icon: '⚡', period: '1980-1990' },
    { key: '1990s', title: '1990s: Development Decade', icon: '🏗️', period: '1990-2000' },
    { key: '2000s', title: '2000s: Millennium Growth', icon: '🚀', period: '2000-2010' },
    { key: '2010s', title: '2010s: Modern Evolution', icon: '💻', period: '2010-2020' },
    { key: '2020s', title: '2020s: Contemporary Trends', icon: '🌐', period: '2020-2024' }
  ];

  const getPopulationData = (decade: string) => {
    const startYear = decade === '2020s' ? '2020' : `${decade.slice(0, 3)}0`;
    const endYear = decade === '2020s' ? '2024' : `${decade.slice(0, 3)}0`.replace('0', '10').slice(0, 4);
    
    const startData = countryData.years[startYear];
    const endData = countryData.years[endYear] || countryData.years['2024'];
    
    if (!startData || !endData) return null;
    
    const populationChange = ((endData.totalPopulation - startData.totalPopulation) / startData.totalPopulation) * 100;
    const medianAgeChange = endData.medianAge - startData.medianAge;
    
    return {
      startPop: (startData.totalPopulation / 1000000).toFixed(1),
      endPop: (endData.totalPopulation / 1000000).toFixed(1),
      populationChange: populationChange.toFixed(1),
      medianAgeChange: medianAgeChange.toFixed(1),
      startMedian: startData.medianAge.toFixed(1),
      endMedian: endData.medianAge.toFixed(1)
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        {countryName}'s Demographic Evolution by Decade
      </h2>
      <p className="text-gray-600 mb-8">
        Explore how {countryName}'s population structure and demographics have transformed over the past five decades, 
        shaped by historical events, policy changes, and socioeconomic developments.
      </p>

      <div className="space-y-4">
        {decades.map((decade) => {
          const isExpanded = expandedDecade === decade.key;
          const popData = getPopulationData(decade.key);
          const hasAnalysis = decadeAnalysis[decade.key];

          return (
            <div
              key={decade.key}
              className={`border rounded-lg transition-all duration-300 ${
                isExpanded ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Decade Header */}
              <button
                onClick={() => setExpandedDecade(isExpanded ? null : decade.key)}
                className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-shrink">
                    <span className="text-2xl sm:text-3xl flex-shrink-0">{decade.icon}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                        {decade.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm">{decade.period}</p>
                    </div>
                  </div>
                  
                  {popData && (
                    <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm flex-shrink-0">
                      <div className="text-center min-w-0">
                        <div className="text-gray-500 text-xs leading-tight">Pop Growth</div>
                        <div className={`font-semibold text-xs sm:text-sm ${
                          parseFloat(popData.populationChange) > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {parseFloat(popData.populationChange) > 0 ? '+' : ''}{popData.populationChange}%
                        </div>
                      </div>
                      <div className="text-center min-w-0 hidden sm:block">
                        <div className="text-gray-500 text-xs leading-tight">Age Change</div>
                        <div className={`font-semibold text-xs sm:text-sm ${
                          parseFloat(popData.medianAgeChange) > 0 ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                          {parseFloat(popData.medianAgeChange) > 0 ? '+' : ''}{popData.medianAgeChange}y
                        </div>
                      </div>
                      <div className="text-gray-400 flex-shrink-0">
                        {isExpanded ? '▼' : '▶'}
                      </div>
                    </div>
                  )}
                  
                  {!popData && (
                    <div className="text-gray-400">
                      {isExpanded ? '▼' : '▶'}
                    </div>
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && hasAnalysis && (
                <div className="px-6 pb-6">
                  <div className="border-t border-blue-200 pt-6">
                    {/* Quick Stats */}
                    {popData && (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 p-3 sm:p-4 bg-white rounded-lg border border-blue-200">
                        <div className="text-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{popData.startPop}M</div>
                          <div className="text-xs sm:text-sm text-gray-600">Start Population</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{popData.endPop}M</div>
                          <div className="text-xs sm:text-sm text-gray-600">End Population</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{popData.startMedian}</div>
                          <div className="text-xs sm:text-sm text-gray-600">Start Median Age</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{popData.endMedian}</div>
                          <div className="text-xs sm:text-sm text-gray-600">End Median Age</div>
                        </div>
                      </div>
                    )}

                    {/* Detailed Analysis */}
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      {decadeAnalysis[decade.key].split('. ').map((sentence, index) => (
                        sentence.trim() && (
                          <p key={index} className="mb-4">
                            {sentence.trim()}{sentence.includes('.') ? '' : '.'}
                          </p>
                        )
                      ))}
                    </div>

                    {/* Key Highlights */}
                    {popData && (
                      <div className="mt-6 p-3 sm:p-4 bg-blue-100 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Key Demographic Highlights</h4>
                        <ul className="text-blue-800 text-xs sm:text-sm space-y-1 leading-relaxed">
                          <li>• Population changed from {popData.startPop} million to {popData.endPop} million</li>
                          <li>• {parseFloat(popData.populationChange) > 0 ? 'Growth' : 'Decline'} rate of {Math.abs(parseFloat(popData.populationChange))}% over the decade</li>
                          <li>• Median age shifted from {popData.startMedian} to {popData.endMedian} years</li>
                          <li>• {parseFloat(popData.medianAgeChange) > 0 ? 'Aging' : 'Younger'} demographic trend of {Math.abs(parseFloat(popData.medianAgeChange))} years</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Five Decades of Transformation
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {countryName}'s demographic journey from the 1970s to today reflects broader patterns of global development, 
          modernization, and social change. Each decade brought unique challenges and opportunities that shaped the 
          country's population structure, age distribution, and demographic characteristics. Understanding these 
          historical patterns provides valuable context for interpreting current trends and anticipating future 
          demographic developments.
        </p>
      </div>
    </div>
  );
}