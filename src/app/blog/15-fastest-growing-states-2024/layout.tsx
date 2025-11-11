import { Metadata } from 'next';
import { generateBlogMetadata, generateBlogSchema } from '@/components/BlogSEO';

const articleData = {
  title: '15 Fastest Growing US States: The Great American Migration',
  description: 'Discover which US states are experiencing explosive population growth. South Carolina leads with 3.7% annual growth, followed by Idaho, Florida, and Texas. See complete rankings, migration patterns, and demographic analysis with latest data.',
  keywords: 'fastest growing states, US population growth, state migration patterns, South Carolina population, Idaho growth, Florida migration, Texas population boom, US demographics, interstate migration, population statistics, census data, demographic trends, current population growth',
  publishedDate: '2024-11-01',
  modifiedDate: new Date().toISOString().split('T')[0],
  category: 'US Demographics',
  readingTime: '15M',
  slug: '15-fastest-growing-states-2024',
  articleBody: 'South Carolina leads the nation with 3.7% annual growth, transforming from a sleepy Southern state to America\'s hottest destination. The 2024 census data reveals a massive shift in American migration patterns, with Southern and Mountain states dominating growth while coastal states struggle.'
};

export const metadata: Metadata = generateBlogMetadata(articleData);

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemas = generateBlogSchema(articleData);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }}
      />
      {children}
    </>
  );
}