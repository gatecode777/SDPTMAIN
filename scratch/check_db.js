require('dotenv').config();
const mongoose = require('mongoose');

async function check() {
  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) {
    console.error("No MONGODB_URI found");
    process.exit(1);
  }
  await mongoose.connect(dbUri);
  const users = await mongoose.connection.collection('users').find(
    { role: { $in: ["PRODUCT_MANAGER", "ADMIN", "SUB_ADMIN"] } },
    { projection: { name: 1, email: 1, role: 1, permissions: 1 } }
  ).toArray();
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
}
check();
