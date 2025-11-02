'use client';

import type { YearData } from '@/types/population';

interface PopulationPyramidProps {
  data: YearData;
  countryName: string;
  year: number;
  showLegend?: boolean;
  height?: number;
  className?: string;
}

export default function PopulationPyramidSimple({
  data,
  countryName,
  year,
  showLegend = true,
  height = 600,
  className = ''
}: PopulationPyramidProps) {
  if (!data.ageGroups || data.ageGroups.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="text-center text-gray-500">
          Population pyramid data not available
        </div>
      </div>
    );
  }

  const maxPop = Math.max(...data.ageGroups.map(ag => Math.max(ag.male, ag.female)));
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-center">
          {countryName} Population Pyramid ({year})
        </h3>
      </div>
      
      <div className="space-y-1" style={{ height: `${height}px`, overflow: 'auto' }}>
        {data.ageGroups.slice().reverse().map((ageGroup, index) => {
          const malePercent = (ageGroup.male / maxPop) * 50;
          const femalePercent = (ageGroup.female / maxPop) * 50;
          
          return (
            <div key={index} className="flex items-center h-8">
              {/* Male side (left) */}
              <div className="w-1/2 flex justify-end pr-2">
                <div 
                  className="bg-blue-500 h-6 flex items-center justify-end pr-1 text-white text-xs"
                  style={{ width: `${malePercent}%` }}
                  title={`Male ${ageGroup.ageRange}: ${ageGroup.male.toLocaleString()}`}
                >
                  {malePercent > 15 ? ageGroup.male.toLocaleString() : ''}
                </div>
              </div>
              
              {/* Age label (center) */}
              <div className="w-16 text-center text-xs font-medium text-gray-700">
                {ageGroup.ageRange}
              </div>
              
              {/* Female side (right) */}
              <div className="w-1/2 flex justify-start pl-2">
                <div 
                  className="bg-pink-500 h-6 flex items-center justify-start pl-1 text-white text-xs"
                  style={{ width: `${femalePercent}%` }}
                  title={`Female ${ageGroup.ageRange}: ${ageGroup.female.toLocaleString()}`}
                >
                  {femalePercent > 15 ? ageGroup.female.toLocaleString() : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {showLegend && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Male: {data.malePopulation.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-500 rounded"></div>
            <span>Female: {data.femalePopulation.toLocaleString()}</span>
          </div>
          <div className="font-semibold">
            Total: {data.totalPopulation.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}