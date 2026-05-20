import { cache } from 'react';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

export interface LifeExpectancyData {
  country: string;
  slug: string;
  lastUpdated: string;
  source: string;
  current: {
    year: number;
    total: number;
    male: number;
    female: number;
  };
  rank: {
    position: number;
    outOf: number;
    note?: string;
  };
  worldAverage: {
    total: number;
    male: number;
    female: number;
  };
  historical: Array<{ year: number; total: number }>;
  projections: Array<{ year: number; total: number }>;
  neighbors: Array<{ name: string; slug: string; value: number }>;
}

export const loadLifeExpectancyData = cache(
  async (slug: string): Promise<LifeExpectancyData | null> => {
    try {
      const dataPath = join(
        process.cwd(),
        'src',
        'data',
        'life-expectancy',
        `${slug}.json`
      );
      if (!existsSync(dataPath)) return null;
      const raw = readFileSync(dataPath, 'utf-8');
      return JSON.parse(raw) as LifeExpectancyData;
    } catch {
      return null;
    }
  }
);

// Aggregated loader for the hub page.
export const getAllLifeExpectancyData = cache(
  async (): Promise<LifeExpectancyData[]> => {
    const dir = join(process.cwd(), 'src', 'data', 'life-expectancy');
    if (!existsSync(dir)) return [];
    const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
    const all: LifeExpectancyData[] = [];
    for (const f of files) {
      try {
        const raw = readFileSync(join(dir, f), 'utf-8');
        all.push(JSON.parse(raw) as LifeExpectancyData);
      } catch {
        // skip malformed entries
      }
    }
    // Sort by current life expectancy, descending
    all.sort((a, b) => b.current.total - a.current.total);
    return all;
  }
);

