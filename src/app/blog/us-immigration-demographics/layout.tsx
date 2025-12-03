import { Metadata } from 'next';
import { generateBlogMetadata, generateBlogSchema } from '@/components/BlogSEO';

const articleData = {
  title: 'How Immigration Saved America from Demographic Collapse',
  description: 'Without immigration, the US would face population decline like Japan and Europe. 47 million immigrants drive 80% of population growth, fill critical jobs, and keep America young. Explore the demographic reality behind the immigration debate.',
  keywords: 'US immigration demographics, immigration population growth, demographic impact immigration, US population growth, immigrant demographics, immigration statistics 2024, foreign-born population, demographic decline, immigration economy, population projections',
  publishedDate: '2024-11-08',
  modifiedDate: '2024-11-11',
  category: 'US Demographics',
  readingTime: '14M',
  slug: 'us-immigration-demographics',
  articleBody: 'Immigration isn\'t just a political issue—it\'s demographic destiny. Without its 47 million immigrants, America would be facing the same population collapse as Japan and Europe. Here\'s the mathematical reality that political rhetoric ignores.'
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