const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://balramsuman997_db_user:m0dDKqnvCA4K7TJs@ac-9hpxhmp-shard-00-00.l7xeac9.mongodb.net:27017,ac-9hpxhmp-shard-00-01.l7xeac9.mongodb.net:27017,ac-9hpxhmp-shard-00-02.l7xeac9.mongodb.net:27017/SDPT?ssl=true&replicaSet=atlas-8zvyzz-shard-0&authSource=admin";

async function run() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");
  
  const UserSchema = new mongoose.Schema({}, { strict: false });
  const User = mongoose.model("User", UserSchema, "users");
  
  const users = await User.find({});
  console.log("Users in database:");
  users.forEach(u => {
    console.log(`- Name: ${u.get("name")}, Email: ${u.get("email")}, Role: ${u.get("role")}, Active: ${u.get("isActive")}`);
  });
  
  await mongoose.disconnect();
}

run().catch(console.error);
