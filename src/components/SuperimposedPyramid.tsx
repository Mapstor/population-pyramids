'use client';

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import type { YearData } from '@/types/population';

interface SuperimposedPyramidProps {
  country1Data: YearData;
  country2Data: YearData;
  country1Name: string;
  country2Name: string;
  year: number;
}

export default function SuperimposedPyramid({
  country1Data,
  country2Data,
  country1Name,
  country2Name,
  year
}: SuperimposedPyramidProps) {
  // Always show overlay view - removed toggle

  // Create superimposed data
  const createSuperimposedData = () => {
    const labels = country1Data.ageGroups.map(ag => ag.ageRange).reverse();
    
    // Always show difference view
    if (true) {
      // Show only the difference
      return {
        labels,
        datasets: [
          {
            label: `${country1Name} > ${country2Name} (Male)`,
            data: country1Data.ageGroups.map((ag, i) => {
              const diff = ag.male - country2Data.ageGroups[i].male;
              return diff > 0 ? -diff : 0;
            }).reverse(),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderWidth: 0,
            barPercentage: 1.0,
          },
          {
            label: `${country2Name} > ${country1Name} (Male)`,
            data: country1Data.ageGroups.map((ag, i) => {
              const diff = country2Data.ageGroups[i].male - ag.male;
              return diff > 0 ? -diff : 0;
            }).reverse(),
            backgroundColor: 'rgba(34, 197, 94, 0.6)',
            borderWidth: 0,
            barPercentage: 1.0,
          },
          {
            label: `${country1Name} > ${country2Name} (Female)`,
            data: country1Data.ageGroups.map((ag, i) => {
              const diff = ag.female - country2Data.ageGroups[i].female;
              return diff > 0 ? diff : 0;
            }).reverse(),
            backgroundColor: 'rgba(236, 72, 153, 0.6)',
            borderWidth: 0,
            barPercentage: 1.0,
          },
          {
            label: `${country2Name} > ${country1Name} (Female)`,
            data: country1Data.ageGroups.map((ag, i) => {
              const diff = country2Data.ageGroups[i].female - ag.female;
              return diff > 0 ? diff : 0;
            }).reverse(),
            backgroundColor: 'rgba(251, 146, 60, 0.6)',
            borderWidth: 0,
            barPercentage: 1.0,
          }
        ]
      };
    } else {
      // Difference pyramid - show how much more one country has than the other
      return {
        labels,
        datasets: [
          {
            label: `${country1Name} has more (Male)`,
            data: country1Data.ageGroups.map((ag, i) => {
              const diff = ag.male - country2Data.ageGroups[i].male;
              return diff > 0 ? -diff : 0; // Show positive difference on left (negative values)
            }).reverse(),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 0,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
          },
          {
            label: `${country2Name} has more (Male)`,
            data: country1Data.ageGroups.map((ag, i) => {
              const diff = country2Data.ageGroups[i].male - ag.male;
              return diff > 0 ? -diff : 0; // Show positive difference on left (negative values)
            }).reverse(),
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 0,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
          },
          {
            label: `${country1Name} has more (Female)`,
            data: country1Data.ageGroups.map((ag, i) => {
              const diff = ag.female - country2Data.ageGroups[i].female;
              return diff > 0 ? diff : 0; // Show positive difference on right (positive values)
            }).reverse(),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 0,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
          },
          {
            label: `${country2Name} has more (Female)`,
            data: country1Data.ageGroups.map((ag, i) => {
              const diff = country2Data.ageGroups[i].female - ag.female;
              return diff > 0 ? diff : 0; // Show positive difference on right (positive values)
            }).reverse(),
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 0,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
          }
        ]
      };
    }
  };

  const maxValue = Math.max(
    ...country1Data.ageGroups.map(ag => Math.max(ag.male, ag.female)),
    ...country2Data.ageGroups.map(ag => Math.max(ag.male, ag.female))
  ) * 1.1;

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        display: false, // Hide legend for cleaner difference view
        labels: {
          font: {
            size: 12
          },
          usePointStyle: true,
          padding: 15,
          filter: function(legendItem: any) {
            // Only show items with labels (not empty labels)
            return legendItem.text && legendItem.text.length > 0;
          },
          generateLabels: function(chart: any) {
            // Custom labels to show only country names (filter out male/female)
            const originalLabels = chart.data.datasets;
            const uniqueCountries = new Set();
            const customLabels = [];
            
            originalLabels.forEach((dataset: any, index: number) => {
              if (dataset.label.includes(country1Name) && !uniqueCountries.has(country1Name)) {
                customLabels.push({
                  text: country1Name,
                  fillStyle: 'rgba(59, 130, 246, 0.4)',
                  strokeStyle: 'rgba(59, 130, 246, 1)',
                  lineWidth: 2,
                  datasetIndex: index
                });
                uniqueCountries.add(country1Name);
              } else if (dataset.label.includes(country2Name) && !uniqueCountries.has(country2Name)) {
                customLabels.push({
                  text: country2Name,
                  fillStyle: 'rgba(34, 197, 94, 0.3)',
                  strokeStyle: 'rgba(34, 197, 94, 1)',
                  lineWidth: 2,
                  datasetIndex: index
                });
                uniqueCountries.add(country2Name);
              }
            });
            
            return customLabels;
          }
        }
      },
      title: {
        display: true,
        text: `${country1Name} vs ${country2Name} Population Difference Pyramid`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = Math.abs(context.raw);
            return `${context.dataset.label}: ${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: function(value: any) {
            return Math.abs(value).toLocaleString();
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        max: maxValue,
        min: -maxValue
      },
      y: {
        stacked: true,
        grid: {
          display: false
        }
      }
    }
  };

  // Calculate areas where one significantly exceeds the other
  const significantDifferences = country1Data.ageGroups.map((ag, i) => {
    const ag2 = country2Data.ageGroups[i];
    const maleDiff = ((ag.male - ag2.male) / ag2.male) * 100;
    const femaleDiff = ((ag.female - ag2.female) / ag2.female) * 100;
    const totalDiff = ((ag.total - ag2.total) / ag2.total) * 100;
    const largerCountry = ag.total > ag2.total ? country1Name : country2Name;
    const maleAbsDiff = Math.abs(ag.male - ag2.male);
    const femaleAbsDiff = Math.abs(ag.female - ag2.female);
    
    return {
      ageRange: ag.ageRange,
      maleDiff,
      femaleDiff,
      totalDiff,
      largerCountry,
      ag1: ag,
      ag2: ag2,
      maleAbsDiff,
      femaleAbsDiff
    };
  }).filter(d => Math.abs(d.totalDiff) > 20); // More than 20% difference

  return (
    <div className="space-y-6">

      {/* Chart */}
      <div className="h-[500px] bg-white p-4 rounded-lg">
        <Bar data={createSuperimposedData()} options={options} />
      </div>

      {/* Legend explanation */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-semibold mb-3 text-lg">📊 Understanding the Population Difference Chart</h4>
        <div>
          <p className="text-sm text-gray-700 mb-4">
            This visualization shows <strong>where and by how much</strong> the populations differ between {country1Name} and {country2Name} for each age group, split by gender:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-semibold text-gray-700 text-sm mb-2">Left Side (Males)</p>
              <div className="space-y-2">
                <div className="bg-white p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.8)' }}></div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-blue-800">Blue = {country1Name} has more males</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.8)' }}></div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-green-800">Green = {country2Name} has more males</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <p className="font-semibold text-gray-700 text-sm mb-2">Right Side (Females)</p>
              <div className="space-y-2">
                <div className="bg-white p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgba(236, 72, 153, 0.8)' }}></div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-pink-800">Pink = {country1Name} has more females</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgba(251, 146, 60, 0.8)' }}></div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-orange-800">Orange = {country2Name} has more females</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
            <p className="text-xs text-gray-700">
              <strong>💡 How to Read:</strong> Each age group shows up to 2 bars - one on the left (male difference) and one on the right (female difference). 
              The bar's color tells you which country has more people, and the bar's length shows by how much. 
              For example, if you see a green bar on the left, it means {country2Name} has more males in that age group.
            </p>
          </div>
        </div>
      </div>

      {/* Significant differences */}
      {significantDifferences.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3">Notable Differences (>20% variance):</h4>
          <div className="text-sm space-y-2">
            {significantDifferences.map(d => {
              const formatNumber = (num: number) => {
                if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
                if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
                return num.toLocaleString();
              };
              
              return (
                <div key={d.ageRange} className="border-l-2 border-yellow-500 pl-3">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="font-medium text-yellow-800">
                        Ages {d.ageRange}: {d.largerCountry} has {Math.abs(d.totalDiff).toFixed(1)}% more people
                      </div>
                      <div className="text-gray-600 mt-1 text-xs">
                        Men: {formatNumber(d.maleAbsDiff)} more in {d.ag1.male > d.ag2.male ? country1Name : country2Name} 
                        {' • '}
                        Women: {formatNumber(d.femaleAbsDiff)} more in {d.ag1.female > d.ag2.female ? country1Name : country2Name}
                      </div>
                      <div className="text-gray-500 mt-1 text-xs">
                        {country1Name}: {formatNumber(d.ag1.male)} men, {formatNumber(d.ag1.female)} women
                        {' • '}
                        {country2Name}: {formatNumber(d.ag2.male)} men, {formatNumber(d.ag2.female)} women
                      </div>
                    </div>
                    
                    {/* Visual comparison bars */}
                    <div className="flex-shrink-0 w-24">
                      <div className="text-xs text-gray-500 mb-1">Population Ratio</div>
                      
                      {/* Country 1 bar */}
                      <div className="flex items-center mb-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-1">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, (d.ag1.total / Math.max(d.ag1.total, d.ag2.total)) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 w-8">{formatNumber(d.ag1.total)}</span>
                      </div>
                      
                      {/* Country 2 bar */}
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-1">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, (d.ag2.total / Math.max(d.ag1.total, d.ag2.total)) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 w-8">{formatNumber(d.ag2.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}