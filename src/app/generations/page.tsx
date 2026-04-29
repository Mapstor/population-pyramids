import type { Metadata } from 'next';
import { GenerationsHeader } from '@/components/generations/GenerationsHeader';
import { GenerationsCalculator } from '@/components/generations/GenerationsCalculator';
import { GenerationsTable } from '@/components/generations/GenerationsTable';
import { GenerationsChart } from '@/components/generations/GenerationsChart';
import { GenerationsCountrySelector } from '@/components/generations/GenerationsCountrySelector';
import { GenerationsContext } from '@/components/generations/GenerationsContext';
import { 
  getWorldGenerationData, 
  getAllCountries 
} from '@/lib/generation-data-loader';

export const metadata: Metadata = {
  title: 'Generation Age Ranges 2026: Gen Z, Millennial, Gen X, Boomer Calculator',
  description: 'What generation am I? Enter your birth year to find out. See 2026 age ranges and real population data for Gen Z (14-29), Millennials (30-45), Gen X (46-61), Baby Boomers (62-80), Gen Alpha (0-13).',
  keywords: 'generation calculator, gen z age, millennial age, boomer age, gen x age, generation age ranges 2026, what generation am i, gen alpha age, silent generation age',
  openGraph: {
    title: 'Generation Age Ranges Calculator 2026 | Population Pyramids',
    description: 'Find out what generation you belong to. Current age ranges and population data for all generations worldwide.',
    type: 'website',
    url: 'https://www.populationpyramids.org/generations',
    images: [{
      url: 'https://www.populationpyramids.org/og-generations.png',
      width: 1200,
      height: 630,
      alt: 'Generation Age Ranges 2026'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generation Calculator 2026: What Generation Am I?',
    description: 'Gen Z (14-29), Millennials (30-45), Gen X (46-61), Boomers (62-80). Find your generation and see global population data.',
  },
  alternates: {
    canonical: 'https://www.populationpyramids.org/generations'
  }
};

// Generate structured data for SEO
function generateStructuredData(worldGenerations: any[]) {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Generation Calculator 2026",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Calculate your generation from birth year",
        "View global generation populations",
        "Compare generation sizes by country",
        "See age ranges for all generations in 2026"
      ],
      "screenshot": "https://www.populationpyramids.org/screenshots/generation-calculator.png"
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": "https://www.populationpyramids.org/generations#dataset",
      "name": "World Generation Populations 2026",
      "description": "Global population distribution by generation (Gen Alpha, Gen Z, Millennials, Gen X, Baby Boomers, Silent Generation)",
      "creator": {
        "@type": "Organization",
        "name": "Population Pyramids",
        "url": "https://www.populationpyramids.org"
      },
      "temporalCoverage": "2026",
      "spatialCoverage": {
        "@type": "Place",
        "name": "World",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "0",
          "longitude": "0"
        }
      },
      "variableMeasured": worldGenerations.map(gen => ({
        "@type": "PropertyValue",
        "name": `${gen.generation.name} Population`,
        "value": gen.population,
        "unitText": "people",
        "description": `Population aged ${gen.ageRange} years (born ${gen.generation.birthYearStart}-${gen.generation.birthYearEnd})`
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
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What generation am I if I was born in 1990?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "If you were born in 1990, you are a Millennial (Generation Y). Millennials were born between 1981-1996 and are 30-45 years old in 2026."
          }
        },
        {
          "@type": "Question",
          "name": "What are the generation age ranges in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "In 2026: Gen Alpha (0-13), Gen Z (14-29), Millennials (30-45), Gen X (46-61), Baby Boomers (62-80), Silent Generation (81-98), Greatest Generation (99+)."
          }
        },
        {
          "@type": "Question",
          "name": "What is the Gen Z age range?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Gen Z is 14-29 years old in 2026, born between 1997-2012. The oldest Gen Z are 29 and the youngest are 14."
          }
        },
        {
          "@type": "Question",
          "name": "Is 1996 a Millennial or Gen Z?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "1996 is the last year of Millennials. Anyone born in 1997 or later is Gen Z. The 1996/1997 boundary separates Millennials from Gen Z."
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
        }
      ]
    }
  ];

  return schemas;
}

export default async function GenerationsWorldPage() {
  const worldGenerations = await getWorldGenerationData();
  const countries = await getAllCountries();
  
  const structuredData = generateStructuredData(worldGenerations);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <GenerationsHeader countryName="World" isWorld={true} />
          
          {/* Calculator - Client Component */}
          <GenerationsCalculator worldGenerations={worldGenerations} />
          
          {/* Chart - Client Component */}
          <GenerationsChart generationData={worldGenerations} countryName="World" />
          
          {/* Table - Server Component */}
          <GenerationsTable generationData={worldGenerations} countryName="World" />
          
          {/* Country Selector - Server Component */}
          <GenerationsCountrySelector countries={countries} currentCountry="world" />
          
          {/* Context Content - Server Component */}
          <GenerationsContext worldGenerations={worldGenerations} />
        </div>
      </div>
    </>
  );
}