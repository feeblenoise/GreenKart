// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const client = new MongoClient(process.env.MONGO_URI);
let db;

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        db = client.db("greenKart_db"); // your database name
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Connection failed", error);
        process.exit(1);
    }
}

// Middleware to make db accessible in routes
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Routes
app.use('/auth', authRoutes);

// Start Server
connectDB().then(() => {
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
});
