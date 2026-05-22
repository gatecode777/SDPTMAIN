const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn("Could not set DNS servers", e);
}

const mongoose = require('mongoose');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://balramsuman997_db_user:m0dDKqnvCA4K7TJs@cluster0.l7xeac9.mongodb.net/SDPT";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    isVisible: { type: Boolean, default: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  await Category.deleteMany({});
  console.log("Cleared existing categories");

  // Top level categories
  const topLevels = [
    { name: "Computer Components", slug: "components", description: "Internal hardware like CPU, RAM, and Motherboards", isVisible: true },
    { name: "Storage Devices", slug: "storage", description: "Internal and external storage solutions", isVisible: true },
    { name: "Input Devices", slug: "input-devices", description: "Keyboards, mice, and other input hardware", isVisible: true },
    { name: "Output Devices", slug: "output-devices", description: "Monitors, printers, and speakers", isVisible: true },
  ];

  const savedTopLevels = await Category.insertMany(topLevels);
  console.log("Seeded top-level categories");

  const componentsId = savedTopLevels.find(c => c.slug === "components")._id;
  const storageId = savedTopLevels.find(c => c.slug === "storage")._id;
  const inputId = savedTopLevels.find(c => c.slug === "input-devices")._id;

  // Subcategories
  const subCategories = [
    { name: "CPU (Processors)", slug: "cpu", parent: componentsId, isVisible: true },
    { name: "RAM (Memory)", slug: "ram", parent: componentsId, isVisible: true },
    { name: "Motherboards", slug: "motherboards", parent: componentsId, isVisible: true },
    { name: "Hard Disks (HDD/SSD)", slug: "harddisk", parent: storageId, isVisible: true },
    { name: "ROM / Optical Drives", slug: "rom", parent: storageId, isVisible: true },
    { name: "Keyboards", slug: "keyboards", parent: inputId, isVisible: true },
    { name: "Mice", slug: "mice", parent: inputId, isVisible: true },
  ];

  await Category.insertMany(subCategories);
  console.log("Seeded subcategories");

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

seed().catch(console.error);
