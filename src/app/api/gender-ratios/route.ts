import { NextResponse } from 'next/server';
import { loadCountries, loadCountryData } from '@/lib/data-loader';

interface CountryRatioData {
  slug: string;
  name: string;
  code: string;
  male: number;
  female: number;
  total: number;
  ratio: number;
  malePercent: number;
  femalePercent: number;
  atBirthRatio: number;
  elderlyRatio: number;
  workingAgeRatio: number;
  region: string;
}

export async function GET() {
  try {
    const countries = await loadCountries();
    const allCountryData: CountryRatioData[] = [];
    
    let worldMale = 0;
    let worldFemale = 0;
    let worldMaleBirth = 0;
    let worldFemaleBirth = 0;
    let worldMaleWorking = 0;
    let worldFemaleWorking = 0;
    let worldMaleElderly = 0;
    let worldFemaleElderly = 0;

    for (const country of countries) {
      try {
        const data = await loadCountryData(country.slug);
        
        // Get most recent year data
        const year2023 = data.years?.['2023'] || data.years?.['2024'] || data.years?.['2025'];
        
        if (!year2023) continue;

        const male = year2023.malePopulation || 0;
        const female = year2023.femalePopulation || 0;
        const total = year2023.totalPopulation || (male + female);
        
        // Calculate age-specific ratios
        let maleBirth = 0, femaleBirth = 0;
        let maleWorking = 0, femaleWorking = 0;
        let maleElderly = 0, femaleElderly = 0;
        
        if (year2023.ageGroups) {
          year2023.ageGroups.forEach((ag: any) => {
            const ageStart = parseInt(ag.ageRange.split('-')[0]);
            
            if (ageStart < 5) {
              maleBirth += ag.male;
              femaleBirth += ag.female;
            }
            if (ageStart >= 15 && ageStart < 65) {
              maleWorking += ag.male;
              femaleWorking += ag.female;
            }
            if (ageStart >= 65 || ag.ageRange === '65+' || ag.ageRange === '100+') {
              maleElderly += ag.male;
              femaleElderly += ag.female;
            }
          });
        }

        worldMale += male;
        worldFemale += female;
        worldMaleBirth += maleBirth;
        worldFemaleBirth += femaleBirth;
        worldMaleWorking += maleWorking;
        worldFemaleWorking += femaleWorking;
        worldMaleElderly += maleElderly;
        worldFemaleElderly += femaleElderly;

        const ratio = female > 0 ? (male / female) * 100 : 0;
        const atBirthRatio = femaleBirth > 0 ? (maleBirth / femaleBirth) * 100 : 0;
        const workingAgeRatio = femaleWorking > 0 ? (maleWorking / femaleWorking) * 100 : 0;
        const elderlyRatio = femaleElderly > 0 ? (maleElderly / femaleElderly) * 100 : 0;

        allCountryData.push({
          slug: country.slug,
          name: country.name,
          code: country.code,
          male,
          female,
          total,
          ratio,
          malePercent: total > 0 ? (male / total) * 100 : 0,
          femalePercent: total > 0 ? (female / total) * 100 : 0,
          atBirthRatio,
          elderlyRatio,
          workingAgeRatio,
          region: data.region || 'Unknown'
        });
      } catch (error) {
        console.error(`Error loading data for ${country.slug}:`, error);
      }
    }

    // Add world data
    const worldRatio = worldFemale > 0 ? (worldMale / worldFemale) * 100 : 0;
    const worldTotal = worldMale + worldFemale;
    
    const worldData = {
      slug: 'world',
      name: 'World',
      code: 'WORLD',
      male: worldMale,
      female: worldFemale,
      total: worldTotal,
      ratio: worldRatio,
      malePercent: worldTotal > 0 ? (worldMale / worldTotal) * 100 : 0,
      femalePercent: worldTotal > 0 ? (worldFemale / worldTotal) * 100 : 0,
      atBirthRatio: worldFemaleBirth > 0 ? (worldMaleBirth / worldFemaleBirth) * 100 : 0,
      elderlyRatio: worldFemaleElderly > 0 ? (worldMaleElderly / worldFemaleElderly) * 100 : 0,
      workingAgeRatio: worldFemaleWorking > 0 ? (worldMaleWorking / worldFemaleWorking) * 100 : 0,
      region: 'World'
    };

    return NextResponse.json({
      world: worldData,
      countries: allCountryData
    });
  } catch (error) {
    console.error('Error calculating gender ratios:', error);
    return NextResponse.json({ error: 'Failed to calculate gender ratios' }, { status: 500 });
  }
}