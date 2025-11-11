import { Metadata } from 'next';
import { generateBlogMetadata, generateBlogSchema } from '@/components/BlogSEO';

const articleData = {
  title: 'The Youth Bulge Time Bomb: Why Demographics Predict Revolution',
  description: 'Countries with 30%+ population under 15 face 2.5x higher risk of civil conflict. From Arab Spring to African unrest, discover how youth bulges drive political instability and why 40 countries face demographic time bombs.',
  keywords: 'youth bulge, demographic instability, political revolution, Arab Spring demographics, youth unemployment, civil conflict, demographic transition, population pyramid, youth bulge theory, political instability',
  publishedDate: '2024-11-09',
  modifiedDate: '2024-11-11',
  category: 'Geopolitics',
  readingTime: '16M',
  slug: 'youth-bulge-political-instability',
  articleBody: 'Demographics is destiny, and for 40 countries with massive youth bulges, that destiny may be revolution. When over 30% of a population is under 15 and lacks economic opportunity, history shows the result: political instability, civil conflict, and regime change.'
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