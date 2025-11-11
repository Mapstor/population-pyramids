import { Metadata } from 'next';
import { generateBlogMetadata } from '@/components/BlogSEO';

export const metadata: Metadata = generateBlogMetadata({
  title: '15 Fastest Growing States in 2024: The Great American Migration',
  description: 'Discover which US states are experiencing explosive population growth in 2024. South Carolina leads with 3.7% annual growth, followed by Idaho, Florida, and Texas. See complete rankings, migration patterns, and demographic analysis.',
  keywords: 'fastest growing states 2024, US population growth, state migration patterns, South Carolina population, Idaho growth, Florida migration, Texas population boom, US demographics, interstate migration, population statistics, census data, demographic trends',
  publishedDate: '2024-11-01',
  modifiedDate: '2024-11-11',
  category: 'US Demographics',
  readingTime: '15M',
  slug: '15-fastest-growing-states-2024'
});