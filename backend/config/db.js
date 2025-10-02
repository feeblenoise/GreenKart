
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  tls: true,
  serverSelectionTimeoutMS: 5000,
});

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db();
    console.log("MongoDB connected");
    return db;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

module.exports = { connectDB, client };
