import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dependency Ratio Calculator & Rankings 2026 | PopulationPyramids',
  description: 'Calculate dependency ratio for any country. See youth, old-age, and total dependency ratios for 195 countries with real UN data. Free calculator with formula and examples.',
  openGraph: {
    title: 'Dependency Ratio Calculator & Rankings 2026',
    description: 'Calculate dependency ratio for any country. See youth, old-age, and total dependency ratios for 195 countries with real UN data.',
    url: 'https://populationpyramids.org/dependency-ratio-calculator',
    siteName: 'Population Pyramids',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dependency Ratio Calculator & Rankings 2026',
    description: 'Calculate dependency ratio for any country. See youth, old-age, and total dependency ratios for 195 countries.',
  },
  alternates: {
    canonical: 'https://populationpyramids.org/dependency-ratio-calculator',
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the dependency ratio?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The dependency ratio measures the number of dependents (people aged 0-14 and 65+) for every 100 working-age people (aged 15-64) in a population. The global average dependency ratio in 2026 is approximately 53.8.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the dependency ratio formula?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Total Dependency Ratio = ((Population aged 0-14 + Population aged 65+) / Population aged 15-64) × 100. Youth DR = (Pop 0-14 / Pop 15-64) × 100. Old-Age DR = (Pop 65+ / Pop 15-64) × 100.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is a good dependency ratio?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A dependency ratio below 50 is generally favorable, indicating more than 2 working-age people support each dependent. Qatar has one of the lowest at 16.8, while Niger has one of the highest at 109.5.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the youth dependency ratio?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The youth dependency ratio measures children aged 0-14 per 100 working-age people aged 15-64. The global youth dependency ratio in 2026 is approximately 37.2.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the old age dependency ratio?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The old-age dependency ratio measures people aged 65+ per 100 working-age people aged 15-64. Japan has the highest old-age dependency ratio at 52.0.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the dependency ratio of the United States?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The United States has a total dependency ratio of 53.8 in 2026, with a youth dependency ratio of 27.6 and an old-age dependency ratio of 26.2.'
        }
      },
      {
        '@type': 'Question',
        name: 'Which country has the highest dependency ratio?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Niger has the highest total dependency ratio at 109.5 in 2026. This is driven by its extremely high youth dependency ratio of 106.5 due to high fertility rates.'
        }
      },
      {
        '@type': 'Question',
        name: 'Which country has the lowest dependency ratio?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Qatar has the lowest total dependency ratio at 16.8 in 2026. This is due to its large working-age migrant population supporting a smaller dependent population.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the economically active population?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The economically active population consists of people aged 15-64 who are available for work, representing the labor force. Globally, there are approximately 5.1 billion economically active people in 2026. Countries with over 65% working-age population are in their demographic dividend window.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does dependency ratio affect the economy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'High dependency ratios increase tax burden on workers and strain social services, while low ratios create a demographic dividend opportunity for economic growth. Countries with dependency ratios below 50 can invest more in economic development rather than dependent care.'
        }
      }
    ]
  };

  const jsonLdWebApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Dependency Ratio Calculator',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'Calculate custom dependency ratios',
      'View dependency ratios for 195 countries',
      'Compare countries side by side',
      'Historical trends from 1950',
      'Interactive world map'
    ]
  };

  const jsonLdDataset = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'World Dependency Ratio Data 2026',
    description: 'Dependency ratios for 195 countries calculated from UN World Population Prospects 2024',
    creator: {
      '@type': 'Organization',
      name: 'United Nations',
      url: 'https://population.un.org/'
    },
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'JSON',
      contentUrl: 'https://populationpyramids.org/data/population/'
    },
    temporalCoverage: '1950/2026',
    spatialCoverage: {
      '@type': 'Place',
      name: 'World'
    }
  };

  const jsonLdBreadcrumb = {
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
        name: 'Dependency Ratio Calculator',
        item: 'https://populationpyramids.org/dependency-ratio-calculator'
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDataset) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {children}
    </>
  );
}