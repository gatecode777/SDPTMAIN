const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn("Could not set DNS servers", e);
}

const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from .env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env");
  process.exit(1);
}

// Minimal Schemas for cleanup
const UserSchema = new mongoose.Schema({ email: String, role: String });
const CategorySchema = new mongoose.Schema({});
const ProductSchema = new mongoose.Schema({});
const OrderSchema = new mongoose.Schema({});
const BannerSchema = new mongoose.Schema({});
const CouponSchema = new mongoose.Schema({});
const QuerySchema = new mongoose.Schema({});
const SettingsSchema = new mongoose.Schema({});

// Models
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
const Query = mongoose.models.Query || mongoose.model("Query", QuerySchema);
const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

async function clearDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    console.log("Cleaning up collections...");

    // Remove all dummy categories, products, orders, banners, coupons, queries, and settings
    const catResult = await Category.deleteMany({});
    console.log(`Deleted ${catResult.deletedCount} categories.`);

    const prodResult = await Product.deleteMany({});
    console.log(`Deleted ${prodResult.deletedCount} products.`);

    const ordResult = await Order.deleteMany({});
    console.log(`Deleted ${ordResult.deletedCount} orders.`);

    const banResult = await Banner.deleteMany({});
    console.log(`Deleted ${banResult.deletedCount} banners.`);

    const coupResult = await Coupon.deleteMany({});
    console.log(`Deleted ${coupResult.deletedCount} coupons.`);

    const queryResult = await Query.deleteMany({});
    console.log(`Deleted ${queryResult.deletedCount} queries.`);

    const settingsResult = await Settings.deleteMany({});
    console.log(`Deleted ${settingsResult.deletedCount} settings.`);

    // Remove all users except the admin@gmail.com
    const userResult = await User.deleteMany({ email: { $ne: "admin@gmail.com" } });
    console.log(`Deleted ${userResult.deletedCount} non-admin users.`);

    // Ensure the admin user exists
    const admin = await User.findOne({ email: "admin@gmail.com" });
    if (admin) {
      console.log(`Preserved admin user: ${admin.email}`);
    } else {
      console.log("Admin user was not found. Please run scratch/seed-admin.js to recreate the admin user.");
    }

    console.log("\n==========================================");
    console.log("DATABASE CLEANUP COMPLETED!");
    console.log("==========================================");

  } catch (error) {
    console.error("Error during database cleanup:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

clearDatabase();
