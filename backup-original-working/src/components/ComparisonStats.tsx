'use client';

import { calculateMetrics } from '@/lib/calculations';

interface CountryData {
  countryCode: string;
  countryName: string;
  slug: string;
  region: string;
  years: Record<string, any>;
}

interface ComparisonStatsProps {
  countryData1: CountryData;
  countryData2: CountryData;
  year: number;
}

export default function ComparisonStats({
  countryData1,
  countryData2,
  year
}: ComparisonStatsProps) {
  const yearData1 = countryData1.years[year.toString()];
  const yearData2 = countryData2.years[year.toString()];

  if (!yearData1 || !yearData2) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          Data not available for {year}
        </div>
      </div>
    );
  }

  const metrics1 = calculateMetrics(yearData1);
  const metrics2 = calculateMetrics(yearData2);

  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const StatCard = ({ 
    title, 
    value1, 
    value2, 
    country1, 
    country2, 
    formatter = (x: any) => x 
  }: {
    title: string;
    value1: any;
    value2: any;
    country1: string;
    country2: string;
    formatter?: (x: any) => string;
  }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{country1}</span>
          <span className="font-semibold text-blue-600">{formatter(value1)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{country2}</span>
          <span className="font-semibold text-green-600">{formatter(value2)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Demographic Comparison ({year})
      </h3>

      {/* Basic Demographics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Population"
          value1={yearData1.totalPopulation}
          value2={yearData2.totalPopulation}
          country1={countryData1.countryName}
          country2={countryData2.countryName}
          formatter={formatNumber}
        />
        
        <StatCard
          title="Median Age"
          value1={yearData1.medianAge}
          value2={yearData2.medianAge}
          country1={countryData1.countryName}
          country2={countryData2.countryName}
          formatter={(x) => `${x} years`}
        />
        
        <StatCard
          title="Male Population"
          value1={yearData1.malePopulation}
          value2={yearData2.malePopulation}
          country1={countryData1.countryName}
          country2={countryData2.countryName}
          formatter={formatNumber}
        />
        
        <StatCard
          title="Female Population"
          value1={yearData1.femalePopulation}
          value2={yearData2.femalePopulation}
          country1={countryData1.countryName}
          country2={countryData2.countryName}
          formatter={formatNumber}
        />
      </div>

      {/* Age Group Distributions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Youth (0-14 years)"
          value1={metrics1.youthPercentage}
          value2={metrics2.youthPercentage}
          country1={countryData1.countryName}
          country2={countryData2.countryName}
          formatter={formatPercentage}
        />
        
        <StatCard
          title="Working Age (15-64 years)"
          value1={metrics1.workingAgePercentage}
          value2={metrics2.workingAgePercentage}
          country1={countryData1.countryName}
          country2={countryData2.countryName}
          formatter={formatPercentage}
        />
        
        <StatCard
          title="Elderly (65+ years)"
          value1={metrics1.elderlyPercentage}
          value2={metrics2.elderlyPercentage}
          country1={countryData1.countryName}
          country2={countryData2.countryName}
          formatter={formatPercentage}
        />
      </div>

      {/* Dependency Ratios */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <StatCard
          title="Dependency Ratio"
          value1={metrics1.dependencyRatio}
          value2={metrics2.dependencyRatio}
          country1={countryData1.countryName}
          country2={countryData2.countryName}
          formatter={(x) => x.toFixed(1)}
        />
        
        <StatCard
          title="Sex Ratio (M per 100F)"
          value1={metrics1.sexRatio}
          value2={metrics2.sexRatio}
          country1={countryData1.countryName}
          country2={countryData2.countryName}
          formatter={(x) => x.toFixed(1)}
        />
      </div>

      {/* Key Insights */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Key Differences</h4>
        <div className="text-sm text-blue-800 space-y-1">
          {yearData1.totalPopulation > yearData2.totalPopulation ? (
            <p>• {countryData1.countryName} has {((yearData1.totalPopulation / yearData2.totalPopulation - 1) * 100).toFixed(1)}% larger population</p>
          ) : (
            <p>• {countryData2.countryName} has {((yearData2.totalPopulation / yearData1.totalPopulation - 1) * 100).toFixed(1)}% larger population</p>
          )}
          
          {yearData1.medianAge > yearData2.medianAge ? (
            <p>• {countryData1.countryName} has an older population (median age {yearData1.medianAge - yearData2.medianAge} years higher)</p>
          ) : yearData2.medianAge > yearData1.medianAge ? (
            <p>• {countryData2.countryName} has an older population (median age {yearData2.medianAge - yearData1.medianAge} years higher)</p>
          ) : (
            <p>• Both countries have similar median ages</p>
          )}
          
          {Math.abs(metrics1.dependencyRatio - metrics2.dependencyRatio) > 5 && (
            <p>• {metrics1.dependencyRatio > metrics2.dependencyRatio ? countryData1.countryName : countryData2.countryName} has higher dependency ratio, indicating more dependents per working-age person</p>
          )}
        </div>
      </div>
    </div>
  );
}