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
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function addUser() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    const userEmail = "user@gmail.com";
    const plainPassword = "user@123";

    // Check if user already exists
    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      console.log(`User with email ${userEmail} already exists.`);
      console.log("Updating password...");
      
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      existingUser.password = hashedPassword;
      await existingUser.save();
      
      console.log("User updated successfully!");
    } else {
      console.log("Creating new user...");
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      
      await User.create({
        name: "Test User",
        email: userEmail,
        password: hashedPassword,
        role: "CUSTOMER",
        mobileNumber: "1234567891",
        isActive: true
      });
      
      console.log("User created successfully!");
    }
  } catch (error) {
    console.error("Error adding user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

addUser();
