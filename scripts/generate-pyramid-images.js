const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function generatePyramidImages(countrySlug, countryName) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

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
      console.log(`Generating ${format.name} format (${format.width}x${format.height})...`);
      
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
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Try to find and isolate the pyramid chart
      // Hide everything except the pyramid
      await page.evaluate(() => {
        // Hide header
        const header = document.querySelector('header');
        if (header) header.style.display = 'none';
        
        // Hide footer
        const footer = document.querySelector('footer');
        if (footer) footer.style.display = 'none';
        
        // Hide navigation elements
        const nav = document.querySelector('nav');
        if (nav) nav.style.display = 'none';
        
        // Find the pyramid container
        const canvas = document.querySelector('canvas');
        if (canvas) {
          // Get the parent container of the canvas
          let pyramidContainer = canvas.parentElement;
          
          // Go up until we find a reasonable container
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
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Take screenshot
      const outputPath = path.join(outputDir, `${countrySlug}-${format.name}.${format.ext}`);
      
      // For thumbnail, scroll to center the pyramid
      if (format.name === 'thumb') {
        await page.evaluate(() => {
          const canvas = document.querySelector('canvas');
          if (canvas) {
            canvas.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
          }
        });
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      await page.screenshot({
        path: outputPath,
        type: format.ext === 'jpg' ? 'jpeg' : 'png',
        quality: format.ext === 'jpg' ? 90 : undefined,
        fullPage: false
      });

      console.log(`✓ Generated ${countrySlug}-${format.name}.${format.ext}`);
      await page.close();
    }

    console.log(`✅ All formats generated for ${countryName}`);

  } catch (error) {
    console.error(`Error generating images for ${countrySlug}:`, error);
  } finally {
    await browser.close();
  }
}

// Generate for Nigeria
(async () => {
  console.log('Starting image generation for Nigeria...');
  console.log('Make sure the dev server is running on http://localhost:3800');
  console.log('');
  
  await generatePyramidImages('nigeria', 'Nigeria');
  
  console.log('\n✅ Image generation complete!');
  console.log('\nImages saved to: public/images/pyramids/');
  console.log('\nYou can access them at:');
  console.log('- http://localhost:3800/images/pyramids/nigeria-og.png');
  console.log('- http://localhost:3800/images/pyramids/nigeria-square.png');
  console.log('- http://localhost:3800/images/pyramids/nigeria-16x9.jpg');
  console.log('- http://localhost:3800/images/pyramids/nigeria-4x3.jpg');
  console.log('- http://localhost:3800/images/pyramids/nigeria-thumb.jpg');
})();