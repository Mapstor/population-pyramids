export interface BlogSEOProps {
  title: string;
  description: string;
  keywords: string;
  author?: string;
  publishedDate: string;
  modifiedDate?: string;
  category: string;
  imageUrl?: string;
  articleBody?: string;
  readingTime: string;
  slug: string;
}

export function generateBlogMetadata({
  title,
  description,
  keywords,
  author = "Population Pyramids Research Team",
  publishedDate,
  modifiedDate,
  category,
  imageUrl = "/og-image.png",
  slug
}: BlogSEOProps) {
  const url = `https://populationpyramids.org/blog/${slug}`;
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://populationpyramids.org${imageUrl}`;
  
  return {
    title: `${title} | Population Pyramids`,
    description,
    keywords,
    authors: [{ name: author }],
    openGraph: {
      title,
      description,
      url,
      siteName: 'Population Pyramids',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedDate,
      modifiedTime: modifiedDate || publishedDate,
      authors: [author],
      section: category,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
      site: '@populationpyramids',
      creator: '@populationpyramids',
    },
    alternates: {
      canonical: url,
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
    category,
  };
}

export function generateBlogSchema({
  title,
  description,
  keywords,
  author = "Population Pyramids Research Team",
  publishedDate,
  modifiedDate,
  category,
  imageUrl = "/og-image.png",
  articleBody = "",
  readingTime,
  slug
}: BlogSEOProps) {
  const url = `https://populationpyramids.org/blog/${slug}`;
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://populationpyramids.org${imageUrl}`;
  
  const schemaArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "keywords": keywords,
    "author": {
      "@type": "Organization",
      "name": author,
      "url": "https://populationpyramids.org"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Population Pyramids",
      "logo": {
        "@type": "ImageObject",
        "url": "https://populationpyramids.org/icon.svg"
      }
    },
    "datePublished": publishedDate,
    "dateModified": modifiedDate || publishedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "image": {
      "@type": "ImageObject",
      "url": fullImageUrl,
      "width": 1200,
      "height": 630
    },
    "articleSection": category,
    "articleBody": articleBody.substring(0, 5000),
    "wordCount": articleBody.split(' ').length,
    "timeRequired": `PT${readingTime}`,
    "inLanguage": "en-US",
    "copyrightHolder": {
      "@type": "Organization",
      "name": "Population Pyramids"
    },
    "copyrightYear": new Date().getFullYear(),
    "isAccessibleForFree": true,
    "isPartOf": {
      "@type": "Blog",
      "name": "Population Pyramids Blog",
      "url": "https://populationpyramids.org/blog"
    }
  };

  const schemaBreadcrumb = {
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
        "name": "Blog",
        "item": "https://populationpyramids.org/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": url
      }
    ]
  };

  const schemaFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What are the key insights about ${title.toLowerCase().replace(/[^a-z0-9\s]/g, '')}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": description
        }
      },
      {
        "@type": "Question", 
        "name": "What data sources are used for this demographic analysis?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All demographic data is sourced from the UN World Population Prospects 2024 revision, the most authoritative and up-to-date global demographic dataset available."
        }
      },
      {
        "@type": "Question",
        "name": "How often is this demographic data updated?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "The UN updates the World Population Prospects every two years. We update our analysis and articles as soon as new data becomes available to ensure accuracy."
        }
      }
    ]
  };

  return {
    article: schemaArticle,
    breadcrumb: schemaBreadcrumb,
    faq: schemaFAQ
  };
}