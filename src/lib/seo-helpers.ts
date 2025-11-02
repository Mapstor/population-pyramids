import type { Metadata } from 'next';

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function generateCountryMetadata(
  countryName: string,
  year: number,
  totalPopulation: number
): Metadata {
  const title = `${countryName} Population Pyramid ${year} - Demographics & Age Distribution`;
  const description = `Interactive population pyramid for ${countryName} in ${year}. Total population: ${formatNumber(totalPopulation)}. View age distribution by gender, demographic trends, and compare with other countries.`;
  
  return {
    title,
    description,
    keywords: [
      `${countryName.toLowerCase()} population pyramid`,
      `${countryName.toLowerCase()} demographics`,
      `${countryName.toLowerCase()} age distribution`,
      `${countryName.toLowerCase()} population ${year}`
    ],
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