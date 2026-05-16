import mongoose from "mongoose";
import User from "../src/models/User";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function check() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("MONGODB_URI is not defined in .env");
      return;
    }
    console.log("Connecting to:", uri.replace(/:([^@]+)@/, ":****@"));
    await mongoose.connect(uri);
    console.log("Connected successfully!");

    const userCount = await User.countDocuments();
    console.log("Total users:", userCount);

    const users = await User.find({});
    console.log("Users in DB count:", users.length);
    
    for (const user of users) {
      if (user.email === "admin@example.com") {
        const bcrypt = require("bcryptjs");
        const isMatch = await bcrypt.compare("admin123", user.password);
        console.log(`Password match for ${user.email} (password: admin123):`, isMatch);
      }
    }

  } catch (error) {
    console.error("Error connecting to DB:", error);
  } finally {
    await mongoose.disconnect();
  }
}

check();
