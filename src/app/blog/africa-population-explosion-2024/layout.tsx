import { Metadata } from 'next';
import { generateBlogMetadata, generateBlogSchema } from '@/components/BlogSEO';

const articleData = {
  title: 'Africa\'s Population Explosion: 2.5 Billion by 2050',
  description: 'Africa will add 1 billion people by 2050, becoming home to 25% of humanity. Nigeria surpasses the US, Ethiopia doubles, and Congo explodes. Discover the demographic transformation reshaping the global order with latest UN projections.',
  keywords: 'Africa population growth, Africa demographics, Nigeria population, population explosion, African youth bulge, demographic dividend, Ethiopia population, Congo population, sub-Saharan Africa, population projections, current demographics',
  publishedDate: '2024-11-05',
  modifiedDate: new Date().toISOString().split('T')[0],
  category: 'Global Demographics',
  readingTime: '16M',
  slug: 'africa-population-explosion-2024',
  articleBody: 'Africa is experiencing the most dramatic population explosion in human history. By 2050, the continent will add another billion people, fundamentally reshaping global demographics, economics, and geopolitics. This isn\'t just growth—it\'s a transformation that will define the 21st century.'
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