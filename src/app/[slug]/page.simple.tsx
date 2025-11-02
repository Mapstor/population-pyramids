import { notFound } from 'next/navigation';

// Force dynamic rendering
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
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Country Page Test
      </h1>
      <p className="text-lg text-gray-600 mb-4">
        Slug: <code className="bg-gray-100 px-2 py-1 rounded">{params.slug}</code>
      </p>
      <p className="text-gray-700">
        This is a simplified test page to verify dynamic routing works.
        If you can see this page, the routing is working correctly.
      </p>
    </div>
  );
}