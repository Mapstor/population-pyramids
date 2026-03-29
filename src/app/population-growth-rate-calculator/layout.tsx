import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Population Growth Rate Calculator & Rankings 2026',
  description: 'Calculate population growth rate and doubling time for any country. See 195 countries ranked by growth rate with real UN data, historical charts, and projections.',
  openGraph: {
    title: 'Population Growth Rate Calculator & Rankings 2026',
    description: 'Calculate population growth rate and doubling time for any country. See 195 countries ranked by growth rate with real UN data, historical charts, and projections.',
    url: 'https://populationpyramids.org/population-growth-rate-calculator',
    siteName: 'Population Pyramids',
    images: [
      {
        url: 'https://populationpyramids.org/og-image.png',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Population Growth Rate Calculator & Rankings 2026',
    description: 'Calculate population growth rate and doubling time for any country. See 195 countries ranked by growth rate with real UN data.',
    images: ['https://populationpyramids.org/og-image.png'],
  },
  alternates: {
    canonical: 'https://populationpyramids.org/population-growth-rate-calculator',
  }
};

export default function PopulationGrowthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the population growth rate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Population growth rate measures the annual percentage change in a population's size, combining natural increase (births minus deaths) and net migration. The current world population growth rate is approximately 0.9% per year."
        }
      },
      {
        "@type": "Question",
        "name": "What is the population growth rate formula?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The formula is: Annual Growth Rate = ((Ending Population / Starting Population)^(1/Years) - 1) × 100. For example, growth from 100 to 150 over 10 years equals ((150/100)^(1/10) - 1) × 100 = 4.14% annually."
        }
      },
      {
        "@type": "Question",
        "name": "What is the US population growth rate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The United States population grows at approximately 0.4% annually. This moderate growth stems primarily from immigration rather than natural increase."
        }
      },
      {
        "@type": "Question",
        "name": "What is the world population growth rate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The world population grows at approximately 0.9% annually, adding about 70 million people each year. This rate has declined from a peak of 2.1% around 1968."
        }
      },
      {
        "@type": "Question",
        "name": "Which countries have the fastest growing populations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Niger, Chad, and Mali lead global population growth with rates exceeding 3% annually. Most fast-growing nations concentrate in sub-Saharan Africa and the Middle East."
        }
      },
      {
        "@type": "Question",
        "name": "Which countries have shrinking populations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Over 20 countries currently experience population decline, led by Eastern European nations and Japan. Low fertility, aging, and emigration drive these demographic contractions."
        }
      },
      {
        "@type": "Question",
        "name": "What is population doubling time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Population doubling time estimates how long a population takes to double at its current growth rate, calculated as 70 divided by the annual growth percentage. A 2% growth rate yields 35-year doubling."
        }
      },
      {
        "@type": "Question",
        "name": "What will the world population be in 2050?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Based on current trends, world population will likely reach 9.7-10 billion by 2050. This projection assumes continued fertility decline in developing nations."
        }
      },
      {
        "@type": "Question",
        "name": "Is world population growth slowing down?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, world population growth has decelerated from 2.1% (1968) to 0.9% today. Declining fertility rates drive this slowdown as countries develop economically."
        }
      },
      {
        "@type": "Question",
        "name": "What is the population growth rate of China?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "China's population growth rate is near zero or slightly negative. Rapid aging and low fertility suggest imminent population decline."
        }
      },
      {
        "@type": "Question",
        "name": "What is the population growth rate of India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "India's population grows at approximately 0.8% annually. This growth helped India surpass China as the world's most populous country."
        }
      },
      {
        "@type": "Question",
        "name": "What is natural population increase?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Natural population increase equals births minus deaths in a given period, excluding migration effects. Most global population growth stems from natural increase rather than migration."
        }
      }
    ]
  };

  const jsonLdWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Population Growth Rate Calculator",
    "url": "https://populationpyramids.org/population-growth-rate-calculator",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "description": "Calculate population growth rates and doubling time for any country using real UN data"
  };

  const jsonLdDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "World Population Growth Rates by Country",
    "description": "Population growth rates for 195 countries from 1950 to 2025",
    "creator": {
      "@type": "Organization",
      "name": "United Nations Department of Economic and Social Affairs",
      "url": "https://population.un.org/"
    },
    "distribution": {
      "@type": "DataDownload",
      "encodingFormat": "application/json",
      "contentUrl": "https://population.un.org/wpp/"
    },
    "temporalCoverage": "1950/2025",
    "spatialCoverage": {
      "@type": "Place",
      "name": "World"
    }
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://populationpyramids.org"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Population Growth Rate Calculator",
        "item": "https://populationpyramids.org/population-growth-rate-calculator"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
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