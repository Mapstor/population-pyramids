export const dynamic = 'force-dynamic'

interface TestPageProps {
  params: {
    country: string;
  };
}

export default function TestPage({ params }: TestPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Test Dynamic Route</h1>
      <p>Country: {params.country}</p>
      <p>This should work for: /test-dynamic/slovenia</p>
    </div>
  );
}