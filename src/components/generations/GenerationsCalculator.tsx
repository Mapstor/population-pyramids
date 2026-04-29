'use client';

import { useState } from 'react';
import { 
  getGenerationByBirthYear, 
  getAgeFromBirthYear,
  type GenerationPopulation, 
  type Generation 
} from '@/lib/generation-utils';

interface GenerationsCalculatorProps {
  worldGenerations: GenerationPopulation[];
}

export function GenerationsCalculator({ worldGenerations }: GenerationsCalculatorProps) {
  const [birthYear, setBirthYear] = useState<string>('');
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);

  // Create year options for dropdown
  const yearOptions = [];
  for (let year = 2026; year >= 1901; year--) {
    yearOptions.push(year);
  }

  const handleBirthYearChange = (year: string) => {
    setBirthYear(year);
    if (year) {
      const gen = getGenerationByBirthYear(parseInt(year));
      setSelectedGeneration(gen);
    } else {
      setSelectedGeneration(null);
    }
  };

  const currentAge = birthYear ? getAgeFromBirthYear(parseInt(birthYear)) : null;

  // Get generation data for selected generation (always use world data)
  const selectedGenData = selectedGeneration 
    ? worldGenerations.find(g => g.generation.id === selectedGeneration.id)
    : null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">What Generation Am I?</h2>
      
      <div className="mb-4">
        <div className="flex gap-4 items-center flex-wrap">
          <label htmlFor="birth-year" className="text-gray-700 font-medium">
            Birth Year:
          </label>
          <select
            id="birth-year"
            value={birthYear}
            onChange={(e) => handleBirthYearChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select your birth year"
          >
            <option value="">Select year</option>
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          {birthYear && (
            <span className="text-sm text-gray-600">
              You are {currentAge} years old in 2026
            </span>
          )}
        </div>
      </div>

      {/* Results */}
      {selectedGeneration && selectedGenData && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
          <div className="mb-3">
            <h3 className="text-2xl font-bold text-gray-900">
              You are {selectedGeneration.name === 'Baby Boomers' ? 'a Baby Boomer' : 
                       selectedGeneration.name === 'Silent Generation' ? 'part of the Silent Generation' :
                       selectedGeneration.name === 'Greatest Generation' ? 'part of the Greatest Generation' :
                       `a member of ${selectedGeneration.name}`}
            </h3>
            <p className="text-gray-700">
              Born {selectedGeneration.birthYearStart}-{selectedGeneration.birthYearEnd}
              {selectedGeneration.alternativeName && (
                <span className="text-sm text-gray-600"> (also known as {selectedGeneration.alternativeName})</span>
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-3 mb-3">
            <div className="bg-white rounded p-3">
              <div className="text-xs text-gray-600">Your age in 2026</div>
              <div className="text-xl font-bold text-gray-900">{currentAge} years old</div>
            </div>
            <div className="bg-white rounded p-3">
              <div className="text-xs text-gray-600">Generation's global population</div>
              <div className="text-xl font-bold text-gray-900">
                {(selectedGenData.population / 1000000000).toFixed(2)} billion
              </div>
            </div>
            <div className="bg-white rounded p-3">
              <div className="text-xs text-gray-600">% of world population</div>
              <div className="text-xl font-bold text-gray-900">
                {selectedGenData.percentOfTotal.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Generation description */}
          <div className="bg-white rounded p-3 mb-3">
            <p className="text-sm text-gray-700">
              {selectedGeneration.description}
            </p>
          </div>

          {/* Visual representation of all generations */}
          <div className="bg-white rounded p-3">
            <div className="text-xs text-gray-600 mb-2">Your generation in context:</div>
            <div className="flex items-stretch gap-0.5 h-10">
              {worldGenerations.map(gen => (
                <div
                  key={gen.generation.id}
                  className={`relative flex-1 rounded-sm transition-all flex items-center justify-center ${
                    gen.generation.id === selectedGeneration.id
                      ? 'ring-2 ring-offset-1 ring-blue-600'
                      : 'opacity-70'
                  }`}
                  style={{ 
                    backgroundColor: gen.generation.color,
                    flexGrow: gen.percentOfTotal
                  }}
                  title={`${gen.generation.name}: ${gen.percentOfTotal.toFixed(1)}%`}
                >
                  <span className="text-[8px] text-white font-semibold transform -rotate-45 whitespace-nowrap">
                    {gen.generation.name.replace('Generation', '').replace('Baby ', '')}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-600">
              <span>← Youngest (Gen Alpha)</span>
              <span>Oldest (Greatest Gen) →</span>
            </div>
          </div>
        </div>
      )}

      {/* Instructions when no year selected */}
      {!birthYear && (
        <div className="bg-gray-50 rounded-lg p-4 text-gray-600">
          <p className="text-sm">
            Select your birth year above to discover:
          </p>
          <ul className="mt-2 text-sm space-y-1">
            <li>• Which generation you belong to</li>
            <li>• Your generation's defining characteristics</li>
            <li>• How many people share your generation globally</li>
            <li>• Your generation's percentage of world population</li>
          </ul>
        </div>
      )}
    </div>
  );
}