'use client';

import { useState } from 'react';

interface YearSelectorProps {
  currentYear?: number;
  selectedYear: number;
  availableYears: number[];
  onYearChange: (year: number) => void;
  minYear: number;
  maxYear: number;
  countryName: string;
  className?: string;
}

export default function YearSelector({
  selectedYear,
  availableYears,
  onYearChange,
  minYear,
  maxYear,
  countryName,
  className = ''
}: YearSelectorProps) {
  const [year, setYear] = useState(selectedYear);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value);
    setYear(newYear);
    onYearChange(newYear);
  };

  const handlePrevious = () => {
    if (year > minYear) {
      const newYear = year - 1;
      setYear(newYear);
      onYearChange(newYear);
    }
  };

  const handleNext = () => {
    if (year < maxYear) {
      const newYear = year + 1;
      setYear(newYear);
      onYearChange(newYear);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Year</h3>
      
      <div className="text-center mb-4">
        <span className="text-4xl font-bold text-blue-600">{year}</span>
      </div>

      <div className="mb-4">
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={year}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>{minYear}</span>
          <span>{maxYear}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handlePrevious}
          disabled={year <= minYear}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Previous Year
        </button>
        <button
          onClick={handleNext}
          disabled={year >= maxYear}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next Year →
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[2025, 2020, 2010, 2000, 1990, 1980, 1950].map(quickYear => (
          availableYears.includes(quickYear) && (
            <button
              key={quickYear}
              onClick={() => {
                setYear(quickYear);
                onYearChange(quickYear);
              }}
              className={`px-3 py-1 rounded text-sm transition ${
                year === quickYear
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {quickYear}
            </button>
          )
        ))}
      </div>
    </div>
  );
}