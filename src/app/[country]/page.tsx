// Test version with minimal imports to find the problem
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  console.log('🔍 TEST generateStaticParams EXECUTING');
  return [
    { country: 'germany-population-pyramid' },
    { country: 'afghanistan-population-pyramid' },
    { country: 'united-states-population-pyramid' }
  ];
}

export const dynamic = 'force-dynamic';
export const dynamicParams = false;

export default async function CountryPage({ params }: { params: { country: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>TEST: {params.country}</h1>
      <p>Testing with minimal imports</p>
    </div>
  );
}