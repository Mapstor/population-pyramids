import type { YearData } from '@/types/population';

export interface Generation {
  id: string;
  name: string;
  alternativeName?: string;
  birthYearStart: number;
  birthYearEnd: number;
  description: string;
  color: string;
}

export const generations: Generation[] = [
  {
    id: 'gen-alpha',
    name: 'Gen Alpha',
    alternativeName: 'Generation Alpha',
    birthYearStart: 2013,
    birthYearEnd: 2026,
    description: 'The newest generation, digital natives from birth',
    color: 'rgb(147, 51, 234)' // purple
  },
  {
    id: 'gen-z',
    name: 'Gen Z',
    alternativeName: 'Generation Z / Zoomers',
    birthYearStart: 1997,
    birthYearEnd: 2012,
    description: 'First generation to grow up with smartphones',
    color: 'rgb(59, 130, 246)' // blue
  },
  {
    id: 'millennials',
    name: 'Millennials',
    alternativeName: 'Generation Y',
    birthYearStart: 1981,
    birthYearEnd: 1996,
    description: 'Came of age during the internet revolution',
    color: 'rgb(16, 185, 129)' // emerald
  },
  {
    id: 'gen-x',
    name: 'Gen X',
    alternativeName: 'Generation X',
    birthYearStart: 1965,
    birthYearEnd: 1980,
    description: 'The "latchkey" generation',
    color: 'rgb(245, 158, 11)' // amber
  },
  {
    id: 'baby-boomers',
    name: 'Baby Boomers',
    alternativeName: 'Boomers',
    birthYearStart: 1946,
    birthYearEnd: 1964,
    description: 'Post-WWII population boom',
    color: 'rgb(239, 68, 68)' // red
  },
  {
    id: 'silent',
    name: 'Silent Generation',
    alternativeName: 'Traditionalists',
    birthYearStart: 1928,
    birthYearEnd: 1945,
    description: 'Grew up during the Great Depression and WWII',
    color: 'rgb(107, 114, 128)' // gray
  },
  {
    id: 'greatest',
    name: 'Greatest Generation',
    alternativeName: 'G.I. Generation',
    birthYearStart: 1901,
    birthYearEnd: 1927,
    description: 'Fought in WWII, survived the Depression',
    color: 'rgb(75, 85, 99)' // gray-600
  }
];

export function getGenerationByBirthYear(birthYear: number): Generation | null {
  return generations.find(gen => 
    birthYear >= gen.birthYearStart && birthYear <= gen.birthYearEnd
  ) || null;
}

export function getAgeFromBirthYear(birthYear: number, currentYear: number = 2026): number {
  return currentYear - birthYear;
}

export function getAgeRangeInYear(generation: Generation, targetYear: number = 2026): { minAge: number; maxAge: number } {
  const minAge = targetYear - generation.birthYearEnd;
  const maxAge = targetYear - generation.birthYearStart;
  return { minAge: Math.max(0, minAge), maxAge };
}

export interface GenerationPopulation {
  generation: Generation;
  population: number;
  malePopulation: number;
  femalePopulation: number;
  percentOfTotal: number;
  ageRange: string;
}

export function calculateGenerationPopulations(yearData: YearData, targetYear: number = 2026): GenerationPopulation[] {
  const results: GenerationPopulation[] = [];
  const totalPop = yearData.totalPopulation;

  for (const gen of generations) {
    const { minAge, maxAge } = getAgeRangeInYear(gen, targetYear);
    
    let genPopulation = 0;
    let genMale = 0;
    let genFemale = 0;

    // Sum up relevant age groups
    for (const ageGroup of yearData.ageGroups) {
      const [rangeStart, rangeEndStr] = ageGroup.ageRange.split('-').map(s => s.replace('+', ''));
      const ageStart = parseInt(rangeStart);
      const ageEnd = rangeEndStr ? parseInt(rangeEndStr) : 120; // 100+ group
      
      // Calculate overlap between age group and generation age range
      const overlapStart = Math.max(ageStart, minAge);
      const overlapEnd = Math.min(ageEnd, maxAge);
      
      if (overlapStart <= overlapEnd) {
        // Calculate proportion of this age group that belongs to the generation
        const groupSpan = ageEnd - ageStart + 1;
        const overlapSpan = overlapEnd - overlapStart + 1;
        const proportion = overlapSpan / groupSpan;
        
        genPopulation += ageGroup.total * proportion;
        genMale += ageGroup.male * proportion;
        genFemale += ageGroup.female * proportion;
      }
    }

    // Format age range string
    let ageRangeStr = '';
    if (maxAge >= 100) {
      ageRangeStr = `${minAge}-${maxAge}+`;
    } else if (minAge === maxAge) {
      ageRangeStr = `${minAge}`;
    } else {
      ageRangeStr = `${minAge}-${maxAge}`;
    }

    results.push({
      generation: gen,
      population: Math.round(genPopulation),
      malePopulation: Math.round(genMale),
      femalePopulation: Math.round(genFemale),
      percentOfTotal: (genPopulation / totalPop) * 100,
      ageRange: ageRangeStr
    });
  }

  return results.sort((a, b) => b.generation.birthYearEnd - a.generation.birthYearEnd); // Youngest first
}

// Get world population by aggregating all countries
export async function calculateWorldGenerationPopulations(): Promise<GenerationPopulation[]> {
  // We'll implement this after creating the world data aggregator enhancement
  const { generateWorldPopulationData } = await import('./world-data-aggregator');
  const worldData = await generateWorldPopulationData();
  
  // Get 2024 data (or latest available)
  const year2024Data = worldData.years['2024'] || worldData.years['2023'];
  if (!year2024Data) {
    throw new Error('No recent world population data available');
  }
  
  return calculateGenerationPopulations(year2024Data, 2026);
}