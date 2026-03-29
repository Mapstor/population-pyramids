import { NextResponse } from 'next/server';
import { loadCountries, loadCountryData } from '@/lib/data-loader';

interface CountryMedianData {
  slug: string;
  name: string;
  code: string;
  medianAge: number;
  youthPercent: number;
  workingPercent: number;
  elderlyPercent: number;
  totalPopulation: number;
  youthCount: number;
  workingCount: number;
  elderlyCount: number;
  region: string;
  category: string;
  historicalData?: { year: number; medianAge: number }[];
}

function getCategory(medianAge: number): string {
  if (medianAge < 20) return 'Very Young';
  if (medianAge < 30) return 'Young';
  if (medianAge < 40) return 'Middle-Aged';
  if (medianAge < 50) return 'Aging';
  return 'Aged';
}

export async function GET() {
  try {
    const countries = await loadCountries();
    const allCountryData: CountryMedianData[] = [];
    
    let worldTotalPop = 0;
    let worldWeightedAge = 0;
    let worldYouth = 0;
    let worldWorking = 0;
    let worldElderly = 0;

    for (const country of countries) {
      try {
        const data = await loadCountryData(country.slug);
        
        // Get most recent year data
        const recentYear = data.years?.['2024'] || data.years?.['2023'] || data.years?.['2025'];
        
        if (!recentYear || !recentYear.medianAge) continue;

        const medianAge = recentYear.medianAge;
        const total = recentYear.totalPopulation || 0;
        
        // Calculate age group populations
        let youth = 0, working = 0, elderly = 0;
        
        if (recentYear.ageGroups) {
          recentYear.ageGroups.forEach((ag: any) => {
            const ageStart = parseInt(ag.ageRange.split('-')[0]);
            const population = ag.total || (ag.male + ag.female);
            
            if (ageStart < 15) {
              youth += population;
            } else if (ageStart >= 15 && ageStart < 65) {
              working += population;
            } else if (ageStart >= 65 || ag.ageRange === '65+' || ag.ageRange === '100+') {
              elderly += population;
            }
          });
        }

        // Get historical data if available
        const historicalData: { year: number; medianAge: number }[] = [];
        const years = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2024];
        
        for (const year of years) {
          const yearData = data.years?.[year.toString()];
          if (yearData?.medianAge) {
            historicalData.push({ year, medianAge: yearData.medianAge });
          }
        }

        worldTotalPop += total;
        worldWeightedAge += medianAge * total;
        worldYouth += youth;
        worldWorking += working;
        worldElderly += elderly;

        allCountryData.push({
          slug: country.slug,
          name: country.name,
          code: country.code,
          medianAge,
          youthPercent: total > 0 ? (youth / total) * 100 : 0,
          workingPercent: total > 0 ? (working / total) * 100 : 0,
          elderlyPercent: total > 0 ? (elderly / total) * 100 : 0,
          totalPopulation: total,
          youthCount: youth,
          workingCount: working,
          elderlyCount: elderly,
          region: data.region || 'Unknown',
          category: getCategory(medianAge),
          historicalData: historicalData.length > 0 ? historicalData : undefined
        });
      } catch (error) {
        console.error(`Error loading data for ${country.slug}:`, error);
      }
    }

    // Calculate world median age (weighted average)
    const worldMedianAge = worldTotalPop > 0 ? worldWeightedAge / worldTotalPop : 0;
    
    const worldData = {
      slug: 'world',
      name: 'World',
      code: 'WORLD',
      medianAge: worldMedianAge,
      youthPercent: worldTotalPop > 0 ? (worldYouth / worldTotalPop) * 100 : 0,
      workingPercent: worldTotalPop > 0 ? (worldWorking / worldTotalPop) * 100 : 0,
      elderlyPercent: worldTotalPop > 0 ? (worldElderly / worldTotalPop) * 100 : 0,
      totalPopulation: worldTotalPop,
      youthCount: worldYouth,
      workingCount: worldWorking,
      elderlyCount: worldElderly,
      region: 'World',
      category: getCategory(worldMedianAge)
    };

    // Sort countries by median age for ranking
    allCountryData.sort((a, b) => b.medianAge - a.medianAge);

    return NextResponse.json({
      world: worldData,
      countries: allCountryData
    });
  } catch (error) {
    console.error('Error calculating median ages:', error);
    return NextResponse.json({ error: 'Failed to calculate median ages' }, { status: 500 });
  }
}