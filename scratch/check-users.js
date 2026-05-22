const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({}, { strict: false }));
    const users = await User.find({}, { name: 1, email: 1, role: 1, isActive: 1 });
    console.log("Users in Database:");
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error checking users:", error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUsers();
