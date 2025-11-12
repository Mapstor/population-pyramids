import { Metadata } from 'next';
import { generateBlogMetadata, generateBlogSchema } from '@/components/BlogSEO';

const articleData = {
  title: 'The Century\'s Biggest Shift: India Overtakes China',
  description: 'In 2023, India became the world\'s most populous country with 1.45 billion people, overtaking China for the first time in centuries. Explore what this historic shift means for global economics, geopolitics, and the future of Asia.',
  keywords: 'India population China, India most populous country, China population decline, demographic shift, India vs China, population crossover, Asian demographics, global population rankings, India demographics, China aging',
  publishedDate: '2024-11-06',
  modifiedDate: '2024-11-11',
  category: 'Global Demographics',
  readingTime: '13M',
  slug: 'china-india-population-shift',
  articleBody: 'For the first time in modern history, India has overtaken China as the world\'s most populous nation. This isn\'t just a statistical milestone—it\'s a tectonic shift that will reshape global power, economics, and the 21st century world order.'
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