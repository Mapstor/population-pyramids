export function generateBirthStatisticsSchema(
  countryName: string,
  countrySlug: string,
  dailyBirths: number,
  annualBirths: number,
  birthRate: number,
  fertilityRate: number,
  population: number,
  year: number
) {
  const baseUrl = 'https://www.populationpyramids.org';
  
  // Main Dataset Schema for Birth Statistics
  const birthDatasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${baseUrl}/${countrySlug}#birth-statistics`,
    name: `${countryName} Birth Statistics ${year}`,
    description: `Daily births, birth rate, and fertility statistics for ${countryName}. Approximately ${dailyBirths.toLocaleString()} babies are born daily in ${countryName}.`,
    url: `${baseUrl}/${countrySlug}#birth-statistics`,
    keywords: [
      `how many babies born in ${countryName} per day`,
      `${countryName} births per day`,
      `${countryName} daily birth rate`,
      `${countryName} birth statistics ${year}`,
      `babies born in ${countryName}`,
      `${countryName} birth rate`,
      `${countryName} fertility rate`
    ],
    creator: {
      '@type': 'Organization',
      name: 'Population Pyramids',
      url: baseUrl
    },
    datePublished: new Date().toISOString().split('T')[0],
    dateModified: new Date().toISOString().split('T')[0],
    temporalCoverage: `${year}`,
    spatialCoverage: {
      '@type': 'Place',
      name: countryName
    },
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${baseUrl}/data/fertility/${countrySlug}.json`
      }
    ],
    variableMeasured: [
      {
        '@type': 'PropertyValue',
        name: 'Daily Births',
        value: dailyBirths,
        unitText: 'births per day'
      },
      {
        '@type': 'PropertyValue',
        name: 'Annual Births',
        value: annualBirths,
        unitText: 'births per year'
      },
      {
        '@type': 'PropertyValue',
        name: 'Crude Birth Rate',
        value: birthRate,
        unitText: 'per 1,000 population'
      },
      {
        '@type': 'PropertyValue',
        name: 'Total Fertility Rate',
        value: fertilityRate,
        unitText: 'children per woman'
      }
    ]
  };

  // FAQPage Schema for Birth-related Questions
  const birthFAQSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How many babies are born in ${countryName} per day?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Approximately ${dailyBirths.toLocaleString()} babies are born in ${countryName} every day. This translates to ${Math.round(dailyBirths / 24)} births per hour, or about one birth every ${Math.round(86400 / dailyBirths)} seconds. The annual total is approximately ${annualBirths.toLocaleString()} births.`
        }
      },
      {
        '@type': 'Question',
        name: `What is the birth rate in ${countryName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${countryName} has a crude birth rate of ${birthRate} per 1,000 population. The total fertility rate is ${fertilityRate} children per woman. This ${fertilityRate < 2.1 ? 'is below' : 'is above'} the replacement level of 2.1 children per woman.`
        }
      },
      {
        '@type': 'Question',
        name: `How many births per year in ${countryName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${countryName} has approximately ${annualBirths.toLocaleString()} births per year based on current birth rates. This represents ${((annualBirths / population) * 100).toFixed(2)}% of the total population.`
        }
      },
      {
        '@type': 'Question',
        name: `How often is a baby born in ${countryName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `A baby is born in ${countryName} approximately every ${Math.round(86400 / dailyBirths)} seconds. That's ${Math.round(dailyBirths / 24)} births per hour, ${dailyBirths} births per day, and ${Math.round(dailyBirths * 7)} births per week.`
        }
      }
    ]
  };

  // Statistical Data Table Schema
  const birthTableSchema = {
    '@context': 'https://schema.org',
    '@type': 'Table',
    name: `${countryName} Birth Statistics by Year`,
    description: `Historical birth statistics for ${countryName} showing births per year, daily averages, and fertility rates`,
    about: {
      '@type': 'Thing',
      name: `${countryName} birth statistics`
    }
  };

  // Speakable Schema for Voice Search
  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#birth-statistics h2', '.birth-daily-stat', '.birth-rate-stat'],
      xpath: [
        '//*[@id="birth-statistics"]//*[@class="daily-births"]',
        '//*[@id="birth-statistics"]//*[@class="birth-rate"]'
      ]
    }
  };

  // BreadcrumbList for better navigation
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: countryName,
        item: `${baseUrl}/${countrySlug}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Birth Statistics',
        item: `${baseUrl}/${countrySlug}#birth-statistics`
      }
    ]
  };

  return {
    birthDatasetSchema,
    birthFAQSchema,
    birthTableSchema,
    speakableSchema,
    breadcrumbSchema
  };
}

// Generate optimized metadata for birth statistics
export function generateBirthStatisticsMetaTags(
  countryName: string,
  dailyBirths: number,
  annualBirths: number,
  birthRate: number,
  year: number
) {
  return {
    title: `${countryName} Birth Rate ${year}: ${dailyBirths.toLocaleString()} Babies Born Daily | Population Pyramids`,
    description: `Live birth statistics for ${countryName}: ${dailyBirths.toLocaleString()} babies born daily, ${Math.round(dailyBirths / 24)} per hour. Current birth rate is ${birthRate} per 1,000. View real-time birth counter, trends, and demographic analysis.`,
    keywords: [
      `how many babies born in ${countryName} per day`,
      `${countryName} births per day`,
      `${countryName} daily birth rate`,
      `${countryName} birth statistics ${year}`,
      `babies born in ${countryName} today`,
      `${countryName} births per hour`,
      `${countryName} births per minute`,
      `${countryName} births per second`,
      `${countryName} annual births`,
      `${countryName} birth rate calculator`,
      `${countryName} fertility rate`,
      `${countryName} newborn statistics`,
      `live births ${countryName}`,
      `${countryName} maternity statistics`,
      `how often baby born ${countryName}`
    ].join(', '),
    'og:title': `${dailyBirths.toLocaleString()} Babies Born Daily in ${countryName} - Live Birth Statistics`,
    'og:description': `Real-time birth statistics: ${countryName} sees ${dailyBirths.toLocaleString()} births per day, ${Math.round(dailyBirths / 24)} per hour. Birth rate: ${birthRate} per 1,000 population.`,
    'twitter:card': 'summary_large_image',
    'twitter:title': `${countryName}: ${dailyBirths.toLocaleString()} Daily Births`,
    'twitter:description': `Live counter shows ${dailyBirths.toLocaleString()} babies born daily in ${countryName}. That's one birth every ${Math.round(86400 / dailyBirths)} seconds!`
  };
}