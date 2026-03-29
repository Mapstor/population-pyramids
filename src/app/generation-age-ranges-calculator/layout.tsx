import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generation Age Ranges 2026 | Gen Z to Boomers Calculator',
  description: 'What generation am I? Enter your birth year to find out. See 2026 age ranges and real population data for Gen Z, Millennials, Gen X, Baby Boomers, Gen Alpha.',
  keywords: 'generation age ranges, gen z age range, millennial age range, gen x age range, baby boomer age range, gen alpha age range, what generation am I, generation calculator, generation years, generation chart, gen z years, millennial years, gen z cutoff, generation breakdown by year, oldest millennial age, youngest boomer age, gen z age range 2026',
  authors: [{ name: 'Population Pyramids' }],
  creator: 'Population Pyramids',
  publisher: 'Population Pyramids',
  openGraph: {
    title: 'Generation Age Ranges 2026 | Gen Z to Boomers Calculator',
    description: 'What generation am I? Enter your birth year to find out. See 2026 age ranges and real population data for Gen Z, Millennials, Gen X, Baby Boomers, Gen Alpha.',
    url: 'https://populationpyramids.org/generation-age-ranges-calculator',
    siteName: 'Population Pyramids',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generation Age Ranges 2026 | Gen Z to Boomers Calculator',
    description: 'What generation am I? Enter your birth year to find out. Real UN population data for all generations.',
  },
  alternates: {
    canonical: 'https://populationpyramids.org/generation-age-ranges-calculator',
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
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://populationpyramids.org'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Generation Age Ranges Calculator',
                item: 'https://populationpyramids.org/generation-age-ranges-calculator'
              }
            ]
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Generation Calculator',
            description: 'Calculate what generation you belong to based on your birth year',
            applicationCategory: 'EducationalApplication',
            url: 'https://populationpyramids.org/generation-age-ranges-calculator',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Generation calculator by birth year',
              'Real UN population data for each generation',
              'Global and country-specific generation breakdowns',
              'Interactive visualizations',
              'Shareable results with URL parameters',
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
                  text: 'In 2026, generation age ranges are: Gen Alpha (0-13 years old), Gen Z (14-29 years old), Millennials (30-45 years old), Gen X (46-61 years old), Baby Boomers (62-80 years old), Silent Generation (81-98 years old), and Greatest Generation (99+ years old).',
                },
              },
              {
                '@type': 'Question',
                name: 'What age is Gen Z in 2026?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Gen Z age range in 2026 is 14-29 years old, born between 1997 and 2012. The oldest Gen Z members are 29 and entering prime career years, while the youngest are 14 and in high school.',
                },
              },
              {
                '@type': 'Question',
                name: 'What age is a millennial in 2026?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Millennial age range in 2026 is 30-45 years old, born between 1981 and 1996. They are in their prime working and family-forming years.',
                },
              },
              {
                '@type': 'Question',
                name: 'What age is Gen X in 2026?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Gen X age range in 2026 is 46-61 years old, born between 1965 and 1980. They are at peak earning power and many are caring for both children and aging parents.',
                },
              },
              {
                '@type': 'Question',
                name: 'What years are Gen Z?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Gen Z birth years span 1997-2012 according to Pew Research Center. The generation begins with those who don\'t remember 9/11 and ends before widespread smartphone adoption at birth.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is the Gen Z cutoff year?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The Gen Z cutoff year is 2012. Anyone born in 2013 or later is Generation Alpha. The 1996/1997 boundary separates Millennials from Gen Z.',
                },
              },
              {
                '@type': 'Question',
                name: 'What generation is 1996? What generation is 1997?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '1996 is the last year of Millennials, while 1997 is the first year of Gen Z. This boundary marks those who came of age before vs. after smartphones became ubiquitous.',
                },
              },
              {
                '@type': 'Question',
                name: 'How many Gen Z are there in the world?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'There are approximately 2 billion Gen Z members globally, representing about 25% of world population. Gen Z is largest in Asia, particularly India and Indonesia.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is Gen Alpha age range?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Gen Alpha age range in 2026 is 0-13 years old, born 2013-2026. They are the first generation born entirely in the 2010s and 2020s.',
                },
              },
              {
                '@type': 'Question',
                name: 'What generation am I if I was born in a specific year?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Use our generation calculator to find out instantly. Enter any birth year from 1901-2026 to discover your generation, current age, and your generation\'s global population.',
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