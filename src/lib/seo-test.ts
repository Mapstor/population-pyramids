// SEO Testing and Validation Functions
// Use this to test SEO implementation during development

export function validateSEOMetaTags() {
  const checks = {
    title: !!document.title && document.title.length <= 60,
    description: !!document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ogImage: !!document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    twitterCard: !!document.querySelector('meta[name="twitter:card"]')?.getAttribute('content'),
    structuredData: !!document.querySelector('script[type="application/ld+json"]'),
    canonicalUrl: !!document.querySelector('link[rel="canonical"]'),
    robotsTag: !!document.querySelector('meta[name="robots"]'),
  };

  return checks;
}

export function getSEOScore() {
  const checks = validateSEOMetaTags();
  const passedChecks = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;
  
  return {
    score: Math.round((passedChecks / totalChecks) * 100),
    passed: passedChecks,
    total: totalChecks,
    details: checks,
  };
}

// SEO Best Practices Checklist
export const SEO_CHECKLIST = {
  technical: [
    '✅ JSON-LD structured data implemented',
    '✅ Open Graph tags for social sharing',
    '✅ Twitter Card meta tags',
    '✅ Proper title tag optimization',
    '✅ Meta descriptions under 160 characters',
    '✅ Sitemap.xml generated dynamically',
    '✅ Robots.txt with proper directives',
    '✅ Favicon and app icons',
    '✅ Mobile-responsive design',
    '✅ Fast loading performance',
  ],
  content: [
    '✅ Keyword-optimized page titles',
    '✅ Descriptive heading structure (H1, H2, H3)',
    '✅ Alt text for images',
    '✅ Internal linking structure',
    '✅ Content covers user search intent',
    '✅ Unique content for each page',
    '✅ Proper URL structure',
    '✅ Breadcrumb navigation',
  ],
  social: [
    '✅ Open Graph image (1200x630)',
    '✅ Social media meta tags',
    '✅ Brand consistency across platforms',
    '✅ Engaging social descriptions',
  ],
}