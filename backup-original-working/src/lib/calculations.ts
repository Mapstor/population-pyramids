import type { YearData, DemographicMetrics } from '@/types/population';

export function calculateMetrics(yearData: YearData): DemographicMetrics {
  // Gender percentages
  const malePercent = (yearData.malePopulation / yearData.totalPopulation) * 100;
  const femalePercent = (yearData.femalePopulation / yearData.totalPopulation) * 100;
  
  // Sex ratio (males per 100 females)
  const sexRatio = (yearData.malePopulation / yearData.femalePopulation) * 100;
  
  // Use actual median age from the year data
  const medianAge = yearData.medianAge;
  
  // Age group populations using our current data structure
  const youthAgeRanges = ['0-4', '5-9', '10-14'];
  const elderlyAgeRanges = ['65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100+'];
  
  const youthPopulation = yearData.ageGroups
    .filter(ag => ag.ageRange && youthAgeRanges.includes(ag.ageRange))
    .reduce((sum, ag) => sum + (ag.total || ag.male + ag.female), 0);
  
  const elderlyPopulation = yearData.ageGroups
    .filter(ag => ag.ageRange && elderlyAgeRanges.includes(ag.ageRange))
    .reduce((sum, ag) => sum + (ag.total || ag.male + ag.female), 0);
    
  const workingAgePopulation = yearData.totalPopulation - youthPopulation - elderlyPopulation;
  
  // Age group percentages
  const youthPercentage = (youthPopulation / yearData.totalPopulation) * 100;
  const workingAgePercentage = (workingAgePopulation / yearData.totalPopulation) * 100;
  const elderlyPercentage = (elderlyPopulation / yearData.totalPopulation) * 100;
  
  // Dependency ratios
  const dependencyRatio = ((youthPopulation + elderlyPopulation) / workingAgePopulation) * 100;
  const childDependencyRatio = (youthPopulation / workingAgePopulation) * 100;
  const oldAgeDependencyRatio = (elderlyPopulation / workingAgePopulation) * 100;
  
  // Additional metrics
  const potentialSupportRatio = workingAgePopulation / elderlyPopulation;
  const agingIndex = (elderlyPopulation / youthPopulation) * 100;
  
  // Pyramid type classification
  let pyramidType: 'expansive' | 'constrictive' | 'stationary';
  if (youthPercentage > 30 && elderlyPercentage < 10) {
    pyramidType = 'expansive';
  } else if (youthPercentage < 20 && elderlyPercentage > 15) {
    pyramidType = 'constrictive';
  } else {
    pyramidType = 'stationary';
  }
  
  return {
    totalPopulation: yearData.totalPopulation,
    malePopulation: yearData.malePopulation,
    femalePopulation: yearData.femalePopulation,
    medianAge,
    sexRatio,
    malePercent,
    femalePercent,
    youthPopulation,
    workingAgePopulation,
    elderlyPopulation,
    youthPercentage,
    workingAgePercentage,
    elderlyPercentage,
    dependencyRatio,
    childDependencyRatio,
    oldAgeDependencyRatio,
    potentialSupportRatio,
    agingIndex,
    pyramidType
  };
}