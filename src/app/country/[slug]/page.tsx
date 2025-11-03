export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation';
import { loadCountryData } from '@/lib/data-loader';

interface CountryPageProps {
  params: {
    slug: string;
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  try {
    const countryData = await loadCountryData(params.slug);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1>Country: {countryData.countryName}</h1>
        <p>Slug: {params.slug}</p>
        <p>This is a test route for debugging</p>
      </div>
    );
  } catch (error) {
    notFound();
  }
}