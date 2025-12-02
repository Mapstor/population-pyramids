const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Import countries list
const countries = require('../src/data/countries.json');

async function generatePyramidImages(browser, countrySlug, countryName) {
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, '..', 'public', 'images', 'pyramids');
    await fs.mkdir(outputDir, { recursive: true });

    // Generate different formats
    const formats = [
      { name: 'og', width: 1200, height: 630, ext: 'png' },
      { name: 'square', width: 1200, height: 1200, ext: 'png' },
      { name: '16x9', width: 1200, height: 675, ext: 'jpg' },
      { name: '4x3', width: 1200, height: 900, ext: 'jpg' },
      { name: 'thumb', width: 400, height: 400, ext: 'jpg' }
    ];

    for (const format of formats) {
      const page = await browser.newPage();
      
      // Set viewport
      await page.setViewport({
        width: format.width,
        height: format.height,
        deviceScaleFactor: 1
      });

      // Visit the country page
      const url = `http://localhost:3800/${countrySlug}`;
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for the pyramid chart to render
      await page.waitForSelector('canvas', { timeout: 10000 });
      
      // Wait for Chart.js animations
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Hide everything except the pyramid
      await page.evaluate(() => {
        // Hide header, footer, nav
        const header = document.querySelector('header');
        if (header) header.style.display = 'none';
        
        const footer = document.querySelector('footer');
        if (footer) footer.style.display = 'none';
        
        const nav = document.querySelector('nav');
        if (nav) nav.style.display = 'none';
        
        // Find the pyramid container
        const canvas = document.querySelector('canvas');
        if (canvas) {
          let pyramidContainer = canvas.parentElement;
          
          while (pyramidContainer && pyramidContainer.offsetHeight < 300) {
            pyramidContainer = pyramidContainer.parentElement;
          }
          
          if (pyramidContainer) {
            // Style the container for centering
            document.body.innerHTML = '';
            document.body.style.margin = '0';
            document.body.style.padding = '40px';
            document.body.style.background = 'white';
            document.body.style.display = 'flex';
            document.body.style.flexDirection = 'column';
            document.body.style.alignItems = 'center';
            document.body.style.justifyContent = 'center';
            document.body.style.minHeight = '100vh';
            
            // Add the pyramid (no title)
            pyramidContainer.style.maxWidth = '90%';
            pyramidContainer.style.margin = '0 auto';
            
            // Add branding
            const branding = document.createElement('div');
            branding.textContent = 'PopulationPyramids.org';
            branding.style.marginTop = '30px';
            branding.style.fontSize = '24px';
            branding.style.color = '#4a5568';
            branding.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            
            document.body.appendChild(pyramidContainer);
            document.body.appendChild(branding);
          }
        }
      });

      // Wait a bit for reflow
      await new Promise(resolve => setTimeout(resolve, 500));

      // For thumbnail, scroll to center
      if (format.name === 'thumb') {
        await page.evaluate(() => {
          const canvas = document.querySelector('canvas');
          if (canvas) {
            canvas.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
          }
        });
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Take screenshot
      const outputPath = path.join(outputDir, `${countrySlug}-${format.name}.${format.ext}`);
      await page.screenshot({
        path: outputPath,
        type: format.ext === 'jpg' ? 'jpeg' : 'png',
        quality: format.ext === 'jpg' ? 90 : undefined,
        fullPage: false
      });

      await page.close();
    }

    console.log(`✓ ${countryName}: All 5 formats generated`);
    return true;

  } catch (error) {
    console.error(`✗ Error with ${countryName}:`, error.message);
    return false;
  }
}

async function processBatch(countries, batchNum) {
  console.log(`\n========== BATCH ${batchNum} ==========`);
  console.log(`Processing: ${countries.map(c => c.name).join(', ')}`);
  console.log('=====================================\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];
  
  try {
    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      console.log(`[${i + 1}/${countries.length}] Processing ${country.name}...`);
      const success = await generatePyramidImages(browser, country.slug, country.name);
      results.push({ country: country.name, success });
    }
  } finally {
    await browser.close();
  }

  // Summary for this batch
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success);
  
  console.log(`\nBatch ${batchNum} Complete:`);
  console.log(`✓ Successful: ${successful}/${countries.length}`);
  if (failed.length > 0) {
    console.log(`✗ Failed: ${failed.map(f => f.country).join(', ')}`);
  }
  
  return results;
}

// Main execution
(async () => {
  console.log('===========================================');
  console.log('   PYRAMID IMAGE GENERATION - ALL COUNTRIES');
  console.log('===========================================');
  
  // For testing, limit to first 10 countries
  const TEST_MODE = process.env.TEST_BATCH === 'true';
  const countriesToProcess = TEST_MODE ? countries.slice(0, 10) : countries;
  
  console.log(`Total countries to process: ${countriesToProcess.length}${TEST_MODE ? ' (TEST MODE - First 10 only)' : ''}`);
  console.log('Images per country: 5 formats');
  console.log(`Total images to generate: ${countriesToProcess.length * 5}`);
  console.log('-------------------------------------------\n');

  // Process in batches of 10
  const batchSize = 10;
  const allResults = [];
  
  for (let i = 0; i < countriesToProcess.length; i += batchSize) {
    const batch = countriesToProcess.slice(i, Math.min(i + batchSize, countriesToProcess.length));
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(countriesToProcess.length / batchSize);
    
    console.log(`\nProcessing batch ${batchNum} of ${totalBatches}`);
    const batchResults = await processBatch(batch, batchNum);
    allResults.push(...batchResults);
    
    // Small delay between batches to avoid overwhelming the system
    if (i + batchSize < countriesToProcess.length) {
      console.log('\nWaiting 3 seconds before next batch...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  // Final summary
  console.log('\n===========================================');
  console.log('           FINAL SUMMARY');
  console.log('===========================================');
  const totalSuccessful = allResults.filter(r => r.success).length;
  const totalFailed = allResults.filter(r => !r.success);
  
  console.log(`✓ Successfully generated: ${totalSuccessful}/${countriesToProcess.length} countries`);
  console.log(`✓ Total images created: ${totalSuccessful * 5}`);
  
  if (totalFailed.length > 0) {
    console.log(`\n✗ Failed countries (${totalFailed.length}):`);
    totalFailed.forEach(f => console.log(`  - ${f.country}`));
    console.log('\nYou can re-run the script for failed countries.');
  }
  
  console.log('\n✅ Process complete!');
  console.log('Images location: public/images/pyramids/');
})();