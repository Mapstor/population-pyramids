import type { YearData, CountryData } from '@/types/population';
import { calculateMetrics } from '@/lib/calculations';

interface FertilityData {
  fertilityData: {
    current: {
      year: number;
      totalFertilityRate: number;
      crudebirthRate?: number;
    };
    historical: Array<{
      year: number;
      totalFertilityRate: number;
      crudebirthRate?: number;
    }>;
  };
}

export function generatePopulationDatasetSchema(
  countryName: string,
  countrySlug: string,
  yearData: YearData,
  countryData: CountryData,
  year: number,
  fertilityData?: FertilityData | null
) {
  const baseUrl = 'https://populationpyramids.org';
  const metrics = calculateMetrics(yearData);
  
  // Calculate additional metrics
  const birthRate = fertilityData?.fertilityData?.historical?.find(d => d.year === year)?.crudebirthRate || 
                   fertilityData?.fertilityData?.historical[fertilityData.fertilityData.historical.length - 1]?.crudebirthRate || 0;
  const fertilityRate = fertilityData?.fertilityData?.current?.totalFertilityRate || 0;
  const sexRatio = metrics.sexRatio;
  
  // Get country description from meta tags or generate one
  const description = `Comprehensive demographic dataset for ${countryName} including population structure, age distribution, sex ratios, and demographic trends. Based on UN World Population Prospects ${year} data with detailed population pyramid visualization and statistics.`;

  // Main Dataset Schema
  const populationDatasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${baseUrl}/${countrySlug}#dataset`,
    name: `${countryName} Population Demographics ${year}`,
    description: description,
    url: `${baseUrl}/${countrySlug}`,
    creator: {
      '@type': 'Organization',
      name: 'PopulationPyramids.org',
      url: baseUrl,
      description: 'Interactive population pyramid visualization platform using UN World Population Prospects data'
    },
    publisher: {
      '@type': 'Organization',
      name: 'PopulationPyramids.org',
      url: baseUrl
    },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    temporalCoverage: '1950/2025',
    spatialCoverage: {
      '@type': 'Place',
      name: countryName,
      geo: {
        '@type': 'GeoShape',
        name: countryName
      }
    },
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'text/html',
      contentUrl: `${baseUrl}/${countrySlug}`,
      description: `Interactive population pyramid and demographic visualization for ${countryName}`
    },
    variableMeasured: [
      {
        '@type': 'PropertyValue',
        name: 'Population',
        value: yearData.totalPopulation,
        unitText: 'people',
        description: `Total population of ${countryName} in ${year}`
      },
      {
        '@type': 'PropertyValue',
        name: 'Median Age',
        value: yearData.medianAge,
        unitText: 'years',
        description: 'Median age of the population, indicating demographic maturity'
      },
      {
        '@type': 'PropertyValue',
        name: 'Sex Ratio',
        value: sexRatio,
        unitText: 'males per 100 females',
        description: 'Ratio of males to females in the population'
      },
      ...(birthRate > 0 ? [{
        '@type': 'PropertyValue',
        name: 'Birth Rate',
        value: birthRate,
        unitText: 'per 1,000 population',
        description: 'Crude birth rate indicating birth frequency'
      }] : []),
      ...(fertilityRate > 0 ? [{
        '@type': 'PropertyValue',
        name: 'Fertility Rate',
        value: fertilityRate,
        unitText: 'children per woman',
        description: 'Total fertility rate indicating reproductive patterns'
      }] : []),
      {
        '@type': 'PropertyValue',
        name: 'Youth Population',
        value: metrics.youthPercentage,
        unitText: 'percent',
        description: 'Percentage of population aged 0-14 years'
      },
      {
        '@type': 'PropertyValue',
        name: 'Working Age Population',
        value: metrics.workingAgePercentage,
        unitText: 'percent',
        description: 'Percentage of population aged 15-64 years'
      },
      {
        '@type': 'PropertyValue',
        name: 'Elderly Population',
        value: metrics.elderlyPercentage,
        unitText: 'percent',
        description: 'Percentage of population aged 65+ years'
      },
      {
        '@type': 'PropertyValue',
        name: 'Dependency Ratio',
        value: metrics.dependencyRatio,
        unitText: 'percent',
        description: 'Total dependency ratio measuring economic burden'
      },
      {
        '@type': 'PropertyValue',
        name: 'Population Pyramid Type',
        value: metrics.pyramidType,
        unitText: 'categorical',
        description: `Population structure type: ${metrics.pyramidType}`
      }
    ],
    keywords: [
      `${countryName} population`,
      `${countryName} demographics`,
      `${countryName} population pyramid`,
      `${countryName} age structure`,
      `${countryName} median age`,
      `${countryName} sex ratio`,
      `${countryName} birth rate`,
      `${countryName} fertility rate`,
      `${countryName} population ${year}`,
      'demographic transition',
      'population statistics',
      'UN population data',
      'population visualization'
    ],
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    version: year.toString(),
    isBasedOn: {
      '@type': 'Dataset',
      name: 'UN World Population Prospects 2024 Revision',
      creator: {
        '@type': 'Organization',
        name: 'United Nations Department of Economic and Social Affairs, Population Division',
        url: 'https://population.un.org/wpp/'
      }
    },
    citation: `PopulationPyramids.org. (${new Date().getFullYear()}). ${countryName} Population Demographics ${year}. Retrieved from ${baseUrl}/${countrySlug}`,
    about: [
      {
        '@type': 'Thing',
        name: `${countryName} population structure`,
        description: 'Age and sex distribution of the population'
      },
      {
        '@type': 'Thing', 
        name: 'Demographic transition',
        description: 'Changes in population structure over time'
      },
      {
        '@type': 'Thing',
        name: 'Population pyramid',
        description: 'Graphical representation of age and sex distribution'
      }
    ],
    hasPart: [
      {
        '@type': 'Dataset',
        name: `${countryName} Age Structure Data`,
        description: 'Population counts by age group and sex',
        variableMeasured: yearData.ageGroups.map(group => ({
          '@type': 'PropertyValue',
          name: `Age Group ${group.ageGroup}`,
          value: group.total,
          unitText: 'people'
        }))
      },
      {
        '@type': 'Dataset',
        name: `${countryName} Historical Demographics`,
        description: 'Population trends from 1950-2025',
        temporalCoverage: '1950/2025'
      }
    ]
  };

  return populationDatasetSchema;
}

// Generate minimal schema for faster loading
export function generateMinimalDatasetSchema(
  countryName: string,
  countrySlug: string,
  population: number,
  medianAge: number,
  year: number
) {
  const baseUrl = 'https://populationpyramids.org';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${countryName} Population Demographics ${year}`,
    description: `Population data for ${countryName} including ${population.toLocaleString()} people with median age ${medianAge.toFixed(1)} years.`,
    url: `${baseUrl}/${countrySlug}`,
    creator: {
      '@type': 'Organization',
      name: 'PopulationPyramids.org'
    },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    temporalCoverage: '1950/2025',
    spatialCoverage: {
      '@type': 'Place',
      name: countryName
    }
  };
}

export interface PopulationSchemaOptions {
  includeDetailed?: boolean;
  includeBreadcrumbs?: boolean;
  includeWebApplication?: boolean;
}

// Generate complete schema package for country pages
export function generateCountrySchemaPackage(
  countryName: string,
  countrySlug: string,
  yearData: YearData,
  countryData: CountryData,
  year: number,
  fertilityData?: FertilityData | null,
  options: PopulationSchemaOptions = {}
) {
  const { includeDetailed = true, includeBreadcrumbs = true, includeWebApplication = true } = options;
  const baseUrl = 'https://populationpyramids.org';
  
  const schemas: any[] = [];

  // Main dataset schema
  if (includeDetailed) {
    schemas.push(generatePopulationDatasetSchema(
      countryName, countrySlug, yearData, countryData, year, fertilityData
    ));
  } else {
    schemas.push(generateMinimalDatasetSchema(
      countryName, countrySlug, yearData.totalPopulation, yearData.medianAge, year
    ));
  }

  // Breadcrumb schema
  if (includeBreadcrumbs) {
    schemas.push({
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
        }
      ]
    });
  }

  // Web application schema
  if (includeWebApplication) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: `${countryName} Population Pyramid Visualizer`,
      description: `Interactive population pyramid and demographic analysis tool for ${countryName}`,
      url: `${baseUrl}/${countrySlug}`,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      featureList: [
        'Interactive population pyramid',
        'Age structure analysis', 
        'Demographic metrics',
        'Historical trends',
        'Comparative analysis'
      ]
    });
  }

  return schemas;
}