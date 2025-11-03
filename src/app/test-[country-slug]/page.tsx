export const dynamic = 'force-dynamic'

interface TestPageProps {
  params: {
    'country-slug': string;
  };
}

export default function TestCountrySlug({ params }: TestPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Test Country Slug Route</h1>
      <p>Country slug: {params['country-slug']}</p>
      <p>This tests the same pattern as [country-population-pyramid]</p>
    </div>
  );
}