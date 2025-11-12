import { Metadata } from 'next';
import { generateBlogMetadata, generateBlogSchema } from '@/components/BlogSEO';

const articleData = {
  title: 'Middle East\'s Demographic Divide: Youth vs. Wealth',
  description: 'The Middle East splits between young, poor nations with exploding populations (Yemen, Iraq) and rich, aging Gulf states relying on immigrants. Discover how demographics shapes the region\'s conflicts, economics, and future.',
  keywords: 'Middle East demographics, Gulf states population, Yemen population crisis, Saudi Arabia demographics, UAE immigrant population, demographic divide, youth unemployment Middle East, Gulf demographics, Arab demographics, population dynamics',
  publishedDate: '2024-11-10',
  modifiedDate: '2024-11-11',
  category: 'Regional Analysis',
  readingTime: '15M',
  slug: 'middle-east-demographic-divide',
  articleBody: 'The Middle East faces a stark demographic divide: impoverished nations with exploding youth populations versus wealthy Gulf states dependent on immigrant labor. This split between youth and wealth defines the region\'s present conflicts and future trajectory.'
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