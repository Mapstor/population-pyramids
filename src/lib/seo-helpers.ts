import type { Metadata } from 'next';

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function generateCountryMetadata(
  countryName: string,
  year: number,
  totalPopulation: number,
  dailyBirths?: number,
  birthRate?: number
): Metadata {
  const titleSuffix = dailyBirths ? ` | ${dailyBirths.toLocaleString()} Daily Births` : '';
  const title = `${countryName} Population Pyramid ${year} - Demographics & Birth Statistics${titleSuffix}`;
  const birthInfo = dailyBirths ? ` ${dailyBirths.toLocaleString()} babies born daily (birth rate: ${birthRate} per 1,000).` : '';
  const description = `Interactive population pyramid for ${countryName} in ${year}. Total population: ${formatNumber(totalPopulation)}.${birthInfo} View age distribution, birth statistics, demographic trends.`;
  
  const baseKeywords = [
    `${countryName.toLowerCase()} population pyramid`,
    `${countryName.toLowerCase()} demographics`,
    `${countryName.toLowerCase()} age distribution`,
    `${countryName.toLowerCase()} population ${year}`
  ];
  
  const birthKeywords = dailyBirths ? [
    `how many babies born in ${countryName.toLowerCase()} per day`,
    `${countryName.toLowerCase()} births per day`,
    `${countryName.toLowerCase()} daily birth rate`,
    `${countryName.toLowerCase()} birth statistics`,
    `${countryName.toLowerCase()} births per hour`,
    `${countryName.toLowerCase()} annual births`,
    `babies born in ${countryName.toLowerCase()}`,
    `${countryName.toLowerCase()} birth rate ${year}`
  ] : [];
  
  return {
    title,
    description,
    keywords: [...baseKeywords, ...birthKeywords],
    openGraph: {
      title,
      description,
      type: 'article',
    },
  };
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}