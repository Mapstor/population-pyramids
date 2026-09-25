import { promises as fs } from 'fs';
import path from 'path';

interface Country {
  code: string;
  name: string;
  slug: string;
  region: string;
  population2024: number;
  flag: string;
}

interface SitemapUrl {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: string;
}

async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...');
  
  // Canonical host is www (see src/lib/site-meta.ts SITE_URL). This standalone
  // script can't import the TS module via ts-node path aliases, so the value is
  // mirrored here. NOTE: the live sitemap is served by src/app/sitemap.ts, not
  // this legacy generator.
  const baseUrl = 'https://www.populationpyramids.org';
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Load countries data
  const countriesPath = path.join(process.cwd(), 'src/data/countries.json');
  const countriesData = await fs.readFile(countriesPath, 'utf-8');
  const countries: Country[] = JSON.parse(countriesData);
  
  console.log(`📊 Found ${countries.length} countries`);
  
  const urls: SitemapUrl[] = [];
  
  // 1. Static pages
  const staticPages = [
    { path: '', priority: '1.0', changeFreq: 'weekly' },
    { path: '/about', priority: '0.8', changeFreq: 'monthly' },
    { path: '/compare', priority: '0.9', changeFreq: 'weekly' },
    { path: '/contact', priority: '0.6', changeFreq: 'monthly' },
    { path: '/privacy', priority: '0.3', changeFreq: 'yearly' },
    { path: '/terms', priority: '0.3', changeFreq: 'yearly' },
    { path: '/search', priority: '0.7', changeFreq: 'weekly' }
  ];
  
  staticPages.forEach(page => {
    urls.push({
      url: `${baseUrl}${page.path}`,
      lastModified: currentDate,
      changeFrequency: page.changeFreq,
      priority: page.priority
    });
  });
  
  console.log(`✅ Added ${staticPages.length} static pages`);
  
  // 2. Country pages (latest year) - 195 pages
  countries.forEach(country => {
    urls.push({
      url: `${baseUrl}/${country.slug}-population-pyramid`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: '0.8'
    });
  });
  
  console.log(`✅ Added ${countries.length} country pages`);
  
  // 3. Country + Year pages (195 countries × 55 years) - 10,725 pages
  const years: number[] = [];
  for (let year = 1970; year <= 2024; year++) {
    years.push(year);
  }
  
  let yearPagesCount = 0;
  countries.forEach(country => {
    years.forEach(year => {
      urls.push({
        url: `${baseUrl}/${country.slug}-population-pyramid/${year}`,
        lastModified: currentDate,
        changeFrequency: year === 2024 ? 'monthly' : 'yearly',
        priority: year === 2024 ? '0.7' : year >= 2020 ? '0.6' : '0.5'
      });
      yearPagesCount++;
    });
  });
  
  console.log(`✅ Added ${yearPagesCount} country-year pages`);
  
  // 4. Generate XML sitemap
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const sitemapStart = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const sitemapEnd = '</urlset>';
  
  let xmlContent = xmlHeader + sitemapStart;
  
  urls.forEach(urlData => {
    xmlContent += '  <url>\n';
    xmlContent += `    <loc>${urlData.url}</loc>\n`;
    xmlContent += `    <lastmod>${urlData.lastModified}</lastmod>\n`;
    xmlContent += `    <changefreq>${urlData.changeFrequency}</changefreq>\n`;
    xmlContent += `    <priority>${urlData.priority}</priority>\n`;
    xmlContent += '  </url>\n';
  });
  
  xmlContent += sitemapEnd;
  
  // 5. Write sitemap to public directory
  const sitemapPath = path.join(process.cwd(), 'public/sitemap.xml');
  await fs.writeFile(sitemapPath, xmlContent, 'utf-8');
  
  console.log(`🎯 Generated sitemap with ${urls.length} URLs`);
  console.log(`📄 Sitemap saved to: ${sitemapPath}`);
  
  // 6. Generate sitemap index for large sitemaps (optional)
  if (urls.length > 50000) {
    console.log('⚠️  Large sitemap detected. Consider splitting into multiple sitemaps.');
  }
  
  // 7. Summary
  console.log('\n📊 SITEMAP SUMMARY:');
  console.log(`• Static pages: ${staticPages.length}`);
  console.log(`• Country pages: ${countries.length}`);
  console.log(`• Country-year pages: ${yearPagesCount}`);
  console.log(`• Total URLs: ${urls.length}`);
  console.log(`• File size: ${(xmlContent.length / 1024 / 1024).toFixed(2)} MB`);
  
  console.log('\n✅ Sitemap generation complete!');
  console.log('🚀 Ready for Google Search Console submission');
  
  return {
    totalUrls: urls.length,
    filePath: sitemapPath,
    fileSize: xmlContent.length
  };
}

// Run the script
generateSitemap()
  .then(result => {
    console.log('\n🎉 Success!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  });

export default generateSitemap;