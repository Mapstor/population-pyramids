export const dynamic = 'force-dynamic'

interface TestPageProps {
  params: {
    slug: string;
  };
}

export default async function TestPage({ params }: TestPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Test Route</h1>
      <p>Slug: {params.slug}</p>
      <p>This is a simple test to verify dynamic routing works.</p>
    </div>
  );
}