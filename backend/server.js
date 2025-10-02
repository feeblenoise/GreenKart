
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let db;

// Attach DB to request
app.use((req, res, next) => {
  if (!db) return res.status(500).send("Database not initialized yet");
  req.db = db;
  next();
});

// Routes
app.use('/auth', authRoutes);

// Start server after DB connection
connectDB().then(database => {
  db = database;
  app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
  });
});
