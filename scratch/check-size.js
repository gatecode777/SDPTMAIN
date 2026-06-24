const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://balramsuman997_db_user:m0dDKqnvCA4K7TJs@ac-9hpxhmp-shard-00-00.l7xeac9.mongodb.net:27017,ac-9hpxhmp-shard-00-01.l7xeac9.mongodb.net:27017,ac-9hpxhmp-shard-00-02.l7xeac9.mongodb.net:27017/SDPT?ssl=true&replicaSet=atlas-8zvyzz-shard-0&authSource=admin";

const CategorySchema = new mongoose.Schema({}, { strict: false });
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

const ProductSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
}, { strict: false });
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB!");

  const select = "name slug price mrp discountPercentage offerPrice thumbnail averageRating totalReviews category status createdAt shortDescription";
  
  const products = await Product.find({ status: "PUBLISHED" })
    .select(select)
    .populate("category", "name slug") // ONLY SELECT NAME AND SLUG
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const serialized = JSON.stringify(products);
  const sizeBytes = Buffer.byteLength(serialized, "utf8");
  console.log(`\n--- RESULTS ---`);
  console.log(`Number of products: ${products.length}`);
  console.log(`Serialized Size with optimized populate: ${sizeBytes} bytes (${(sizeBytes / 1024 / 1024).toFixed(2)} MB)`);

  if (products.length > 0) {
    // Print size of each field in the first product
    console.log(`\nSample Product field sizes in first product:`);
    for (const key of Object.keys(products[0])) {
      const valSize = Buffer.byteLength(JSON.stringify(products[0][key]), "utf8");
      console.log(`- ${key}: ${valSize} bytes`);
    }
  }

  await mongoose.disconnect();
}

run().catch(console.error);
