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
  
  const product = await Product.findOne({ status: "PUBLISHED" })
    .populate("category")
    .lean();

  console.log("CATEGORY FIELD:", JSON.stringify(product.category).slice(0, 1000));
  console.log("CATEGORY KEYS:", Object.keys(product.category));
  if (product.category.parent) {
    console.log("PARENT CATEGORY:", JSON.stringify(product.category.parent).slice(0, 1000));
  }

  await mongoose.disconnect();
}

run().catch(console.error);
