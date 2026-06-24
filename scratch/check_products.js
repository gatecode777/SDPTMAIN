require('dotenv').config();
const mongoose = require('mongoose');

async function check() {
  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) {
    console.error("No MONGODB_URI found");
    process.exit(1);
  }
  await mongoose.connect(dbUri);
  const products = await mongoose.connection.collection('products').find(
    { name: /Threadripper/i }
  ).toArray();
  for (const p of products) {
    console.log("Product name:", p.name);
    console.log("description:", JSON.stringify(p.description));
    console.log("shortDescription:", JSON.stringify(p.shortDescription));
    console.log("Keys:", Object.keys(p));
  }
  process.exit(0);
}
check();
