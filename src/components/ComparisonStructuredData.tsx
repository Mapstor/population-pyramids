export default function ComparisonStructuredData({
  country1Name,
  country2Name,
  country1Pop,
  country2Pop,
  comparison,
  year = 2025
}: {
  country1Name: string;
  country2Name: string;
  country1Pop: number;
  country2Pop: number;
  comparison: string;
  year?: number;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": `${country1Name} vs ${country2Name}: Population Comparison ${year}`,
        "description": `Compare population pyramids and demographics of ${country1Name} and ${country2Name}. Detailed analysis including age structure, sex ratio, and growth trends with ${year} UN data.`,
        "image": {
          "@type": "ImageObject",
          "url": `/api/og/comparison?country1=${comparison.split('-vs-')[0]}&country2=${comparison.split('-vs-')[1]}`,
          "width": 1200,
          "height": 630
        },
        "datePublished": "2024-01-01",
        "dateModified": new Date().toISOString(),
        "author": {
          "@type": "Organization",
          "name": "Population Pyramids",
          "url": "https://populationpyramids.net"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Population Pyramids",
          "logo": {
            "@type": "ImageObject",
            "url": "https://populationpyramids.net/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://populationpyramids.net/compare/${comparison}`
        }
      },
      {
        "@type": "Dataset",
        "name": `${country1Name} vs ${country2Name} Population Data ${year}`,
        "description": `Population comparison data for ${country1Name} and ${country2Name} including age distribution, sex ratios, and demographic metrics`,
        "creator": {
          "@type": "Organization",
          "name": "United Nations",
          "url": "https://www.un.org"
        },
        "distribution": {
          "@type": "DataDownload",
          "encodingFormat": "application/json",
          "contentUrl": `https://populationpyramids.net/api/data/${comparison}`
        },
        "temporalCoverage": `${year}`,
        "spatialCoverage": [
          {
            "@type": "Place",
            "name": country1Name,
            "geo": {
              "@type": "GeoShape",
              "name": country1Name
            }
          },
          {
            "@type": "Place",
            "name": country2Name,
            "geo": {
              "@type": "GeoShape",
              "name": country2Name
            }
          }
        ],
        "variableMeasured": [
          {
            "@type": "PropertyValue",
            "name": `${country1Name} Population`,
            "value": country1Pop,
            "unitText": "people"
          },
          {
            "@type": "PropertyValue",
            "name": `${country2Name} Population`,
            "value": country2Pop,
            "unitText": "people"
          },
          {
            "@type": "PropertyValue",
            "name": "Population Difference",
            "value": Math.abs(country1Pop - country2Pop),
            "unitText": "people"
          }
        ]
      },
      {
        "@type": "WebApplication",
        "name": "Population Pyramid Comparison Tool",
        "description": `Interactive tool to compare population pyramids of ${country1Name} and ${country2Name}`,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Side-by-side population pyramids",
          "Animated timeline comparison",
          "Demographic metrics analysis",
          "Sex ratio comparison",
          "Age structure visualization"
        ],
        "screenshot": {
          "@type": "ImageObject",
          "url": `/api/og/comparison?country1=${comparison.split('-vs-')[0]}&country2=${comparison.split('-vs-')[1]}`,
          "caption": `${country1Name} vs ${country2Name} Population Pyramids`
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://populationpyramids.net"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Compare",
            "item": "https://populationpyramids.net/compare"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${country1Name} vs ${country2Name}`,
            "item": `https://populationpyramids.net/compare/${comparison}`
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}