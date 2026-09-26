import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { inText, sentenceStart } from '@/lib/country-names';

export interface FertilityYearData {
  year: number;
  totalFertilityRate: number;
  crudebirthRate: number;
  grossReproductionRate?: number;
  netReproductionRate?: number;
}

export interface FertilityData {
  countryCode: string;
  countryName: string;
  slug: string;
  fertilityData: {
    current: FertilityYearData;
    historical: FertilityYearData[];
    projections: FertilityYearData[];
    replacementLevel: number;
    belowReplacementSince?: number;
    worldComparison: {
      worldAverage: number;
      rank: number;
      totalCountries: number;
    };
  };
}

export async function loadFertilityData(countrySlug: string): Promise<FertilityData | null> {
  try {
    const dataPath = join(process.cwd(), 'src', 'data', 'fertility', `${countrySlug}.json`);
    
    if (!existsSync(dataPath)) {
      return null;
    }
    
    const fileContent = readFileSync(dataPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading fertility data for ${countrySlug}:`, error);
    return null;
  }
}

export function calculateFertilityMetrics(fertilityData: FertilityData) {
  const current = fertilityData.fertilityData.current;
  const historical = fertilityData.fertilityData.historical;
  
  // Calculate trends
  const firstData = historical[0];
  const lastData = historical[historical.length - 1];
  
  const tfrChange = lastData.totalFertilityRate - firstData.totalFertilityRate;
  const tfrChangePercent = (tfrChange / firstData.totalFertilityRate) * 100;
  
  const birthRateChange = lastData.crudebirthRate - firstData.crudebirthRate;
  const birthRateChangePercent = (birthRateChange / firstData.crudebirthRate) * 100;
  
  // Calculate if below replacement level
  const belowReplacement = current.totalFertilityRate < fertilityData.fertilityData.replacementLevel;
  const replacementGap = fertilityData.fertilityData.replacementLevel - current.totalFertilityRate;
  
  // Find when it crossed replacement level
  let crossedReplacementYear = null;
  for (const yearData of historical.reverse()) {
    if (yearData.totalFertilityRate >= fertilityData.fertilityData.replacementLevel) {
      crossedReplacementYear = yearData.year;
      break;
    }
  }
  
  return {
    tfrChange,
    tfrChangePercent,
    birthRateChange,
    birthRateChangePercent,
    belowReplacement,
    replacementGap,
    crossedReplacementYear,
    yearsOfDecline: crossedReplacementYear ? (2025 - crossedReplacementYear) : null
  };
}

export function getFertilityAnalysis(fertilityData: FertilityData, countryName: string): string {
  const metrics = calculateFertilityMetrics(fertilityData);
  const current = fertilityData.fertilityData.current;
  const worldComp = fertilityData.fertilityData.worldComparison;
  
  let analysis = `${sentenceStart(countryName)} has a Total Fertility Rate (TFR) of ${current.totalFertilityRate} children per woman in ${current.year}, `;
  
  if (metrics.belowReplacement) {
    analysis += `which is below the replacement level of ${fertilityData.fertilityData.replacementLevel}. `;
    analysis += `This indicates that ${inText(countryName)} is experiencing below-replacement fertility, contributing to population aging and potential future decline. `;
  } else {
    analysis += `which is above the replacement level of ${fertilityData.fertilityData.replacementLevel}. `;
    analysis += `This indicates that ${inText(countryName)} maintains replacement-level fertility supporting population stability. `;
  }
  
  // Thirds of the 194-country ranking (1 = highest TFR): 1–65 highest third,
  // 66–129 middle third, 130–194 lowest third. Keep the wording aligned with the rank.
  const third = worldComp.rank <= 65 ? 'in the highest third of countries' : worldComp.rank <= 129 ? 'in the middle third of countries' : 'in the lowest third of countries';
  analysis += `${sentenceStart(countryName)} ranks ${worldComp.rank} of ${worldComp.totalCountries} for fertility rate (1 = highest), ${third}. `;
  
  analysis += `The fertility rate has changed by ${metrics.tfrChangePercent.toFixed(1)}% since 1950, `;
  analysis += `reflecting demographic transition and socioeconomic development in ${inText(countryName)}.`;
  
  return analysis;
}