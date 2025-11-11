import { Metadata } from 'next';
import { generateBlogMetadata, generateBlogSchema } from '@/components/BlogSEO';

const articleData = {
  title: '10 States People Are Fleeing Most (California Isn\'t #1!)',
  description: 'New Jersey leads the exodus with record population decline. Illinois, Louisiana, and New York follow. Discover why millions of Americans are fleeing these states, where they\'re going, and what\'s driving the mass migration. Updated with latest census data.',
  keywords: 'states losing population, New Jersey exodus, Illinois population decline, California migration, New York population loss, US migration patterns, state population decline, property taxes, cost of living crisis, demographic trends, interstate migration, current exodus',
  publishedDate: '2024-11-02',
  modifiedDate: new Date().toISOString().split('T')[0],
  category: 'US Demographics',
  readingTime: '12M',
  slug: '10-states-people-fleeing-2024',
  articleBody: 'Shocking: New Jersey is hemorrhaging people faster than California. Illinois lost more residents than New York. The 2024 exodus data reveals surprising losers in America\'s great migration—and the reasons will shock you even more.'
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