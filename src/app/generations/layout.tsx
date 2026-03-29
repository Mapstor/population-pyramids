import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generation Age Ranges 2026: Gen Z, Millennial, Gen X, Boomer Calculator',
  description: 'What generation am I? Enter your birth year to find out. See 2026 age ranges and real population data for Gen Z, Millennials, Gen X, Baby Boomers, Gen Alpha.',
  keywords: 'generation age ranges, gen z age range, millennial age range, gen x age range, baby boomer age range, gen alpha age range, what generation am I, generation calculator, generation years, generation chart, gen z years, millennial years, gen z cutoff, generation breakdown by year, oldest millennial age, youngest boomer age, gen z age range 2026',
  authors: [{ name: 'Population Pyramids' }],
  creator: 'Population Pyramids',
  publisher: 'Population Pyramids',
  openGraph: {
    title: 'Generation Age Ranges 2026: Gen Z, Millennial, Gen X, Boomer Calculator',
    description: 'What generation am I? Enter your birth year to find out. See 2026 age ranges and real population data for Gen Z, Millennials, Gen X, Baby Boomers, Gen Alpha.',
    url: 'https://populationpyramids.org/generations',
    siteName: 'Population Pyramids',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generation Age Ranges 2026: Gen Z, Millennial, Gen X, Boomer Calculator',
    description: 'What generation am I? Enter your birth year to find out. Real UN population data for all generations.',
  },
  alternates: {
    canonical: 'https://populationpyramids.org/generations',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function GenerationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Generation Calculator',
            description: 'Calculate what generation you belong to based on your birth year',
            applicationCategory: 'EducationalApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Generation calculator by birth year',
              'Real UN population data',
              'Global and country-specific generation breakdowns',
              'Interactive visualizations',
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What are the generation age ranges in 2026?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'In 2026, generation age ranges are: Gen Alpha (0-13), Gen Z (14-29), Millennials (30-45), Gen X (46-61), Baby Boomers (62-80), Silent Generation (81-98), and Greatest Generation (99+).',
                },
              },
              {
                '@type': 'Question',
                name: 'What age is Gen Z in 2026?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Gen Z is 14-29 years old in 2026, born between 1997-2012.',
                },
              },
              {
                '@type': 'Question',
                name: 'What age is a millennial in 2026?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Millennials are 30-45 years old in 2026, born between 1981-1996.',
                },
              },
              {
                '@type': 'Question',
                name: 'What age is Gen X in 2026?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Gen X is 46-61 years old in 2026, born between 1965-1980.',
                },
              },
              {
                '@type': 'Question',
                name: 'What years are Gen Z?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Gen Z birth years span 1997-2012 according to Pew Research Center.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is the Gen Z cutoff year?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The Gen Z cutoff year is 2012 - anyone born in 2013 or later is Generation Alpha.',
                },
              },
              {
                '@type': 'Question',
                name: 'What generation is 1996? What generation is 1997?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '1996 is the last year of Millennials, while 1997 is the first year of Gen Z.',
                },
              },
              {
                '@type': 'Question',
                name: 'How many Gen Z are there in the world?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'There are approximately 2 billion Gen Z members globally, representing about 25% of world population.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is Gen Alpha age range?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Gen Alpha's age range in 2026 is 0-13 years, born 2013-2026.",
                },
              },
              {
                '@type': 'Question',
                name: 'What generation am I if I was born in a specific year?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Use our calculator above to find your generation instantly. Enter any birth year from 1901-2026.',
                },
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: 'World Population Generation Data 2026',
            description: 'Population data by generation based on UN World Population Prospects 2024',
            creator: {
              '@type': 'Organization',
              name: 'United Nations Population Division',
              url: 'https://population.un.org',
            },
            citation: 'UN World Population Prospects 2024',
            license: 'https://creativecommons.org/licenses/by/3.0/igo/',
          }),
        }}
      />
    </>
  );
}