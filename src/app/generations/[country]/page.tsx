import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GenerationsHeader } from '@/components/generations/GenerationsHeader';
import { GenerationsCalculator } from '@/components/generations/GenerationsCalculator';
import { GenerationsTable } from '@/components/generations/GenerationsTable';
import { GenerationsChart } from '@/components/generations/GenerationsChart';
import { GenerationsCountrySelector } from '@/components/generations/GenerationsCountrySelector';
import { GenerationsContext } from '@/components/generations/GenerationsContext';
import { 
  getCountryGenerationData, 
  getWorldGenerationData,
  getAllCountries,
  getCountryBySlug 
} from '@/lib/generation-data-loader';
import type { GenerationPopulation } from '@/lib/generation-utils';

interface PageProps {
  params: { country: string };
}

// Generate all country pages at build time
export async function generateStaticParams() {
  const countries = await getAllCountries();
  return countries.map((country) => ({
    country: country.slug
  }));
}

// Generate metadata for each country page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const country = await getCountryBySlug(params.country);
  if (!country) return {};
  
  // Get generation data for description
  const countryGenerations = await getCountryGenerationData(params.country);
  const largestGen = countryGenerations.length > 0 
    ? countryGenerations.reduce((prev, current) => 
        prev.population > current.population ? prev : current
      )
    : null;
  
  return {
    title: `${country.name} Generation Breakdown 2026: How Many Millennials, Gen Z, and Boomers?`,
    description: `${country.name} has ${largestGen ? `${largestGen.generation.name} as its largest generation (${largestGen.percentOfTotal.toFixed(1)}%). ` : ''}See complete generation breakdown with population data for Gen Z, Millennials, Gen X, Baby Boomers, and Gen Alpha in ${country.name}.`,
    keywords: `${country.name} generations, ${country.name} millennials, ${country.name} gen z, ${country.name} boomers, ${country.name} gen x, ${country.name} generation breakdown, ${country.name} age demographics`,
    openGraph: {
      title: `${country.name} Generation Breakdown 2026 | Population Pyramids`,
      description: `Generation population distribution in ${country.name}. See how many Millennials, Gen Z, and Boomers live in ${country.name}.`,
      type: 'article',
      url: `https://www.populationpyramids.org/generations/${params.country}`,
      images: [{
        url: `https://www.populationpyramids.org/og-generations-${params.country}.png`,
        width: 1200,
        height: 630,
        alt: `${country.name} Generation Breakdown`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${country.name} Generations: Population by Age Group`,
      description: largestGen 
        ? `${largestGen.generation.name} is the largest generation in ${country.name} at ${largestGen.percentOfTotal.toFixed(1)}% of population.`
        : `Generation breakdown for ${country.name} with current UN population data.`
    },
    alternates: {
      canonical: `https://www.populationpyramids.org/generations/${params.country}`
    }
  };
}

// Generate structured data for country-specific page
function generateStructuredData(
  country: any, 
  countryGenerations: GenerationPopulation[],
  worldGenerations: GenerationPopulation[]
) {
  const totalPop = countryGenerations.reduce((sum, gen) => sum + gen.population, 0);
  const largestGen = countryGenerations.length > 0 
    ? countryGenerations.reduce((prev, current) => 
        prev.population > current.population ? prev : current
      )
    : null;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": `https://www.populationpyramids.org/generations/${country.slug}#dataset`,
      "name": `${country.name} Generation Populations 2026`,
      "description": `Generation population distribution in ${country.name} including Gen Alpha, Gen Z, Millennials, Gen X, Baby Boomers, and Silent Generation`,
      "creator": {
        "@type": "Organization",
        "name": "Population Pyramids",
        "url": "https://www.populationpyramids.org"
      },
      "temporalCoverage": "2026",
      "spatialCoverage": {
        "@type": "Place",
        "name": country.name
      },
      "variableMeasured": countryGenerations.map(gen => ({
        "@type": "PropertyValue",
        "name": `${gen.generation.name} Population in ${country.name}`,
        "value": gen.population,
        "unitText": "people",
        "description": `${gen.percentOfTotal.toFixed(1)}% of ${country.name}'s population`
      })),
      "license": "https://creativecommons.org/licenses/by/4.0/",
      "isBasedOn": {
        "@type": "Dataset",
        "name": "UN World Population Prospects 2024",
        "creator": "United Nations Population Division"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `${country.name} Generations by Population Size`,
      "itemListOrder": "Descending",
      "numberOfItems": countryGenerations.length,
      "itemListElement": countryGenerations
        .sort((a, b) => b.population - a.population)
        .map((gen, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": gen.generation.name,
          "description": `${gen.population.toLocaleString()} people (${gen.percentOfTotal.toFixed(1)}% of ${country.name}'s population, ages ${gen.ageRange} in 2026)`
        }))
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `What is the largest generation in ${country.name}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": largestGen 
              ? `${largestGen.generation.name} is the largest generation in ${country.name} with ${largestGen.population.toLocaleString()} people, representing ${largestGen.percentOfTotal.toFixed(1)}% of the population.`
              : `Generation data is being calculated for ${country.name}.`
          }
        },
        {
          "@type": "Question",
          "name": `How many Millennials are in ${country.name}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": (() => {
              const millennials = countryGenerations.find(g => g.generation.id === 'millennials');
              return millennials 
                ? `There are ${millennials.population.toLocaleString()} Millennials in ${country.name}, representing ${millennials.percentOfTotal.toFixed(1)}% of the population. They are aged ${millennials.ageRange} years in 2026.`
                : `Millennial population data for ${country.name} is being processed.`;
            })()
          }
        },
        {
          "@type": "Question",
          "name": `How many Gen Z are in ${country.name}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": (() => {
              const genZ = countryGenerations.find(g => g.generation.id === 'gen-z');
              return genZ 
                ? `There are ${genZ.population.toLocaleString()} Gen Z members in ${country.name}, representing ${genZ.percentOfTotal.toFixed(1)}% of the population. They are aged ${genZ.ageRange} years in 2026.`
                : `Gen Z population data for ${country.name} is being processed.`;
            })()
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.populationpyramids.org"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Generation Calculator",
          "item": "https://www.populationpyramids.org/generations"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": country.name,
          "item": `https://www.populationpyramids.org/generations/${country.slug}`
        }
      ]
    }
  ];

  return schemas;
}

export default async function GenerationsCountryPage({ params }: PageProps) {
  const country = await getCountryBySlug(params.country);
  if (!country) {
    notFound();
  }
  
  const countryGenerations = await getCountryGenerationData(params.country);
  const worldGenerations = await getWorldGenerationData(); // For calculator
  const countries = await getAllCountries();
  
  const structuredData = generateStructuredData(country, countryGenerations, worldGenerations);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <GenerationsHeader 
            countryName={country.name} 
            isWorld={false} 
            countrySlug={params.country}
          />
          
          {/* Calculator always uses world data */}
          <GenerationsCalculator worldGenerations={worldGenerations} />
          
          {/* Chart shows country-specific data */}
          <GenerationsChart 
            generationData={countryGenerations} 
            countryName={country.name} 
          />
          
          {/* Table shows country-specific data */}
          <GenerationsTable 
            generationData={countryGenerations} 
            countryName={country.name} 
          />
          
          {/* Country Selector with current country highlighted */}
          <GenerationsCountrySelector 
            countries={countries} 
            currentCountry={params.country} 
          />
          
          {/* Context content always shows world data */}
          <GenerationsContext worldGenerations={worldGenerations} />
        </div>
      </div>
    </>
  );
}