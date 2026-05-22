const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn("Could not set DNS servers", e);
}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load environment variables from .env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env");
  process.exit(1);
}

// User Schema (matching src/models/User.ts)
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    mobileNumber: { type: String },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER", "CUSTOMER"],
      default: "CUSTOMER",
    },
    isActive: { type: Boolean, default: true },
    cart: [{
      id: { type: String, required: true },
      name: { type: String },
      price: { type: Number },
      qty: { type: Number, default: 1 },
      img: { type: String },
      category: { type: String }
    }],
    wishlist: [{ type: String }], 
    addresses: [{
      label: { type: String, default: "Home" },
      fullName: { type: String },
      phone: { type: String },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      isDefault: { type: Boolean, default: false }
    }]
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    const adminEmail = "admin@gmail.com";
    const plainPassword = "admin@123";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
      console.log("Updating password to 'admin@123' and role to 'SUPER_ADMIN'...");
      
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "SUPER_ADMIN";
      await existingAdmin.save();
      
      console.log("Admin updated successfully!");
    } else {
      console.log("Creating new dummy admin...");
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        mobileNumber: "1234567890",
        isActive: true
      });
      
      console.log("Admin user created successfully!");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seedAdmin();
