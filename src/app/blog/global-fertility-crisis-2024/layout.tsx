import { Metadata } from 'next';
import { generateBlogMetadata, generateBlogSchema } from '@/components/BlogSEO';

const articleData = {
  title: 'Global Fertility Crisis: 93 Countries Below Replacement Level',
  description: 'A demographic catastrophe unfolds as 93 countries fall below replacement fertility rates. South Korea hits record low 0.72 births per woman. Explore the causes, consequences, and countries facing population collapse with the latest UN data.',
  keywords: 'global fertility crisis, below replacement fertility, demographic crisis, South Korea fertility rate, population decline, birth rate collapse, aging population, demographic winter, fertility rates by country, population collapse, reproductive crisis, current fertility rates',
  publishedDate: '2024-11-03',
  modifiedDate: new Date().toISOString().split('T')[0],
  category: 'Global Demographics',
  readingTime: '18M',
  slug: 'global-fertility-crisis-2024',
  articleBody: 'The world faces an unprecedented demographic crisis. In 2024, 93 countries have fertility rates below the 2.1 replacement level needed to maintain population stability. This isn\'t just statistics—it\'s a civilizational emergency reshaping economics, geopolitics, and society itself.'
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