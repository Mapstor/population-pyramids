import { Metadata } from 'next';
import { generateBlogMetadata, generateBlogSchema } from '@/components/BlogSEO';

const articleData = {
  title: 'Japan\'s Demographic Time Bomb: A Nation Vanishing Before Our Eyes',
  description: 'Japan loses 800,000 people annually with 29.78% of population over 65. By 2050, the population will shrink to 104 million. Explore how the world\'s fastest-aging society is reshaping everything from economics to culture.',
  keywords: 'Japan demographic crisis, Japan aging population, Japan population decline, demographic time bomb, super-aged society, Japan birth rate, elderly population Japan, population collapse, demographic transition, aging crisis',
  publishedDate: '2024-11-04',
  modifiedDate: '2024-11-11',
  category: 'Country Analysis',
  readingTime: '14M',
  slug: 'japan-demographic-time-bomb',
  articleBody: 'Japan is disappearing. Not through war or natural disaster, but through a demographic collapse so severe it threatens the nation\'s very existence. With 29.78% of its population over 65 and a birth rate of just 1.26, Japan offers a terrifying preview of the developed world\'s future.'
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