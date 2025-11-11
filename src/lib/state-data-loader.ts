import fs from 'fs/promises';
import path from 'path';

export interface StateData {
  stateCode: string;
  stateName: string;
  slug: string;
  fips: string;
  region: string;
  years: {
    [year: string]: {
      year: number;
      totalPopulation: number;
      malePopulation: number;
      femalePopulation: number;
      medianAge: number;
      ageGroups: Array<{
        ageRange: string;
        male: number;
        female: number;
        total: number;
        malePercent: number;
        femalePercent: number;
      }>;
    };
  };
}

export async function loadStates() {
  const statesPath = path.join(process.cwd(), 'src/data/states.json');
  const content = await fs.readFile(statesPath, 'utf-8');
  return JSON.parse(content);
}

export async function loadStateData(stateSlug: string): Promise<StateData> {
  const filePath = path.join(process.cwd(), `src/data/states/${stateSlug}.json`);
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

export function getAvailableYears(stateData: StateData): number[] {
  return Object.keys(stateData.years).map(year => parseInt(year)).sort((a, b) => a - b);
}