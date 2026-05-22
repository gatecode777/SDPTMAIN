const mongoose = require('mongoose');

// Standard non-SRV connection string resolved from the Atlas SRV records
const MONGODB_URI = "mongodb://balramsuman997_db_user:m0dDKqnvCA4K7TJs@ac-9hpxhmp-shard-00-00.l7xeac9.mongodb.net:27017,ac-9hpxhmp-shard-00-01.l7xeac9.mongodb.net:27017,ac-9hpxhmp-shard-00-02.l7xeac9.mongodb.net:27017/SDPT?ssl=true&replicaSet=atlas-8zvyzz-shard-0&authSource=admin";

async function test() {
  try {
    console.log("Connecting using standard mongodb:// string...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully without SRV/TXT lookups!");
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

test();
