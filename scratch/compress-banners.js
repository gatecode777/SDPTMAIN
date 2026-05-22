const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const imagesDir = path.join(__dirname, '..', 'public', 'images');
const banners = ['pc.png', 'pc2.png', 'pc3.png'];

async function compressBanners() {
  console.log("Starting hero banners WebP conversion...");
  for (const banner of banners) {
    const inputPath = path.join(imagesDir, banner);
    const outputName = banner.replace('.png', '.webp');
    const outputPath = path.join(imagesDir, outputName);

    if (!fs.existsSync(inputPath)) {
      console.warn(`Warning: file not found at ${inputPath}`);
      continue;
    }

    try {
      const stats = fs.statSync(inputPath);
      const initialSizeKB = stats.size / 1024;
      
      console.log(`Converting ${banner} (${initialSizeKB.toFixed(1)} KB)...`);
      
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);

      const outStats = fs.statSync(outputPath);
      const finalSizeKB = outStats.size / 1024;
      
      console.log(`  => Created ${outputName} (${finalSizeKB.toFixed(1)} KB) - ${Math.round((1 - finalSizeKB / initialSizeKB) * 100)}% reduction`);
    } catch (error) {
      console.error(`  => Failed to convert ${banner}: ${error.message}`);
    }
  }
  console.log("Conversion process finished.");
}

compressBanners();
