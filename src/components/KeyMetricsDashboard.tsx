'use client';

import { useState, useEffect } from 'react';
import type { YearData } from '@/types/population';
import populationRankings from '@/data/population-rankings-2025.json';

interface KeyMetricsDashboardProps {
  country1Data: YearData;
  country2Data: YearData;
  country1Name: string;
  country2Name: string;
  country1Slug?: string;
  country2Slug?: string;
  fertility1: number;
  fertility2: number;
  year: number;
}

export default function KeyMetricsDashboard({
  country1Data,
  country2Data,
  country1Name,
  country2Name,
  country1Slug,
  country2Slug,
  fertility1,
  fertility2,
  year
}: KeyMetricsDashboardProps) {
  const [animatedPop1, setAnimatedPop1] = useState(0);
  const [animatedPop2, setAnimatedPop2] = useState(0);
  
  // Get rankings
  const country1Rank = country1Slug ? populationRankings[country1Slug as keyof typeof populationRankings] : null;
  const country2Rank = country2Slug ? populationRankings[country2Slug as keyof typeof populationRankings] : null;

  useEffect(() => {
    // Animate population counters
    const duration = 1000;
    const steps = 30;
    const increment1 = country1Data.totalPopulation / steps;
    const increment2 = country2Data.totalPopulation / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setAnimatedPop1(Math.floor(increment1 * currentStep));
      setAnimatedPop2(Math.floor(increment2 * currentStep));
      
      if (currentStep >= steps) {
        setAnimatedPop1(country1Data.totalPopulation);
        setAnimatedPop2(country2Data.totalPopulation);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [country1Data.totalPopulation, country2Data.totalPopulation]);

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    return num.toLocaleString();
  };

  const populationDiff = country2Data.totalPopulation - country1Data.totalPopulation;
  const isIndiaLarger = populationDiff > 0;
  
  // Calculate density (using approximate land areas)
  const chinaArea = 9596960; // km²
  const indiaArea = 3287263; // km²
  const chinaDensity = Math.round(country1Data.totalPopulation / chinaArea);
  const indiaDensity = Math.round(country2Data.totalPopulation / indiaArea);

  // Calculate working age percentage
  const workingAge1 = country1Data.ageGroups.slice(3, 13).reduce((sum, ag) => sum + ag.total, 0);
  const workingAge2 = country2Data.ageGroups.slice(3, 13).reduce((sum, ag) => sum + ag.total, 0);
  const workingAge1Pct = ((workingAge1 / country1Data.totalPopulation) * 100).toFixed(1);
  const workingAge2Pct = ((workingAge2 / country2Data.totalPopulation) * 100).toFixed(1);

  // Determine growth status based on country
  const getGrowthStatus = (countryName: string, countrySlug?: string) => {
    const growing = ['United States', 'India', 'United Kingdom', 'Canada', 'Australia', 'Brazil', 'Indonesia', 'Mexico'];
    const declining = ['China', 'Russia', 'Japan', 'Germany', 'South Korea'];
    
    if (countrySlug) {
      if (['united-states', 'india', 'united-kingdom', 'canada', 'australia', 'brazil', 'indonesia', 'mexico'].includes(countrySlug)) {
        return { status: 'Growing', color: 'bg-green-500', text: 'Growing Population' };
      }
      if (['china', 'russia', 'japan', 'germany', 'south-korea'].includes(countrySlug)) {
        return { status: 'Declining', color: 'bg-red-500', text: 'Declining Population' };
      }
    }
    
    // Fallback to name-based detection
    if (growing.some(name => countryName.includes(name))) {
      return { status: 'Growing', color: 'bg-green-500', text: 'Growing Population' };
    }
    if (declining.some(name => countryName.includes(name))) {
      return { status: 'Declining', color: 'bg-red-500', text: 'Declining Population' };
    }
    
    // Default to stable if unknown
    return { status: 'Stable', color: 'bg-yellow-500', text: 'Stable Population' };
  };

  const country1Growth = getGrowthStatus(country1Name, country1Slug);
  const country2Growth = getGrowthStatus(country2Name, country2Slug);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-pink-50 rounded-xl shadow-lg p-6 mb-8">
      {/* Main Population Counters */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">{country1Name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {year}
              </span>
              {country1Rank && (
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  World #{country1Rank}
                </span>
              )}
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {formatNumber(animatedPop1)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Total Population
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">{country2Name}</h3>
            <div className="flex items-center gap-2">
              {country2Rank && (
                <span className={`text-xs px-2 py-1 rounded ${
                  country2Rank === 1 ? 'bg-green-100 text-green-800' : 
                  country2Rank <= 3 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  World #{country2Rank}
                </span>
              )}
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600">
            {formatNumber(animatedPop2)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Total Population
          </div>
        </div>
      </div>

      {/* Population Gap Banner */}
      <div className={`text-center p-3 rounded-lg mb-6 ${
        isIndiaLarger ? 'bg-green-100' : 'bg-blue-100'
      }`}>
        <div className="text-lg font-semibold">
          {country2Name} leads by {' '}
          <span className="text-2xl font-bold">
            {formatNumber(Math.abs(populationDiff))}
          </span>
          {' '} people
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Gap is {((Math.abs(populationDiff) / country1Data.totalPopulation) * 100).toFixed(2)}% of {country1Name}'s population
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Fertility Rate */}
        <div className="bg-white rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Fertility Rate</div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-blue-600">{fertility1.toFixed(2)}</span>
            <span className="text-xs text-gray-400">vs</span>
            <span className="text-lg font-bold text-green-600">{fertility2.toFixed(2)}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {fertility2 > fertility1 ? `${country2Name} +${(fertility2 - fertility1).toFixed(2)}` : `${country1Name} +${(fertility1 - fertility2).toFixed(2)}`}
          </div>
        </div>

        {/* Median Age */}
        <div className="bg-white rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Median Age</div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-blue-600">{country1Data.medianAge.toFixed(1)}</span>
            <span className="text-xs text-gray-400">vs</span>
            <span className="text-lg font-bold text-green-600">{country2Data.medianAge.toFixed(1)}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {country2Data.medianAge < country1Data.medianAge ? `${country2Name} younger` : `${country1Name} younger`}
          </div>
        </div>

        {/* Population Density */}
        <div className="bg-white rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Density /km²</div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-blue-600">{chinaDensity}</span>
            <span className="text-xs text-gray-400">vs</span>
            <span className="text-lg font-bold text-green-600">{indiaDensity}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {country2Name} {(indiaDensity / chinaDensity).toFixed(1)}x denser
          </div>
        </div>

        {/* Working Age */}
        <div className="bg-white rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Working Age %</div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-blue-600">{workingAge1Pct}%</span>
            <span className="text-xs text-gray-400">vs</span>
            <span className="text-lg font-bold text-green-600">{workingAge2Pct}%</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Ages 15-64
          </div>
        </div>
      </div>

      {/* Growth Indicators */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 ${country1Growth.color} rounded-full ${country1Growth.status === 'Growing' ? 'animate-pulse' : ''}`}></div>
            <span className="text-gray-600">{country1Name}: {country1Growth.text}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 ${country2Growth.color} rounded-full ${country2Growth.status === 'Growing' ? 'animate-pulse' : ''}`}></div>
            <span className="text-gray-600">{country2Name}: {country2Growth.text}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">Replacement Level: 2.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}