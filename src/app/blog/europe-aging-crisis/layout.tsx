import { Metadata } from 'next';
import { generateBlogMetadata, generateBlogSchema } from '@/components/BlogSEO';

const articleData = {
  title: 'Europe\'s Aging Crisis: 1 in 3 Will Be Over 65 by 2050',
  description: 'Europe faces demographic catastrophe with median age hitting 44.4 years. Italy, Germany, and Spain lead the aging crisis while Eastern Europe sees population freefall. Discover how the continent\'s demographic winter threatens its future.',
  keywords: 'Europe aging crisis, European demographics, aging population, Italy demographic crisis, Germany population decline, pension crisis Europe, demographic winter, elderly population, Europe birth rate, population aging',
  publishedDate: '2024-11-07',
  modifiedDate: '2024-11-11',
  category: 'Global Demographics',
  readingTime: '15M',
  slug: 'europe-aging-crisis',
  articleBody: 'Europe is becoming a continent of the elderly. With a median age of 44.4 years and birth rates below 1.5 in most countries, Europe faces a demographic winter that threatens everything from pensions to economic growth. By 2050, one in three Europeans will be over 65.'
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