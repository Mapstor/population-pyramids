export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface CountryPageProps {
  params: {
    slug: string;
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Country Page</h1>
      <p>Slug: {params.slug}</p>
      <p>This route should work for: /afghanistan-population-pyramid</p>
    </div>
  );
}