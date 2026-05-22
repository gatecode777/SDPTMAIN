require('dotenv').config();
const mongoose = require('mongoose');
const sharp = require('sharp');

// 1. Database Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in the environment or .env file.");
  process.exit(1);
}

// 2. Define Mongoose Schemas inline to avoid Next.js TS loader complexities
const ProductSchema = new mongoose.Schema({
  name: String,
  thumbnail: String,
  images: [String],
  description: String
}, { collection: 'products' });

const CategorySchema = new mongoose.Schema({
  name: String,
  image: String
}, { collection: 'categories' });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

// Helper function to compress base64 images
async function compressBase64Image(base64Str, context = "") {
  if (!base64Str || !base64Str.startsWith('data:image/')) {
    return { compressed: base64Str, changed: false }; // Not a base64 image
  }

  // Parse mime type and data
  const matches = base64Str.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return { compressed: base64Str, changed: false };
  }

  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  const initialSizeKB = buffer.length / 1024;

  // If it's already under 50KB, we can skip it to preserve original quality
  if (initialSizeKB < 50) {
    return { compressed: base64Str, changed: false };
  }

  try {
    console.log(`[COMPRESSING] ${context} - Initial size: ${initialSizeKB.toFixed(1)} KB`);
    const compressedBuffer = await sharp(buffer)
      .resize({
        width: 800,
        height: 800,
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 70 })
      .toBuffer();

    const finalSizeKB = compressedBuffer.length / 1024;
    console.log(`             => Success: ${finalSizeKB.toFixed(1)} KB (${Math.round((1 - finalSizeKB / initialSizeKB) * 100)}% reduction)`);
    
    return {
      compressed: `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`,
      changed: true
    };
  } catch (error) {
    console.error(`             => Failed: ${error.message}`);
    return { compressed: base64Str, changed: false };
  }
}

async function runMigration() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    // --- Part A: Categories Migration ---
    console.log("\n--- Starting Category Images Migration ---");
    const categories = await Category.find({});
    console.log(`Found ${categories.length} categories to process.`);
    
    let categoryUpdates = 0;
    for (const cat of categories) {
      if (cat.image) {
        const result = await compressBase64Image(cat.image, `Category "${cat.name}"`);
        if (result.changed) {
          cat.image = result.compressed;
          await cat.save();
          categoryUpdates++;
        }
      }
    }
    console.log(`Category migration complete: Updated ${categoryUpdates} categories.`);

    // --- Part B: Products Migration ---
    console.log("\n--- Starting Product Images Migration ---");
    const products = await Product.find({});
    console.log(`Found ${products.length} products to process.`);

    let productUpdates = 0;
    for (const prod of products) {
      let isChanged = false;

      // 1. Compress Thumbnail
      if (prod.thumbnail) {
        const thumbResult = await compressBase64Image(prod.thumbnail, `Product "${prod.name}" (Thumbnail)`);
        if (thumbResult.changed) {
          prod.thumbnail = thumbResult.compressed;
          isChanged = true;
        }
      }

      // 2. Compress Gallery Images
      if (prod.images && prod.images.length > 0) {
        const updatedImages = [];
        for (let i = 0; i < prod.images.length; i++) {
          const img = prod.images[i];
          const imgResult = await compressBase64Image(img, `Product "${prod.name}" (Gallery Image #${i + 1})`);
          if (imgResult.changed) {
            updatedImages.push(imgResult.compressed);
            isChanged = true;
          } else {
            updatedImages.push(img);
          }
        }
        prod.images = updatedImages;
      }

      if (isChanged) {
        await prod.save();
        productUpdates++;
      }
    }
    console.log(`Product migration complete: Updated ${productUpdates} products.`);

  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB. Migration run finished.");
  }
}

runMigration();
