// Minimal test version without complex imports
export async function generateStaticParams() {
  console.log('🔍 SIMPLE generateStaticParams EXECUTING');
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
      <h1>Country: {params.country}</h1>
      <p>This is a minimal test page to verify routing works.</p>
    </div>
  );
}